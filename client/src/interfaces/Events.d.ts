export interface EventInterface {
  _id: string;
  name: string;
  description?: string;
  location?: string;
  start_date: Date;
  end_date: Date;
  avatar?: string;
  owner: {
    _id: string;
    name: string;
    forename?: string;
    email?: string;
  };
  createdAt: string;
  updatedAt: string;
  category: string;
  price?: number;
  capacity?: number;
  capacityLeft?: number;
}
