import { useState } from "react";
import { InventoryCard } from "@/components/InventoryCard";
import { FilterSidebar } from "@/components/FilterSidebar";
import { AddItemDialog } from "@/components/AddItemDialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Search, Grid3x3, List } from "lucide-react";

export default function Inventory() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const items = [
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
    {
      id: "5",
      title: "Signed Baseball - Babe Ruth",
      category: "Sports Memorabilia",
      condition: "Good",
      purchasePrice: 1200,
      sellingPrice: 2500,
      quantity: 1,
      status: "in_stock" as const,
      tags: ["Baseball", "Autographed"],
    },
    {
      id: "6",
      title: "Supreme Box Logo Hoodie",
      category: "Fashion",
      condition: "Near Mint",
      purchasePrice: 300,
      sellingPrice: 650,
      quantity: 2,
      status: "in_stock" as const,
      tags: ["Supreme", "Streetwear"],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Inventory</h1>
          <p className="text-muted-foreground mt-1">Manage your items and listings</p>
        </div>
        <Button onClick={() => setAddDialogOpen(true)} data-testid="button-add-item">
          <Plus className="w-4 h-4 mr-2" />
          Add Item
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search items..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="input-search"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("grid")}
            data-testid="button-view-grid"
          >
            <Grid3x3 className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("list")}
            data-testid="button-view-list"
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[280px_1fr] gap-6">
        <div>
          <FilterSidebar onFilterChange={(filters) => console.log("Filters:", filters)} />
        </div>

        <div>
          <div className="mb-4 text-sm text-muted-foreground">
            Showing {items.length} items
          </div>
          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4" : "space-y-4"}>
            {items.map((item) => (
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
      </div>

      <AddItemDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} />
    </div>
  );
}
