import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Package, X } from "lucide-react";
import { useEffect } from "react";

interface ItemDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: {
    id: string;
    title: string;
    category: string;
    condition: string;
    purchasePrice: number | string;
    sellingPrice: number | string;
    quantity: number;
    status: "in_stock" | "sold" | "draft";
    imageUrl?: string;
    tags?: string[];
    weight?: number | string;
    description?: string;
    buyerName?: string | null;
    buyerEmail?: string | null;
    soldDate?: string | null;
  };
  onMarkAsSold?: (buyerName: string, buyerEmail: string) => void;
  onUnmarkSold?: () => void;
}

export function ItemDetailModal({ open, onOpenChange, item, onMarkAsSold, onUnmarkSold }: ItemDetailModalProps) {
  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    setBuyerName("");
    setBuyerEmail("");
  }, [item.id]);

  const purchasePriceNum = typeof item.purchasePrice === 'string' ? parseFloat(item.purchasePrice) : item.purchasePrice;
  const sellingPriceNum = typeof item.sellingPrice === 'string' ? parseFloat(item.sellingPrice) : item.sellingPrice;

  const profit = sellingPriceNum - purchasePriceNum;
  const profitPercentage = ((profit / purchasePriceNum) * 100).toFixed(0);

  const handleMarkAsSold = () => {
    if (buyerName && buyerEmail && onMarkAsSold) {
      onMarkAsSold(buyerName, buyerEmail);
      setBuyerName("");
      setBuyerEmail("");
      onOpenChange(false);
    }
  };

  const statusConfig = {
    in_stock: { label: "In Stock", className: "bg-primary" },
    sold: { label: "Sold", className: "bg-chart-2" },
    draft: { label: "Draft", className: "bg-muted" },
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden bg-card border-card-border animate-flip-3d">
        <div className="relative">
          <div className="p-6">
            <button
              onClick={() => onOpenChange(false)}
              className="absolute top-4 right-4 rounded-sm opacity-70 hover:opacity-100 transition-opacity z-10"
              data-testid="button-close-modal"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="relative aspect-square bg-muted rounded-md overflow-hidden">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <Package className="w-16 h-16" />
                    </div>
                  )}
                  <Badge className={`absolute top-3 left-3 ${statusConfig[item.status].className}`}>
                    {statusConfig[item.status].label}
                  </Badge>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{item.title}</h2>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {item.tags?.map((tag, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs bg-muted/50 border-primary/30">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Category:</span>
                    <span className="font-semibold">{item.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Condition:</span>
                    <span className="font-semibold">{item.condition}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Quantity:</span>
                    <span className="font-semibold">{item.quantity}</span>
                  </div>
                  {item.weight && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Weight:</span>
                      <span className="font-semibold">{item.weight} lbs</span>
                    </div>
                  )}
                </div>

                <div className="border-t border-b border-border py-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Purchase Price:</span>
                    <span className="font-semibold">${purchasePriceNum.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Selling Price:</span>
                    <span className="font-bold text-primary">${sellingPriceNum.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Profit:</span>
                    <span className={`font-bold ${profit >= 0 ? 'text-primary' : 'text-destructive'}`}>
                      {profit >= 0 ? '+' : ''}{profitPercentage}% (${profit.toFixed(2)})
                    </span>
                  </div>
                </div>

                {item.description && (
                  <div>
                    <h3 className="font-semibold mb-1 text-sm">Description</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                )}

                {item.status === "in_stock" && (
                  <div className="space-y-3 pt-2">
                    <h3 className="font-semibold text-sm">Mark as Sold</h3>
                    <div className="space-y-2">
                      <div>
                        <Label htmlFor="buyer-name" className="text-xs">Buyer Name</Label>
                        <Input
                          id="buyer-name"
                          placeholder="John Doe"
                          value={buyerName}
                          onChange={(e) => setBuyerName(e.target.value)}
                          data-testid="input-buyer-name"
                          className="h-9"
                        />
                      </div>
                      <div>
                        <Label htmlFor="buyer-email" className="text-xs">Buyer Email</Label>
                        <Input
                          id="buyer-email"
                          type="email"
                          placeholder="buyer@email.com"
                          value={buyerEmail}
                          onChange={(e) => setBuyerEmail(e.target.value)}
                          data-testid="input-buyer-email"
                          className="h-9"
                        />
                      </div>
                      <Button
                        onClick={handleMarkAsSold}
                        disabled={!buyerName || !buyerEmail}
                        className="w-full"
                        data-testid="button-mark-sold"
                      >
                        Mark as Sold
                      </Button>
                    </div>
                  </div>
                )}

                {item.status === "sold" && (
                  <div className="space-y-3 pt-2">
                    <h3 className="font-semibold text-sm">Sale Details</h3>
                    <div className="rounded-lg border border-card-border bg-muted/20 p-3 text-sm space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Buyer:</span>
                        <span className="font-semibold">{item.buyerName || "Unknown"}</span>
                      </div>
                      {item.buyerEmail && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Email:</span>
                          <span className="font-semibold">{item.buyerEmail}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Sold on:</span>
                        <span className="font-semibold">
                          {item.soldDate ? new Date(item.soldDate).toLocaleDateString() : "Pending"}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => onUnmarkSold?.()}
                      data-testid="button-unmark-sold"
                      className="w-full"
                    >
                      Return to Inventory
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
