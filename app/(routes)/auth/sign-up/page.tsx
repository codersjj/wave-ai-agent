import Logo from "@/components/logo";
import SignUpForm from "../_common/sign-up-form";

const SignUp = () => {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex justify-center items-center w-full">
          <Logo />
        </div>
        <SignUpForm />
      </div>
    </div>
  );
};

export default SignUp;
