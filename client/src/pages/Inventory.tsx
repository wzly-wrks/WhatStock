import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { InventoryCard } from "@/components/InventoryCard";
import { FilterSidebar } from "@/components/FilterSidebar";
import { AddItemDialog } from "@/components/AddItemDialog";
import { EditItemDialog } from "@/components/EditItemDialog";
import { TagFilter } from "@/components/TagFilter";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import { ItemDetailModal } from "@/components/ItemDetailModal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Grid3x3, List, Filter, X } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { InventoryItem } from "@shared/schema";

export default function Inventory() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [cardSize, setCardSize] = useState("2");

  // Fetch inventory items
  const { data: items = [], isLoading } = useQuery({
    queryKey: ["/api/inventory"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/inventory");
      return res.json() as Promise<InventoryItem[]>;
    },
  });

  // Delete mutation
  const deleteItemMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/inventory/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/inventory"] });
    },
  });

  // Toggle giveaway mutation
  const toggleGiveawayMutation = useMutation({
    mutationFn: (item: InventoryItem) =>
      apiRequest("PATCH", `/api/inventory/${item.id}`, {
        ...item,
        isGiveaway: item.isGiveaway ? 0 : 1,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/inventory"] });
    },
  });

  // Mark as sold mutation
  const markAsSoldMutation = useMutation({
    mutationFn: ({ id, buyerName, buyerEmail }: { id: string; buyerName: string; buyerEmail: string }) =>
      apiRequest("POST", `/api/inventory/${id}/sold`, { buyerName, buyerEmail }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/inventory"] });
      setDetailModalOpen(false);
    },
  });

  // Edit item mutation
  const editItemMutation = useMutation({
    mutationFn: (item: InventoryItem) =>
      apiRequest("PATCH", `/api/inventory/${item.id}`, item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/inventory"] });
      setEditDialogOpen(false);
      setEditingItem(null);
    },
  });

  // Mock items for initial state while API is being used
  const mockItems = [
    {
      id: "1",
      title: "Vintage Pokemon Card - Charizard Holo",
      category: "Trading Cards",
      condition: "Near Mint",
      purchasePrice: "150.00",
      sellingPrice: "299.99",
      quantity: 1,
      weight: "0.01",
      status: "in_stock" as const,
      imageUrl: "https://images.unsplash.com/photo-1606503153255-59d9b231b8f5?w=400&h=400&fit=crop",
      tags: ["Pokemon", "Holo", "Rare"],
      description: "First edition holographic Charizard in near mint condition.",
      isGiveaway: 0,
      buyerName: null,
      buyerEmail: null,
      soldDate: null,
      subCategory: null,
      createdAt: new Date(),
    },
    {
      id: "2",
      title: "Funko Pop - Iron Man #01",
      category: "Collectibles",
      condition: "Mint",
      purchasePrice: "45.00",
      sellingPrice: "89.99",
      quantity: 3,
      weight: "0.5",
      status: "sold" as const,
      tags: ["Funko", "Marvel"],
      description: "Original Iron Man Funko Pop in mint condition with box.",
      isGiveaway: 0,
      buyerName: null,
      buyerEmail: null,
      soldDate: null,
      subCategory: null,
      createdAt: new Date(),
    },
    {
      id: "3",
      title: "Sealed Nike Sneakers - Air Jordan 1",
      category: "Shoes",
      condition: "New",
      purchasePrice: "200.00",
      sellingPrice: "450.00",
      quantity: 1,
      weight: "2.5",
      status: "draft" as const,
      tags: ["Sneakers", "Limited"],
      description: "Brand new Air Jordan 1 sneakers, sealed in original box.",
      isGiveaway: 0,
      buyerName: null,
      buyerEmail: null,
      soldDate: null,
      subCategory: null,
      createdAt: new Date(),
    },
    {
      id: "4",
      title: "Magic The Gathering - Black Lotus",
      category: "Trading Cards",
      condition: "Excellent",
      purchasePrice: "5000.00",
      sellingPrice: "8500.00",
      quantity: 1,
      weight: "0.01",
      status: "in_stock" as const,
      tags: ["MTG", "Power Nine"],
      description: "Black Lotus from Alpha set, excellent condition with minimal wear.",
      isGiveaway: 0,
      buyerName: null,
      buyerEmail: null,
      soldDate: null,
      subCategory: null,
      createdAt: new Date(),
    },
    {
      id: "5",
      title: "Signed Baseball - Babe Ruth",
      category: "Sports Memorabilia",
      condition: "Good",
      purchasePrice: "1200.00",
      sellingPrice: "2500.00",
      quantity: 1,
      weight: "0.3",
      status: "in_stock" as const,
      tags: ["Baseball", "Autographed"],
      description: "Authentic Babe Ruth signed baseball with certificate of authenticity.",
      isGiveaway: 0,
      buyerName: null,
      buyerEmail: null,
      soldDate: null,
      subCategory: null,
      createdAt: new Date(),
    },
    {
      id: "6",
      title: "Supreme Box Logo Hoodie",
      category: "Fashion",
      condition: "Near Mint",
      purchasePrice: "300.00",
      sellingPrice: "650.00",
      quantity: 2,
      weight: "1.2",
      status: "in_stock" as const,
      tags: ["Supreme", "Streetwear"],
      description: "Supreme Box Logo hoodie in near mint condition, size large.",
      isGiveaway: 0,
      buyerName: null,
      buyerEmail: null,
      soldDate: null,
      subCategory: null,
      createdAt: new Date(),
    },
  ];

  const rawItems = isLoading ? mockItems : items;

  const normalizedSearch = searchQuery.trim().toLowerCase();
  const filteredItems = rawItems.filter((item) => {
    const matchesSearch =
      !normalizedSearch ||
      item.title.toLowerCase().includes(normalizedSearch) ||
      (item.description?.toLowerCase().includes(normalizedSearch) ?? false) ||
      (item.tags?.some((tag) => tag.toLowerCase().includes(normalizedSearch)) ?? false);

    const matchesTags =
      selectedTags.length === 0 ||
      (item.tags?.some((tag) => selectedTags.includes(tag)) ?? false);

    return matchesSearch && matchesTags;
  });

  const displayItems = filteredItems;

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
          {viewMode === "grid" && (
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-muted-foreground">
                Showing {displayItems.length} items
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">Card Size:</span>
                <input
                  type="range"
                  min="1"
                  max="3"
                  value={cardSize}
                  className="w-32 accent-primary"
                  data-testid="slider-inventory-card-size"
                  onChange={(e) => setCardSize(e.target.value)}
                />
                <span className="text-xs text-muted-foreground">({cardSize === '1' ? '5' : cardSize === '2' ? '4' : '3'} per row)</span>
              </div>
            </div>
          )}
          {viewMode === "list" && (
            <div className="mb-4 text-sm text-muted-foreground">
              Showing {displayItems.length} items
            </div>
          )}
          <div
            className={
              viewMode === "grid"
                ? cardSize === "1"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4"
                  : cardSize === "2"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                    : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                : "space-y-4"
            }
          >
            {displayItems.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-8 text-center text-muted-foreground">
                <p className="text-sm">No items match your filters yet.</p>
                {!isLoading && (
                  <Button size="sm" onClick={() => setAddDialogOpen(true)}>
                    Add your first item
                  </Button>
                )}
              </div>
            ) : (
              displayItems.map((item: any) => (
                <InventoryCard
                  key={item.id}
                  {...item}
                  isGiveaway={!!item.isGiveaway}
                  onClick={() => {
                    setSelectedItem(item);
                    setDetailModalOpen(true);
                  }}
                  onEdit={() => {
                    setEditingItem(item);
                    setEditDialogOpen(true);
                  }}
                  onDuplicate={() => console.log("Duplicate", item.id)}
                  onDelete={() => deleteItemMutation.mutate(item.id)}
                  onToggleGiveaway={() => toggleGiveawayMutation.mutate(item)}
                />
              ))
            )}
          </div>
        </div>
      </div>

      <AddItemDialog 
        open={addDialogOpen} 
        onOpenChange={setAddDialogOpen}
        onSubmit={async (data) => {
          try {
            const response = await apiRequest("POST", "/api/inventory", data);
            if (!response.ok) {
              const errorData = await response.json();
              console.error("Failed to add item:", errorData);
              return;
            }
            queryClient.invalidateQueries({ queryKey: ["/api/inventory"] });
          } catch (error) {
            console.error("Failed to add item:", error);
          }
        }}
      />
      <EditItemDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        item={editingItem}
        onSave={(updatedItem) => {
          editItemMutation.mutate(updatedItem);
        }}
      />
      {selectedItem && (
        <ItemDetailModal
          open={detailModalOpen}
          onOpenChange={setDetailModalOpen}
          item={selectedItem}
          onMarkAsSold={(buyerName, buyerEmail) => {
            markAsSoldMutation.mutate({ id: selectedItem.id, buyerName, buyerEmail });
          }}
        />
      )}
      <FloatingActionButton onClick={() => setAddDialogOpen(true)} />
    </div>
  );
}
