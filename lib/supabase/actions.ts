"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return { error: error.message };
  }

  // redirect throws internally, so call it last
  revalidatePath("/", "layout");
  redirect("/dashboard/artworks");
}

export async function inviteUser(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;

  if (!email || !email.includes("@")) {
    return { error: "Please provide a valid email address." };
  }

  // Check the current user is authenticated first
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in to invite users." };
  }

  // Verify the service role key is available
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    return { error: "Server config error: missing service role key." };
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) {
    return { error: "Server config error: missing Supabase URL." };
  }

  // Use the GoTrue Admin API directly via fetch (bypasses JS client issues)
  try {
    const response = await fetch(
      `${supabaseUrl}/auth/v1/invite`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": serviceKey,
          "Authorization": `Bearer ${serviceKey}`,
        },
        body: JSON.stringify({
          email,
          data: {
            full_name: email.split("@")[0] || "User",
          },
        }),
      },
    );

    if (!response.ok) {
      let errorBody = "";
      try {
        const json = await response.json();
        errorBody = json?.msg || json?.error_description || json?.message || JSON.stringify(json);
      } catch {
        errorBody = `HTTP ${response.status}: ${response.statusText}`;
      }
      return { error: errorBody };
    }

    revalidatePath("/", "layout");
    return { success: true };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Invitation request failed",
    };
  }
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}

export async function resetPassword(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/confirm?next=/dashboard/account`,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
