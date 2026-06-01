"use client";

interface SwitchProps {
  isActive: boolean;
  onToggle: () => void;
}

export default function Switch({ isActive, onToggle }: SwitchProps) {
  return (
    <div className="flex justify-center">
      <button
        onClick={onToggle}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none
          ${isActive ? "bg-primary" : "bg-gray-300"}
        `}
        aria-checked={isActive}
        role="switch"
      >
        <span
          className={`
            inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300
            ${isActive ? "translate-x-6" : "translate-x-1"}
          `}
        />
      </button>
    </div>
  );
}