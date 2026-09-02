from typing import Annotated
from fastapi import APIRouter, Path, Depends, HTTPException
from database import supabase, SUPABASE_URL, SUPABASE_KEY
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from schemas.posts import (PostResponse, PostRequest, DeletePostResponse)
from routers.auth import get_current_user_id
from supabase import create_client
router = APIRouter(prefix="/posts", tags=["posts"])
bearer_scheme = HTTPBearer()


@router.post("/create", response_model=PostResponse)
async def create_post(post: PostRequest, auth_id: str = Depends(get_current_user_id),
                      credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)):
    db = create_client(SUPABASE_URL, SUPABASE_KEY)
    db.postgrest.auth(credentials.credentials)
    try:
        response = db.table('posts').insert({
            "user_id": auth_id,
            "content": post.content,
            "image_url": post.image_url,
        }).execute()
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to create post")
    return response.data[0]


@router.get("/list", response_model=list[PostResponse])
async def list_posts():
    # Fetch all posts from the database
    response = (supabase
                .table("posts")
                .select("*, reactions(*)")
                .order("created_at", desc=True)
                .execute())
    posts = response.data
    for post in posts:
        reactions = {}

        for reaction in post["reactions"]:
            reaction_type = reaction["reaction_type"]
            reactions[reaction_type] = reactions.get(reaction_type, 0) + 1

        del post["reactions"]
        post["reactions"] = reactions

    return posts


@router.get("/{post_id}", response_model=PostResponse)
async def get_post(post_id: Annotated[int, Path(ge=1)]):
    # Fetch the post from Supabase using its post ID
    response = (
        supabase
        .table("posts")
        .select("*, reactions(*)")
        .select("*")
        .eq("post_id", post_id)
        .execute()
    )

    # Return an error if the requested post does not exist
    if not response.data:
        raise HTTPException(
            status_code=404,
            detail="Post not found"
        )

    post = response.data[0]
    reactions = {}
    for reaction in post["reactions"]:
        reaction_type = reaction["reaction_type"]
        reactions[reaction_type] = reactions.get(reaction_type, 0) + 1

    del post["reactions"]
    post["reactions"] = reactions
    return post


@router.delete("/{post_id}", response_model=DeletePostResponse)
async def delete_post(
    post_id: Annotated[int, Path(ge=1)],
    auth_id: str = Depends(get_current_user_id),
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
):
    db = create_client(SUPABASE_URL, SUPABASE_KEY)
    db.postgrest.auth(credentials.credentials)

    existing = db.table("posts").select("post_id, user_id").eq("post_id", post_id).execute()
    if not existing.data:
        raise HTTPException(status_code=404, detail="Post not found")
    if existing.data[0]["user_id"] != auth_id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this post")

    db.table("posts").delete().eq("post_id", post_id).execute()
    return {"message": "Post Deleted", "post_id": post_id}
