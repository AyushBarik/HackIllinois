use anchor_lang::prelude::*;
use crate::state::property::PropertyContract;
use crate::state::tenancy::{Tenancy, TenancyStatus};

pub fn handler(
    ctx: Context<GetTenantStatus>,
) -> Result<TenancyStatus> {
    let tenancy = &ctx.accounts.tenancy;
    Ok(tenancy.status.clone())
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