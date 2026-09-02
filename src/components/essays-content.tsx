"use client";

import Link from "next/link";
import { ESSAY_QUESTIONS } from "@/lib/essay-data";
import { PenTool, Calendar, FlaskConical } from "lucide-react";

export default function EssaysContent() {
  const pastPapers = ESSAY_QUESTIONS.filter((e) => e.type === "past-paper");
  const specimens = ESSAY_QUESTIONS.filter((e) => e.type === "specimen");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Synoptic Essays</h1>
        <p className="text-muted text-sm mt-1">
          AQA Paper 3 — 25 marks, 45 minutes. Practice the hardest part of the exam.
        </p>
      </div>

      {/* Past Papers */}
      <div className="space-y-4">
        <h2 className="font-semibold text-lg flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" /> Past Paper Titles
        </h2>
        <div className="grid gap-3">
          {pastPapers.map((essay) => (
            <Link
              key={essay.id}
              href={`/essays/${essay.id}`}
              className="dashboard-card hover:border-primary/50 transition-colors group"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-0.5 rounded">
                      {essay.year}
                    </span>
                    <span className="text-xs text-muted">AQA Paper 3</span>
                  </div>
                  <p className="font-medium text-text-primary group-hover:text-primary transition-colors">
                    {essay.title}
                  </p>
                </div>
                <PenTool className="w-5 h-5 text-muted group-hover:text-primary transition-colors shrink-0" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Specimen */}
      <div className="space-y-4">
        <h2 className="font-semibold text-lg flex items-center gap-2">
          <FlaskConical className="w-5 h-5 text-amber" /> Specimen & Practice Titles
        </h2>
        <div className="grid gap-3">
          {specimens.map((essay) => (
            <Link
              key={essay.id}
              href={`/essays/${essay.id}`}
              className="dashboard-card hover:border-primary/50 transition-colors group"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold bg-amber/10 text-amber px-2 py-0.5 rounded">
                      Practice
                    </span>
                  </div>
                  <p className="font-medium text-text-primary group-hover:text-primary transition-colors">
                    {essay.title}
                  </p>
                </div>
                <PenTool className="w-5 h-5 text-muted group-hover:text-primary transition-colors shrink-0" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}