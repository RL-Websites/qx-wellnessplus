import { IServerErrorResponse } from "@/common/api/models/interfaces/ApiResponse.model";
import addClientApiRepository from "@/common/api/repositories/clientRepositoiry";
import DynamicBreadcrumbs from "@/common/components/Breadcrumbs";
import ClientPersonalInfo from "@/common/components/client/client-details/components/ClientPersonalInfo";
import Partners from "@/common/components/client/client-details/components/Partners";
import dmlToast from "@/common/configs/toaster.config";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useParams } from "react-router-dom";

const ClientDetailsPage = () => {
  const { id: slug } = useParams();

  const { data, refetch } = useQuery({
    queryKey: ["clinicDetails", slug],
    queryFn: () => addClientApiRepository.getClientPartnerDetails(slug),
    select: (response) => response.data.data as any,
  });

  const clientData = data;

  const menuItems = [
    {
      title: "Client",
      href: "/admin-client/client",
    },
    {
      title: "Client Details",
    },
  ];

  const statusMutation = useMutation({
    mutationFn: (payload: any) => {
      return addClientApiRepository.changeClientStatus(payload);
    },
  });

  const handleStatusUpdate = (slug: string | undefined, status: string | undefined) => {
    if (slug && status) {
      const payload: any = { slug: slug, status: status };
      statusMutation.mutate(payload, {
        onSuccess: (res) => {
          refetch();
          dmlToast.success({
            title: res?.data?.message,
          });
        },

        onError: (error) => {
          const err = error as AxiosError<IServerErrorResponse>;
          console.log(err?.response?.data?.message);
          dmlToast.error({
            title: err?.response?.data?.message,
          });
        },
      });
    }
  };

  return (
    <>
      <div className="page-title">
        <h6 className="lg:h2 md:h3 sm:h4">Details Of {clientData?.name}</h6>
      </div>
      <DynamicBreadcrumbs
        separatorMargin="2"
        items={menuItems}
      />
      <div className="space-y-5">
        <ClientPersonalInfo
          clientDetails={clientData}
          onStatusUpdate={handleStatusUpdate}
        />
        <Partners
          partnerList={clientData?.customers}
          isViewAll={false}
        />
      </div>
    </>
  );
};

export default ClientDetailsPage;
