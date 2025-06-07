import requests


def get_crypto_price(symbol: str):
    try:
        response = requests.get(
            f'https://api.binance.com/api/v3/ticker/price?symbol={symbol}USDT')
        return float(response.json()['price'])
    except:
        return 0.0
