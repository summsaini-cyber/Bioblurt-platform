import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import Navbar from "@/components/navbar";
import BlurtContent from "@/components/blurt-content";

export default async function BlurtPage({ params }: { params: { slug?: string[] } }) {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect("/auth");
  }

  const topic = params.slug?.[0] ? decodeURIComponent(params.slug[0]) : null;
  const subtopic = params.slug?.[1] ? decodeURIComponent(params.slug[1]) : null;

  if (!topic || !subtopic) {
    redirect("/topics");
  }

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <BlurtContent userId={session.user.id} topic={topic} subtopic={subtopic} />
      </main>
    </>
  );
}
