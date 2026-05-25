import { Inter } from "next/font/google";
import ThemeRegistry from "../components/ThemeRegistry/ThemeRegistry";
import ReduxProvider from "../components/ReduxProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

export const metadata = {
  title: "My Expense Manager",
  description: "Track your expenses in style",
  icons: {
    icon: "/favicon.png",
  },
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          <ReduxProvider>{children}</ReduxProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
