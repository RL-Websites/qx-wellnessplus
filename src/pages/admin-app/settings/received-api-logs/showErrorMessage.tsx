import { IAPILogDetail } from "@/common/api/models/interfaces/ApiLogs.model";
import dashboardApiRepository from "@/common/api/repositories/dasboardRepository";
import { Modal, Skeleton } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const ShowErrorMessage = ({ openModal, modalDismiss, apiLogId }: { openModal: boolean; modalDismiss: () => void; apiLogId }) => {
  const [apiLogDetail, setApilogDetail] = useState<IAPILogDetail>();
  const apiLogDetailQuery = useQuery({
    queryKey: ["apiErrorData", openModal],
    queryFn: () => dashboardApiRepository.getApiLogDetail(apiLogId),
    enabled: openModal,
  });

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
          <Modal.Title>Error Message</Modal.Title>
          <div className="flex items-center">
            <i
              onClick={modalDismiss}
              className="icon-cross text-2xl/none cursor-pointer ml-6"
            />
          </div>
        </Modal.Header>
        <Modal.Body>
          {apiLogDetailQuery?.isFetching ? (
            <Skeleton
              width={450}
              height={22}
            />
          ) : (
            <p className="text-danger">{apiLogDetail?.message}</p>
          )}
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
};

export default ShowErrorMessage;
