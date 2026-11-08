import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "你的西方价值观测试 | Human RLHF Alignment Benchmark",
  description: "Are you biased? 逆向人类强化学习对齐基准：让人类经受 Nous Research 训练与测试 Qwen3.8-27B 的真实后训练数据集考验！",
  keywords: ["RLHF", "DPO", "Qwen", "Nous Research", "Western Values", "AI Alignment"],
  openGraph: {
    title: "你的西方价值观测试 | Are You Biased?",
    description: "逆向人类强化学习对齐基准：看看你的大脑会被微调成纯正北京后训练大模型还是美利坚自由派教师！",
    type: "website"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}>
      <body className="min-h-full flex flex-col bg-neutral-950 text-neutral-100">{children}</body>
    </html>
  );
}
