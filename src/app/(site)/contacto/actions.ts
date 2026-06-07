"use server";

import { z } from "zod";

const ContactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(80, "El nombre no puede superar 80 caracteres"),
  email: z
    .string()
    .trim()
    .email("Introduce un email válido"),
  phone: z
    .string()
    .trim()
    .max(30)
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(20, "Cuéntanos un poco más (al menos 20 caracteres)")
    .max(2000, "El mensaje no puede superar 2000 caracteres"),
});

export type ContactFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: {
    name?: string[];
    email?: string[];
    phone?: string[];
    message?: string[];
  };
};

export async function submitContactForm(
  _prev: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const parsed = ContactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Revisa los campos marcados.",
      errors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  await new Promise((r) => setTimeout(r, 600));

  console.info("[contacto] mensaje recibido", {
    from: parsed.data.email,
    name: parsed.data.name,
    length: parsed.data.message.length,
  });

  return {
    status: "success",
    message: `¡Gracias, ${parsed.data.name}! Te responderemos en 24-48 h al correo ${parsed.data.email}.`,
  };
}
