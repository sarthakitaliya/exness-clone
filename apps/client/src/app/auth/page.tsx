"use client";

import api from "@/lib/api";
import { checkAuth, setAuthToken } from "@/lib/token";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AuthPage() {
  const [authMode, setAuthMode] = useState<"Signup" | "Signin">("Signup");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const router = useRouter();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };
  const canSubmit =
    authMode === "Signup"
      ? formData.username && formData.email && formData.password
      : formData.email && formData.password;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || loading) return;
    setLoading(true);
    let res;
    try {
      if (authMode === "Signup") {
        console.log(formData);

        res = await api.post("/user/signup", formData);
        console.log(res);
        setAuthToken(res.data.token);
        toast.success("Signed up successfully!");
      } else {
        console.log(formData);
        res = await api.post("/user/signin", formData);
        console.log(res.data.token);
        setAuthToken(res.data.token);
        toast.success("Signed in successfully!");
      }
      if (authMode === "Signup")
        setFormData({ username: "", email: "", password: "" });
      else setFormData((f) => ({ ...f, password: "" }));
    router.push("/")
    } catch (err: Error | any) {
      console.log(err);

      toast.error(
        err.response?.data?.message || "Something went wrong. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

 useEffect(() => {
    const user = checkAuth();
    if (!user) {
      router.push("/");
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 p-4 text-slate-100">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight  text-transparent bg-clip-text">
            {authMode === "Signup" ? "Create account" : "Welcome back"}
          </h1>
          <p className="text-sm text-slate-400">
            {authMode === "Signup"
              ? "Start trading in minutes."
              : "Sign in to continue your session."}
          </p>
        </div>

        <div className="flex p-1 rounded-xl bg-slate-800/70 backdrop-blur border border-slate-700 mb-6">
          {["Signup", "Signin"].map((mode) => {
            const active = authMode === mode;
            return (
              <button
                key={mode}
                onClick={() => setAuthMode(mode as typeof authMode)}
                className={`flex-1 relative py-2 text-sm font-medium transition-colors rounded-lg cursor-pointer ${
                  active
                    ? "bg-gray-300 text-slate-900 shadow-inner"
                    : "text-slate-400 hover:text-slate-200"
                }`}
                type="button"
              >
                {mode}
              </button>
            );
          })}
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-gray-900 backdrop-blur-xl border border-slate-700/60 shadow-2xl rounded-2xl px-8 py-8 space-y-6"
        >
          <fieldset className="space-y-5" disabled={loading}>
            {authMode === "Signup" && (
              <div className="space-y-1.5">
                <label
                  htmlFor="username"
                  className="block text-xs font-medium uppercase tracking-wide text-slate-300"
                >
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  placeholder="trader123"
                  value={formData.username}
                  onChange={onChange}
                  className="w-full rounded-lg bg-slate-800/60 border border-slate-700 focus:border-gray-500 focus:ring-2 focus:ring-gray-500/40 outline-none px-4 py-3 text-sm placeholder:text-slate-500 transition"
                />
              </div>
            )}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-xs font-medium uppercase tracking-wide text-slate-300"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={onChange}
                className="w-full rounded-lg bg-slate-800/60 border border-slate-700 focus:border-gray-500 focus:ring-2 focus:ring-gray-500/40 outline-none px-4 py-3 text-sm placeholder:text-slate-500 transition"
              />
            </div>
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block text-xs font-medium uppercase tracking-wide text-slate-300"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={
                  authMode === "Signup" ? "new-password" : "current-password"
                }
                placeholder="••••••••"
                value={formData.password}
                onChange={onChange}
                className="w-full rounded-lg bg-slate-800/60 border border-slate-700 focus:border-gray-500 focus:ring-2 focus:ring-gray-500/40 outline-none px-4 py-3 text-sm placeholder:text-slate-500 transition"
              />
            </div>
          </fieldset>

          <button
            type="submit"
            disabled={!canSubmit || loading}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-800 text-white font-medium py-3 text-sm  disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-900 border-t-transparent" />{" "}
                Processing...
              </span>
            ) : authMode === "Signup" ? (
              "Create account"
            ) : (
              "Sign in"
            )}
          </button>

          <div className="text-center text-xs text-slate-500">
            {authMode === "Signup" ? (
              <span>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setAuthMode("Signin")}
                  className="text-gray-300 hover:text-gray-100 font-medium cursor-pointer"
                >
                  Sign in
                </button>
              </span>
            ) : (
              <span>
                Need an account?{" "}
                <button
                  type="button"
                  onClick={() => setAuthMode("Signup")}
                  className="text-gray-300 hover:text-gray-100 font-medium cursor-pointer"
                >
                  Create one
                </button>
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
