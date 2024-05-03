/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['firebasestorage.googleapis.com'],
    },
};
import { config } from 'dotenv';

config();

export default nextConfig;
