import { IAPILogDetail } from "@/common/api/models/interfaces/ApiLogs.model";
import dashboardApiRepository from "@/common/api/repositories/dasboardRepository";
import { Modal, Skeleton } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { allExpanded, defaultStyles, JsonView } from "react-json-view-lite";
import "react-json-view-lite/dist/index.css";

const RequestedData = ({ openModal, modalDismiss, apiLogId }: { openModal: boolean; modalDismiss: () => void; apiLogId }) => {
  const [apiLogDetail, setApilogDetail] = useState<IAPILogDetail>();
  const apiLogDetailQuery = useQuery({
    queryKey: ["apiRequestData", openModal],
    queryFn: () => dashboardApiRepository.getApiLogDetail(apiLogId),
    enabled: openModal,
  });

  const request_data = apiLogDetail?.request_data;

  useEffect(() => {
    if (apiLogDetailQuery?.data?.data?.status_code == 200 && apiLogDetailQuery?.data?.data?.data) {
      setApilogDetail(apiLogDetailQuery?.data?.data?.data);
    }
  }, [apiLogDetailQuery?.data]);

  return (
    <Modal.Root
      opened={openModal}
      onClose={modalDismiss}
      closeOnClickOutside={false}
      centered
      size="1237px"
    >
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Header>
          <Modal.Title>{apiLogDetail?.request_from || "Requested Data"}</Modal.Title>
          <div className="flex items-center">
            <i
              onClick={modalDismiss}
              className="icon-cross text-2xl/none cursor-pointer ml-6"
            />
          </div>
        </Modal.Header>
        <Modal.Body>
          {apiLogDetailQuery?.isFetching ? (
            <>
              <Skeleton
                width={450}
                height={22}
                mb={15}
              />
              <Skeleton
                width={550}
                height={22}
                mb={15}
              />
              <Skeleton
                width={420}
                height={22}
                mb={15}
              />
              <Skeleton
                width={380}
                height={22}
                mb={15}
              />
            </>
          ) : request_data ? (
            <JsonView
              data={JSON.parse(request_data)}
              shouldExpandNode={allExpanded}
              style={defaultStyles}
            />
          ) : (
            ""
          )}
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
};

export default RequestedData;
