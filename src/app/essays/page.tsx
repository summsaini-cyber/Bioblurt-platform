import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import Navbar from "@/components/navbar";
import EssaysContent from "@/components/essays-content";

export default async function EssaysPage() {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect("/auth");
  }

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <EssaysContent />
      </main>
    </>
  );
}