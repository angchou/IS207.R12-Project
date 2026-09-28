import { useState } from "react";
import { Eye, EyeClosed } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-[var(--bg-surface)] p-8 border border-[var(--border-light)] shadow-[var(--shadow-sm)]">
        <div className="mb-6">
          <h1 className="text-2xl text-center font-bold text-[var(--text-primary)] tracking-tight">
            LOGIN
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">
              Email
            </label>
            <input
              type="email"
              placeholder="name@example.com"
              required
              className="w-full px-3.5 py-2 rounded-full rounded-tl border border-[var(--border-divider)] bg-[var(--bg-surface)] text-[var(--text-primary)] text-sm placeholder-[var(--text-muted)] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:border-[var(--btn-primary-default)] transition"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                Password
              </label>
              <a
                href="#forgot-password"
                className="text-xs text-[var(--text-muted)] hover:text-[var(--btn-primary-default)] transition"
              >
                Forgot your password?
              </a>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder={showPassword ? "abc123@" : "••••••••"}
                required
                className="w-full py-2 px-3.5 rounded-full rounded-tl border border-[var(--border-divider)] bg-[var(--bg-surface)] text-[var(--text-primary)] text-sm placeholder-[var(--text-muted)] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:border-[var(--btn-primary-default)] transition pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                {showPassword ? (
                  <Eye className="hover:text-[var(--btn-primary-default)] transition" />
                ) : (
                  <EyeClosed className="hover:text-[var(--btn-primary-default)] transition" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 mt-2 bg-[var(--btn-primary-default)] hover:bg-[var(--btn-primary-hover)] active:bg-[var(--btn-primary-active)] text-[var(--text-inverse)] font-bold text-sm transition cursor-pointer"
          >
            Log In
          </button>
        </form>

        <p className="text-center text-xs text-[var(--text-secondary)] mt-6">
          Don't have an account?{" "}
          <a
            href="#register"
            className="font-semibold text-[var(--btn-primary-default)] hover:underline"
          >
            Sign in now!
          </a>
        </p>
      </div>
    </div>
  );
}
