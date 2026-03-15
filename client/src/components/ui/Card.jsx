import React from 'react';

const Card = ({
  children,
  className = '',
  padding = 'p-5 sm:p-6',
  as: Tag = 'div',
}) => (
  <Tag
    className={[
      'relative overflow-hidden rounded-2xl',
      'bg-(--color-background-primary)',
      'border-[.5px] border-(--color-border-tertiary)',
      // Subtle top-edge shine
      'before:absolute before:inset-x-0 before:top-0 before:h-px',
      'before:bg-linear-to-r before:from-transparent before:via-(--color-border-secondary) before:to-transparent',
      padding,
      className,
    ].join(' ')}
  >
    {children}
  </Tag>
);

Card.Header = ({ title, subtitle, action }) => (
  <div className="flex items-start justify-between mb-5">
    <div>
      <h3 className="text-[15px] font-semibold text-(--color-text-primary) leading-snug">
        {title}
      </h3>
      {subtitle && (
        <p className="text-[13px] text-(--color-text-secondary) mt-0.5 leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
    {action && <div className="ml-4 shrink-0">{action}</div>}
  </div>
);

Card.Divider = () => (
  <div className="h-px -mx-5 sm:-mx-6 my-4 bg-(--color-border-tertiary)" />
);

Card.Footer = ({ children }) => (
  <div className="-mx-5 sm:-mx-6 -mb-5 sm:-mb-6 mt-4 px-5 sm:px-6 py-3.5
                  bg-(--color-background-secondary)
                  border-t border-[.5px] border-(--color-border-tertiary)">
    {children}
  </div>
);

export default Card;