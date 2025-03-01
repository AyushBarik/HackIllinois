use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};
use crate::state::property::PropertyContract;
use crate::state::tenancy::{Tenancy, TenancyStatus};
use crate::errors::RentalError;

pub fn handler(
    ctx: Context<TenantCheckOut>,
) -> Result<()> {
    let tenancy = &mut ctx.accounts.tenancy;
    let property_contract = &mut ctx.accounts.property_contract;
    let escrow = &ctx.accounts.escrow;
    let tenant = &ctx.accounts.tenant;
    let _clock = Clock::get()?;
    
    // Verify tenancy is active
    require!(tenancy.status == TenancyStatus::Active, RentalError::TenancyNotActive);
    
    // Update tenancy status
    tenancy.status = TenancyStatus::CheckedOut;
    
    // Release funds from escrow to tenant
    let bump = tenancy.bump;
    let property_key = property_contract.key();
    let tenant_key = tenant.key();
    let seeds = &[
        b"tenancy",
        property_key.as_ref(),
        tenant_key.as_ref(),
        &[bump],
    ];
    let signer = &[&seeds[..]];
    
    let cpi_accounts = Transfer {
        from: escrow.to_account_info(),
        to: tenant.to_account_info(),
        authority: tenancy.to_account_info(),
    };
    
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_ctx = CpiContext::new_with_signer(
        cpi_program,
        cpi_accounts,
        signer,
    );
    
    token::transfer(cpi_ctx, escrow.amount)?;
    
    // Re-enable the property contract
    property_contract.contract_enabled = true;
    
    Ok(())
}

#[derive(Accounts)]
pub struct TenantCheckOut<'info> {
    #[account(mut)]
    pub tenant: Signer<'info>,
    
    #[account(
        mut,
        constraint = tenancy.tenant == tenant.key(),
        constraint = tenancy.status == TenancyStatus::Active,
        seeds = [b"tenancy", property_contract.key().as_ref(), tenant.key().as_ref()],
        bump = tenancy.bump,
    )]
    pub tenancy: Account<'info, Tenancy>,
    
    #[account(
        mut,
        constraint = property_contract.key() == tenancy.property_contract,
    )]
    pub property_contract: Account<'info, PropertyContract>,
    
    #[account(
        mut,
        seeds = [b"escrow", tenancy.key().as_ref()],
        bump
    )]
    pub escrow: Account<'info, TokenAccount>,
    
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}