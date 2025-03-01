use anchor_lang::prelude::*;

#[account]
pub struct PropertyContract {
    pub owner: Pubkey,              // Property owner's wallet address
    pub rent_amount: u64,           // Monthly rent in lamports
    pub security_deposit: u64,      // Security deposit amount in lamports
    pub lease_duration: i64,        // Duration in seconds
    pub creation_timestamp: i64,    // When the contract was created
    pub contract_enabled: bool,     // Whether the contract is open for new tenants
    pub bump: u8,                   // PDA bump
}