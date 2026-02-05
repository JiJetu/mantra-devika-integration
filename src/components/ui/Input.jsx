import { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Input = forwardRef(({
  label,
  type = 'text',
  placeholder = '',
  icon: Icon,
  error,
  className = '',
  containerClassName = '',
  labelClassName = '',
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === 'password';

  return (
    <div className={`space-y-1.5 ${containerClassName}`}>
      {label && (
        <label className={`block text-sm font-medium ${labelClassName}`}>
          {label}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white">
            <Icon size={18} />
          </div>
        )}

        <input
          ref={ref}
          type={isPassword && showPassword ? 'text' : type}
          placeholder={placeholder}
          className={`
            w-full rounded-lg border border-secondary 
            px-3 py-2.5 text-sm 
            focus:outline-none focus:ring-1 focus:ring-offset-1
            disabled:opacity-60 disabled:cursor-not-allowed
            ${Icon ? 'pl-10' : 'pl-3'}
            ${isPassword ? 'pr-10' : 'pr-3'}
            ${error ? 'border-red-500 focus:ring-red-200' : 'focus:border-indigo-500 focus:ring-indigo-200'}
            ${className}
          `}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-600 mt-1">{error.message || error}</p>
      )}
    </div>
  );
});

export default Input;