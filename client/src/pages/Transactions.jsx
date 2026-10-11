import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

/* ------------------------------------------------------------------ */
/*  Styles                                                             */
/* ------------------------------------------------------------------ */
const styles = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700&family=Instrument+Sans:wght@400;500;600;700&display=swap');

.tx-page{
  --bg:#f3f4f7; --surface:#fff; --ink:#12151c; --ink-2:#3b4252; --muted:#6c7587; --faint:#9aa2b1;
  --line:#e5e8ee; --line-2:#eef0f4; --accent:#3a4cde; --accent-2:#2f3fc2; --accent-soft:#eceefe;
  --in:#0c8a60; --in-soft:#e5f6ee; --out:#d03a4b; --out-soft:#fdeaec;
  --font:'Instrument Sans',system-ui,-apple-system,'Segoe UI',sans-serif;
  --display:'Bricolage Grotesque','Instrument Sans',system-ui,sans-serif;
  min-height:100vh;background:var(--bg);color:var(--ink);font-family:var(--font);
  -webkit-font-smoothing:antialiased;
}
.tx-page *,.tx-page *::before,.tx-page *::after,.tx-drawer-root *{box-sizing:border-box}
.tx-page button,.tx-page input,.tx-page select,.tx-page textarea,.tx-drawer-root button,.tx-drawer-root input,.tx-drawer-root select,.tx-drawer-root textarea{font-family:var(--font)}
.tx-page :focus-visible,.tx-drawer-root :focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.tx-num{font-variant-numeric:tabular-nums}

/* top navigation */
.tx-nav{position:sticky;top:0;z-index:20;background:#ffffffd9;backdrop-filter:saturate(1.4) blur(10px);border-bottom:1px solid var(--line)}
.tx-nav-inner{max-width:1280px;margin:0 auto;padding:12px 32px;display:flex;align-items:center;justify-content:space-between;gap:16px}
.tx-brand{display:flex;align-items:center;gap:11px}
.tx-logo{width:34px;height:34px;border-radius:10px;background:var(--ink);color:#fff;display:grid;place-items:center;font-family:var(--display);font-weight:700;font-size:17px}
.tx-brand-name{font-family:var(--display);font-weight:700;font-size:17px;letter-spacing:-.3px;line-height:1.1}
.tx-brand-sub{font-size:12px;color:var(--muted);margin-top:2px}
.tx-back{display:inline-flex;align-items:center;gap:6px;color:var(--ink-2);text-decoration:none;font-size:13px;font-weight:600;padding:8px 12px;border-radius:9px;transition:background .15s}
.tx-back:hover{background:var(--line-2)}

.tx-container{max-width:1280px;margin:0 auto;padding:36px 32px 48px}

/* heading */
.tx-heading{display:flex;justify-content:space-between;align-items:flex-end;gap:20px;flex-wrap:wrap;margin-bottom:28px}
.tx-heading h1{margin:0;font-family:var(--display);font-size:40px;line-height:1.05;font-weight:700;letter-spacing:-1.4px}
.tx-heading p{margin:10px 0 0;color:var(--muted);font-size:15px;line-height:1.5;max-width:460px}
.tx-actions{display:flex;gap:10px;flex-wrap:wrap}

/* buttons */
.tx-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:42px;padding:0 16px;border-radius:11px;border:1px solid transparent;font-size:14px;font-weight:600;cursor:pointer;text-decoration:none;transition:background .15s,border-color .15s,box-shadow .15s}
.tx-btn:disabled{opacity:.5;cursor:not-allowed}
.tx-btn svg{flex-shrink:0}
.tx-primary{background:var(--accent);color:#fff;box-shadow:0 1px 2px #3a4cde40,inset 0 1px 0 #ffffff26}
.tx-primary:hover:not(:disabled){background:var(--accent-2)}
.tx-secondary{background:var(--surface);border-color:var(--line);color:var(--ink-2)}
.tx-secondary:hover:not(:disabled){border-color:#cfd4de;background:#fafbfc}
.tx-ghost{background:transparent;color:var(--muted);padding:0 10px}
.tx-ghost:hover:not(:disabled){color:var(--ink);background:var(--line-2)}
.tx-icon-btn{width:42px;padding:0}

/* alerts */
.tx-message{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:18px;padding:12px 14px;border-radius:12px;font-size:14px;line-height:1.5;overflow-wrap:anywhere}
.tx-message>span{display:flex;gap:10px;align-items:flex-start}
.tx-message svg{margin-top:2px;flex-shrink:0}
.tx-error{background:var(--out-soft);color:#a62b3a;border:1px solid #f6c9ce}
.tx-success{background:var(--in-soft);color:#0a6b4b;border:1px solid #bfe8d6}
.tx-dismiss{flex-shrink:0;border:0;background:transparent;color:inherit;cursor:pointer;padding:2px;border-radius:6px;display:grid;place-items:center;opacity:.7}
.tx-dismiss:hover{opacity:1}

/* summary strip */
.tx-stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));background:var(--surface);border:1px solid var(--line);border-radius:18px;margin-bottom:22px}
.tx-stat{padding:22px 24px;min-width:0;border-left:1px solid var(--line-2)}
.tx-stat:first-child{border-left:0}
.tx-stat-label{display:flex;align-items:center;gap:8px;color:var(--muted);font-size:13px;font-weight:500}
.tx-dot{width:8px;height:8px;border-radius:50%;background:var(--faint)}
.tx-dot.in{background:var(--in)} .tx-dot.out{background:var(--out)} .tx-dot.acc{background:var(--accent)}
.tx-stat-value{margin:12px 0 0;font-family:var(--display);font-size:34px;font-weight:700;letter-spacing:-1.2px;line-height:1}
.tx-stat-note{margin-top:9px;font-size:12.5px;color:var(--faint);line-height:1.4}
.tx-split{display:flex;height:6px;border-radius:99px;overflow:hidden;background:var(--line-2);margin-top:14px}
.tx-split i{display:block;height:100%}
.tx-split .in{background:var(--in)} .tx-split .out{background:var(--out)}

/* panel */
.tx-panel{background:var(--surface);border:1px solid var(--line);border-radius:18px;overflow:hidden}
.tx-toolbar{display:flex;align-items:center;gap:12px;flex-wrap:wrap;padding:16px 20px;border-bottom:1px solid var(--line)}
.tx-search-wrap{position:relative;flex:1;min-width:230px}
.tx-search-wrap svg{position:absolute;left:13px;top:50%;transform:translateY(-50%);color:var(--faint);pointer-events:none}
.tx-input,.tx-select{width:100%;min-height:42px;padding:10px 13px;border:1px solid var(--line);border-radius:11px;background:#fff;color:var(--ink);font-size:14px;outline:none;transition:border-color .15s,box-shadow .15s}
.tx-input::placeholder{color:var(--faint)}
.tx-input:hover,.tx-select:hover{border-color:#cfd4de}
.tx-input:focus,.tx-select:focus{border-color:var(--accent);box-shadow:0 0 0 3px #3a4cde1f}
.tx-search{padding-left:39px;background:var(--bg);border-color:transparent}
.tx-search:focus{background:#fff}
.tx-seg{display:inline-flex;padding:3px;border-radius:11px;background:var(--bg);gap:2px}
.tx-seg button{border:0;background:transparent;padding:8px 14px;border-radius:8px;font-size:13px;font-weight:600;color:var(--muted);cursor:pointer;transition:background .15s,color .15s}
.tx-seg button:hover{color:var(--ink)}
.tx-seg button.on{background:#fff;color:var(--ink);box-shadow:0 1px 2px #12151c1a,0 0 0 1px #12151c0a}
.tx-count{margin-left:auto;color:var(--muted);font-size:13px}

/* table */
.tx-table-wrap{width:100%;overflow-x:auto}
.tx-table{width:100%;min-width:860px;border-collapse:collapse;text-align:left}
.tx-table th{padding:12px 20px;color:var(--muted);font-size:12.5px;font-weight:600;white-space:nowrap;background:#fafbfc;border-bottom:1px solid var(--line)}
.tx-table td{padding:16px 20px;border-bottom:1px solid var(--line-2);font-size:14px;color:var(--ink-2);vertical-align:middle}
.tx-table tbody tr:last-child td{border-bottom:0}
.tx-table tbody tr:hover td{background:#fafbfd}
.tx-r{text-align:right !important}
.tx-product-wrap{display:flex;align-items:center;gap:12px;min-width:170px}
.tx-product-avatar{width:38px;height:38px;border-radius:11px;flex-shrink:0;display:grid;place-items:center;background:var(--bg);color:var(--ink-2);font-family:var(--display);font-weight:700;font-size:15px;border:1px solid var(--line)}
.tx-product{color:var(--ink);font-weight:600;line-height:1.3}
.tx-sub{margin-top:3px;color:var(--faint);font-size:12px}
.tx-chip{display:inline-flex;align-items:center;gap:6px;padding:5px 10px 5px 8px;border-radius:99px;font-size:12.5px;font-weight:600;white-space:nowrap}
.tx-chip.in{background:var(--in-soft);color:var(--in)}
.tx-chip.out{background:var(--out-soft);color:var(--out)}
.tx-qty{font-size:15px;font-weight:700;white-space:nowrap}
.tx-level{display:inline-flex;align-items:center;gap:8px;white-space:nowrap;color:var(--faint)}
.tx-level b{color:var(--ink);font-weight:700}
.tx-level span{color:var(--muted)}
.tx-note{max-width:220px;color:var(--muted);line-height:1.45;overflow-wrap:anywhere}
.tx-date{white-space:nowrap;color:var(--ink-2)}
.tx-date small{display:block;margin-top:3px;color:var(--faint);font-size:12px}

/* states */
.tx-skeleton{padding:8px 20px}
.tx-skel-row{display:flex;align-items:center;gap:14px;padding:14px 0;border-bottom:1px solid var(--line-2)}
.tx-skel-row:last-child{border-bottom:0}
.tx-skel{border-radius:8px;background:linear-gradient(90deg,#eef0f4 25%,#f6f7f9 50%,#eef0f4 75%);background-size:200% 100%;animation:tx-shimmer 1.4s infinite linear}
.tx-empty{padding:64px 20px;text-align:center}
.tx-empty-icon{width:54px;height:54px;margin:0 auto 16px;border-radius:16px;background:var(--accent-soft);color:var(--accent);display:grid;place-items:center}
.tx-empty h3{margin:0 0 6px;font-family:var(--display);font-size:20px;letter-spacing:-.4px}
.tx-empty p{margin:0 auto 20px;max-width:360px;color:var(--muted);font-size:14px;line-height:1.55}

/* pagination */
.tx-pagination{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;padding:14px 20px;border-top:1px solid var(--line)}
.tx-page-info{color:var(--muted);font-size:13px}
.tx-page-actions{display:flex;align-items:center;gap:8px}
.tx-page-actions button{display:inline-flex;align-items:center;gap:6px;min-height:36px;padding:0 12px;border:1px solid var(--line);border-radius:9px;background:#fff;color:var(--ink-2);font-size:13px;font-weight:600;cursor:pointer}
.tx-page-actions button:hover:not(:disabled){background:#fafbfc;border-color:#cfd4de}
.tx-page-actions button:disabled{opacity:.4;cursor:not-allowed}
.tx-page-number{padding:0 6px;color:var(--ink);font-size:13px;font-weight:600}

.tx-footer{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-top:22px;color:var(--faint);font-size:12.5px}

/* drawer */
.tx-drawer-root{position:fixed;inset:0;z-index:1000;display:flex;justify-content:flex-end;background:#12151c73;backdrop-filter:blur(3px);animation:tx-fade .18s ease-out}
.tx-drawer{width:100%;max-width:480px;height:100%;background:#fff;display:flex;flex-direction:column;box-shadow:-20px 0 60px #12151c33;animation:tx-slide .24s cubic-bezier(.2,.8,.2,1)}
.tx-drawer-head{display:flex;justify-content:space-between;align-items:flex-start;gap:16px;padding:24px 28px 18px}
.tx-drawer-head h2{margin:0;font-family:var(--display);font-size:24px;letter-spacing:-.7px}
.tx-drawer-head p{margin:6px 0 0;color:var(--muted);font-size:14px;line-height:1.5}
.tx-close{width:36px;height:36px;flex-shrink:0;border:0;border-radius:10px;background:var(--bg);color:var(--ink-2);display:grid;place-items:center;cursor:pointer}
.tx-close:hover{background:var(--line)}
.tx-drawer-body{flex:1;overflow-y:auto;padding:4px 28px 24px}
.tx-form{display:flex;flex-direction:column;gap:22px}
.tx-field{display:flex;flex-direction:column;gap:8px}
.tx-field>label,.tx-label{font-size:13.5px;font-weight:600;color:var(--ink)}
.tx-field small{color:var(--faint);font-size:12px}
.tx-req{color:var(--out)}
.tx-type-toggle{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.tx-type-option{display:flex;align-items:center;gap:10px;padding:12px 14px;border:1.5px solid var(--line);border-radius:13px;background:#fff;color:var(--ink-2);font-size:14px;font-weight:600;cursor:pointer;text-align:left;transition:border-color .15s,background .15s}
.tx-type-option:hover{border-color:#cfd4de}
.tx-type-option .ico{width:30px;height:30px;border-radius:9px;display:grid;place-items:center;background:var(--bg);color:var(--muted)}
.tx-type-option.sel-in{border-color:var(--in);background:var(--in-soft);color:#0a6b4b}
.tx-type-option.sel-in .ico{background:var(--in);color:#fff}
.tx-type-option.sel-out{border-color:var(--out);background:var(--out-soft);color:#a62b3a}
.tx-type-option.sel-out .ico{background:var(--out);color:#fff}
.tx-select{appearance:none;padding-right:38px;background:#fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' stroke='%236c7587' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m4 6 4 4 4-4'/%3E%3C/svg%3E") no-repeat right 12px center}
.tx-preview{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:12px;padding:14px 16px;border-radius:13px;background:var(--bg)}
.tx-preview div span{display:block;font-size:12px;color:var(--muted);margin-bottom:4px}
.tx-preview div b{font-family:var(--display);font-size:24px;letter-spacing:-.6px}
.tx-preview .arrow{color:var(--faint)}
.tx-preview .after.in b{color:var(--in)} .tx-preview .after.out b{color:var(--out)}
.tx-preview-hint{margin-top:-4px;color:var(--muted);font-size:12.5px;line-height:1.5}
.tx-stepper{display:grid;grid-template-columns:44px 1fr 44px;gap:8px}
.tx-stepper button{border:1px solid var(--line);background:#fff;border-radius:11px;color:var(--ink-2);cursor:pointer;display:grid;place-items:center}
.tx-stepper button:hover:not(:disabled){background:#fafbfc;border-color:#cfd4de}
.tx-stepper button:disabled{opacity:.4;cursor:not-allowed}
.tx-stepper input{text-align:center;font-size:16px;font-weight:700}
.tx-stepper input::-webkit-outer-spin-button,.tx-stepper input::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}
.tx-stepper input[type=number]{-moz-appearance:textfield}
.tx-textarea{min-height:88px;resize:vertical;line-height:1.5}
.tx-chips{display:flex;gap:6px;flex-wrap:wrap}
.tx-chips button{border:1px solid var(--line);background:#fff;color:var(--ink-2);border-radius:99px;padding:5px 11px;font-size:12.5px;cursor:pointer}
.tx-chips button:hover{border-color:var(--accent);color:var(--accent)}
.tx-field-foot{display:flex;justify-content:space-between;gap:10px}
.tx-drawer-foot{display:flex;gap:10px;padding:16px 28px;border-top:1px solid var(--line);background:#fff}
.tx-drawer-foot .tx-btn{flex:1}
.tx-drawer-foot .tx-secondary{flex:0 0 auto;min-width:96px}
.tx-confirm-in{background:var(--in);box-shadow:0 1px 2px #0c8a6040}
.tx-confirm-in:hover:not(:disabled){background:#0a7752}
.tx-confirm-out{background:var(--out);box-shadow:0 1px 2px #d03a4b40}
.tx-confirm-out:hover:not(:disabled){background:#b9303f}
.tx-no-products{padding:30px 0;text-align:center}
.tx-no-products h3{margin:0 0 6px;font-family:var(--display);font-size:20px}
.tx-no-products p{margin:0 0 18px;color:var(--muted);font-size:14px;line-height:1.55}
.tx-spinner{display:inline-block;width:15px;height:15px;border:2px solid #ffffff80;border-top-color:#fff;border-radius:50%;animation:tx-spin .7s linear infinite}
.tx-spinner.dark{border-color:#cbd0da;border-top-color:var(--accent)}

@keyframes tx-spin{to{transform:rotate(360deg)}}
@keyframes tx-shimmer{to{background-position:-200% 0}}
@keyframes tx-fade{from{opacity:0}to{opacity:1}}
@keyframes tx-slide{from{transform:translateX(32px);opacity:.6}to{transform:none;opacity:1}}
@media (prefers-reduced-motion:reduce){.tx-drawer-root,.tx-drawer,.tx-skel,.tx-spinner{animation:none}}

/* responsive */
@media(max-width:1000px){
  .tx-stats{grid-template-columns:repeat(2,minmax(0,1fr))}
  .tx-stat:nth-child(3){border-left:0}
  .tx-stat:nth-child(n+3){border-top:1px solid var(--line-2)}
}
@media(max-width:760px){
  .tx-nav-inner{padding:10px 16px}
  .tx-brand-sub{display:none}
  .tx-container{padding:24px 16px 36px}
  .tx-heading h1{font-size:32px}
  .tx-actions{width:100%}.tx-actions .tx-btn{flex:1}
  .tx-stat{padding:16px}.tx-stat-value{font-size:28px}
  .tx-toolbar{padding:14px}
  .tx-search-wrap{min-width:100%}
  .tx-seg{flex:1}.tx-seg button{flex:1}
  .tx-count{display:none}
  .tx-table{min-width:0;display:block}
  .tx-table thead{display:none}
  .tx-table tbody{display:block}
  .tx-table tr{display:grid;grid-template-columns:1fr auto;grid-template-areas:"product qty" "move date" "level level" "note note";gap:10px 12px;padding:16px;border-bottom:1px solid var(--line-2)}
  .tx-table tbody tr:last-child{border-bottom:0}
  .tx-table td{padding:0;border:0;background:transparent !important}
  .tx-table .c-product{grid-area:product}.tx-table .c-qty{grid-area:qty;text-align:right}
  .tx-table .c-move{grid-area:move}.tx-table .c-date{grid-area:date;text-align:right}
  .tx-table .c-level{grid-area:level;padding:10px 12px;border-radius:10px;background:var(--bg) !important}
  .tx-table .c-note{grid-area:note;max-width:none}
  .tx-table .c-note.empty{display:none}
  .tx-pagination{padding:14px}
  .tx-footer{flex-direction:column}
  .tx-drawer{max-width:none}
  .tx-drawer-head{padding:20px 20px 14px}.tx-drawer-body{padding:4px 20px 20px}.tx-drawer-foot{padding:14px 20px}
}
@media(max-width:380px){.tx-stat-value{font-size:24px}.tx-type-toggle{gap:7px}.tx-type-option{padding:10px}}
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
    minus: <path d="M5 12h14" />,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>,
    refresh: <><path d="M20 11a8 8 0 0 0-14.5-4M4 4v4h4" /><path d="M4 13a8 8 0 0 0 14.5 4M20 20v-4h-4" /></>,
    close: <path d="M6 6l12 12M18 6L6 18" />,
    left: <path d="M15 6l-6 6 6 6" />,
    right: <path d="M9 6l6 6-6 6" />,
    arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
    swap: <><path d="M7 4L3 8l4 4M3 8h14" /><path d="M17 20l4-4-4-4M21 16H7" /></>,
    box: <><path d="M21 8l-9-5-9 5 9 5 9-5z" /><path d="M3 8v8l9 5 9-5V8M12 13v8" /></>,
    check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
    alert: <><circle cx="12" cy="12" r="9" /><path d="M12 8v5M12 16.5v.01" /></>,
  };
  return <svg {...p}>{paths[name]}</svg>;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
function extractProducts(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.products)) return data.products;
  if (Array.isArray(data?.data?.products)) return data.data.products;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

function extractTransactions(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.transactions)) return data.transactions;
  if (Array.isArray(data?.data?.transactions)) return data.data.transactions;
  return [];
}

function formatDate(value) {
  if (!value) return { date: "—", time: "" };
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return { date: "—", time: "" };
  return {
    date: date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
    time: date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
  };
}

function getErrorMessage(error) {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    "Something went wrong. Please try again."
  );
}

const fmt = (n) => Number(n || 0).toLocaleString("en-IN");
const NOTE_SUGGESTIONS = {
  IN: ["Supplier delivery", "Customer return", "Stock count correction"],
  OUT: ["Customer order", "Damaged goods", "Stock count correction"],
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({ productId: "", type: "IN", quantity: "1", note: "" });

  const loadTransactions = useCallback(async (requestedPage = 1, isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    setError("");

    try {
      const [transactionResponse, productResponse] = await Promise.all([
        api.get("/transactions", { params: { page: requestedPage, limit: 10 } }),
        api.get("/products"),
      ]);

      const transactionData = transactionResponse.data;
      const transactionList = extractTransactions(transactionData);
      const productList = extractProducts(productResponse.data);

      setTransactions(transactionList);
      setProducts(productList);

      setPagination(
        transactionData?.pagination ?? {
          page: requestedPage,
          limit: 10,
          total: transactionList.length,
          totalPages: transactionList.length ? 1 : 0,
        }
      );
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadTransactions(page);
  }, [page, loadTransactions]);

  const closeModal = useCallback(() => {
    if (saving) return;
    setModalOpen(false);
    setError("");
  }, [saving]);

  // Close drawer with Escape and lock page scroll while it is open
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

  const filteredTransactions = useMemo(() => {
    const query = search.trim().toLowerCase();
    return transactions.filter((transaction) => {
      const matchesSearch =
        !query ||
        String(transaction.productName ?? "").toLowerCase().includes(query) ||
        String(transaction.sku ?? "").toLowerCase().includes(query) ||
        String(transaction.note ?? "").toLowerCase().includes(query);
      const matchesType = typeFilter === "ALL" || transaction.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [transactions, search, typeFilter]);

  const stockInItems = transactions.filter((item) => item.type === "IN");
  const stockOutItems = transactions.filter((item) => item.type === "OUT");
  const stockInCount = stockInItems.length;
  const stockOutCount = stockOutItems.length;
  const unitsIn = stockInItems.reduce((sum, t) => sum + Number(t.quantity || 0), 0);
  const unitsOut = stockOutItems.reduce((sum, t) => sum + Number(t.quantity || 0), 0);
  const pageTotal = stockInCount + stockOutCount;
  const inShare = pageTotal ? (stockInCount / pageTotal) * 100 : 0;

  const totalPages = Math.max(1, Number(pagination.totalPages) || 1);
  const filtersActive = search.trim() !== "" || typeFilter !== "ALL";

  const selectedProduct = products.find(
    (product) => String(product._id ?? product.id) === form.productId
  );
  const selectedQuantity = Number(selectedProduct?.quantity ?? selectedProduct?.stock ?? 0);
  const formQty = Number(form.quantity);
  const validQty = Number.isInteger(formQty) && formQty > 0;
  const projected = !selectedProduct
    ? null
    : form.type === "IN"
    ? selectedQuantity + (validQty ? formQty : 0)
    : selectedQuantity - (validQty ? formQty : 0);

  function openModal(type = "IN") {
    setError("");
    setSuccess("");
    setForm({
      productId: String(products[0]?._id ?? products[0]?.id ?? ""),
      type,
      quantity: "1",
      note: "",
    });
    setModalOpen(true);
  }

  function stepQuantity(delta) {
    setForm((current) => {
      const base = Number.isInteger(Number(current.quantity)) ? Number(current.quantity) : 0;
      let next = Math.max(1, base + delta);
      if (current.type === "OUT" && selectedQuantity > 0) next = Math.min(next, selectedQuantity);
      return { ...current, quantity: String(next) };
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!form.productId) {
      setError("Please select a product.");
      return;
    }

    const quantity = Number(form.quantity);

    if (!Number.isInteger(quantity) || quantity < 1) {
      setError("Quantity must be a positive whole number.");
      return;
    }

    if (form.type === "OUT" && quantity > selectedQuantity) {
      setError(`Only ${selectedQuantity} units are currently available.`);
      return;
    }

    if (form.note.length > 250) {
      setError("The note cannot exceed 250 characters.");
      return;
    }

    setSaving(true);

    try {
      const response = await api.post(`/products/${form.productId}/stock-movements`, {
        type: form.type,
        quantity,
        note: form.note.trim(),
      });

      setModalOpen(false);
      setSuccess(
        response.data?.message ||
          `Stock ${form.type === "IN" ? "added" : "removed"} successfully.`
      );

      setPage(1);
      await loadTransactions(1);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="tx-page">
      <style>{styles}</style>

      <nav className="tx-nav">
        <div className="tx-nav-inner">
          <div className="tx-brand">
            <div className="tx-logo">S</div>
            <div>
              <div className="tx-brand-name">StockWise</div>
              <div className="tx-brand-sub">Smart Inventory Management</div>
            </div>
          </div>

          <Link to="/dashboard" className="tx-back">
            <Icon name="left" size={15} /> Dashboard
          </Link>
        </div>
      </nav>

      <div className="tx-container">
        <section className="tx-heading">
          <div>
            <h1>Transactions</h1>
            <p>Every stock movement in one place, so your inventory always adds up.</p>
          </div>

          <div className="tx-actions">
            <button className="tx-btn tx-secondary" onClick={() => openModal("OUT")} type="button">
              <Icon name="out" /> Stock out
            </button>
            <button className="tx-btn tx-primary" onClick={() => openModal("IN")} type="button">
              <Icon name="plus" /> Stock in
            </button>
          </div>
        </section>

        {error && !modalOpen && (
          <div className="tx-message tx-error" role="alert">
            <span>
              <Icon name="alert" />
              {error}
            </span>
            <button type="button" className="tx-dismiss" onClick={() => setError("")} aria-label="Dismiss error">
              <Icon name="close" size={16} />
            </button>
          </div>
        )}

        {success && !modalOpen && (
          <div className="tx-message tx-success" role="status">
            <span>
              <Icon name="check" />
              {success}
            </span>
            <button type="button" className="tx-dismiss" onClick={() => setSuccess("")} aria-label="Dismiss success message">
              <Icon name="close" size={16} />
            </button>
          </div>
        )}

        <section className="tx-stats" aria-label="Summary">
          <article className="tx-stat">
            <div className="tx-stat-label"><span className="tx-dot acc" />Total transactions</div>
            <p className="tx-stat-value tx-num">{fmt(pagination.total)}</p>
            <div className="tx-stat-note">All recorded stock movements</div>
          </article>

          <article className="tx-stat">
            <div className="tx-stat-label"><span className="tx-dot in" />Stock in</div>
            <p className="tx-stat-value tx-num">{stockInCount}</p>
            <div className="tx-stat-note">{fmt(unitsIn)} units received on this page</div>
          </article>

          <article className="tx-stat">
            <div className="tx-stat-label"><span className="tx-dot out" />Stock out</div>
            <p className="tx-stat-value tx-num">{stockOutCount}</p>
            <div className="tx-stat-note">{fmt(unitsOut)} units sent out on this page</div>
          </article>

          <article className="tx-stat">
            <div className="tx-stat-label"><span className="tx-dot" />Products</div>
            <p className="tx-stat-value tx-num">{products.length}</p>
            <div className="tx-split" role="img" aria-label={`${stockInCount} stock in, ${stockOutCount} stock out on this page`}>
              <i className="in" style={{ width: `${inShare}%` }} />
              <i className="out" style={{ width: pageTotal ? `${100 - inShare}%` : 0 }} />
            </div>
          </article>
        </section>

        <section className="tx-panel">
          <div className="tx-toolbar">
            <div className="tx-search-wrap">
              <Icon name="search" size={17} />
              <input
                className="tx-input tx-search"
                type="search"
                placeholder="Search product, SKU or note"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                aria-label="Search transactions"
              />
            </div>

            <div className="tx-seg" role="group" aria-label="Filter by movement">
              {[
                ["ALL", "All"],
                ["IN", "Stock in"],
                ["OUT", "Stock out"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  className={typeFilter === value ? "on" : ""}
                  aria-pressed={typeFilter === value}
                  onClick={() => setTypeFilter(value)}
                >
                  {label}
                </button>
              ))}
            </div>

            {filtersActive && (
              <button
                type="button"
                className="tx-btn tx-ghost"
                onClick={() => {
                  setSearch("");
                  setTypeFilter("ALL");
                  setError("");
                  setSuccess("");
                }}
              >
                Clear filters
              </button>
            )}

            <button
              type="button"
              className="tx-btn tx-secondary tx-icon-btn"
              onClick={() => loadTransactions(page, true)}
              disabled={loading || refreshing}
              aria-label="Refresh transactions"
              title="Refresh"
            >
              {refreshing ? <span className="tx-spinner dark" /> : <Icon name="refresh" />}
            </button>
          </div>

          <div className="tx-table-wrap">
            {loading ? (
              <div className="tx-skeleton" aria-busy="true" aria-label="Loading transactions">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div className="tx-skel-row" key={i}>
                    <div className="tx-skel" style={{ width: 38, height: 38, borderRadius: 11 }} />
                    <div style={{ flex: 1 }}>
                      <div className="tx-skel" style={{ width: "32%", height: 12 }} />
                      <div className="tx-skel" style={{ width: "18%", height: 10, marginTop: 8 }} />
                    </div>
                    <div className="tx-skel" style={{ width: 80, height: 22, borderRadius: 99 }} />
                  </div>
                ))}
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div className="tx-empty">
                <div className="tx-empty-icon"><Icon name="swap" size={24} /></div>
                <h3>{transactions.length ? "No matching transactions" : "No transactions yet"}</h3>
                <p>
                  {transactions.length
                    ? "Nothing on this page matches your search or filter. Try a different keyword or clear the filters."
                    : "Record your first stock in or stock out to start building your history."}
                </p>

                {!transactions.length && (
                  <button
                    type="button"
                    className="tx-btn tx-primary"
                    onClick={() => openModal("IN")}
                    disabled={products.length === 0}
                  >
                    <Icon name="plus" /> Record stock in
                  </button>
                )}
              </div>
            ) : (
              <table className="tx-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Movement</th>
                    <th className="tx-r">Quantity</th>
                    <th>Stock level</th>
                    <th>Note</th>
                    <th>Date &amp; time</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredTransactions.map((transaction, index) => {
                    const stockIn = transaction.type === "IN";
                    const date = formatDate(transaction.createdAt);
                    const hasLevel =
                      transaction.previousQuantity != null || transaction.newQuantity != null;

                    return (
                      <tr key={transaction._id ?? `${transaction.productId}-${transaction.createdAt}-${index}`}>
                        <td className="c-product">
                          <div className="tx-product-wrap">
                            <span className="tx-product-avatar">
                              {(transaction.productName || "P").charAt(0).toUpperCase()}
                            </span>
                            <div>
                              <div className="tx-product">{transaction.productName || "Unknown product"}</div>
                              <div className="tx-sub">SKU {transaction.sku || "—"}</div>
                            </div>
                          </div>
                        </td>

                        <td className="c-move">
                          <span className={`tx-chip ${stockIn ? "in" : "out"}`}>
                            <Icon name={stockIn ? "in" : "out"} size={14} />
                            {stockIn ? "Stock in" : "Stock out"}
                          </span>
                        </td>

                        <td className="c-qty tx-r">
                          <span className="tx-qty tx-num" style={{ color: stockIn ? "var(--in)" : "var(--out)" }}>
                            {stockIn ? "+" : "−"}
                            {fmt(transaction.quantity)}
                          </span>
                        </td>

                        <td className="c-level">
                          {hasLevel ? (
                            <span className="tx-level tx-num">
                              <span>{transaction.previousQuantity == null ? "—" : fmt(transaction.previousQuantity)}</span>
                              <Icon name="arrow" size={13} />
                              <b>{transaction.newQuantity == null ? "—" : fmt(transaction.newQuantity)}</b>
                            </span>
                          ) : (
                            "—"
                          )}
                        </td>

                        <td className={`c-note tx-note${transaction.note ? "" : " empty"}`}>
                          {transaction.note || "—"}
                        </td>

                        <td className="c-date tx-date">
                          {date.date}
                          <small>{date.time}</small>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          <div className="tx-pagination">
            <span className="tx-page-info">
              {pagination.total
                ? `Page ${page} of ${totalPages} · ${fmt(pagination.total)} transactions`
                : "No transactions to display"}
            </span>

            <div className="tx-page-actions">
              <button
                type="button"
                disabled={loading || page <= 1}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
              >
                <Icon name="left" size={14} /> Previous
              </button>

              <span className="tx-page-number tx-num">{page} / {totalPages}</span>

              <button
                type="button"
                disabled={loading || page >= totalPages}
                onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
              >
                Next <Icon name="right" size={14} />
              </button>
            </div>
          </div>
        </section>

        <footer className="tx-footer">
          <span>StockWise · Inventory Management</span>
          <span>Every movement updates your product stock history.</span>
        </footer>
      </div>

      {modalOpen && (
        <div
          className="tx-drawer-root"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <aside className="tx-drawer" role="dialog" aria-modal="true" aria-labelledby="tx-modal-title">
            <div className="tx-drawer-head">
              <div>
                <h2 id="tx-modal-title">Record stock movement</h2>
                <p>
                  {form.type === "IN"
                    ? "Add received stock to your inventory."
                    : "Record stock leaving your inventory."}
                </p>
              </div>

              <button type="button" className="tx-close" disabled={saving} onClick={closeModal} aria-label="Close">
                <Icon name="close" size={18} />
              </button>
            </div>

            {products.length === 0 ? (
              <div className="tx-drawer-body">
                <div className="tx-no-products">
                  <div className="tx-empty-icon"><Icon name="box" size={24} /></div>
                  <h3>No products yet</h3>
                  <p>Add a product before recording a stock movement.</p>
                  <Link to="/products" className="tx-btn tx-primary">
                    Go to products <Icon name="arrow" size={15} />
                  </Link>
                </div>
              </div>
            ) : (
              <form className="tx-form" onSubmit={handleSubmit} style={{ display: "contents" }}>
                <div className="tx-drawer-body">
                  {error && (
                    <div className="tx-message tx-error" role="alert">
                      <span>
                        <Icon name="alert" />
                        {error}
                      </span>
                      <button type="button" className="tx-dismiss" onClick={() => setError("")} aria-label="Dismiss error">
                        <Icon name="close" size={16} />
                      </button>
                    </div>
                  )}

                  <div className="tx-form">
                    <div className="tx-field">
                      <span className="tx-label">
                        Movement type <span className="tx-req">*</span>
                      </span>

                      <div className="tx-type-toggle">
                        <button
                          type="button"
                          className={`tx-type-option ${form.type === "IN" ? "sel-in" : ""}`}
                          aria-pressed={form.type === "IN"}
                          onClick={() => setForm((current) => ({ ...current, type: "IN" }))}
                        >
                          <span className="ico"><Icon name="in" size={16} /></span>
                          Stock in
                        </button>

                        <button
                          type="button"
                          className={`tx-type-option ${form.type === "OUT" ? "sel-out" : ""}`}
                          aria-pressed={form.type === "OUT"}
                          onClick={() => setForm((current) => ({ ...current, type: "OUT" }))}
                        >
                          <span className="ico"><Icon name="out" size={16} /></span>
                          Stock out
                        </button>
                      </div>
                    </div>

                    <div className="tx-field">
                      <label htmlFor="tx-product">
                        Product <span className="tx-req">*</span>
                      </label>

                      <select
                        id="tx-product"
                        className="tx-select"
                        value={form.productId}
                        onChange={(event) => setForm((current) => ({ ...current, productId: event.target.value }))}
                        required
                      >
                        <option value="">Select a product</option>
                        {products.map((product) => {
                          const id = product._id ?? product.id;
                          const name = product.name ?? product.productName ?? "Unnamed";
                          const quantity = Number(product.quantity ?? product.stock ?? 0);
                          return (
                            <option key={id} value={String(id)}>
                              {name} ({quantity} in stock)
                            </option>
                          );
                        })}
                      </select>
                    </div>

                    <div className="tx-field">
                      <label htmlFor="tx-quantity">
                        Quantity <span className="tx-req">*</span>
                      </label>

                      <div className="tx-stepper">
                        <button
                          type="button"
                          onClick={() => stepQuantity(-1)}
                          disabled={!validQty || formQty <= 1}
                          aria-label="Decrease quantity"
                        >
                          <Icon name="minus" />
                        </button>

                        <input
                          id="tx-quantity"
                          className="tx-input tx-num"
                          type="number"
                          min="1"
                          max={form.type === "OUT" ? selectedQuantity : undefined}
                          step="1"
                          required
                          value={form.quantity}
                          onChange={(event) => setForm((current) => ({ ...current, quantity: event.target.value }))}
                          placeholder="0"
                        />

                        <button
                          type="button"
                          onClick={() => stepQuantity(1)}
                          disabled={form.type === "OUT" && validQty && formQty >= selectedQuantity}
                          aria-label="Increase quantity"
                        >
                          <Icon name="plus" />
                        </button>
                      </div>

                      <div className="tx-preview" aria-live="polite">
                        <div>
                          <span>Current stock</span>
                          <b className="tx-num">{selectedProduct ? fmt(selectedQuantity) : "—"}</b>
                        </div>
                        <Icon name="arrow" size={18} />
                        <div className={`after ${form.type === "IN" ? "in" : "out"}`}>
                          <span>After this movement</span>
                          <b className="tx-num">{projected == null ? "—" : fmt(projected)}</b>
                        </div>
                      </div>

                      {form.type === "OUT" && (
                        <div className="tx-preview-hint">
                          You can remove up to {fmt(selectedQuantity)} units of this product.
                        </div>
                      )}
                    </div>

                    <div className="tx-field">
                      <label htmlFor="tx-note">
                        Note <span style={{ color: "var(--faint)", fontWeight: 500 }}>(optional)</span>
                      </label>

                      <textarea
                        id="tx-note"
                        className="tx-input tx-textarea"
                        rows="3"
                        maxLength="250"
                        value={form.note}
                        onChange={(event) => setForm((current) => ({ ...current, note: event.target.value }))}
                        placeholder={form.type === "IN" ? "e.g. Supplier delivery" : "e.g. Customer order"}
                      />

                      <div className="tx-field-foot">
                        <div className="tx-chips">
                          {NOTE_SUGGESTIONS[form.type].map((text) => (
                            <button
                              key={text}
                              type="button"
                              onClick={() => setForm((current) => ({ ...current, note: text }))}
                            >
                              {text}
                            </button>
                          ))}
                        </div>
                        <small className="tx-num">{form.note.length}/250</small>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="tx-drawer-foot">
                  <button type="button" className="tx-btn tx-secondary" disabled={saving} onClick={closeModal}>
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className={`tx-btn tx-primary ${form.type === "IN" ? "tx-confirm-in" : "tx-confirm-out"}`}
                    disabled={saving || !products.length}
                  >
                    {saving ? (
                      <>
                        <span className="tx-spinner" />
                        Saving…
                      </>
                    ) : (
                      <>
                        <Icon name="check" />
                        {form.type === "IN" ? "Confirm stock in" : "Confirm stock out"}
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </aside>
        </div>
      )}
    </main>
  );
}