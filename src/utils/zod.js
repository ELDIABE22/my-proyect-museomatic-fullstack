import { z } from 'zod';

export const registerSchema = z.object({
    name: z.string().min(1, { message: { name: 'Es requerido' } }).max(50, { message: { name: "El nombre no puede tener más de 50 caracteres" } }).regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/, { message: { name: 'El nombre no es válido' } }),
    email: z.string().min(1, { message: { email: 'Es requerido' } }).email({ message: { email: 'El correo no es válido' } }),
    phone: z.string().min(1, { message: { phone: 'Es requerido' } })
        .refine((value) => value === '' || /^\d{10}$/.test(value), {
            message: { phone: 'Debe tener exactamente 10 dígitos' }
        })
        .refine((value) => value === '' || /^[0-9]+$/.test(value), {
            message: { phone: 'No debe contener letras' }
        }),
    password: z.string().min(1, { message: { password: 'Es requerido' } }).min(6, { message: { password: 'La contraseña debe tener al menos 6 caracteres' } }).max(15, { message: { password: 'La contraseña no puede tener más de 15 caracteres' } }),
});

export const loginSchema = z.object({
    email: z.string().min(1, { message: { email: 'Es requerido' } }).email({ message: { email: 'El correo no es válido' } }),
    password: z.string().min(1, { message: { password: 'Es requerido' } }).min(6, { message: { password: 'La contraseña debe tener al menos 6 caracteres' } }).max(15, { message: { password: 'La contraseña no puede tener más de 15 caracteres' } }),
});

export const museumSchema = z.object({
    name: z.string().min(1, { message: { name: 'Es requerido' } }).max(50, { message: { name: "El nombre no puede tener más de 50 caracteres" } }).regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/, { message: { name: 'El nombre no es válido' } }),
    description: z.string().min(1, { message: { description: 'Es requerido' } }),
    address: z.string().min(1, { message: { address: 'Es requerido' } }).max(70, { message: { address: "La dirección no puede tener más de 50 caracteres" } }),
    foundingDate: z.string().min(1, { message: { foundingDate: 'Es requerido' } }),
    openingTime: z.string().min(1, { message: { openingTime: 'Es requerido' } }),
    closingTime: z.string().min(1, { message: { closingTime: 'Es requerido' } }),
    state: z.string().min(1, { message: { state: 'Es requerido' } }).optional(),
    city: z.string().min(1, { message: { city: 'Es requerido' } }),
    entryPrice: z.string().min(1, { message: { entryPrice: 'Es requerido' } }),
});

export const collectionSchema = z.object({
    idMuseum: z.string().min(1, { message: { idMuseum: 'Es requerido' } }),
    name: z.string().min(1, { message: { name: 'Es requerido' } }).max(50, { message: { name: "El nombre no puede tener más de 50 caracteres" } }).regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/, { message: { name: 'El nombre no es válido' } }),
    description: z.string().min(1, { message: { description: 'Es requerido' } }),
    typeCollection: z.string().min(1, { message: { typeCollection: 'Es requerido' } }),
});

export const eventSchema = z.object({
    idMuseum: z.string().min(1, { message: { idMuseum: 'Es requerido' } }),
    name: z.string().min(1, { message: { name: 'Es requerido' } }).max(50, { message: { name: "El nombre no puede tener más de 50 caracteres" } }).regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/, { message: { name: 'El nombre no es válido' } }),
    description: z.string().min(1, { message: { description: 'Es requerido' } }),
    eventDate: z.string().min(1, { message: { eventDate: 'Es requerido' } }),
    eventTimeInit: z.string().min(1, { message: { eventTimeInit: 'Es requerido' } }),
    eventTimeFinally: z.string().min(1, { message: { eventTimeFinally: 'Es requerido' } }),
    price: z.string().min(1, { message: { price: 'Es requerido' } }),
    typeEvent: z.string().min(1, { message: { typeEvent: 'Es requerido' } }),
    capacity: z.string().min(1, { message: { capacity: 'Es requerido' } }),
    state: z.string().min(1, { message: { state: 'Es requerido' } }).optional(),
});

export const updateUserSchema = z.object({
    name: z.string().min(1, { message: { name: 'Es requerido' } }).max(50, { message: { name: "El nombre no puede tener más de 50 caracteres" } }).regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/, { message: { name: 'El nombre no es válido' } }),
    phone: z.string().min(1, { message: { phone: 'Es requerido' } })
        .refine((value) => value === '' || /^\d{10}$/.test(value), {
            message: { phone: 'Debe tener exactamente 10 dígitos' }
        })
        .refine((value) => value === '' || /^[0-9]+$/.test(value), {
            message: { phone: 'No debe contener letras' }
        }),
});

export const ticketSchema = z.object({
    ticketAmount: z.string().min(1, { message: { ticketAmount: 'Es requerido' } })
        .refine((value) => value === '' || /^[0-9]+$/.test(value), {
            message: { ticketAmount: 'No debe contener letras' }
        }).refine((value) => value >= 1, {
            message: { ticketAmount: 'Mínimo 1 tickets' }
        }).refine((value) => value <= 10, {
            message: { ticketAmount: 'Máximo 10 tickets' }
        }).optional(),
    name: z.string().min(1, { message: { name: 'Es requerido' } }).max(50, { message: { name: "El nombre no puede tener más de 50 caracteres" } }).regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/, { message: { name: 'El nombre no es válido' } }).optional(),
    cardNumber: z.string().min(1, { message: { cardNumber: 'Es requerido' } }).refine((value) => value.length === 19, {
        message: { cardNumber: 'Debe tener exactamente 19 caracteres' }
    }).optional(),
    dateExpiry: z.string().min(1).refine((value) => /^\d{2}\/\d{2}$/.test(value), {
        message: { dateExpiry: 'MM/AA' }
    }).optional(),
    cvv: z.string().min(1, { message: { cvv: 'Es requerido' } }).optional(),
});

export const correoForgotPasswordSchema = z.object({
    email: z.string().min(1, { message: { email: 'Es requerido' } }).email({ message: { email: 'El correo no es válido' } }),
});

export const resetPasswordSchema = z.object({
    newPassword: z.string().min(1, { message: { newPassword: 'Es requerido' } }).min(6, { message: { newPassword: 'La contraseña debe tener al menos 6 caracteres' } }).max(15, { message: { newPassword: 'La contraseña no puede tener más de 15 caracteres' } }),
    confirmNewPassword: z.string().min(1, { message: { confirmNewPassword: 'Es requerido' } }).min(6, { message: { confirmNewPassword: 'La contraseña debe tener al menos 6 caracteres' } }).max(15, { message: { confirmNewPassword: 'La contraseña no puede tener más de 15 caracteres' } }),
})
