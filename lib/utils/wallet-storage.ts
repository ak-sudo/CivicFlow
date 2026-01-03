export interface Wallet {
  user_id: string
  ecocoins_balance: number
  total_earned: number
  total_spent: number
  updated_at: string
}

export interface Coupon {
  id: string
  name: string
  description: string
  ecocoins_cost: number
  discount_value: string
  category: string
  is_active: boolean
}

export interface RedeemedCoupon {
  id: string
  user_id: string
  coupon_id: string
  coupon_code: string
  coupon: Coupon
  redeemed_at: string
  valid_until: string
  status: "active" | "used" | "expired"
}

export interface Transaction {
  id: string
  user_id: string
  transaction_type: string
  ecocoins_amount: number
  description: string
  created_at: string
}

const WALLET_KEY = "civicflow_wallet"
const REDEEMED_COUPONS_KEY = "civicflow_redeemed_coupons"
const TRANSACTIONS_KEY = "civicflow_transactions"

export function getWalletFromStorage(): Wallet {
  if (typeof window === "undefined") return getDefaultWallet()
  try {
    const stored = localStorage.getItem(WALLET_KEY)
    return stored ? JSON.parse(stored) : getDefaultWallet()
  } catch {
    return getDefaultWallet()
  }
}

function getDefaultWallet(): Wallet {
  return {
    user_id: "user_" + Date.now(),
    ecocoins_balance: 850,
    total_earned: 1200,
    total_spent: 350,
    updated_at: new Date().toISOString(),
  }
}

export function updateWallet(updates: Partial<Wallet>): void {
  if (typeof window === "undefined") return
  try {
    const wallet = getWalletFromStorage()
    const updatedWallet = { ...wallet, ...updates, updated_at: new Date().toISOString() }
    localStorage.setItem(WALLET_KEY, JSON.stringify(updatedWallet))
    window.dispatchEvent(new CustomEvent("walletUpdated", { detail: { wallet: updatedWallet } }))
  } catch (error) {
    console.error("Failed to update wallet:", error)
  }
}

export function addEcocoins(amount: number, type: string, description: string): void {
  const wallet = getWalletFromStorage()
  const newBalance = wallet.ecocoins_balance + amount
  const newTotalEarned = wallet.total_earned + amount

  updateWallet({
    ecocoins_balance: newBalance,
    total_earned: newTotalEarned,
  })

  addTransaction({
    id: `txn_${Date.now()}`,
    user_id: wallet.user_id,
    transaction_type: type,
    ecocoins_amount: amount,
    description,
    created_at: new Date().toISOString(),
  })
}

export function deductEcocoins(amount: number, type: string, description: string): boolean {
  const wallet = getWalletFromStorage()

  if (wallet.ecocoins_balance < amount) {
    return false
  }

  const newBalance = wallet.ecocoins_balance - amount
  const newTotalSpent = wallet.total_spent + amount

  updateWallet({
    ecocoins_balance: newBalance,
    total_spent: newTotalSpent,
  })

  addTransaction({
    id: `txn_${Date.now()}`,
    user_id: wallet.user_id,
    transaction_type: type,
    ecocoins_amount: -amount,
    description,
    created_at: new Date().toISOString(),
  })

  return true
}

export function getRedeemedCoupons(): RedeemedCoupon[] {
  if (typeof window === "undefined") return []
  try {
    const stored = localStorage.getItem(REDEEMED_COUPONS_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function redeemCoupon(coupon: Coupon): RedeemedCoupon | null {
  const wallet = getWalletFromStorage()

  if (wallet.ecocoins_balance < coupon.ecocoins_cost) {
    return null
  }

  const success = deductEcocoins(coupon.ecocoins_cost, "coupon_redemption", `Redeemed: ${coupon.name}`)

  if (!success) return null

  const redeemedCoupon: RedeemedCoupon = {
    id: `redeemed_${Date.now()}`,
    user_id: wallet.user_id,
    coupon_id: coupon.id,
    coupon_code: `CF${Date.now().toString().slice(-8).toUpperCase()}`,
    coupon,
    redeemed_at: new Date().toISOString(),
    valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    status: "active",
  }

  try {
    const redeemed = getRedeemedCoupons()
    redeemed.unshift(redeemedCoupon)
    localStorage.setItem(REDEEMED_COUPONS_KEY, JSON.stringify(redeemed))
    window.dispatchEvent(new CustomEvent("couponsUpdated", { detail: { coupons: redeemed } }))
    return redeemedCoupon
  } catch (error) {
    console.error("Failed to save redeemed coupon:", error)
    return null
  }
}

export function getTransactions(): Transaction[] {
  if (typeof window === "undefined") return []
  try {
    const stored = localStorage.getItem(TRANSACTIONS_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function addTransaction(transaction: Transaction): void {
  if (typeof window === "undefined") return
  try {
    const transactions = getTransactions()
    transactions.unshift(transaction)
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions))
    window.dispatchEvent(new CustomEvent("transactionsUpdated", { detail: { transactions } }))
  } catch (error) {
    console.error("Failed to add transaction:", error)
  }
}

export function getMockCoupons(): Coupon[] {
  return [
    {
      id: "coup_1",
      name: "FASTag टोल छूट / FASTag Toll Discount",
      description: "राष्ट्रीय राजमार्गों पर ₹100 की टोल छूट / ₹100 toll discount on national highways",
      ecocoins_cost: 500,
      discount_value: "₹100",
      category: "परिवहन / Transportation",
      is_active: true,
    },
    {
      id: "coup_2",
      name: "जल बिल छूट / Water Bill Discount",
      description: "अगले जल बिल पर 10% की छूट - DJB / 10% off on next water bill - DJB",
      ecocoins_cost: 300,
      discount_value: "10%",
      category: "उपयोगिताएं / Utilities",
      is_active: true,
    },
    {
      id: "coup_3",
      name: "बिजली बिल छूट / Electricity Bill Discount",
      description: "बिजली बिल पर ₹150 की छूट - NDMC/MCD / ₹150 off on electricity bill - NDMC/MCD",
      ecocoins_cost: 600,
      discount_value: "₹150",
      category: "उपयोगिताएं / Utilities",
      is_active: true,
    },
    {
      id: "coup_4",
      name: "नगरपालिका पार्किंग पास / Municipal Parking Pass",
      description: "1 महीने के लिए मुफ्त पार्किंग - All MCD Parking / Free parking for 1 month",
      ecocoins_cost: 800,
      discount_value: "1 month",
      category: "परिवहन / Transportation",
      is_active: true,
    },
    {
      id: "coup_5",
      name: "मेट्रो/बस पास छूट / Public Transport Pass",
      description: "Delhi Metro/DTC bus monthly pass पर 20% छूट / 20% off on Delhi Metro/DTC monthly pass",
      ecocoins_cost: 400,
      discount_value: "20%",
      category: "परिवहन / Transportation",
      is_active: true,
    },
    {
      id: "coup_6",
      name: "संपत्ति कर छूट / Property Tax Rebate",
      description: "वार्षिक संपत्ति कर पर 5% की छूट - MCD / 5% off on annual property tax - MCD",
      ecocoins_cost: 1000,
      discount_value: "5%",
      category: "नागरिक / Civic",
      is_active: true,
    },
  ]
}
