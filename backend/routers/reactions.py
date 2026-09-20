from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from fastapi import APIRouter, Path, Depends, HTTPException
from typing import Annotated
from schemas.posts import ReactionRequest
from routers.auth import get_current_user_id
from supabase import create_client
from database import SUPABASE_KEY, SUPABASE_URL

router = APIRouter(prefix="/reaction", tags=["reaction"])
bearer_scheme = HTTPBearer()


@router.post("/{post_id}")
async def react_to_post(
    post_id: Annotated[int, Path(ge=1)],
    reaction: ReactionRequest,
    auth_id=Depends(get_current_user_id),
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)
):
    db = create_client(SUPABASE_URL, SUPABASE_KEY)
    db.postgrest.auth(credentials.credentials)

    try:
        # Check whether user already reacted
        existing = (
            db.table("reactions")
            .select("*")
            .eq("post_id", post_id)
            .eq("user_id", auth_id)
            .execute()
        )

        if existing.data:
            current_reaction = existing.data[0]

            # Same reaction -> remove it
            if current_reaction["reaction_type"] == reaction.reaction_type:
                response = (
                    db.table("reactions")
                    .delete()
                    .eq("reaction_id", current_reaction["reaction_id"])
                    .execute()
                )

                return {
                    "message": "Reaction removed"
                }

            # Different reaction -> change it
            response = (
                db.table("reactions")
                .update({
                    "reaction_type": reaction.reaction_type
                })
                .eq("reaction_id", current_reaction["reaction_id"])
                .execute()
            )

            return response.data[0]

        # No existing reaction -> create one
        response = (
            db.table("reactions")
            .insert({
                "post_id": post_id,
                "user_id": auth_id,
                "reaction_type": reaction.reaction_type
            })
            .execute()
        )

        return response.data[0]

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to react to post: {e}"
        )


@router.get("/{post_id}")
async def get_post_reactions(
    post_id: Annotated[int, Path(ge=1)],
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)
):
    db = create_client(SUPABASE_URL, SUPABASE_KEY)
    db.postgrest.auth(credentials.credentials)

    try:
        response = db.rpc(
            "get_post_reactions",
            {
                "p_post_id": post_id
            }
        ).execute()

        return response.data

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch reactions: {e}"
        )


@router.delete("/{reaction_id}")
async def remove_reaction(
    reaction_id: Annotated[int, Path(ge=1)],
    auth_id=Depends(get_current_user_id),
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)
):
    db = create_client(SUPABASE_URL, SUPABASE_KEY)
    db.postgrest.auth(credentials.credentials)

    try:
        response = (
            db.table("reactions")
            .delete()
            .eq("reaction_id", reaction_id)
            .eq("user_id", auth_id)
            .execute()
        )

        if not response.data:
            raise HTTPException(
                status_code=404,
                detail="Reaction not found"
            )

        return {
            "message": "Reaction removed successfully"
        }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to delete reaction: {e}"
        )
