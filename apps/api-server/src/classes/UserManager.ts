class UserManager {
  private balances: Record<string, number> = {};

  createUser(userId: string) {
    this.balances[userId] = 5000_00; // 5000 USD 
  }

  getBalance(userId: string) {
    return this.balances[userId] || 0;
  }

  updateBalance(userId: string, amount: number) {
    this.balances[userId] = (this.balances[userId] || 0) + amount;
  }
}


export const userManager = new UserManager();