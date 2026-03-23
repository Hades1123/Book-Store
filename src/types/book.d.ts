export interface ICategoryRes {
  id: string;
  name: string;
  children?: { id: string; name: string }[];
}
