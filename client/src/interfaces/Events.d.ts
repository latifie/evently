import { UserInterface } from "./User";

export interface EventInterface {
  _id: string;
  name: string;
  description?: string;
  location?: string;
  startDate: Date;
  endDate: Date;
  avatar?: string;
  owner: UserInterface;
  createdAt: string;
  updatedAt: string;
  category:"Conférence" | "Webinar" | "Atelier" | "Formation" | "Autre";
  price?: number;
  capacity?: number;
  capacityLeft?: number;
}