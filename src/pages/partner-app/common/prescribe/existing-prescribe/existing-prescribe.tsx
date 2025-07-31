import partnerPatientRepository from "@/common/api/repositories/partnerPatientRepository";
import DynamicBreadcrumbs from "@/common/components/Breadcrumbs";
import CommonExistingPatient from "@/common/components/prescribe-patient/prescribe-form/prescribe-existing/common-existing-patient";

function ExistingPrescribe() {
  const menuItems = [
    {
      title: "Patients",
      href: "/partner/patients",
    },
    {
      title: "Add Patient",
      href: "/partner/add-patient",
    },
    {
      title: "Existing Patient",
    },
  ];
  return (
    <>
      <div className="page-title">
        <h6 className="lg:h2 md:h3 sm:h4">Add Existing Patient</h6>
      </div>
      <DynamicBreadcrumbs
        items={menuItems}
        separatorMargin="1"
      />
      <CommonExistingPatient
        newPatientLink="../add-patient/new-patient"
        apiMethod={partnerPatientRepository.getPatientList}
      />
    </>
  );
}

export default ExistingPrescribe;
