import { SignUp } from "@clerk/nextjs";

const SignUpPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <SignUp fallbackRedirectUrl="/wizard" />
    </div>
  );
};

export default SignUpPage;
