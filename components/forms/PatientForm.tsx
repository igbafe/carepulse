"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form } from "@/components/ui/form";
import { UserFormValidation } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { createUser } from "@/lib/actions/patients.actions";
import CustomFormField from "../CustomFormField";
import LoadingOverlay from "../loadingOverlay";
import SubmitButton from "../SubmitButton";

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

const PatientForm = () => {
  const router = useRouter();
  const [isLoading, setisLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
    },
  });

  async function onSubmit({
    name,
    email,
    phone,
    password,
  }: z.infer<typeof UserFormValidation>) {
    setError(null);
    setisLoading(true);

    try {
      const user = await createUser({ name, email, phone, password });

      if (user) {
        router.push(`/patients/${user.$id}/register`);
      }
    } catch (error) {
      console.log(error);
      setisLoading(false);
      setError(
        error instanceof Error
          ? error.message
          : "We couldn't create your account. Please try again."
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
            <h1 className="header">Hi there</h1>
            <p className="text-dark-700">
              Create your account to book care in minutes.
            </p>
          </section>

          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="name"
            label="Full name"
            placeholder="John Doe"
            iconSrc="/assets/icons/user.svg"
            iconAlt="user"
          />

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
            fieldType={FormFieldType.PHONE_INPUT}
            control={form.control}
            name="phone"
            label="Phone Number"
            placeholder="(234) 8106272828"
          />

          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.PASSWORD}
            name="password"
            label="Password"
            placeholder="Enter your password"
          />

          {error && <p className="text-sm text-red-500">{error}</p>}

          <SubmitButton isLoading={isLoading}>Create Account</SubmitButton>
        </form>
      </Form>
    </>
  );
};

export default PatientForm;
