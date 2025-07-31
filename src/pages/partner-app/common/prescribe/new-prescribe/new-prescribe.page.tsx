import DynamicBreadcrumbs from "@/common/components/Breadcrumbs";
import AddPatientForm from "../add-patient/add-patient-form";

function NewPrescribePage() {
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
      title: "Add New Patient",
    },
  ];

  return (
    <>
      <div className="page-title">
        <h6 className="lg:h2 md:h3 sm:h4">Add New Patient</h6>
      </div>
      <DynamicBreadcrumbs
        items={menuItems}
        separatorMargin="1"
      />
      <AddPatientForm />
    </>
  );
}

export default NewPrescribePage;
