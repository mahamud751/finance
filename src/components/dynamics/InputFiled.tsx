"use client";

import { ChangeEvent } from "react";

interface InputFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string | number;
  onChange: (value: string) => void;
  required?: boolean;
}

export function InputField({
  label,
  name,
  type = "text",
  value,
  onChange,
  required = false,
}: InputFieldProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div>
      <label className="block mb-1 text-black dark:text-white">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={handleChange}
        className="w-full p-2 border rounded bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-black dark:text-white focus:ring-primary-light dark:focus:ring-primary-dark"
        required={required}
      />
    </div>
  );
}
