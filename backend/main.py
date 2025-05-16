import os
from pathlib import Path

from fastapi import FastAPI, UploadFile, File
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

BASE_DIR = Path(__file__).resolve().parent.parent   # repo root
HOME_DIR = BASE_DIR / "frontend-home"
UPL_DIR  = BASE_DIR / "frontend-upload"

app = FastAPI()

# ---------  API routes  ---------
@app.get("/")
async def home():
    return FileResponse(HOME_DIR / "index.html")

@app.post("/upload")
async def upload(file: UploadFile = File(...)):
    # do something with the file if you like
    return FileResponse(UPL_DIR / "index.html")

# ---------  static mounts  ---------
app.mount("/upload-static", StaticFiles(directory=UPL_DIR),  name="upload-static")
app.mount("/",              StaticFiles(directory=HOME_DIR, html=True), name="static-home")

