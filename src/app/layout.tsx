import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const title = "Capela Nossa Senhora Aparecida";
const description =
  "Horários de missas, eventos e avisos da Capela Nossa Senhora Aparecida, em Ponta Grossa - PR.";

// VERCEL_PROJECT_PRODUCTION_URL é injetada automaticamente pela Vercel com o
// domínio de produção do projeto — não precisa fixar aqui, e continua certa
// se um domínio próprio for adicionado depois (decisão em aberto no PLANO.md).
const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  openGraph: {
    title,
    description,
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
