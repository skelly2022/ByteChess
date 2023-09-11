"use client";
import { useEffect, useRef, useState } from "react";
import ClientOnly from "src/components/ClientOnly";
import Navbar from "src/components/navbar/Navbar";
import PuzzlesMain from "src/components/puzzles/PuzzlesMain";
import ToasterProvider from "src/providers/ToasterProvider";

type Page = {
  Page: string;
};

const Home: React.FC<Page> = ({ Page }) => {
  return (
    <>
      <ClientOnly>
        <ToasterProvider />
        <Navbar />
      </ClientOnly>
      <main className="fixed min-h-screen bg-gray-900  pt-28 ">
        <PuzzlesMain />
      </main>
    </>
  );
};

export default Home;
