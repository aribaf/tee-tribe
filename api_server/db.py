from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

# MongoDB connection URI
MONGO_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("MONGODB_DB", "TEE-TRIBE")

client = MongoClient(MONGO_URI)
db = client[DB_NAME]

# Collections
products_col = db["products"]
# add after products_col defined
# creates a text index on meta_keywords for faster search (optional)
try:
    db.products.create_index([("meta_keywords", "text")], default_language="none")
except Exception:
    pass
orders_col = db["orders"]
users_col = db["users"]
