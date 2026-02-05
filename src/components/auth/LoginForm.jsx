import { useForm } from "react-hook-form";
import { Mail, Lock } from "lucide-react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../../lib/validation/authSchema";
import { FaArrowRightToBracket } from "react-icons/fa6";

export default function LoginForm({ onSubmit }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
    mode: "onChange",
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 lora">
      <Input
        label="Email Address"
        type="email"
        containerClassName="lora"
        className="bg-transparent rounded-xl"
        placeholder="admin@maantra.com"
        icon={Mail}
        error={errors.email}
        {...register("email")}
      />

      <Input
        label="Password"
        type="password"
        placeholder="Enter your password"
        containerClassName="lora"
        className="bg-transparent rounded-xl"
        icon={Lock}
        error={errors.password}
        {...register("password")}
      />

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          {/* Custom styled checkbox */}
          <div className="relative inline-flex items-center">
            <input
              type="checkbox"
              className={`
          peer h-4 w-4 
          appearance-none rounded 
          border border-white/70 
          bg-transparent 
          checked:bg-white 
          checked:border-white 
          focus:outline-none 
          focus:ring-2 focus:ring-white/30 focus:ring-offset-1 focus:ring-offset-transparent
          transition-colors duration-150
          cursor-pointer
        `}
              {...register("remember")}
            />
            {/* Checkmark - only visible when checked */}
            <svg
              className={`
          absolute inset-0 m-auto h-3 w-3 
          pointer-events-none 
          text-[#7f1d1d] opacity-0 
          peer-checked:opacity-100 
          transition-opacity duration-150
        `}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <span className="text-white/90">Remember me</span>
        </label>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        icon={FaArrowRightToBracket}
        iconPosition="left"
        className="w-full text-primary bg-secondary"
      >
        {isSubmitting ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  );
}
