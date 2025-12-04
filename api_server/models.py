# api_server/models.py
from pydantic import BaseModel, Field
from datetime import datetime
from bson import ObjectId

class Product(BaseModel):
    id: str = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    name: str
    price: float
    description: str
    image: str
    slug: str
    sizes: list[str]
    colors: list[str]
    category: str
    meta_keywords: list[str] = [] 

class Review(BaseModel):
    id: str = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    product_id: str
    user_name: str
    rating: int
    comment: str
    created_at: datetime = datetime.utcnow()
