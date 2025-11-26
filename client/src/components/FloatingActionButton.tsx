import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface FloatingActionButtonProps {
  onClick: () => void;
}

export function FloatingActionButton({ onClick }: FloatingActionButtonProps) {
  return (
    <Button
      onClick={onClick}
      className="rounded-full h-14 w-14 shadow-lg hover-elevate active-elevate-2 animate-bounce-subtle"
      data-testid="button-fab-add-item"
    >
      <Plus className="w-6 h-6" />
    </Button>
  );
}
