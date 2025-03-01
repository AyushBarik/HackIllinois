use anchor_lang::prelude::*;
use crate::state::property::*;

pub fn handler(
    ctx: Context<CreatePropertyContract>,
    rent_amount: u64,
    security_deposit: u64,
    lease_duration: i64,
) -> Result<()> {
    let property_contract = &mut ctx.accounts.property_contract;
    let owner = &ctx.accounts.owner;
    let clock = Clock::get()?;
    
    property_contract.owner = owner.key();
    property_contract.rent_amount = rent_amount;
    property_contract.security_deposit = security_deposit;
    property_contract.lease_duration = lease_duration;
    property_contract.creation_timestamp = clock.unix_timestamp;
    property_contract.contract_enabled = true;
    property_contract.bump = ctx.bumps.property_contract;
    
    Ok(())
}

#[derive(Accounts)]
pub struct CreatePropertyContract<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,
    
    #[account(
        init,
        payer = owner,
        space = 8 + std::mem::size_of::<PropertyContract>(),
        seeds = [b"property", owner.key().as_ref()],
        bump
    )]
    pub property_contract: Account<'info, PropertyContract>,
    
    pub system_program: Program<'info, System>,
}