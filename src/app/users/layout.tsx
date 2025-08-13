// app/(user)/layout.tsx
import { CartProvider } from "@/lib/contexts/cartContext";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ReduxProvider } from "@/lib/store/provider";

export const metadata = {
  title: "Ridges Automotors - Premium Vehicles",
  description: "Find your perfect vehicle at Ridges Automotors",
};

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReduxProvider>
      <CartProvider>
        <Header />
        <main>{children}</main>
        <Footer />
      </CartProvider>
    </ReduxProvider>
  );
}
