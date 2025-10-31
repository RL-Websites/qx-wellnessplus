import ThumbBg from "./ThumbBg";

interface ICardProps {
  image: string;
  title: string;
  onClick?: () => void;
}

const CategoryCard = (cardProps: ICardProps) => {
  return (
    <div
      onClick={cardProps.onClick} // ✅ Add the onClick handler here
      className="space-y-5 text-center category-card cursor-pointer" // ✅ Add cursor-pointer for visual feedback
    >
      {cardProps?.image ? (
        <ThumbBg>
          <img
            src={cardProps.image}
            alt={cardProps.title || "Category"}
          />
        </ThumbBg>
      ) : null}
      <div className="card-title">{cardProps?.title && <h4 className="font-poppins font-medium lg:text-3xl md:text-2xl sm:text-xl text-base">{cardProps.title}</h4>}</div>
    </div>
  );
};

export default CategoryCard;
