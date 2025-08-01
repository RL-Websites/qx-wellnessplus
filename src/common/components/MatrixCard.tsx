import { Link } from "react-router-dom";

interface IMatrixCard {
  matCard?: string;
  colorStart?: string;
  colorEnd?: string;
  iconBg?: string;
  dmlIcon?: string;
  cardCount?: string;
  countStyle?: string;
  cardText?: string;
  textW?: string;
  cardLink?: string;
  linkText?: string;
  linkIcon?: string;
}

function MatrixCard(cardProps: IMatrixCard) {
  return (
    <div className={`p-5 rounded-xl ${cardProps.matCard}`}>
      <div className={`${cardProps.iconBg} w-10 h-10 flex items-center justify-center rounded-full ml-auto`}>
        {cardProps?.dmlIcon ? <i className={`${cardProps.dmlIcon}`}></i> : ""}
      </div>
      <div className={`heading-xl pt-1 pb-5 text-foreground font-kneyan ${cardProps.countStyle}`}>{cardProps.cardCount}</div>
      <p className={`text-fs-sm text-foreground !font-normal ${cardProps.textW}`}>{cardProps.cardText}</p>
      {cardProps?.cardLink && (
        <Link
          to={`${cardProps.cardLink}`}
          className="text-fs-md text-foreground !leading-[22px] !font-bold pt-4 font-kneyan flex items-center gap-1"
        >
          {cardProps.linkText}
          <i className={`${cardProps.linkIcon}`}></i>
        </Link>
      )}
    </div>
  );
}

export default MatrixCard;
