import { Edit, Copy, Trash2, DollarSign } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface InventoryCardProps {
  id: string;
  title: string;
  category: string;
  condition: string;
  purchasePrice: number;
  sellingPrice: number;
  quantity: number;
  status: "in_stock" | "sold" | "draft";
  imageUrl?: string;
  tags?: string[];
  onEdit?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
}

export function InventoryCard({
  title,
  category,
  condition,
  purchasePrice,
  sellingPrice,
  quantity,
  status,
  imageUrl,
  tags = [],
  onEdit,
  onDuplicate,
  onDelete,
}: InventoryCardProps) {
  const profit = sellingPrice - purchasePrice;
  const profitPercentage = ((profit / purchasePrice) * 100).toFixed(0);

  const statusConfig = {
    in_stock: { label: "In Stock", className: "bg-chart-3 text-white" },
    sold: { label: "Sold", className: "bg-chart-2 text-white" },
    draft: { label: "Draft", className: "bg-muted text-muted-foreground" },
  };

  return (
    <Card className="overflow-hidden group hover-elevate">
      <div className="relative aspect-square bg-muted">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <Package className="w-12 h-12" />
          </div>
        )}
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8"
            onClick={onEdit}
            data-testid="button-edit-item"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8"
            onClick={onDuplicate}
            data-testid="button-duplicate-item"
          >
            <Copy className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            variant="destructive"
            className="h-8 w-8"
            onClick={onDelete}
            data-testid="button-delete-item"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
        <Badge className={`absolute top-2 left-2 ${statusConfig[status].className}`}>
          {statusConfig[status].label}
        </Badge>
      </div>
      <CardHeader className="space-y-1 pb-3">
        <h3 className="font-heading font-semibold text-base line-clamp-1" data-testid="text-item-title">
          {title}
        </h3>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{category}</span>
          <span>{condition}</span>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="flex flex-wrap gap-1 mb-3">
          {tags.map((tag, idx) => (
            <Badge key={idx} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <div className="text-xs text-muted-foreground">Purchase</div>
            <div className="font-semibold">${purchasePrice.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Selling</div>
            <div className="font-semibold text-primary">${sellingPrice.toFixed(2)}</div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-3 border-t flex items-center justify-between">
        <div className="text-xs text-muted-foreground">Qty: {quantity}</div>
        <div className={`text-xs font-semibold flex items-center gap-1 ${profit >= 0 ? 'text-chart-3' : 'text-destructive'}`}>
          <DollarSign className="w-3 h-3" />
          {profit >= 0 ? '+' : ''}{profitPercentage}%
        </div>
      </CardFooter>
    </Card>
  );
}

function Package({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
      />
    </svg>
  );
}
