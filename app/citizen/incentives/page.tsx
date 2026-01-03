"use client"

import { useState, useEffect } from "react"
import { NavHeader } from "@/components/citizen/nav-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Coins, Gift, History, TrendingUp } from "lucide-react"
import {
  getWalletFromStorage,
  getRedeemedCoupons,
  getTransactions,
  redeemCoupon,
  getMockCoupons,
  type Coupon,
} from "@/lib/utils/wallet-storage"
import { getProfileFromStorage, initializeDefaultProfile } from "@/lib/utils/profile-storage"
import { useToast } from "@/hooks/use-toast"

export default function IncentivesPage() {
  const [wallet, setWallet] = useState(getWalletFromStorage())
  const [coupons] = useState<Coupon[]>(getMockCoupons())
  const [redeemedCoupons, setRedeemedCoupons] = useState(getRedeemedCoupons())
  const [transactions, setTransactions] = useState(getTransactions())
  const profile = getProfileFromStorage() || initializeDefaultProfile()
  const { toast } = useToast()

  useEffect(() => {
    const handleWalletUpdate = () => setWallet(getWalletFromStorage())
    const handleCouponsUpdate = () => setRedeemedCoupons(getRedeemedCoupons())
    const handleTransactionsUpdate = () => setTransactions(getTransactions())

    window.addEventListener("walletUpdated", handleWalletUpdate)
    window.addEventListener("couponsUpdated", handleCouponsUpdate)
    window.addEventListener("transactionsUpdated", handleTransactionsUpdate)

    return () => {
      window.removeEventListener("walletUpdated", handleWalletUpdate)
      window.removeEventListener("couponsUpdated", handleCouponsUpdate)
      window.removeEventListener("transactionsUpdated", handleTransactionsUpdate)
    }
  }, [])

  const handleRedeem = (coupon: Coupon) => {
    const redeemed = redeemCoupon(coupon)

    if (redeemed) {
      toast({
        title: "Coupon Redeemed! / कूपन रिडीम हो गया!",
        description: `Your code: ${redeemed.coupon_code}. Valid until ${new Date(redeemed.valid_until).toLocaleDateString()}`,
      })
      setWallet(getWalletFromStorage())
      setRedeemedCoupons(getRedeemedCoupons())
      setTransactions(getTransactions())
    } else {
      toast({
        title: "Insufficient EcoCoins / अपर्याप्त इको कॉइन",
        description: "You don't have enough EcoCoins to redeem this coupon.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <NavHeader userName={profile.full_name} unreadCount={0} />

      <main className="container px-4 md:px-6 py-8 max-w-5xl mx-auto">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">प्रोत्साहन और पुरस्कार / Incentives & Rewards</h1>
            <p className="text-muted-foreground mt-1">Redeem your EcoCoins for government benefits</p>
          </div>

          <Card className="bg-gradient-to-br from-green-600 to-green-500 text-white border-0">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">उपलब्ध शेष / Available Balance</p>
                  <p className="text-4xl font-bold mt-1 flex items-center gap-2">
                    <Coins className="h-10 w-10" />
                    {wallet.ecocoins_balance} EcoCoins
                  </p>
                  <p className="text-white/80 text-sm mt-2">
                    Total Earned: {wallet.total_earned} | Spent: {wallet.total_spent}
                  </p>
                </div>
                <Coins className="h-16 w-16 text-white/50" />
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="redeem" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="redeem">Redeem / रिडीम करें</TabsTrigger>
              <TabsTrigger value="history">My Coupons / मेरे कूपन ({redeemedCoupons.length})</TabsTrigger>
              <TabsTrigger value="transactions">Transactions / लेन-देन</TabsTrigger>
            </TabsList>

            <TabsContent value="redeem" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {coupons.map((coupon) => (
                  <Card key={coupon.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <Gift className="h-8 w-8 text-primary" />
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Coins className="h-3 w-3" />
                          {coupon.ecocoins_cost}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{coupon.name}</CardTitle>
                      <CardDescription>{coupon.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Category:</span>
                          <Badge variant="outline">{coupon.category}</Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Value:</span>
                          <span className="font-medium">{coupon.discount_value}</span>
                        </div>
                        <Button
                          className="w-full"
                          disabled={wallet.ecocoins_balance < coupon.ecocoins_cost}
                          onClick={() => handleRedeem(coupon)}
                        >
                          {wallet.ecocoins_balance < coupon.ecocoins_cost ? (
                            "अपर्याप्त इको कॉइन / Insufficient EcoCoins"
                          ) : (
                            <>
                              <Gift className="mr-2 h-4 w-4" />
                              अभी रिडीम करें / Redeem Now
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              {redeemedCoupons.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <Gift className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="font-semibold text-lg mb-2">No coupons yet / कोई कूपन अभी तक नहीं है</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Redeem your EcoCoins to get started / अपने इको कॉइन रिडीम करने के लिए शुरू करें
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {redeemedCoupons.map((item) => (
                    <Card key={item.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg">{item.coupon.name}</CardTitle>
                            <CardDescription className="mt-1">
                              Code: <span className="font-mono font-semibold text-foreground">{item.coupon_code}</span>
                            </CardDescription>
                          </div>
                          <Badge
                            variant={item.status === "active" ? "default" : "secondary"}
                            className={
                              item.status === "active"
                                ? "bg-green-500/10 text-green-700"
                                : item.status === "expired"
                                  ? "bg-gray-500/10 text-gray-700"
                                  : "bg-blue-500/10 text-blue-700"
                            }
                          >
                            {item.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Value:</span>
                            <span className="font-medium">{item.coupon.discount_value}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Redeemed:</span>
                            <span>{new Date(item.redeemed_at).toLocaleDateString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Valid Until:</span>
                            <span>{new Date(item.valid_until).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="transactions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions / हाल ही में लेन-देन</CardTitle>
                  <CardDescription>
                    Your EcoCoins earning and spending history / आपका इको कॉइन जीता और खर्चा इतिहास
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {transactions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <History className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-sm text-muted-foreground">No transactions yet / कोई लेन-देन अभी तक नहीं है</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {transactions.map((txn) => (
                        <div
                          key={txn.id}
                          className="flex items-center justify-between py-3 border-b border-border last:border-0"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-10 w-10 items-center justify-center rounded-full ${
                                txn.ecocoins_amount > 0
                                  ? "bg-green-500/10 text-green-700"
                                  : "bg-red-500/10 text-red-700"
                              }`}
                            >
                              {txn.ecocoins_amount > 0 ? (
                                <TrendingUp className="h-5 w-5" />
                              ) : (
                                <Gift className="h-5 w-5" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{txn.description || txn.transaction_type.replace("_", " ")}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(txn.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p
                              className={`font-semibold flex items-center gap-1 ${txn.ecocoins_amount > 0 ? "text-green-600" : "text-red-600"}`}
                            >
                              {txn.ecocoins_amount > 0 ? "+" : ""}
                              {txn.ecocoins_amount}
                              <Coins className="h-4 w-4" />
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
