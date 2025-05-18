'use client'
import { useState } from 'react';
import { Wallet, CreditCard, ArrowRight, DollarSign, Calendar, AlertCircle, Badge } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function WithdrawPage() {
  const [amount, setAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState('bank');
  
  // Mock user data
  const userData = {
    availableBalance: 1250.75,
    pendingBalance: 320.50,
    recentWithdrawals: [
      { id: 1, amount: 500, date: '2025-05-10', status: 'completed' },
      { id: 2, amount: 750, date: '2025-04-25', status: 'completed' },
      { id: 3, amount: 200, date: '2025-04-15', status: 'processing' }
    ],
    paymentMethods: [
      { id: 1, type: 'bank', name: 'Chase Bank', last4: '4392' },
      { id: 2, type: 'card', name: 'Visa', last4: '5678' }
    ]
  };

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    alert(`Withdrawal of $${amount} initiated to ${withdrawMethod}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Withdraw Funds</h1>
      
      {/* Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <Card className="bg-amber-50 border-amber-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm font-medium text-amber-800 mb-1">Available Balance</div>
                <div className="text-2xl font-bold text-amber-800">${userData.availableBalance.toFixed(2)}</div>
              </div>
              <Wallet className="h-8 w-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-50 border-gray-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm font-medium text-gray-600 mb-1">Pending Balance</div>
                <div className="text-2xl font-bold text-gray-700">${userData.pendingBalance.toFixed(2)}</div>
              </div>
              <Calendar className="h-8 w-8 text-gray-500" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Withdrawal Form */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2">
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="bg-gray-50 border-b border-gray-200 p-4">
              <h2 className="text-lg font-medium text-gray-800">Withdraw Funds</h2>
            </CardHeader>
            <CardContent className="p-4">
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                    </div>
                    <input
                      type="number"
                      min="10"
                      max={userData.availableBalance}
                      step="0.01"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full pl-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Minimum withdrawal: $10.00</p>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Withdraw To</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {userData.paymentMethods.map((method) => (
                      <div
                        key={method.id}
                        onClick={() => setWithdrawMethod(method.type)}
                        className={`cursor-pointer border rounded-lg p-3 flex items-center gap-3 transition-all ${
                          withdrawMethod === method.type 
                            ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-200' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {method.type === 'bank' ? (
                          <Wallet className="h-5 w-5 text-amber-600" />
                        ) : (
                          <CreditCard className="h-5 w-5 text-amber-600" />
                        )}
                        <div>
                          <div className="font-medium text-gray-800">{method.name}</div>
                          <div className="text-sm text-gray-500">Ending in {method.last4}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center justify-between gap-4 mt-6">
                  <div className="text-sm text-gray-500">
                    Withdrawals typically process within 1-3 business days
                  </div>
                  <Button 
                    type="submit" 
                    disabled={!amount || Number(amount) <= 0 || Number(amount) > userData.availableBalance}
                    className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg shadow-md transition-all duration-200 flex items-center justify-center disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    <span>Withdraw</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="bg-gray-50 border-b border-gray-200 p-4">
              <h2 className="text-lg font-medium text-gray-800">Recent Withdrawals</h2>
            </CardHeader>
            <CardContent className="p-4">
              {userData.recentWithdrawals.length > 0 ? (
                <div className="space-y-3">
                  {userData.recentWithdrawals.map((withdrawal) => (
                    <div key={withdrawal.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                      <div>
                        <div className="font-medium text-gray-800">${withdrawal.amount.toFixed(2)}</div>
                        <div className="text-xs text-gray-500">{new Date(withdrawal.date).toLocaleDateString()}</div>
                      </div>
                      <div>
                        <Badge 
                          className={withdrawal.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}
                        >
                          {withdrawal.status === 'completed' ? 'Completed' : 'Processing'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <AlertCircle className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-gray-500">No recent withdrawals</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Information Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
        <div>
          <h3 className="font-medium text-blue-800 mb-1">Need Help?</h3>
          <p className="text-sm text-blue-600">
            If you have any questions about withdrawals or need assistance, please contact our support team.
          </p>
        </div>
      </div>
    </div>
  );
}

// Mock components
