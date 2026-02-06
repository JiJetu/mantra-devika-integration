import { useNavigate } from "react-router-dom";
import { IMAGES } from "../../assets";
import LoginForm from "../../components/auth/LoginForm";
import { useLoginMutation } from "../../redux/features/auth/auth.api";
import { toast } from "sonner";

export default function Login() {
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();

  const handleLogin = async (data) => {
    const { email, password } = data;
    try {
      await login({ email, password }).unwrap();
      toast.success("Signed in successfully");
      navigate("/");
    } catch (e) {
      let msg =
        e?.data?.message ||
        e?.data?.detail ||
        e?.error ||
        "Invalid email or password";
      if (
        e?.status &&
        (e.status === 400 || e.status === 401 || e.status === 403)
      ) {
        msg = msg || "Invalid credentials";
      }
      if (
        e?.data &&
        typeof e.data === "object" &&
        "email" in e.data &&
        "password" in e.data
      ) {
        msg = "Invalid email or password";
      }
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary px-4 lora">
      <div className="w-full max-w-xl bg-primary text-white rounded-2xl shadow-xl overflow-hidden">
        {/* Card content */}
        <div className="p-8 md:p-16">
          {/* Logo  */}
          <div className="flex items-center justify-center">
            {/* You can replace with your actual logo component or image */}
            <img
              className="h-[160px] w-[190px] object-cover"
              src={IMAGES.logo}
              alt="logo"
            />
          </div>

          <div className="text-center mb-8 lora font-light">
            <h2 className="text-2xl">Welcome Back</h2>
            <p className="mt-1.5">Sign in to your admin account</p>
          </div>

          <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
