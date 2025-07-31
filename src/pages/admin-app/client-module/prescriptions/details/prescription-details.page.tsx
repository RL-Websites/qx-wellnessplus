import DynamicBreadcrumbs from "@/common/components/Breadcrumbs";
import { PrescriptionPage } from "@/common/components/prescribed-patient/prescription/prescription-page";

function PrescriptionDetailsPage() {
  const menuItems = [
    {
      title: "Prescriptions",
      href: "/admin-client/prescriptions",
    },
    {
      title: "View Prescriptions",
    },
  ];

  return (
    <PrescriptionPage
      breadcrumbs={
        <DynamicBreadcrumbs
          items={menuItems}
          separatorMargin="1"
        />
      }
      onPatientUiIdChange={() => {}}
    />
  );
}

export default PrescriptionDetailsPage;
