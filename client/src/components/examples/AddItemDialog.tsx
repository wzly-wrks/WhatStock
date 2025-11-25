import { useState } from "react";
import { AddItemDialog } from "../AddItemDialog";
import { Button } from "@/components/ui/button";

export default function AddItemDialogExample() {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-4">
      <Button onClick={() => setOpen(true)}>Open Add Item Dialog</Button>
      <AddItemDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}
