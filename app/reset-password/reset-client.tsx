"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function ResetPasswordClient() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    if (!password || !confirmPassword) {
      return setMessage("All fields are required");
    }

    if (password !== confirmPassword) {
      return setMessage("Passwords do not match");
    }

    if (!token) {
      return setMessage("Invalid or missing token");
    }

    try {
      setLoading(true);
      setMessage("");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            password,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setMessage("✅ Password reset successful!");
      setPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-md">
        <h1 className="text-2xl text-black font-bold mb-4 text-center">
          Reset Password
        </h1>

        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 p-3 rounded-lg mb-3 text-black placeholder:text-gray-500 outline-0"
        />

        <input
          type="password"
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full border border-gray-300 p-3 rounded-lg mb-3 text-black placeholder:text-gray-500 outline-0"
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-black text-white p-3 rounded-lg"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>

        {message && (
          <p className="mt-4 text-center text-sm">{message}</p>
        )}
      </div>
    </div>
  );
}