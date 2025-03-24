"use client";

import Header from "./Header";
import Footer from "./Footer";
import Antigravity from "../components/Antigravity";

export default function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="relative flex-1 max-w-4xl w-full mx-auto overflow-hidden">
        <Antigravity /> {/* 🎯 `main` 内に配置 */}
        {children}
      </main>
      <Footer />
    </div>
  );
}
