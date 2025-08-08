import { Link } from "react-router-dom";
import ThumbBg from "./ThumbBg";

interface ICardProps {
  image: string;
  title: string;
  link: string;
}

const CategoryCard = (cardProps: ICardProps) => {
  return (
    <Link
      to={cardProps.link}
      className="space-y-5 text-center"
    >
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
      <div className="card-title ">{cardProps?.title ? <h4 className="font-poppins font-medium text-3xl">{cardProps?.title}</h4> : ""}</div>
    </Link>
  );
};

export default CategoryCard;
