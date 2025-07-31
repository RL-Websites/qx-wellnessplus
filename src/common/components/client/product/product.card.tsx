import { IMedicineListItem } from "@/common/api/models/interfaces/Medication.model";
import { getStatusClassName } from "@/utils/status.utils";
import { Avatar } from "@mantine/core";
import { NavLink } from "react-router-dom";

interface IProductCardProps {
  medicine: IMedicineListItem;
  module?: string;
  sellingPrice?: string;
  isEdit?: boolean;
  isDetails?: boolean;
  isSelected?: boolean;
  isSelectable?: boolean;
  onSelect?: () => void;
  onDuplicate?: () => void;
}

function ProductCard(cardProps: IProductCardProps) {
  const { medicine, module = "client", sellingPrice } = cardProps;

  const statusStr = medicine?.is_active ? "active" : "inactive";
  const displayStatus = statusStr.charAt(0).toUpperCase() + statusStr.slice(1);

  return (
    <div
      onClick={cardProps?.onSelect}
      className={`card flex gap-6 p-5 space-y-3 transition-all border border-grey-low ${cardProps?.isSelected ? "bg-primary-light border-primary" : ""} ${
        cardProps?.isSelectable ? "cursor-pointer hover:bg-primary-light hover:border-primary" : ""
      }`}
    >
      <div className="card-thumb w-[180px]">
        <Avatar
          src={medicine?.image ? `${import.meta.env.VITE_BASE_PATH}/storage/${medicine?.image}` : "/images/product-img-placeholder.jpg"}
          size={180}
          radius={10}
        />
      </div>
      <div className="card-body w-[calc(100%_-_204px)]">
        <div className="flex justify-between">
          <div className="flex flex-col gap-3">
            <div className="flex justify-between">
              {medicine?.name ? (
                <h6 className="text-foreground">
                  {medicine?.name} {medicine?.strength}
                  {medicine?.unit}
                </h6>
              ) : null}
            </div>
            <div className="flex gap-3">
              <span className={`tags capitalize !h-[22px] !w-auto px-2 ${getStatusClassName(medicine?.is_active ? "active" : "inactive")}`}>{displayStatus}</span>

              {cardProps?.module == "client" ? (
                <span className="tags capitalize !h-[22px] !w-auto px-2 text-foreground bg-yellow-light">{medicine?.customer_count} Customer Assigned</span>
              ) : (
                ""
              )}
            </div>
          </div>
          <div className="space-y-3 pt-2">
            {cardProps?.isEdit !== false && (
              <NavLink
                className="flex items-center"
                to={`edit-product/${medicine?.id}`}
              >
                <i className="icon-pencil-edit text-primary text-2xl/none"></i>
              </NavLink>
            )}
            {cardProps?.isDetails !== false && (
              <NavLink
                className="flex items-center"
                to={`details/${medicine?.id}`}
              >
                <i className="icon-Through text-primary text-2xl/none"></i>
              </NavLink>
            )}
            {cardProps?.isSelected && <i className="icon-checkmark-circle text-2xl/none text-green-middle" />}
          </div>
        </div>
        <div className="mt-3 space-y-2">
          <div className="flex items-center justify-between">
            <h6 className="text-grey-medium text-sm">Dose :</h6>
            <h6 className="text-foreground text-sm">{medicine?.strength + " " + medicine?.unit || "N/A"}</h6>
          </div>
          {module === "client" && (
            <div className="flex items-center justify-between">
              <h6 className="text-grey-medium text-sm">Total Cost :</h6>
              <h6 className="text-foreground text-sm">${medicine?.total_price || 0}</h6>
            </div>
          )}
          {module === "customer" && (
            <div className="flex items-center justify-between">
              <h6 className="text-foreground text-sm">Selling Price :</h6>
              <h6 className="text-foreground text-sm">${sellingPrice || 0}</h6>
            </div>
          )}
          <div className="flex items-center justify-between">
            <h6 className="text-grey-medium text-sm">Pharmacy Cost :</h6>
            <h6 className="text-foreground text-sm">${medicine?.price || 0}</h6>
          </div>
          <div className="flex items-center justify-between">
            <h6 className="text-grey-medium text-sm">Doctor Fee :</h6>
            <h6 className="text-foreground text-sm">${medicine?.doctor_fee || 0}</h6>
          </div>
          <div className="flex items-center justify-between">
            <h6 className="text-grey-medium text-sm">Service Fee :</h6>
            <h6 className="text-foreground text-sm">${medicine?.service_fee || 0}</h6>
          </div>
          <div className="flex items-center justify-between">
            <h6 className="text-grey-medium text-sm">Shipping Fee :</h6>
            <h6 className="text-foreground text-sm">${medicine?.shipping_fee || 0}</h6>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
