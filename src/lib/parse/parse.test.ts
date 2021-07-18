import basicParse from "./basicParse";
import rustify from "./rustify";

const typescript = `
type u64 = number;
type pubKey = string;

class Basic2 {
  counter: {
    authority: pubKey;
    count: u64;
  };

  @init("counter")
  create(authority: pubKey) {
    this.counter.authority = authority;
    this.counter.count = 0;
  }

  @signer("authority")
  increment() {
    this.counter.count += 1;
  }
}`;

const anchor = `use anchor_lang::prelude::*;

#[program]
mod basic_2 {
    use super::*;

    pub fn create(ctx: Context<Create>, authority: Pubkey) -> ProgramResult {
        let counter = &mut ctx.accounts.counter;
        counter.authority = authority;
        counter.count = 0;
        Ok(())
    }

    pub fn increment(ctx: Context<Increment>) -> ProgramResult {
        let counter = &mut ctx.accounts.counter;
        counter.count += 1;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Create<'info> {
    #[account(init)]
    pub counter: ProgramAccount<'info, Counter>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct Increment<'info> {
    #[account(mut)]
    pub counter: ProgramAccount<'info, Counter>,
    #[account(signer)]
    pub authority: AccountInfo<'info>,
}

#[account]
pub struct Counter {
    pub authority: Pubkey,
    pub count: u64,
}`.replace(/^\s+/gm, "");

test("rustifies", () => {
  console.log(basicParse(typescript));
  expect(rustify(basicParse(typescript))).toEqual(anchor);
});

test.only("basic parse", () => {
  expect(basicParse(typescript)).toEqual({
    name: "Basic2",
    accounts: {
      counter: {
        authority: "pubKey",
        count: "u64",
      },
    },
    instructions: {
      create: {
        params: {
          authority: "pubKey",
        },
        decorators: ['@init("counter")'],
      },
      increment: {
        params: {},
        decorators: ['@signer("authority")'],
      },
    },
  });
});
