import { IServerErrorResponse } from "@/common/api/models/interfaces/ApiResponse.model";
import { ICommonParams } from "@/common/api/models/interfaces/Common.model";
import { IMedicineListItem, IPrescribedMedicine } from "@/common/api/models/interfaces/Medication.model";
import { IDirectPrescribe } from "@/common/api/models/interfaces/PrescribeNow.model";
import { medicineRepository } from "@/common/api/repositories/medicineRepository";
import prescribeNowRepository from "@/common/api/repositories/prescribeNowRepository";
import prescriptionApiRepository from "@/common/api/repositories/prescriptionRepository";
import { IShowing } from "@/common/components/CustomFilter";
import ProductCard from "@/common/components/product-card";
import dmlToast from "@/common/configs/toaster.config";
import { doesSpot } from "@/common/constants/dosespot";
import { formatDate } from "@/utils/date.utils";
import { Button } from "@mantine/core";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import CryptoJS from "crypto-js";
import Pusher from "pusher-js";
import { useEffect, useState } from "react";
import DoseSpotIframeModal from "./DoseSpotIframeModal";

interface MedicationDataType {
  medication_id: string;
}
interface StepThreeProps {
  handleBack: () => void;
  formData: any;
  handleSubmit: (medicineData: IPrescribedMedicine[]) => void;
}

function StepThree({ handleBack, handleSubmit, formData }: StepThreeProps) {
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [doseSpotModal, setDoseSpotModal] = useState<boolean>(false);
  const [pageLoading, setPageLoading] = useState<boolean>(false);
  const [fullPageLoader, setFullPageLoader] = useState<boolean>(false);
  const [showing, setShowing] = useState<IShowing | null>(null);
  const [statusFilter, setStatusFilter] = useState<string[]>(["1", "2"]);
  const [medicines, setMedicines] = useState<IMedicineListItem[]>();
  const [prescriberSsoCode, setPrescriberSsoCode] = useState<string>("");
  // const [selectedMedicine, setSelectedMedicine] = useState<string>();
  const [error, setError] = useState<string>();
  const [prescribedMeds, setPrescribedMeds] = useState<IPrescribedMedicine[]>();
  useEffect(() => {
    console.log(prescribedMeds);
  });

  const fetchMedicine = () => {
    const params: ICommonParams = {
      per_page: pageSize,
      page: pageIndex,
      status: statusFilter,
      sort_column: "id",
      sort_direction: "desc",
    };
    return medicineRepository.getAllMedicines(params);
  };
  const medicineQuery = useQuery({ queryKey: ["Step2medicines"], queryFn: fetchMedicine });

  useEffect(() => {
    if (formData?.medicine_selected?.length > 0) {
      // setSelectedMedicine(formData.medication_id);
      setPrescribedMeds(formData.medicine_selected);
    }
  }, [formData]);

  useEffect(() => {
    if (medicineQuery?.data?.data?.status_code == 200 && medicineQuery?.data?.data?.data?.data) {
      setMedicines(medicineQuery?.data?.data?.data?.data);
    }
  }, [medicineQuery.isFetched, medicineQuery.data]);

  const saveMedicineData = (data: any) => {
    // if (selectedMedicine) {
    //   const medicine = medicines?.find((item) => (item.id ? item.id.toString() == selectedMedicine : {}));
    //   const medicineData = {
    //     medication_id: selectedMedicine,
    //     medication_data: medicine,
    //   };
    //   handleSubmit(medicineData);
    // } else {
    //   setError("Please select a medicine");
    // }
    if (prescribedMeds !== undefined && prescribedMeds?.length > 0) {
      handleSubmit(prescribedMeds);
    } else {
      setError("You must prescribe at least a medicine to proceed.");
    }
  };

  useEffect(() => {
    // Initialize Pusher
    const pusher = new Pusher("7f6a820029a653d460bf", {
      cluster: "ap2",
    });

    const channel = pusher.subscribe("Docmedilink");
    channel.bind("dosespot.create-prescription", (res: any) => {
      let addedMeds;
      const item = medicines?.find((item: any) => {
        return item.id == res?.medication_id;
      });
      if (item) {
        if (prescribedMeds != undefined && prescribedMeds?.length > 0) {
          addedMeds = [...(prescribedMeds as Partial<IMedicineListItem>[]), { ...item, prescription_id: res?.id }];
        } else {
          addedMeds = [{ ...item, prescription_id: res?.id }];
        }
        setPrescribedMeds(addedMeds);
        setFullPageLoader(false);
      }

      //
      // if (localUserId != data?.uid) {
      //   setMessages((prevMessages) => [
      //     ...prevMessages,
      //     { appointment_id: data?.appointment_id, uid: data?.uid, message: data.message, created_at: new Date().toISOString() },
      //   ]);
      // }
      // console.log(data);
      // dmlToast.success({ title: `Message Received` });
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

  const prescribeDirectMutation = useMutation({
    mutationFn: (payload: IDirectPrescribe) => prescribeNowRepository.prescribeDirect(payload),
  });

  const handleGenerate = (patientId: string | undefined, doctorId: string | undefined) => {
    if (doctorId !== undefined && patientId != undefined) {
      setFullPageLoader(true);
      const userId = doctorId;
      const randomPhrase = doesSpot.randomKey.substring(0, 22);
      const concatenatedString = userId + randomPhrase + doesSpot.clinicKey;
      const byteValue = CryptoJS.enc.Utf8.parse(concatenatedString);
      // const hash = crypto.SHA512(byteValue.toString());
      const hash = CryptoJS.SHA512(byteValue);

      let base64String = CryptoJS.enc.Base64.stringify(hash);
      // Remove '==' at the end if present
      if (base64String.endsWith("==")) {
        base64String = base64String.slice(0, -2);
      }
      // // // URL encode the final output
      const urlEncodedString = encodeURIComponent(base64String);

      const finalurl = `${doesSpot.baseUrl}?SingleSignOnClinicId=${doesSpot.clinicId}&SingleSignOnUserId=${userId}&SingleSignOnPhraseLength=32&SingleSignOnCode=${doesSpot.clinicSsoCode}&SingleSignOnUserIdVerify=${urlEncodedString}&PatientID=${patientId}`;
      setPrescriberSsoCode(finalurl);
      setDoseSpotModal(true);
    } else {
      setDoseSpotModal(false);
      dmlToast.error({
        title: "You don't have permission to create prescription",
      });
    }
    setPageLoading(false);
  };

  const handleEPrescription = (medInfo: any) => {
    setPageLoading(true);
    const paramsValue = { ...formData.patient, mediaction_id: medInfo?.id };
    prescriptionApiRepository
      .dosespotCheckAndCreate(paramsValue)
      .then((res) => {
        handleGenerate(res.data?.data?.patient_dosespot_id, res.data?.data?.doctor_dosespot_id);
      })
      .catch((error) => {
        dmlToast.error({
          title: error?.response?.data.message,
        });
        setPageLoading(false);
      });
  };

  const handleMedicineSelect = (item: IPrescribedMedicine) => {
    // if (id) {
    //   setSelectedMedicine(id);
    //   setError("");
    // }
    let addedMeds;
    if (prescribedMeds != undefined && prescribedMeds?.length > 0) {
      addedMeds = [...prescribedMeds, item];
    } else {
      addedMeds = [item];
    }

    if (formData && formData.patient) {
      const payload: IDirectPrescribe = {
        patient: {
          id: formData.patient.id,
          first_name: formData.patient.first_name,
          last_name: formData.patient.last_name,
          email: formData.patient.email,
          gender: formData.patient.gender,
          dob: formatDate(formData.patient.dob, "YYYY-MM-DD"),
          cell_phone: formData.patient.cell_phone,
          address: formData.patient.address,
          state: formData.patient.state,
          city: formData.patient.city,
          zip_code: formData.patient.zip_code,
          height: formData.patient.height,
          height_unit: "CM",
          weight: formData.patient.weight,
          allergy: formData.patient.allergy,
          allergy_information: formData.patient.allergyType,
          social_security_number: formData.patient.ssn,
        },
        symptoms: formData.patient.symptoms || "",
        medication_id: item.id?.toString() || "",
        subjective_symptom: formData.soap_note.subjective_symptom || "",
        objective_finding: formData.soap_note.objective_finding || "",
        assessment_goal: formData.soap_note.assessment_goal || "",
        plan_of_treatment: formData.soap_note.plan_of_treatment || "",
        icd_codes: formData.soap_note.icd_codes.map((item) => Number(item.id)) || [],
        cpd_codes: formData.soap_note.cpt_codes.map((item) => Number(item.id)) || [],
        refill_number: item?.refills?.toString() || "",
        refill_exp_date: formatDate(item?.refill_end_date),
        prescribe_note: item?.note || "",
      };
      prescribeDirectMutation.mutate(payload, {
        onSuccess: (res) => {
          // const prescribe_id = res?.data?.data?.find((item) => item.medication_id == item.id).id;
          // const meds = addedMeds.map((med) => ({
          //   ...med,
          //   prescription_id: res?.data?.data?.find((prescribed_item) => {
          //     // eslint-disable-next-line no-debugger
          //     debugger;
          //     return prescribed_item.medication_id == med.id;
          //   }).id,
          // }));
          console.log(res);

          const meds = addedMeds.map((med) => {
            if (med.id == res?.data?.data?.medication_id) {
              console.log({ ...med, prescription_id: res?.data?.data?.id });

              return { ...med, prescription_id: res?.data?.data?.id };
            } else {
              return med;
            }
          });

          setPrescribedMeds(meds);
          dmlToast.success({
            title: res?.data?.message,
          });
        },
        onError: (err) => {
          console.log(err);
          const error = err as AxiosError<IServerErrorResponse>;
          dmlToast.error({
            title: error?.response?.data?.message,
          });
        },
      });
    }
  };

  return (
    <>
      <div className="card mb-6">
        <div className="card-title with-border mb-6">
          <h6>Medication Information</h6>
        </div>
        <span className="extra-form-text-medium text-foreground">Select Medicines</span>
        <div className="grid grid-cols-2 gap-6 pt-4">
          {/* {medicines?.map((item) => (
            <div
              className="card p-5 border border-grey-low flex gap-4 cursor-pointer"
              key={item.id}
              onClick={() => handleMedicineSelect(item.id ? item.id.toString() : "")}
            >
              <div className="card-thumb w-[200px]">
                <Avatar
                  src={`${import.meta.env.VITE_BASE_PATH}/storage/${item.image}`}
                  size={200}
                  radius={10}
                >
                  <img
                    src="/images/product-img-placeholder.jpg"
                    alt=""
                  />
                </Avatar>
              </div>
              <div className="card-content flex flex-col gap-3 w-[calc(100%_-_216px)]">
                <h6 className="text-foreground">{item?.drug_name}</h6>
                <ul className="flex space-x-1 divide-x last">
                  <li>
                    <span className="text-fs-md">{item?.type}</span>
                  </li>
                  <li className="pl-1">
                    <span className="text-fs-md">{item?.category?.title}</span>
                  </li>
                </ul>
                <h4>${item?.price}</h4>
                <Button
                  variant="transparent"
                  p={0}
                  w={40}
                  className="ms-auto"
                >
                  <i
                    className={` text-4xl/none transition-all duration-300 ${
                      selectedMedicine == item.id.toString()
                        ? "icon-checkmark-circle text-green-middle rounded-full text-2xl/none flex items-center justify-center"
                        : "icon-radio-button-deselected text-grey-low"
                    }`}
                  ></i>
                </Button>
              </div>
            </div>
          ))}
          {error ? <p className="text-base text-danger">{error}</p> : ""} */}
          {medicines?.map((item) => (
            <ProductCard
              key={item?.id}
              pageLoading={pageLoading}
              productDetails={item}
              onPrescribeDirect={(prescribedData) => handleMedicineSelect(prescribedData)}
              handleEPrescription={(prescribedData) => handleEPrescription(prescribedData)}
              prescribedData={prescribedMeds?.find((med) => med?.id == item?.id)}
            />
          ))}
        </div>
      </div>
      <div className="flex justify-end mb-2 text-sm text-danger">{error}</div>
      <div className="flex justify-between">
        <div className="flex gap-6 ms-auto">
          <Button
            px={0}
            variant="transparent"
            onClick={handleBack}
            classNames={{
              label: "underline font-medium",
            }}
          >
            Back
          </Button>
          <Button
            w={256}
            color="grey.4"
            c="foreground"
            disabled
          >
            Save as Draft
          </Button>
          <Button
            w={256}
            onClick={saveMedicineData}
            disabled={prescribedMeds == undefined || prescribedMeds?.length == 0}
          >
            Next
          </Button>
        </div>
      </div>
      <DoseSpotIframeModal
        openModal={doseSpotModal}
        setOpenModal={setDoseSpotModal}
        prescriberSsoCode={prescriberSsoCode}
      />
    </>
  );
}

export default StepThree;
