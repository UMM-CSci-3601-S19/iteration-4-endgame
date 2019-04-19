export interface User {
  _id: {
    $oid: string;
  };
  name: String;
  bio: String;
  email: String;
  phoneNumber?: String;
  totalReviewScore?: number;
  numReviews?: number;
  avgScore?: number;
}
