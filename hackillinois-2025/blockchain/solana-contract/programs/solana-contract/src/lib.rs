use anchor_lang::prelude::*;

declare_id!("9GmbEnoSYVse4AADADyKNfy4s3XWC3oKzzWb8HxazHjx");

#[program]
pub mod solana_contract {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
