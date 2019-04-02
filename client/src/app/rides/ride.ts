import {User} from "../users/user";

export interface Ride {
  _id?: object;
  driver: string;
  owner?: User;
  riders?: string;
  destination: string;
  origin: string;
  roundTrip: boolean;
  departureTime: string;
  driving?: boolean;
  notes: string;
}
