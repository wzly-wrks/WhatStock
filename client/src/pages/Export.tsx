import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Download, FileSpreadsheet, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { InventoryItem } from "@shared/schema";

export default function Export() {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [exportType, setExportType] = useState<"all" | "selected">("all");

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["/api/inventory"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/inventory");
      return res.json() as Promise<InventoryItem[]>;
    },
  });

  useEffect(() => {
    const activeIds = new Set(items.map((item) => item.id));
    setSelectedItems((prev) => prev.filter((id) => activeIds.has(id)));
  }, [items]);

  const exportableItems = useMemo(
    () =>
      exportType === "all"
        ? items
        : items.filter((item) => selectedItems.includes(item.id)),
    [exportType, items, selectedItems],
  );

  const handleExport = () => {
    if (exportableItems.length === 0) return;

    const headers = [
      "Category",
      "Sub Category",
      "Title",
      "Description",
      "Quantity",
      "Type",
      "Price",
      "Shipping Profile",
      "Condition",
      "Image URLs",
    ];

    const rows = exportableItems.map((item) => {
      const numericSellingPrice = Number(item.sellingPrice ?? "");
      const sellingPrice = Number.isFinite(numericSellingPrice)
        ? numericSellingPrice.toString()
        : "";
      const description = item.description ?? "";
      const shippingProfile = item.weight ? `${item.weight} lbs` : "Default";
      const imageValue = item.imageUrl ?? "";

      return [
        item.category,
        item.subCategory ?? "",
        item.title,
        description,
        item.quantity?.toString() ?? "1",
        item.isGiveaway ? "Giveaway" : "Buy It Now",
        sellingPrice,
        shippingProfile,
        item.condition,
        imageValue,
      ];
    });

    const csvContent = [headers, ...rows]
      .map((row) => row.map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `whatstock-whatnot-export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-heading font-bold text-foreground">Export to Whatnot</h1>
        <p className="text-muted-foreground mt-1">
          Generate CSV files compatible with Whatnot's bulk listing import
        </p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Whatnot CSV Format</AlertTitle>
        <AlertDescription>
          The exported file will include all required fields: Category, Sub Category, Title, Description,
          Quantity, Type, Price, Shipping Profile, and Condition. Make sure your items have all necessary
          information before exporting.
        </AlertDescription>
      </Alert>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-heading">Export Options</CardTitle>
            <CardDescription>Choose which items to include in your export</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="export-all"
                  checked={exportType === "all"}
                  onCheckedChange={() => setExportType("all")}
                  data-testid="checkbox-export-all"
                />
                <label htmlFor="export-all" className="text-sm cursor-pointer">
                  Export all inventory items ({isLoading ? "..." : items.length} items)
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="export-selected"
                  checked={exportType === "selected"}
                  onCheckedChange={() => setExportType("selected")}
                  data-testid="checkbox-export-selected"
                />
                <label htmlFor="export-selected" className="text-sm cursor-pointer">
                  Export selected items only
                </label>
              </div>
            </div>

            {exportType === "selected" && (
              <div className="space-y-2 pt-4 border-t">
                <Label className="font-semibold">Select Items:</Label>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {isLoading && (
                    <p className="text-sm text-muted-foreground">Loading inventory...</p>
                  )}
                  {!isLoading && items.length === 0 && (
                    <p className="text-sm text-muted-foreground">No items available to export yet.</p>
                  )}
                  {!isLoading && items.length > 0 && items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`item-${item.id}`}
                        checked={selectedItems.includes(item.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedItems([...selectedItems, item.id]);
                          } else {
                            setSelectedItems(selectedItems.filter((id) => id !== item.id));
                          }
                        }}
                        data-testid={`checkbox-item-${item.id}`}
                      />
                      <label htmlFor={`item-${item.id}`} className="text-sm cursor-pointer flex-1">
                        {item.title}
                        <span className="ml-2 text-xs text-muted-foreground">({item.status})</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button
              className="w-full"
              onClick={handleExport}
              disabled={
                isLoading ||
                exportableItems.length === 0 ||
                (exportType === "selected" && selectedItems.length === 0)
              }
              data-testid="button-export-csv"
            >
              <Download className="w-4 h-4 mr-2" />
              Export to CSV
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-heading">CSV Template Fields</CardTitle>
            <CardDescription>Required fields in the Whatnot import format</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <FileSpreadsheet className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold">Category *</div>
                  <div className="text-muted-foreground text-xs">
                    Main product category (e.g., Trading Cards, Collectibles)
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <FileSpreadsheet className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold">Sub Category *</div>
                  <div className="text-muted-foreground text-xs">
                    Specific product subcategory
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <FileSpreadsheet className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold">Title *</div>
                  <div className="text-muted-foreground text-xs">
                    Item name/description
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <FileSpreadsheet className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold">Condition *</div>
                  <div className="text-muted-foreground text-xs">
                    Item condition (Mint, Near Mint, etc.)
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <FileSpreadsheet className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold">Type *</div>
                  <div className="text-muted-foreground text-xs">
                    Auction, Buy It Now, or Giveaway
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <FileSpreadsheet className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold">Price *</div>
                  <div className="text-muted-foreground text-xs">
                    Starting bid or purchase price
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <FileSpreadsheet className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold">Image URLs (1-8)</div>
                  <div className="text-muted-foreground text-xs">
                    Public image links (optional)
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
