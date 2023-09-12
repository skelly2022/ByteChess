import { useCallback, useEffect, useState } from "react";
// import { program, ChessProgramPDA } from "~/anchor/setup";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { program, connection } from "../../anchor/setup";
import { BN } from "@coral-xyz/anchor";

const BlockChain = () => {
  const { publicKey, sendTransaction, signMessage } = useWallet();

  useEffect(() => {
    if (publicKey !== null) {
      fetchData(publicKey);
      console.log(typeof publicKey);
    }
  }, [publicKey]);

  const fetchData = async (pda: PublicKey) => {
    console.log("Fetching GameDataAccount state...");
    const ChessProgramPDA = () =>
      PublicKey.findProgramAddressSync(
        [Buffer.from("level1", "utf8"), pda.toBuffer()],
        program.programId,
      )[0];
    try {
      const account = await program.account.newAccount.fetch(ChessProgramPDA());
      console.log(account.data.toString());
      //   setGameDataAccount(account)
    } catch (error) {
      console.log(`Error fetching GameDataAccount state: ${error}`);
    }
  };

  async function handleClickInitialize() {
    if (publicKey) {
      const data = new BN(1200);
      const [globalLevel1GameDataAccount, bump] =
        PublicKey.findProgramAddressSync(
          [Buffer.from("level1", "utf8"), publicKey.toBuffer()],
          program.programId,
        );
      const transaction = await program.methods
        .initialize(data)
        .accounts({
          newAccount: globalLevel1GameDataAccount,
          signer: publicKey,
          systemProgram: SystemProgram.programId,
        })
        .transaction();
      const txSig = await sendTransaction(transaction, connection);

      const { blockhash, lastValidBlockHeight } =
        await connection.getLatestBlockhash();

      const x = await connection.confirmTransaction({
        blockhash,
        lastValidBlockHeight,
        signature: txSig,
      });
      console.log(x);
    } else {
    }
  }

  return (
    <div>
      <button onClick={handleClickInitialize} disabled={!publicKey}>
        Sign Transaction
      </button>
    </div>
  );
};

export default BlockChain;
