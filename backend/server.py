from fastapi import FastAPI, APIRouter, Depends, HTTPException, UploadFile, File
from fastapi.staticfiles import StaticFiles
from starlette.middleware.cors import CORSMiddleware
import logging
import uuid
import os
from pathlib import Path
from datetime import datetime, timezone
from typing import List, Optional
from pydantic import BaseModel, Field

from database import db, client
from auth import hash_password, verify_password, create_token, get_current_user
import seed_data

app = FastAPI(title="SVN Makina API")
api = APIRouter(prefix="/api")

# Uploads directory (persistent)
UPLOAD_DIR = Path(__file__).parent / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# ---------- Helpers ----------
def clean(doc: dict) -> dict:
    if doc:
        doc.pop("_id", None)
    return doc


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


# ---------- Models ----------
class LoginIn(BaseModel):
    username: str
    password: str


class ServiceIn(BaseModel):
    order: int = 0
    icon_key: str = "technical"
    image_url: str = ""
    title_tr: str
    title_en: str = ""
    desc_tr: str = ""
    desc_en: str = ""


class TeamIn(BaseModel):
    order: int = 0
    name: str
    title_tr: str = ""
    title_en: str = ""
    phone: str = ""
    phone_raw: str = ""
    email: str = ""
    avatar: str = ""


class FaqIn(BaseModel):
    order: int = 0
    q_tr: str
    q_en: str = ""
    a_tr: str = ""
    a_en: str = ""


class ServiceRequestIn(BaseModel):
    name: str
    phone: str
    email: Optional[str] = ""
    subject: Optional[str] = ""
    message: str


class SettingsIn(BaseModel):
    brand: str
    phone: str = ""
    phone_raw: str = ""
    whatsapp: str = ""
    email: str = ""
    email2: str = ""
    address_line: str = ""
    map_query: str = ""
    instagram: str = ""
    facebook: str = ""
    linkedin: str = ""
    hero_title_tr: str = ""
    hero_title_en: str = ""
    hero_subtitle_tr: str = ""
    hero_subtitle_en: str = ""
    about_p1_tr: str = ""
    about_p1_en: str = ""
    about_p2_tr: str = ""
    about_p2_en: str = ""
    about_points_tr: List[str] = []
    about_points_en: List[str] = []
    hero_image: str = ""
    about_image: str = ""
    hero_tagline_tr: str = ""
    hero_tagline_en: str = ""
    about_tagline_tr: str = ""
    about_tagline_en: str = ""
    about_title_tr: str = ""
    about_title_en: str = ""
    services_tagline_tr: str = ""
    services_tagline_en: str = ""
    services_title_tr: str = ""
    services_title_en: str = ""
    faq_tagline_tr: str = ""
    faq_tagline_en: str = ""
    faq_title_tr: str = ""
    faq_title_en: str = ""
    feature1_title_tr: str = ""
    feature1_title_en: str = ""
    feature1_desc_tr: str = ""
    feature1_desc_en: str = ""
    feature2_title_tr: str = ""
    feature2_title_en: str = ""
    feature2_desc_tr: str = ""
    feature2_desc_en: str = ""
    feature3_title_tr: str = ""
    feature3_title_en: str = ""
    feature3_desc_tr: str = ""
    feature3_desc_en: str = ""
    footer_about_tr: str = ""
    footer_about_en: str = ""
    maintenance_mode: bool = False
    maintenance_msg_tr: str = ""
    maintenance_msg_en: str = ""


class ChangePasswordIn(BaseModel):
    current_password: str
    new_password: str


class AdminCreateIn(BaseModel):
    username: str
    password: str


class SlideIn(BaseModel):
    order: int = 0
    image: str = ""
    title_tr: str = ""
    title_en: str = ""
    subtitle_tr: str = ""
    subtitle_en: str = ""
    button_text_tr: str = ""
    button_text_en: str = ""
    button_link: str = "/iletisim"
    active: bool = True


class PageIn(BaseModel):
    order: int = 0
    slug: str
    title_tr: str
    title_en: str = ""
    content_tr: str = ""
    content_en: str = ""
    image: str = ""
    show_in_menu: bool = True


# ---------- Auth ----------
@api.post("/auth/login")
async def login(payload: LoginIn):
    user = await db.admins.find_one({"username": payload.username})
    if not user or not verify_password(payload.password, user["password"]):
        raise HTTPException(status_code=401, detail="Kullanıcı adı veya şifre hatalı")
    return {"access_token": create_token(user["username"]), "token_type": "bearer"}


@api.get("/auth/me")
async def me(username: str = Depends(get_current_user)):
    return {"username": username}


@api.post("/auth/change-password")
async def change_password(payload: ChangePasswordIn, username: str = Depends(get_current_user)):
    user = await db.admins.find_one({"username": username})
    if not user or not verify_password(payload.current_password, user["password"]):
        raise HTTPException(status_code=400, detail="Mevcut şifre hatalı")
    if len(payload.new_password) < 4:
        raise HTTPException(status_code=400, detail="Yeni şifre en az 4 karakter olmalı")
    await db.admins.update_one(
        {"username": username},
        {"$set": {"password": hash_password(payload.new_password)}},
    )
    return {"ok": True}


# ---------- Admin user management ----------
@api.get("/admins")
async def list_admins(user: str = Depends(get_current_user)):
    admins = await db.admins.find().to_list(200)
    return [{"username": a["username"]} for a in admins]


@api.post("/admins")
async def create_admin(payload: AdminCreateIn, user: str = Depends(get_current_user)):
    if await db.admins.find_one({"username": payload.username}):
        raise HTTPException(status_code=400, detail="Bu kullanıcı adı zaten var")
    if len(payload.password) < 4:
        raise HTTPException(status_code=400, detail="Şifre en az 4 karakter olmalı")
    await db.admins.insert_one({
        "username": payload.username,
        "password": hash_password(payload.password),
    })
    return {"username": payload.username}


@api.delete("/admins/{username}")
async def delete_admin(username: str, user: str = Depends(get_current_user)):
    if username == user:
        raise HTTPException(status_code=400, detail="Kendi hesabınızı silemezsiniz")
    if await db.admins.count_documents({}) <= 1:
        raise HTTPException(status_code=400, detail="Son yöneticiyi silemezsiniz")
    res = await db.admins.delete_one({"username": username})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Kullanıcı bulunamadı")
    return {"ok": True}


# ---------- File upload ----------
@api.post("/upload")
async def upload_file(file: UploadFile = File(...), user: str = Depends(get_current_user)):
    allowed = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"}
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in allowed:
        raise HTTPException(status_code=400, detail="Sadece resim dosyaları yüklenebilir")
    name = f"{uuid.uuid4().hex}{ext}"
    dest = UPLOAD_DIR / name
    content = await file.read()
    with open(dest, "wb") as f:
        f.write(content)
    return {"url": f"/api/uploads/{name}"}


# ---------- Settings ----------
@api.get("/settings")
async def get_settings():
    doc = await db.settings.find_one({"_key": "site"})
    return clean(doc) if doc else {}


@api.put("/settings")
async def update_settings(payload: SettingsIn, user: str = Depends(get_current_user)):
    data = payload.dict()
    data["_key"] = "site"
    await db.settings.update_one({"_key": "site"}, {"$set": data}, upsert=True)
    doc = await db.settings.find_one({"_key": "site"})
    return clean(doc)


# ---------- Generic CRUD builder ----------
def register_crud(path: str, collection, model):
    @api.get(f"/{path}")
    async def list_items():
        items = await collection.find().sort("order", 1).to_list(500)
        return [clean(i) for i in items]

    @api.post(f"/{path}")
    async def create_item(payload: model, user: str = Depends(get_current_user)):
        doc = payload.dict()
        doc["id"] = str(uuid.uuid4())
        await collection.insert_one(doc)
        return clean(doc)

    @api.put(f"/{path}/{{item_id}}")
    async def update_item(item_id: str, payload: model, user: str = Depends(get_current_user)):
        res = await collection.update_one({"id": item_id}, {"$set": payload.dict()})
        if res.matched_count == 0:
            raise HTTPException(status_code=404, detail="Not found")
        doc = await collection.find_one({"id": item_id})
        return clean(doc)

    @api.delete(f"/{path}/{{item_id}}")
    async def delete_item(item_id: str, user: str = Depends(get_current_user)):
        res = await collection.delete_one({"id": item_id})
        if res.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Not found")
        return {"ok": True}


register_crud("services", db.services, ServiceIn)
register_crud("team", db.team, TeamIn)
register_crud("faqs", db.faqs, FaqIn)
register_crud("slides", db.slides, SlideIn)
register_crud("pages", db.pages, PageIn)


# ---------- Service Requests ----------
@api.post("/service-requests")
async def create_request(payload: ServiceRequestIn):
    doc = payload.dict()
    doc["id"] = str(uuid.uuid4())
    doc["is_read"] = False
    doc["created_at"] = now_iso()
    await db.service_requests.insert_one(doc)
    return clean(doc)


@api.get("/service-requests")
async def list_requests(user: str = Depends(get_current_user)):
    items = await db.service_requests.find().sort("created_at", -1).to_list(1000)
    return [clean(i) for i in items]


@api.patch("/service-requests/{req_id}")
async def mark_read(req_id: str, user: str = Depends(get_current_user)):
    await db.service_requests.update_one({"id": req_id}, {"$set": {"is_read": True}})
    doc = await db.service_requests.find_one({"id": req_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Not found")
    return clean(doc)


@api.delete("/service-requests/{req_id}")
async def delete_request(req_id: str, user: str = Depends(get_current_user)):
    res = await db.service_requests.delete_one({"id": req_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Not found")
    return {"ok": True}


@api.get("/")
async def root():
    return {"message": "SVN Makina API"}


app.include_router(api)

# Serve uploaded files (works via ingress: /api routes to backend)
app.mount("/api/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------- Seed on startup ----------
@app.on_event("startup")
async def seed():
    if not await db.admins.find_one({"username": seed_data.DEFAULT_ADMIN["username"]}):
        await db.admins.insert_one({
            "username": seed_data.DEFAULT_ADMIN["username"],
            "password": hash_password(seed_data.DEFAULT_ADMIN["password"]),
        })
        logger.info("Seeded default admin")
    if not await db.settings.find_one({"_key": "site"}):
        s = dict(seed_data.DEFAULT_SETTINGS)
        s["_key"] = "site"
        await db.settings.insert_one(s)
    else:
        # Add any newly introduced default keys to existing settings (non-destructive)
        existing = await db.settings.find_one({"_key": "site"})
        missing = {k: v for k, v in seed_data.DEFAULT_SETTINGS.items() if k not in existing}
        if missing:
            await db.settings.update_one({"_key": "site"}, {"$set": missing})
            logger.info(f"Added {len(missing)} missing setting keys")
    if await db.services.count_documents({}) == 0:
        for item in seed_data.DEFAULT_SERVICES:
            d = dict(item); d["id"] = str(uuid.uuid4())
            await db.services.insert_one(d)
    if await db.team.count_documents({}) == 0:
        for item in seed_data.DEFAULT_TEAM:
            d = dict(item); d["id"] = str(uuid.uuid4())
            await db.team.insert_one(d)
    if await db.faqs.count_documents({}) == 0:
        for item in seed_data.DEFAULT_FAQS:
            d = dict(item); d["id"] = str(uuid.uuid4())
            await db.faqs.insert_one(d)
    if await db.slides.count_documents({}) == 0:
        for item in seed_data.DEFAULT_SLIDES:
            d = dict(item); d["id"] = str(uuid.uuid4())
            await db.slides.insert_one(d)
    if await db.pages.count_documents({}) == 0:
        for item in seed_data.DEFAULT_PAGES:
            d = dict(item); d["id"] = str(uuid.uuid4())
            await db.pages.insert_one(d)
    logger.info("Seed check complete")


@app.on_event("shutdown")
async def shutdown_db():
    client.close()
