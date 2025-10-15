"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RiLoader2Line } from "@remixicon/react";
import { useAuthToken } from "@/hooks/use-auth-token";

const SignInFormSchema = z.object({
  email: z.email("Invalid email address").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignInFormValues = z.infer<typeof SignInFormSchema>;

const SignInForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { setBearerToken } = useAuthToken();

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(SignInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: SignInFormValues) => {
    console.log("submit values", values);
    const { email, password } = values;
    await authClient.signIn.email(
      {
        email,
        password,
        callbackURL: "/home", // A URL to redirect to after the user verifies their email (optional)
      },
      {
        onRequest: () => {
          setIsLoading(true);
        },
        onSuccess: (ctx) => {
          const authToken = ctx.response.headers.get("set-auth-token"); // get the token from the response headers
          console.log("🚀 ~ onSubmit ~ authToken:", authToken);
          if (authToken) {
            setBearerToken(authToken);
          }

          router.replace("/home");
          // setIsLoading(false);
          toast.success("Sign in successful");
        },
        onError: (ctx) => {
          setIsLoading(false);
          toast.error("Sign in failed", {
            description: ctx.error.message,
          });
        },
      }
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <Card className="bg-transparent border-0">
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-bold">Welcome back</CardTitle>
          <CardDescription className="text-base font-medium">
            Login with your Wave account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="m@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full cursor-pointer"
              >
                {isLoading && <RiLoader2Line className="animate-spin" />}
                Sign In
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link
                  href="/auth/sign-up"
                  className="text-primary underline underline-offset-4"
                >
                  Sign Up
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignInForm;
