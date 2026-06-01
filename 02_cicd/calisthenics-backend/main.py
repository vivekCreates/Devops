from fastapi import FastAPI
from data import workouts

app = FastAPI()

@app.get("/")
def home():
    return {
        "message":"Welcome to the Calisthenics Workout plan"
    }

@app.get("/workouts")
def get_workout(type: str = "push", level: str = "basic"):

    if type not in ["push", "pull", "legs"]:
        return {
            "message": "Please provide type from these",
            type: ["push", "pull", "legs"],
        }   
    elif level not in ["basic", "intermediate", "advanced"]:
        return {
            "message": "Please provide level from these",
            type: ["basic", "intermediate", "advanced"],
        }
    else:
        return workouts[type][level]
