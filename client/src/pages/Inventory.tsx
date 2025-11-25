import { useState } from "react";
import { InventoryCard } from "@/components/InventoryCard";
import { FilterSidebar } from "@/components/FilterSidebar";
import { AddItemDialog } from "@/components/AddItemDialog";
import { TagFilter } from "@/components/TagFilter";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import { ItemDetailModal } from "@/components/ItemDetailModal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Grid3x3, List, Filter, X } from "lucide-react";

export default function Inventory() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(true);

  const [items, setItems] = useState([
    {
      id: "1",
      title: "Vintage Pokemon Card - Charizard Holo",
      category: "Trading Cards",
      condition: "Near Mint",
      purchasePrice: 150,
      sellingPrice: 299.99,
      quantity: 1,
      weight: 0.01,
      status: "in_stock" as const,
      imageUrl: "https://images.unsplash.com/photo-1606503153255-59d9b231b8f5?w=400&h=400&fit=crop",
      tags: ["Pokemon", "Holo", "Rare"],
      description: "First edition holographic Charizard in near mint condition.",
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
      weight: 0.5,
      status: "sold" as const,
      tags: ["Funko", "Marvel"],
      description: "Original Iron Man Funko Pop in mint condition with box.",
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
      weight: 2.5,
      status: "draft" as const,
      tags: ["Sneakers", "Limited"],
      description: "Brand new Air Jordan 1 sneakers, sealed in original box.",
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
      weight: 0.01,
      status: "in_stock" as const,
      tags: ["MTG", "Power Nine"],
      description: "Black Lotus from Alpha set, excellent condition with minimal wear.",
      isGiveaway: false,
    },
    {
      id: "5",
      title: "Signed Baseball - Babe Ruth",
      category: "Sports Memorabilia",
      condition: "Good",
      purchasePrice: 1200,
      sellingPrice: 2500,
      quantity: 1,
      weight: 0.3,
      status: "in_stock" as const,
      tags: ["Baseball", "Autographed"],
      description: "Authentic Babe Ruth signed baseball with certificate of authenticity.",
      isGiveaway: false,
    },
    {
      id: "6",
      title: "Supreme Box Logo Hoodie",
      category: "Fashion",
      condition: "Near Mint",
      purchasePrice: 300,
      sellingPrice: 650,
      quantity: 2,
      weight: 1.2,
      status: "in_stock" as const,
      tags: ["Supreme", "Streetwear"],
      description: "Supreme Box Logo hoodie in near mint condition, size large.",
      isGiveaway: false,
    },
  ]);

  const allTags = ["Pokemon", "Holo", "Rare", "Funko", "Marvel", "Sneakers", "Limited", "MTG", "Power Nine", "Autographed", "Baseball", "Supreme", "Streetwear"];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-heading font-bold text-foreground">Inventory</h1>
        <p className="text-muted-foreground mt-1">Manage your items and listings</p>
      </div>

      <TagFilter
        tags={allTags}
        selectedTags={selectedTags}
        onSelectionChange={setSelectedTags}
      />

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
            variant={filtersOpen ? "default" : "outline"}
            size="icon"
            onClick={() => setFiltersOpen(!filtersOpen)}
            data-testid="button-toggle-filters"
          >
            {filtersOpen ? <X className="w-4 h-4" /> : <Filter className="w-4 h-4" />}
          </Button>
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

      <div className={`grid gap-6 transition-all duration-300 ${filtersOpen ? "lg:grid-cols-[280px_1fr]" : "grid-cols-1"}`}>
        {filtersOpen && (
          <div className="animate-slide-up">
            <FilterSidebar onFilterChange={(filters) => console.log("Filters:", filters)} />
          </div>
        )}

        <div>
          <div className="mb-4 text-sm text-muted-foreground">
            Showing {items.length} items
          </div>
          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4" : "space-y-4"}>
            {items.map((item) => (
              <InventoryCard
                key={item.id}
                {...item}
                onClick={() => {
                  setSelectedItem(item);
                  setDetailModalOpen(true);
                }}
                onEdit={() => console.log("Edit", item.id)}
                onDuplicate={() => console.log("Duplicate", item.id)}
                onDelete={() => console.log("Delete", item.id)}
                onToggleGiveaway={() => {
                  setItems(items.map(i => 
                    i.id === item.id ? { ...i, isGiveaway: !i.isGiveaway } : i
                  ));
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <AddItemDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} />
      {selectedItem && (
        <ItemDetailModal
          open={detailModalOpen}
          onOpenChange={setDetailModalOpen}
          item={selectedItem}
          onMarkAsSold={(buyerName, buyerEmail) => {
            console.log("Marked as sold:", buyerName, buyerEmail);
          }}
        />
      )}
      <FloatingActionButton onClick={() => setAddDialogOpen(true)} />
    </div>
  );
}
