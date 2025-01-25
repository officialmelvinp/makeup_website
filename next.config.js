import dotenv from "dotenv"
import { fileURLToPath } from "url"
import { dirname, join } from "path"
import fs from "fs"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const envPath = join(__dirname, ".env")

if (fs.existsSync(envPath)) {
  console.log(".env file found")
  const envConfig = dotenv.parse(fs.readFileSync(envPath))
  for (const k in envConfig) {
    process.env[k] = envConfig[k]
  }
} else {
  console.log(".env file not found")
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": __dirname,
    }
    return config
  },
  env: {
    NEXT_PUBLIC_ADMIN_USERNAME: process.env.NEXT_PUBLIC_ADMIN_USERNAME,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DB_NAME: process.env.DB_NAME,
    NEXT_PUBLIC_ALLOWED_HOSTS: process.env.NEXT_PUBLIC_ALLOWED_HOSTS,
    EMAIL_HOST_USER: process.env.EMAIL_HOST_USER,
    SMTP_FROM: process.env.SMTP_FROM,
    EMAIL_USE_SSL: process.env.EMAIL_USE_SSL,
    NEXT_PUBLIC_BUSINESS_WHATSAPP: process.env.NEXT_PUBLIC_BUSINESS_WHATSAPP,
    EMAIL_HOST: process.env.EMAIL_HOST,
    EMAIL_HOST_PASSWORD: process.env.EMAIL_HOST_PASSWORD,
    EMAIL_PORT: process.env.EMAIL_PORT,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:;",
          },
        ],
      },
    ]
  },
}

export default nextConfig

