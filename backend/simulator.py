import requests
import random
import time

API_URL = "http://127.0.0.1:8000/api/data"
PLANT_ID = 1  # tumne jo plant create kiya tha uska id

def generate_reading():
    return {
        "plant_id": PLANT_ID,
        "frequency": round(random.uniform(49.8, 50.2), 2),
        "voltage": round(random.uniform(215.0, 225.0), 2),
        "power": round(random.uniform(90.0, 120.0), 2),
    }

if __name__ == "__main__":
    print("Simulator started... sending data every 2 seconds. Ctrl+C to stop.")
    while True:
        data = generate_reading()
        try:
            response = requests.post(API_URL, json=data)
            print(f"Sent: {data} | Status: {response.status_code}")
        except Exception as e:
            print(f"Error sending data: {e}")
        time.sleep(2)