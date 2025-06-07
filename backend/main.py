from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes import auth, trade, portfolio

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(trade.router, prefix="/trade", tags=["trade"])
app.include_router(portfolio.router, prefix="/portfolio", tags=["portfolio"])
