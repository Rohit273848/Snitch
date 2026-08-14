# Complete Documentation: `Home.jsx` Code Explanation

This document explains every single part of the [`Home.jsx`](file:///d:/Sheryian/full%20Stack%20Projects/Snitch/Frontend/src/features/products/pages/Home.jsx) file in simple, easy-to-understand terms.

---

## Table of Contents
1. [Overview](#1-overview)
2. [Imports & Dependencies](#2-imports--dependencies)
3. [Helper Functions & Icons](#3-helper-functions--icons)
4. [UI Sub-Components](#4-ui-sub-components)
   - [ProductCard](#a-productcard)
   - [ProductSkeleton](#b-productskeleton)
   - [EmptyProducts](#c-emptyproducts)
   - [ErrorState](#d-errorstate)
   - [ProductModal (Popup Preview)](#e-productmodal-popup-preview)
5. [Main `Home` Component Logic](#5-main-home-component-logic)
   - [State Variables](#a-state-variables)
   - [Fetching Products from Backend](#b-fetching-products-from-backend)
   - [Real-Time Search & Sorting (useMemo)](#c-real-time-search--sorting-usememo)
6. [JSX Layout & Render Flow](#6-jsx-layout--render-flow)

---

## 1. Overview

The `Home.jsx` page is the **main storefront** of the SNITCH web application. Its purpose is to:
- Fetch and show **all products from all independent sellers** in one place.
- Provide a **search bar** to find products by name, description, or seller name.
- Provide a **sorting dropdown** to sort products by price or date.
- Allow users to click on any product card to view a **full detail modal popup**.
- Adapt based on user role (e.g., displaying a **Dashboard** button if the user is a logged-in seller).

---

## 2. Imports & Dependencies

```javascript
import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useProduct } from "../hook/useProduct.js";
import { useSelector } from "react-redux";
```

| Import | Purpose |
| :--- | :--- |
| `useState` | Manages local component state (e.g. search text, selected product, error message). |
| `useEffect` | Runs side-effects when the page opens (e.g. fetching products from API). |
| `useMemo` | Caches expensive calculations (e.g. filtering & sorting products) so they only re-run when inputs change. |
| `Link` | React Router component for smooth client-side navigation without page reloads. |
| `useProduct` | Custom hook that provides `handleGetAllProducts()` to trigger API calls. |
| `useSelector` | Reads data directly from the global Redux store (`allProducts`, `loading`, `user`). |

---

## 3. Helper Functions & Icons

### `FontLoader()`
```javascript
function FontLoader() {
    useEffect(() => {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap";
        document.head.appendChild(link);
    }, []);
    return null;
}
```
- Automatically injects Google Fonts (`Hanken Grotesk` for headings/body and `JetBrains Mono` for prices & tags) into the HTML `<head>`.

### `currencySymbol`
```javascript
const currencySymbol = { INR: "₹", USD: "$", EUR: "€", GBP: "£", JPY: "¥" };
```
- A simple dictionary mapping currency codes to symbols (e.g., `INR` → `₹`).

### Icon Components (`SearchIcon`, `SortIcon`, `PackageIcon`, `AlertIcon`, `UserBadgeIcon`, `XIcon`, `ArrowIcon`)
- Small inline SVG components that render minimalist vector icons for search, sort, package fallback, user badges, close buttons, and arrows.

---

## 4. UI Sub-Components

### A. `ProductCard`
```javascript
function ProductCard({ product, onClick }) { ... }
```
- **What it does**: Renders a single product card in the storefront grid.
- **Key Features**:
  1. **Thumbnail Image**: Displays the first product image (`product.images[0]`). If no image exists, shows a fallback package icon.
  2. **Seller Badge**: Displays `@seller_username` or seller name at the top-left of the image.
  3. **Photo Count**: Displays a `+N MORE` badge if the product has multiple photos.
  4. **Title & Description**: Shows product title (highlighted in yellow on hover) and description truncated to 2 lines.
  5. **Price formatting**: Formats prices using `toLocaleString("en-IN")` alongside the currency symbol.
  6. **Hover Animation**: Bottom yellow line expands on hover. Clicking the card triggers `onClick(product)` to open the preview modal.

---

### B. `ProductSkeleton`
```javascript
function ProductSkeleton() { ... }
```
- **What it does**: Renders an animated placeholder box (`animate-pulse`) while the backend API request is loading.

---

### C. `EmptyProducts`
```javascript
function EmptyProducts({ onReset }) { ... }
```
- **What it does**: Renders a stylized empty state message when no products match the user's search query or no products exist. Includes a "Clear Search Filter" button.

---

### D. `ErrorState`
```javascript
function ErrorState({ onRetry }) { ... }
```
- **What it does**: Displays an error message box if the backend fails to respond, featuring a "Retry Loading" button.

---

### E. `ProductModal` (Popup Preview)
```javascript
function ProductModal({ product, onClose }) { ... }
```
- **What it does**: A floating modal overlay that pops up when a user clicks any product card.
- **Key Features**:
  - Main image view + clickable thumbnail row to switch between multiple product photos.
  - Complete product details (full title, full description, price, currency, listed seller name).
  - "Add To Bag" action button and "Close Preview" button.

---

## 5. Main `Home` Component Logic

### A. State Variables
```javascript
const [mounted, setMounted] = useState(false);
const [fetchError, setFetchError] = useState(null);
const [searchTerm, setSearchTerm] = useState("");
const [sortBy, setSortBy] = useState("newest");
const [selectedProduct, setSelectedProduct] = useState(null);
```
- `searchTerm`: Stores what the user types in the search bar.
- `sortBy`: Stores current sort mode (`"newest"`, `"price-low"`, `"price-high"`, `"title"`).
- `selectedProduct`: Stores the active product object to display in the modal popup (or `null` when modal is closed).

---

### B. Fetching Products from Backend
```javascript
const { handleGetAllProducts } = useProduct();
const allProducts = useSelector(state => state.product.allProducts || []);
const loading = useSelector(state => state.product.loading);
const user = useSelector(state => state.auth.user);

const loadProducts = () => {
    setFetchError(null);
    handleGetAllProducts().catch((err) => {
        setFetchError(err?.response?.data?.message || "Failed to load products");
    });
};

useEffect(() => {
    loadProducts();
}, []);
```
1. `useEffect` runs once when `Home` mounts.
2. Calls `handleGetAllProducts()` from `useProduct()` hook.
3. The hook dispatches `setAllProducts(products)` to Redux.
4. `useSelector` extracts `allProducts`, `loading`, and current logged-in `user` from Redux state.

---

### C. Real-Time Search & Sorting (`useMemo`)

```javascript
const filteredProducts = useMemo(() => {
    if (!Array.isArray(allProducts)) return [];

    // 1. SEARCH FILTERING
    let result = allProducts.filter(p => {
        const query = searchTerm.toLowerCase();
        const titleMatch = p.title?.toLowerCase().includes(query);
        const descMatch = p.description?.toLowerCase().includes(query);
        const sellerMatch = 
            p.seller?.username?.toLowerCase().includes(query) ||
            p.seller?.name?.toLowerCase().includes(query) ||
            p.seller?.email?.toLowerCase().includes(query);

        return titleMatch || descMatch || sellerMatch;
    });

    // 2. SORTING LOGIC
    if (sortBy === "price-low") {
        result.sort((a, b) => (a.price?.amount || 0) - (b.price?.amount || 0));
    } else if (sortBy === "price-high") {
        result.sort((a, b) => (b.price?.amount || 0) - (a.price?.amount || 0));
    } else if (sortBy === "title") {
        result.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    } else {
        result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }

    return result;
}, [allProducts, searchTerm, sortBy]);
```
- **How search works**: Checks if `searchTerm` exists inside product title, description, or seller username/email.
- **How sorting works**: Re-orders the filtered list based on the chosen option (`price-low`, `price-high`, `title`, or `newest`).

---

## 6. JSX Layout & Render Flow

The return statement in `Home` renders in 4 clear stages:

1. **Top Header Bar**:
   - SNITCH logo button.
   - User email status badge.
   - "Dashboard" link if the user role is `seller`.

2. **Page Title & Search Controls**:
   - Hero header: `CURATED DROPS`.
   - Live Search Input with clear button.
   - Sort dropdown selector.

3. **Conditional Grid Body**:
   - If `loading === true`: Renders 8 `ProductSkeleton` cards.
   - If `fetchError` exists: Renders `ErrorState`.
   - If `filteredProducts.length === 0`: Renders `EmptyProducts`.
   - Otherwise: Renders `filteredProducts.map(...)` inside a responsive 4-column grid (`ProductCard`).

4. **Modal Popup Container**:
   - If `selectedProduct` is not `null`, renders `<ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />`.

---

## Summary Cheat Sheet

| Feature | Code Mechanism |
| :--- | :--- |
| **Data Source** | Redux store (`state.product.allProducts`) updated via `useProduct()` hook. |
| **Search** | Case-insensitive filter on title, description, and seller info. |
| **Sorting** | JS `Array.prototype.sort()` on price, title, or date. |
| **Modal Preview** | Controlled by `selectedProduct` local state. |
| **Role Awareness** | Reads `user.role` from `state.auth.user` to show seller controls. |
