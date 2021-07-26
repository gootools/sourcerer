import { hasOne, Pubkey, u64 } from "../extras";

export class Basic_2 {
  @hasOne("authority")
  counter: {
    authority: Pubkey;
    count: u64;
  };

  // @init("counter")
  create(authority: Pubkey) {
    // ExpressionStatement
    //   BinaryExpression
    //     PropertyAccessExpression
    //       ThisKeyword
    //       Identifier
    //     EqualsToken
    this.counter = {
      count: 0,
      authority,
    };
  }

  // @mut("counter")
  increment() {
    this.counter.count += 1;
  }
}

const exp = {
  name: "Basic2",
  accounts: {
    counter: {
      type: {
        authority: { type: "Pubkey", constraints: ["has_one"] },
        count: { type: "u64" },
      },
    },
  },
  // instructions: {
  //   create: {
  //     params: {
  //       authority: "Pubkey"
  //     },
  //     // block: {},
  //     accounts: {
  //       counter: {
  //         type: "programAccount",
  //         traits: ["init"]
  //       },
  //       rent: {
  //         type: "sysvar"
  //       }
  //     }
  //   },
  //   increment: {

  //   }
  // }
};

// export class Basic2 {
//   @hasOne("authority")
//   counter: {
//     authority: Pubkey;
//     count: u64;
//   };

//   create(authority: Pubkey) {

//     this.counter = {
//       count: 0,
//       authority,
//     };
//   }

//   increment() {
//     this.counter.count += 1;
//   }
// }
