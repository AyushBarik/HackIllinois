use anchor_lang::prelude::*;

#[error_code]
pub enum RentalError {
    #[msg("Contract is currently disabled")]
    ContractDisabled,
    
    #[msg("Tenancy is not active")]
    TenancyNotActive,
    
    #[msg("Unauthorized access")]
    Unauthorized,
    
    #[msg("Insufficient funds")]
    InsufficientFunds,
}