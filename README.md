# WhatStock - Whatnot Inventory Management Application

A lightweight, fast desktop application for Whatnot marketplace sellers to track collectibles, manage sales, and export listings. Built with Tauri for a tiny ~2MB installer that launches instantly.

## Overview

WhatStock provides sellers with an intuitive platform to:
- **Catalog items** with photos, pricing, conditions, and tags
- **Track inventory** with real-time statistics and analytics
- **Manage sales** with buyer information and sold item tracking
- **Export listings** in Whatnot-compatible CSV format
- **Monitor profit margins** and inventory value
- **Mark items as giveaways** and manage promotional inventory

## Features

### Dashboard
- Real-time statistics cards showing:
  - Total inventory items
  - Total inventory value
  - Average profit margin
  - Recent orders count
- Recent items grid with quick actions
- Card size customization for better visibility
- Direct access to inventory management from dashboard

### Inventory Management
- **Grid/List View Toggle**: Switch between visual grid and list layouts
- **Advanced Filtering**: 
  - Search by item title and tags
  - Filter by category with collapsible sidebar
  - Filter by tags with visual indicators
- **Responsive Grid**: Automatically adjusts 1-5 columns based on screen size
- **Item Operations**:
  - Add new items with comprehensive form
  - Edit existing items with pre-filled data
  - Delete items from inventory
  - Mark items as sold with buyer information
  - Toggle giveaway status with visual badge
  - View detailed item information with 3D animations

### Item Details
- **Comprehensive Item Form**:
  - Title and category/subcategory
  - Condition (Mint, Near Mint, Good, Fair, Poor)
  - Purchase and selling prices
  - Quantity
  - Weight (optional)
  - Description
  - Tags for organization
  - Image upload (UI ready)

- **Item Display Card**:
  - Visual item information
  - Price and profit margin calculation
  - Giveaway badge indicator
  - Quick action buttons
  - 3D flip animation for detail view

### User Interface
- **Dark Theme Design**:
  - Professional #111111 black background
  - Bright #F4E43D yellow accent color for gaming aesthetic
  - Smooth animations and transitions
  - Hover elevation effects for better interaction feedback

- **Responsive Layout**:
  - Mobile-friendly design
  - Sidebar navigation for easy page access
  - Touch-optimized controls

## Tech Stack

### Desktop App
- **Tauri 2.0** - Lightweight native app framework (~2MB)
- **Rust** - Fast, secure backend
- **WebView2** - Native Windows rendering (already on Windows 10/11)

### Frontend
- **React 18** - UI framework with TypeScript
- **Vite** - Fast build tool and dev server
- **Wouter** - Lightweight routing
- **TanStack Query v5** - State management
- **Tailwind CSS** - Utility-first styling
- **Shadcn/ui** - High-quality component library
- **Radix UI** - Accessible UI primitives
- **Lucide React** - Icon library
- **React Hook Form** - Form state management
- **Zod** - Runtime type validation

### Storage
- **localStorage** - Persistent local storage (data survives app restarts)

## Installation

### Download (Recommended)
Download the latest release from [GitHub Releases](https://github.com/wzly-wrks/whatstock/releases):
- `WhatStock_x.x.x_x64-setup.exe` - Windows installer (~2MB)
- `WhatStock_x.x.x_x64_en-US.msi` - MSI installer

### Build from Source

#### Prerequisites
- Node.js (v18 or higher)
- Rust (install from https://rustup.rs)
- npm or yarn package manager

#### Setup

1. **Clone the repository**
```bash
git clone https://github.com/wzly-wrks/whatstock.git
cd whatstock
```

2. **Install dependencies**
```bash
npm install
```

3. **Run in development mode**
```bash
npm run tauri:dev
```

4. **Build for production**
```bash
npm run tauri:build
```

The installer will be created at `src-tauri/target/release/bundle/nsis/`

## Scripts

```bash
# Start web development server (browser mode)
npm run dev

# Start Tauri development (desktop app with hot reload)
npm run tauri:dev

# Build production desktop app
npm run tauri:build

# Build and bump version (patch: 1.0.0 -> 1.0.1)
npm run release:patch

# Build and bump version (minor: 1.0.0 -> 1.1.0)
npm run release:minor

# Build and bump version (major: 1.0.0 -> 2.0.0)
npm run release:major
```

## Project Structure

```
whatstock/
├── client/                    # Frontend application
│   └── src/
│       ├── pages/            # Route pages (Dashboard, Inventory, etc)
│       ├── components/       # Reusable React components
│       ├── lib/              # Utilities, storage, and helpers
│       ├── hooks/            # Custom React hooks
│       └── App.tsx           # Main app component
├── server/                    # Web server (for browser mode)
│   ├── routes.ts             # API endpoints
│   ├── storage.ts            # In-memory storage
│   └── index.ts              # Server entry point
├── shared/                    # Shared types and schemas
│   └── schema.ts             # Zod schemas and TypeScript types
├── src-tauri/                 # Tauri desktop app
│   ├── src/                  # Rust source code
│   ├── icons/                # App icons
│   └── tauri.conf.json       # Tauri configuration
├── assets/                    # App assets (icons, images)
└── README.md                 # This file
```

## Data Models

### InventoryItem

```typescript
{
  id: string;                           // Unique identifier
  title: string;                        // Item name
  category: string;                     // Primary category
  subCategory: string | null;           // Optional subcategory
  condition: string;                    // Item condition
  purchasePrice: number;                // Purchase price
  sellingPrice: number;                 // Selling/listing price
  quantity: number;                     // Item quantity
  weight: number | null;                // Optional weight
  description: string | null;           // Item description
  imageUrl: string | null;              // Optional image URL
  tags: string[] | null;                // Array of tags
  status: "in_stock" | "sold" | "draft"; // Current status
  buyerName: string | null;             // Buyer name (if sold)
  buyerEmail: string | null;            // Buyer email (if sold)
  soldDate: Date | null;                // Date marked as sold
  isGiveaway: 0 | 1;                    // Giveaway flag
  createdAt: Date;                      // Creation timestamp
}
```

## Usage Guide

### Adding an Item

1. Navigate to the **Inventory** page
2. Click the **Add Item** button (or floating + button)
3. Fill in the form:
   - **Title**: Item name (required)
   - **Category**: Select primary category (required)
   - **Condition**: Select item condition (required)
   - **Purchase Price**: Cost paid (required)
   - **Selling Price**: Listing price (required)
   - **Quantity**: Number of items (default: 1)
   - **Weight**: Optional weight for shipping
   - **Description**: Optional item details
   - **Tags**: Add multiple tags for organization
4. Click **Submit** to save

### Editing an Item

1. Hover over or click an item card
2. Click the **Edit** button
3. Modify any fields
4. Click **Update** to save

### Marking as Sold

1. Click an item to open the detail modal
2. Click **Mark as Sold**
3. Enter buyer name and email
4. Confirm to update status

### Managing Inventory

- **Search**: Use the search bar to find items by title or tags
- **Filter**: Use the sidebar to filter by category or tags
- **View**: Toggle between grid and list views
- **Card Size**: Adjust card size with the slider for better visibility
- **Delete**: Click delete button to remove an item
- **Giveaway Toggle**: Mark items as giveaways with the gift icon

## Data Storage

WhatStock stores all your data locally using browser localStorage. This means:
- ✅ **Data persists** between app restarts
- ✅ **No account required** - everything stays on your computer
- ✅ **Private** - your data never leaves your machine
- ⚠️ **Backup**: Export your data regularly (Settings > Export)

## Features Status

- ✅ Dashboard with statistics
- ✅ Inventory management (CRUD)
- ✅ Item filtering and search
- ✅ Mark as sold functionality
- ✅ Giveaway tracking
- ✅ Persistent local storage
- ✅ Lightweight desktop app (~2MB)
- ✅ Whatnot CSV export
- ⏳ Image upload functionality
- ⏳ Data import/export (backup/restore)
- ⏳ Order history analytics

## Contributing

When contributing to WhatStock:

1. Follow TypeScript best practices
2. Maintain dark theme design consistency
3. Keep component files minimal and focused
4. Use Shadcn/ui components when possible
5. Add proper error handling
6. Test all CRUD operations

## License

MIT License - See LICENSE file for details

---

Built with ❤️ for Whatnot sellers in ~/Los_Angeles by weezly.works & his army of robots.
