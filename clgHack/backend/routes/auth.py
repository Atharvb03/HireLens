from fastapi import APIRouter, HTTPException, status
from models import UserRegister, UserLogin
from database import users_collection
from utils.helpers import hash_password, verify_password, create_access_token
from bson.objectid import ObjectId

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/register")
async def register(user: UserRegister):
    """Register a new user (HR or Candidate)"""
    
    # Check if user already exists
    existing_user = users_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Validate role
    if user.role not in ["hr", "candidate"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Role must be 'hr' or 'candidate'"
        )
    
    # Create new user
    hashed_password = hash_password(user.password)
    user_doc = {
        "email": user.email,
        "password": hashed_password,
        "role": user.role,
        "name": user.name,
        "created_at": ObjectId().generation_time
    }
    
    result = users_collection.insert_one(user_doc)
    
    return {
        "message": "User registered successfully",
        "user_id": str(result.inserted_id),
        "email": user.email,
        "role": user.role
    }

@router.post("/login")
async def login(credentials: UserLogin):
    """Login user and return access token"""
    
    user = users_collection.find_one({"email": credentials.email})
    if not user or not verify_password(credentials.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Create access token
    access_token = create_access_token(
        data={"sub": str(user["_id"]), "email": user["email"], "role": user["role"]}
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": str(user["_id"]),
        "email": user["email"],
        "role": user["role"],
        "name": user["name"]
    }
