"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

const Logo = () => {
  const router = useRouter();

  return (
    <div className="relative flex h-20 flex-col items-center pb-2">
      <Image
        onClick={() => router.push("/")}
        alt="Logo"
        className="cursor-pointer md:block"
        height={80}
        width={80}
        src="/images/bytechessLogo.png"
      />
      {/* <h1 className="pt-2 font-mono text-white">CHESSDAO</h1> */}
    </div>
  );
};

export default Logo;
