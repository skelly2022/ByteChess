//@ts-nocheck

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { AccountInfo, PublicKey, SystemProgram } from "@solana/web3.js";
import { program, connection } from "../../anchor/setup";

import { BN } from "@coral-xyz/anchor";
import { api } from "~/utils/api";
import { useEffect, useState } from "react";
import useUserStore from "~/hooks/useUserStore";
import Loading from "../Loading";
import test from "../../../public/images/test.png";

const LeaderboardContainer = () => {
  const { publicKey, sendTransaction, signMessage } = useWallet();
  const user = useUserStore();
  const [accounts, setAccounts] = useState<any>("");
  const [sortedAccounts, setSortedAccounts] = useState<any>("");

  const [loading, setLoading] = useState(true);

  const updateUser = api.example.updateUser.useMutation({
    onSuccess(data, variables, context) {},
  });
  const getAllAccounts = api.example.getAllUsers.useMutation({
    onSuccess(data) {
      onSuccessGetData(data);
    },
  });
  function shortenString(str) {
    if (str.length <= 10) {
      // If the string is 10 characters or shorter, return it as is.
      return str;
    } else {
      // If the string is longer than 10 characters, extract the first 5, add '...', and append the last 5 characters.
      const firstFive = str.slice(0, 5);
      const lastFive = str.slice(-5);
      return `${firstFive}...${lastFive}`;
    }
  }
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
      } catch (error) {}
    });

    // Wait for all promises to resolve
    await Promise.all(fetchPromises);

    // Now you can safely log the accounts array
    const sortedAccounts = accounts.sort(
      (a, b) => parseInt(b.rating) - parseInt(a.rating),
    );
    setSortedAccounts(sortedAccounts);
    setLoading(false);
  }

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
      updateUser.mutateAsync({ address: publicKey.toBase58() });
    } else {
    }
  }

  useEffect(() => {
    getAllAccounts.mutateAsync();
  }, [publicKey]);

  return (
    <div className="m-4 flex h-full w-full flex-col">
      {/* {loading ? (
        <Loading />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-4 ">
          <div className="">
            {!user.user.ratedAccount && (
              <button
                className="rounded-md bg-white px-2 py-3"
                onClick={() => {
                  handleClickInitialize();
                }}
              >
                Initialize Wallet
              </button>
            )}
          </div>
          <div className=" w-auto ">
            <div className=" w-auto overflow-x-auto ">
              <table className="w-full border-collapse border border-gray-300 text-center md:w-auto ">
                <thead>
                  <tr className="bg-white text-black">
                    <th className="px-4 py-2">Rank</th>
                    <th className="px-4 py-2">Wallet Address</th>
                    <th className="px-4 py-2">Puzzle Rating</th>
                  </tr>
                </thead>
                <tbody className="text-white">
                  {sortedAccounts.map((item, index) => (
                    <tr key={item.address}>
                      <td className="px-4 py-2">{index + 1}</td>
                      <td className="hidden px-4 py-2 md:flex">
                        {item.address}
                      </td>
                      <td className="flex px-4 py-2 md:hidden">
                        {shortenString(item.address)}
                      </td>
                      <td className="px-4 py-2">{item.rating}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default LeaderboardContainer;
