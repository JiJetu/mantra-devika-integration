const Checkbox = ({ label, error, ...props }) => {
  return (
    <div className="flex items-center gap-2.5">
      <input
        type="checkbox"
        className={`
          w-4 h-4 rounded border-[#4a3a3a] bg-[#3a2a2a] 
          text-amber-600 focus:ring-amber-500/40
        `}
        {...props}
      />
      {label && (
        <label className="text-sm text-gray-300 select-none">
          {label}
        </label>
      )}
    </div>
  );
};

export default Checkbox;