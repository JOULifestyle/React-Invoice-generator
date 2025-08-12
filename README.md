📄 React Invoice Generator
A modern, fast, and responsive invoice generator built with React, TypeScript, and Vite.
It allows users to create, customize, and export professional invoices with ease.
---

🚀 Features
Create New Invoices – Add client details, products/services, prices, and tax.

Edit & Update – Modify invoice details dynamically which includes but not limited to personalizing invoice background and text colors, selecting a custom logo, and inputing business details, with color settings retained even after refreshing, dynamic Currency Selection – making the invoice adaptable for global use, Real-time Data & Auto-generated Invoice Numbers – Invoice numbers and dates are dynamically generated, reducing manual input.

Real-time Calculations – Automatic subtotal, tax, and total calculation.

Export & Print – Save invoices as PDF or print directly.

Persistent Storage – Save invoices in local storage for later use.

Responsive Design – Works seamlessly on desktop and mobile.

Fast Build & Hot Reload – Powered by Vite for instant updates.
---
🛠️ Tech Stack
Frontend Framework: React 19

Language: TypeScript

Routing: React Router DOM 7

Build Tool: Vite

Styling: CSS (custom styles or utility classes)

Linting: ESLint + TypeScript ESLint
---
📂 Project Structure
React-Invoice-generator/
│
├── public/              # Static assets
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
---
⚙️ Installation & Setup
1️⃣ Clone the repository
git clone https://github.com/JOULifestyle/React-Invoice-generator.git
cd react-invoice-generator
2️⃣ Install dependencies
npm install
3️⃣ Start development server
npm run dev
The app will be available at:
👉 http://localhost:5173
---
📦 Build for production
npm run build
The compiled files will be in the dist/ folder.
---
🖼️ Screenshots
<img src="invoicegeneratorpage1.png" alt="Invoice generator"/>
<img src="invoicegeneratorpage2.png" alt="Invoice generator"/>
---
📜 License
This project is licensed under the MIT License – you’re free to use, modify, and distribute.