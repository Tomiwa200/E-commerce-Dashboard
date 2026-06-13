"use server";

import { createClient } from "@/utils/supabase/server";
import { LoginFormValues, SignupFormValues } from "./schemas/auth";

export async function loginAction(values: LoginFormValues) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: values.email,
    password: values.password,
  });

  if (error) return { success: false, message: error.message };
  return { success: true };
}

export async function signupAction(values: SignupFormValues) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email: values.email,
    password: values.password,
    options: {
      data: {
        full_name: values.fullName,
      },
    },
  });

  if (error) return { success: false, message: error.message };
  return { success: true };
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
}
