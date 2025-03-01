use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum TenancyStatus {
    Active,
    CheckedOut,
    Terminated,
}

#[account]
pub struct Tenancy {
    pub property_contract: Pubkey,     // Reference to the property contract
    pub tenant: Pubkey,               // Tenant's wallet address
    pub check_in_timestamp: i64,      // When the tenant checked in
    pub planned_checkout: i64,        // When the tenant is expected to check out
    pub status: TenancyStatus,        // Current status of the tenancy
    pub escrow_account: Pubkey,       // Account holding the funds in escrow
    pub bump: u8,                     // PDA bump
}
