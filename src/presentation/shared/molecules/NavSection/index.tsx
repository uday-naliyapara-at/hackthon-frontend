import { useEffect, useState } from 'react';
import { IconType } from 'react-icons';
import { MdChevronRight } from 'react-icons/md';
import { Link, To } from 'react-router-dom';

import { Icon } from '@/presentation/shared/atoms';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/presentation/shared/atoms/Collapsible';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/presentation/shared/atoms/Sidebar';

export interface NavSectionItem {
  name: string;
  icon: IconType;
  onClick?: () => void;
  'data-testid'?: string;
  to?: To;
  subItems?: Omit<NavSectionItem, 'subItems'>[];
  requiredRole?: 'Admin' | 'User';
}

export interface NavSectionProps {
  title: string;
  items: NavSectionItem[];
  isCollapsed?: boolean;
  className?: string;
}

export function NavSection({ title, items, isCollapsed = false, className }: NavSectionProps) {
  const [openSubMenus, setOpenSubMenus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (isCollapsed) {
      setOpenSubMenus({});
    }
  }, [isCollapsed]);

  return (
    <SidebarGroup className={className} data-testid="sidebar-group">
      {!isCollapsed && <SidebarGroupLabel>{title}</SidebarGroupLabel>}
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.name}
            asChild
            open={openSubMenus[item.name] || false}
            onOpenChange={(open) => setOpenSubMenus((prev) => ({ ...prev, [item.name]: open }))}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              {item.subItems ? (
                <>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip={isCollapsed ? item.name : undefined}
                      data-testid={item['data-testid']}
                    >
                      <Icon
                        icon={item.icon}
                        className="h-4 w-4"
                        data-testid={
                          item['data-testid'] ? `${item['data-testid']}-icon` : undefined
                        }
                      />
                      {!isCollapsed && <span>{item.name}</span>}
                      {!isCollapsed && (
                        <Icon
                          icon={MdChevronRight}
                          className="ml-auto h-5 w-5 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
                          data-testid={`${item['data-testid'] ? `${item['data-testid']}-chevron` : 'nav-chevron'}`}
                        />
                      )}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.subItems.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.name}>
                          {subItem.to ? (
                            <Link to={subItem.to} className="block" onClick={subItem.onClick}>
                              <SidebarMenuSubButton data-testid={subItem['data-testid']}>
                                <Icon
                                  icon={subItem.icon}
                                  className="h-4 w-4"
                                  data-testid={
                                    subItem['data-testid']
                                      ? `${subItem['data-testid']}-icon`
                                      : undefined
                                  }
                                />
                                <span>{subItem.name}</span>
                              </SidebarMenuSubButton>
                            </Link>
                          ) : (
                            <SidebarMenuSubButton
                              onClick={subItem.onClick}
                              data-testid={subItem['data-testid']}
                            >
                              <Icon
                                icon={subItem.icon}
                                className="h-4 w-4"
                                data-testid={
                                  subItem['data-testid']
                                    ? `${subItem['data-testid']}-icon`
                                    : undefined
                                }
                              />
                              <span>{subItem.name}</span>
                            </SidebarMenuSubButton>
                          )}
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </>
              ) : item.to ? (
                <Link to={item.to} className="block" onClick={item.onClick}>
                  <SidebarMenuButton
                    data-testid={item['data-testid']}
                    tooltip={isCollapsed ? item.name : undefined}
                  >
                    <Icon
                      icon={item.icon}
                      className="h-4 w-4"
                      data-testid={item['data-testid'] ? `${item['data-testid']}-icon` : undefined}
                    />
                    {!isCollapsed && <span>{item.name}</span>}
                  </SidebarMenuButton>
                </Link>
              ) : (
                <SidebarMenuButton
                  onClick={item.onClick}
                  data-testid={item['data-testid']}
                  tooltip={isCollapsed ? item.name : undefined}
                >
                  <Icon
                    icon={item.icon}
                    className="h-4 w-4"
                    data-testid={item['data-testid'] ? `${item['data-testid']}-icon` : undefined}
                  />
                  {!isCollapsed && <span>{item.name}</span>}
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
