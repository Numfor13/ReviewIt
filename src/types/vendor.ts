export interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Vendor {
  id: string;
  name: string;
  phoneNumber: string;
  category: string;
  averageRating: number;
  reviews: Review[];
}

export interface VendorSignupDTO {
  businessName: string;
  category: string;
  phoneNumber: string;
  password: string;
}