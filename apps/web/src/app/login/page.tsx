import { Metadata } from "next";
import AccountLoginForm from "@/components/account/account-login-form";

export const metadata: Metadata = {
  title: "Login | Ziphus",
};

export default function Page(): JSX.Element {
  return (
    <main className="min-w-screen flex h-full min-h-screen w-full items-center justify-center bg-black">
      <AccountLoginForm />
    </main>
  );
}
