import { IMessage } from "@/common/api/models/interfaces/MeetingInformation";
import dmlToast from "@/common/configs/toaster.config";
import { ActionIcon, Button, Input, ScrollArea, Tooltip } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import axios from "axios";
import Pusher from "pusher-js";
import { useEffect, useState } from "react";
import ConfirmationModal from "../../ConfirmationModal";

interface MessagesPropTypes {
  meetingInformation: {
    uid: string | number | null | undefined;
    prescription_id: string | number | null | undefined;
    patient_id: string | number | null | undefined;
    type?: string;
    senderType?: string;
    loadPage?: string;
  };
  messages: IMessage[];
  setMessages: React.Dispatch<React.SetStateAction<IMessage[]>>;
  patientData?: any;
  scrollHeight?: string;
  messageIcon?: string;
}

function CommunicationMessage({ messages, setMessages, meetingInformation, patientData, scrollHeight, messageIcon }: MessagesPropTypes) {
  const [openVideoCall, handleOpenVideoCall] = useDisclosure();

  useEffect(() => {
    // Initialize Pusher
    const pusher = new Pusher("7f6a820029a653d460bf", {
      cluster: "ap2",
    });

    const channel = pusher.subscribe("Docmedilink");
    channel.bind("message.sent", (data: IMessage) => {
      if (meetingInformation?.uid !== data?.uid && meetingInformation?.patient_id === data?.patient_id) {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            prescription_id: data?.prescription_id,
            uid: data.uid,
            message: data.message,
            patient_id: patientData?.patient_id,
            doctor_id: patientData?.doctor_id,
            client_id: patientData?.client_id,
            created_at: new Date().toISOString(),
          },
        ]);
        dmlToast.success({ title: `Message Received` });
      }
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

  const [message, setMessage] = useState<string>("");

  const sendMessage = async (customMessage?: string) => {
    const msgToSend = customMessage || message;
    if (!msgToSend) return;

    try {
      // Immediately clear the input field
      setMessage("");

      // Add the new message to your messages list
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          prescription_id: meetingInformation?.prescription_id,
          uid: meetingInformation?.uid,
          message: msgToSend,
          created_at: new Date().toISOString(),
        },
      ]);

      // Post the message to the backend
      await axios.post(`${import.meta.env.VITE_BASE_URL}/messages/send-message`, {
        ...{ message: msgToSend },
        ...meetingInformation,
      });
    } catch (error) {
      console.error("Error sending message", error);
    }
  };

  // const navigate = useNavigate();

  const handelNavigateCall = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/appointment/create-calling-appoinment`, meetingInformation);
      handleOpenVideoCall.close();
      window.open("/doctor-patient-calling/" + response.data?.data?.meeting_link);
    } catch (error) {
      console.error("Error sending message", error);
    }
  };

  // Quick message handler
  const handleQuickMessage = (msg: string) => {
    sendMessage(msg);
  };

  return (
    <div className="card pb-6">
      <div className="card-title with-border flex items-center justify-between">
        <h6>Messages</h6>
        {messageIcon && (
          <Tooltip
            label="Join Meeting"
            position="top"
            offset={{ mainAxis: 7 }}
          >
            <ActionIcon>
              <i
                className={`${messageIcon} cursor-pointer text-xl/none`}
                onClick={() => handleOpenVideoCall.open()}
              ></i>
            </ActionIcon>
          </Tooltip>
        )}
      </div>
      <div className="card-body py-4 text-center">
        {messages.length === 0 ? (
          <>
            <Button
              size="sm"
              mb="md"
              variant="transparent"
              className="extra-text-medium text-grey"
            >
              Tap to send
            </Button>
            <ul className="">
              <ScrollArea.Autosize
                type="always"
                scrollbarSize={6}
                scrollbars="y"
                offsetScrollbars
                classNames={{
                  root: "min-h-[120px]",
                  viewport: "view-port-next-inner pr-6 [&>div]:!flex [&>div]:flex-col [&>div]:gap-2",
                }}
              >
                <li
                  className="p-2.5 rounded bg-primary-light text-primary text-fs-sm cursor-pointer"
                  onClick={() => handleQuickMessage(`Hello ${patientData?.patient?.name}`)}
                >
                  Hello {patientData?.patient?.name}
                </li>
                <li
                  className="p-2.5 rounded bg-primary-light text-primary text-fs-sm cursor-pointer"
                  onClick={() => handleQuickMessage("Need to clear some confusions regarding your prescription.")}
                >
                  Need to clear some confusions regarding your prescription.
                </li>
                <li
                  className="p-2.5 rounded bg-primary-light text-primary text-fs-sm cursor-pointer"
                  onClick={() => handleQuickMessage("When are you available for a meeting?")}
                >
                  When are you available for a meeting?
                </li>
              </ScrollArea.Autosize>
            </ul>
          </>
        ) : (
          <ul className="">
            <ScrollArea.Autosize
              type="always"
              scrollbarSize={6}
              scrollbars="y"
              offsetScrollbars
              classNames={{
                root: scrollHeight ? scrollHeight : "h-[175px]",
                viewport: "view-port-next-inner pr-6 [&>div]:!flex [&>div]:flex-col [&>div]:gap-2",
              }}
            >
              {messages.map((item, index) => (
                <li
                  key={index}
                  className={`${item.uid === meetingInformation?.uid ? "self-end text-right mb-1" : "self-start mb-1"}`}
                >
                  <div className={`p-3.5 rounded ${item.uid === meetingInformation?.uid ? "bg-primary text-white" : "bg-grey-low text-grey"} text-fs-sm`}>{item.message}</div>
                  <div className="text-xs text-grey mt-1">{new Date(item.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
                </li>
              ))}
            </ScrollArea.Autosize>
          </ul>
        )}
      </div>
      <div className="card-footer flex items-center w-full mt-10">
        <Input.Wrapper className="w-full">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write a message"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault(); // Prevent newline in the input
                sendMessage(); // Send the message
              }
            }}
            rightSection={
              <Tooltip
                label="Send"
                position="top"
                offset={{ mainAxis: 7 }}
              >
                <Button
                  onClick={() => sendMessage()}
                  variant="primary"
                  className="w-12 h-12 rounded-full p-0"
                >
                  <i className="icon-send text-2xl"></i>
                </Button>
              </Tooltip>
            }
            styles={{
              input: {
                minHeight: "48px",
                height: "100%",
                paddingInline: "55px",
                paddingLeft: "16px",
                borderRadius: "50px",
              },
              section: {
                pointerEvents: "all",
              },
            }}
          />
        </Input.Wrapper>
      </div>
      <ConfirmationModal
        openModal={openVideoCall}
        onModalClose={handleOpenVideoCall.close}
        okBtnText="Invite & Start Call"
        cancelBtnText="Cancel"
        onModalPressOk={handelNavigateCall}
        title="Confirm Video Call Invitation"
        message={`<div className="text-center">You are about to invite the patient and start a video call. Do you want to proceed?</div>`}
        dmlIcon="icon-video text-5xl/none"
      />
    </div>
  );
}

export default CommunicationMessage;
