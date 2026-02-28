import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {label?: string}

const InputHome: React.FC<InputProps> = ({ ...props }) => {
  return (
    <input
      {...props}
      className="grow p-4 outline-none"
      />
  );
};

const InputAuth: React.FC<InputProps> = ({ label, ...props }) => {
  return (
    <div>
      {label && (
        <label className="block mb-1 text-sm font-medium">
          {label}
        </label>
      )}
      <input
        {...props}
        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-800"
      />
    </div>
  );
};

export {InputHome, InputAuth};