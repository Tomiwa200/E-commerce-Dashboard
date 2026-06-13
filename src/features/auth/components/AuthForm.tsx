"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, signupSchema, LoginFormValues, SignupFormValues } from "../schemas/auth";
import { loginAction, signupAction } from "../action";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const searchParams = useSearchParams();
   const redirectTarget = searchParams.get("next") || "/products";

  const currentSchema = isLogin ? loginSchema : signupSchema;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(currentSchema),
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    setErrorMessage(null);

    const result = isLogin 
      ? await loginAction(data as LoginFormValues)
      : await signupAction(data as SignupFormValues);

    setLoading(false);

    if (!result.success) {
      setErrorMessage(result.message || "An authentication runtime exception occurred.");
    } else {
      if (isLogin) {
        router.push(redirectTarget);
        router.refresh();
      } else {
        alert("Registration complete! Check your email inbox for confirmation tokens.");
        setIsLogin(true);
        reset();
      }
    }
  };

  return (
    <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
      <div className="mb-6 text-center">
        <h2 className="text-xl md:text-3xl font-bold text-slate-900">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>
        <p className="text-sm md:text-lg text-slate-500 mt-1">
          {isLogin ? "Log in to secure checkout operations" : "Sign up to track order history arrays"}
        </p>
      </div>

      {errorMessage && (
        <div className="mb-4 rounded-lg bg-rose-50 border border-rose-100 p-3 text-xs text-rose-600 font-medium">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {!isLogin && (
          <div>
            <label className="block text-md md:text-lg font-bold text-slate-700 mb-1">Full Legal Name</label>
            <input
              {...register("fullName")}
              placeholder="Alex Johnson"
              className="w-full rounded-md border border-slate-200 px-1 py-2 md:px-3 md:py-2 text-sm md:text-lg outline-none focus:border-slate-400"
            />
            {errors.fullName && <p className="text-[13px] text-rose-500 mt-1">{errors.fullName.message?.toString()}</p>}
          </div>
        )}

        <div>
          <label className="block text-md md:text-lg font-bold text-slate-700 mb-1">Email Address</label>
          <input
            {...register("email")}
            type="email"
            placeholder="alex@domain.com"
            className="w-full rounded-md border border-slate-200 px-1 py-2 md:px-3 md:py-2 text-sm md:text-lg outline-none focus:border-slate-400"
          />
          {errors.email && <p className="text-[13px] text-rose-500 mt-1">{errors.email.message?.toString()}</p>}
        </div>

        <div>
          <label className="block text-md md:text-xl font-bold text-slate-700 mb-1">Password</label>
          <input
            {...register("password")}
            type="password"
            placeholder="........"
            className="w-full rounded-md border border-slate-200 px-1 py-2 md:px-3 md:py-2 text-sm md:text-lg placeholder:text-3xl outline-none focus:border-slate-400"
          />
          {errors.password && <p className="text-[13px] text-rose-500 mt-1">{errors.password.message?.toString()}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-slate-900 py-2.5 text-center text-sm md:text-xl font-semibold text-white transition-all hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400"
        >
          {loading ? "Authenticating Session..." : isLogin ? "Sign In Securely" : "Register Credentials"}
        </button>
      </form>

      <div className="mt-4 text-center border-t border-slate-100 pt-4">
        <button
          type="button"
          onClick={() => {
            setIsLogin(!isLogin);
            setErrorMessage(null);
            reset();
          }}
          className="text-sm md:text-md text-slate-600 hover:text-slate-900 font-medium underline"
        >
          {isLogin ? "Don't have an account? Sign up here" : "Already registered? Sign in instead"}
        </button>
      </div>
    </div>
  );
}
