import { StatsCard } from "@/components/StatsCard";
import { InventoryCard } from "@/components/InventoryCard";
import { Package, DollarSign, TrendingUp, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { AddItemDialog } from "@/components/AddItemDialog";
import { EditItemDialog } from "@/components/EditItemDialog";
import { ItemDetailModal } from "@/components/ItemDetailModal";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { InventoryItem } from "@shared/schema";

export default function Dashboard() {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  // Fetch inventory items
  const { data: items = [] } = useQuery({
    queryKey: ["/api/inventory"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/inventory");
      return res.json() as Promise<InventoryItem[]>;
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

  // Delete item mutation
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

  const recentItems = items.slice(0, 4);

  // Calculate stats
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const asNumber = (value: number | string) =>
    typeof value === "string" ? parseFloat(value) : value;

  const totalValue = items.reduce((sum, item) => {
    const sellingPrice = asNumber(item.sellingPrice);
    return sum + sellingPrice * item.quantity;
  }, 0);

  const inStock = items
    .filter((item) => item.status === "in_stock")
    .reduce((sum, item) => sum + item.quantity, 0);

  const profitMargins = items
    .map((item) => {
      const purchase = asNumber(item.purchasePrice);
      const selling = asNumber(item.sellingPrice);
      if (!purchase || !Number.isFinite(purchase)) return null;
      return ((selling - purchase) / purchase) * 100;
    })
    .filter((value): value is number => value !== null && Number.isFinite(value));

  const profitMargin =
    profitMargins.length > 0
      ? (profitMargins.reduce((sum, value) => sum + value, 0) / profitMargins.length).toFixed(0)
      : "0";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-heading font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back! Here's your inventory overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Items"
          value={totalItems}
          subtitle={`${inStock} in stock`}
          icon={Package}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Total Value"
          value={`$${totalValue.toFixed(0)}`}
          subtitle="Inventory worth"
          icon={DollarSign}
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Profit Margin"
          value={`${profitMargin}%`}
          subtitle="Average markup"
          icon={TrendingUp}
          trend={{ value: 3, isPositive: true }}
        />
        <StatsCard
          title="Orders"
          value={items.filter(i => i.status === 'sold').length}
          subtitle="Total sold"
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
              id={item.id}
              title={item.title}
              category={item.category}
              condition={item.condition}
              purchasePrice={item.purchasePrice}
              sellingPrice={item.sellingPrice}
              quantity={item.quantity}
              status={(item.status as "in_stock" | "sold" | "draft") || "in_stock"}
              imageUrl={item.imageUrl || undefined}
              tags={item.tags || undefined}
              weight={item.weight || undefined}
              isGiveaway={item.isGiveaway === 1}
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
          ))}
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
