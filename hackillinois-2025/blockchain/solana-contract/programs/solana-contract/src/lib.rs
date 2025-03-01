use anchor_lang::prelude::*;

pub mod state;
pub mod errors;
pub mod utils;

use state::property::PropertyContract;
use state::tenancy::{Tenancy, TenancyStatus};

declare_id!("9GmbEnoSYVse4AADADyKNfy4s3XWC3oKzzWb8HxazHjx");

#[program]
pub mod rental_program {
    use super::*;

    pub fn create_property_contract(
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

    pub fn tenant_check_in(ctx: Context<TenantCheckIn>) -> Result<()> {
        let tenancy = &mut ctx.accounts.tenancy;
        let property_contract = &ctx.accounts.property_contract;
        let tenant = &ctx.accounts.tenant;
        let clock = Clock::get()?;
        
        require!(property_contract.contract_enabled, errors::RentalError::ContractDisabled);
        
        tenancy.tenant = tenant.key();
        tenancy.property_contract = property_contract.key();
        tenancy.check_in_timestamp = clock.unix_timestamp;
        tenancy.status = TenancyStatus::Active;
        tenancy.bump = ctx.bumps.tenancy;
        
        Ok(())
    }

    pub fn tenant_check_out(ctx: Context<TenantCheckOut>) -> Result<()> {
        let tenancy = &mut ctx.accounts.tenancy;
        let clock = Clock::get()?;
        
        require!(tenancy.status == TenancyStatus::Active, errors::RentalError::TenancyNotActive);
        
        tenancy.planned_checkout = clock.unix_timestamp;
        tenancy.status = TenancyStatus::CheckedOut;
        
        Ok(())
    }

    pub fn get_tenant_status(ctx: Context<GetTenantStatus>) -> Result<TenancyStatus> {
        let tenancy = &ctx.accounts.tenancy;
        Ok(tenancy.status.clone())
    }
}

// Account validation structures
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

#[derive(Accounts)]
pub struct TenantCheckIn<'info> {
    /// CHECK: Should this be a mutable account?
    #[account(mut)]
    pub tenant: Signer<'info>,
    
    #[account(
        constraint = property_contract.contract_enabled,
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
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct TenantCheckOut<'info> {
    #[account(mut)]
    pub tenant: Signer<'info>,
    
    #[account(
        mut,
        constraint = tenancy.tenant == tenant.key(),
        constraint = tenancy.status == TenancyStatus::Active,
    )]
    pub tenancy: Account<'info, Tenancy>,
}

#[derive(Accounts)]
pub struct GetTenantStatus<'info> {
    #[account(
        constraint = tenancy.tenant == tenant.key() || tenancy.property_contract == property_contract.key(),
    )]
    pub tenancy: Account<'info, Tenancy>,
    
    pub tenant: UncheckedAccount<'info>,
    pub property_contract: Account<'info, PropertyContract>,
}
