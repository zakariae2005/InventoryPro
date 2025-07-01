/* eslint-disable @typescript-eslint/no-unused-vars */
// app/register/page.tsx
"use client"

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
    if (serverError) setServerError("");
  };

  const validateForm = () => {
    const newErrors = {
      name: "",
      email: "",
      password: "",
    };

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!validatePassword(formData.password)) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.name && formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setIsLoading(true);
    setServerError("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data.message || "Failed to register");
        setIsLoading(false);
        return;
      }

      // After successful registration, automatically sign in the user
      const signInRes = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (signInRes?.ok) {
        router.push("/login");
        router.refresh();
      } else {
        setServerError("Registration successful, but failed to sign in. Please try logging in.");
      }
    } catch (error) {
      setServerError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn("google", { 
        callbackUrl: "/login",
        redirect: true 
      });
    } catch (error) {
      setServerError("Failed to sign in with Google");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4 w-full">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">Create Account</CardTitle>
          <CardDescription className="text-slate-600">
            Enter your details to create your account
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {serverError && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {serverError}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-slate-700">
                Name <span className="text-slate-400">(optional)</span>
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={`pl-10 transition-all duration-200 ${
                    errors.name
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : "focus:border-blue-500 focus:ring-blue-500/20"
                  }`}
                />
              </div>
              {errors.name && <p className="text-sm text-red-600 animate-in slide-in-from-left-1">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                Email <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={`pl-10 transition-all duration-200 ${
                    errors.email
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : "focus:border-blue-500 focus:ring-blue-500/20"
                  }`}
                  required
                />
              </div>
              {errors.email && <p className="text-sm text-red-600 animate-in slide-in-from-left-1">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                Password <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className={`pl-10 pr-10 transition-all duration-200 ${
                    errors.password
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : "focus:border-blue-500 focus:ring-blue-500/20"
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-sm text-red-600 animate-in slide-in-from-left-1">{errors.password}</p>}
              {!errors.password && (
                <p className="text-xs text-slate-500">Password must be at least 6 characters long</p>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creating Account...</span>
                </div>
              ) : (
                "Create Account"
              )}
            </Button>

            <div className="relative w-full">
              <Separator className="my-4" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-white px-2 text-xs text-slate-500">OR</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              Sign up with Google
            </Button>

            <div className="text-center space-y-2">
              <p className="text-sm text-slate-600">Already have an account?</p>
              <Link href="/login">
                <Button variant="link" className="text-blue-600 hover:underline p-0">
                  Sign In
                </Button>
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}