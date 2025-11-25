import { FilterSidebar } from "../FilterSidebar";

export default function FilterSidebarExample() {
  return (
    <div className="p-4 max-w-sm">
      <FilterSidebar onFilterChange={(filters) => console.log("Filters changed:", filters)} />
    </div>
  );
}
