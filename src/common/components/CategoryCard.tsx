import { Link } from "react-router-dom";
import ThumbBg from "./ThumbBg";

interface ICardProps {
  image: string;
  title: string;
  link: string;
  onClick?: () => void;
}

const CategoryCard = (cardProps: ICardProps) => {
  return (
    <Link
      to={cardProps.link}
      onClick={cardProps.onClick}
      className="space-y-5 text-center"
    >
      {cardProps?.image ? (
        <ThumbBg>
          <img
            src={cardProps.image}
            alt=""
            className="max-w-full xl:h-[286px] lg:h-[230px]"
          />
        </ThumbBg>
      ) : (
        ""
      )}
      <div className="card-title ">{cardProps?.title ? <h4 className="font-poppins font-medium lg:text-3xl md:text-2xl sm:text-xl text-base">{cardProps?.title}</h4> : ""}</div>
    </Link>
  );
};

export default CategoryCard;
