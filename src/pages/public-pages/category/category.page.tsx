import CategoryCard from "@/common/components/CategoryCard";
import { categoryCard } from "../constant/category-constant";

const CategoryPage = () => {
  return (
    <div className="space-y-12">
      <h4 className="lg:text-[90px] md:text-6xl sm:text-4xl text-2xl text-center text-foreground uppercase">Choose A Treatment</h4>
      <div className="grid grid-cols-3 lg:gap-20 md:gap-10 gap-5">
        {categoryCard?.map((item, index) => (
          <CategoryCard
            key={index}
            image={item?.image}
            title={item?.title}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
