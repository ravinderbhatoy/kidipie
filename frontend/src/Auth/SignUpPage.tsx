import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import GoogleIcon from "../components/GoogleIcon";
import { signUpUser } from "../api/axios";

export interface SignUpFormData {
  full_name: string;
  username: string;
  age: number | "";
  email: string;
  password: string;
}


export interface SignUpPageProps {
  onSubmit?: (data: SignUpFormData) => void;
  onGoogleSignUp?: () => void;
}

export function SignUpPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SignUpFormData>({
    full_name: "",
    username: "",
    age: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      age: Number(formData.age),   // convert string → number
    };
    console.log(payload);
    await signUpUser(payload);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[var(--bg-app)] flex flex-col justify-center items-center px-4 py-8 sm:py-12 selection:bg-[var(--primary)]/20 selection:text-[var(--primary)] font-sans">
      {/* Main Card */}
      <div className="w-full max-w-[440px] bg-[var(--bg-card)] rounded-[32px] shadow-[0_20px_60px_rgba(93,57,223,0.07)] overflow-hidden relative border border-[var(--border-subtle)]">
        {/* Top Accent Gradient Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[var(--primary)] via-purple-500 via-[var(--accent-yellow)] to-emerald-500" />

        <div className="px-6 py-8 sm:px-10 sm:py-10">
          {/* Logo & Header */}
          <div className="text-center mb-6">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--primary)] tracking-tight mb-3">
              KidiPie
            </h1>
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-main)] mb-1">
              Sign up for KidiPie
            </h2>
            <p className="text-sm font-medium text-[var(--text-muted)]">
              Join the fun zone!
            </p>
          </div>

          {/* Google Sign Up Button */}
          <button
            type="button"
            id="google-signup-btn"
            className="w-full py-3 px-4 bg-[var(--bg-card)] hover:bg-[var(--bg-app)] active:scale-[0.99] border border-[var(--border-medium)] rounded-full flex items-center justify-center gap-3 text-sm font-bold text-[var(--text-main)] transition-all duration-150 shadow-sm cursor-pointer"
          >
            <GoogleIcon className="w-5 h-5 shrink-0" />
            <span>Sign up with Google</span>
          </button>

          {/* Divider */}
          <div className="relative flex py-4 items-center">
            <div className="grow border-t border-[var(--border-subtle)]" />
            <span className="shrink mx-4 text-xs font-semibold text-[var(--text-muted)] lowercase">
              or
            </span>
            <div className="grow border-t border-[var(--border-subtle)]" />
          </div>

          {/* Sign Up Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Full Name */}
            <div>
              <input
                id="signup-full_name"
                type="text"
                name="full_name"
                required
                value={formData.full_name}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full px-4 py-3 bg-transparent border border-[var(--border-medium)] rounded-xl text-sm font-medium text-[var(--text-main)] placeholder:[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/15 transition duration-150"
              />
            </div>

            {/* Username */}
            <div>
              <input
                id="signup-username"
                type="text"
                name="username"
                required
                value={formData.username}
                onChange={handleChange}
                placeholder="Username"
                className="w-full px-4 py-3 bg-transparent border border-[var(--border-medium)] rounded-xl text-sm font-medium text-[var(--text-main)] placeholder:[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/15 transition duration-150"
              />
            </div>

            {/* Age */}
            <div>
              <input
                id="signup-age"
                type="number"
                name="age"
                min="1"
                max="120"
                required
                value={formData.age}
                onChange={handleChange}
                placeholder="Age"
                className="w-full px-4 py-3 bg-transparent border border-[var(--border-medium)] rounded-xl text-sm font-medium text-[var(--text-main)] placeholder:[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/15 transition duration-150"
              />
            </div>

            {/* Email */}
            <div>
              <input
                id="signup-email"
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full px-4 py-3 bg-transparent border border-[var(--border-medium)] rounded-xl text-sm font-medium text-[var(--text-main)] placeholder:[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/15 transition duration-150"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <input
                id="signup-password"
                type={showPassword ? "text" : "password"}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full pl-4 pr-11 py-3 bg-transparent border border-[var(--border-medium)] rounded-xl text-sm font-medium text-[var(--text-main)] placeholder:[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/15 transition duration-150"
              />
              <button
                type="button"
                id="toggle-signup-password"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" strokeWidth={1.8} />
                ) : (
                  <Eye className="w-4 h-4" strokeWidth={1.8} />
                )}
              </button>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                id="signup-submit-btn"
                type="submit"
                className="w-full py-3.5 px-6 bg-[var(--primary)] hover:bg-[var(--primary-hover)] active:scale-[0.99] text-white font-bold rounded-full shadow-[0_4px_16px_rgba(93,57,223,0.35)] transition-all duration-150 text-sm tracking-wide flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Create account</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </form>

          {/* Switch to Login Link */}
          <div className="mt-5 text-center">
            <p className="text-sm font-medium text-[var(--text-main)]">
              Already have an account?{" "}
              <Link
                to="/login"
                id="switch-to-login-link"
                className="font-bold text-[var(--primary)] hover:underline cursor-pointer ml-0.5"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-8 text-center text-xs font-semibold text-[var(--text-muted)] tracking-normal">
        © 2026 KidiPie - Play Safe, Create More!
      </footer>
    </div>
  );
}

export default SignUpPage;
