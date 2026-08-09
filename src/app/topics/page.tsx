import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import Navbar from "@/components/navbar";
import TopicsContent from "@/components/topics-content";

export default async function TopicsPage({ searchParams }: { searchParams: { topic?: string } }) {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect("/auth");
  }

  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <TopicsContent userId={session.user.id} selectedTopic={searchParams.topic} />
      </main>
    </>
  );
}
