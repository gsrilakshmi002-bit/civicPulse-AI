import os
import random
from datetime import datetime
from typing import Optional, List
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from database import (
    init_db,
    get_all_complaints,
    get_complaint_by_id,
    insert_complaint,
    update_complaint_status,
    update_complaint_priority,
    merge_duplicates
)
from seed_data import reset_all_data
from ai_service import (
    classify_complaint,
    find_potential_duplicates,
    query_assistant,
    DEPARTMENTS
)
from analytics_service import (
    get_analytics_summary,
    get_predictive_analytics,
    get_environmental_module
)
from models import (
    ComplaintCreate,
    StatusUpdate,
    PriorityOverride,
    DuplicateMergeRequest,
    AIClassificationRequest,
    AssistantQueryRequest
)

# Initialize Database
init_db()

app = FastAPI(
    title="CivicAI — Smart Community Intelligence Platform API",
    description="Backend API powering civic complaint reporting, AI priority detection, duplicate detection, predictive analytics, and environmental intelligence.",
    version="1.0.0"
)

# Allow Cross-Origin Requests from frontend dev servers
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "platform": "CivicAI — Smart Community Intelligence Platform",
        "tagline": "Report. Predict. Resolve. Transform.",
        "status": "online",
        "version": "1.0.0",
        "docs_url": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "civicai-backend"}


@app.get("/api/complaints")
def list_complaints(
    category: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    priority_level: Optional[str] = Query(None),
    ward: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    sort_by: str = Query("created_at"),
    sort_order: str = Query("desc")
):
    return get_all_complaints(
        category=category,
        status=status,
        priority_level=priority_level,
        ward=ward,
        search=search,
        sort_by=sort_by,
        sort_order=sort_order
    )

@app.get("/api/complaints/{complaint_id}")
def get_complaint(complaint_id: str):
    complaint = get_complaint_by_id(complaint_id)
    if not complaint:
        raise HTTPException(status_code=404, detail=f"Complaint with ID {complaint_id} not found.")
    return complaint

@app.post("/api/complaints")
def create_complaint(payload: ComplaintCreate):
    # Run AI Classification & Priority Engine
    ai_result = classify_complaint(
        title=payload.title,
        description=payload.description,
        locality=payload.locality,
        ward=payload.ward
    )

    assigned_cat = payload.category or ai_result["category"]
    assigned_dept = DEPARTMENTS.get(assigned_cat, ai_result.get("department", "Public Works Department"))

    new_id = f"CIV-2024-{random.randint(30000, 99999)}"
    now = datetime.now().isoformat()

    comp_dict = {
        "id": new_id,
        "title": payload.title,
        "description": payload.description,
        "category": assigned_cat,
        "priority_score": ai_result["priority_score"],
        "priority_level": ai_result["priority_level"],
        "priority_reason": ai_result["priority_reason"],
        "safety_score": ai_result["safety_score"],
        "affected_score": ai_result["affected_score"],
        "recurrence_score": ai_result["recurrence_score"],
        "waiting_score": ai_result["waiting_score"],
        "status": "Submitted",
        "citizen_name": payload.citizen_name or "Citizen Contributor",
        "citizen_email": payload.citizen_email or "citizen@civicai.local",
        "locality": payload.locality,
        "ward": payload.ward,
        "latitude": payload.latitude or 12.9716,
        "longitude": payload.longitude or 77.5946,
        "image_url": payload.image_url or "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80",
        "department": assigned_dept,
        "ai_summary": ai_result["ai_summary"],
        "suggested_action": ai_result["suggested_action"],
        "created_at": now,
        "updated_at": now
    }

    created = insert_complaint(comp_dict)
    return created

@app.patch("/api/complaints/{complaint_id}/status")
def change_status(complaint_id: str, payload: StatusUpdate):
    updated = update_complaint_status(
        complaint_id=complaint_id,
        new_status=payload.status,
        notes=payload.notes,
        changed_by=payload.changed_by or "Administrator",
        rejection_reason=payload.rejection_reason,
        department=payload.department
    )
    if not updated:
        raise HTTPException(status_code=404, detail="Complaint not found")
    return updated

@app.patch("/api/complaints/{complaint_id}/priority")
def override_priority(complaint_id: str, payload: PriorityOverride):
    updated = update_complaint_priority(
        complaint_id=complaint_id,
        priority_level=payload.priority_level,
        priority_score=payload.priority_score,
        override_reason=payload.override_reason,
        changed_by=payload.changed_by or "Administrator"
    )
    if not updated:
        raise HTTPException(status_code=404, detail="Complaint not found")
    return updated

class DuplicateSearchPayload(BaseModel):
    complaint_id: Optional[str] = None
    title: str = ""
    description: str = ""
    category: Optional[str] = ""
    ward: Optional[str] = ""
    locality: Optional[str] = ""

@app.post("/api/duplicates/find")
def find_duplicates_endpoint(payload: DuplicateSearchPayload):
    return find_potential_duplicates(
        complaint_id=payload.complaint_id,
        title=payload.title,
        description=payload.description,
        category=payload.category or "",
        ward=payload.ward or "",
        locality=payload.locality or ""
    )

@app.post("/api/duplicates/merge")
def merge_duplicates_endpoint(payload: DuplicateMergeRequest):
    return merge_duplicates(
        primary_id=payload.primary_id,
        duplicate_ids=payload.duplicate_ids,
        merged_by=payload.merged_by or "Administrator",
        notes=payload.notes
    )

@app.get("/api/analytics/summary")
def get_analytics():
    return get_analytics_summary()

@app.get("/api/analytics/predictive")
def get_predictive():
    return get_predictive_analytics()

@app.get("/api/environmental")
def get_environmental():
    return get_environmental_module()

@app.post("/api/ai/classify")
def classify_endpoint(payload: AIClassificationRequest):
    return classify_complaint(
        title=payload.title,
        description=payload.description,
        locality=payload.locality,
        ward=payload.ward
    )

@app.post("/api/assistant/chat")
def assistant_chat(payload: AssistantQueryRequest):
    return query_assistant(payload.question)

@app.post("/api/demo/reset")
def reset_demo():
    return reset_all_data()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
