import type { VendorSignupDTO } from "../types/vendor";

export const vendorSignup = async (data: VendorSignupDTO) => {
  // Later this becomes:
  // return axiosInstance.post("/vendors/signup", data);

  console.log("Vendor signup API call:", data);

  return Promise.resolve({ success: true });
};