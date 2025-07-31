import { ISidebarLink, ISidebarOrganization } from "../models/sidebar";

const isPartner = localStorage.getItem("isPartner");

export const ClientSidebarPages: ISidebarLink[] = [
  {
    to: "/admin-client/dashboard",
    label: "Dashboard",
    leftSectionIcon: "icon-dashboard",
  },
  {
    to: "/admin-client/client",
    label: "Clients",
    leftSectionIcon: "icon-Client",
  },
  {
    to: "/admin-client/partner-account",
    label: "Customer Accounts",
    leftSectionIcon: "icon-Partner",
  },
  {
    to: "/admin-client/prescriptions",
    label: "Prescriptions",
    leftSectionIcon: "icon-prescription",
  },
  {
    to: "/admin-client/reports",
    label: "Reports",
    leftSectionIcon: "icon-order-approve",
  },
  {
    to: "settings",
    label: "Settings",
    leftSectionIcon: "icon-setting-01",
  },
];

export const SuperAdminSidebarData: ISidebarOrganization[] =
  import.meta.env.VITE_ENV_NAME == "prod"
    ? [
        // {
        //   id: 1,
        //   to: "/admin/dashboard",
        //   name: "Docmedilink",
        //   logo: "/images/d-logo.svg",
        //   type: "master",
        //   pages: AdminSidebarPages,
        // },
        {
          id: 1,
          name: "Wellness Plus",
          to: "/admin-client/dashboard",
          logo: "/images/client-sidebar-logo.png",
          type: "client",
          pages: ClientSidebarPages,
        },
        // {
        //   id: 3,
        //   name: "Pharmacy",
        //   to: "/admin-clinic/dashboard",
        //   logo: "/images/pharmacy.svg",
        //   type: "clinic",
        //   pages: ClinicSidebarPages,
        // },
        // {
        //   id: 4,
        //   name: "Intake Review",
        //   to: "/admin-spa/dashboard",
        //   logo: "/images/spa.svg",
        //   type: "spa",
        //   pages: SpaSidebarPages,
        // },
      ]
    : import.meta.env.VITE_ENV_NAME == "stage"
    ? [
        // {
        //   id: 1,
        //   to: "/admin/dashboard",
        //   name: "Docmedilink",
        //   logo: "/images/d-logo.svg",
        //   type: "master",
        //   pages: AdminSidebarPages,
        // },
        {
          id: 1,
          name: "Wellness Plus",
          to: "/admin-client/dashboard",
          logo: "/images/client-sidebar-logo.png",
          type: "client",
          pages: ClientSidebarPages,
        },
        // {
        //   id: 3,
        //   name: "Pharmacy",
        //   to: "/admin-clinic/dashboard",
        //   logo: "/images/pharmacy.svg",
        //   type: "clinic",
        //   pages: ClinicSidebarPages,
        // },
        // {
        //   id: 4,
        //   name: "Intake Review",
        //   to: "/admin-spa/dashboard",
        //   logo: "/images/spa.svg",
        //   type: "spa",
        //   pages: SpaSidebarPages,
        // },
      ]
    : [
        // {
        //   id: 1,
        //   to: "/admin/dashboard",
        //   name: "Docmedilink",
        //   logo: "/images/d-logo.svg",
        //   type: "master",
        //   pages: AdminSidebarPages,
        // },
        {
          id: 1,
          name: "Wellness Plus",
          to: "/admin-client/dashboard",
          logo: "/images/client-sidebar-logo.png",
          type: "client",
          pages: ClientSidebarPages,
        },
        // {
        //   id: 3,
        //   name: "Pharmacy",
        //   to: "/admin-clinic/dashboard",
        //   logo: "/images/pharmacy.svg",
        //   type: "clinic",
        //   pages: ClinicSidebarPages,
        // },
        // {
        //   id: 4,
        //   name: "Intake Review",
        //   to: "/admin-spa/dashboard",
        //   logo: "/images/spa.svg",
        //   type: "spa",
        //   pages: SpaSidebarPages,
        // },
      ];

export const ClientAdminSidebarPages: ISidebarLink[] = [
  {
    to: "/client/dashboard",
    label: "Dashboard",
    leftSectionIcon: "icon-dashboard",
  },
  {
    to: "/client/products",
    label: "Medications",
    leftSectionIcon: "icon-oral",
  },
  {
    to: "/client/partner-accounts",
    label: "Customer Accounts",
    leftSectionIcon: "icon-Partner",
  },
  {
    to: "/client/patients",
    label: "Patients",
    leftSectionIcon: "icon-user-group",
  },
  {
    to: "/client/orders",
    label: "Orders",
    leftSectionIcon: "icon-orders",
  },
];
export const ClientSidebarData: ISidebarOrganization[] = [
  {
    id: 1,
    to: "/client/dashboard",
    name: "Client",
    logo: "/images/client-sidebar-logo.png",
    type: "Master",
    pages: ClientAdminSidebarPages,
  },
];

export const PartnerAdminSidebarPages: ISidebarLink[] = [
  {
    label: "Dashboard",
    to: "/partner/dashboard",
    leftSectionIcon: "icon-dashboard",
  },
  {
    label: "Patients",
    to: "/partner/patients",
    leftSectionIcon: "icon-user-group",
  },
  {
    label: "Medications",
    to: "/partner/products",
    leftSectionIcon: "icon-oral",
  },
  {
    label: "Orders",
    to: "/partner/orders",
    leftSectionIcon: "icon-orders",
  },
  {
    label: "Customer Users",
    to: "/partner/standard-users",
    leftSectionIcon: "icon-user-group",
    classes: isPartner ? "" : "hidden",
  },
  {
    label: "Helpful Documents",
    to: "/partner/documents",
    leftSectionIcon: "icon-pdf",
  },
];

export const PartnerSidebarData: ISidebarOrganization[] = [
  {
    id: 1,
    to: "/partner/dashboard",
    name: "Partner",
    logo: "/images/partner-sidebar-logo.svg",
    type: "Master",
    pages: PartnerAdminSidebarPages,
  },
];

export const PartnerPatientSidebarPages: ISidebarLink[] = [
  {
    label: "Dashboard",
    to: "/partner-patient/dashboard",
    leftSectionIcon: "icon-dashboard",
  },
  {
    label: "Order History",
    to: "/partner-patient/orders",
    leftSectionIcon: "icon-prescription",
  },
];

export const PartnerPatientSidebarData: ISidebarOrganization[] = [
  {
    id: 1,
    to: "/partner-patient/dashboard",
    name: "Partner Patient",
    logo: "/images/partner-sidebar-logo.svg",
    type: "Master",
    pages: PartnerPatientSidebarPages,
  },
];
