from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
from enum import Enum

app = FastAPI(title="Speedlab API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins in development
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# GLOBAL STORE
STORE = []

# Models
class Device(str, Enum):
    IPHONE_12 = "iphone-12"


class Task(str, Enum):
    IMG_CLASSIFICATION = "img-classification"
    IMG_SEGMENTATION = "img-segemntation"
    IMG_DEPTH_ESTIMATION = "img-depth_estimation"
    IMG_OBJECT_DETECTION = "img-object-detection"


class Status(str, Enum):
    PENDING = "pending"
    COMPLETE = "complete"
    ERROR = "error"

class RequestForm(BaseModel):
    device: Device
    task: Task
    data: str

class ResponseForm(BaseModel):
    model_architecture: str
    experiment_id: int

# Routes
@app.get("/")
async def root():
    return {"message": "Welcome to Hackathon API"}

@app.post("/request_form")
async def request_form(req: RequestForm) -> ResponseForm:
    global STORE
    STORE.append({"reuqest": req, "status":"pending"})
    print(STORE)
    return ResponseForm(
        model_architecture="|nor_conv_3x3~0|+|nor_conv_3x3~0|nor_conv_3x3~1|+|skip_connect~0|nor_conv_3x3~1|nor_conv_3x3~2|",
        experiment_id=len(STORE)-1
    )

@app.get("/experiment/{experiment_id}")
async def get_experiment(experiment_id: int):
    return STORE[experiment_id]

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
