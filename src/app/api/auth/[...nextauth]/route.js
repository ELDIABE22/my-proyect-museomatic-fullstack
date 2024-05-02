import bcrypt from "bcrypt";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { connection } from "@/utils/museodb";

export const authOptions = {
    providers: [
        CredentialsProvider({
            id: "admin-login",
            name: 'Admin Credentials',
            credentials: {
                correo: { label: "Username", type: "correo", placeholder: "admin@example.com" },
                contraseña: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                try {
                    const [loginUser] = await connection.query('SELECT * FROM Usuario WHERE email = ?', [credentials?.email]);

                    if (!loginUser[0]) throw new Error("El correo no existe!");

                    const contraseñaCompare = await bcrypt.compare(credentials?.password, loginUser[0].contrasena);

                    if (!contraseñaCompare) throw new Error('Contraseña incorrecta!');

                    if (loginUser[0].usuario_admin !== 1) throw new Error('Esta cuenta no es administrador!');

                    return loginUser[0];
                } catch (error) {
                    console.error('Error en la autorización:', error.message);
                    throw new Error(error.message);
                }
            }
        }),
        CredentialsProvider({
            id: "user-login",
            name: 'User Credentials',
            credentials: {
                correo: { label: "Username", type: "correo", placeholder: "user@example.com" },
                contraseña: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                try {
                    const [loginUser] = await connection.query('SELECT * FROM Usuario WHERE email = ?', [credentials?.email]);

                    if (!loginUser[0]) throw new Error("El correo no existe!");

                    const contraseñaCompare = await bcrypt.compare(credentials?.password, loginUser[0].contrasena);

                    if (!contraseñaCompare) throw new Error('Contraseña incorrecta!');

                    return loginUser[0];
                } catch (error) {
                    console.error('Error en la autorización:', error.message);
                    throw new Error(error.message);
                }
            }
        })
    ],
    callbacks: {
        jwt({ token, user }) {
            try {
                if (user) token.user = user;
                return token;
            } catch (error) {
                console.error('Error en el callback jwt:', error.message);
                throw new Error('Error en el callback jwt');
            }
        },
        session({ session, token }) {
            try {
                session.user = token.user;
                return session;
            } catch (error) {
                console.error('Error en el callback de sesión:', error.message);
                throw new Error('Error en el callback de sesión');
            }
        }
    },
    pages: {
        signIn: '/auth/login',
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
