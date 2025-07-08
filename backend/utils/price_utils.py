import requests
import redis
import os
from config.config import settings

redis_url = settings.REDIS_URL

redis_client = redis.from_url(redis_url, decode_responses=True)

symbol_to_coingecko_id = {
    'BTC': 'bitcoin',
    'ETH': 'ethereum',
    'LTC': 'litecoin',
    'XRP': 'ripple',
    'BCH': 'bitcoin-cash',
    'DOGE': 'dogecoin',
}


def get_crypto_price(symbol: str):
    coingecko_id = symbol_to_coingecko_id[symbol]
    cache_key = f"price:{symbol}"

    cached_price = redis_client.get(cache_key)
    if cached_price:
        print(f"Cache hit for {symbol}")
        return float(cached_price)

    try:
        response = requests.get(
            f'https://api.coingecko.com/api/v3/simple/price?ids={coingecko_id}&vs_currencies=usd'
        )
        response.raise_for_status()
        price = float(response.json()[coingecko_id]['usd'])
        redis_client.setex(cache_key, 60, price)
        print(f"Fetched and cached price for {symbol}:{price}")
        return price
    except Exception as e:
        print(f"Error fetching price for {symbol}: {e}")
        return 0.0
