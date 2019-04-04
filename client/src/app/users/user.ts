export interface User {
  _id: {
    $oid: string;
  };
  name: String;
  email?: String;
  phoneNumber?: String;
  reviewScores?: number;
  numReviews?: number;
}
