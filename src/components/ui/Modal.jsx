import { useEffect, useRef } from "react";
import { X } from "lucide-react";

const Modal = ({ isOpen, onClose, title, description, children, className = "", bg }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-65 lora">
      <div
        ref={modalRef}
        className={`bg-white rounded-2xl shadow-xl max-h-[95vh] w-full max-w-4xl mx-4 md:mx-6 lg:mx-8 overflow-hidden flex flex-col ${className}`}
      >
        {/* Header with close */}
        <div className="relative px-5 pt-5 pb-0 md:px-6 lg:px-8 border-b border-gray-200">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
          {title && (
            <h2 className={`text-xl md:text-2xl font-bold text-gray-900 ${description ? "mb-0" : "mb-4"}  pr-10`}>
              {title}
            </h2>
          )}
          {description && (
            <h2 className="text-[#4A5565] mb-4 pr-10">
              {description}
            </h2>
          )}
        </div>

        {/* Scrollable content */}
        <div className="p-5 md:p-6 lg:p-8 overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;