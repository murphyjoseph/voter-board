import type { Metadata } from "next";
import { Provider } from "@/theme/provider";

export const metadata: Metadata = {
  title: "Login - Voter Board",
  description: "Access the voter board",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider>
      {children}
    </Provider>
  );
}
