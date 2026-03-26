"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form } from "@/components/ui/form";
import { getPatient } from "@/lib/actions/patients.actions";
import { LoginFormValidation } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/actions/login.actions";
import CustomFormField from "../CustomFormField";
import LoadingOverlay from "../loadingOverlay";
import { FormFieldType } from "./PatientForm";
import SubmitButton from "../SubmitButton";

const LoginForm = () => {
  const router = useRouter();
  const [isLoading, setisLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof LoginFormValidation>>({
    resolver: zodResolver(LoginFormValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit({
    email,
    password,
  }: z.infer<typeof LoginFormValidation>) {
    setError(null);
    setisLoading(true);

    try {
      const user = await loginUser({ email, password });

      if (user) {
        const patient = await getPatient(user.$id);
        const destination = patient
          ? `/patients/${user.$id}/new-appointment`
          : `/patients/${user.$id}/register`;

        router.push(destination);
      }
    } catch (error) {
      console.log(error);
      setisLoading(false);
      setError(
        error instanceof Error
          ? error.message
          : "Unable to log in right now. Please try again."
      );
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
            <h1 className="header">Welcome back</h1>
            <p className="text-dark-700">
              Log in to continue your appointment flow.
            </p>
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

          {error && <p className="text-sm text-red-500">{error}</p>}

          <SubmitButton isLoading={isLoading}>Log In</SubmitButton>
        </form>
      </Form>
    </>
  );
};

export default LoginForm;
