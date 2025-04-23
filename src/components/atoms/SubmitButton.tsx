"use client";

interface SubmitButtonProps {
  label: string;
  isLoading?: boolean;
}

export function SubmitButton({ label, isLoading = false }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className="w-1/5 p-2 bg-amber-800 dark:bg-primary-dark text-white rounded hover:bg-amber-900 dark:hover:bg-blue-600 transition-colors disabled:opacity-50"
    >
      {isLoading ? "Saving..." : label}
    </button>
  );
}
