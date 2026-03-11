import type { VendorSignupDTO } from "../types/vendor";
import { supabase } from "../lib/supabaseClient";

export const vendorSignup = async (data: VendorSignupDTO) => {

  const email = `${data.phoneNumber}@vendor.reviewit`;

  // Create auth account
  const { error: authError } = await supabase.auth.signUp({
    email,
    password: data.password,
  });

  if (authError) {
    throw new Error(authError.message);
  }

  // Insert vendor into vendors table
  const { error: vendorError } = await supabase
    .from("vendors")
    .insert([
      {
        business_name: data.businessName,
        category: data.category,
        phone_number: data.phoneNumber,
      },
    ]);

  if (vendorError) {
    throw new Error(vendorError.message);
  }

  return { success: true };
};