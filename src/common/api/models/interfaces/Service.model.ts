export interface IServiceItem {
  id?: number;
  name?: string;
  status?: string;
  description?: string;
  category: string;
}

export interface IAddServiceDTO {
  name: string;
  cateogry: string;
}
