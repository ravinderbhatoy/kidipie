from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class PostResponse (BaseModel):
    post_id: int
    user_id: UUID
    content: str | None = None
    image_url: str | None = None
    created_at: datetime


class PostRequest (BaseModel):
    content: str
    image_url: str | None = None


class DeletePostResponse (BaseModel):
    message: str
    post_id: int


class PostStatusResponse (BaseModel):
    post_id: int
    status: str


class CommentRequest(BaseModel):
    post_id: int
    user_id: UUID
    comment_text: str
