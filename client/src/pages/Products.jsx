import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const emptyForm = {
  name: "",
  sku: "",
  category: "",
  quantity: "",
  price: "",
  lowStockThreshold: "5",
};

/* ------------------------------------------------------------------ */
/*  Styles (same design tokens as the Transactions page)               */
/* ------------------------------------------------------------------ */
const styles = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700&family=Instrument+Sans:wght@400;500;600;700&display=swap');

.pd-page{
  --bg:#f3f4f7; --surface:#fff; --ink:#12151c; --ink-2:#3b4252; --muted:#6c7587; --faint:#9aa2b1;
  --line:#e5e8ee; --line-2:#eef0f4; --accent:#3a4cde; --accent-2:#2f3fc2; --accent-soft:#eceefe;
  --ok:#0c8a60; --ok-soft:#e5f6ee; --warn:#b86a00; --warn-soft:#fff3dc; --bad:#d03a4b; --bad-soft:#fdeaec;
  --font:'Instrument Sans',system-ui,-apple-system,'Segoe UI',sans-serif;
  --display:'Bricolage Grotesque','Instrument Sans',system-ui,sans-serif;
  min-height:100vh;background:var(--bg);color:var(--ink);font-family:var(--font);-webkit-font-smoothing:antialiased;
}
.pd-page *,.pd-page *::before,.pd-page *::after,.pd-drawer-root *{box-sizing:border-box}
.pd-page button,.pd-page input,.pd-page select,.pd-drawer-root button,.pd-drawer-root input,.pd-drawer-root select{font-family:var(--font)}
.pd-page :focus-visible,.pd-drawer-root :focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.pd-num{font-variant-numeric:tabular-nums}

.pd-nav{position:sticky;top:0;z-index:20;background:#ffffffd9;backdrop-filter:saturate(1.4) blur(10px);border-bottom:1px solid var(--line)}
.pd-nav-inner{max-width:1280px;margin:0 auto;padding:12px 32px;display:flex;align-items:center;justify-content:space-between;gap:16px}
.pd-brand{display:flex;align-items:center;gap:11px}
.pd-logo{width:34px;height:34px;border-radius:10px;background:var(--ink);color:#fff;display:grid;place-items:center;font-family:var(--display);font-weight:700;font-size:17px}
.pd-brand-name{font-family:var(--display);font-weight:700;font-size:17px;letter-spacing:-.3px;line-height:1.1}
.pd-brand-sub{font-size:12px;color:var(--muted);margin-top:2px}
.pd-back{display:inline-flex;align-items:center;gap:6px;color:var(--ink-2);text-decoration:none;font-size:13px;font-weight:600;padding:8px 12px;border-radius:9px;transition:background .15s}
.pd-back:hover{background:var(--line-2)}

.pd-container{max-width:1280px;margin:0 auto;padding:36px 32px 48px}
.pd-heading{display:flex;justify-content:space-between;align-items:flex-end;gap:20px;flex-wrap:wrap;margin-bottom:28px}
.pd-heading h1{margin:0;font-family:var(--display);font-size:40px;line-height:1.05;font-weight:700;letter-spacing:-1.4px}
.pd-heading p{margin:10px 0 0;color:var(--muted);font-size:15px;line-height:1.5;max-width:480px}

.pd-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:42px;padding:0 16px;border-radius:11px;border:1px solid transparent;font-size:14px;font-weight:600;cursor:pointer;text-decoration:none;transition:background .15s,border-color .15s}
.pd-btn:disabled{opacity:.5;cursor:not-allowed}
.pd-primary{background:var(--accent);color:#fff;box-shadow:0 1px 2px #3a4cde40,inset 0 1px 0 #ffffff26}
.pd-primary:hover:not(:disabled){background:var(--accent-2)}
.pd-secondary{background:var(--surface);border-color:var(--line);color:var(--ink-2)}
.pd-secondary:hover:not(:disabled){border-color:#cfd4de;background:#fafbfc}
.pd-ghost{background:transparent;color:var(--muted);padding:0 10px}
.pd-ghost:hover:not(:disabled){color:var(--ink);background:var(--line-2)}

.pd-message{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:18px;padding:12px 14px;border-radius:12px;font-size:14px;line-height:1.5;overflow-wrap:anywhere}
.pd-message>span{display:flex;gap:10px;align-items:flex-start}
.pd-message svg{margin-top:2px;flex-shrink:0}
.pd-error{background:var(--bad-soft);color:#a62b3a;border:1px solid #f6c9ce}
.pd-success{background:var(--ok-soft);color:#0a6b4b;border:1px solid #bfe8d6}
.pd-dismiss{flex-shrink:0;border:0;background:transparent;color:inherit;cursor:pointer;padding:2px;border-radius:6px;display:grid;place-items:center;opacity:.7}
.pd-dismiss:hover{opacity:1}

.pd-stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));background:var(--surface);border:1px solid var(--line);border-radius:18px;margin-bottom:22px}
.pd-stat{padding:22px 24px;min-width:0;border-left:1px solid var(--line-2)}
.pd-stat:first-child{border-left:0}
.pd-stat-label{display:flex;align-items:center;gap:8px;color:var(--muted);font-size:13px;font-weight:500}
.pd-dot{width:8px;height:8px;border-radius:50%;background:var(--faint)}
.pd-dot.acc{background:var(--accent)} .pd-dot.warn{background:#e29a1c} .pd-dot.bad{background:var(--bad)}
.pd-stat-value{margin:12px 0 0;font-family:var(--display);font-size:34px;font-weight:700;letter-spacing:-1.2px;line-height:1;overflow-wrap:anywhere}
.pd-stat-value.sm{font-size:28px}
.pd-stat-note{margin-top:9px;font-size:12.5px;color:var(--faint);line-height:1.4}

.pd-panel{background:var(--surface);border:1px solid var(--line);border-radius:18px;overflow:hidden}
.pd-toolbar{display:flex;align-items:center;gap:12px;flex-wrap:wrap;padding:16px 20px;border-bottom:1px solid var(--line)}
.pd-search-wrap{position:relative;flex:1;min-width:230px}
.pd-search-wrap svg{position:absolute;left:13px;top:50%;transform:translateY(-50%);color:var(--faint);pointer-events:none}
.pd-input,.pd-select{width:100%;min-height:42px;padding:10px 13px;border:1px solid var(--line);border-radius:11px;background:#fff;color:var(--ink);font-size:14px;outline:none;transition:border-color .15s,box-shadow .15s}
.pd-input::placeholder{color:var(--faint)}
.pd-input:hover,.pd-select:hover{border-color:#cfd4de}
.pd-input:focus,.pd-select:focus{border-color:var(--accent);box-shadow:0 0 0 3px #3a4cde1f}
.pd-search{padding-left:39px;background:var(--bg);border-color:transparent}
.pd-search:focus{background:#fff}
.pd-select{appearance:none;padding-right:38px;background:#fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' stroke='%236c7587' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m4 6 4 4 4-4'/%3E%3C/svg%3E") no-repeat right 12px center}
.pd-cat-select{width:190px}
.pd-seg{display:inline-flex;padding:3px;border-radius:11px;background:var(--bg);gap:2px;flex-wrap:wrap}
.pd-seg button{border:0;background:transparent;padding:8px 13px;border-radius:8px;font-size:13px;font-weight:600;color:var(--muted);cursor:pointer;transition:background .15s,color .15s}
.pd-seg button:hover{color:var(--ink)}
.pd-seg button.on{background:#fff;color:var(--ink);box-shadow:0 1px 2px #12151c1a,0 0 0 1px #12151c0a}

.pd-table-wrap{width:100%;overflow-x:auto}
.pd-table{width:100%;min-width:900px;border-collapse:collapse;text-align:left}
.pd-table th{padding:12px 20px;color:var(--muted);font-size:12.5px;font-weight:600;white-space:nowrap;background:#fafbfc;border-bottom:1px solid var(--line)}
.pd-table td{padding:15px 20px;border-bottom:1px solid var(--line-2);font-size:14px;color:var(--ink-2);vertical-align:middle}
.pd-table tbody tr:last-child td{border-bottom:0}
.pd-table tbody tr:hover td{background:#fafbfd}
.pd-r{text-align:right !important}
.pd-product-wrap{display:flex;align-items:center;gap:12px;min-width:190px}
.pd-avatar{width:38px;height:38px;border-radius:11px;flex-shrink:0;display:grid;place-items:center;background:var(--bg);color:var(--ink-2);font-family:var(--display);font-weight:700;font-size:15px;border:1px solid var(--line)}
.pd-product{color:var(--ink);font-weight:600;line-height:1.3}
.pd-sub{margin-top:3px;color:var(--faint);font-size:12px}
.pd-category{display:inline-block;padding:4px 10px;border-radius:8px;background:var(--bg);color:var(--ink-2);font-size:12.5px;font-weight:500;white-space:nowrap}
.pd-price{font-weight:600;color:var(--ink);white-space:nowrap}
.pd-qty{min-width:130px}
.pd-qty b{font-size:15px;color:var(--ink)}
.pd-qty small{color:var(--faint);font-size:12px;margin-left:6px}
.pd-bar{height:5px;margin-top:8px;border-radius:99px;background:var(--line-2);overflow:hidden}
.pd-bar i{display:block;height:100%;border-radius:99px}
.pd-bar .ok{background:var(--ok)} .pd-bar .low{background:#e29a1c} .pd-bar .out{background:var(--bad)}
.pd-chip{display:inline-flex;align-items:center;gap:7px;padding:5px 11px 5px 9px;border-radius:99px;font-size:12.5px;font-weight:600;white-space:nowrap}
.pd-chip::before{content:"";width:6px;height:6px;border-radius:50%;background:currentColor}
.pd-chip.ok{background:var(--ok-soft);color:var(--ok)}
.pd-chip.low{background:var(--warn-soft);color:var(--warn)}
.pd-chip.out{background:var(--bad-soft);color:var(--bad)}
.pd-actions{display:flex;gap:6px;justify-content:flex-end}
.pd-action{display:inline-flex;align-items:center;gap:6px;min-height:34px;padding:0 11px;border:1px solid var(--line);background:#fff;color:var(--ink-2);border-radius:9px;cursor:pointer;font-size:13px;font-weight:600;transition:background .15s,border-color .15s}
.pd-action:hover{background:#fafbfc;border-color:#cfd4de}
.pd-action.del{width:34px;padding:0;justify-content:center;color:var(--bad)}
.pd-action.del:hover{background:var(--bad-soft);border-color:#f6c9ce}

.pd-skeleton{padding:8px 20px}
.pd-skel-row{display:flex;align-items:center;gap:14px;padding:14px 0;border-bottom:1px solid var(--line-2)}
.pd-skel-row:last-child{border-bottom:0}
.pd-skel{border-radius:8px;background:linear-gradient(90deg,#eef0f4 25%,#f6f7f9 50%,#eef0f4 75%);background-size:200% 100%;animation:pd-shimmer 1.4s infinite linear}
.pd-empty{padding:64px 20px;text-align:center}
.pd-empty-icon{width:54px;height:54px;margin:0 auto 16px;border-radius:16px;background:var(--accent-soft);color:var(--accent);display:grid;place-items:center}
.pd-empty h3{margin:0 0 6px;font-family:var(--display);font-size:20px;letter-spacing:-.4px}
.pd-empty p{margin:0 auto 20px;max-width:360px;color:var(--muted);font-size:14px;line-height:1.55}
.pd-footer{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-top:22px;color:var(--faint);font-size:12.5px}

/* drawer */
.pd-drawer-root{position:fixed;inset:0;z-index:1000;display:flex;justify-content:flex-end;background:#12151c73;backdrop-filter:blur(3px);animation:pd-fade .18s ease-out}
.pd-drawer{width:100%;max-width:500px;height:100%;background:#fff;display:flex;flex-direction:column;box-shadow:-20px 0 60px #12151c33;animation:pd-slide .24s cubic-bezier(.2,.8,.2,1)}
.pd-drawer-head{display:flex;justify-content:space-between;align-items:flex-start;gap:16px;padding:24px 28px 18px}
.pd-drawer-head h2{margin:0;font-family:var(--display);font-size:24px;letter-spacing:-.7px}
.pd-drawer-head p{margin:6px 0 0;color:var(--muted);font-size:14px;line-height:1.5}
.pd-close{width:36px;height:36px;flex-shrink:0;border:0;border-radius:10px;background:var(--bg);color:var(--ink-2);display:grid;place-items:center;cursor:pointer}
.pd-close:hover{background:var(--line)}
.pd-drawer-body{flex:1;overflow-y:auto;padding:4px 28px 24px}
.pd-form-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px 16px}
.pd-field{display:flex;flex-direction:column;gap:8px;min-width:0}
.pd-full{grid-column:1/-1}
.pd-field label{font-size:13.5px;font-weight:600;color:var(--ink)}
.pd-field small{color:var(--faint);font-size:12px;line-height:1.5}
.pd-req{color:var(--bad)}
.pd-affix{position:relative}
.pd-affix span{position:absolute;left:13px;top:50%;transform:translateY(-50%);color:var(--muted);font-size:14px;pointer-events:none}
.pd-affix input{padding-left:28px}
.pd-status-preview{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:13px 16px;border-radius:13px;background:var(--bg);font-size:13px;color:var(--muted)}
.pd-drawer-foot{display:flex;gap:10px;padding:16px 28px;border-top:1px solid var(--line);background:#fff}
.pd-drawer-foot .pd-btn{flex:1}
.pd-drawer-foot .pd-secondary{flex:0 0 auto;min-width:96px}
.pd-spinner{display:inline-block;width:15px;height:15px;border:2px solid #ffffff80;border-top-color:#fff;border-radius:50%;animation:pd-spin .7s linear infinite}

@keyframes pd-spin{to{transform:rotate(360deg)}}
@keyframes pd-shimmer{to{background-position:-200% 0}}
@keyframes pd-fade{from{opacity:0}to{opacity:1}}
@keyframes pd-slide{from{transform:translateX(32px);opacity:.6}to{transform:none;opacity:1}}
@media (prefers-reduced-motion:reduce){.pd-drawer-root,.pd-drawer,.pd-skel,.pd-spinner{animation:none}}

@media(max-width:1000px){
  .pd-stats{grid-template-columns:repeat(2,minmax(0,1fr))}
  .pd-stat:nth-child(3){border-left:0}
  .pd-stat:nth-child(n+3){border-top:1px solid var(--line-2)}
}
@media(max-width:760px){
  .pd-nav-inner{padding:10px 16px}
  .pd-brand-sub{display:none}
  .pd-container{padding:24px 16px 36px}
  .pd-heading h1{font-size:32px}
  .pd-heading>.pd-btn{width:100%}
  .pd-stat{padding:16px}.pd-stat-value{font-size:28px}.pd-stat-value.sm{font-size:22px}
  .pd-toolbar{padding:14px}
  .pd-search-wrap,.pd-cat-select{width:100%;min-width:100%}
  .pd-seg{width:100%}.pd-seg button{flex:1;padding:8px 6px}
  .pd-table{min-width:0;display:block}
  .pd-table thead{display:none}
  .pd-table tbody{display:block}
  .pd-table tr{display:grid;grid-template-columns:1fr auto;grid-template-areas:"product price" "cat status" "qty qty" "actions actions";gap:12px;padding:16px;border-bottom:1px solid var(--line-2)}
  .pd-table tbody tr:last-child{border-bottom:0}
  .pd-table td{padding:0;border:0;background:transparent !important}
  .pd-table .c-product{grid-area:product}.pd-table .c-price{grid-area:price;text-align:right}
  .pd-table .c-cat{grid-area:cat}.pd-table .c-status{grid-area:status;text-align:right}
  .pd-table .c-qty{grid-area:qty;padding:12px;border-radius:10px;background:var(--bg) !important}
  .pd-table .c-actions{grid-area:actions}
  .pd-actions{justify-content:flex-start}
  .pd-action:not(.del){flex:1;justify-content:center}
  .pd-footer{flex-direction:column}
  .pd-drawer{max-width:none}
  .pd-drawer-head{padding:20px 20px 14px}.pd-drawer-body{padding:4px 20px 20px}.pd-drawer-foot{padding:14px 20px}
}
@media(max-width:480px){.pd-form-grid{grid-template-columns:1fr}.pd-full{grid-column:auto}}
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
    plus: <path d="M12 5v14M5 12h14" />,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>,
    close: <path d="M6 6l12 12M18 6L6 18" />,
    left: <path d="M15 6l-6 6 6 6" />,
    edit: <><path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16v4z" /><path d="m13.5 6.5 4 4" /></>,
    trash: <><path d="M4 7h16M10 11v6M14 11v6" /><path d="M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3" /></>,
    box: <><path d="M21 8l-9-5-9 5 9 5 9-5z" /><path d="M3 8v8l9 5 9-5V8M12 13v8" /></>,
    check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
    alert: <><circle cx="12" cy="12" r="9" /><path d="M12 8v5M12 16.5v.01" /></>,
  };
  return <svg {...p}>{paths[name]}</svg>;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
function getProductsFromResponse(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.products)) return data.products;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.data?.products)) return data.data.products;
  if (Array.isArray(data?.items)) return data.items;
  return [];
}

const getProductId = (product) => product._id ?? product.id;
const getQuantity = (product) =>
  Number(product.quantity ?? product.stock ?? product.stockQuantity ?? 0);
const getThreshold = (product) =>
  Number(product.lowStockThreshold ?? product.reorderLevel ?? product.minStockLevel ?? 5);
const getPrice = (product) =>
  Number(product.price ?? product.sellingPrice ?? product.unitPrice ?? 0);

function statusFor(quantity, threshold) {
  if (quantity <= 0) return { label: "Out of stock", key: "out" };
  if (quantity <= threshold) return { label: "Low stock", key: "low" };
  return { label: "In stock", key: "ok" };
}

const getStockStatus = (product) => statusFor(getQuantity(product), getThreshold(product));

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);
}

function getErrorMessage(error) {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    "Something went wrong. Please try again."
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [stockFilter, setStockFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/products");
      setProducts(getProductsFromResponse(response.data));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const closeModal = useCallback(() => {
    if (saving) return;
    setModalOpen(false);
    setEditingId(null);
    setForm(emptyForm);
  }, [saving]);

  // Escape closes the drawer; page scroll is locked while it is open
  useEffect(() => {
    if (!modalOpen) return undefined;
    const onKey = (e) => e.key === "Escape" && closeModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [modalOpen, closeModal]);

  const categories = useMemo(() => {
    const unique = products
      .map((product) => product.category)
      .filter((category) => typeof category === "string" && category.trim());
    return ["All", ...new Set(unique)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return products.filter((product) => {
      const name = String(product.name ?? product.productName ?? "").toLowerCase();
      const sku = String(product.sku ?? product.productCode ?? "").toLowerCase();
      const category = String(product.category ?? "").toLowerCase();
      const status = getStockStatus(product);

      const matchesSearch =
        !normalizedSearch ||
        name.includes(normalizedSearch) ||
        sku.includes(normalizedSearch) ||
        category.includes(normalizedSearch);

      const matchesCategory = categoryFilter === "All" || product.category === categoryFilter;
      const matchesStock = stockFilter === "All" || status.label === stockFilter;

      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [products, search, categoryFilter, stockFilter]);

  const lowStockCount = products.filter((p) => getStockStatus(p).key === "low").length;
  const outOfStockCount = products.filter((p) => getStockStatus(p).key === "out").length;
  const inStockCount = products.length - lowStockCount - outOfStockCount;
  const inventoryValue = products.reduce(
    (total, product) => total + getQuantity(product) * getPrice(product),
    0
  );
  const filtersActive = search.trim() !== "" || categoryFilter !== "All" || stockFilter !== "All";

  // live status preview in the form
  const formQty = Number(form.quantity);
  const formThreshold = Number(form.lowStockThreshold);
  const previewStatus =
    form.quantity !== "" && Number.isFinite(formQty) && Number.isFinite(formThreshold)
      ? statusFor(formQty, formThreshold)
      : null;

  function openAddModal() {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setSuccess("");
    setModalOpen(true);
  }

  function openEditModal(product) {
    setEditingId(getProductId(product));
    setForm({
      name: product.name ?? product.productName ?? "",
      sku: product.sku ?? product.productCode ?? "",
      category: product.category ?? "",
      quantity: String(getQuantity(product)),
      price: String(getPrice(product)),
      lowStockThreshold: String(getThreshold(product)),
    });
    setError("");
    setSuccess("");
    setModalOpen(true);
  }

  function handleInputChange(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const name = form.name.trim();
    const sku = form.sku.trim();
    const category = form.category.trim();
    const quantity = Number(form.quantity);
    const price = Number(form.price);
    const lowStockThreshold = Number(form.lowStockThreshold);

    if (!name || !sku || !category) {
      setError("Please enter the product name, SKU, and category.");
      return;
    }

    if (form.quantity === "" || !Number.isFinite(quantity) || !Number.isInteger(quantity) || quantity < 0) {
      setError("Quantity must be a whole number of 0 or more.");
      return;
    }

    if (form.price === "" || !Number.isFinite(price) || price < 0) {
      setError("Please enter a valid price of 0 or more.");
      return;
    }

    if (form.lowStockThreshold === "" || !Number.isInteger(lowStockThreshold) || lowStockThreshold < 0) {
      setError("The low-stock threshold must be a whole number of 0 or more.");
      return;
    }

    const payload = { name, sku, category, quantity, price, lowStockThreshold };

    setSaving(true);

    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
        setSuccess("Product updated successfully.");
      } else {
        await api.post("/products", payload);
        setSuccess("Product added successfully.");
      }

      setModalOpen(false);
      setEditingId(null);
      setForm(emptyForm);
      await loadProducts();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(product) {
    const id = getProductId(product);

    if (!id) {
      setError("This product does not have a valid ID.");
      return;
    }

    const productName = product.name ?? product.productName ?? "this product";

    if (!window.confirm(`Are you sure you want to delete "${productName}"?`)) return;

    setError("");
    setSuccess("");

    try {
      await api.delete(`/products/${id}`);
      setProducts((previous) => previous.filter((item) => String(getProductId(item)) !== String(id)));
      setSuccess("Product deleted successfully.");
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  const stockTabs = [
    ["All", "All", products.length],
    ["In stock", "In stock", inStockCount],
    ["Low stock", "Low", lowStockCount],
    ["Out of stock", "Out", outOfStockCount],
  ];

  return (
    <div className="pd-page">
      <style>{styles}</style>

      <nav className="pd-nav">
        <div className="pd-nav-inner">
          <div className="pd-brand">
            <div className="pd-logo">S</div>
            <div>
              <div className="pd-brand-name">StockWise</div>
              <div className="pd-brand-sub">Smart Inventory Management</div>
            </div>
          </div>

          <Link to="/dashboard" className="pd-back">
            <Icon name="left" size={15} /> Dashboard
          </Link>
        </div>
      </nav>

      <div className="pd-container">
        <section className="pd-heading">
          <div>
            <h1>Products</h1>
            <p>Manage your catalog, watch stock levels and keep every product up to date.</p>
          </div>

          <button type="button" className="pd-btn pd-primary" onClick={openAddModal}>
            <Icon name="plus" /> Add product
          </button>
        </section>

        {error && !modalOpen && (
          <div className="pd-message pd-error" role="alert">
            <span><Icon name="alert" />{error}</span>
            <button type="button" className="pd-dismiss" onClick={() => setError("")} aria-label="Dismiss error">
              <Icon name="close" size={16} />
            </button>
          </div>
        )}

        {success && !modalOpen && (
          <div className="pd-message pd-success" role="status">
            <span><Icon name="check" />{success}</span>
            <button type="button" className="pd-dismiss" onClick={() => setSuccess("")} aria-label="Dismiss message">
              <Icon name="close" size={16} />
            </button>
          </div>
        )}

        <section className="pd-stats" aria-label="Inventory summary">
          <article className="pd-stat">
            <div className="pd-stat-label"><span className="pd-dot acc" />Total products</div>
            <p className="pd-stat-value pd-num">{products.length}</p>
            <div className="pd-stat-note">Products in your inventory</div>
          </article>

          <article className="pd-stat">
            <div className="pd-stat-label"><span className="pd-dot" />Inventory value</div>
            <p className="pd-stat-value sm pd-num">{formatCurrency(inventoryValue)}</p>
            <div className="pd-stat-note">Quantity × unit price</div>
          </article>

          <article className="pd-stat">
            <div className="pd-stat-label"><span className="pd-dot warn" />Low stock</div>
            <p className="pd-stat-value pd-num">{lowStockCount}</p>
            <div className="pd-stat-note">At or below their threshold</div>
          </article>

          <article className="pd-stat">
            <div className="pd-stat-label"><span className="pd-dot bad" />Out of stock</div>
            <p className="pd-stat-value pd-num">{outOfStockCount}</p>
            <div className="pd-stat-note">Need to be restocked</div>
          </article>
        </section>

        <section className="pd-panel">
          <div className="pd-toolbar">
            <div className="pd-search-wrap">
              <Icon name="search" size={17} />
              <input
                className="pd-input pd-search"
                type="search"
                placeholder="Search product, SKU or category"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                aria-label="Search products"
              />
            </div>

            <select
              className="pd-select pd-cat-select"
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
              aria-label="Filter by category"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === "All" ? "All categories" : category}
                </option>
              ))}
            </select>

            <div className="pd-seg" role="group" aria-label="Filter by stock status">
              {stockTabs.map(([value, label, count]) => (
                <button
                  key={value}
                  type="button"
                  className={stockFilter === value ? "on" : ""}
                  aria-pressed={stockFilter === value}
                  onClick={() => setStockFilter(value)}
                >
                  {label} <span className="pd-num" style={{ opacity: 0.55, marginLeft: 3 }}>{count}</span>
                </button>
              ))}
            </div>

            {filtersActive && (
              <button
                type="button"
                className="pd-btn pd-ghost"
                onClick={() => {
                  setSearch("");
                  setCategoryFilter("All");
                  setStockFilter("All");
                  setError("");
                  setSuccess("");
                }}
              >
                Clear filters
              </button>
            )}
          </div>

          <div className="pd-table-wrap">
            {loading ? (
              <div className="pd-skeleton" aria-busy="true" aria-label="Loading products">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div className="pd-skel-row" key={i}>
                    <div className="pd-skel" style={{ width: 38, height: 38, borderRadius: 11 }} />
                    <div style={{ flex: 1 }}>
                      <div className="pd-skel" style={{ width: "30%", height: 12 }} />
                      <div className="pd-skel" style={{ width: "16%", height: 10, marginTop: 8 }} />
                    </div>
                    <div className="pd-skel" style={{ width: 90, height: 22, borderRadius: 99 }} />
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="pd-empty">
                <div className="pd-empty-icon"><Icon name="box" size={24} /></div>
                <h3>{products.length === 0 ? "No products yet" : "No matching products"}</h3>
                <p>
                  {products.length === 0
                    ? "Add your first product to start tracking stock and value."
                    : "Nothing matches your search or filters. Try a different keyword or clear the filters."}
                </p>

                {products.length === 0 && (
                  <button type="button" className="pd-btn pd-primary" onClick={openAddModal}>
                    <Icon name="plus" /> Add your first product
                  </button>
                )}
              </div>
            ) : (
              <table className="pd-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Unit price</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th className="pd-r">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredProducts.map((product, index) => {
                    const id = getProductId(product);
                    const status = getStockStatus(product);
                    const quantity = getQuantity(product);
                    const threshold = getThreshold(product);
                    const name = product.name ?? product.productName ?? "Unnamed product";
                    const sku = product.sku ?? product.productCode ?? "—";
                    const fill = Math.min(100, Math.max(quantity > 0 ? 4 : 0, (quantity / Math.max(threshold * 3, 1)) * 100));

                    return (
                      <tr key={id ?? `${name}-${index}`}>
                        <td className="c-product">
                          <div className="pd-product-wrap">
                            <span className="pd-avatar">{String(name).charAt(0).toUpperCase()}</span>
                            <div>
                              <div className="pd-product">{name}</div>
                              <div className="pd-sub">SKU {sku}</div>
                            </div>
                          </div>
                        </td>

                        <td className="c-cat">
                          <span className="pd-category">{product.category || "Uncategorized"}</span>
                        </td>

                        <td className="c-price pd-price pd-num">{formatCurrency(getPrice(product))}</td>

                        <td className="c-qty">
                          <div className="pd-qty">
                            <b className="pd-num">{quantity.toLocaleString("en-IN")}</b>
                            <small>alert at {threshold}</small>
                            <div className="pd-bar" aria-hidden="true">
                              <i className={status.key} style={{ width: `${fill}%` }} />
                            </div>
                          </div>
                        </td>

                        <td className="c-status">
                          <span className={`pd-chip ${status.key}`}>{status.label}</span>
                        </td>

                        <td className="c-actions">
                          <div className="pd-actions">
                            <button
                              type="button"
                              className="pd-action"
                              onClick={() => openEditModal(product)}
                              aria-label={`Edit ${name}`}
                            >
                              <Icon name="edit" size={15} /> Edit
                            </button>

                            <button
                              type="button"
                              className="pd-action del"
                              onClick={() => handleDelete(product)}
                              aria-label={`Delete ${name}`}
                              title="Delete"
                            >
                              <Icon name="trash" size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </section>

        <footer className="pd-footer">
          <span>Showing {filteredProducts.length} of {products.length} products</span>
          <span>StockWise · Inventory Management</span>
        </footer>
      </div>

      {modalOpen && (
        <div
          className="pd-drawer-root"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <aside className="pd-drawer" role="dialog" aria-modal="true" aria-labelledby="pd-modal-title">
            <div className="pd-drawer-head">
              <div>
                <h2 id="pd-modal-title">{editingId ? "Edit product" : "Add new product"}</h2>
                <p>
                  {editingId
                    ? "Update the details for this product."
                    : "Enter the details to add a product to your inventory."}
                </p>
              </div>

              <button type="button" className="pd-close" onClick={closeModal} disabled={saving} aria-label="Close">
                <Icon name="close" size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "contents" }}>
              <div className="pd-drawer-body">
                {error && (
                  <div className="pd-message pd-error" role="alert">
                    <span><Icon name="alert" />{error}</span>
                    <button type="button" className="pd-dismiss" onClick={() => setError("")} aria-label="Dismiss error">
                      <Icon name="close" size={16} />
                    </button>
                  </div>
                )}

                <div className="pd-form-grid">
                  <div className="pd-field pd-full">
                    <label htmlFor="product-name">Product name <span className="pd-req">*</span></label>
                    <input
                      id="product-name"
                      className="pd-input"
                      name="name"
                      value={form.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Wireless Mouse"
                      maxLength={100}
                      required
                    />
                  </div>

                  <div className="pd-field">
                    <label htmlFor="product-sku">SKU <span className="pd-req">*</span></label>
                    <input
                      id="product-sku"
                      className="pd-input"
                      name="sku"
                      value={form.sku}
                      onChange={handleInputChange}
                      placeholder="e.g. WM-001"
                      maxLength={50}
                      required
                    />
                  </div>

                  <div className="pd-field">
                    <label htmlFor="product-category">Category <span className="pd-req">*</span></label>
                    <input
                      id="product-category"
                      className="pd-input"
                      name="category"
                      list="pd-category-list"
                      value={form.category}
                      onChange={handleInputChange}
                      placeholder="e.g. Electronics"
                      maxLength={60}
                      required
                    />
                    <datalist id="pd-category-list">
                      {categories.filter((c) => c !== "All").map((c) => (
                        <option key={c} value={c} />
                      ))}
                    </datalist>
                  </div>

                  <div className="pd-field">
                    <label htmlFor="product-quantity">Quantity <span className="pd-req">*</span></label>
                    <input
                      id="product-quantity"
                      className="pd-input pd-num"
                      name="quantity"
                      type="number"
                      min="0"
                      step="1"
                      value={form.quantity}
                      onChange={handleInputChange}
                      placeholder="0"
                      required
                    />
                  </div>

                  <div className="pd-field">
                    <label htmlFor="product-price">Unit price <span className="pd-req">*</span></label>
                    <div className="pd-affix">
                      <span>₹</span>
                      <input
                        id="product-price"
                        className="pd-input pd-num"
                        name="price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={form.price}
                        onChange={handleInputChange}
                        placeholder="0.00"
                        required
                      />
                    </div>
                  </div>

                  <div className="pd-field pd-full">
                    <label htmlFor="product-threshold">Low-stock threshold</label>
                    <input
                      id="product-threshold"
                      className="pd-input pd-num"
                      name="lowStockThreshold"
                      type="number"
                      min="0"
                      step="1"
                      value={form.lowStockThreshold}
                      onChange={handleInputChange}
                      required
                    />
                    <small>
                      The product is marked low stock when its quantity is at or below this number.
                    </small>
                  </div>

                  <div className="pd-full">
                    <div className="pd-status-preview" aria-live="polite">
                      <span>Status with these values</span>
                      {previewStatus ? (
                        <span className={`pd-chip ${previewStatus.key}`}>{previewStatus.label}</span>
                      ) : (
                        <span>Enter a quantity</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pd-drawer-foot">
                <button type="button" className="pd-btn pd-secondary" onClick={closeModal} disabled={saving}>
                  Cancel
                </button>

                <button type="submit" className="pd-btn pd-primary" disabled={saving}>
                  {saving ? (
                    <>
                      <span className="pd-spinner" /> Saving…
                    </>
                  ) : editingId ? (
                    "Save changes"
                  ) : (
                    "Add product"
                  )}
                </button>
              </div>
            </form>
          </aside>
        </div>
      )}
    </div>
  );
}