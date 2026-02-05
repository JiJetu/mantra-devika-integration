import { useNavigate } from "react-router-dom";
import { IMAGES } from "../../assets";
import LoginForm from "../../components/auth/LoginForm";

export default function Login() {
  const navigate = useNavigate()

  const handleLogin = (data) => {
    console.log('Login data:', data);
    // Call your auth API here
    // e.g. await signIn(data.email, data.password)

    navigate('/' || '/dashboard')
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary px-4 lora">
      <div className="w-full max-w-xl bg-primary text-white rounded-2xl shadow-xl overflow-hidden">
        {/* Card content */}
        <div className="p-8 md:p-16">
          {/* Logo  */}
          <div className="flex items-center justify-center">
            {/* You can replace with your actual logo component or image */}
            <img className="h-[160px] w-[190px] object-cover" src={IMAGES.logo} alt="logo" />
          </div>

          <div className="text-center mb-8 lora font-light">
            <h2 className="text-2xl">Welcome Back</h2>
            <p className="mt-1.5">
              Sign in to your admin account
            </p>
          </div>

          <LoginForm onSubmit={handleLogin} />
        </div>
      </div>
    </div>
  );
}