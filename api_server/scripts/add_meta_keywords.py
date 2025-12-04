from pymongo import MongoClient
from datetime import datetime
import os

MONGO_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("MONGODB_DB", "TEE-TRIBE")
client = MongoClient(MONGO_URI)
db = client[DB_NAME]

# set meta_keywords = [] for docs missing the field
result = db.products.update_many(
    {"meta_keywords": {"$exists": False}},
    {"$set": {"meta_keywords": [], "updatedAt": datetime.utcnow()}}
)
print("Matched:", result.matched_count, "Modified:", result.modified_count)
