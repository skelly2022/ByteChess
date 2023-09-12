export type ChessProgram = {
  version: "0.1.0";
  name: "chess_adventure";
  instructions: [
    {
      name: "initialize";
      accounts: [
        { name: "newAccount"; isMut: true; isSigner: false },
        { name: "signer"; isMut: true; isSigner: true },
        { name: "systemProgram"; isMut: false; isSigner: false },
      ];
      args: [{ name: "data"; type: "u64" }];
    },
    {
      name: "updateRating";
      accounts: [{ name: "newAccount"; isMut: true; isSigner: false }];
      args: [{ name: "data"; type: "u64" }];
    },
  ];
  accounts: [
    {
      name: "newAccount";
      type: {
        kind: "struct";
        fields: [{ name: "data"; type: "u64" }];
      };
    },
  ];
};

export const IDL: ChessProgram = {
  version: "0.1.0",
  name: "chess_adventure",
  instructions: [
    {
      name: "initialize",
      accounts: [
        {
          name: "newAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "signer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [{ name: "data", type: "u64" }],
    },
    {
      name: "updateRating",
      accounts: [
        {
          name: "newAccount",
          isMut: true,
          isSigner: false,
        },
      ],
      args: [{ name: "data", type: "u64" }],
    },
  ],
  accounts: [
    {
      name: "newAccount",
      type: {
        kind: "struct",
        fields: [
          {
            name: "data",
            type: "u64",
          },
        ],
      },
    },
  ],
};
