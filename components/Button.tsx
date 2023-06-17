'use client';

import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, disabled, type = 'button', ...props }, ref) => (
    <button
      className={twMerge(
        `w-full rounded-full bg-green-500 px-3 py-3 disabled:cursor-not-allowed disabled:opacity-50 text-black font-bold hover:opacity-75 transition`,
        className
      )}
      ref={ref}
      disabled={disabled}
      type={type}
      {...props}
    >
      {children}
    </button>
  )
);

Button.displayName = 'button';

export default Button;
