from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import (
    auth,
    chatbot,
    communities,
    engagement,
    parent,
    posts,
    streaks_rewards,
    users,
)

app = FastAPI(title="Kids Creative Platform API", version="v1")

# Allow requests from React dev server
origins = [
    "http://localhost:3000",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all routers under /api/v1
for router_module in [
    auth,
    users,
    posts,
    engagement,
    streaks_rewards,
    communities,
    chatbot,
    parent,
]:
    app.include_router(router_module.router, prefix="/api/v1")
