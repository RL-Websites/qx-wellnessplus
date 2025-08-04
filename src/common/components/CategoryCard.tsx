import ThumbBg from "./ThumbBg";

interface ICardProps {
  image: string;
  title: string;
}

const CategoryCard = (cardProps: ICardProps) => {
  return (
    <div className="space-y-5 text-center">
      {cardProps?.image ? (
        <ThumbBg>
          <img
            src={cardProps.image}
            alt=""
            className="max-w-full max-h-full"
          />
        </ThumbBg>
      ) : (
        ""
      )}
      <div className="card-title">{cardProps?.title ? <h4>{cardProps?.title}</h4> : ""}</div>
    </div>
  );
};

export default CategoryCard;
