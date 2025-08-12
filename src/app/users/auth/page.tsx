import AuthPage from "@/components/auth/authPage.";

export const metadata = {
  title: "Authentication",
  description:
    "Secure your account with Ridges Automotors. Sign in to access exclusive features and manage your vehicle inquiries.",
  keywords:
    "authentication, ridges automotors, user login, secure access, vehicle management",
  openGraph: {
    title: "Authentication | Ridges Automotors",
    description:
      "Secure your account with Ridges Automotors. Sign in to access exclusive features and manage your vehicle inquiries.",
    type: "website",
  },
};

export default function Page() {
  return <AuthPage />;
}
