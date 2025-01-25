import { jwtVerify, SignJWT } from "jose"

export async function verifyToken(token) {
  try {
    const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET)
    const { payload } = await jwtVerify(token, secret)
    return payload
  } catch (error) {
    console.error("Error verifying token:", error)
    return null
  }
}

export async function signToken(payload) {
  const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET)
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(secret)
  return token
}

