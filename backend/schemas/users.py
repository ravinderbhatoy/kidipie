from pydantic import BaseModel
from uuid import UUID


class UserResponse (BaseModel):
    user_id: UUID
    username: str
    full_name: str
    email: str
    age: int
    parent_email: str | None = None


class UserUpdateRequest (BaseModel):
    username: str | None = None
    full_name: str | None = None
    age: int | None = None
    parent_email: str | None = None
