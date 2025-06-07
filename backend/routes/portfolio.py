from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from utils.db_utils import get_db
from utils.auth_utils import get_current_user
from utils.price_utils import get_crypto_price
from models import User, Transaction

router = APIRouter()


@router.get('/')
def get_portfolio(user: User = Depends(get_current_user),
                  db: Session = Depends(get_db)):

    portfolio = user.portfolio
    assets_response = []
    total_value = portfolio.available_money

    for asset in portfolio.assets:
        current_price = get_crypto_price(asset.symbol)
        net_quantity = asset.quantity
        asset_value = current_price * net_quantity
        total_value += asset_value
        transactions = db.query(Transaction).filter(
            Transaction.portfolio_id == portfolio.id, Transaction.symbol == asset.symbol).all()

        total_cost = 0
        total_bought = 0

        for t in transactions:
            if t.quantity > 0:
                total_cost += t.quantity * t.price
                total_bought += t.quantity

        avg_purchase_price = total_cost / total_bought if total_bought > 0 else 0
        invested_amount = avg_purchase_price * net_quantity

        assets_response.append({
            'symbol': asset.symbol,
            'quantity': asset.quantity,
            'current_price': current_price,
            'total_value': asset_value,
            'avg_purchase_price': avg_purchase_price,
            'performance_abs': asset_value - invested_amount,
            'performance_rel': (asset_value - invested_amount) / invested_amount * 100 if invested_amount != 0 else 0
        })

    return {
        'total_added_money': portfolio.total_added_money,
        'available_money': portfolio.available_money,
        'total_value': total_value,
        'performance_abs': total_value - portfolio.total_added_money,
        'performance_rel': (total_value - portfolio.total_added_money) / portfolio.total_added_money * 100 if portfolio.total_added_money != 0 else 0,
        'assets': assets_response
    }
