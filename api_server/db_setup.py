# api_server/db_setup.py
import json
import pymongo
from datetime import datetime
from pathlib import Path

MONGO_URI = "mongodb://localhost:27017"
DB_NAME = "TEE-TRIBE"

client = pymongo.MongoClient(MONGO_URI)
db = client[DB_NAME]

# --- Create collection with basic validation if missing
product_schema = {
    "$jsonSchema": {
        "bsonType": "object",
        "required": ["name", "slug", "category", "price", "image"],
        "properties": {
            "name": {"bsonType": "string"},
            "slug": {"bsonType": "string"},
            "category": {"bsonType": "string"},
            "price": {"bsonType": "number", "minimum": 0},
            "image": {"bsonType": "string"},
            "description": {"bsonType": "string"},
            "sizes": {"bsonType": "array", "items": {"bsonType": "string"}},
            "colors": {"bsonType": "array", "items": {"bsonType": "string"}},
            "frontendId": {"bsonType": "string"},
            "createdAt": {"bsonType": "date"},
            "updatedAt": {"bsonType": "date"}
        }
    }
}

if "products" not in db.list_collection_names():
    db.create_collection("products", validator={"$jsonSchema": product_schema["$jsonSchema"]})
    print("✅ Created 'products' collection with validation")
else:
    print("ℹ️ 'products' collection exists")

# Indexes
db.products.create_index("slug", unique=True)
db.products.create_index("category")
db.products.create_index("price")

# --- Load products.json next to this file
json_path = Path(__file__).with_name("products.json")
if not json_path.exists():
    raise FileNotFoundError(f"Missing {json_path}. Put products.json beside db_setup.py.")

with open(json_path, "r", encoding="utf-8") as f:
    data = json.load(f)

for p in data:
    p.setdefault("createdAt", datetime.utcnow())
    p.setdefault("updatedAt", datetime.utcnow())
    p.setdefault("meta_keywords", []) 

if db.products.count_documents({}) == 0:
    db.products.insert_many(data)
    print(f"🛍️ Inserted {len(data)} products")
else:
    print("ℹ️ Products already seeded, skipping")

print("🎉 DB ready at mongodb://localhost:27017/TEE-TRIBE")

# --- Create 'carts' collection if missing
cart_schema = {
    "$jsonSchema": {
        "bsonType": "object",
        "required": ["user_id", "items"],
        "properties": {
            "user_id": {"bsonType": "string"},
            "items": {
                "bsonType": "array",
                "items": {
                    "bsonType": "object",
                    "required": ["id", "name", "price", "size", "quantity", "image"],
                    "properties": {
                        "id": {"bsonType": "string"},
                        "name": {"bsonType": "string"},
                        "price": {"bsonType": "number"},
                        "size": {"bsonType": "string"},
                        "quantity": {"bsonType": "number"},
                        "image": {"bsonType": "string"},
                        "meta_keywords": {"bsonType": "array", "items": {"bsonType": "string"}}

                    }
                }
            },
            "updated_at": {"bsonType": "date"}
        }
    }
}

if "carts" not in db.list_collection_names():
    db.create_collection("carts", validator={"$jsonSchema": cart_schema["$jsonSchema"]})
    print("✅ Created 'carts' collection")
else:
    print("ℹ️ 'carts' collection exists")
