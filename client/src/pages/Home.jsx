import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import {
  Boxes,
  ArrowRight,
  Package,
  BellRing,
  ChartNoAxesCombined,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Clock3,
} from "lucide-react";

const features = [
  {
    Icon: Package,
    title: "Live stock tracking",
    text: "Manage product details, prices, and quantities in one organized workspace.",
  },
  {
    Icon: BellRing,
    title: "Low-stock alerts",
    text: "Identify products that need restocking before they affect your business.",
  },
  {
    Icon: ChartNoAxesCombined,
    title: "Clear inventory insights",
    text: "Understand stock value and inventory activity without messy spreadsheets.",
  },
];

const steps = [
  {
    number: "01",
    title: "Add your products",
    text: "Bring product names, SKUs, prices, and quantities together in one place.",
  },
  {
    number: "02",
    title: "Track stock movements",
    text: "Record incoming and outgoing stock with a clear transaction history.",
  },
  {
    number: "03",
    title: "Make better decisions",
    text: "View inventory value and low-stock products to plan your next move.",
  },
];

function DashboardPreview() {
  const products = [
    {
      name: "Wireless Headphones",
      sku: "WH-2048",
      quantity: 84,
      status: "In stock",
    },
    {
      name: "Minimal Desk Lamp",
      sku: "DL-1092",
      quantity: 7,
      status: "Low stock",
    },
    {
      name: "Everyday Backpack",
      sku: "BP-3051",
      quantity: 126,
      status: "In stock",
    },
  ];

  return (
    <div className="dashboard-window">
      <div className="dash-top">
        <span className="brand-mark small">
          <Boxes size={17} />
        </span>
        <b>
          StockWise <span className="muted">/ Overview</span>
        </b>
        <span className="live-pill">
          <span className="live-dot" /> Live overview
        </span>
      </div>

      <div className="dash-body">
        <aside className="dash-side">
          <b className="active">▦ &nbsp; Overview</b>
          <span>▣ &nbsp; Products</span>
          <span>↔ &nbsp; Transactions</span>
          <span>▥ &nbsp; Reports</span>
        </aside>

        <div className="dash-main">
          <div className="dash-heading">
            <div>
              <small>YOUR WORKSPACE</small>
              <h3>Inventory overview</h3>
              <p>Here&apos;s what&apos;s happening with your stock.</p>
            </div>
            <span className="date-pill">This month⌄</span>
          </div>

          <div className="stat-grid">
            <div className="stat-card">
              <span className="stat-icon blue">
                <Package size={19} />
              </span>
              <small>Total products</small>
              <strong>1,284</strong>
              <em>↗ 12.8% this month</em>
            </div>

            <div className="stat-card">
              <span className="stat-icon purple">
                <TrendingUp size={19} />
              </span>
              <small>Stock value</small>
              <strong>$48,290</strong>
              <em>↗ 8.2% this month</em>
            </div>

            <div className="stat-card">
              <span className="stat-icon amber">
                <BellRing size={19} />
              </span>
              <small>Low stock</small>
              <strong>12</strong>
              <em className="warning">Needs attention</em>
            </div>
          </div>

          <div className="dash-lower">
            <div className="chart-card">
              <b>Inventory activity</b>
              <small>Stock movement over time</small>

              <div className="chart">
                <svg
                  viewBox="0 0 400 100"
                  preserveAspectRatio="none"
                  role="img"
                  aria-label="Illustrative inventory activity chart"
                >
                  <defs>
                    <linearGradient
                      id="stockFill"
                      x1="0"
                      x2="0"
                      y1="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#4263eb"
                        stopOpacity=".25"
                      />
                      <stop
                        offset="100%"
                        stopColor="#4263eb"
                        stopOpacity="0"
                      />
                    </linearGradient>
                  </defs>

                  <path
                    d="M0 78 C35 73 40 46 78 57 S120 75 150 48 S195 42 222 48 S270 20 300 35 S345 48 365 18 L400 23 L400 100 L0 100Z"
                    fill="url(#stockFill)"
                  />

                  <path
                    d="M0 78 C35 73 40 46 78 57 S120 75 150 48 S195 42 222 48 S270 20 300 35 S345 48 365 18 L400 23"
                    fill="none"
                    stroke="#4263eb"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <div className="chart-days">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </div>

            <div className="summary-card">
              <b>Stock summary</b>

              {[
                ["In stock", "86%", "bluebar"],
                ["Low stock", "10%", "yellowbar"],
                ["Out of stock", "4%", "redbar"],
              ].map(([label, percentage, barClass]) => (
                <div className="summary-item" key={label}>
                  <div>
                    <span>{label}</span>
                    <b>{percentage}</b>
                  </div>

                  <div className="track">
                    <i
                      className={barClass}
                      style={{ width: percentage }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="product-preview">
            <b>Recently updated products</b>

            <div className="product-head">
              <span>PRODUCT</span>
              <span>SKU</span>
              <span>QTY</span>
              <span>STATUS</span>
            </div>

            {products.map((product) => (
              <div className="product-row" key={product.sku}>
                <b>{product.name}</b>
                <span>{product.sku}</span>
                <strong>{product.quantity}</strong>
                <span
                  className={
                    product.status === "Low stock" ? "low-pill" : "ok-pill"
                  }
                >
                  {product.status}
                </span>
              </div>
            ))}
          </div>

          <p className="preview-disclaimer">
            Illustrative dashboard preview — sample data only.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="landing-page">
      <Navbar />

      <section className="hero">
        <div className="hero-inner">
          <div className="hero-copy">
            <div className="eyebrow">
              <span>✦</span>
              SMART INVENTORY MANAGEMENT
            </div>

            <h1>
              Know your stock.
              <br />
              <span>Grow your business.</span>
            </h1>

            <p className="hero-text">
              Keep every product in check, catch low stock before it catches
              you, and make confident decisions — all from one clear workspace.
            </p>

            <div className="hero-buttons">
              <Link to="/register" className="primary">
                Start for free <ArrowRight size={19} />
              </Link>

              <a href="#features" className="secondary">
                Explore features <ArrowRight size={17} />
              </a>
            </div>

            <div className="trust-line">
              <CheckCircle2 size={17} />
              Simple setup <i>·</i> Clear insights <i>·</i> Built for growing
              teams
            </div>
          </div>

          <div className="hero-preview">
            <div className="floating-card">
              <span className="float-icon">
                <TrendingUp size={19} />
              </span>
              <div>
                <b>Stock value</b>
                <small>Looking healthy</small>
              </div>
              <strong>↗</strong>
            </div>

            <DashboardPreview />

            <div className="floating-card bottom-float">
              <span className="float-icon amber">
                <BellRing size={19} />
              </span>
              <div>
                <b>Low-stock alert</b>
                <small>Stay one step ahead</small>
              </div>
              <strong className="count">3</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="trust-strip" id="benefits">
        <small>LESS GUESSWORK. MORE CONTROL.</small>

        <div>
          <span>
            <CheckCircle2 size={18} /> One source of truth
          </span>
          <span>
            <ShieldCheck size={18} /> Better stock visibility
          </span>
          <span>
            <Clock3 size={18} /> Less manual work
          </span>
        </div>
      </section>

      <section className="features-section" id="features">
        <div className="section-heading">
          <small>MADE FOR YOUR EVERYDAY</small>
          <h2>
            Your inventory, <span>under control.</span>
          </h2>
          <p>
            Spend less time chasing spreadsheets and more time moving your
            business forward.
          </p>
        </div>

        <div className="feature-grid">
          {features.map(({ Icon, title, text }) => (
            <article className="feature-card" key={title}>
              <div className="feature-icon">
                <Icon size={25} />
              </div>

              <h3>{title}</h3>
              <p>{text}</p>

              <a href="#how-it-works">
                Learn more <ArrowRight size={16} />
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="how-section" id="how-it-works">
        <div>
          <small>A CLEARER WAY TO WORK</small>
          <h2>
            From stock chaos
            <br />
            to <span>clarity.</span>
          </h2>

          <p>
            Add your products, keep stock movements up to date, and get a live
            picture of your inventory without the busywork.
          </p>

          <Link to="/register" className="primary">
            Create your account <ArrowRight size={18} />
          </Link>
        </div>

        <div className="steps">
          {steps.map((step) => (
            <div className="step" key={step.number}>
              <b>{step.number}</b>
              <div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="final-cta">
        <span className="brand-mark">
          <Boxes size={25} />
        </span>

        <h2>Ready to get your stock in sync?</h2>
        <p>Start with a clearer view of your inventory today.</p>

        <Link to="/register" className="light-button">
          Create your account <ArrowRight size={18} />
        </Link>
      </section>

      <footer className="footer">
        <Link to="/" className="brand-lockup">
          <span className="brand-mark">
            <Boxes size={20} />
          </span>
          StockWise
        </Link>

        <p>Inventory clarity for growing businesses.</p>
        <small>© {new Date().getFullYear()} StockWise</small>
      </footer>
    </main>
  );
}