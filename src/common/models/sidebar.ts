export interface ISidebarData {
  organizations: ISidebarOrganization[];
}

export interface ISidebarOrganization {
  id: number;
  name: string;
  to: string;
  logo: string;
  type: string;
  className?: string;
  pages: ISidebarLink[];
}

export interface ISidebarLink {
  label: string;
  to?: string;
  leftSectionIcon?: string;
  rightSectionIcon?: string;
  classes?: string;
}
