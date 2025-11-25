import { StatsCard } from "@/components/StatsCard";
import { InventoryCard } from "@/components/InventoryCard";
import { Package, DollarSign, TrendingUp, ShoppingCart, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { AddItemDialog } from "@/components/AddItemDialog";

export default function Dashboard() {
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const recentItems = [
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
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here's your inventory overview.</p>
        </div>
        <Button onClick={() => setAddDialogOpen(true)} data-testid="button-add-item">
          <Plus className="w-4 h-4 mr-2" />
          Add Item
        </Button>
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
          <h2 className="text-xl font-heading font-semibold">Recent Items</h2>
          <Button variant="ghost" size="sm">View All</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {recentItems.map((item) => (
            <InventoryCard
              key={item.id}
              {...item}
              onEdit={() => console.log("Edit", item.id)}
              onDuplicate={() => console.log("Duplicate", item.id)}
              onDelete={() => console.log("Delete", item.id)}
            />
          ))}
        </div>
      </div>

      <AddItemDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} />
    </div>
  );
}
