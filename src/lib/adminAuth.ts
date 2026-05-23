import { createHmac, timingSafeEqual } from "crypto";

export const ADMIN_EMAIL = "kkausik11@gmail.com";
const ADMIN_PASSWORD = "123456";
const ADMIN_COOKIE = "vt_admin_session";

function signature() {
  return createHmac("sha256", ADMIN_PASSWORD).update(ADMIN_EMAIL).digest("hex");
}

export function isAdminCredential(email: string, password: string) {
  return email.trim().toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD;
}

export function createAdminSessionValue() {
  return `${Buffer.from(ADMIN_EMAIL).toString("base64url")}.${signature()}`;
}

export function getAdminCookieName() {
  return ADMIN_COOKIE;
}

export function isValidAdminSession(value?: string) {
  if (!value) return false;

  const [encodedEmail, receivedSignature] = value.split(".");
  if (!encodedEmail || !receivedSignature) return false;

  const email = Buffer.from(encodedEmail, "base64url").toString("utf8");
  if (email !== ADMIN_EMAIL) return false;

  const expected = signature();
  const expectedBuffer = Buffer.from(expected);
  const receivedBuffer = Buffer.from(receivedSignature);

  return expectedBuffer.length === receivedBuffer.length && timingSafeEqual(expectedBuffer, receivedBuffer);
}

export function isAdminRequest(request: Request) {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const cookie = cookieHeader
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${ADMIN_COOKIE}=`));

  if (!cookie) return false;

  return isValidAdminSession(decodeURIComponent(cookie.slice(ADMIN_COOKIE.length + 1)));
}
