"use client";

import { useState, useEffect, Suspense } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Dna,
  Mail,
  Lock,
  Loader2,
  GraduationCap,
  Check,
} from "lucide-react";

function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [verifying, setVerifying] = useState(false);

  const [examBoard, setExamBoard] = useState<"aqa" | "cie" | null>(null);
  const [selectingBoard, setSelectingBoard] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  // Handle email confirmation callback
  useEffect(() => {
    const code = searchParams.get("code");

    if (!code) return;

    async function verifyEmail() {
      setVerifying(true);

      const { data, error } =
        await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        setError("Verification failed: " + error.message);
        setVerifying(false);
        return;
      }

      const user = data.user;

      if (!user) {
        setError("Verification failed: no user session found.");
        setVerifying(false);
        return;
      }

      const savedBoard = user.user_metadata?.exam_board as
        | "aqa"
        | "cie"
        | undefined;

      if (savedBoard === "aqa" || savedBoard === "cie") {
        const { error: profileError } = await supabase
          .from("profiles")
          .update({ exam_board: savedBoard })
          .eq("id", user.id);

        if (profileError) {
          setError(
            "Account verified, but exam board could not be saved: " +
              profileError.message
          );
          setVerifying(false);
          return;
        }

        router.push("/");
        return;
      }

      setVerifying(false);
      setSelectingBoard(true);
    }

    verifyEmail();
  }, [searchParams, supabase, router]);

  async function handleBoardSelection(board: "aqa" | "cie") {
    setLoading(true);
    setError("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("No active account session found.");
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({ exam_board: board })
      .eq("id", user.id);

    if (error) {
      setError("Could not save exam board: " + error.message);
      setLoading(false);
      return;
    }

    router.push("/");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError("");

    if (isSignUp) {
      if (!examBoard) {
        setError("Please select your exam board.");
        setLoading(false);
        return;
      }

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            exam_board: examBoard,
          },
        },
      });

      if (error) {
        setError(error.message);
      } else {
        setError("Check your email for confirmation link!");
      }
    } else {
      const { data, error } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      if (!data.user) {
        setError("Sign in failed: no user session found.");
        setLoading(false);
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("exam_board")
        .eq("id", data.user.id)
        .single();

      if (profileError) {
        setError(
          "Signed in, but your profile could not be loaded: " +
            profileError.message
        );
        setLoading(false);
        return;
      }

      if (
        profile.exam_board === "aqa" ||
        profile.exam_board === "cie"
      ) {
        router.push("/");
      } else {
        setSelectingBoard(true);
      }
    }

    setLoading(false);
  }

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10">
            <Dna className="w-8 h-8 text-primary animate-pulse" />
          </div>

          <h1 className="text-2xl font-bold">
            Verifying your email...
          </h1>

          <p className="text-muted">
            Just a moment while we log you in.
          </p>
        </div>
      </div>
    );
  }

  if (selectingBoard) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
              <GraduationCap className="w-8 h-8 text-primary" />
            </div>

            <h1 className="text-3xl font-bold text-text-primary">
              BioBlurt
            </h1>

            <p className="text-muted mt-2">
              Which Biology exam board do you study?
            </p>
          </div>

          <div className="dashboard-card space-y-4">
            <h2 className="text-xl font-semibold">
              Choose your exam board
            </h2>

            <button
              type="button"
              onClick={() => handleBoardSelection("aqa")}
              disabled={loading}
              className={`w-full text-left p-4 rounded-xl border transition-colors ${
                examBoard === "aqa"
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">AQA</div>
                  <div className="text-sm text-muted mt-1">
                    AQA A-level Biology
                  </div>
                </div>

                {examBoard === "aqa" && (
                  <Check className="w-5 h-5 text-primary" />
                )}
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleBoardSelection("cie")}
              disabled={loading}
              className={`w-full text-left p-4 rounded-xl border transition-colors ${
                examBoard === "cie"
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">Cambridge International</div>
                  <div className="text-sm text-muted mt-1">
                    CIE A-level Biology
                  </div>
                </div>

                {examBoard === "cie" && (
                  <Check className="w-5 h-5 text-primary" />
                )}
              </div>
            </button>

            {error && (
              <div className="text-sm text-red">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
            <Dna className="w-8 h-8 text-primary" />
          </div>

          <h1 className="text-3xl font-bold text-text-primary">
            BioBlurt
          </h1>

          <p className="text-muted mt-1">
            Active Recall for AQA & Cambridge Biology
          </p>
        </div>

        <div className="dashboard-card">
          <h2 className="text-xl font-semibold mb-6">
            {isSignUp ? "Create account" : "Welcome back"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-muted mb-1.5">
                Email
              </label>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface border border-border rounded-xl pl-10 pr-4 py-2.5 text-text-primary focus:border-primary focus:outline-none transition-colors"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-muted mb-1.5">
                Password
              </label>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-surface border border-border rounded-xl pl-10 pr-4 py-2.5 text-text-primary focus:border-primary focus:outline-none transition-colors"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
            </div>

            {isSignUp && (
              <div>
                <label className="block text-sm text-muted mb-2">
                  Exam board
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setExamBoard("aqa")}
                    className={`p-3 rounded-xl border text-sm font-medium transition-colors ${
                      examBoard === "aqa"
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    AQA
                  </button>

                  <button
                    type="button"
                    onClick={() => setExamBoard("cie")}
                    className={`p-3 rounded-xl border text-sm font-medium transition-colors ${
                      examBoard === "cie"
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    CIE
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div
                className={`text-sm ${
                  error.includes("Check")
                    ? "text-green"
                    : "text-red"
                }`}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {loading && (
                <Loader2 className="w-4 h-4 animate-spin" />
              )}

              {isSignUp
                ? "Create account"
                : "Sign in"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setExamBoard(null);
                setError("");
              }}
              className="text-sm text-muted hover:text-text-secondary transition-colors"
            >
              {isSignUp
                ? "Already have an account? Sign in"
                : "Need an account? Sign up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10">
              <Dna className="w-8 h-8 text-primary animate-pulse" />
            </div>

            <h1 className="text-2xl font-bold">
              Loading...
            </h1>
          </div>
        </div>
      }
    >
      <AuthForm />
    </Suspense>
  );
}