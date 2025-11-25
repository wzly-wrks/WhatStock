import { StatsCard } from "@/components/StatsCard";
import { InventoryCard } from "@/components/InventoryCard";
import { Package, DollarSign, TrendingUp, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { AddItemDialog } from "@/components/AddItemDialog";
import { FloatingActionButton } from "@/components/FloatingActionButton";

export default function Dashboard() {
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const [recentItems, setRecentItems] = useState([
    {
      id: "1",
      title: "Vintage Pokemon Card - Charizard Holo",
      category: "Trading Cards",
      condition: "Near Mint",
      purchasePrice: 150,
      sellingPrice: 299.99,
      quantity: 1,
      status: "in_stock" as const,
      tags: ["Pokemon", "Holo", "Rare"],
      isGiveaway: false,
    },
    {
      id: "2",
      title: "Funko Pop - Iron Man #01",
      category: "Collectibles",
      condition: "Mint",
      purchasePrice: 45,
      sellingPrice: 89.99,
      quantity: 3,
      status: "sold" as const,
      tags: ["Funko", "Marvel"],
      isGiveaway: false,
    },
    {
      id: "3",
      title: "Sealed Nike Sneakers - Air Jordan 1",
      category: "Shoes",
      condition: "New",
      purchasePrice: 200,
      sellingPrice: 450,
      quantity: 1,
      status: "draft" as const,
      tags: ["Sneakers", "Limited"],
      isGiveaway: false,
    },
    {
      id: "4",
      title: "Magic The Gathering - Black Lotus",
      category: "Trading Cards",
      condition: "Excellent",
      purchasePrice: 5000,
      sellingPrice: 8500,
      quantity: 1,
      status: "in_stock" as const,
      tags: ["MTG", "Power Nine"],
      isGiveaway: false,
    },
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-heading font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back! Here's your inventory overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Items"
          value={248}
          subtitle="132 in stock"
          icon={Package}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Total Value"
          value="$34,521"
          subtitle="Inventory worth"
          icon={DollarSign}
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Profit Margin"
          value="42%"
          subtitle="Average markup"
          icon={TrendingUp}
          trend={{ value: 3, isPositive: true }}
        />
        <StatsCard
          title="Orders"
          value={89}
          subtitle="This month"
          icon={ShoppingCart}
          trend={{ value: 15, isPositive: true }}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-heading font-bold">Recent Items</h2>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Card Size:</span>
            <input
              type="range"
              min="1"
              max="3"
              defaultValue="2"
              className="w-32 accent-primary"
              data-testid="slider-card-size"
              onChange={(e) => {
                const value = e.target.value;
                const cardGrid = document.getElementById('recent-items-grid');
                if (cardGrid) {
                  cardGrid.className = value === '1' 
                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4'
                    : value === '2'
                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
                    : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4';
                }
              }}
            />
            <span className="text-xs text-muted-foreground">({4} per row)</span>
          </div>
        </div>
        <div id="recent-items-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {recentItems.map((item) => (
            <InventoryCard
              key={item.id}
              {...item}
              onEdit={() => console.log("Edit", item.id)}
              onDuplicate={() => console.log("Duplicate", item.id)}
              onDelete={() => console.log("Delete", item.id)}
              onToggleGiveaway={() => {
                setRecentItems(recentItems.map(i =>
                  i.id === item.id ? { ...i, isGiveaway: !i.isGiveaway } : i
                ));
              }}
            />
          ))}
        </div>
      </div>

      <AddItemDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} />
      <FloatingActionButton onClick={() => setAddDialogOpen(true)} />
    </div>
  );
}
