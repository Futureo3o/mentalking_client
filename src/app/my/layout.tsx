import MypageNav from "@/components/layout/my/MypageNav";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="myPage">
        <MypageNav />
        <div className="myPageContent">{children}</div>
      </div>
    </>
  );
}
