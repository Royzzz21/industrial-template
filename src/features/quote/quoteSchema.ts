import { z } from 'zod'

export const quoteSchema = z.object({
  name: z.string().trim().min(2, 'Enter your name'),
  company: z.string().trim().min(1, 'Enter your company'),
  email: z.string().trim().email('Enter a valid email'),
  phone: z.string().trim().min(6, 'Enter a phone number'),
  message: z.string().trim().min(10, 'Tell us a little more about the job'),
  consent: z.literal(true, { message: 'Please agree so we can reply to you' }),
})

export type QuoteFormValues = z.infer<typeof quoteSchema>
