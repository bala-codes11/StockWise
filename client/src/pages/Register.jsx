
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Boxes,
  UserRound,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  Package,
  TrendingUp,
  ShieldCheck,
  BellRing,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });

      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sw-register-page">
      <style>{`
        .sw-register-page {
          min-height: 100vh;
          display: flex;
          background: #f7f8fc;
          color: #172033;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system,
            BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        .sw-register-left {
          width: 54%;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 38px 30px;
        }

        .sw-register-content {
          width: 100%;
          max-width: 440px;
        }

        .sw-register-brand {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 34px;
          color: #172033;
          text-decoration: none;
        }

        .sw-register-brand-icon {
          width: 43px;
          height: 43px;
          display: grid;
          place-items: center;
          border-radius: 13px;
          color: white;
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          box-shadow: 0 7px 18px rgba(79, 70, 229, 0.22);
        }

        .sw-register-brand-name {
          font-size: 23px;
          font-weight: 800;
          letter-spacing: -0.8px;
        }

        .sw-register-heading {
          margin: 0 0 10px;
          font-size: clamp(28px, 3vw, 35px);
          font-weight: 800;
          letter-spacing: -1.2px;
          line-height: 1.2;
        }

        .sw-register-subtitle {
          margin: 0 0 28px;
          color: #727b8e;
          font-size: 14px;
          line-height: 1.7;
        }

        .sw-register-form {
          display: flex;
          flex-direction: column;
          gap: 17px;
        }

        .sw-register-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .sw-register-label {
          color: #30394d;
          font-size: 13px;
          font-weight: 700;
        }

        .sw-register-input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }

        .sw-register-input-icon {
          position: absolute;
          left: 14px;
          color: #929bad;
          pointer-events: none;
        }

        .sw-register-input {
          width: 100%;
          height: 48px;
          box-sizing: border-box;
          padding: 0 44px 0 43px;
          border: 1px solid #e0e5ee;
          border-radius: 10px;
          outline: none;
          background: #fff;
          color: #172033;
          font-size: 14px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .sw-register-input::placeholder {
          color: #a3abba;
        }

        .sw-register-input:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.12);
        }

        .sw-register-toggle {
          position: absolute;
          right: 12px;
          display: grid;
          place-items: center;
          padding: 5px;
          border: none;
          background: transparent;
          color: #8b94a7;
          cursor: pointer;
        }

        .sw-register-toggle:hover {
          color: #4f46e5;
        }

        .sw-register-error {
          padding: 11px 13px;
          border: 1px solid #fecaca;
          border-radius: 9px;
          background: #fef2f2;
          color: #b91c1c;
          font-size: 13px;
          line-height: 1.5;
        }

        .sw-register-submit {
          width: 100%;
          height: 49px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          margin-top: 3px;
          border: none;
          border-radius: 10px;
          background: linear-gradient(110deg, #4f46e5, #6d4aff);
          color: #fff;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 7px 17px rgba(79, 70, 229, 0.19);
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .sw-register-submit:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 10px 22px rgba(79, 70, 229, 0.27);
        }

        .sw-register-submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .sw-register-footer {
          margin: 23px 0 0;
          text-align: center;
          color: #7b8496;
          font-size: 13px;
        }

        .sw-register-footer a {
          color: #4f46e5;
          font-weight: 700;
          text-decoration: none;
        }

        .sw-register-footer a:hover {
          text-decoration: underline;
        }

        .sw-register-back {
          display: inline-block;
          margin-top: 24px;
          color: #7b8496;
          font-size: 13px;
          text-decoration: none;
        }

        .sw-register-back:hover {
          color: #4f46e5;
        }

        .sw-register-right {
          position: relative;
          width: 46%;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          padding: 48px;
          box-sizing: border-box;
          background:
            radial-gradient(
              circle at 85% 15%,
              rgba(167, 139, 250, 0.48),
              transparent 34%
            ),
            radial-gradient(
              circle at 10% 90%,
              rgba(96, 165, 250, 0.3),
              transparent 35%
            ),
            linear-gradient(145deg, #312e81, #4338ca 55%, #5b21b6);
          color: white;
        }

        .sw-register-decoration {
          position: absolute;
          width: 310px;
          height: 310px;
          top: -145px;
          right: -120px;
          border: 1px solid rgba(255, 255, 255, 0.16);
          border-radius: 50%;
          box-shadow:
            0 0 0 35px rgba(255, 255, 255, 0.035),
            0 0 0 70px rgba(255, 255, 255, 0.025);
        }

        .sw-register-promo {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 440px;
        }

        .sw-register-promo-tag {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border: 1px solid rgba(255, 255, 255, 0.22);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.09);
          color: #e0e7ff;
          font-size: 12px;
          font-weight: 600;
        }

        .sw-register-promo h2 {
          margin: 25px 0 15px;
          font-size: clamp(30px, 3.3vw, 43px);
          font-weight: 800;
          line-height: 1.16;
          letter-spacing: -1.5px;
        }

        .sw-register-promo h2 span {
          color: #c4b5fd;
        }

        .sw-register-promo-description {
          margin: 0;
          color: #e0e7ff;
          font-size: 14px;
          line-height: 1.85;
        }

        .sw-register-benefits {
          display: flex;
          flex-direction: column;
          gap: 18px;
          margin-top: 32px;
        }

        .sw-register-benefit {
          display: flex;
          align-items: flex-start;
          gap: 13px;
        }

        .sw-register-benefit-icon {
          width: 38px;
          height: 38px;
          flex-shrink: 0;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255, 255, 255, 0.17);
          border-radius: 11px;
          background: rgba(255, 255, 255, 0.1);
          color: #ddd6fe;
        }

        .sw-register-benefit h3 {
          margin: 1px 0 5px;
          font-size: 14px;
          font-weight: 700;
        }

        .sw-register-benefit p {
          margin: 0;
          color: #ddd6fe;
          font-size: 12px;
          line-height: 1.7;
        }

        .sw-register-bottom-note {
          display: flex;
          align-items: center;
          gap: 9px;
          margin-top: 38px;
          color: #ddd6fe;
          font-size: 12px;
        }

        @media (max-width: 900px) {
          .sw-register-left {
            width: 100%;
            padding: 35px 24px;
          }

          .sw-register-content {
            max-width: 460px;
          }

          .sw-register-right {
            display: none;
          }
        }

        @media (max-width: 480px) {
          .sw-register-left {
            padding: 25px 20px;
          }

          .sw-register-brand {
            margin-bottom: 27px;
          }

          .sw-register-heading {
            font-size: 29px;
          }

          .sw-register-subtitle {
            margin-bottom: 23px;
          }

          .sw-register-form {
            gap: 15px;
          }
        }
      `}</style>

      <section className="sw-register-left">
        <div className="sw-register-content">
          <Link to="/" className="sw-register-brand">
            <span className="sw-register-brand-icon">
              <Boxes size={24} />
            </span>
            <span className="sw-register-brand-name">StockWise</span>
          </Link>

          <h1 className="sw-register-heading">Create your account</h1>
          <p className="sw-register-subtitle">
            Get started with smarter inventory management.
            Create your account to continue.
          </p>

          <form className="sw-register-form" onSubmit={handleSubmit}>
            <div className="sw-register-field">
              <label className="sw-register-label" htmlFor="name">
                Full name
              </label>
              <div className="sw-register-input-wrap">
                <UserRound
                  className="sw-register-input-icon"
                  size={18}
                />
                <input
                  id="name"
                  name="name"
                  type="text"
                  className="sw-register-input"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={handleChange}
                  autoComplete="name"
                  required
                />
              </div>
            </div>

            <div className="sw-register-field">
              <label className="sw-register-label" htmlFor="email">
                Email address
              </label>
              <div className="sw-register-input-wrap">
                <Mail
                  className="sw-register-input-icon"
                  size={18}
                />
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="sw-register-input"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="sw-register-field">
              <label className="sw-register-label" htmlFor="password">
                Password
              </label>
              <div className="sw-register-input-wrap">
                <LockKeyhole
                  className="sw-register-input-icon"
                  size={18}
                />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className="sw-register-input"
                  placeholder="At least 8 characters"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  minLength={8}
                  required
                />
                <button
                  type="button"
                  className="sw-register-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="sw-register-field">
              <label
                className="sw-register-label"
                htmlFor="confirmPassword"
              >
                Confirm password
              </label>
              <div className="sw-register-input-wrap">
                <LockKeyhole
                  className="sw-register-input-icon"
                  size={18}
                />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  className="sw-register-input"
                  placeholder="Re-enter your password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="sw-register-toggle"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="sw-register-error" role="alert">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="sw-register-submit"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create account"}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <p className="sw-register-footer">
            Already have an account?{" "}
            <Link to="/login">Sign in</Link>
          </p>

          <Link to="/" className="sw-register-back">
            ← Back to homepage
          </Link>
        </div>
      </section>

      <aside className="sw-register-right">
        <div className="sw-register-decoration" />

        <div className="sw-register-promo">
          <div className="sw-register-promo-tag">
            <CheckCircle2 size={15} />
            Your inventory, under control
          </div>

          <h2>
            Start managing
            <br />
            smarter with
            <br />
            <span>StockWise.</span>
          </h2>

          <p className="sw-register-promo-description">
            Bring your inventory, stock movements, and business
            insights together in one simple workspace.
          </p>

          <div className="sw-register-benefits">
            <div className="sw-register-benefit">
              <div className="sw-register-benefit-icon">
                <Package size={20} />
              </div>
              <div>
                <h3>Organize your products</h3>
                <p>Keep product information organized in one place.</p>
              </div>
            </div>

            <div className="sw-register-benefit">
              <div className="sw-register-benefit-icon">
                <TrendingUp size={20} />
              </div>
              <div>
                <h3>Track stock movements</h3>
                <p>Keep an eye on incoming and outgoing inventory.</p>
              </div>
            </div>

            <div className="sw-register-benefit">
              <div className="sw-register-benefit-icon">
                <BellRing size={20} />
              </div>
              <div>
                <h3>Stay informed</h3>
                <p>Build a clearer picture of your inventory activity.</p>
              </div>
            </div>
          </div>

          <div className="sw-register-bottom-note">
            <ShieldCheck size={17} />
            Secure account access with authentication
          </div>
        </div>
      </aside>
    </div>
  );
}
