import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;


export interface UserCreate {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface AddMoney {
  amount: number;
}

export interface TradeAsset {
  symbol: string;
  quantity: number;
}

export interface Asset {
  symbol: string;
  quantity: number;
  current_price: number;
  total_value: number;
  performance_abs: number;
  performance_rel: number;
}

export interface Portfolio {
  total_added_money: number;
  available_money: number;
  total_value: number;
  performance_abs: number;
  performance_rel: number;
  assets: Asset[]
}

export interface HistoryEntry {
  id: number;
  portfolio_id: number;
  price: number;
  quantity: number;
  symbol: string;
  timestamp: string;
}

export interface GetHistoryResponse {
  message: string;
  transactions: HistoryEntry[];
}
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

export const setAuthToken = (token: string) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
}

export const register = async (userData: UserCreate) => {
  return api.post('/auth/register', userData);
}

export const login = async (username: string, password: string) => {
  const formData = new FormData();
  formData.append('username', username);
  formData.append('password', password);

  const response = await api.post<LoginResponse>('/auth/login', formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    }
  })

  if (response.data.access_token) {
    setAuthToken(response.data.access_token);
    localStorage.setItem('token', response.data.access_token);
  }
}

export const logout = () => {
  localStorage.removeItem('token');
  setAuthToken("");
}

export const checkAuth = () => {
  const token = localStorage.getItem('token');
  if (token) {
    setAuthToken(token);
    return true;
  }
  return false;
}

export const addMoney = async (amount: number) => {
  return api.post('/trade/add-money', { amount });
}

export const withdrawMoney = async (amount: number) => {
  return api.post('/trade/withdraw-money', { amount });
}

export const buyAsset = async (symbol: string, quantity: number) => {
  return api.post('/trade/buy', { symbol, quantity });
}

export const sellAsset = async (symbol: string, quantity: number) => {
  return api.post('/trade/sell', { symbol, quantity });
}

export const getPortfolio = async () => {
  return api.get<Portfolio>('/portfolio');
}

export const getHistory = async () => {
  return api.get<GetHistoryResponse>('/trade/history');
}

export const pingToBackend = () => {
  return api.get('/auth/ping')
}

export default {
  register,
  login,
  logout,
  checkAuth,
  addMoney,
  buyAsset,
  sellAsset,
  getPortfolio
}
