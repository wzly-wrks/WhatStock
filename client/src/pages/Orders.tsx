import { useQuery } from "@tanstack/react-query";
import { OrdersTable } from "@/components/OrdersTable";
import { StatsCard } from "@/components/StatsCard";
import { DollarSign, TrendingUp, ShoppingCart, Package } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { InventoryItem } from "@shared/schema";

export default function Orders() {
  const { data: items = [], isLoading } = useQuery({
    queryKey: ["/api/inventory"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/inventory");
      return res.json() as Promise<InventoryItem[]>;
    },
  });

  const soldItems = items.filter((item) => item.status === "sold");

  const orders = soldItems.map((item) => {
    const purchasePrice =
      typeof item.purchasePrice === "string"
        ? parseFloat(item.purchasePrice)
        : item.purchasePrice;
    const salePrice =
      typeof item.sellingPrice === "string"
        ? parseFloat(item.sellingPrice)
        : item.sellingPrice;

    const saleDate = item.soldDate
      ? new Date(item.soldDate).toLocaleDateString()
      : "Pending";

    return {
      id: item.id,
      itemTitle: item.title,
      buyer: item.buyerEmail || item.buyerName || "Unknown buyer",
      saleDate,
      purchasePrice,
      salePrice,
      profit: salePrice - purchasePrice,
      status: item.soldDate ? "completed" as const : "pending" as const,
    };
  });

  const totalRevenue = orders.reduce((sum, order) => sum + order.salePrice, 0);
  const totalProfit = orders.reduce((sum, order) => sum + order.profit, 0);
  const avgProfit = orders.length > 0 ? totalProfit / orders.length : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold text-foreground">Orders</h1>
        <p className="text-muted-foreground mt-1">Track your sales and buyer information</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Orders"
          value={orders.length}
          subtitle="All time"
          icon={ShoppingCart}
        />
        <StatsCard
          title="Total Revenue"
          value={`$${totalRevenue.toFixed(2)}`}
          subtitle="From sales"
          icon={DollarSign}
        />
        <StatsCard
          title="Total Profit"
          value={`$${totalProfit.toFixed(2)}`}
          subtitle="After costs"
          icon={TrendingUp}
        />
        <StatsCard
          title="Avg Profit/Sale"
          value={`$${avgProfit.toFixed(2)}`}
          subtitle="Per transaction"
          icon={Package}
        />
      </div>

      <div>
        <h2 className="text-xl font-heading font-semibold mb-4">Order History</h2>
        {orders.length === 0 ? (
          <div className="rounded-lg border border-dashed p-6 text-center text-muted-foreground">
            {isLoading ? "Loading orders..." : "No completed orders yet."}
          </div>
        ) : (
          <OrdersTable
            orders={orders}
            onViewDetails={(id) => console.log("View order details:", id)}
          />
        )}
      </div>
      </div>
    );
  }
