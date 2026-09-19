from pydantic import BaseModel, EmailStr, Field


class getUserResponse(BaseModel):
    user_id: str
    username: str
    email: EmailStr


class SignupRequest (BaseModel):
    username: str = Field(min_length=3, max_length=30)
    email: EmailStr
    password: str = Field(min_length=8)


class SignupResponse (BaseModel):
    message: str
    user_id: int
    username: str
    email: EmailStr
    consent_required: bool


class LoginRequest (BaseModel):
    email: EmailStr
    password: str


class LoginResponse (BaseModel):
    access_token: str
    token_type: str


class ParentConsentRequest (BaseModel):
    child_id: int
    consent: bool


class ParentConsentResponse (BaseModel):
    message: str
    child_id: int
    consent_status: str
