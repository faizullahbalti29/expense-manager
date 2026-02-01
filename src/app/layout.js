import { Inter } from "next/font/google";
import ThemeRegistry from "../components/ThemeRegistry/ThemeRegistry";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

export const metadata = {
  title: "Premium Expense Manager",
  description: "Track your expenses in style",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}
