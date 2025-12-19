# main.py — top section (replace the imports + env loading block)
import os
import json
from datetime import datetime
from typing import Optional, List

from dotenv import load_dotenv
from fastapi import FastAPI, Query, Body, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from bson import ObjectId
from pymongo import MongoClient
from groq import Groq
from dotenv import load_dotenv
load_dotenv()   # ✅ FIRST

import stripe
import os

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:8000")

if not stripe.api_key:
    print("❌ STRIPE_SECRET_KEY is missing")

# your local models
from models import Product, Review  # adjust if unused

# load .env (dev)
load_dotenv()

# Read the GROQ key correctly from environment
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    print("WARNING: GROQ_API_KEY not found in environment. Set it in .env or system env to enable /ai/enhance.")

# --- Setup Mongo connection
mongo_client = MongoClient("mongodb://localhost:27017")
db = mongo_client["TEE-TRIBE"]
products_col = db["products"]
reviews_col = db["reviews"]
carts_col = db["carts"]
categories_col = db["categories"]
customers_col = db["customers"]
orders_col = db["orders"]

app = FastAPI(title="Swift Tribe Shop API")

# CORS: explicitly list dev frontend origins (do NOT include "*" if allow_credentials=True)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def serialize(doc):
    """Converts MongoDB document to a JSON-safe dictionary."""
    doc["_id"] = str(doc.get("_id"))
    return doc


from fastapi import status

@app.post("/ai/enhance")
def ai_enhance_debug(payload: dict = Body(...)):
    """
    AI enhance route (dev). Uses GROQ_MODEL env or falls back to openai/gpt-oss-20b.
    """
    try:
        # Basic validation
        if not payload.get("name"):
            raise ValueError("Missing 'name' in payload")

        groq_key = os.getenv("GROQ_API_KEY")
        if not groq_key:
            raise RuntimeError("GROQ_API_KEY not set in environment")

        groq_model = os.getenv("GROQ_MODEL", "openai/gpt-oss-20b")  # recommended fallback

        # Create Groq client
        groq_client = Groq(api_key=groq_key)

        # Prompt (keep short; model must return strict JSON)
        prompt = f"""
You are an e-commerce SEO expert.
Return ONLY JSON with two fields:
{{"enhanced_description":"...", "meta_keywords":["...","..."]}}

Product:
Name: {payload.get("name")}
Category: {payload.get("category")}
Description: {payload.get("description")}
Price: {payload.get("price")}
Sizes: {payload.get("sizes")}
Colors: {payload.get("colors")}

Rules:
- enhanced_description: 120-200 words
- meta_keywords: 10-15 long-tail keywords
- DO NOT output anything outside the JSON object
"""

        # Call Groq safely and handle model errors
        try:
            chat = groq_client.chat.completions.create(
                model=groq_model,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7,
                max_tokens=700,
            )
        except Exception as e:
            # Log server side and return friendly error to client
            import traceback
            traceback.print_exc()
            raise HTTPException(status_code=400, detail=f"Groq model error: {str(e)}. Check GROQ_MODEL and GROQ_API_KEY.")

        # Extract raw text
        raw = getattr(chat.choices[0].message, "content", "") or ""
        json_start = raw.find("{")
        if json_start == -1:
            raise HTTPException(status_code=500, detail=f"AI did not return JSON. Raw start: {raw[:300]}")

        raw_json = raw[json_start:]
        try:
            parsed = json.loads(raw_json)
        except Exception:
            # try trimming trailing garbage
            last = raw_json.rfind("}")
            if last == -1:
                raise HTTPException(status_code=500, detail="Failed to parse AI JSON output")
            parsed = json.loads(raw_json[: last + 1])

        if "enhanced_description" not in parsed or "meta_keywords" not in parsed:
            raise HTTPException(status_code=500, detail=f"AI JSON missing required fields. Parsed keys: {list(parsed.keys())}")

        return parsed

    except HTTPException:
        raise
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")

@app.post("/ai/enhance")
def ai_enhance_debug(payload: dict = Body(...)):
    import traceback
    try:
        if not payload.get("name"):
            raise ValueError("Missing 'name' in payload")

        groq_key = os.getenv("GROQ_API_KEY")
        if not groq_key:
            raise RuntimeError("GROQ_API_KEY not set in environment")

        groq_model = os.getenv("GROQ_MODEL", "openai/gpt-oss-20b")
        client = Groq(api_key=groq_key)

        prompt = f"""
You are an e-commerce SEO expert.
Return ONLY JSON:
{{"enhanced_description":"...","meta_keywords":["..."]}}
Product:
Name: {payload.get("name")}
Category: {payload.get("category")}
Description: {payload.get("description")}
Price: {payload.get("price")}
Sizes: {payload.get("sizes")}
Colors: {payload.get("colors")}
Rules: enhanced_description 120-200 words; meta_keywords 10-15 phrases.
"""

        try:
            resp = client.chat.completions.create(
                model=groq_model,
                messages=[{"role":"user","content":prompt}],
                temperature=0.7,
                max_tokens=700,
            )
        except Exception as e:
            # print full trace to console and include any response body if available
            traceback.print_exc()
            extra = ""
            try:
                if hasattr(e, "response") and getattr(e.response, "text", None):
                    extra = f" | response_text: {e.response.text}"
            except Exception:
                pass
            raise HTTPException(status_code=500, detail=f"Groq call failed: {str(e)}{extra}")

        # extract message content
        raw = ""
        try:
            raw = getattr(resp.choices[0].message, "content", "") or ""
        except Exception:
            raw = str(resp)

        # ensure JSON substring
        i = raw.find("{")
        if i == -1:
            raise HTTPException(status_code=500, detail=f"AI returned no JSON. Raw start: {raw[:300]}")

        raw_json = raw[i:]
        try:
            parsed = json.loads(raw_json)
        except Exception:
            last = raw_json.rfind("}")
            if last == -1:
                raise HTTPException(status_code=500, detail="Failed to parse AI JSON output")
            parsed = json.loads(raw_json[: last + 1])

        if "enhanced_description" not in parsed or "meta_keywords" not in parsed:
            raise HTTPException(status_code=500, detail=f"AI JSON missing keys. Keys: {list(parsed.keys())}")

        return parsed

    except HTTPException:
        raise
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")


@app.get("/health")
def health():
    return {"ok": True}

# --- PRODUCTS ---
@app.get("/products")
def get_products(
    categories: Optional[List[str]] = Query(default=None),
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    q: Optional[str] = None,
    page: int = 1,
    limit: int = 120,
):
    query = {}
    if categories:
        query["category"] = {"$in": categories}
    if min_price is not None or max_price is not None:
        rng = {}
        if min_price is not None:
            rng["$gte"] = float(min_price)
        if max_price is not None:
            rng["$lte"] = float(max_price)
        query["price"] = rng
    if q:
        query["$or"] = [
            {"name": {"$regex": q, "$options": "i"}},
            {"description": {"$regex": q, "$options": "i"}},
            {"category": {"$regex": q, "$options": "i"}},
            {"meta_keywords": {"$elemMatch": {"$regex": q, "$options": "i"}}},  # match keywords
    
        ]

    skip = max(0, (page - 1) * limit)
    total = products_col.count_documents(query)
    items = [serialize(x) for x in products_col.find(query).skip(skip).limit(limit)]
    return {"items": items, "total": total, "page": page, "limit": limit}


@app.get("/products/slug/{slug}")
def get_by_slug(slug: str):
    doc = products_col.find_one({"slug": {"$regex": f"^{slug}$", "$options": "i"}})
    if not doc:
        raise HTTPException(status_code=404, detail="Product not found")
    return serialize(doc)

# --- REVIEWS ---
@app.get("/reviews/{product_id}")
def get_reviews(product_id: str):
    items = [serialize(x) for x in reviews_col.find({"product_id": product_id})]
    return {"reviews": items}


@app.post("/reviews")
def add_review(review: dict): # Changed Review to dict as model is not provided
    # Assuming the Review model structure
    review["created_at"] = datetime.utcnow()
    reviews_col.insert_one(review)
    return {"message": "Review added successfully!"}


@app.delete("/reviews/{review_id}")
def delete_review(review_id: str):
    result = reviews_col.delete_one({"_id": ObjectId(review_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Review not found")
    return {"message": "Review deleted"}
    
# ----------------------------------
# --- CONSOLIDATED CART ENDPOINTS ---
# ----------------------------------

@app.get("/cart/{user_id}")
def get_cart(user_id: str):
    """Fetch user's cart"""
    cart = carts_col.find_one({"user_id": user_id})
    if not cart:
        return {"user_id": user_id, "items": []}
    # Ensure items are always an array, even if the user manually messed up data
    if "items" not in cart or not isinstance(cart["items"], list):
        cart["items"] = []
        
    cart["_id"] = str(cart["_id"])
    return cart


@app.post("/cart/{user_id}")
def save_cart(user_id: str, data: dict = Body(...)):
    """
    Save or update a user's cart (used for full cart synchronization).
    The frontend sends the entire list of items.
    """
    items = data.get("items", [])
    
    # Optional: Basic server-side cleanup of data types if needed (e.g., ensure prices are float)
    sanitized_items = []
    for item in items:
        # FastAPI will handle JSON decoding, but this ensures price is float in MongoDB
        try:
            item['price'] = float(item['price'])
        except (ValueError, TypeError):
            item['price'] = 0.0 # Default to 0 if invalid
        
        try:
            item['quantity'] = int(item['quantity'])
        except (ValueError, TypeError):
            item['quantity'] = 1 # Default to 1 if invalid
            
        sanitized_items.append(item)
        
    carts_col.update_one(
        {"user_id": user_id},
        {"$set": {"items": sanitized_items, "updated_at": datetime.utcnow()}},
        upsert=True,
    )
    return {"message": "Cart saved", "count": len(items)}


@app.delete("/cart/{user_id}")
def clear_cart(user_id: str):
    """Clear a user's cart"""
    result = carts_col.delete_one({"user_id": user_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Cart not found")
    return {"message": "Cart cleared"}
    
# ----------------------------------
# --- ORDERS ---
# ----------------------------------

@app.post("/orders/{user_id}")
def place_order(user_id: str, data: dict = Body(...)):
    """Save the order in MongoDB and clear the cart."""
    order = {
        "user_id": user_id,
        "items": data.get("items", []),
        "total": data.get("total", 0),
        "contact": data.get("contact", {}),
        "shipping": data.get("shipping", {}),
        "payment_method": data.get("payment_method", "COD"),
        "status": "Pending",
        "created_at": datetime.utcnow(),
    }

    result = db["orders"].insert_one(order)
    db["carts"].delete_one({"user_id": user_id}) # Clear cart after order

    return {
        "message": "Order placed successfully!",
        "order_id": str(result.inserted_id),
        "status": "Pending"
    }
    
@app.get("/orders/{user_id}")
def get_orders(user_id: str):
    orders = list(db["orders"].find({"user_id": user_id}))
    for o in orders:
        o["_id"] = str(o["_id"])
    return {"orders": orders}

# --- ADMIN ENDPOINTS (Product, Order, Customer, Category CRUD) ---
@app.post("/products")
def add_product(product: dict = Body(...)):
    if products_col.find_one({"slug": product["slug"]}):
        raise HTTPException(status_code=400, detail="Slug already exists")

    product["price"] = float(product.get("price", 0))
    product["meta_keywords"] = product.get("meta_keywords", [])
    product["createdAt"] = datetime.utcnow()
    product["updatedAt"] = datetime.utcnow()
    result = products_col.insert_one(product)
    product["_id"] = str(result.inserted_id)

    if product.get("category"):
        if not db["categories"].find_one({"name": product["category"]}):
            db["categories"].insert_one({
                "name": product["category"],
                "status": "Active",
                "createdAt": datetime.utcnow()
            })

    return {"success": True, "message": "✅ Product added successfully!", "product": product}

@app.put("/products/{product_id}")
def update_product(product_id: str, product: dict = Body(...)):
    try:
        # 1) Safety: never allow _id to be changed from the client
        if "_id" in product:
            product.pop("_id")

        # 2) Remove any client-supplied date fields (they must be server-controlled)
        for date_field in ("createdAt", "updatedAt", "created_at", "updated_at"):
            if date_field in product:
                product.pop(date_field, None)

        # 3) Normalize meta_keywords: accept comma string or array
        if "meta_keywords" in product and not isinstance(product["meta_keywords"], list):
            if isinstance(product["meta_keywords"], str):
                product["meta_keywords"] = [s.strip() for s in product["meta_keywords"].split(",") if s.strip()]
            else:
                # fallback: coerce to list
                product["meta_keywords"] = list(product.get("meta_keywords") or [])

        # 4) Optionally ensure price is a float
        if "price" in product:
            try:
                product["price"] = float(product["price"])
            except (ValueError, TypeError):
                product["price"] = 0.0

        # 5) Set updatedAt on server as a proper datetime (BSON date)
        product["updatedAt"] = datetime.utcnow()

        # 6) Slug uniqueness check (if slug provided)
        if "slug" in product:
            existing = products_col.find_one(
                {"slug": product["slug"], "_id": {"$ne": ObjectId(product_id)}}
            )
            if existing:
                raise HTTPException(status_code=400, detail="Slug already exists")

        # 7) Apply update
        result = products_col.update_one({"_id": ObjectId(product_id)}, {"$set": product})
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Product not found")

        return {"success": True, "message": "Product updated successfully"}

    except Exception as e:
        # return a useful error for debugging
        raise HTTPException(status_code=500, detail=f"Update failed: {str(e)}")


@app.delete("/products/{product_id}")
def delete_product(product_id: str):
    result = products_col.delete_one({"_id": ObjectId(product_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product deleted successfully"}

@app.get("/admin/orders")
def get_all_orders():
    orders = list(db["orders"].find())
    for o in orders:
        o["_id"] = str(o["_id"])
    return {"orders": orders}

@app.put("/admin/orders/{order_id}")
def update_order_status(order_id: str, data: dict = Body(...)):
    result = db["orders"].update_one({"_id": ObjectId(order_id)}, {"$set": {"status": data.get("status")}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Order not found")
    return {"message": "Order status updated successfully"}

@app.delete("/admin/orders/{order_id}")
def delete_order(order_id: str):
    result = db["orders"].delete_one({"_id": ObjectId(order_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Order not found")
    return {"message": "Order deleted successfully"}

@app.get("/orders")
def get_all_orders_summary():
    try:
        orders = list(orders_col.find())

        for o in orders:
            o["_id"] = str(o["_id"])
            o["user_id"] = o.get("user_id", "Unknown")
            o["status"] = o.get("status", "Pending")
            o["total"] = float(o.get("total", 0))
            o["created_at"] = (
                o["created_at"].isoformat()
                if isinstance(o.get("created_at"), datetime)
                else str(o.get("created_at", ""))
            )

        total_revenue = sum(o.get("total", 0) for o in orders)
        total_orders = len(orders)

        return {
            "orders": orders,
            "summary": {
                "total_revenue": total_revenue,
                "total_orders": total_orders
            },
        }

    except Exception as e:
        print("❌ Error fetching orders:", e)
        raise HTTPException(status_code=500, detail=f"Server Error: {str(e)}")

# --- CATEGORY CRUD ---
@app.get("/categories")
def get_categories():
    cats = list(categories_col.find())

    clean_categories = []
    for c in cats:
        clean_category = {
            "_id": str(c.get("_id")),
            "name": c.get("name") or c.get("Name") or "Unnamed Category",
            "status": c.get("status", "Active"),
            "createdAt": c.get("createdAt"),
        }
        clean_category["productCount"] = db["products"].count_documents({
            "category": clean_category["name"]
        })

        clean_categories.append(clean_category)

    return {"categories": clean_categories}

@app.post("/categories")
def add_category(data: dict = Body(...)):
    if not data.get("name"):
        raise HTTPException(status_code=400, detail="Category name is required")

    if categories_col.find_one({"name": {"$regex": f"^{data['name']}$", "$options": "i"}}):
        raise HTTPException(status_code=400, detail="Category already exists")

    data["status"] = data.get("status", "Active")
    data["createdAt"] = datetime.utcnow()
    result = categories_col.insert_one(data)
    data["_id"] = str(result.inserted_id)
    return {"message": "✅ Category added successfully!", "category": data}


@app.put("/categories/{category_id}")
def update_category(category_id: str, data: dict = Body(...)):
    result = categories_col.update_one({"_id": ObjectId(category_id)}, {"$set": data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Category not found")
    return {"message": "Category updated successfully"}


@app.delete("/categories/{category_id}")
def delete_category(category_id: str):
    result = categories_col.delete_one({"_id": ObjectId(category_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Category not found")
    return {"message": "Category deleted successfully"}

# --- CUSTOMERS CRUD ---

@app.get("/customers")
def get_customers():
    try:
        customers = list(customers_col.find())

        if not customers:
            pipeline = [
                {
                    "$group": {
                        "_id": "$contact.email", # Assuming email is inside contact object for new orders
                        "full_name": {"$first": "$shipping.name"}, # Assuming name is inside shipping
                        "created_at": {"$min": "$created_at"},
                        "total_orders": {"$sum": 1},
                    }
                },
                {"$sort": {"created_at": -1}},
            ]
            derived = list(orders_col.aggregate(pipeline))

            for c in derived:
                email = c.get("_id")
                if not email:
                    continue # Skip orders without an email

                new_customer = {
                    "full_name": c.get("full_name", "Unknown"),
                    "email": email,
                    "created_at": c.get("created_at") or datetime.utcnow(),
                    "total_orders": c.get("total_orders", 0),
                }
                customers_col.insert_one(new_customer)

            customers = list(customers_col.find())

        for c in customers:
            c["_id"] = str(c.get("_id", ""))
            c["email"] = c.get("email", "N/A")
            c["full_name"] = c.get("full_name", "Unknown")

            created_at = c.get("created_at")
            if isinstance(created_at, datetime):
                c["created_at"] = created_at.isoformat()
            else:
                try:
                    c["created_at"] = datetime.fromisoformat(str(created_at)).isoformat()
                except Exception:
                    c["created_at"] = datetime.utcnow().isoformat()

            c["total_orders"] = int(c.get("total_orders", 0))

        return {"customers": customers}

    except Exception as e:
        print("❌ Error fetching customers:", e)
        raise HTTPException(status_code=500, detail=f"Server Error: {str(e)}")

@app.get("/dashboard/products")
def get_products_summary():
    total = products_col.count_documents({})
    return {"total_products": total}

@app.post("/payments/stripe/create-session")
def create_stripe_session(data: dict = Body(...)):
    try:
        items = data.get("items", [])
        user_id = data.get("user_id", "guest_user")

        if not items:
            raise HTTPException(status_code=400, detail="Cart is empty")
        USD_RATE = 280 
        line_items = []
        for item in items:
            line_items.append({
                "price_data": {
                    "currency": "usd",
                    "product_data": {
                        "name": item["name"],
                    },
                    "unit_amount": int((item["price"] / USD_RATE) * 100),  # Stripe uses cents
                },
                "quantity": item["quantity"],
            })

        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            mode="payment",
            line_items=line_items,
            success_url=f"{FRONTEND_URL}/payment-success?session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=f"{FRONTEND_URL}/checkout",
            metadata={
                "user_id": user_id,
            }
        )

        return {"url": session.url}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

