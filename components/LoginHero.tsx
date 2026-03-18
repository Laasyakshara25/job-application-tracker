"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Briefcase } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginHero() {
  const router = useRouter();
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (isRegistering) {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Something went wrong during registration.");
        setLoading(false);
        return;
      }
    }

    const signInResult = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (signInResult?.error) {
      setError("Invalid email or password");
      setLoading(false);
    } else {
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 transform transition-all hover:scale-[1.01] duration-300">
        <div className="p-8 pb-6">
          <div className="mx-auto bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
            <Briefcase className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-2 text-center">
            {isRegistering ? "Create an Account" : "Welcome Back"}
          </h1>
          <p className="text-gray-500 mb-6 text-sm leading-relaxed text-center">
            {isRegistering 
              ? "Start tracking your job applications completely privately."
              : "Log in to view your applications and continue your job search."}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-medium border border-red-100">
                {error}
              </div>
            )}
            
            {isRegistering && (
              <input
                type="text"
                placeholder="Full Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            )}
            <input
              type="email"
              placeholder="Email Address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black hover:bg-gray-900 text-white px-6 py-3.5 rounded-xl font-semibold transition-colors disabled:opacity-50"
            >
              {loading ? "Processing..." : (isRegistering ? "Sign Up" : "Sign In")}
            </button>
          </form>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-400 font-medium">Or</span>
            </div>
          </div>

          <button
            onClick={() => signIn("google")}
            className="w-full bg-white hover:bg-gray-50 border border-gray-200 text-gray-800 px-6 py-3.5 rounded-xl font-semibold flex items-center justify-center gap-3 transition-colors group shadow-sm"
          >
            <svg className="w-5 h-5 group-hover:scale-105 transition-transform" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>
        </div>
        
        <div className="bg-gray-50 p-6 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-500 font-medium">
            {isRegistering ? "Already have an account?" : "Don't have an account?"}{" "}
            <button 
              onClick={() => { setIsRegistering(!isRegistering); setError(""); }} 
              className="text-blue-600 hover:underline font-bold"
            >
              {isRegistering ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
