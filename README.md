# 📄 React Invoice Generator

A modern, fast, and responsive invoice generator built with **React**, **TypeScript**, and **Vite**.  
It allows users to create, customize, and export professional invoices with ease.

---

## 🚀 Features

- **Create New Invoices** – Add client details, products/services, prices, and tax.  
- **Edit & Update** – Modify invoice details dynamically, including:
  - Personalizing invoice background and text colors  
  - Selecting a custom logo  
  - Adding business details  
  - Retaining color settings after refresh  
  - Dynamic currency selection for global adaptability  
- **Real-time Data & Auto-generated Invoice Numbers** – Invoice numbers and dates are generated automatically.  
- **Real-time Calculations** – Automatic subtotal, tax, and total calculation.  
- **Export & Print** – Save invoices as PDF or print directly.  
- **Persistent Storage** – Save invoices in local storage for later use.  
- **Responsive Design** – Works seamlessly on desktop and mobile.  
- **Fast Build & Hot Reload** – Powered by Vite for instant updates.  

---

## 🛠️ Tech Stack

- **Frontend Framework:** React 19  
- **Language:** TypeScript  
- **Routing:** React Router DOM 7  
- **Build Tool:** Vite  
- **Styling:** CSS (custom styles or utility classes)  
- **Linting:** ESLint + TypeScript ESLint  

---

## 📂 Project Structure

```plaintext
React-Invoice-generator/
│
├── public/              # Static assets
│   ├── invoicegeneratorpage1.png
│   ├── invoicegeneratorpage2.png
│
├── src/                 # Main application source code
│   ├── assets/
│   ├── App.tsx          # Main App component
│   ├── main.tsx         # Entry point
│   ├── App.css          # For styling
│   ├── index.css
│   ├── vite-env.d.ts
│
├── package.json         # Project dependencies
├── tsconfig.json        # TypeScript configuration
├── vite.config.ts       # Vite configuration
├── README.md            # Project documentation
⚙️ Installation & Setup
Clone the repository


git clone https://github.com/JOULifestyle/React-Invoice-generator.git
cd react-invoice-generator
Install dependencies


npm install
Start development server


npm run dev
The app will be available at: http://localhost:5173

📦 Build for production

npm run build
The compiled files will be in the dist/ folder.

🖼️ Screenshots
## 🖼️ Screenshots

<figure>
  <img src="./public/invoicegeneratorpage1.png" alt="Invoice generator — create view" />
  <figcaption><strong>Create / Edit view</strong> — enter client details, add items, upload logo, and customize colors.</figcaption>
</figure>

<figure>
  <img src="./public/invoicegeneratorpage2.png" alt="Invoice generator — preview view" />
  <figcaption><strong>Preview / Print view</strong> — final invoice layout ready for printing or PDF export.</figcaption>
</figure>


📜 License
This project is licensed under the MIT License – you’re free to use, modify, and distribute.