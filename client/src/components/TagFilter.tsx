import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface TagFilterProps {
  tags: string[];
  selectedTags: string[];
  onSelectionChange: (tags: string[]) => void;
}

export function TagFilter({ tags, selectedTags, onSelectionChange }: TagFilterProps) {
  const toggleTag = (tag: string) => {
    const newSelection = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    onSelectionChange(newSelection);
  };

  return (
    <div className="space-y-2">
      <div className="text-sm font-semibold text-muted-foreground">Filter by Tags:</div>
      <ScrollArea className="w-full whitespace-nowrap rounded-md border border-border p-3">
        <div className="flex gap-2">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                selectedTags.includes(tag)
                  ? "bg-primary text-primary-foreground border border-primary"
                  : "bg-secondary text-secondary-foreground border border-secondary hover:border-primary"
              } animate-slide-in`}
              data-testid={`button-tag-filter-${tag.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {tag}
              {selectedTags.includes(tag) && (
                <X className="w-3 h-3 inline ml-1" />
              )}
            </button>
          ))}
        </div>
      </ScrollArea>
      {selectedTags.length > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onSelectionChange([])}
          data-testid="button-clear-tag-filters"
        >
          Clear filters
        </Button>
      )}
    </div>
  );
}
