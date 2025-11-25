import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { OrdersTable } from "@/components/OrdersTable";
import { StatsCard } from "@/components/StatsCard";
import { DollarSign, TrendingUp, ShoppingCart, Package } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { InventoryItem } from "@shared/schema";

type OrderStatus = "completed" | "pending" | "shipped";

type OrderBase = {
  id: string;
  itemTitle: string;
  buyer: string;
  saleDate: string;
  purchasePrice: number;
  salePrice: number;
  profit: number;
  status: OrderStatus;
};

type OrderWithProgress = OrderBase & {
  printedLabel: boolean;
  packed: boolean;
  shipped: boolean;
};

export default function Orders() {
  const { data: items = [], isLoading } = useQuery({
    queryKey: ["/api/inventory"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/inventory");
      return res.json() as Promise<InventoryItem[]>;
    },
  });

  const [orderProgress, setOrderProgress] = useState<Record<string, { printedLabel: boolean; packed: boolean; shipped: boolean }>>({});

  const soldItems = items.filter((item) => item.status === "sold");

  const orders: OrderBase[] = soldItems.map((item) => {
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
      status: item.soldDate ? "completed" : "pending",
    };
  });

  useEffect(() => {
    setOrderProgress((prev) => {
      const next = { ...prev };
      const activeIds = new Set<string>();

      orders.forEach((order) => {
        activeIds.add(order.id);
        if (!next[order.id]) {
          next[order.id] = { printedLabel: false, packed: false, shipped: false };
        }
      });

      Object.keys(next).forEach((id) => {
        if (!activeIds.has(id)) {
          delete next[id];
        }
      });

      return next;
    });
  }, [orders]);

  const ordersWithProgress: OrderWithProgress[] = orders.map((order) => {
    const progress = orderProgress[order.id] ?? { printedLabel: false, packed: false, shipped: false };
    return {
      ...order,
      printedLabel: progress.printedLabel,
      packed: progress.packed,
      shipped: progress.shipped,
      status: progress.shipped ? "shipped" as const : order.status,
    };
  });

  const handleProgressChange = (orderId: string, field: "printedLabel" | "packed" | "shipped", value: boolean) => {
    setOrderProgress((prev) => ({
      ...prev,
      [orderId]: {
        printedLabel: prev[orderId]?.printedLabel ?? false,
        packed: prev[orderId]?.packed ?? false,
        shipped: prev[orderId]?.shipped ?? false,
        [field]: value,
      },
    }));
  };

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
            orders={ordersWithProgress}
            onViewDetails={(id) => console.log("View order details:", id)}
            onProgressChange={handleProgressChange}
          />
        )}
      </div>
      </div>
    );
  }
