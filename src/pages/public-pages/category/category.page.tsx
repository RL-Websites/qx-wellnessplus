import { categoryRepository } from "@/common/api/repositories/categoryRepository";
import CategoryCard from "@/common/components/CategoryCard";
import { selectedCategoryAtom } from "@/common/states/category.atom";
import { customerAtom } from "@/common/states/customer.atom";
import { useQuery } from "@tanstack/react-query";
import { useAtom, useSetAtom } from "jotai";
import { useEffect, useState } from "react";

const CategoryPage = () => {
  const [category, setCategory] = useState<any | null>();
  const setSelectedCategory = useSetAtom(selectedCategoryAtom);
  const [customerData, setCustomerData] = useAtom(customerAtom);

  const categoryListQuery = useQuery({
    queryKey: ["categoryList", customerData?.slug],
    queryFn: () => categoryRepository.getCategoryList(customerData?.slug),
    // enabled: !slug,
  });

  useEffect(() => {
    if (categoryListQuery.isFetched && categoryListQuery.data?.data?.status_code === 200) {
      setCategory(categoryListQuery?.data?.data?.data);
    }
  }, [categoryListQuery.data?.data?.data]);

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(categoryName);
    console.log(categoryName);
  };

  const categoryImages = {
    "Weight Loss": "images/weight-loos.png",
    Testosterone: "images/sexual-health.png",
    "Hair Growth (male)": "images/hair-loos.png",
    "Hair Growth (female)": "images/hair-loos.png",
    "Peptides Blends": "images/weight-loos.png",
    "Single Peptides": "images/weight-loos.png",
  };

  const transformedCategories = category?.reduce((acc: string[], item: string) => {
    if (item === "Hair Growth (male)" || item === "Hair Growth (female)" || item === "Single Peptides" || item === "Peptides Blends") {
      if (item === "Hair Growth (male)" || item === "Hair Growth (female)") {
        if (!acc.includes("Hair Growth")) {
          acc.push("Hair Growth");
        }
      }
      if (item === "Single Peptides" || item === "Peptides Blends") {
        if (!acc.includes("Peptides")) {
          acc.push("Peptides");
        }
      }
    } else {
      acc.push(item);
    }
    return acc;
  }, []);

  return (
    <div className="space-y-12">
      <h4 className="heading-text text-center text-foreground uppercase">Choose A Treatment</h4>

      <div
        className={`${
          (category?.length ?? 0) < 3 ? `flex flex-wrap justify-center` : "grid lg:grid-cols-3 sm:grid-cols-2"
        } lg:gap-y-12 md:gap-y-10 gap-y-5 lg:gap-x-20 md:gap-x-10 gap-x-5`}
      >
        {/* {category?.map((item, index) => (
          <CategoryCard
            key={index}
            onClick={() => handleCategoryClick(item)}
            image={categoryImages[item]}
            title={item}
            link="/quiz"
          />
        ))} */}

        {transformedCategories?.map((item, index) => (
          <CategoryCard
            key={index}
            onClick={() => handleCategoryClick(item)}
            image={item === "Hair Growth" ? "images/injection-2.png" : item === "Peptides" ? "images/injection-3.png" : categoryImages[item]}
            title={item}
            link="/quiz"
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
