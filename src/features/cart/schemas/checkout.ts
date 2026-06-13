import { z } from "zod";

export const checkoutSchema = z.object({
  fullName: z.string().min(3, "Full legal name must contain at least 3 characters."),
  email: z.email("Please provide a valid email format."),
  address: z.string().min(8, "A complete physical delivery street address is required."),
  city: z.string().min(2, "City designation cannot be blank."),
  postalCode: z.string().min(4, "Postal code must contain at least 4 alphanumeric markers."),
  cardNumber: z.string().regex(/^\d{16}$/, "Payment registration requires exactly 16 numeric digits."),
  cardExpiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Expiry mapping must conform to MM/YY guidelines."),
  cardCvc: z.string().regex(/^\d{3}$/, "Security code requires exactly 3 tracking digits."),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
