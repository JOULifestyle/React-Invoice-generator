import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import React, { useRef } from "react";

interface item {
  description: string;
  quantity: number;
  price: number;
}

interface InvoiceProps {
  companyName: string;
  companyAddress: string;
  companyPhoneNumber: string;
  items: item[];
  totalAmount: number;
  logo?: string | null;
  bgColor: string;
  textColor: string;
  currency: string;
  selectedCurrency: string;
  buyerName: string;
  invoiceNumber: string;
}

function App() {
  const [items, setItems] = useState<item[]>([{ description: "", quantity: 0, price: 0 }]);
  const [companyName, setcompanyName] = useState<string>("");
  const [companyAddress, setcompanyAddress] = useState<string>("");
  const [companyPhoneNumber, setcompanyPhoneNumber] = useState<string>("");
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [logo, setLogo] = useState<string | null>(null);
  const [currency, setCurrency] = useState<string>("$");
  const [selectedCurrency, setSelectedCurrency] = useState<string>("$");
  const [buyerName, setBuyerName] = useState<string>("");
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().slice(0, 10).replace(/-/g, "");
  };

  const [invoiceSequence, setInvoiceSequence] = useState<number>(() => {
    const storedDate = localStorage.getItem("lastInvoiceDate");
    const storedSequence = Number(localStorage.getItem("invoiceSequence")) || 1000;
    return storedDate === getTodayDate() ? storedSequence : 1000;
  });

  const [invoiceDate, setInvoiceDate] = useState<string>(() => {
    return localStorage.getItem("lastInvoiceDate") || getTodayDate();
  });

  useEffect(() => {
    localStorage.setItem("invoiceSequence", invoiceSequence.toString());
    localStorage.setItem("lastInvoiceDate", invoiceDate);
  }, [invoiceSequence, invoiceDate]);

  const handleResetInvoiceNumber = () => {
    setInvoiceSequence(1000);
    setInvoiceDate(getTodayDate());
    localStorage.setItem("invoiceSequence", "1000");
    localStorage.setItem("lastInvoiceDate", getTodayDate());
  };

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

  const [bgColor, setBgColor] = useState<string>(localStorage.getItem("bgColor") || "#ffffff");
  const [textColor, setTextColor] = useState<string>(localStorage.getItem("textColor") || "#000000");

  useEffect(() => {
    localStorage.setItem("bgColor", bgColor);
    localStorage.setItem("textColor", textColor);
  }, [bgColor, textColor]);

  const generateInvoiceNumber = () => {
    const date = new Date();
    const formattedDate = date.toISOString().slice(0, 10).replace(/-/g, "");
    const randomNumber = Math.floor(1000 + Math.random() * 9000); // Random 4-digit number
    setInvoiceNumber(`${formattedDate}-${randomNumber}`);
  };

  const resetInvoiceNumbering = () => {
    generateInvoiceNumber();
  };

  const handleResetColors = () => {
    setBgColor("#ffffff");
    setTextColor("#000000");
    localStorage.removeItem("bgColor");
    localStorage.removeItem("textColor");
  };

  const handleChangeItem = (index: number, field: keyof item, value: string) => {
    const newItems = items.map((item, i) =>
      i === index ? { ...item, [field]: field === "quantity" || field === "price" ? Number(value) : value } : item
    );
    setItems(newItems);
    calculateTotalAmount(newItems);
  };

  const handleAddItem = () => {
    setItems([...items, { description: "", quantity: 0, price: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const calculateTotalAmount = (items: item[]) => {
    const total = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
    setTotalAmount(total);
  }; 

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };


  return (
    <Router>
      <div className="App">
      <div className="logo-container">
  <img src="https://www.joulifestyle.com/wp-content/uploads/2024/10/Coloured-logo.png" alt="Company Logo" className="logo" />
</div> 

        <h1 className="app-title">Welcome to JOU Lifestyle</h1>
        <h1 className="generator">Invoice Generator</h1>
        <div className="invoice-controls">
        
          <p><strong>Invoice Number:</strong> {invoiceNumber}</p>
        </div>

        <div className="color-picker">
          <label>
            Select Background Color:
            <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} />
          </label>
          <label>
            Select Text Color:
            <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} />
          </label>
          <button onClick={handleResetColors} className="reset-btn">Reset Colors</button>
        </div>

        <form className="form">
          <div className="company-container">
            <input
              type="text"
              className="input"
              placeholder="Enter Company Name"
              value={companyName}
              onChange={(e) => setcompanyName(e.target.value)}
            />
            <input
              type="text"
              className="input"
              placeholder="Enter Company Address"
              value={companyAddress}
              onChange={(e) => setcompanyAddress(e.target.value)}
            />
            <input
              type="text"
              className="input"
              placeholder="Enter Company Phone Number"
              value={companyPhoneNumber}
              onChange={(e) => setcompanyPhoneNumber(e.target.value)}
            />
            <input
               type="text"
               className="input"
               placeholder="Enter Customer Name"
               value={buyerName}
               onChange={(e) => setBuyerName(e.target.value)}
            />
            </div>

            <div className="logo-upload">
            <label htmlFor="company-logo" className="logo-label">
              Upload Company Logo:
            </label>
            <input type="file" accept="image/*" onChange={handleLogoUpload} className="logo-upload" />

          </div>

          <div className="currency-selector">
  <label htmlFor="currency">Currency:</label>
  <select
    id="currency"
    value={selectedCurrency}
    onChange={(e) => setSelectedCurrency(e.target.value)}
  >
    <option value="$">USD ($)</option>
    <option value="€">EUR (€)</option>
    <option value="£">GBP (£)</option>
    <option value="₦">NGN (₦)</option>
    <option value="₹">INR (₹)</option>
  </select>
</div>

          <h2 className="items-title">Items</h2>
          <div>
            {items.map((item, index) => (
              <div key={index} className="item-row">
                <input
                  type="text"
                  className="input item-name"
                  placeholder="Enter the item's name"
                  value={item.description}
                  onChange={(e) => handleChangeItem(index, "description", e.target.value)}
                />
            
                <input
                  type="number"
                  className="input quantity-input"
                  placeholder="Quantity"
                  value={item.quantity === 0 ? "" : item.quantity}
                  onChange={(e) => handleChangeItem(index, "quantity", e.target.value)}
                />
                <input
                  type="number"
                  className="input price-input"
                  placeholder="Price"
                  value={item.price === 0 ? "" : item.price}
                  onChange={(e) => handleChangeItem(index, "price", e.target.value)}
                />
                <button type="button" className="remove-item-btn" onClick={() => handleRemoveItem(index)}>
                  Remove
                </button>
            
              </div>
            ))}
            <button type="button" className="add-items-btn" onClick={handleAddItem}>
              Add Item
            </button>
            <div className="total-amount">
              <h3>Total: {selectedCurrency}
             {totalAmount.toLocaleString(undefined, {
             minimumFractionDigits: 2,
            maximumFractionDigits: 2,
  })}</h3>
            </div>
          </div>
          <Link to="/preview">
            <button className="preview-btn" onClick={generateNextInvoiceNumber}>Preview Invoice</button>
          </Link>
        </form>

        {/* React Router for Navigation */}
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
                currency={currency}
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

const InvoicePreview: React.FC<InvoiceProps> = ({ companyName, companyAddress, companyPhoneNumber, items, totalAmount, logo, bgColor, textColor, currency, selectedCurrency, buyerName, invoiceNumber }) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (printRef.current) {
      const printContents = printRef.current.innerHTML;
      const originalContents = document.body.innerHTML;

      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload(); // Reload to restore original content
    }
  };
  return (
    <div ref={printRef} id="preview-container" className="invoice-preview"style={{ backgroundColor: bgColor, color: textColor }}>
     {logo && <img src={logo} alt="Company Logo" className="invoice-logo" />} 
     <div className="invoice-header">
     <div className="company-details">
      <h1>{companyName}</h1>
      <p>{companyAddress}</p>
      <p>{companyPhoneNumber}</p>
      </div>
      <div className="buyer-details">
          <p><strong>Customer Name:</strong> {buyerName || "N/A"}</p>
          <p><strong>Invoice Number:</strong> {invoiceNumber}</p>
          <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
        </div>
      </div>
      <table className="invoice-table">
        <thead>
          <tr>
            <th>Description</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              <td>{item.description}</td>
              <td>{item.quantity}</td>
              <td>{item.price}</td>
              <td>{item.quantity * item.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>
        Total: {selectedCurrency}
  {totalAmount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
   })}
      </h3>
      <button className="print-btn" onClick={() => window.print()}>Print Invoice</button>
      <footer style={{ textAlign: "center", padding: "10px", marginTop: "20px", fontSize: "14px", color: "#555" }}>
  © {new Date().getFullYear()} Developed by JOU Lifestyle inc.
</footer>
    </div>

    
  );

  
};


export default App;
