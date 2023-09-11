"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

const Logo = () => {
  const router = useRouter();

  return (
    <div className="relative flex h-20 flex-col items-center">
      <Image
        onClick={() => router.push("/")}
        alt="Logo"
        className="cursor-pointer md:block"
        height={100}
        width={100}
        src="/images/chessLogoTrans.png"
      />
      {/* <h1 className="pt-2 font-mono text-white">CHESSDAO</h1> */}
    </div>
  );
};

export default Logo;
