const CustomSelect = ({
  label,
  name,
  options = [],
  placeholder = "Select an option",
  register,
  error,
  className = "",
  selectClassName = "",
  disabled = false,
  ...rest
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-gray-700 font-medium mb-1.5">
          {label}
        </label>
      )}

      <div className="relative">
        <select
          {...(register ? register(name) : {})}
          disabled={disabled}
          className={`
            w-full px-4 py-3 pr-10
            border border-gray-300 rounded-lg bg-white
            text-gray-900 cursor-pointer
            focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30
            disabled:opacity-60 disabled:cursor-not-allowed
            appearance-none
            ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500/30" : ""}
            ${selectClassName}
          `}
          {...rest}
        >
          {/* <option value="" disabled>
            {placeholder}
          </option> */}
          {!rest.multiple && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}

          {options.map((opt) => {
            const value = typeof opt === "object" ? opt.value : opt;
            const labelText = typeof opt === "object" ? opt.label : opt;
            return (
              <option key={value} value={value}>
                {labelText}
              </option>
            );
          })}
        </select>

        {/* Custom arrow – always visible, clean chevron */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
          <svg
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.04 1.08l-4.25 4.25a.75.75 0 01-1.04 0L5.21 8.31a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>

      {error && <p className="mt-1.5 text-sm text-red-600">{error.message}</p>}
    </div>
  );
};

export default CustomSelect;
