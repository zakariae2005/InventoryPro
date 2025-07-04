import { Suspense } from "react";
import LoginPageContent from "./LoginPageContent";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";


export default async function LoginPage() {

  const session = await getServerSession(authOptions);

  
  if (session) {
    redirect("/overview");
  }
  return (
    <Suspense fallback={<div>Loading login form...</div>}>
      <LoginPageContent />
    </Suspense>
  );
}
