import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Upload } from "lucide-react";

interface AddItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: any) => void;
  onItemAdded?: () => void;
}

export function AddItemDialog({ open, onOpenChange, onSubmit, onItemAdded }: AddItemDialogProps) {
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");

  const titleRef = useRef<HTMLInputElement>(null);
  const purchasePriceRef = useRef<HTMLInputElement>(null);
  const sellingPriceRef = useRef<HTMLInputElement>(null);
  const quantityRef = useRef<HTMLInputElement>(null);
  const weightRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const itemData = {
      title: titleRef.current?.value,
      category,
      condition,
      purchasePrice: parseFloat(purchasePriceRef.current?.value || "0"),
      sellingPrice: parseFloat(sellingPriceRef.current?.value || "0"),
      quantity: parseInt(quantityRef.current?.value || "1"),
      weight: weightRef.current?.value ? parseFloat(weightRef.current.value) : undefined,
      description: descriptionRef.current?.value,
      tags,
      status: "in_stock",
    };

    console.log("Form submitted with data:", itemData);
    onSubmit?.(itemData);
    onItemAdded?.();
    onOpenChange(false);
    
    // Reset form
    setTags([]);
    setCategory("");
    setCondition("");
    if (titleRef.current) titleRef.current.value = "";
    if (purchasePriceRef.current) purchasePriceRef.current.value = "";
    if (sellingPriceRef.current) sellingPriceRef.current.value = "";
    if (quantityRef.current) quantityRef.current.value = "1";
    if (weightRef.current) weightRef.current.value = "";
    if (descriptionRef.current) descriptionRef.current.value = "";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">Add New Item</DialogTitle>
          <DialogDescription>
            Fill in the details to add a new item to your inventory
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                ref={titleRef}
                placeholder="e.g., Vintage Pokemon Card - Charizard"
                required
                data-testid="input-title"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger id="category" data-testid="select-category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="trading-cards">Trading Cards</SelectItem>
                    <SelectItem value="collectibles">Collectibles</SelectItem>
                    <SelectItem value="toys">Toys & Games</SelectItem>
                    <SelectItem value="fashion">Fashion</SelectItem>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="shoes">Shoes</SelectItem>
                    <SelectItem value="sports-memorabilia">Sports Memorabilia</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="condition">Condition *</Label>
                <Select value={condition} onValueChange={setCondition} required>
                  <SelectTrigger id="condition" data-testid="select-condition">
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mint">Mint</SelectItem>
                    <SelectItem value="near-mint">Near Mint</SelectItem>
                    <SelectItem value="excellent">Excellent</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                    <SelectItem value="poor">Poor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="purchase-price">Purchase Price *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    id="purchase-price"
                    ref={purchasePriceRef}
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="pl-7"
                    required
                    data-testid="input-purchase-price"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="selling-price">Selling Price *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    id="selling-price"
                    ref={sellingPriceRef}
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="pl-7"
                    required
                    data-testid="input-selling-price"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity *</Label>
                <Input
                  id="quantity"
                  ref={quantityRef}
                  type="number"
                  min="1"
                  defaultValue="1"
                  required
                  data-testid="input-quantity"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Weight (lbs)</Label>
              <Input
                id="weight"
                ref={weightRef}
                type="number"
                step="0.01"
                placeholder="0.00"
                data-testid="input-weight"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                ref={descriptionRef}
                placeholder="Describe the item's features, condition details, etc."
                rows={3}
                data-testid="input-description"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <div className="flex gap-2">
                <Input
                  id="tags"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  placeholder="Add tags (press Enter)"
                  data-testid="input-tags"
                />
                <Button type="button" onClick={addTag} variant="secondary">
                  Add
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover-elevate rounded-full"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Photos</Label>
              <div className="border-2 border-dashed rounded-lg p-8 text-center hover-elevate cursor-pointer">
                <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Drag and drop images here, or click to select
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Up to 8 images supported
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" data-testid="button-save-item">
              Save Item
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
