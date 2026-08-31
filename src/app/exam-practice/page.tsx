import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import Navbar from "@/components/navbar";
import ExamPracticeContent from "@/components/exam-practice-content";

export default async function ExamPracticePage({ searchParams }: { searchParams: { paper?: string; topic?: string } }) {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect("/auth");
  }

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <ExamPracticeContent paper={searchParams.paper} topic={searchParams.topic} />
      </main>
    </>
  );
}