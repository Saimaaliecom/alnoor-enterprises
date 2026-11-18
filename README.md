# Al-Noor Enterprises 🛍️

A modern, high-performance E-Commerce platform and wholesale portal with a Shopify-style Admin Dashboard, Google Cloud Firestore real-time database, and WhatsApp Cash-on-Delivery (COD) checkout.

## 🌟 Key Features

- **Storefront (`index.html`):**
  - Complete catalog of 130 household, personal care, and lifestyle essentials across 8 categories.
  - Interactive shopping cart with subtotal calculation, delivery fee logic (free over Rs 2,500), and automated WhatsApp Cash-on-Delivery order generation.
  - Instant search and category filtering with responsive UI.
  - 24/7 Wholesale & Inquiries Assistant Chatbot with quantity slab pricing guidance.
  - Real-time synchronization with Google Cloud Firestore (`onSnapshot`).

- **Shopify-Style Admin Console (`admin.html`):**
  - KPI Dashboard (total products, category counts, average pricing, stock metrics).
  - Product Catalog Manager (add, edit price/name/category, delete, search, and filter).
  - Category Management.
  - Real-Time Website Sections Customizer (Hero banner, Announcement bar, Trust badges, Contact info, Footer).
  - Chatbot & Wholesale Quantity Slabs Manager.
  - Cloud Firestore Database Sync & JSON backup export/restore.
  - Disguised hidden access links for store owners.

- **Cloud Database & Hosting:**
  - **Database:** Google Cloud Firestore (real-time document synchronization).
  - **Hosting:** Google Firebase Hosting.
  - **Live URL:** [https://al-noor-enterprises.web.app](https://al-noor-enterprises.web.app)

## 🚀 Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the local server:
   ```bash
   node server.js
   ```

3. Open in your browser:
   - **Storefront:** `http://localhost:5000`
   - **Admin Console:** `http://localhost:5000/admin.html`

## 📦 Deployment to Firebase

```bash
npx firebase-tools deploy --project al-noor-enterprises
```
