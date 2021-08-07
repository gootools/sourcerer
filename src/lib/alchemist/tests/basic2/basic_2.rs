use anchor_lang::prelude::*;

#[program]
mod basic_2 {
    use super::*;

    pub fn create(ctx: Context<Create>, authority: Pubkey) -> ProgramResult {
        ctx.accounts.counter.count = 0;
        ctx.accounts.counter.authority = authority;
        Ok(())
    }

    pub fn increment(ctx: Context<Increment>) -> ProgramResult {
        ctx.accounts.counter.count += 1;
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
    #[account(mut, has_one = authority)]
    pub counter: ProgramAccount<'info, Counter>,
    #[account(signer)]
    pub authority: AccountInfo<'info>,
}

#[account]
pub struct Counter {
    pub authority: Pubkey,
    pub count: u64,
}
