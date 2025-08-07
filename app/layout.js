import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "flatpickr/dist/themes/material_blue.css";
import Sidebar from "../components/SideBar";
import Header from "../components/Header";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Fratelli IA Configuration",
  description: "Página de configuración del bot de Fratelli IA",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="flex">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="p-6 bg-gray-50 min-h-screen">{children}</main>
        </div>
      </body>
    </html>
  );
}
