import { InventoryCard } from "../InventoryCard";

export default function InventoryCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      <InventoryCard
        id="1"
        title="Vintage Pokemon Card - Charizard Holo"
        category="Trading Cards"
        condition="Near Mint"
        purchasePrice={150}
        sellingPrice={299.99}
        quantity={1}
        status="in_stock"
        tags={["Pokemon", "Holo", "Rare"]}
        onEdit={() => console.log("Edit clicked")}
        onDuplicate={() => console.log("Duplicate clicked")}
        onDelete={() => console.log("Delete clicked")}
      />
      <InventoryCard
        id="2"
        title="Funko Pop - Iron Man #01"
        category="Collectibles"
        condition="Mint"
        purchasePrice={45}
        sellingPrice={89.99}
        quantity={3}
        status="sold"
        tags={["Funko", "Marvel"]}
        onEdit={() => console.log("Edit clicked")}
        onDuplicate={() => console.log("Duplicate clicked")}
        onDelete={() => console.log("Delete clicked")}
      />
      <InventoryCard
        id="3"
        title="Sealed Nike Sneakers - Air Jordan 1"
        category="Shoes"
        condition="New"
        purchasePrice={200}
        sellingPrice={450}
        quantity={1}
        status="draft"
        tags={["Sneakers", "Limited"]}
        onEdit={() => console.log("Edit clicked")}
        onDuplicate={() => console.log("Duplicate clicked")}
        onDelete={() => console.log("Delete clicked")}
      />
    </div>
  );
}
