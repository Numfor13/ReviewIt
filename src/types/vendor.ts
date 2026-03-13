import type { Review } from "./review";
export interface Vendor {
  id: string;
  name: string;
  phoneNumber: string;
  category: string;
  description?: string;
  averageRating: number;
  profileImage?: string;
  reviews: Review[];
}

export interface VendorSignupDTO {
  businessName: string;
  category: string;
  phoneNumber: string;
  password: string;
}