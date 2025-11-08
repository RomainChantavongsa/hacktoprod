import React from 'react';

export default function Button({ children, variant = 'solid', size = 'md', onClick }) {
  const base = 'inline-flex items-center justify-center rounded-md font-medium transition';
  const sizes = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
  };
  const variants = {
    solid: 'bg-primary-600 text-white hover:bg-primary-700',
    outline: 'border border-gray-200 text-gray-700 bg-white hover:bg-gray-50',
  };

  const cls = `${base} ${sizes[size] || sizes.md} ${variants[variant] || variants.solid}`;

  return (
    <button className={cls} onClick={onClick}>
      {children}
    </button>
  );
}
