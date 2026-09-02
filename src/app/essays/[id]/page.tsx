import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import Navbar from "@/components/navbar";
import EssayWriteContent from "@/components/essay-write-content";
import { getEssayById } from "@/lib/essay-data";

export default async function EssayWritePage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect("/auth");
  }

  const essay = getEssayById(params.id);
  if (!essay) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <EssayWriteContent essay={essay} userId={session.user.id} />
      </main>
    </>
  );
}