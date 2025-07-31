import { IMessage } from "@/common/api/models/interfaces/MeetingInformation";
import prescriptionApiRepository from "@/common/api/repositories/prescriptionRepository";
import CommunicationMessage from "@/common/components/patient/components/CommunicationMessage";
import { Image, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

function MessageConversation() {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [queryParams] = useSearchParams();
  const uid = queryParams.get("uid");
  const loadPage = queryParams.get("loadPage");

  const basePath = loadPage == "docuspa" ? `${import.meta.env.VITE_BASE_PATH}/storage` : `${import.meta.env.VITE_BASE_PATH}/storage/logos`;

  const prescriptionQuery = useQuery({
    enabled: !!uid,
    queryKey: ["messageDetailsData", uid],
    queryFn: () => prescriptionApiRepository.messageDetails(uid ?? "", { loadPage }),
  });

  const prescriptionData = prescriptionQuery?.data?.data?.data;
  useEffect(() => {
    if (prescriptionData?.messages) {
      setMessages(prescriptionData?.messages);
    }
  }, [prescriptionData]);

  return (
    <section className="bg-background">
      <div className="container mx-auto h-full">
        <div className="external-page-header !pt-[50px] flex flex-wrap items-center justify-between">
          {prescriptionData?.client?.logo ? (
            <Image
              className="img-fluid"
              mah={80}
              maw={200}
              src={prescriptionData?.client?.logo ? `${basePath}/${prescriptionData?.client?.logo}` : `/images/client-logo.svg`}
              alt={prescriptionData?.client?.name ? prescriptionData?.client?.name : "Client logo"}
            />
          ) : prescriptionData?.client?.name ? (
            <Text className="text-fs-lg">{prescriptionData?.client?.name}</Text>
          ) : (
            ""
          )}

          <h4 className="md:h2 sm:h3">Communicate with Doctor</h4>
        </div>
        <div className="max-w-[730px] mx-auto h-[calc(100vh_-_125px)] pb-10">
          {prescriptionData && prescriptionData?.id && (
            <CommunicationMessage
              meetingInformation={{
                prescription_id: prescriptionData?.id,
                uid: prescriptionData?.patient?.u_id,
                type: "patient_page",
                senderType: "patient",
                loadPage: loadPage ?? "prescription",
                patient_id: prescriptionData?.patient_id,
              }}
              messages={messages}
              setMessages={setMessages}
              scrollHeight="h-[calc(100vh_-_350px)]"
            />
          )}
        </div>
      </div>
    </section>
  );
}

export default MessageConversation;
