export interface User {
  _id: {
    $oid: string;
  };
  name: string;
  bio: string;
  email: string;
  phoneNumber?: string;
  totalReviewScore?: number;
  numReviews?: number;
  avgScore?: number;
}
