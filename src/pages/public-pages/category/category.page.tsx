import { categoryRepository } from "@/common/api/repositories/categoryRepository";
import CategoryCard from "@/common/components/CategoryCard";
import { selectedCategoryAtom } from "@/common/states/category.atom";
import { customerAtom } from "@/common/states/customer.atom";
import { prevGlpMedDetails } from "@/common/states/product.atom";
import { useQuery } from "@tanstack/react-query";
import { useAtom, useSetAtom } from "jotai";
import { RESET } from "jotai/utils";
import { useEffect, useState } from "react";

const CategoryPage = () => {
  const [category, setCategory] = useState<any | null>();
  const setSelectedCategory = useSetAtom(selectedCategoryAtom);
  const [customerData, setCustomerData] = useAtom(customerAtom);
  const setPrevGlpMedDetails = useSetAtom(prevGlpMedDetails);

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
    if (categoryName.includes("Peptides")) {
      const newCategory = ["Single Peptides", "Peptides Blends"];
      setSelectedCategory(newCategory);
    } else {
      const newCategory = [categoryName];
      setSelectedCategory(newCategory);
    }
    setPrevGlpMedDetails(RESET);
  };

  const categoryImages = {
    "Weight Loss": "images/weight-loos.png",
    Testosterone: "images/testestorne.png",
    "Hair Growth": "images/hair-loos.png",
    Peptides: "images/peptides.png",
    "Hormone Therapy": "images/hormone-therapy.png",
    "Sexual Health": "images/sexual-health.png",
  };

  const transformedCategories = category?.reduce((acc: string[], item: string) => {
    if (
      item === "Hair Growth (male)" ||
      item === "Hair Growth (female)" ||
      item === "Single Peptides" ||
      item === "Peptides Blends" ||
      item === "Sexual Health (male)" ||
      item === "Sexual Health (female)"
    ) {
      if (item === "Hair Growth (male)" || item === "Hair Growth (female)") {
        if (!acc.includes("Hair Growth")) {
          acc.push("Hair Growth");
        }
      }
      if (item === "Sexual Health (male)" || item === "Sexual Health (female)") {
        if (!acc.includes("Sexual Health")) {
          acc.push("Sexual Health");
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
        className={`${(category?.length ?? 0) < 3 ? `flex flex-wrap justify-center` : "grid lg:grid-cols-3 sm:grid-cols-2"} lg:gap-y-12 gap-y-10  lg:gap-x-20 md:gap-x-10 gap-x-5`}
      >
        {transformedCategories?.map((item, index) => (
          <CategoryCard
            key={index}
            onClick={() => handleCategoryClick(item)}
            image={categoryImages[item]}
            title={item}
            link="/quiz"
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
