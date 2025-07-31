import dashboardApiRepository from "@/common/api/repositories/dasboardRepository";
import MatrixCard from "@/common/components/MatrixCard";
import { Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import InviteClient from "../client/components/InviteClient";

const sellingDrug = [
  {
    medication: {
      drug_name: "MangoRx's Prime",
    },
    total_qty_ordered: 9453,
  },
  {
    medication: {
      drug_name: "Semaglue",
    },
    total_qty_ordered: 5353,
  },
  {
    medication: {
      drug_name: "Chewable",
    },
    total_qty_ordered: 5354,
  },
  {
    medication: {
      drug_name: "Testosterone Booster",
    },
    total_qty_ordered: 5774,
  },
];

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState<any>();
  const [openInviteClient, setOpenInviteClientHandler] = useDisclosure();

  const dashboardQuery = useQuery({ queryKey: ["spaModuleDashboard"], queryFn: () => dashboardApiRepository.getPartnerSummary() });
  // const counts = dashboardQuery.data?.data?.data;
  useEffect(() => {
    if (dashboardQuery?.data?.data.status_code == 200 && dashboardQuery?.data?.data.data) {
      setDashboardData(dashboardQuery?.data?.data.data);
    }
  }, [dashboardQuery?.data?.data.data]);

  return (
    <div className="dashboard">
      <div className="page-title pb-5">
        <div className="page-title-start">
          <h6 className="lg:h2 md:h3 sm:h4">Super Admin Dashboard</h6>
        </div>
        <div className="page-title-end">
          <Button
            size="sm-2"
            onClick={() => setOpenInviteClientHandler.open()}
          >
            Add Client
          </Button>
        </div>
      </div>
      <div className="space-y-5">
        <div className="card grid sm:grid-cols-2 gap-5">
          <MatrixCard
            matCard="bg-gradient-to-bl from-blue-light to-blue-medium p-6"
            iconBg="bg-primary md:h-20 md:w-20"
            dmlIcon="icon-Client md:text-[40px]/none text-2xl/none text-white"
            cardCount={dashboardData?.total_clients}
            countStyle="pb-14 md:-mt-20 -mt-10"
            cardText="Total Client"
            textW="!text-xl !font-medium mt-9"
            cardLink="/admin-client/client"
            linkText="View Details"
            linkIcon="icon-next_arrow text-xl/none"
          />
          <MatrixCard
            matCard="bg-gradient-to-bl from-yellow-light to-yellow-medium p-6"
            iconBg="bg-yellow-deep md:h-20 md:w-20"
            dmlIcon="icon-Partner md:text-[40px]/none text-2xl/none text-white"
            cardCount={dashboardData?.total_partners}
            countStyle="pb-14 md:-mt-20 -mt-10"
            cardText="Total Customer Account"
            textW="!text-xl !font-medium mt-9"
            cardLink="/admin-client/partner-account"
            linkText="View Details"
            linkIcon="icon-next_arrow text-xl/none"
          />
          <MatrixCard
            matCard="bg-gradient-to-bl from-green-light to-green-medium p-6"
            iconBg="bg-green-deep md:h-20 md:w-20"
            dmlIcon="icon-checkmark-circle md:text-[40px]/none text-2xl/none text-white"
            cardCount={dashboardData?.total_completed_prescriptions}
            countStyle="pb-14 md:-mt-20 -mt-10"
            cardText="Total Successful Prescription"
            textW="!text-xl !font-medium mt-9"
            cardLink="/admin-client/prescriptions"
            linkText="View Details"
            linkIcon="icon-next_arrow text-xl/none"
          />
          <MatrixCard
            matCard="bg-gradient-to-bl from-red-light to-red-medium p-6"
            iconBg="bg-red-deep md:h-20 md:w-20"
            dmlIcon="icon-pause md:text-[40px]/none text-2xl/none text-white"
            cardCount={dashboardData?.shipping_pending_prescriptions}
            countStyle="pb-14 md:-mt-20 -mt-10"
            cardText="Orders Awaiting Shipment"
            textW="!text-xl !font-medium mt-9"
            cardLink="/admin-client/reports"
            linkText="View Details"
            linkIcon="icon-next_arrow text-xl/none"
          />
        </div>
        {/* <div className="grid sm:grid-cols-2 gap-5">
          <div className="card ">
            <div className="card-inner">
              <div className="card-header flex items-center justify-between gap-2">
                <h6 className="text-foreground leading-none">Top Selling Drugs</h6>
                <Link
                  to="../top-selling-drugs"
                  className="text-primary text-fs-xs !font-bold"
                >
                  <i className="icon-Through text-fs-md"></i>
                </Link>
              </div>
              <div className="card-body">
                <div className="flex items-center justify-between border-b border-b-grey-btn pt-5 pb-3">
                  <span className="text-fs-sm text-grey-medium">Drug Name</span>
                  <span className="text-fs-sm text-grey-medium flex-shrink-0 min-w-[55px]">Sold Qty</span>
                </div>
                <ul className="flex flex-col gap-6 pt-5">
                  {sellingDrug?.map((item, index) => (
                    <li
                      className="flex items-center justify-between"
                      key={index}
                    >
                      <span className="text-fs-sm !font-medium text-foreground capitalize">{item?.medication?.drug_name.toLowerCase()}</span>
                      <span className="text-fs-xs text-grey-medium flex-shrink-0 min-w-[55px] text-end">{item?.total_qty_ordered}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="card ">
            <div className="card-inner">
              <div className="card-header flex items-center justify-between gap-2">
                <h6 className="text-foreground leading-none">Upcoming Orders</h6>
                <Link
                  to="../top-selling-drugs"
                  className="text-primary text-fs-xs !font-bold"
                >
                  <i className="icon-Through text-fs-md"></i>
                </Link>
              </div>
              <div className="card-body">
                <div className="flex items-center justify-between border-b border-b-grey-btn pt-5 pb-3">
                  <span className="text-fs-sm text-grey-medium">Drug Name</span>
                  <span className="text-fs-sm text-grey-medium flex-shrink-0 min-w-[55px]">Sold Qty</span>
                </div>
                <ul className="flex flex-col gap-6 pt-5">
                  {sellingDrug?.map((item, index) => (
                    <li
                      className="flex items-center justify-between"
                      key={index}
                    >
                      <span className="text-fs-sm !font-medium text-foreground capitalize">{item?.medication?.drug_name.toLowerCase()}</span>
                      <span className="text-fs-xs text-grey-medium flex-shrink-0 min-w-[55px] text-end">{item?.total_qty_ordered}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div> */}
      </div>
      <InviteClient
        openModal={openInviteClient}
        onModalClose={setOpenInviteClientHandler.close}
      />
    </div>
  );
};

export default DashboardPage;
