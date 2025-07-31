import { Loader, Modal } from "@mantine/core";
import { useEffect, useState } from "react";

interface pageProps {
  openModal: boolean;
  setOpenModal: (value: boolean) => void;
  prescriberSsoCode: string;
}
function DoseSpotIframeModal({ openModal, setOpenModal, prescriberSsoCode }: pageProps) {
  const [pageLoading, setPageLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(function () {
      setPageLoading(false);
    }, 2000);
  }, []);
  return (
    <Modal
      opened={openModal}
      onClose={() => setOpenModal(false)}
      title="Create Prescription"
      size="100vw"
      centered
    >
      <div>
        {pageLoading && (
          <>
            <Loader />
          </>
        )}
        {!pageLoading && prescriberSsoCode && prescriberSsoCode != "" && (
          <iframe
            width="100%"
            height="764"
            src={prescriberSsoCode}
          ></iframe>
        )}
      </div>
    </Modal>
  );
}

export default DoseSpotIframeModal;
