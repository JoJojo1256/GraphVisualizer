import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });

    // Exchange the code for a session
    const {
      data: { user },
      error: sessionError,
    } = await supabase.auth.exchangeCodeForSession(code);

    if (sessionError) {
      console.error("Session error:", sessionError);
      return NextResponse.redirect(`${requestUrl.origin}/login?error=session`);
    }

    if (user) {
      try {
        // Check if user already exists in users table
        const { data: existingUser, error: userError } = await supabase
          .from("users")
          .select("id")
          .eq("id", user.id)
          .single();

        if (userError && userError.code !== "PGRST116") {
          // PGRST116 is "not found" error
          throw userError;
        }

        // If user doesn't exist, create them and set up their proof templates
        if (!existingUser) {
          // Insert new user
          const { error: insertError } = await supabase
            .from("users")
            .insert([{ id: user.id, email: user.email }]);

          if (insertError) throw insertError;

          // Fetch all proof templates
          const { data: templates, error: templateError } = await supabase
            .from("proof_templates")
            .select("id");

          if (templateError) throw templateError;

          // Create progress entries for each template
          if (templates && templates.length > 0) {
            const progressEntries = templates.map((template) => ({
              user_id: user.id,
              proof_id: template.id,
              completed: false,
            }));

            const { error: progressError } = await supabase
              .from("user_proof_progress")
              .insert(progressEntries);

            if (progressError) throw progressError;
          }
        }
      } catch (error) {
        console.error("Error setting up user:", error);
        return NextResponse.redirect(`${requestUrl.origin}/login?error=setup`);
      }
    }
  }

  // Redirect to the home page after successful setup
  return NextResponse.redirect(requestUrl.origin);
}
