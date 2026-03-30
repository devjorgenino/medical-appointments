import React from 'react';

interface SelectProps {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
  required?: boolean;
  className?: string;
}

const Select: React.FC<SelectProps> = ({ id, value, onChange, children, required, className = '' }) => (
  <select
    id={id}
    value={value}
    onChange={onChange}
    required={required}
    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${className}`}
  >
    {children}
  </select>
);

export default Select;