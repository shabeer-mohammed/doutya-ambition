import { Nunito } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { StoreProvider } from "./StoreProvider";
import GlobalProvider from "./QuizProvider";
import { usePathname } from "next/navigation";
const nunito = Nunito({ subsets: ["latin"] });
export const metadata = {
  title: "Wowfy",
  description: "Wowfy Website",
};

export default function RootLayout({ children }) {
  

  return (
    <html lang="en">
      <body className={nunito.className}>
        <StoreProvider>
          <GlobalProvider>{children}</GlobalProvider>
        </StoreProvider>
      </body>
      <Toaster />
    </html>
  );
}
