const Button = ({
  children,
  type = "button",
  variant = "primary",
  size = "default",
  disabled = false,
  className = "",
  icon: Icon,
  iconPosition = "left",
  ...props
}) => {
  const baseStyles = `
    inline-flex items-center justify-center 
    rounded-lg font-medium transition-colors
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-60 disabled:pointer-events-none
  `;

  const variants = {
    primary:
      "focus:ring-indigo-500",
    outline: "border border-gray-300 hover:bg-gray-50 focus:ring-gray-400",
  };

  const sizes = {
    default: "px-5 py-2.5",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      className={`
        ${className}
        ${baseStyles}
        ${variants[variant] || variants.primary}
        ${sizes[size] || sizes.default}
      `}
      {...props}
    >
      {Icon && iconPosition === "left" && <Icon className="mr-2" size={18} />}
      {children}
      {Icon && iconPosition === "right" && <Icon className="ml-2" size={18} />}
    </button>
  );
};

export default Button;
