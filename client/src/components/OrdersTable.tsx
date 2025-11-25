import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

interface Order {
  id: string;
  itemTitle: string;
  buyer: string;
  saleDate: string;
  purchasePrice: number;
  salePrice: number;
  profit: number;
  status: "completed" | "pending" | "shipped";
}

interface OrdersTableProps {
  orders: Order[];
  onViewDetails?: (orderId: string) => void;
}

export function OrdersTable({ orders, onViewDetails }: OrdersTableProps) {
  const statusConfig = {
    completed: { label: "Completed", className: "bg-chart-3 text-white" },
    pending: { label: "Pending", className: "bg-chart-2 text-white" },
    shipped: { label: "Shipped", className: "bg-primary text-white" },
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item</TableHead>
            <TableHead>Buyer</TableHead>
            <TableHead>Sale Date</TableHead>
            <TableHead className="text-right">Purchase</TableHead>
            <TableHead className="text-right">Sale</TableHead>
            <TableHead className="text-right">Profit</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium" data-testid={`text-order-item-${order.id}`}>
                {order.itemTitle}
              </TableCell>
              <TableCell>{order.buyer}</TableCell>
              <TableCell>{order.saleDate}</TableCell>
              <TableCell className="text-right">${order.purchasePrice.toFixed(2)}</TableCell>
              <TableCell className="text-right font-semibold">
                ${order.salePrice.toFixed(2)}
              </TableCell>
              <TableCell className="text-right">
                <span className={order.profit >= 0 ? 'text-chart-3 font-semibold' : 'text-destructive font-semibold'}>
                  {order.profit >= 0 ? '+' : ''}${order.profit.toFixed(2)}
                </span>
              </TableCell>
              <TableCell>
                <Badge className={statusConfig[order.status].className}>
                  {statusConfig[order.status].label}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onViewDetails?.(order.id)}
                  data-testid={`button-view-order-${order.id}`}
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
