import { useState } from 'react';
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
  items: item[];
  totalAmount: number;
}

function App() {
  const [items, setItems] = useState<item[]>([{ description: "", quantity: 0, price: 0 }]);
  const [companyName, setcompanyName] = useState<string>("");
  const [companyAddress, setcompanyAddress] = useState<string>("");
  const [totalAmount, setTotalAmount] = useState<number>(0);

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


  return (
    <Router>
      <div className="App">
      <div className="logo-container">
  <img src="https://www.joulifestyle.com/wp-content/uploads/2024/10/Coloured-logo.png" alt="Company Logo" className="logo" />
</div> 

        <h1 className="app-title">Welcome to JOU Lifestyle</h1>
        <h1 className="generator">Invoice Generator</h1>
        <form className="form">
          <div className="Company-Details">
            <input
              type="text"
              className="input"
              placeholder="Enter Company's Name"
              value={companyName}
              onChange={(e) => setcompanyName(e.target.value)}
            />
            <input
              type="text"
              className="input"
              placeholder="Enter Company's Address"
              value={companyAddress}
              onChange={(e) => setcompanyAddress(e.target.value)}
            />
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
              <h3>Total: ${totalAmount}</h3>
            </div>
          </div>
          <Link to="/preview">
            <button className="preview-btn">Preview Invoice</button>
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
                items={items}
                totalAmount={totalAmount}
              />
            }
          />
        </Routes>

      </div>
    </Router>
  );
}

const InvoicePreview: React.FC<InvoiceProps> = ({ companyName, companyAddress, items, totalAmount }) => {
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
    <div ref={printRef} id="preview-container" className="invoice-preview">
      <h1>{companyName}</h1>
      <p>{companyAddress}</p>
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
        Total: $
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
