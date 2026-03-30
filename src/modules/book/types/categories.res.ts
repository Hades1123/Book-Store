export interface ICategoryRes {
  id: number;
  name: string;
  children?: { id: number; name: string }[];
}
