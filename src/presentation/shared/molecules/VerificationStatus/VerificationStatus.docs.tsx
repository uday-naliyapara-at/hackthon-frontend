import React from 'react';

import { PropDef, PropsTable } from '@/presentation/features/docs/atom/PropsTable';
import { ComponentExample } from '@/presentation/features/docs/molecules/ComponentExample';

import { VerificationStatus } from './index';

// Define the props for the VerificationStatus component
const verificationStatusProps: PropDef[] = [
  {
    name: 'status',
    type: "'pending' | 'success' | 'error'",
    required: true,
    description: 'Current verification status',
  },
  {
    name: 'title',
    type: 'string',
    required: true,
    description: 'Main status message',
  },
  {
    name: 'description',
    type: 'string',
    description: 'Optional detailed message',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Optional className for styling',
  },
];

export const VerificationStatusDocs: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="prose max-w-none dark:prose-invert mb-8">
        <h2 className="text-2xl font-bold">VerificationStatus</h2>
        <p>
          The VerificationStatus component displays verification-related status messages with
          appropriate icons and styling. It's commonly used in authentication flows, email
          verification processes, or any scenario where users need to be informed about the status
          of a verification action.
        </p>
      </div>

      <PropsTable props={verificationStatusProps} />

      <ComponentExample
        name="Pending Verification"
        description="Verification status in the pending state"
        code={`<VerificationStatus
  status="pending"
  title="Verification email sent"
  description="Please check your inbox for the verification link"
/>`}
      >
        <div className="w-full max-w-md">
          <VerificationStatus
            status="pending"
            title="Verification email sent"
            description="Please check your inbox for the verification link"
          />
        </div>
      </ComponentExample>

      <ComponentExample
        name="Successful Verification"
        description="Verification status in the success state"
        code={`<VerificationStatus
  status="success"
  title="Email verified successfully"
  description="You can now access all features of your account"
/>`}
      >
        <div className="w-full max-w-md">
          <VerificationStatus
            status="success"
            title="Email verified successfully"
            description="You can now access all features of your account"
          />
        </div>
      </ComponentExample>

      <ComponentExample
        name="Failed Verification"
        description="Verification status in the error state"
        code={`<VerificationStatus
  status="error"
  title="Verification failed"
  description="The verification link has expired or is invalid"
/>`}
      >
        <div className="w-full max-w-md">
          <VerificationStatus
            status="error"
            title="Verification failed"
            description="The verification link has expired or is invalid"
          />
        </div>
      </ComponentExample>

      <ComponentExample
        name="Without Description"
        description="Verification status with only a title"
        code={`<VerificationStatus
  status="success"
  title="Email address confirmed"
/>`}
      >
        <div className="w-full max-w-md">
          <VerificationStatus status="success" title="Email address confirmed" />
        </div>
      </ComponentExample>

      <ComponentExample
        name="With Custom Styling"
        description="Verification status with custom styling"
        code={`<VerificationStatus
  status="pending"
  title="Waiting for admin approval"
  description="Your account is being reviewed by an administrator"
  className="border-2 shadow-sm"
/>`}
      >
        <div className="w-full max-w-md">
          <VerificationStatus
            status="pending"
            title="Waiting for admin approval"
            description="Your account is being reviewed by an administrator"
            className="border-2 shadow-sm"
          />
        </div>
      </ComponentExample>

      <ComponentExample
        name="In Form Context"
        description="Verification status used in a verification form"
        code={`<div className="p-6 max-w-md mx-auto bg-card rounded-xl shadow-sm border">
  <h3 className="text-lg font-medium mb-6">Email Verification</h3>
  
  <VerificationStatus
    status="pending"
    title="Verification code sent"
    description="Please check your email and enter the code below"
    className="mb-6"
  />
  
  <div className="flex gap-4 mb-4">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <input
        key={i}
        type="text"
        maxLength={1}
        className="w-10 h-10 text-center border rounded-md"
        placeholder="•"
      />
    ))}
  </div>
  
  <div className="flex justify-between items-center mt-6">
    <button className="text-sm text-primary hover:underline">
      Resend Code
    </button>
    <button className="py-2 px-4 bg-primary text-primary-foreground rounded-md">
      Verify
    </button>
  </div>
</div>`}
      >
        <div className="p-6 max-w-md mx-auto bg-card rounded-xl shadow-sm border">
          <h3 className="text-lg font-medium mb-6">Email Verification</h3>

          <VerificationStatus
            status="pending"
            title="Verification code sent"
            description="Please check your email and enter the code below"
            className="mb-6"
          />

          <div className="flex gap-4 mb-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <input
                key={i}
                type="text"
                maxLength={1}
                className="w-10 h-10 text-center border rounded-md"
                placeholder="•"
              />
            ))}
          </div>

          <div className="flex justify-between items-center mt-6">
            <button className="text-sm text-primary hover:underline">Resend Code</button>
            <button className="py-2 px-4 bg-primary text-primary-foreground rounded-md">
              Verify
            </button>
          </div>
        </div>
      </ComponentExample>

      <ComponentExample
        name="Multiple Status States"
        description="Different verification status states displayed together"
        code={`<div className="space-y-4">
  <VerificationStatus
    status="pending"
    title="Email verification in progress"
    description="Click the link in your email to verify"
  />
  <VerificationStatus
    status="success"
    title="Phone number verified"
    description="Two-factor authentication is now enabled"
  />
  <VerificationStatus
    status="error"
    title="Payment verification failed"
    description="Please update your payment information"
  />
</div>`}
      >
        <div className="w-full max-w-md space-y-4">
          <VerificationStatus
            status="pending"
            title="Email verification in progress"
            description="Click the link in your email to verify"
          />
          <VerificationStatus
            status="success"
            title="Phone number verified"
            description="Two-factor authentication is now enabled"
          />
          <VerificationStatus
            status="error"
            title="Payment verification failed"
            description="Please update your payment information"
          />
        </div>
      </ComponentExample>
    </div>
  );
};
