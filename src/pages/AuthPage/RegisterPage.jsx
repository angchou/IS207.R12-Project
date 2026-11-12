import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeClosed } from "lucide-react";
import { registerApi } from "../../api/authApi";
import { useAuthStore } from "../../store/useAuthStore";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showReenterPassword, setShowReenterPassword] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // 1. Kiểm tra mật khẩu nhập lại ở Client trước khi gọi API
    if (formData.password !== formData.password_confirmation) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      // 2. Gọi API Register
      const data = await registerApi(formData);
      const { access_token, user } = data;

      // 3. Lưu Auth State vào Zustand
      setAuth(user, access_token);

      // 4. Đăng ký xong chuyển hướng thẳng về trang chủ Customer
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-[var(--bg-surface)] p-8 border border-[var(--border-light)] shadow-[var(--shadow-sm)]">
        <div className="mb-6">
          <h1 className="text-2xl text-center font-bold text-[var(--text-primary)] tracking-tight">
            REGISTER
          </h1>
        </div>

        {/* Thông báo lỗi */}
        {error && (
          <div className="mb-4 p-3 text-xs rounded border border-red-300 bg-red-50 text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">
              Username
            </label>
            <input
              type="text"
              name="username"
              placeholder="johnpersona"
              required
              value={formData.username}
              onChange={handleChange}
              className="w-full px-3.5 py-2 rounded-full rounded-tl border border-[var(--border-divider)] bg-[var(--bg-surface)] text-[var(--text-primary)] text-sm placeholder-[var(--text-muted)] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:border-[var(--btn-primary-default)] transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3.5 py-2 rounded-full rounded-tl border border-[var(--border-divider)] bg-[var(--bg-surface)] text-[var(--text-primary)] text-sm placeholder-[var(--text-muted)] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:border-[var(--btn-primary-default)] transition"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                Password
              </label>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder={showPassword ? "abc123@" : "••••••••"}
                required
                value={formData.password}
                onChange={handleChange}
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

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                Password Confirmation
              </label>
            </div>
            <div className="relative">
              <input
                type={showReenterPassword ? "text" : "password"}
                name="password_confirmation"
                placeholder={showReenterPassword ? "abc123@" : "••••••••"}
                required
                value={formData.password_confirmation}
                onChange={handleChange}
                className="w-full py-2 px-3.5 rounded-full rounded-tl border border-[var(--border-divider)] bg-[var(--bg-surface)] text-[var(--text-primary)] text-sm placeholder-[var(--text-muted)] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:border-[var(--btn-primary-default)] transition pr-10"
              />
              <button
                type="button"
                onClick={() => setShowReenterPassword(!showReenterPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                {showReenterPassword ? (
                  <Eye className="hover:text-[var(--btn-primary-default)] transition" />
                ) : (
                  <EyeClosed className="hover:text-[var(--btn-primary-default)] transition" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 mt-2 bg-[var(--btn-primary-default)] hover:bg-[var(--btn-primary-hover)] active:bg-[var(--btn-primary-active)] text-[var(--text-inverse)] font-bold text-sm transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-xs text-[var(--text-secondary)] mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-[var(--btn-primary-default)] hover:underline"
          >
            Log in now!
          </Link>
        </p>
      </div>
    </div>
  );
}
