import { z } from 'zod'

export const createUserSchema = z.object({
    first_name: z
        .string({ required_erro: 'First name is required.' })
        .trim()
        .min(3, {
            message: 'First name is required.',
        }),
    last_name: z
        .string({ required_erro: 'Last name is required.' })
        .trim()
        .min(3, {
            message: 'Last name is required.',
        }),
    email: z
        .string({ required_erro: 'Email is required.' })
        .email({
            message: 'Please provide a valid e-mail.',
        })
        .trim()
        .min(3, {
            message: 'E-mail is required.',
        }),
    password: z
        .string({ required_error: 'Password is required.' })
        .trim()
        .min(6, {
            message: 'Password must have at least 6 characters.',
        }),
})
