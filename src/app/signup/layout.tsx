import { SignupBackground } from "@/components/signup/SignupBackground";

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SignupBackground />
      {children}
    </>
  );
}
