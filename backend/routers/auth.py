from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from database import supabase, supabase_admin, SUPABASE_URL
import jwt
from jwt import PyJWKClient
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

router = APIRouter(prefix="/auth", tags=["auth"])
JWKS_URL = f"{SUPABASE_URL}/auth/v1/.well-known/jwks.json"
jwk_client = PyJWKClient(JWKS_URL)

bearer_scheme = HTTPBearer()


class SignupRequest(BaseModel):
    username: str
    full_name: str
    age: int
    email: str
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str


@router.post("/login")
def login(payload: LoginRequest):
    try:
        result = supabase.auth.sign_in_with_password({
            "email": payload.email,
            "password": payload.password
        })
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))

    return {
        "access_token": result.session.access_token,
        "refresh_token": result.session.refresh_token,
        "user_id": result.user.id
    }


@router.post("/signup")
def signup(payload: SignupRequest):
    try:
        result = supabase.auth.sign_up({
            "email": payload.email,
            "password": payload.password
        })
    except Exception as e:
        raise HTTPException(status_code=400, detail=(str(e)))

    if result.user is None:
        raise HTTPException(status_code=400, detail="Signup failed")

    # now create the matching row in public.users
    try:
        supabase_admin.table("users").insert({
            "user_id": result.user.id,
            "email": payload.email,
            "username": payload.username,
            "full_name": payload.full_name,
            "age": payload.age
        }).execute()
    except Exception as e:
        # Optional: delete the auth user if you want atomicity
        supabase_admin.auth.admin.delete_user(result.user.id)
        raise HTTPException(status_code=400, detail=f"Failed to create user profile: {str(e)}")

    return login(LoginRequest(email=payload.email, password=payload.password))


@router.get("/login/google")
def google_login():
    result = supabase.auth.sign_in_with_oauth({
        "provider": "google",
        "options": {
            "redirect_to": "http://localhost:8000/api/v1/auth/callback"
        }
    })
    return {"auth_url": result.url}


@router.get("/callback")
def google_callback(code: str):
    try:
        result = supabase.auth.exchange_code_for_session({"auth_code": code})
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))
    existing = supabase_admin.table("users").select("*").eq("user_id", result.user.id).execute()
    if not existing.data:
        supabase_admin.table("users").insert({
            "user_id": result.user.id,
            "email": result.user.email,
            "username": result.user.email.split("@")[0],
            "full_name": result.user.user_metadata.get("full_name", ""),
            "age": None
        }).execute()

    return {
        "access_token": result.session.access_token,
        "refresh_token": result.session.refresh_token,
        "user_id": result.user.id,
    }


@router.get("/me")
async def get_current_user_id(credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)):
    # Extract the JWT from the Authorization header
    token = credentials.credentials
    try:
        # Get the signing key used by Supabase to sign the JWT
        signing_key = jwk_client.get_signing_key_from_jwt(token)

        # Verify the JWT and decode its payload
        payload = jwt.decode(
            token,
            signing_key.key,
            algorithms=["ES256"],
            audience="authenticated"
        )

    except jwt.PyJWTError:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )

    # Return the authenticated user's UUID from the JWT
    return payload["sub"]


@router.post("/logout")
async def logout():
    return {"message": "Logged out"}


@router.post("/refresh")
async def refresh_token(refresh_token: str):
    try:
        response = supabase.auth.refresh_session(refresh_token)
        new_session = response.session
        return {
            "access_token": new_session.access_token,
            "refresh_token": new_session.refresh_token,
            "expires_in": new_session.expires_in,
        }
    except Exception as e:
        raise HTTPException(status_code=401, detail="Could not refresh session")
