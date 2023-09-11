import { useEffect } from "react";
import { program, ChessProgramPDA } from "~/anchor/setup";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import useAnchorProgram from "~/hooks/useAnchorProgram";

const BlockChain = () => {
  const wallet = useWallet();
  const program = useAnchorProgram();
  console.log(program);
  return <div>Hey</div>;
};

export default BlockChain;
