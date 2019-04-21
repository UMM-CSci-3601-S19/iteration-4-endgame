import {User} from "../users/user";

export interface Ride {
  _id?: {
    $oid: string;
  };
  driver?: string;
  ownerId?: string;
  ownerData?: User;
  destination: string;
  origin: string;
  roundTrip: boolean;
  departureDate: string;
  departureTime?: string;
  driving?: boolean;
  notes: string;
  mpg?: number;
  numSeats: number;
  riderList: string[];
}
