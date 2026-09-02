"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { EXAM_TOPICS, EXAM_QUESTIONS } from "@/lib/exam-questions";
import { BookOpen, ArrowRight, Clock, FileText, ChevronLeft } from "lucide-react";

export default function ExamPracticeContent({ paper, topic }: { paper?: string; topic?: string }) {
  const router = useRouter();

  // STEP 1: No paper selected — show Paper 1 / Paper 2
  if (!paper) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Exam Practice</h1>
          <p className="text-muted text-sm mt-1">Real AQA past paper questions, AI-marked</p>
        </div>

        <div className="grid gap-4">
          <button
            onClick={() => router.push("/exam-practice?paper=paper1")}
            className="dashboard-card text-left hover:border-primary/50 transition-colors group"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-lg">Paper 1</h3>
                </div>
                <p className="text-sm text-muted">Biological Molecules • Cells • Exchange • Genetics</p>
                <p className="text-xs text-muted mt-1">
                  {EXAM_QUESTIONS.filter((q) => q.paper === "paper1").length} questions available
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-muted group-hover:text-primary transition-colors" />
            </div>
          </button>

          <button
            onClick={() => router.push("/exam-practice?paper=paper2")}
            className="dashboard-card text-left hover:border-primary/50 transition-colors group"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-lg">Paper 2</h3>
                </div>
                <p className="text-sm text-muted">Energy • Responses • Evolution • Gene Expression</p>
                <p className="text-xs text-muted mt-1">
                  {EXAM_QUESTIONS.filter(
                    (q) => q.board === "aqa" && q.paper === "paper2"
                  ).length} questions available 
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-muted group-hover:text-primary transition-colors" />
            </div>
          </button>
        </div>
      </div>
    );
  }

  // STEP 2: Paper selected, no topic — show topics
const validPaper = paper as "paper1" | "paper2";
const topics = EXAM_TOPICS.aqa?.[validPaper] || [];

  if (!topic) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/exam-practice")} className="text-muted hover:text-text-secondary">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">{validPaper === "paper1" ? "Paper 1" : "Paper 2"}</h1>
            <p className="text-muted text-sm">Select a topic</p>
          </div>
        </div>

        <div className="grid gap-3">
          {topics.map((t) => {
            const count = EXAM_QUESTIONS.filter((q) => q.paper === validPaper && q.topic === t).length;
            return (
              <button
                key={t}
                onClick={() => router.push(`/exam-practice?paper=${validPaper}&topic=${encodeURIComponent(t)}`)}
                className="topic-card flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-muted" />
                  <span className="font-medium">{t}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted">{count} question{count !== 1 ? "s" : ""}</span>
                  <ArrowRight className="w-4 h-4 text-muted" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // STEP 3: Topic selected — show questions
  const questions = EXAM_QUESTIONS.filter((q) => q.paper === validPaper && q.topic === topic);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push(`/exam-practice?paper=${validPaper}`)}
          className="text-muted hover:text-text-secondary"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold">{topic}</h1>
          <p className="text-muted text-sm">{validPaper === "paper1" ? "Paper 1" : "Paper 2"} • {questions.length} questions</p>
        </div>
      </div>

      <div className="space-y-4">
        {questions.map((q, i) => (
          <div key={q.id} className="dashboard-card">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-1 rounded-lg">
                  Q{i + 1}
                </span>
                <span className="text-xs font-semibold text-amber">[{q.marks} marks]</span>
              </div>
            </div>
            <p className="text-text-secondary text-sm leading-relaxed mb-4">{q.question}</p>
            <Link
              href={`/exam-practice/question/${q.id}`}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <Clock className="w-4 h-4" /> Practice
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}