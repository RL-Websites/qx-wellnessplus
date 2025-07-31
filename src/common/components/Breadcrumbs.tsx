import { Breadcrumbs } from "@mantine/core";
import { Link } from "react-router-dom";

interface BreadcrumbItem {
  title: string;
  href?: string;
  onClick?: () => void;
}

interface DynamicBreadcrumbsProps {
  items: BreadcrumbItem[];
  separatorMargin?: string;
}

function DynamicBreadcrumbs({ items, separatorMargin = "0" }: DynamicBreadcrumbsProps) {
  const breadcrumbsItems = items.map((item, index) => {
    const isLastItem = index === items.length - 1;

    return (
      <span key={index}>
        {isLastItem ? (
          <span className="text-foreground">{item.title}</span>
        ) : item.onClick ? (
          <span
            onClick={item.onClick}
            className="cursor-pointer"
          >
            {item.title}
          </span>
        ) : (
          <Link to={item.href || ""}>{item.title}</Link>
        )}
      </span>
    );
  });

  const customSeparator = <i className="icon-next-arrow text-sm leading-4 text-grey-medium"></i>;

  return (
    <Breadcrumbs
      separator={customSeparator}
      separatorMargin={separatorMargin}
    >
      {breadcrumbsItems}
    </Breadcrumbs>
  );
}

export default DynamicBreadcrumbs;
