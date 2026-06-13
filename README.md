# Project Overview

## Fullstack E-commerce Dashboard & Storefront
This project represents an **E-commerce Platform** to demonstrate complex state mangement, data management and application architecture

**The storefront visually represents a platform where users can:**

* Register an account and sign in
* Browse product lists
* Search for products by name
* Filter products based on categories
* Add products to cart
* Place an order via Paystack gateway on the checkout page

**The ADMIN  Dashboard visually represents a platform where an Admin can:**

  * View gross total sales
  * View daily sales on barchart
  * View all available products in inventory
  * Add custom product to database

# Tech Stack Used
### NEXTjs Framework
* For handling routing, server-side rendering (SSR), and static site generation.
* It makes my app fast by pre-rendering pages and optimizing how data is fetched.

### Shadcn UI
* It provides raw, uncompiled, fully editable UI source files that can be used into my project. 

### Typescript Language
* Enforces strict, type-safe development across the codebase.
* It catches coding and type errors during compilation before your code is ever built or deployed.

### Supabase Authentication
* It manages user logins, sign-ups, and session security.

### Supabase Database
*  A PostgreSQL database to store users, products and orders data
*  Used to create images storage bucket

### Paystack API
* Handles secure payment processing

### Zustand
* Manages local client state.
* Ensures persistence of items added to cart

### Tanstack Query
  * Manages remote server data
  *  It fetches, caches, auto-refetches, and updates remote data from the database.
    
### React Hook Form
* Handles complex form validation and step workflows
* It captures checkout address details, credentials, and user data while checking fields against Zod schema conditions to minimize re-renders.

### TailwindCSS
 * It is used to style components directly in the TSX files using pre-defined classes.

### Google Fonts
* It is used to implement optimized web fonts.

# File Structure
```
├── src/                       
│   ├── app/
        └── (main pages)/      # Grouped pages                
│   ├── components/            # Global visual UI
│   │   └── shared/            # shared components
│   ├── features/              
│   │   ├── admin/             # Analytics graphs and inventory dashboards
│   │   ├── auth/              # Credential schemas and authentication flows
│   │   ├── cart/              # Step wizards, and validation
│   │   └── products/          # Catalog grids, search filters, and cards
│   ├── store/                 # Zustand persistent local store setups
│   └── utils/                 # Supabase server/client initialization logic

```

# Installation

First, run the development server:

```bash
pnpm install- to install node modules
pnpm dev - to open project on browser

```

