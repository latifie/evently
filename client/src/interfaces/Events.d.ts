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
  category: string;
  price?: number;
  capacity?: number;
  capacityLeft?: number;
}
