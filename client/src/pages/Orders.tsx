import { OrdersTable } from "@/components/OrdersTable";
import { StatsCard } from "@/components/StatsCard";
import { DollarSign, TrendingUp, ShoppingCart, Package } from "lucide-react";

export default function Orders() {
  const orders = [
    {
      id: "1",
      itemTitle: "Vintage Pokemon Card - Charizard Holo",
      buyer: "john.doe@email.com",
      saleDate: "2024-01-15",
      purchasePrice: 150,
      salePrice: 299.99,
      profit: 149.99,
      status: "completed" as const,
    },
    {
      id: "2",
      itemTitle: "Funko Pop - Iron Man #01",
      buyer: "jane.smith@email.com",
      saleDate: "2024-01-14",
      purchasePrice: 45,
      salePrice: 89.99,
      profit: 44.99,
      status: "shipped" as const,
    },
    {
      id: "3",
      itemTitle: "Sealed Nike Sneakers - Air Jordan 1",
      buyer: "mike.jones@email.com",
      saleDate: "2024-01-13",
      purchasePrice: 200,
      salePrice: 450,
      profit: 250,
      status: "pending" as const,
    },
    {
      id: "4",
      itemTitle: "Magic The Gathering - Black Lotus",
      buyer: "sarah.wilson@email.com",
      saleDate: "2024-01-12",
      purchasePrice: 5000,
      salePrice: 8500,
      profit: 3500,
      status: "completed" as const,
    },
    {
      id: "5",
      itemTitle: "Supreme Box Logo Hoodie",
      buyer: "alex.brown@email.com",
      saleDate: "2024-01-11",
      purchasePrice: 300,
      salePrice: 650,
      profit: 350,
      status: "completed" as const,
    },
  ];

  const totalRevenue = orders.reduce((sum, order) => sum + order.salePrice, 0);
  const totalProfit = orders.reduce((sum, order) => sum + order.profit, 0);
  const avgProfit = totalProfit / orders.length;

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
        <OrdersTable
          orders={orders}
          onViewDetails={(id) => console.log("View order details:", id)}
        />
      </div>
    </div>
  );
}
