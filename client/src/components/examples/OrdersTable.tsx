import { OrdersTable } from "../OrdersTable";

const mockOrders = [
  {
    id: "1",
    itemTitle: "Vintage Pokemon Card - Charizard Holo",
    buyer: "john.doe@email.com",
    saleDate: "2024-01-15",
    purchasePrice: 150,
    salePrice: 299.99,
    profit: 149.99,
    status: "completed" as const,
    printedLabel: true,
    packed: true,
    shipped: false,
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
    printedLabel: true,
    packed: true,
    shipped: true,
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
    printedLabel: false,
    packed: false,
    shipped: false,
  },
];

export default function OrdersTableExample() {
  return (
    <div className="p-4">
      <OrdersTable
        orders={mockOrders}
        onViewDetails={(id) => console.log("View order", id)}
        onProgressChange={(id, stage, value) => console.log("Update", id, stage, value)}
      />
    </div>
  );
}
