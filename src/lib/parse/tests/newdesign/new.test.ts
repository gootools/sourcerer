import { anchorize } from "./anchorize";
import newParse from "./newParse";
import { rustify } from "./rustify";

const ts = `export class Basic2 {
  @hasOne("authority")
  counter: {
    authority: Pubkey;
    count: u64;
  };
  create(authority: Pubkey) {
    this.counter = {
      count: 0,
      authority,
    };
  }

  increment() {
    this.counter.count += 1;
  }
}`;

test("newParse", () => {
  expect(newParse(ts)).toEqual({
    name: "Basic2",
    accounts: {
      counter: {
        type: {
          authority: { type: "Pubkey", constraints: ["hasOne"] },
          count: { type: "u64" },
        },
      },
    },
    instructions: {
      create: {
        params: {
          authority: { type: "Pubkey" },
        },
      },
      increment: {},
    },
  });
});

test("anchorize", () => {
  expect(anchorize(newParse(ts))).toEqual({
    name: "basic_2",
    instructions: {
      create: {
        params: {
          authority: {
            type: "Pubkey",
          },
        },
        block: [
          "ctx.accounts.counter.count = 0",
          "ctx.accounts.counter.authority = authority",
        ],
      },
      update: {
        params: {},
        block: ["ctx.accounts.counter.count += 1"],
      },
    },
    derived: {
      Create: {
        block: [
          "#[account(init)]",
          "pub counter: ProgramAccount<'info, Counter>",
          "pub rent: Sysvar<'info, Rent>",
        ],
      },
      Increment: {
        block: [
          "#[account(mut, has_one = authority)]",
          "pub counter: ProgramAccount<'info, Counter>",
          "#[account(signer)]",
          "pub authority: AccountInfo<'info>",
        ],
      },
    },
    accounts: {
      Counter: {
        authority: "Pubkey",
        count: "u64",
      },
    },
  });
});

test("rustify", () => {
  expect(
    rustify({
      name: "basic_2",
      instructions: {},
      derived: {},
      accounts: {
        Counter: {
          authority: "Pubkey",
          count: "u64",
        },
      },
    }).replace(/\s/g, "")
  ).toEqual(
    `use anchor_lang::prelude::*;

    #[program]
    mod basic_2 {
        use super::*;
    }

    #[account]
    pub struct Counter {
        pub authority: Pubkey,
        pub count: u64,
    }`.replace(/\s/g, "")
  );
});
