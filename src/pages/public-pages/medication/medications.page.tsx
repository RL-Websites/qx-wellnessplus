import MedicationCard from "@/common/components/MedicationCard";
import { medications } from "../constant/category-constant";

const MedicationsPage = () => {
  return (
    <div className="medication-page">
      <div className="max-w-[776px] mx-auto text-center space-y-5">
        <h4 className="lg:text-[90px] md:text-6xl sm:text-4xl text-2xl text-center text-foreground uppercase">The best pick for you!</h4>
        <span className="md:text-2xl font-medium text-foreground inline-block">
          Based on your responses, we've personalized these product suggestions for you. Kindly select the one you prefer.
        </span>
        <div className="rounded-lg bg-green-badge text-center py-2.5 px-6">Doctor consultation & shipping cost included</div>
      </div>
      <div className="grid grid-cols-3 lg:gap-y-12 lg:gap-x-20 md:gap-10 gap-5 pt-12">
        {medications?.map((item, index) => (
          <MedicationCard
            key={index}
            image={item?.image}
            title={item?.title}
            const={item?.cost}
          />
        ))}
      </div>
    </div>
  );
};

export default MedicationsPage;
