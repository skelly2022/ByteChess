// import { useEffect } from "react";
// import { program, counterPDA, CounterData } from "~/anchor/setup";

// const BlockChain = () => {
//   useEffect(() => {
//     // Fetch initial account data
//     program.account.counter.fetch(counterPDA).then((data) => {
//       setCounterData(data);
//     });

//     // Subscribe to the state PDA account change
//     const subscriptionId = connection.onAccountChange(
//       counterPDA,
//       (accountInfo) => {
//         setCounterData(
//           program.coder.accounts.decode("counter", accountInfo.data),
//         );
//       },
//     );

//     return () => {
//       // Unsubscribe from the account change subscription
//       connection.removeAccountChangeListener(subscriptionId);
//     };
//   }, [program]);
//   return <div>Hey</div>;
// };

// export default BlockChain;
