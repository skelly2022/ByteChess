import { useCallback, useEffect, useState } from "react";
// import { program, ChessProgramPDA } from "~/anchor/setup";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { AccountInfo, PublicKey, SystemProgram } from "@solana/web3.js";
import { program, connection } from "../../anchor/setup";
import { BN } from "@coral-xyz/anchor";
import { u32, u8, struct, offset } from "@solana/buffer-layout";
import { u64 } from "@solana/buffer-layout-utils";
import * as borsh from "@project-serum/borsh";
import { api } from "~/utils/api";

const BlockChain = () => {
  const { publicKey, sendTransaction, signMessage } = useWallet();
  const [accounts, setAccounts] = useState<any>();
  const [loading, setLoading] = useState(true);
  const getAllAccounts = api.example.getAllUsers.useMutation({
    onSuccess(data) {
      onSuccessGetData(data);
    },
  });
  async function onSuccessGetData(data) {
    let accounts = [];

    // Use map to create an array of promises
    const fetchPromises = data.map(async (d) => {
      const newKey = new PublicKey(`${d.walletAddress}`);
      const [globalLevel1GameDataAccount, bump] =
        PublicKey.findProgramAddressSync(
          [Buffer.from("level1", "utf8"), newKey.toBuffer()],
          program.programId,
        );
      try {
        const account = await program.account.newAccount.fetch(
          globalLevel1GameDataAccount,
        );
        const user = {
          address: d.walletAddress,
          rating: account.data.toString(),
        };
        accounts.push(user);
      } catch (error) {
        console.log(`Error fetching GameDataAccount state: ${error}`);
      }
    });

    // Wait for all promises to resolve
    await Promise.all(fetchPromises);

    // Now you can safely log the accounts array
    setAccounts(accounts);
    setLoading(false);
  }

  useEffect(() => {
    if (publicKey !== null) {
      getAllAccounts.mutateAsync();
    }
  }, [publicKey]);

  return (
    <div className="m-4 h-full w-full">
      {/* <div className="mx-auto w-auto  p-4">
        <h1 className="mb-4 text-2xl font-semibold">Leaderboard</h1>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">Rank</th>
              <th className="px-4 py-2">Wallet Address</th>
              <th className="px-4 py-2">Puzzle Rating</th>
            </tr>
          </thead>
          {!loading && (
            <tbody className="text-white">
              {accounts.map((item, index) => (
                <tr key={item.walletAddress}>
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{item.address}</td>
                  <td className="px-4 py-2">{item.rating}</td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div> */}
    </div>
  );
};

export default BlockChain;
