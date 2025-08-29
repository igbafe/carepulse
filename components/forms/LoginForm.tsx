"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form } from "@/components/ui/form";
import CustomFormField from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { useState } from "react";
import { LoginFormValidation } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/actions/login.actions";
import LoadingOverlay from "../loadingOverlay";

export enum FormFieldType {
  INPUT = "input",
  TEXTAREA = "textarea",
  PHONE_INPUT = "phoneInput",
  CHECKBOX = "checkbox",
  DATE_PICKER = "datePicker",
  SELECT = "select",
  SKELETON = "skeleton",
  PASSWORD = "password",
}

const LoginForm = () => {
  const router = useRouter();
  const [isLoading, setisLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // 1. Define your form.
  const form = useForm<z.infer<typeof LoginFormValidation>>({
    resolver: zodResolver(LoginFormValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit({
    email,
    password,
  }: z.infer<typeof LoginFormValidation>) {
    setisLoading(true);
    console.log("Trying login with:", email, password);

    try {
      // Pass email and password as separate arguments
      const userData = { email, password };
      const user = await loginUser(userData);

      if (user) router.push(`/patients/${user.$id}/register`);
    } catch (error) {
      setisLoading(false);
      console.log(error);
      setError("Invalid email or password");
    }
  }

  return (
    <>
      {isLoading && <LoadingOverlay />}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 flex-1"
        >
          <section className="mb-8 space-y-4">
            <h1 className="header">Hi there 👋</h1>
            <p className="text-dark-700">Schedule your first appiontment</p>
          </section>
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="email"
            label="Email"
            placeholder="peter@gmail.com"
            iconSrc="/assets/icons/email.svg"
            iconAlt="email"
          />
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.PASSWORD}
            name="password"
            label="Password"
            placeholder="Enter your password"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
        </form>
      </Form>
    </>
  );
};

export default LoginForm;
