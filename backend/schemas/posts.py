from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class ReactionResponse(BaseModel):
    reaction_id: int
    post_id: int
    reaction_type: str
    user_id: UUID


class PostResponse (BaseModel):
    post_id: int
    user_id: UUID
    content: str | None = None
    image_url: str | None = None
    created_at: datetime
    reactions: dict[str, int]


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


class ReactionRequest(BaseModel):
    reaction_type: str
