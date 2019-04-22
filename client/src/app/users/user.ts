export interface User {
  _id: {
    $oid: string;
  };
  userId?: string;
  name: string;
  bio: string;
  email: string;
  phoneNumber?: string;
  totalReviewScore?: number;
  numReviews?: number;
  avgScore?: number;
}
