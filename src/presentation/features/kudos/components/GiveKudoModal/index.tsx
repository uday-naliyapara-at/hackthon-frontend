import { useState, useCallback } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import AsyncSelect from 'react-select/async';
import type { SingleValue } from 'react-select';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/presentation/shared/atoms/Button';
import { Select } from '@/presentation/shared/atoms/Select';
import { Input } from '@/presentation/shared/atoms/Input';
import { useTeams } from '@/presentation/hooks/useTeams';
import { useTeamContext } from '@/presentation/features/team/context/TeamContext';
import { useCategories } from '@/presentation/hooks/useCategories';
import { useCategoriesContext } from '@/presentation/features/categories/context/CategoriesContext';
import { Category } from '@/infrastructure/api/mock/data/categories.data';
import { useToast } from '@/components/hooks/use-toast';
import { LoadingSpinner } from '@/presentation/shared/atoms/LoadingSpinner';

const BACKEND_URL = 'https://hackathon-backend-h5uq.onrender.com';

interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    teamId: number;
}

interface ApiResponse {
    success: boolean;
    message: string;
    data: {
        users: User[];
        found: boolean;
        count: number;
    }
}

interface SelectOption {
    value: number;
    label: string;
}

// Form schema
const giveKudoSchema = z.object({
    recipientId: z.number().min(1, 'Please select a recipient'),
    teamId: z.string().min(1, 'Please select a team'),
    categoryId: z.string().min(1, 'Please select a category'),
    message: z.string().min(10, 'Message must be at least 10 characters').max(500, 'Message must be less than 500 characters'),
});

type GiveKudoFormData = z.infer<typeof giveKudoSchema>;

interface GiveKudoModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const GiveKudoModal: React.FC<GiveKudoModalProps> = ({ isOpen, onClose }) => {
    const { teamService } = useTeamContext();
    const { categoriesService } = useCategoriesContext();
    const { data: teams, isLoading: isLoadingTeams } = useTeams(teamService);
    const { data: categories, isLoading: isLoadingCategories } = useCategories(categoriesService);
    const { toast } = useToast();
    const queryClient = useQueryClient();

    // Track selected user
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [selectedOption, setSelectedOption] = useState<SelectOption | null>(null);

    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
        reset,
        watch,
    } = useForm<GiveKudoFormData>({
        resolver: zodResolver(giveKudoSchema),
    });

    // Watch the selected team to filter recipients
    const selectedTeamId = watch('teamId');

    // Load options for AsyncSelect
    const loadOptions = useCallback(async (inputValue: string): Promise<SelectOption[]> => {
        if (!inputValue.trim() || !selectedTeamId) return [];

        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch(
                `${BACKEND_URL}/api/public/auth/users/search?searchText=${encodeURIComponent(inputValue)}`,
                {
                    headers: {
                        'Authorization': `${token}`,
                    }
                }
            );

            if (!response.ok) throw new Error('Failed to search users');
            
            const result: ApiResponse = await response.json();
            
            if (!result.success || !result.data.users) {
                return [];
            }

            return result.data.users.map(user => ({
                value: user.id,
                label: `${user.firstName} ${user.lastName}`
            }));
        } catch (error) {
            console.error('Error searching users:', error);
            toast({
                title: 'Error',
                description: 'Failed to search users',
                variant: 'destructive',
            });
            return [];
        }
    }, [selectedTeamId, toast]);

    // Handle user selection
    const handleUserChange = (option: SingleValue<SelectOption>, onChange: (value: number) => void) => {
        setSelectedOption(option);
        if (option) {
            onChange(option.value);
        } else {
            onChange(0);
        }
    };

    // Submit mutation
    const submitMutation = useMutation({
        mutationFn: async (data: GiveKudoFormData) => {
            const token = localStorage.getItem('accessToken');
            const response = await fetch(`${BACKEND_URL}/api/public/kudos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                },
                body: JSON.stringify({
                    ...data,
                    recipientId: data.recipientId.toString() // Convert to string here
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to submit kudos');
            }

            return response.json();
        },
        onSuccess: () => {
            toast({
                title: 'Success',
                description: 'Kudos sent successfully!',
            });
            reset();
            setSelectedOption(null);
            onClose();
            queryClient.invalidateQueries({ queryKey: ['kudos'] });
        },
        onError: (error) => {
            toast({
                title: 'Error',
                description: error.message || 'Failed to send kudos',
                variant: 'destructive',
            });
        },
    });

    const onSubmit = async (data: GiveKudoFormData) => {
        submitMutation.mutate(data);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl">Give Kudos</DialogTitle>
                    <DialogDescription className="text-gray-600">
                        Recognize and appreciate your colleagues' contributions.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="teamId" className="text-sm font-medium text-gray-700">
                                Team
                            </label>
                            <Select
                                {...register('teamId')}
                                id="teamId"
                                error={!!errors.teamId}
                                helperText={errors.teamId?.message}
                                className="w-full"
                            >
                                <option value="">Select Team</option>
                                {teams?.map((team) => (
                                    <option key={team.id} value={team.id}>
                                        {team.name}
                                    </option>
                                ))}
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="recipientId" className="text-sm font-medium text-gray-700">
                                Recipient
                            </label>
                            <Controller
                                name="recipientId"
                                control={control}
                                render={({ field }) => (
                                    <AsyncSelect<SelectOption>
                                        {...field}
                                        inputId="recipientId"
                                        cacheOptions
                                        defaultOptions
                                        loadOptions={loadOptions}
                                        isDisabled={!selectedTeamId}
                                        placeholder="Search for a recipient..."
                                        className="react-select"
                                        classNamePrefix="react-select"
                                        onChange={(option) => handleUserChange(option, field.onChange)}
                                        value={selectedOption}
                                        noOptionsMessage={() => "Type to search users..."}
                                        loadingMessage={() => "Searching..."}
                                        isSearchable
                                        isClearable
                                        styles={{
                                            control: (base) => ({
                                                ...base,
                                                minHeight: '42px',
                                                borderColor: errors.recipientId ? 'rgb(239, 68, 68)' : '#e2e8f0',
                                                '&:hover': {
                                                    borderColor: errors.recipientId ? 'rgb(239, 68, 68)' : '#cbd5e1'
                                                }
                                            }),
                                            placeholder: (base) => ({
                                                ...base,
                                                color: '#94a3b8'
                                            })
                                        }}
                                    />
                                )}
                            />
                            {errors.recipientId && (
                                <p className="text-sm text-red-500 mt-1">{errors.recipientId.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="categoryId" className="text-sm font-medium text-gray-700">
                                Category
                            </label>
                            <Select
                                {...register('categoryId')}
                                id="categoryId"
                                error={!!errors.categoryId}
                                helperText={errors.categoryId?.message}
                                className="w-full"
                            >
                                <option value="">Select Category</option>
                                {categories?.map((category: Category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="message" className="text-sm font-medium text-gray-700">
                                Message
                            </label>
                            <textarea
                                id="message"
                                {...register('message')}
                                placeholder="Write your kudos message here..."
                                className={`min-h-[100px] w-full rounded-md border ${
                                    errors.message ? 'border-red-500' : 'border-gray-300'
                                } bg-white px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                            />
                            {errors.message && (
                                <p className="text-sm text-red-500">{errors.message.message}</p>
                            )}
                        </div>
                    </div>

                    <DialogFooter className="gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting || submitMutation.isPending}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            {isSubmitting || submitMutation.isPending ? 'Sending...' : 'Send Kudos'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}; 