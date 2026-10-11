
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Boxes,
  Eye,
  EyeOff,
  Mail,
  LockKeyhole,
  ArrowRight,
  CheckCircle2,
  Package,
  TrendingUp,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!form.email.trim() || !form.password) {
      setError("Please enter your email address and password.");
      return;
    }

    try {
      setLoading(true);

      await login(form.email.trim(), form.password);

      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Login failed. Please check your email and password."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{`
        .sw-login,
        .sw-login * {
          box-sizing: border-box;
        }

        .sw-login {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 0.9fr;
          background: #f5f7ff;
          color: #1d2b45;
          font-family: "Segoe UI", Arial, sans-serif;
        }

        .sw-login-main {
          display: flex;
          flex-direction: column;
          justify-content: center;
          width: 100%;
          max-width: 570px;
          margin: auto;
          padding: 42px 52px;
        }

        .sw-login-logo {
          display: inline-flex;
          align-items: center;
          align-self: flex-start;
          gap: 11px;
          margin-bottom: 42px;
          color: #172747;
          text-decoration: none;
          font-size: 24px;
          font-weight: 800;
          letter-spacing: -0.7px;
        }

        .sw-login-logo-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          color: white;
          background: linear-gradient(135deg, #315eea, #6548d9);
          border-radius: 12px;
          box-shadow: 0 7px 18px rgba(49, 94, 234, 0.2);
        }

        .sw-login-logo span span {
          color: #315eea;
        }

        .sw-login-eyebrow {
          display: inline-block;
          padding: 6px 11px;
          color: #3156c8;
          background: #e8edff;
          border: 1px solid #d5defe;
          border-radius: 7px;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 1px;
        }

        .sw-login-heading h1 {
          margin: 17px 0 10px;
          color: #172747;
          font-size: 35px;
          font-weight: 800;
          line-height: 1.25;
          letter-spacing: -1px;
        }

        .sw-login-heading p {
          margin: 0;
          color: #566581;
          font-size: 16px;
          line-height: 1.8;
        }

        .sw-login-form {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 28px;
        }

        .sw-login-form label {
          margin-top: 7px;
          color: #293b5b;
          font-size: 14px;
          font-weight: 700;
        }

        .sw-login-input {
          display: flex;
          align-items: center;
          gap: 12px;
          min-height: 53px;
          padding: 0 15px;
          color: #71809a;
          background: white;
          border: 1px solid #dce4f2;
          border-radius: 11px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .sw-login-input:focus-within {
          border-color: #5275f0;
          box-shadow: 0 0 0 3px rgba(49, 94, 234, 0.1);
        }

        .sw-login-input > svg {
          flex-shrink: 0;
        }

        .sw-login-input input {
          width: 100%;
          min-width: 0;
          padding: 14px 0;
          color: #1d2b45;
          background: transparent;
          border: none;
          outline: none;
          font-family: inherit;
          font-size: 15px;
        }

        .sw-login-input input::placeholder {
          color: #98a3b6;
        }

        .sw-login-eye {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          padding: 5px;
          color: #71809a;
          background: transparent;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .sw-login-eye:hover {
          color: #315eea;
          background: #f1f4ff;
        }

        .sw-login-error {
          padding: 12px 14px;
          color: #b42335;
          background: #fff0f1;
          border: 1px solid #ffd0d5;
          border-radius: 9px;
          font-size: 14px;
          line-height: 1.6;
        }

        .sw-login-submit {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          min-height: 53px;
          margin-top: 17px;
          color: white;
          background: linear-gradient(135deg, #315eea, #5547d9);
          border: none;
          border-radius: 11px;
          font-family: inherit;
          font-size: 15px;
          font-weight: 800;
          box-shadow: 0 8px 18px rgba(49, 94, 234, 0.18);
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .sw-login-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(49, 94, 234, 0.25);
        }

        .sw-login-submit:disabled {
          cursor: not-allowed;
          opacity: 0.7;
        }

        .sw-login-security {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 24px;
          color: #566581;
          font-size: 13px;
          text-align: center;
        }

        .sw-login-security svg {
          flex-shrink: 0;
          color: #315eea;
        }

        .sw-login-switch {
          margin: 25px 0 0;
          color: #566581;
          font-size: 14px;
          text-align: center;
        }

        .sw-login-switch a {
          color: #3156c8;
          font-weight: 800;
          text-decoration: none;
        }

        .sw-login-switch a:hover,
        .sw-login-back:hover {
          text-decoration: underline;
        }

        .sw-login-back {
          align-self: center;
          margin-top: 19px;
          color: #64738c;
          font-size: 13px;
          font-weight: 650;
          text-decoration: none;
        }

        /* Right promotional panel */

        .sw-login-side {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 100vh;
          padding: 55px 48px 30px;
          color: white;
          background:
            radial-gradient(ellipse at 85% 10%, #7187ff, transparent 40%),
            linear-gradient(145deg, #315eea, #4434b5);
        }

        .sw-login-side-content {
          max-width: 470px;
          margin: auto;
        }

        .sw-login-side-label {
          display: inline-block;
          padding: 7px 12px;
          color: white;
          background: rgba(255, 255, 255, 0.12);
          border: 1px solid rgba(255, 255, 255, 0.25);
          border-radius: 7px;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 1px;
        }

        .sw-login-side h2 {
          margin: 25px 0 17px;
          color: white;
          font-size: clamp(35px, 3.5vw, 49px);
          font-weight: 850;
          line-height: 1.2;
          letter-spacing: -1.6px;
        }

        .sw-login-side h2 span {
          color: #cbd5ff;
        }

        .sw-login-side-content > p {
          margin: 0 0 32px;
          color: #e1e7ff;
          font-size: 16px;
          line-height: 1.9;
        }

        .sw-login-benefit {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 21px;
          color: white;
          font-size: 15px;
          font-weight: 600;
        }

        .sw-login-benefit svg {
          flex-shrink: 0;
          color: #cbd5ff;
        }

        .sw-login-side-footer {
          padding-top: 30px;
          color: #e1e7ff;
          font-size: 12px;
          text-align: center;
        }

        @media (max-width: 900px) {
          .sw-login {
            grid-template-columns: 1fr;
          }

          .sw-login-main {
            max-width: 560px;
            padding: 40px 30px;
          }

          .sw-login-side {
            display: none;
          }
        }

        @media (max-width: 480px) {
          .sw-login-main {
            padding: 28px 20px;
          }

          .sw-login-logo {
            margin-bottom: 30px;
            font-size: 22px;
          }

          .sw-login-heading h1 {
            font-size: 29px;
          }

          .sw-login-heading p {
            font-size: 14px;
          }

          .sw-login-security {
            font-size: 12px;
          }
        }
      `}</style>

      <main className="sw-login">
        <section className="sw-login-main">
          <Link to="/" className="sw-login-logo">
            <span className="sw-login-logo-icon">
              <Boxes size={25} />
            </span>
            <span>
              Stock<span>Wise</span>
            </span>
          </Link>

          <div className="sw-login-heading">
            <span className="sw-login-eyebrow">WELCOME BACK</span>
            <h1>Log in to your account</h1>
            <p>
              Welcome back! Sign in to manage your inventory and keep your
              business moving.
            </p>
          </div>

          <form className="sw-login-form" onSubmit={handleSubmit}>
            {error && (
              <div className="sw-login-error" role="alert">
                {error}
              </div>
            )}

            <label htmlFor="sw-login-email">Email address</label>
            <div className="sw-login-input">
              <Mail size={20} />
              <input
                id="sw-login-email"
                type="email"
                name="email"
                placeholder="you@example.com"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <label htmlFor="sw-login-password">Password</label>
            <div className="sw-login-input">
              <LockKeyhole size={20} />
              <input
                id="sw-login-password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                autoComplete="current-password"
                value={form.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="sw-login-eye"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>

            <button
              type="submit"
              className="sw-login-submit"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Log in"}
              {!loading && <ArrowRight size={19} />}
            </button>
          </form>

          <div className="sw-login-security">
            <ShieldCheck size={18} />
            Sign in to access your inventory workspace.
          </div>

          <p className="sw-login-switch">
            Don&apos;t have an account?{" "}
            <Link to="/register">Create an account</Link>
          </p>

          <Link to="/" className="sw-login-back">
            ← Back to homepage
          </Link>
        </section>

        <aside className="sw-login-side">
          <div className="sw-login-side-content">
            <span className="sw-login-side-label">
              INVENTORY, SIMPLIFIED
            </span>

            <h2>
              Know your stock.
              <br />
              <span>Own your growth.</span>
            </h2>

            <p>
              Bring your products, stock movements, and inventory insights
              together in one clear workspace.
            </p>

            <div className="sw-login-benefit">
              <CheckCircle2 size={21} />
              <span>Track products in one place</span>
            </div>

            <div className="sw-login-benefit">
              <BellRingIcon />
              <span>Stay ahead of low-stock items</span>
            </div>

            <div className="sw-login-benefit">
              <TrendingUp size={21} />
              <span>Make confident inventory decisions</span>
            </div>

            <div className="sw-login-benefit">
              <Package size={21} />
              <span>Keep stock movements organized</span>
            </div>
          </div>

          <div className="sw-login-side-footer">
            StockWise · Inventory clarity for growing businesses.
          </div>
        </aside>
      </main>
    </>
  );
}

function BellRingIcon() {
  return <ShieldCheck size={21} />;
}
