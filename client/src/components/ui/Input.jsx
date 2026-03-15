import React, { useId } from 'react';

const Input = ({
  label,
  hint,
  error,
  icon,
  size = 'md',         // 'sm' | 'md' | 'lg'
  className = '',
  ...props
}) => {
  const id = useId();

  const heights = { sm: 'h-9 text-[13px]', md: 'h-[42px] text-sm', lg: 'h-12 text-[15px]' };

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-[13px] font-medium text-(--color-text-primary) select-none">
          {label}
        </label>
      )}

      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-(--color-text-secondary)
                           pointer-events-none transition-colors duration-150
                           [&:has(~input:focus)]:text-indigo-500">
            {icon}
          </span>
        )}

        <input
          id={id}
          {...props}
          className={[
            'w-full rounded-[10px] bg-(--color-background-primary)',
            'border-[.5px] border(--color-border-secondary)',
            'px-3.5 text(--color-text-primary)',
            'placeholder:text-(--color-text-tertiary)',
            'outline-none transition-[border-color,box-shadow] duration-150',
            'hover:border-(--color-border-primary)',
            'focus:border-indigo-500 focus:shadow-[0_0_0_3px_rgba(99,102,241,.12)]',
            'disabled:opacity-55 disabled:cursor-not-allowed disabled:bg-(--color-background-secondary)',
            error
              ? 'border-red-400 focus:border-red-400 focus:shadow-[0_0_0_3px_rgba(239,68,68,.1)]'
              : '',
            icon ? 'pl-9.5' : '',
            heights[size] ?? heights.md,
            className,
          ].filter(Boolean).join(' ')}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        />
      </div>

      {hint && !error && (
        <p id={`${id}-hint`} className="text-xs text-(--color-text-secondary)">{hint}</p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert"
           className="flex items-center gap-1.5 text-xs font-medium text-red-500">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <circle cx="6" cy="6" r="5.5" stroke="currentColor"/>
            <path d="M6 4v3M6 8.5v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;