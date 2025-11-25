import { Edit, Copy, Trash2, Gift } from "lucide-react";
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
  weight?: number;
  isGiveaway?: boolean;
  onClick?: () => void;
  onEdit?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  onToggleGiveaway?: () => void;
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
  weight,
  isGiveaway = false,
  onClick,
  onEdit,
  onDuplicate,
  onDelete,
  onToggleGiveaway,
}: InventoryCardProps) {
  const profit = sellingPrice - purchasePrice;
  const profitPercentage = ((profit / purchasePrice) * 100).toFixed(0);

  const statusConfig = {
    in_stock: { label: "In Stock", className: "bg-primary" },
    sold: { label: "Sold", className: "bg-chart-2" },
    draft: { label: "Draft", className: "bg-muted" },
  };

  return (
    <Card 
      className="overflow-hidden group hover-elevate transition-all duration-300 border border-card-border hover:border-primary/50 animate-slide-up cursor-pointer"
      onClick={onClick}
    >
      <div className="relative aspect-square bg-muted overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-secondary">
            <Package className="w-12 h-12" />
          </div>
        )}
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
          <Button
            size="icon"
            variant="secondary"
            className={`h-8 w-8 backdrop-blur-sm ${isGiveaway ? 'bg-chart-3 hover:bg-chart-3/80' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleGiveaway?.();
            }}
            data-testid="button-toggle-giveaway"
          >
            <Gift className={`w-4 h-4 ${isGiveaway ? 'fill-current' : ''}`} />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 backdrop-blur-sm"
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.();
            }}
            data-testid="button-edit-item"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 backdrop-blur-sm"
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate?.();
            }}
            data-testid="button-duplicate-item"
          >
            <Copy className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            variant="destructive"
            className="h-8 w-8 backdrop-blur-sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.();
            }}
            data-testid="button-delete-item"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
        <div className="absolute top-2 left-2 flex gap-2">
          <Badge className={`text-xs font-bold ${statusConfig[status].className}`}>
            {statusConfig[status].label}
          </Badge>
          {isGiveaway && (
            <Badge className="text-xs font-bold bg-chart-3 text-black">
              Giveaway
            </Badge>
          )}
        </div>
      </div>
      <CardHeader className="space-y-2 pb-2">
        <h3 className="font-heading font-bold text-sm line-clamp-2" data-testid="text-item-title">
          {title}
        </h3>
        <div className="flex flex-wrap gap-1">
          {tags.map((tag, idx) => (
            <Badge key={idx} variant="outline" className="text-xs bg-muted/50 border-primary/30">
              {tag}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-1">
          <div className="text-xs text-muted-foreground flex justify-between">
            <span>{category}</span>
            <span>{condition}</span>
          </div>
          {weight && (
            <div className="text-xs text-muted-foreground">
              Weight: <span className="font-semibold text-foreground">{weight} lbs</span>
            </div>
          )}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <div className="text-muted-foreground">Purchase</div>
              <div className="font-semibold">${purchasePrice.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Selling</div>
              <div className="font-bold text-primary">${sellingPrice.toFixed(2)}</div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2 border-t border-card-border flex items-center justify-between text-xs">
        <div className="text-muted-foreground">Qty: {quantity}</div>
        <div className={`font-bold flex items-center gap-1 ${profit >= 0 ? 'text-primary' : 'text-destructive'}`}>
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
