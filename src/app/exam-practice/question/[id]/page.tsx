import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import Navbar from "@/components/navbar";
import ExamQuestionContent from "@/components/exam-question-content";
import { EXAM_QUESTIONS } from "@/lib/exam-questions";

export default async function ExamQuestionPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect("/auth");
  }

  const question = EXAM_QUESTIONS.find((q) => q.id === params.id);

  if (!question) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <ExamQuestionContent question={question} userId={session.user.id} />
      </main>
    </>
  );
}