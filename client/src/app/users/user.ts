export interface User {
  _id: {
    $oid: string;
  };
  name: String;
  bio: String;
  email?: String;
  phoneNumber?: String;
  reviewScores?: number;
  numReviews?: number;
}
