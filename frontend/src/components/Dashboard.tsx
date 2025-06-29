import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPortfolio, buyAsset, sellAsset, addMoney, withdrawMoney } from '../services/api';
import type { Portfolio, Asset } from '../services/api';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();
  const { logout: authLogout } = useAuth();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Transaction states
  const [buySymbol, setBuySymbol] = useState('');
  const [buyQuantity, setBuyQuantity] = useState('');
  const [sellSymbol, setSellSymbol] = useState('');
  const [sellQuantity, setSellQuantity] = useState('');
  const [addMoneyAmount, setAddMoneyAmount] = useState('');
  const [withdrawMoneyAmount, setwithdrawMoneyAmount] = useState('');

  // Modal states
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showSellModal, setShowSellModal] = useState(false);
  const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);
  const [showWithdrawMoneyModal, setShowWithdrawMoneyModal] = useState(false);
  const [transactionLoading, setTransactionLoading] = useState(false);

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      setLoading(true);
      const response = await getPortfolio();
      setPortfolio(response.data);
      setError('');
    } catch (err: unknown) {
      setError('Failed to load portfolio data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const parseError = (err: unknown, defaultMessage: string) => {
    if (axios.isAxiosError(err) && err.response) {
      const data = err.response.data;
      if (typeof data.detail === 'string') {
        return data.detail;
      } else if (Array.isArray(data.detail)) {
        return data.detail.map((d: any) => d.msg).join(', ');
      }
    }
    return defaultMessage;
  };

  const handleBuy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!buySymbol || !buyQuantity) return;
    setError('');

    try {
      setTransactionLoading(true);
      const response = await buyAsset(buySymbol.toUpperCase(), Number(buyQuantity));
      await fetchPortfolio();
      setShowBuyModal(false);
      setBuySymbol('');
      setBuyQuantity('');
      setSuccess(response.data.message);
    } catch (err: unknown) {
      setError(parseError(err, 'Failed to buy asset'));
      setShowBuyModal(false);
    } finally {
      setTransactionLoading(false);
    }
  };

  const handleSell = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sellSymbol || !sellQuantity) return;
    setError('');

    try {
      setTransactionLoading(true);
      const response = await sellAsset(sellSymbol.toUpperCase(), Number(sellQuantity));
      await fetchPortfolio();
      setShowSellModal(false);
      setSellSymbol('');
      setSellQuantity('');
      setSuccess(response.data.message);
      console.log(response.data.message);

    } catch (err: unknown) {
      setError(parseError(err, 'Failed to sell asset'))
      setShowSellModal(false);
    } finally {
      setTransactionLoading(false);
    }
  };

  const handleAddMoney = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addMoneyAmount) return;
    setError('');

    try {
      setTransactionLoading(true);
      const response = await addMoney(Number(addMoneyAmount));
      await fetchPortfolio();
      setShowAddMoneyModal(false);
      setAddMoneyAmount('');
      setSuccess(response.data.message);
    } catch (err: unknown) {
      setError(parseError(err, 'Failed to add money'));
      setShowAddMoneyModal(false);
    } finally {
      setTransactionLoading(false);
    }
  };

  const handleWithdrawMoney = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!withdrawMoneyAmount) return;
    setError('');

    try {
      setTransactionLoading(true);
      const response = await withdrawMoney(Number(withdrawMoneyAmount));
      await fetchPortfolio();
      setShowWithdrawMoneyModal(false);
      setwithdrawMoneyAmount('');
      setSuccess(response.data.message);
    } catch (err: unknown) {
      setError(parseError(err, 'Failed to withdraw money'));
      setShowWithdrawMoneyModal(false);
    } finally {
      setTransactionLoading(false);
    }
  };

  const handleLogout = () => {
    authLogout();
    navigate('/login');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Header */}
      <header className="bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-blue-400">CryptoFolio Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-6 py-2 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition duration-300"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 rounded-md bg-red-900 bg-opacity-30 p-4">
            <div className="text-sm text-red-300">{error}</div>
          </div>
        )}
        {success && (
          <div className="mb-6 rounded-md bg-green-900 bg-opacity-30 p-4">
            <div className="text-sm text-green-300">{success}</div>
          </div>
        )}
        {portfolio && (
          <>
            {/* Portfolio Overview */}
            <div className="bg-gray-800 rounded-xl shadow-xl p-6 mb-8 border border-gray-700">
              <h2 className="text-2xl font-semibold mb-6 text-white">Portfolio Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-5 bg-gray-700 rounded-lg shadow-md">
                  <p className="text-sm text-gray-400">Total Value</p>
                  <p className="text-3xl font-bold text-blue-400 mt-1">{formatCurrency(portfolio.total_value)}</p>
                </div>
                <div className="p-5 bg-gray-700 rounded-lg shadow-md">
                  <p className="text-sm text-gray-400">Available Cash</p>
                  <p className="text-3xl font-bold text-green-400 mt-1">{formatCurrency(portfolio.available_money)}</p>
                </div>
                <div className="p-5 bg-gray-700 rounded-lg shadow-md">
                  <p className="text-sm text-gray-400">Total Added</p>
                  <p className="text-3xl font-bold text-purple-400 mt-1">{formatCurrency(portfolio.total_added_money)}</p>
                </div>
                <div className="p-5 bg-gray-700 rounded-lg shadow-md">
                  <p className="text-sm text-gray-400">Performance</p>
                  <p className={portfolio.performance_abs >= 0 ? "text-3xl font-bold text-green-500 mt-1" : "text-3xl font-bold text-red-500 mt-1"}>
                    {formatCurrency(portfolio.performance_abs)} ({formatPercentage(portfolio.performance_rel)})
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 mb-8 justify-center">
              <button
                onClick={() => setShowBuyModal(true)}
                className="px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition duration-300 shadow-md"
              >
                Buy Asset
              </button>
              <button
                onClick={() => setShowSellModal(true)}
                className="px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 transition duration-300 shadow-md"
              >
                Sell Asset
              </button>
              <button
                onClick={() => setShowAddMoneyModal(true)}
                className="px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition duration-300 shadow-md"
              >
                Add Money
              </button>
              <button
                onClick={() => setShowWithdrawMoneyModal(true)}
                className="px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition duration-300 shadow-md"
              >
                Withdraw Money
              </button>
            </div>

            {/* Assets Table */}
            <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-700">
              <h2 className="text-2xl font-semibold p-6 pb-4 text-white">Your Assets</h2>
              {portfolio.assets.length === 0 ? (
                <div className="p-6 text-center text-gray-400 text-lg">
                  You don't have any assets yet. Start buying some!
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-700">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Symbol</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Quantity</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Current Price</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Total Value</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Performance ($)</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Performance (%)</th>
                      </tr>
                    </thead>
                    <tbody className="bg-gray-800 divide-y divide-gray-700">
                      {portfolio.assets.map((asset: Asset) => (
                        <tr key={asset.symbol} className="hover:bg-gray-700 transition duration-150">
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-white">{asset.symbol}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-300">{asset.quantity}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-300">{formatCurrency(asset.current_price)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-300">{formatCurrency(asset.total_value)}</td>
                          <td className={asset.performance_abs >= 0 ? "px-6 py-4 whitespace-nowrap text-green-500" : "px-6 py-4 whitespace-nowrap text-red-500"}>
                            {formatCurrency(asset.performance_abs)}
                          </td>
                          <td className={asset.performance_rel >= 0 ? "px-6 py-4 whitespace-nowrap text-green-500" : "px-6 py-4 whitespace-nowrap text-red-500"}>
                            {formatPercentage(asset.performance_rel)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* Buy Modal */}
      {showBuyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl max-w-md w-full p-8 shadow-2xl border border-gray-700">
            <h3 className="text-2xl font-bold text-white mb-6">Buy Asset</h3>
            <form onSubmit={handleBuy}>
              <div className="mb-4">
                <label htmlFor="buySymbol" className="block text-sm font-medium text-gray-300 mb-1">Symbol</label>
                <select value={buySymbol} onChange={(e) => setBuySymbol(e.target.value)} className="mt-2 block w-full px-4 py-2 border border-gray-700 rounded-md bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="">Select Asset</option>
                  <option value="BTC">Bitcoin (BTC)</option>
                  <option value="ETH">Ethereum (ETH)</option>
                  <option value="XRP">Ripple (XRP)</option>
                  <option value="LTC">Litecoin (LTC)</option>
                  <option value="BCH">Bitcoin Cash (BCH)</option>
                  <option value="DOGE">Dogecoin Cash (DOGE)</option>
                </select>
              </div>
              <div className="mb-6">
                <label htmlFor="buyQuantity" className="block text-sm font-medium text-gray-300 mb-1">Quantity</label>
                <input
                  type="number"
                  id="buyQuantity"
                  value={buyQuantity}
                  onChange={(e) => setBuyQuantity(e.target.value)}
                  className="block w-full px-4 py-2 border border-gray-700 rounded-md bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="0.000001"
                  step="0.000001"
                  placeholder="0.000000"
                  required
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowBuyModal(false)}
                  className="px-5 py-2 border border-gray-600 rounded-md text-base font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 transition duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={transactionLoading}
                  className="px-5 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
                >
                  {transactionLoading ? 'Processing...' : 'Buy'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sell Modal */}
      {showSellModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl max-w-md w-full p-8 shadow-2xl border border-gray-700">
            <h3 className="text-2xl font-bold text-white mb-6">Sell Asset</h3>
            <form onSubmit={handleSell}>
              <div className="mb-4">
                <select value={buySymbol} onChange={(e) => setSellSymbol(e.target.value)} className="mt-2 block w-full px-4 py-2 border border-gray-700 rounded-md bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="">Select Asset</option>
                  <option value="BTC">Bitcoin (BTC)</option>
                  <option value="ETH">Ethereum (ETH)</option>
                  <option value="XRP">Ripple (XRP)</option>
                  <option value="LTC">Litecoin (LTC)</option>
                  <option value="BCH">Bitcoin Cash (BCH)</option>
                  <option value="DOGE">Dogecoin Cash (DOGE)</option>
                </select>
              </div>
              <div className="mb-6">
                <label htmlFor="sellQuantity" className="block text-sm font-medium text-gray-300 mb-1">Quantity</label>
                <input
                  type="number"
                  id="sellQuantity"
                  value={sellQuantity}
                  onChange={(e) => setSellQuantity(e.target.value)}
                  className="block w-full px-4 py-2 border border-gray-700 rounded-md bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="0.000001"
                  step="0.000001"
                  placeholder="0.000000"
                  required
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowSellModal(false)}
                  className="px-5 py-2 border border-gray-600 rounded-md text-base font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 transition duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={transactionLoading}
                  className="px-5 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:bg-yellow-400 disabled:cursor-not-allowed"
                >
                  {transactionLoading ? 'Processing...' : 'Sell'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Money Modal */}
      {showAddMoneyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl max-w-md w-full p-8 shadow-2xl border border-gray-700">
            <h3 className="text-2xl font-bold text-white mb-6">Add Money</h3>
            <form onSubmit={handleAddMoney}>
              <div className="mb-6">
                <label htmlFor="addMoneyAmount" className="block text-sm font-medium text-gray-300 mb-1">Amount</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">$</span>
                  <input
                    type="number"
                    id="addMoneyAmount"
                    value={addMoneyAmount}
                    onChange={(e) => setAddMoneyAmount(e.target.value)}
                    className="block w-full pl-8 pr-4 py-2 border border-gray-700 rounded-md bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.00"
                    min="1"
                    step="1"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowAddMoneyModal(false)}
                  className="px-5 py-2 border border-gray-600 rounded-md text-base font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 transition duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={transactionLoading}
                  className="px-5 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-400 disabled:cursor-not-allowed"
                >
                  {transactionLoading ? 'Processing...' : 'Add Money'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Withdraw Money Modal */}
      {showWithdrawMoneyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl max-w-md w-full p-8 shadow-2xl border border-gray-700">
            <h3 className="text-2xl font-bold text-white mb-6">Withdraw Money</h3>
            <form onSubmit={handleWithdrawMoney}>
              <div className="mb-6">
                <label htmlFor="withdrawMoneyAmount" className="block text-sm font-medium text-gray-300 mb-1">Amount</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">$</span>
                  <input
                    type="number"
                    id="withdrawMoneyAmount"
                    value={withdrawMoneyAmount}
                    onChange={(e) => setwithdrawMoneyAmount(e.target.value)}
                    className="block w-full pl-8 pr-4 py-2 border border-gray-700 rounded-md bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.00"
                    min="1"
                    step="1"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowWithdrawMoneyModal(false)}
                  className="px-5 py-2 border border-gray-600 rounded-md text-base font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 transition duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={transactionLoading}
                  className="px-5 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-400 disabled:cursor-not-allowed"
                >
                  {transactionLoading ? 'Processing...' : 'Withdraw Money'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
