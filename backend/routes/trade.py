from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from utils.db_utils import get_db
from utils.auth_utils import get_current_user
from utils.price_utils import get_crypto_price
from models import User, Asset, Portfolio, Transaction
from schemas import AddMoney, TradeAsset

router = APIRouter()


@router.post('/add-money')
def add_money(money: AddMoney, user: User = Depends(get_current_user),
              db: Session = Depends(get_db)):
    portfolio = user.portfolio
    portfolio.total_added_money += money.amount
    portfolio.available_money += money.amount

    db.commit()

    return {'message': 'Successfully added money'}


@router.post('/withdraw-money')
def withdraw_money(money: AddMoney, user: User = Depends(get_current_user),
                   db: Session = Depends(get_db)):
    portfolio = user.portfolio
    portfolio.total_added_money -= money.amount
    portfolio.available_money -= money.amount

    db.commit()

    return {'message': f'Successfully withdrawed {money.amount}'}


@router.post('/buy')
def buy_asset(trade: TradeAsset, user: User = Depends(get_current_user),
              db: Session = Depends(get_db)):
    portfolio: Portfolio = user.portfolio
    price = get_crypto_price(trade.symbol)
    total_cost = price * trade.quantity

    if total_cost > portfolio.available_money:
        raise HTTPException(status_code=400, detail='Insufficient funds')

    asset = db.query(Asset).filter(
        Asset.portfolio_id == portfolio.id,
        Asset.symbol == trade.symbol
    ).first()

    if asset:
        asset.quantity += trade.quantity
    else:
        asset = Asset(
            portfolio_id=portfolio.id,
            symbol=trade.symbol,
            quantity=trade.quantity
        )
        db.add(asset)

    transaction = Transaction(
        portfolio_id=portfolio.id, symbol=trade.symbol,
        quantity=trade.quantity, price=price, timestamp=datetime.utcnow()
    )

    db.add(transaction)

    portfolio.total_added_money -= total_cost

    db.commit()

    return {'message': 'Asset successfully bought.'}


@router.post('/sell')
def sell_asset(trade: TradeAsset, user: User = Depends(get_current_user),
               db: Session = Depends(get_db)):
    portfolio: Portfolio = user.portfolio
    asset = db.query(Asset).filter(Asset.portfolio_id ==
                                   portfolio.id, Asset.symbol == trade.symbol).first()

    if not asset or asset.quantity < trade.quantity:
        raise HTTPException(status_code=400, detail="Not enough to sell")

    price = get_crypto_price(trade.symbol)
    total_value = price * trade.quantity

    asset.quantity -= trade.quantity

    if asset.quantity == 0:
        db.delete(asset)

    transaction = Transaction(
        portfolio_id=portfolio.id, symbol=trade.symbol,
        quantity=-trade.quantity, price=price, timestamp=datetime.utcnow()
    )

    db.add(transaction)

    portfolio.available_money += total_value

    db.commit()

    return {'message': 'Asset successfully sold.'}
