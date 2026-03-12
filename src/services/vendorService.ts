import type { VendorSignupDTO } from "../types/vendor";
import { supabase } from "../lib/supabaseClient";

export const vendorSignup = async (data: VendorSignupDTO) => {

  const { error } = await supabase
    .from("vendors")
    .insert([
      {
        business_name: data.businessName,
        category: data.category,
        phone_number: data.phoneNumber,
        password: data.password
      }
    ]);

  if (error) {
    throw new Error(error.message);
  }

  return { success: true };
};