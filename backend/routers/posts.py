from typing import Annotated
from fastapi import APIRouter, Path, Depends, HTTPException
from database import supabase, SUPABASE_URL, SUPABASE_KEY
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from schemas.posts import (PostResponse, PostRequest,
                           DeletePostResponse, CommentRequest)
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
    response = supabase.table("posts").select("*").execute()
    return response.data


@router.get("/{post_id}", response_model=PostResponse)
async def get_post(post_id: Annotated[int, Path(ge=1)]):
    # Fetch the post from Supabase using its post ID
    response = (
        supabase
        .table("posts")
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

    return response.data[0]


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


# comments
@router.get("/{post_id}/comments", )
async def list_comments(post_id: Annotated[int, Path(ge=1)]):
    response = (
        supabase
        .table("comments")
        .select("*")
        .eq("post_id", post_id)
        .order("created_at", desc=False)
        .execute()
    )
    return response.data


@router.post("/{post_id}/comments", )
async def create_comment(post_id: Annotated[int, Path(ge=1)],
                         comment: CommentRequest,
                         auth_id=Depends(get_current_user_id),
                         credentials: HTTPAuthorizationCredentials =
                         Depends(bearer_scheme)):

    db = create_client(SUPABASE_URL, SUPABASE_KEY)
    db.postgrest.auth(credentials.credentials)
    try:
        response = db.table('comments').insert({
            "user_id": auth_id,
            "post_id": post_id,
            "comment_text": comment.comment_text
        }).execute()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create comment \
                            {e}")
    return response.data[0]


@router.patch("/comments/{comment_id}", )
async def update_comment(
    comment_id: Annotated[int, Path(ge=1)],
    comment: CommentRequest,
    auth_id=Depends(get_current_user_id),
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)
):
    db = create_client(SUPABASE_URL, SUPABASE_KEY)
    db.postgrest.auth(credentials.credentials)

    try:
        response = (
            db.table("comments")
            .update({
                "comment_text": comment.comment_text
            })
            .eq("comment_id", comment_id)
            .eq("user_id", auth_id)
            .execute()
        )

        if not response.data:
            raise HTTPException(
                status_code=404,
                detail="Comment not found"
            )

        return response.data[0]

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to update comment: {e}"
        )


@router.delete("/comments/{comment_id}")
async def delete_comment(
    comment_id: Annotated[int, Path(ge=1)],
    auth_id=Depends(get_current_user_id),
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)
):
    db = create_client(SUPABASE_URL, SUPABASE_KEY)
    db.postgrest.auth(credentials.credentials)

    try:
        response = (
            db.table("comments")
            .delete()
            .eq("comment_id", comment_id)
            .eq("user_id", auth_id)
            .execute()
        )

        if not response.data:
            raise HTTPException(
                status_code=404,
                detail="Comment not found"
            )

        return {
            "message": "Comment deleted successfully"
        }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to delete comment: {e}"
        )
