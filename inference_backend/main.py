import os
import logging
from fastapi import FastAPI
from fastapi import WebSocket
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from routers.ws_router_chat import websocket_chat_endpoint
from search.search import SearchClient



BASE_DIR = os.path.dirname(os.path.abspath(__file__))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to match your desired origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
os.path.join(BASE_DIR, "build")

app.mount(
    "/static", StaticFiles(directory=(os.path.join(BASE_DIR, "build/static"))), name="static"
)

@app.get("/")
async def read_root():
    return FileResponse(os.path.join(BASE_DIR, "build/index.html"))


@app.websocket("/ws/generate_chat")
async def websocket_route(websocket: WebSocket):
    await websocket_chat_endpoint(websocket)

# health check
@app.get("/api/health")
async def health():
    return {"status": "ok"}

@app.post("/api/search")
async def search():
    return SearchClient("test")