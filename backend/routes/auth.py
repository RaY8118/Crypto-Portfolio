from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
import jwt

from schemas import UserCreate
from models import User, Portfolio
from utils.db_utils import get_db
from fastapi.security import OAuth2PasswordRequestForm
from config.config import settings

SECRET_KEY = settings.SECRET_KEY
router = APIRouter()


@router.post('/register')
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(
        User.username == user.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail='Username already exists')
    if not user.username or not user.password:
        raise HTTPException(
            status_code=400, detail='Username and password are required')
    db_user = User(username=user.username, password=user.password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    portfolio = Portfolio(user_id=db_user.id)
    db.add(portfolio)
    db.commit()

    return {'message': 'User created successfully', 'user': db_user.username}


@router.post('/login')
def login(form_data: OAuth2PasswordRequestForm = Depends(),
          db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == form_data.username).first()
    if not user or user.password != form_data.password:
        raise HTTPException(status_code=400, detail='Information invalid')

    token = jwt.encode({'username': user.username},
                       SECRET_KEY, algorithm='HS256')

    return {'access_token': token, 'token_type': 'bearer'}
