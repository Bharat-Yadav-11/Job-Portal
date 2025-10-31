import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center m-10">
      <SignIn />
    </div>
  );
}
