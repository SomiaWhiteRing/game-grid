import type React from "react";
import type { Metadata } from "next";
import { Noto_Sans_SC } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import "./globals.css";

const notoSansSC = Noto_Sans_SC({ subsets: ["latin"], weight: ["400", "500", "700", "900"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://gamegrid.shatranj.space"),
  title: {
    default: "构成我的9款游戏",
    template: "%s | 构成我的9款游戏",
  },
  description: "用 Bangumi 搜索挑选 9 款最能代表你的游戏，生成并分享你的「构成我的9款游戏」页面。",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    title: "构成我的9款游戏",
    description: "用 Bangumi 搜索挑选 9 款最能代表你的游戏，生成并分享你的「构成我的9款游戏」页面。",
    url: "/",
    siteName: "构成我的9款游戏",
  },
  twitter: {
    card: "summary_large_image",
    title: "构成我的9款游戏",
    description: "用 Bangumi 搜索挑选 9 款最能代表你的游戏，生成并分享你的「构成我的9款游戏」页面。",
  },
  verification: {
    google: "swtOMxSQC6Dfn-w4YtMQ3OFH4SZz00Blcd6FI0qMgJc",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <GoogleAnalytics />
      </head>
      <body className={notoSansSC.className}>
        <Analytics />
        {children}
      </body>
    </html>
  );
}
