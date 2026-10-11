import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

/* ------------------------------------------------------------------ */
/*  Styles (same design tokens as the Products and Transactions pages) */
/* ------------------------------------------------------------------ */
const dashboardStyles = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700&family=Instrument+Sans:wght@400;500;600;700&display=swap');

.db-page{
  --bg:#f3f4f7; --surface:#fff; --ink:#12151c; --ink-2:#3b4252; --muted:#6c7587; --faint:#9aa2b1;
  --line:#e5e8ee; --line-2:#eef0f4; --accent:#3a4cde; --accent-2:#2f3fc2; --accent-soft:#eceefe;
  --ok:#0c8a60; --ok-soft:#e5f6ee; --warn:#b86a00; --warn-soft:#fff3dc; --warn-bar:#e29a1c; --bad:#d03a4b; --bad-soft:#fdeaec;
  --font:'Instrument Sans',system-ui,-apple-system,'Segoe UI',sans-serif;
  --display:'Bricolage Grotesque','Instrument Sans',system-ui,sans-serif;
  min-height:100vh;background:var(--bg);color:var(--ink);font-family:var(--font);-webkit-font-smoothing:antialiased;
}
.db-page *,.db-page *::before,.db-page *::after{box-sizing:border-box}
.db-page button,.db-page input{font-family:var(--font)}
.db-page :focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.db-num{font-variant-numeric:tabular-nums}

.db-nav{position:sticky;top:0;z-index:20;background:#ffffffd9;backdrop-filter:saturate(1.4) blur(10px);border-bottom:1px solid var(--line)}
.db-nav-inner{max-width:1280px;margin:0 auto;padding:12px 32px;display:flex;align-items:center;justify-content:space-between;gap:16px}
.db-brand{display:flex;align-items:center;gap:11px}
.db-logo{width:34px;height:34px;border-radius:10px;background:var(--ink);color:#fff;display:grid;place-items:center;font-family:var(--display);font-weight:700;font-size:17px}
.db-brand-name{font-family:var(--display);font-weight:700;font-size:17px;letter-spacing:-.3px;line-height:1.1}
.db-brand-sub{font-size:12px;color:var(--muted);margin-top:2px}
.db-links{display:flex;gap:4px}
.db-link{display:inline-flex;align-items:center;gap:6px;color:var(--ink-2);text-decoration:none;font-size:13px;font-weight:600;padding:8px 12px;border-radius:9px;transition:background .15s}
.db-link:hover{background:var(--line-2)}
.db-link.on{background:var(--ink);color:#fff}

.db-container{max-width:1280px;margin:0 auto;padding:36px 32px 48px}
.db-heading{display:flex;justify-content:space-between;align-items:flex-end;gap:20px;flex-wrap:wrap;margin-bottom:28px}
.db-heading h1{margin:0;font-family:var(--display);font-size:40px;line-height:1.05;font-weight:700;letter-spacing:-1.4px}
.db-heading p{margin:10px 0 0;color:var(--muted);font-size:15px;line-height:1.5;max-width:480px}
.db-actions{display:flex;gap:10px;flex-wrap:wrap}

.db-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:42px;padding:0 16px;border-radius:11px;border:1px solid transparent;font-size:14px;font-weight:600;cursor:pointer;text-decoration:none;transition:background .15s,border-color .15s}
.db-btn:disabled{opacity:.55;cursor:wait}
.db-primary{background:var(--accent);color:#fff;box-shadow:0 1px 2px #3a4cde40,inset 0 1px 0 #ffffff26}
.db-primary:hover:not(:disabled){background:var(--accent-2)}
.db-secondary{background:var(--surface);border-color:var(--line);color:var(--ink-2)}
.db-secondary:hover:not(:disabled){border-color:#cfd4de;background:#fafbfc}
.db-icon-btn{width:42px;padding:0}

.db-error{display:flex;align-items:center;gap:12px;margin-bottom:20px;padding:13px 15px;border:1px solid #f6c9ce;border-radius:12px;background:var(--bad-soft);color:#a62b3a;font-size:14px;line-height:1.5}
.db-error>div{flex:1;min-width:0;overflow-wrap:anywhere}
.db-error strong{font-weight:700}
.db-error p{margin:2px 0 0}
.db-error button{flex-shrink:0;min-height:36px;padding:0 13px;border:1px solid #f1b8be;border-radius:9px;background:#fff;color:#a62b3a;font-size:13px;font-weight:600;cursor:pointer}

.db-stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));background:var(--surface);border:1px solid var(--line);border-radius:18px;margin-bottom:22px}
.db-stat{padding:22px 24px;min-width:0;border-left:1px solid var(--line-2)}
.db-stat:first-child{border-left:0}
.db-stat-label{display:flex;align-items:center;gap:8px;color:var(--muted);font-size:13px;font-weight:500}
.db-dot{width:8px;height:8px;border-radius:50%;background:var(--faint)}
.db-dot.acc{background:var(--accent)} .db-dot.ok{background:var(--ok)} .db-dot.warn{background:var(--warn-bar)} .db-dot.bad{background:var(--bad)}
.db-stat-value{margin:12px 0 0;font-family:var(--display);font-size:34px;font-weight:700;letter-spacing:-1.2px;line-height:1;overflow-wrap:anywhere}
.db-stat-value.sm{font-size:28px}
.db-stat-note{margin-top:9px;font-size:12.5px;color:var(--faint);line-height:1.4}

.db-panel{background:var(--surface);border:1px solid var(--line);border-radius:18px;overflow:hidden;min-width:0}
.db-panel-head{display:flex;align-items:flex-start;justify-content:space-between;gap:14px;padding:20px 22px 16px}
.db-panel-head h2{margin:0;font-family:var(--display);font-size:20px;letter-spacing:-.5px}
.db-panel-head p{margin:6px 0 0;color:var(--muted);font-size:13.5px;line-height:1.5}
.db-more{display:inline-flex;align-items:center;gap:6px;flex-shrink:0;color:var(--accent);font-size:13px;font-weight:600;text-decoration:none;padding:6px 0}
.db-more:hover{color:var(--accent-2)}

/* stock health */
.db-health{margin-bottom:22px}
.db-health-body{padding:0 22px 22px}
.db-health-bar{display:flex;gap:3px;height:12px}
.db-health-bar i{display:block;height:100%;border-radius:99px;min-width:0}
.db-health-bar .ok{background:var(--ok)} .db-health-bar .low{background:var(--warn-bar)} .db-health-bar .out{background:var(--bad)}
.db-health-bar .none{background:var(--line-2);flex:1}
.db-legend{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;margin-top:18px}
.db-legend-item{display:flex;gap:10px;align-items:flex-start}
.db-legend-item .db-dot{margin-top:7px}
.db-legend-item b{display:block;font-family:var(--display);font-size:22px;letter-spacing:-.5px;line-height:1.1}
.db-legend-item span{display:block;margin-top:3px;color:var(--muted);font-size:13px}

.db-grid{display:grid;grid-template-columns:minmax(0,1.6fr) minmax(320px,1fr);gap:22px;align-items:start}

/* movement list */
.db-row{display:flex;align-items:center;gap:12px;padding:14px 22px;border-top:1px solid var(--line-2)}
.db-row:hover{background:#fafbfd}
.db-avatar{width:38px;height:38px;border-radius:11px;flex-shrink:0;display:grid;place-items:center;font-family:var(--display);font-weight:700;font-size:15px;background:var(--bg);color:var(--ink-2);border:1px solid var(--line)}
.db-row-main{flex:1;min-width:0}
.db-row-name{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--ink);font-size:14px;font-weight:600}
.db-row-sub{display:block;margin-top:3px;color:var(--faint);font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.db-chip{display:inline-flex;align-items:center;gap:6px;padding:5px 10px 5px 8px;border-radius:99px;font-size:12.5px;font-weight:600;white-space:nowrap}
.db-chip.in{background:var(--ok-soft);color:var(--ok)}
.db-chip.out{background:var(--bad-soft);color:var(--bad)}
.db-row-qty{min-width:64px;text-align:right;font-size:15px;font-weight:700;white-space:nowrap}
.db-qty-in{color:var(--ok)} .db-qty-out{color:var(--bad)}

/* alerts */
.db-alert-qty{flex-shrink:0;text-align:right}
.db-alert-qty b{display:block;font-size:16px;font-weight:700}
.db-alert-qty small{color:var(--faint);font-size:12px}
.db-alert-qty.low b{color:var(--warn)} .db-alert-qty.out b{color:var(--bad)}
.db-bar{height:4px;margin-top:8px;border-radius:99px;background:var(--line-2);overflow:hidden}
.db-bar i{display:block;height:100%;border-radius:99px}
.db-bar .low{background:var(--warn-bar)} .db-bar .out{background:var(--bad)}
.db-more-alerts{margin:0;padding:12px 22px;border-top:1px solid var(--line-2);color:var(--muted);font-size:13px}
.db-panel-foot{display:flex;align-items:center;justify-content:space-between;padding:15px 22px;border-top:1px solid var(--line);color:var(--accent);font-size:13px;font-weight:600;text-decoration:none}
.db-panel-foot:hover{background:#fafbfd;color:var(--accent-2)}

.db-empty{padding:44px 24px 48px;text-align:center;border-top:1px solid var(--line-2)}
.db-empty-icon{width:50px;height:50px;margin:0 auto 14px;border-radius:15px;background:var(--accent-soft);color:var(--accent);display:grid;place-items:center}
.db-empty-icon.ok{background:var(--ok-soft);color:var(--ok)}
.db-empty h3{margin:0 0 6px;font-family:var(--display);font-size:18px;letter-spacing:-.3px}
.db-empty p{margin:0 auto;max-width:300px;color:var(--muted);font-size:14px;line-height:1.55}
.db-empty a{display:inline-block;margin-top:14px;color:var(--accent);font-size:13px;font-weight:600;text-decoration:none}

.db-footer{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-top:26px;color:var(--faint);font-size:12.5px}

/* loading */
.db-skel{border-radius:8px;background:linear-gradient(90deg,#eef0f4 25%,#f6f7f9 50%,#eef0f4 75%);background-size:200% 100%;animation:db-shimmer 1.4s infinite linear}
.db-spinner{display:inline-block;width:15px;height:15px;border:2px solid #cbd0da;border-top-color:var(--accent);border-radius:50%;animation:db-spin .7s linear infinite}
@keyframes db-spin{to{transform:rotate(360deg)}}
@keyframes db-shimmer{to{background-position:-200% 0}}
@media (prefers-reduced-motion:reduce){.db-skel,.db-spinner{animation:none}}

@media(max-width:1100px){
  .db-grid{grid-template-columns:minmax(0,1fr)}
  .db-stats{grid-template-columns:repeat(2,minmax(0,1fr))}
  .db-stat:nth-child(3){border-left:0}
  .db-stat:nth-child(n+3){border-top:1px solid var(--line-2)}
}
@media(max-width:700px){
  .db-nav-inner{padding:10px 16px}
  .db-brand-sub{display:none}
  .db-container{padding:24px 16px 36px}
  .db-heading h1{font-size:32px}
  .db-actions{width:100%}.db-actions .db-btn:not(.db-icon-btn){flex:1}
  .db-stat{padding:16px}.db-stat-value{font-size:28px}.db-stat-value.sm{font-size:22px}
  .db-panel-head{padding:18px 16px 14px}
  .db-row{padding:13px 16px}
  .db-health-body{padding:0 16px 18px}
  .db-legend{gap:8px}
  .db-legend-item b{font-size:19px}
  .db-footer{flex-direction:column}
  .db-row .db-chip{display:none}
  .db-more-alerts,.db-panel-foot{padding-left:16px;padding-right:16px}
}
@media(max-width:520px){.db-link.hide-sm{display:none}}
`;

/* ------------------------------------------------------------------ */
/*  Icons                                                              */
/* ------------------------------------------------------------------ */
function Icon({ name, size = 16 }) {
  const p = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };
  const paths = {
    in: <path d="M7 7l10 10M17 8v9H8" />,
    out: <path d="M7 17L17 7M8 7h9v9" />,
    plus: <path d="M12 5v14M5 12h14" />,
    refresh: <><path d="M20 11a8 8 0 0 0-14.5-4M4 4v4h4" /><path d="M4 13a8 8 0 0 0 14.5 4M20 20v-4h-4" /></>,
    arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
    swap: <><path d="M7 4L3 8l4 4M3 8h14" /><path d="M17 20l4-4-4-4M21 16H7" /></>,
    check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
    alert: <><circle cx="12" cy="12" r="9" /><path d="M12 8v5M12 16.5v.01" /></>,
  };
  return <svg {...p}>{paths[name]}</svg>;
}

/* ------------------------------------------------------------------ */
/*  Helpers (logic unchanged)                                          */
/* ------------------------------------------------------------------ */
function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);
}

function formatNumber(value) {
  return Number(value || 0).toLocaleString("en-IN");
}

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function getTransactionType(transaction) {
  return String(transaction.type ?? transaction.transactionType ?? transaction.action ?? "").toLowerCase();
}

function isStockIn(transaction) {
  return ["in", "stock-in", "stock_in", "stock in", "purchase", "added", "add"].includes(
    getTransactionType(transaction)
  );
}

function getTransactionQuantity(transaction) {
  return Math.abs(Number(transaction.quantity ?? transaction.stockQuantity ?? transaction.amount ?? 0));
}

function getTransactionName(transaction) {
  const product = transaction.product;
  if (typeof product === "string") return transaction.productName || product;
  return transaction.productName || product?.name || product?.title || transaction.name || "Product";
}

function getTransactionId(transaction, index) {
  return transaction._id || transaction.id || `${getTransactionName(transaction)}-${index}`;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchDashboardData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      setError("");

      const [productsResponse, transactionsResponse] = await Promise.all([
        api.get("/products"),
        api.get("/transactions"),
      ]);

      const productData = productsResponse.data;
      const transactionData = transactionsResponse.data;

      const productList = Array.isArray(productData)
        ? productData
        : productData?.products || productData?.data || [];

      const transactionList = Array.isArray(transactionData)
        ? transactionData
        : transactionData?.transactions || transactionData?.data || [];

      setProducts(Array.isArray(productList) ? productList : []);
      setTransactions(Array.isArray(transactionList) ? transactionList : []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const stats = useMemo(() => {
    const totalProducts = products.length;

    const totalQuantity = products.reduce(
      (sum, product) => sum + Number(product.quantity ?? product.stock ?? 0),
      0
    );

    const inventoryValue = products.reduce((sum, product) => {
      const quantity = Number(product.quantity ?? product.stock ?? 0);
      const price = Number(
        product.price ?? product.unitPrice ?? product.costPrice ?? product.sellingPrice ?? 0
      );
      return sum + quantity * price;
    }, 0);

    const lowStockProducts = products.filter((product) => {
      const quantity = Number(product.quantity ?? product.stock ?? 0);
      const threshold = Number(
        product.lowStockThreshold ?? product.reorderLevel ?? product.minStockLevel ?? 5
      );
      return quantity <= threshold;
    });

    const outOfStock = products.filter(
      (product) => Number(product.quantity ?? product.stock ?? 0) <= 0
    ).length;

    return {
      totalProducts,
      totalQuantity,
      inventoryValue,
      lowStockProducts,
      lowStockCount: lowStockProducts.length,
      outOfStock,
      availableProducts: totalProducts - outOfStock,
    };
  }, [products]);

  const recentTransactions = useMemo(() => {
    return [...transactions]
      .sort((a, b) => {
        const dateA = new Date(a.createdAt ?? a.date ?? a.transactionDate ?? 0).getTime();
        const dateB = new Date(b.createdAt ?? b.date ?? b.transactionDate ?? 0).getTime();
        return dateB - dateA;
      })
      .slice(0, 6);
  }, [transactions]);
 const navigate = useNavigate();
const { logout } = useAuth();

const handleLogout = () => {
  logout();
  navigate("/login", { replace: true });
};

  // Stock health split: healthy / low (but not empty) / out of stock
  const lowOnly = Math.max(0, stats.lowStockCount - stats.outOfStock);
  const healthy = Math.max(0, stats.totalProducts - stats.lowStockCount);
  const pct = (n) => (stats.totalProducts ? (n / stats.totalProducts) * 100 : 0);

  if (loading) {
    return (
      <main className="db-page">
        <style>{dashboardStyles}</style>
        <nav className="db-nav">
          <div className="db-nav-inner">
            <div className="db-brand">
              <div className="db-logo">S</div>
              <div className="db-brand-name">StockWise</div>
            </div>
          </div>
        </nav>
        <div className="db-container" aria-busy="true" aria-label="Loading your dashboard">
          <div className="db-skel" style={{ width: 260, height: 40, marginBottom: 14 }} />
          <div className="db-skel" style={{ width: 380, height: 14, marginBottom: 34, maxWidth: "100%" }} />
          <div className="db-skel" style={{ height: 112, borderRadius: 18, marginBottom: 22 }} />
          <div className="db-skel" style={{ height: 130, borderRadius: 18, marginBottom: 22 }} />
          <div className="db-skel" style={{ height: 340, borderRadius: 18 }} />
        </div>
      </main>
    );
  }

  return (
    <main className="db-page">
      <style>{dashboardStyles}</style>

      <nav className="db-nav">
        <div className="db-nav-inner">
          <div className="db-brand">
            <div className="db-logo">S</div>
            <div>
              <div className="db-brand-name">StockWise</div>
              <div className="db-brand-sub">Smart Inventory Management</div>
            </div>
          </div>

         
<div className="db-links">
  <Link to="/dashboard" className="db-link on" aria-current="page">
    Dashboard
  </Link>
  <Link to="/products" className="db-link">
    Products
  </Link>
  <Link to="/transactions" className="db-link">
    Transactions
  </Link>
  <button
    type="button"
    className="db-link"
    onClick={handleLogout}
    style={{
      border: "none",
      cursor: "pointer",
      background: "transparent",
      fontFamily: "inherit",
    }}
  >
    Logout
  </button>
</div>

        </div>
      </nav>

      <div className="db-container">
        <header className="db-heading">
          <div>
            <h1>Dashboard</h1>
            <p>Your inventory at a glance, with what needs attention first.</p>
          </div>

          <div className="db-actions">
            <button
              type="button"
              className="db-btn db-secondary db-icon-btn"
              onClick={() => fetchDashboardData(true)}
              disabled={refreshing}
              aria-label="Refresh data"
              title="Refresh data"
            >
              {refreshing ? <span className="db-spinner" /> : <Icon name="refresh" />}
            </button>
            <Link to="/transactions" className="db-btn db-secondary">
              <Icon name="swap" /> Record movement
            </Link>
            <Link to="/products" className="db-btn db-primary">
              <Icon name="plus" /> Manage products
            </Link>
          </div>
        </header>

        {error && (
          <div className="db-error" role="alert">
            <Icon name="alert" size={18} />
            <div>
              <strong>Couldn't update your dashboard</strong>
              <p>{error}</p>
            </div>
            <button type="button" onClick={() => fetchDashboardData(true)} disabled={refreshing}>
              Try again
            </button>
          </div>
        )}

        <section className="db-stats" aria-label="Inventory summary">
          <article className="db-stat">
            <div className="db-stat-label"><span className="db-dot acc" />Total products</div>
            <p className="db-stat-value db-num">{formatNumber(stats.totalProducts)}</p>
            <div className="db-stat-note">Unique products registered</div>
          </article>

          <article className="db-stat">
            <div className="db-stat-label"><span className="db-dot" />Units in stock</div>
            <p className="db-stat-value db-num">{formatNumber(stats.totalQuantity)}</p>
            <div className="db-stat-note">Across all listed products</div>
          </article>

          <article className="db-stat">
            <div className="db-stat-label"><span className="db-dot ok" />Inventory value</div>
            <p className="db-stat-value sm db-num">{formatCurrency(stats.inventoryValue)}</p>
            <div className="db-stat-note">Quantity × unit price</div>
          </article>

          <article className="db-stat">
            <div className="db-stat-label"><span className="db-dot warn" />Low-stock items</div>
            <p className="db-stat-value db-num">{formatNumber(stats.lowStockCount)}</p>
            <div className="db-stat-note">{formatNumber(stats.outOfStock)} currently out of stock</div>
          </article>
        </section>

        <section className="db-panel db-health" aria-label="Stock health">
          <div className="db-panel-head">
            <div>
              <h2>Stock health</h2>
              <p>How your products are spread across stock levels</p>
            </div>
          </div>

          <div className="db-health-body">
            <div
              className="db-health-bar"
              role="img"
              aria-label={`${healthy} well stocked, ${lowOnly} low, ${stats.outOfStock} out of stock`}
            >
              {stats.totalProducts === 0 ? (
                <i className="none" />
              ) : (
                <>
                  {healthy > 0 && <i className="ok" style={{ flex: pct(healthy) }} />}
                  {lowOnly > 0 && <i className="low" style={{ flex: pct(lowOnly) }} />}
                  {stats.outOfStock > 0 && <i className="out" style={{ flex: pct(stats.outOfStock) }} />}
                </>
              )}
            </div>

            <div className="db-legend">
              <div className="db-legend-item">
                <span className="db-dot ok" />
                <div><b className="db-num">{formatNumber(healthy)}</b><span>Well stocked</span></div>
              </div>
              <div className="db-legend-item">
                <span className="db-dot warn" />
                <div><b className="db-num">{formatNumber(lowOnly)}</b><span>Running low</span></div>
              </div>
              <div className="db-legend-item">
                <span className="db-dot bad" />
                <div><b className="db-num">{formatNumber(stats.outOfStock)}</b><span>Out of stock</span></div>
              </div>
            </div>
          </div>
        </section>

        <section className="db-grid">
          <article className="db-panel">
            <div className="db-panel-head">
              <div>
                <h2>Recent transactions</h2>
                <p>Latest incoming and outgoing stock movements</p>
              </div>
              <Link to="/transactions" className="db-more">
                View all <Icon name="arrow" size={14} />
              </Link>
            </div>

            {recentTransactions.length === 0 ? (
              <div className="db-empty">
                <div className="db-empty-icon"><Icon name="swap" size={22} /></div>
                <h3>No transactions yet</h3>
                <p>Once you record a stock movement, it will show up here.</p>
                <Link to="/transactions">Record a movement</Link>
              </div>
            ) : (
              <div>
                {recentTransactions.map((transaction, index) => {
                  const stockIn = isStockIn(transaction);
                  const quantity = getTransactionQuantity(transaction);
                  const name = getTransactionName(transaction);

                  return (
                    <div className="db-row" key={getTransactionId(transaction, index)}>
                      <span className="db-avatar">{String(name).charAt(0).toUpperCase()}</span>

                      <div className="db-row-main">
                        <span className="db-row-name">{name}</span>
                        <span className="db-row-sub">
                          {transaction.sku || transaction.productSku || "Inventory item"} ·{" "}
                          {formatDate(transaction.createdAt ?? transaction.date ?? transaction.transactionDate)}
                        </span>
                      </div>

                      <span className={`db-chip ${stockIn ? "in" : "out"}`}>
                        <Icon name={stockIn ? "in" : "out"} size={14} />
                        {stockIn ? "Stock in" : "Stock out"}
                      </span>

                      <span className={`db-row-qty db-num ${stockIn ? "db-qty-in" : "db-qty-out"}`}>
                        {stockIn ? "+" : "−"}
                        {formatNumber(quantity)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </article>

          <article className="db-panel">
            <div className="db-panel-head">
              <div>
                <h2>Stock alerts</h2>
                <p>
                  {stats.lowStockCount > 0
                    ? `${formatNumber(stats.lowStockCount)} ${stats.lowStockCount === 1 ? "product needs" : "products need"} attention`
                    : "Products that need your attention"}
                </p>
              </div>
            </div>

            {stats.lowStockProducts.length === 0 ? (
              <div className="db-empty">
                <div className="db-empty-icon ok"><Icon name="check" size={22} /></div>
                <h3>Everything looks good</h3>
                <p>No products are below their configured stock thresholds.</p>
              </div>
            ) : (
              <div>
                {stats.lowStockProducts.slice(0, 6).map((product, index) => {
                  const quantity = Number(product.quantity ?? product.stock ?? 0);
                  const threshold = Number(
                    product.lowStockThreshold ?? product.reorderLevel ?? product.minStockLevel ?? 5
                  );
                  const outOfStock = quantity <= 0;
                  const name = product.name || product.title || "Unnamed product";
                  const fill = outOfStock ? 100 : Math.max(6, Math.min(100, (quantity / Math.max(threshold, 1)) * 100));

                  return (
                    <div className="db-row" key={product._id || product.id || index}>
                      <span className="db-avatar">{String(name).charAt(0).toUpperCase()}</span>

                      <div className="db-row-main">
                        <span className="db-row-name">{name}</span>
                        <span className="db-row-sub">
                          {outOfStock ? "Out of stock" : `Alert at ${formatNumber(threshold)} units`}
                        </span>
                        <div className="db-bar" aria-hidden="true">
                          <i className={outOfStock ? "out" : "low"} style={{ width: `${fill}%` }} />
                        </div>
                      </div>

                      <div className={`db-alert-qty ${outOfStock ? "out" : "low"}`}>
                        <b className="db-num">{formatNumber(quantity)}</b>
                        <small>left</small>
                      </div>
                    </div>
                  );
                })}

                {stats.lowStockProducts.length > 6 && (
                  <p className="db-more-alerts">
                    +{stats.lowStockProducts.length - 6} more products need attention
                  </p>
                )}
              </div>
            )}

            <Link to="/products" className="db-panel-foot">
              Manage inventory <Icon name="arrow" size={15} />
            </Link>
          </article>
        </section>

        <footer className="db-footer">
          <span>StockWise · Smart Inventory Management</span>
          <span>{formatNumber(stats.availableProducts)} of {formatNumber(stats.totalProducts)} products available</span>
        </footer>
      </div>
    </main>
  );
}   