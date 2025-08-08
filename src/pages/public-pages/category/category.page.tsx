import CategoryCard from "@/common/components/CategoryCard";
import { categoryCard } from "../constant/category-constant";

const CategoryPage = () => {
  return (
    <div className="space-y-12">
      <h4 className="lg:text-[90px] md:text-6xl sm:text-4xl text-2xl text-center text-foreground uppercase">Choose A Treatment</h4>

      <div
        className={`${
          categoryCard.length < 3 ? `flex flex-wrap justify-center` : "grid lg:grid-cols-3 sm:grid-cols-2"
        } lg:gap-y-12 md:gap-y-10 gap-y-5 lg:gap-x-20 md:gap-x-10 gap-x-5`}
      >
        {categoryCard?.map((item, index) => (
          <CategoryCard
            key={index}
            image={item?.image}
            title={item?.title}
            link="quiz"
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
