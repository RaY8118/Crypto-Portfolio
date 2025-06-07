from fastapi import Depends, HTTPException

from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
import jwt
from utils.db_utils import get_db
from models import User
from config.config import settings

SECRET_KEY = settings.SECRET_KEY
oauth2_scheme = OAuth2PasswordBearer(tokenUrl='token')


def get_current_user(token: str = Depends(oauth2_scheme),
                     db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        user = db.query(User).filter(
            User.username == payload['username']).first()
        return user
    except:
        return HTTPException(status_code=401)
