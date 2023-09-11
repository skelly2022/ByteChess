import { useEffect, useState } from "react";
import { AnchorProvider, Idl, Program } from "@coral-xyz/anchor";
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import { ChessProgram } from "../idl/idl";
import idlFile from "../idl/idl.json";

export default function useAnchorProgram(): Program<ChessProgram> {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  const [program, setProgram] = useState<Program<ChessProgram> | null>(null);

  const idl = idlFile as Idl;

  useEffect(() => {
    if (wallet) {
      const provider = new AnchorProvider(connection, wallet, {});
      const programInstance = new Program(idl, idl.metadata.address, provider);
      setProgram(programInstance as unknown as Program<ChessProgram>);
    }
  }, [wallet, connection, idl]);

  return program as Program<ChessProgram>;
}
