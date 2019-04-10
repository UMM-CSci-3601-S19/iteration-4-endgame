import {User} from "../users/user";

export interface Ride {
  _id?: object;
  driver: string;
  ownerId?: string;
  ownerData?: User;
  riders?: string;
  destination: string;
  origin: string;
  roundTrip: boolean;
  departureDate: string;
  departureTime: string;
  driving?: boolean;
  notes: string;
  mpg?: number;
}
