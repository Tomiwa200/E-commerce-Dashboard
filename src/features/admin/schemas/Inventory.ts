import { z } from "zod";


const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const createProductSchema = z.object({
    name : z.string().min(3, "name must contain at least 3 characters."),
    imageFile: z
    .custom<FileList>()
    .refine((files) => files && files.length > 0, "An image file is required.")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, "Max image size is 5MB.")
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      "Only .jpg, .jpeg, .png, .webp, and .gif formats are supported."
    ),
     price: z
    .number("Price must be a number")
    .positive("Price must be greater than zero")
    .max(999999.99, "Price cannot exceed $999,999.99")
    .refine(
      (val) => {
        // Ensures max 2 decimal places
        const decimals = val.toString().split(".")[1];
        return !decimals || decimals.length <= 2;
      },
      { message: "Price cannot have more than 2 decimal places" }
    ),
    stock_quantity: z
    .number("Stock must be a number")
    .int("Stock must be a whole number")
    .nonnegative("Stock cannot be negative")
    .max(100000, "Stock cannot exceed 100,000 units"),
    category: z.string().min(3, "name must contain at least 3 characters."),
    description : z.string().min(3, "name must contain at least 3 characters."),
})

export type createProductFormValues = z.infer<typeof createProductSchema>;