# LootLedger - Whatnot Inventory Management Application

A comprehensive inventory management application designed for Whatnot marketplace sellers to track collectibles, manage sales, and export listings in Whatnot's CSV format.

## Overview

LootLedger provides sellers with an intuitive platform to:
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

### Frontend
- **React 18** - UI framework with TypeScript
- **Vite** - Fast build tool and dev server
- **Wouter** - Lightweight routing
- **TanStack Query v5** - Server state management
- **Tailwind CSS** - Utility-first styling
- **Shadcn/ui** - High-quality component library
- **Radix UI** - Accessible UI primitives
- **Lucide React** - Icon library
- **React Hook Form** - Form state management
- **Zod** - Runtime type validation

### Backend
- **Express.js** - Web server framework
- **TypeScript** - Type-safe backend
- **Zod** - Request validation
- **Drizzle ORM** - Type-safe database toolkit

### Storage
- **In-Memory Storage** (MemStorage) - Current development storage
- **PostgreSQL** (recommended for production)

## Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

### Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd lootledger
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## How to Run

```bash
npm run dev
```

This command:
- Starts the Express backend API
- Launches the Vite frontend development server
- Enables hot module reloading for instant updates
- Serves both frontend and backend on port 5000

## Project Structure

```
lootledger/
├── client/                    # Frontend application
│   └── src/
│       ├── pages/            # Route pages (Dashboard, Inventory, etc)
│       ├── components/       # Reusable React components
│       ├── lib/              # Utilities and helpers
│       ├── hooks/            # Custom React hooks
│       └── App.tsx           # Main app component
├── server/                    # Backend application
│   ├── routes.ts             # API endpoints
│   ├── storage.ts            # Storage interface and implementation
│   ├── index.ts              # Server entry point
│   └── vite.ts               # Vite integration
├── shared/                    # Shared types and schemas
│   └── schema.ts             # Zod schemas and TypeScript types
└── README.md                 # This file
```

## API Endpoints

### Inventory Management

**Get all inventory items**
```
GET /api/inventory
Response: InventoryItem[]
```

**Get single inventory item**
```
GET /api/inventory/:id
Response: InventoryItem | 404
```

**Create new inventory item**
```
POST /api/inventory
Body: InsertInventoryItem
Response: InventoryItem (201)
```

**Update inventory item**
```
PATCH /api/inventory/:id
Body: Partial<InventoryItem>
Response: InventoryItem | 404
```

**Delete inventory item**
```
DELETE /api/inventory/:id
Response: 200 | 404
```

**Mark item as sold**
```
POST /api/inventory/:id/sold
Body: { buyerName: string, buyerEmail: string }
Response: InventoryItem | 404
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
2. Click the **Add Item** button
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

## Features in Development

- ✅ Dashboard with statistics
- ✅ Inventory management (CRUD)
- ✅ Item filtering and search
- ✅ Mark as sold functionality
- ✅ Giveaway tracking
- ⏳ Whatnot CSV export
- ⏳ Order history page
- ⏳ Settings/preferences page
- ⏳ Image upload functionality
- ⏳ Database persistence (PostgreSQL)
- ⏳ User authentication

## Known Limitations

### Current Version
- **Storage**: In-memory storage resets on server restart (development only)
- **Images**: Image upload UI present but not yet functional
- **Export**: CSV export feature not yet implemented
- **Persistence**: Data not persisted between sessions

### Future Improvements
- Implement PostgreSQL database for data persistence
- Add cloud storage for item images
- Complete Whatnot CSV export functionality
- Add authentication and multi-user support
- Implement order tracking and analytics
- Add user preferences and settings

## Configuration

### Environment Variables

Currently, the application uses in-memory storage. For production deployment with PostgreSQL:

```bash
DATABASE_URL=postgresql://user:password@host/dbname
NODE_ENV=production
```

### Customization

**Dark Theme Colors** (`client/src/index.css`):
```css
--color-bg-primary: #111111;      /* Main background */
--color-accent: #F4E43D;          /* Yellow accent */
--color-text-primary: #FFFFFF;    /* Primary text */
```

## Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Building Components

The application uses Shadcn/ui components. To add new components:

1. Components are located in `client/src/components/ui`
2. Import and use in your pages
3. Customize with Tailwind CSS classes

## Deployment

### Production Deployment

For deploying to Replit or other platforms:

1. **Setup Database**:
   - Create PostgreSQL database
   - Set `DATABASE_URL` environment variable

2. **Install Dependencies**:
```bash
npm install
```

3. **Build and Run**:
```bash
npm run dev  # or use production build command
```

4. **Verify**:
   - Check all API endpoints respond
   - Verify data persistence
   - Test all CRUD operations

## Contributing

When contributing to LootLedger:

1. Follow TypeScript best practices
2. Maintain dark theme design consistency
3. Keep component files minimal and focused
4. Use Shadcn/ui components when possible
5. Add proper error handling
6. Test all CRUD operations

## Support

For issues or questions:
1. Check existing GitHub issues
2. Review the code comments
3. Check the development guidelines in `replit.md`

## License

MIT License - See LICENSE file for details

## Roadmap

### Phase 1 (Current)
- ✅ Core inventory management
- ✅ Dashboard and statistics
- ✅ Item filtering and search

### Phase 2 (Next)
- CSV export functionality
- Image upload and storage
- Order tracking system

### Phase 3 (Future)
- User authentication
- Multi-seller support
- Advanced analytics
- API integrations

---

Built with ❤️ for Whatnot sellers in ~/Los_Angeles by weezly.works & his army of robots. LootLedger helps you manage your collectibles efficiently and grow your business.
