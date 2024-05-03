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
    eventTime: z.string().min(1, { message: { eventTime: 'Es requerido' } }),
    price: z.string().min(1, { message: { price: 'Es requerido' } }),
    typeEvent: z.string().min(1, { message: { typeEvent: 'Es requerido' } }),
    capacity: z.string().min(1, { message: { capacity: 'Es requerido' } }),
    state: z.string().min(1, { message: { state: 'Es requerido' } }).optional(),
});
