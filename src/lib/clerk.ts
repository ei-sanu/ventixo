export const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string | undefined;

export const isClerkConfigured = Boolean(
  clerkPublishableKey &&
  clerkPublishableKey.startsWith("pk_") &&
  !clerkPublishableKey.includes("PASTE_CLERK_PUBLISHABLE_KEY"),
);
