import { StatsCard } from "../StatsCard";
import { Package, DollarSign, TrendingUp, ShoppingCart } from "lucide-react";

export default function StatsCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
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
  );
}
