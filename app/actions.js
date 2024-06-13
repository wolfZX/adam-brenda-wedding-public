'use server'
 
import { redirect } from 'next/navigation'
import { z } from 'zod';

export async function validateForm(formData, isInvitedToTeaCeremony) {
  const mobileNumberError = { message: "Invalid mobile number length"};
  const numbersOnlyError = { message: "Invalid input. Make sure to enter NUMBERS only" };
  let validationObjects = {
    guest_side: z.enum(["groom", "bride"], { message: "Invalid value for guest type"}),
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    mobile_number:z
      .string()
      .min(1, "Mobile number is required")
      .min(7, mobileNumberError)
      .max(15, mobileNumberError)
      .refine((value) => /^[0-9]*$/.test(value), numbersOnlyError),
    attending_reception: z.string(),
    number_of_accompany_guest_reception: z
      .string()
      .refine((value) => /^[0-9]*$/.test(value), numbersOnlyError),
  };

  if (isInvitedToTeaCeremony) {
    validationObjects = {
      ...validationObjects,
      attending_tea_ceremony: z.string(),
      number_of_accompany_guest_tea_ceremony: z
        .string()
        .refine((value) => /^[0-9]*$/.test(value), numbersOnlyError),
    }
  }

  const formSchema = z.object({ ...validationObjects });

  const validateFields = formSchema.safeParse(formData);

  if (!validateFields.success) {
    return { errors: validateFields.error.flatten().fieldErrors };
  }
  return { errors: {} };
}

export async function submitRSVP(formData, url, isInvitedToTeaCeremony) {
  let apiURL = 'rsvp';

  if (isInvitedToTeaCeremony) {
    apiURL = `rsvp-tc`
  }

  // NOTE: CALLING RSVP API
  // try {
  //   await fetch(`${process.env.URL_DOMAIN}/api/${apiURL}`, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(formData),
  //   });
  // } catch (error) {
  //   return { errors: { api: `Failed to submit RSVP form, ${error}` } };
  // }
  redirect(url); // Navigate to the thank you page after POST
}
