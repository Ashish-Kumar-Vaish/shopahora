import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const Filter = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  sortOption,
  setSortOption,
}: {
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  sortOption: string;
  setSortOption: (option: string) => void;
}) => {
  return (
    <>
      <div className="flex flex-wrap gap-2 justify-start">
        {categories.map((category) => (
          <Button
            key={category}
            variant={
              selectedCategory === category?.toLowerCase()
                ? "default"
                : "outline"
            }
            onClick={() => setSelectedCategory(category.toLowerCase())}
          >
            {category}
          </Button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <Label htmlFor="sort" className="shrink-0">
          Sort by:
        </Label>

        <Select onValueChange={setSortOption} defaultValue={sortOption}>
          <SelectTrigger id="sort" className="w-[185px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
            <SelectItem value="name-asc">Name: A-Z</SelectItem>
            <SelectItem value="name-desc">Name: Z-A</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

export default Filter;
