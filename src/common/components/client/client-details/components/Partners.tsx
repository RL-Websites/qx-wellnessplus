import NoData from "@/common/components/NoData";
import { Anchor, Avatar, List, Text } from "@mantine/core";
import { Link } from "react-router-dom";

interface IPartner {
  partnerList: any;
  isViewAll?: boolean;
}

const Partners = ({ partnerList, isViewAll }: IPartner) => {
  return (
    <div className="card">
      <div className="card-title with-border flex justify-between">
        <h6>Customer Account</h6>
        {isViewAll && (
          <Anchor
            underline="always"
            fw={500}
            className=""
            to=""
            component={Link}
          >
            View All
          </Anchor>
        )}
      </div>
      {partnerList && partnerList?.length > 0 ? (
        <div className="physician-list mt-6">
          <List>
            <List.Item className="flex">
              {partnerList.map((partner) => {
                return (
                  <div
                    key={partner.id}
                    className="flex flex-wrap text-nowrap items-center physician"
                  >
                    {/* <Avatar
                      src={partner.logo}
                      alt="Physician"
                    /> */}
                    <Avatar src={`${import.meta.env.VITE_BASE_PATH}/storage/${partner?.profile_image}`}>
                      <img
                        src="/images/profile-blank.svg"
                        alt=""
                      />
                    </Avatar>
                    <Text
                      fw={500}
                      ms={5}
                      className="text-fs-lg text-foreground"
                    >
                      {partner.account_name}
                    </Text>
                  </div>
                );
              })}
            </List.Item>
          </List>
        </div>
      ) : (
        <NoData
          imgClass="w-[200px] m-0 mb-4"
          titleClass="h6 text-foreground mb-2"
          title="No Partner available yet!"
        />
      )}
    </div>
  );
};

export default Partners;
