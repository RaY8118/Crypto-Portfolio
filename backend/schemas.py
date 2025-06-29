from pydantic import BaseModel
from enum import Enum


class UserCreate(BaseModel):
    username: str
    password: str


class AddMoney(BaseModel):
    amount: float


class SupportedSymbols(str, Enum):
    BTC = 'BTC'
    ETH = 'ETH'
    LTC = 'LTC'
    XRP = 'XRP'
    BCH = 'BCH'
    DOGE = 'DOGE'


class TradeAsset(BaseModel):
    symbol: SupportedSymbols
    quantity: float
