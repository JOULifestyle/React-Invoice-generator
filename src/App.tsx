import React, { useEffect, useRef, useState } from "react";
import type { FC, JSX } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";

interface Item {
  description: string;
  quantity: number;
  price: number;
}

interface InvoiceProps {
  companyName: string;
  companyAddress: string;
  companyPhoneNumber: string;
  items: Item[];
  totalAmount: number;
  logo?: string | null;
  bgColor: string;
  textColor: string;
  selectedCurrency: string;
  buyerName: string;
  invoiceNumber: string;
}
function App(): JSX.Element {
  // --- State (invoice fields) ---
  const [items, setItems] = useState<Item[]>([{ description: "", quantity: 0, price: 0 }]);
  const [companyName, setCompanyName] = useState<string>("");
  const [companyAddress, setCompanyAddress] = useState<string>("");
  const [companyPhoneNumber, setCompanyPhoneNumber] = useState<string>("");
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [logo, setLogo] = useState<string | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState<string>(localStorage.getItem("currency") || "$");
  const [buyerName, setBuyerName] = useState<string>("");
  const [bgColor, setBgColor] = useState<string>(() => localStorage.getItem("bgColor") || "#ffffff");
  const [textColor, setTextColor] = useState<string>(() => localStorage.getItem("textColor") || "#000000");

  // --- Invoice numbering using date + sequence persisted in localStorage ---
  const getTodayDate = () => new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const [invoiceSequence, setInvoiceSequence] = useState<number>(() => {
    const storedDate = localStorage.getItem("lastInvoiceDate");
    const storedSequence = Number(localStorage.getItem("invoiceSequence")) || 1000;
    return storedDate === getTodayDate() ? storedSequence : 1000;
  });
  const [invoiceDate, setInvoiceDate] = useState<string>(() => localStorage.getItem("lastInvoiceDate") || getTodayDate());

  useEffect(() => {
    localStorage.setItem("invoiceSequence", String(invoiceSequence));
    localStorage.setItem("lastInvoiceDate", invoiceDate);
  }, [invoiceSequence, invoiceDate]);

  const generateNextInvoiceNumber = () => {
    const today = getTodayDate();
    if (invoiceDate !== today) {
      setInvoiceSequence(1000);
      setInvoiceDate(today);
    } else {
      setInvoiceSequence((prev) => prev + 1);
    }
  };

  const invoiceNumber = `${invoiceDate}-${invoiceSequence}`;

  // --- Persist color & currency selections ---
  useEffect(() => localStorage.setItem("bgColor", bgColor), [bgColor]);
  useEffect(() => localStorage.setItem("textColor", textColor), [textColor]);
  useEffect(() => localStorage.setItem("currency", selectedCurrency), [selectedCurrency]);

  // --- Theme (light/dark) state & animated icon spin class ---
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  const [spinToggle, setSpinToggle] = useState<boolean>(false);

  useEffect(() => {
    document.body.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  const toggleTheme = () => {
    setSpinToggle(true);
    setTimeout(() => setSpinToggle(false), 300);
    setIsDark((prev) => !prev);
  };

  // --- Items handlers & calculations ---
  useEffect(() => calculateTotalAmount(items), [items]);

  const handleChangeItem = (index: number, field: keyof Item, value: string) => {
    const newItems = items.map((it, i) =>
      i === index
        ? {
            ...it,
            [field]: field === "quantity" || field === "price" ? Number(value === "" ? "0" : value) : value,
          }
        : it
    );
    setItems(newItems);
  };

  const handleAddItem = () => setItems([...items, { description: "", quantity: 0, price: 0 }]);

  const handleRemoveItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems.length ? newItems : [{ description: "", quantity: 0, price: 0 }]);
  };

  const calculateTotalAmount = (itemsList: Item[]) => {
    const total = itemsList.reduce((sum, it) => sum + it.quantity * it.price, 0);
    setTotalAmount(total);
  };

  // --- Logo upload ---
  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = () => setLogo(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleResetColors = () => {
    setBgColor("#ffffff");
    setTextColor("#000000");
    localStorage.removeItem("bgColor");
    localStorage.removeItem("textColor");
  };

  // --- Better print: open new window with preview content and print ---
  const handlePrint = () => {
  const printWindow = window.open('', '', 'height=800,width=800');
  if (!printWindow) return;

  const content = document.getElementById('invoicePreview')?.cloneNode(true) as HTMLElement;
  if (!content) return;

  // Remove elements with .no-print (extra safety)
  content.querySelectorAll('.no-print').forEach((el) => el.remove());

  const styleLinks = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
    .map((node) => (node as HTMLElement).outerHTML)
    .join('\n');

  printWindow.document.write(`
    <html>
      <head>
        <title>Invoice</title>
        ${styleLinks}
        <style>
          @media print {
            body {
              background: white !important;
              color: black !important;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
              margin: 0;
              padding: 0;
              display: flex;
              justify-content: center;
            }
            .invoice-preview {
              background: white !important;
              box-shadow: none !important;
              border: none !important;
            }
            .no-print {
              display: none !important;
            }
          }
        </style>
      </head>
      <body>
        ${content.outerHTML}
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
};


  return (
    <Router>
      <div className="app-header">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img
            src="Coloured-logo.png"
            alt="Brand"
            className="logo-small"
          />
          <div>
            <h1 className="app-title">JOU Lifestyle</h1>
            <div className="generator">Invoice Generator</div>
          </div>
        </div>

        <div className="header-actions">
          <button
            aria-label="Toggle theme"
            className={`theme-toggle ${spinToggle ? "spin" : ""}`}
            onClick={toggleTheme}
          >
            <span>{isDark ? "☀️" : "🌙"}</span>
          </button>
        </div>
      </div>

      <div className="App" style={{ backgroundColor: "var(--glass-bg)" }}>
        <div className="top-section">
          <div className="invoice-controls">
            <div>
              <strong>Invoice Number:</strong> <span className="muted">{invoiceNumber}</span>
            </div>
            <div className="small-controls">
              <button className="reset-btn" onClick={() => { setInvoiceSequence(1000); setInvoiceDate(getTodayDate()); }}>
                Reset Invoice #
              </button>
            </div>
          </div>

          <div className="color-picker">
            <label>
              Background:
              <input
                aria-label="Background color"
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="color-input"
              />
            </label>
            <label>
              Text:
              <input
                aria-label="Text color"
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="color-input"
              />
            </label>
            <button className="reset-btn" onClick={handleResetColors}>
              Reset Colors
            </button>
          </div>
        </div>

        <form className="form" onSubmit={(e) => e.preventDefault()}>
          <div className="company-container">
            <input
              className="input"
              type="text"
              placeholder="Company Name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
            <input
              className="input"
              type="text"
              placeholder="Company Address"
              value={companyAddress}
              onChange={(e) => setCompanyAddress(e.target.value)}
            />
            <input
              className="input"
              type="text"
              placeholder="Company Phone"
              value={companyPhoneNumber}
              onChange={(e) => setCompanyPhoneNumber(e.target.value)}
            />
            <input
              className="input"
              type="text"
              placeholder="Customer Name"
              value={buyerName}
              onChange={(e) => setBuyerName(e.target.value)}
            />
          </div>

          <div className="controls-row">
            <div className="logo-upload">
              <label htmlFor="company-logo" className="logo-label">
                Upload Logo
              </label>
              <input id="company-logo" type="file" accept="image/*" onChange={handleLogoUpload} />
            </div>

            <div className="currency-selector">
              <label htmlFor="currency">Currency:</label>
              <select
                id="currency"
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
                aria-label="Select currency"
              >
                <option value="$">USD ($)</option>
                <option value="€">EUR (€)</option>
                <option value="£">GBP (£)</option>
                <option value="₦">NGN (₦)</option>
                <option value="₹">INR (₹)</option>
              </select>
            </div>
          </div>

          <h2 className="items-title">Items</h2>

          <div>
            {items.map((it, idx) => (
              <div key={idx} className="item-row">
                <input
                  className="input item-name"
                  type="text"
                  placeholder="Item description"
                  value={it.description}
                  onChange={(e) => handleChangeItem(idx, "description", e.target.value)}
                />
                <input
                  className="input quantity-input"
                  type="number"
                  min={0}
                  placeholder="Qty"
                  value={it.quantity === 0 ? "" : it.quantity}
                  onChange={(e) => handleChangeItem(idx, "quantity", e.target.value)}
                />
                <input
                  className="input price-input"
                  type="number"
                  min={0}
                  step="0.01"
                  placeholder="Price"
                  value={it.price === 0 ? "" : it.price}
                  onChange={(e) => handleChangeItem(idx, "price", e.target.value)}
                />
                <button
                  type="button"
                  className="remove-item-btn"
                  aria-label={`Remove item ${idx + 1}`}
                  onClick={() => handleRemoveItem(idx)}
                >
                  Remove
                </button>
              </div>
            ))}

            <div className="items-actions">
              <button type="button" className="add-items-btn" onClick={handleAddItem}>
                Add Item
              </button>

              <div className="total-amount">
                <h3>
                  Total: {selectedCurrency}
                  {totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h3>
              </div>
            </div>
          </div>

          <Link to="/preview">
            <button
              type="button"
              className="preview-btn"
              onClick={() => {
                generateNextInvoiceNumber();
              }}
            >
              Preview Invoice
            </button>
          </Link>
        </form>

        {/* Routes */}
        <Routes>
          <Route
            path="/preview"
            element={
              <InvoicePreview
                companyName={companyName}
                companyAddress={companyAddress}
                companyPhoneNumber={companyPhoneNumber}
                items={items}
                totalAmount={totalAmount}
                logo={logo}
                bgColor={bgColor}
                textColor={textColor}
                selectedCurrency={selectedCurrency}
                buyerName={buyerName}
                invoiceNumber={invoiceNumber}
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

/* -------------------- Invoice Preview Component -------------------- */
const InvoicePreview: React.FC<InvoiceProps> = ({
  companyName,
  companyAddress,
  companyPhoneNumber,
  items,
  totalAmount,
  logo,
  bgColor,
  textColor,
  selectedCurrency,
  buyerName,
  invoiceNumber,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);

  const handlePrint = () => {
    if (!ref.current) return;
    // clone the preview HTML for printing
    const html = ref.current.outerHTML;
    // we rely on the print helper in App (but here we can open directly)
    const w = window.open("", "_blank", "width=900,height=700");
    if (!w) {
      alert("Please allow popups to print the invoice.");
      return;
    }

    const stylesheets = Array.from(document.styleSheets)
      .map((s) => {
        try {
          return s.href ? `<link rel="stylesheet" href="${s.href}">` : "";
        } catch {
          return "";
        }
      })
      .join("\n");

    w.document.open();
    w.document.write(`
      <html>
        <head>
          <title>Invoice - ${invoiceNumber}</title>
          ${stylesheets}
          <style>
            body { margin: 20px; -webkit-print-color-adjust: exact; print-color-adjust: exact; font-family: sans-serif; }
            .invoice-preview { background: ${bgColor} !important; color: ${textColor} !important; box-shadow: none !important; }
            .invoice-logo { max-width: 120px; height: auto; }
            .invoice-footer { text-align: center; }
            .print-btn, .preview-btn { display: none !important; }
            table { width: 100%; border-collapse: collapse; }
            th, td { padding: 6px; border: 1px solid #ddd; }
          </style>
        </head>
        <body>
          ${html}
        </body>
      </html>
    `);
    w.document.close();
    setTimeout(() => {
      w.print();
      w.close();
    }, 300);
  };

  return (
    <div
      ref={ref}
      id="preview-container"
      className="invoice-preview"
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      <div className="invoice-top">
        {logo ? <img src={logo} alt="Company Logo" className="invoice-logo" /> : null}
        <div className="invoice-header">
          <div className="company-details">
            <h1 className="invoice-company">{companyName || "Company Name"}</h1>
            <p className="muted">{companyAddress}</p>
            <p className="muted">{companyPhoneNumber}</p>
          </div>

          <div className="buyer-details">
            <p>
              <strong>Customer:</strong> {buyerName || "N/A"}
            </p>
            <p>
              <strong>Invoice #:</strong> {invoiceNumber}
            </p>
            <p>
              <strong>Date:</strong> {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      <table className="invoice-table">
        <thead>
          <tr>
            <th>Description</th>
            <th style={{ width: 80 }}>Quantity</th>
            <th style={{ width: 120 }}>Price</th>
            <th style={{ width: 120 }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it, idx) => (
            <tr key={idx}>
              <td>{it.description || "—"}</td>
              <td style={{ textAlign: "center" }}>{it.quantity}</td>
              <td style={{ textAlign: "right" }}>
                {selectedCurrency}
                {it.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </td>
              <td style={{ textAlign: "right" }}>
                {selectedCurrency}
                {(it.quantity * it.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="invoice-totals" style={{ textAlign: "right" }}>
        <strong>
          Total: {selectedCurrency}
          {totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </strong>
      </div>

      <div  className="no-print" style={{ marginTop: 18, display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
        <button className="print-btn"  onClick={handlePrint}>
          Print Invoice
        </button>
        <Link to="/">
          <button className="preview-btn">Back</button>
        </Link>
      </div>

      <footer className="invoice-footer">© {new Date().getFullYear()} Developed by JOU Lifestyle inc.</footer>
    </div>
  );
};

export default App;
