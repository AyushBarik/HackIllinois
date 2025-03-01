use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};
use crate::state::property::PropertyContract;
use crate::state::tenancy::{Tenancy, TenancyStatus};
use crate::errors::RentalError;

pub fn handler(
    ctx: Context<TenantCheckIn>,
) -> Result<()> {
    let property_contract = &ctx.accounts.property_contract;
    let tenancy = &mut ctx.accounts.tenancy;
    let tenant = &ctx.accounts.tenant;
    let escrow = &ctx.accounts.escrow;
    let clock = Clock::get()?;
    
    // Verify contract is enabled
    require!(property_contract.contract_enabled, RentalError::ContractDisabled);
    
    // Calculate total amount needed (first month + security deposit)
    let total_amount = property_contract.rent_amount + property_contract.security_deposit;
    
    // Transfer rent + security deposit to the escrow account
    let cpi_accounts = Transfer {
        from: tenant.to_account_info(),
        to: escrow.to_account_info(),
        authority: tenant.to_account_info(),
    };
    
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
    
    token::transfer(cpi_ctx, total_amount)?;
    
    // Set up tenancy
    tenancy.property_contract = property_contract.key();
    tenancy.tenant = tenant.key();
    tenancy.check_in_timestamp = clock.unix_timestamp;
    tenancy.planned_checkout = clock.unix_timestamp + property_contract.lease_duration;
    tenancy.status = TenancyStatus::Active;
    tenancy.escrow_account = escrow.key();
    tenancy.bump = ctx.bumps.tenancy;
    
    // Disable the contract for other tenants
    let property_contract_info = &mut ctx.accounts.property_contract.to_account_info();
    let mut property_contract_data = property_contract_info.data.borrow_mut();
    let mut property_contract = PropertyContract::try_from_slice(&property_contract_data)?;
    property_contract.contract_enabled = false;
    property_contract.serialize(&mut *property_contract_data)?;
    
    Ok(())
}

#[derive(Accounts)]
pub struct TenantCheckIn<'info> {
    #[account(mut)]
    pub tenant: Signer<'info>,
    
    #[account(
        mut,
        constraint = property_contract.contract_enabled == true,
    )]
    pub property_contract: Account<'info, PropertyContract>,
    
    #[account(
        init,
        payer = tenant,
        space = 8 + std::mem::size_of::<Tenancy>(),
        seeds = [b"tenancy", property_contract.key().as_ref(), tenant.key().as_ref()],
        bump
    )]
    pub tenancy: Account<'info, Tenancy>,
    
    #[account(
        mut,
        seeds = [b"escrow", tenancy.key().as_ref()],
        bump
    )]
    pub escrow: UncheckedAccount<'info>,
    
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}