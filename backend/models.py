from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class StatusUpdate(BaseModel):
    status: str
    notes: Optional[str] = None
    changed_by: Optional[str] = "Administrator"
    rejection_reason: Optional[str] = None
    department: Optional[str] = None

class PriorityOverride(BaseModel):
    priority_level: str
    priority_score: int
    override_reason: str
    changed_by: Optional[str] = "Administrator"

class DepartmentAssignment(BaseModel):
    department: str
    notes: Optional[str] = None
    changed_by: Optional[str] = "Administrator"

class DuplicateMergeRequest(BaseModel):
    primary_id: str
    duplicate_ids: List[str]
    merged_by: Optional[str] = "Administrator"
    notes: Optional[str] = None

class ComplaintCreate(BaseModel):
    title: str = Field(..., min_length=3, max_length=200)
    description: str = Field(..., min_length=10, max_length=2000)
    locality: str
    ward: str
    category: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    image_url: Optional[str] = None
    citizen_name: Optional[str] = "Citizen Contributor"
    citizen_email: Optional[str] = "citizen@civicai.local"

class AIClassificationRequest(BaseModel):
    title: str
    description: str
    locality: Optional[str] = None
    ward: Optional[str] = None

class AssistantQueryRequest(BaseModel):
    question: str
    conversation_history: Optional[List[Dict[str, str]]] = None

class FilterParams(BaseModel):
    category: Optional[str] = None
    status: Optional[str] = None
    priority_level: Optional[str] = None
    ward: Optional[str] = None
    search: Optional[str] = None
    sort_by: Optional[str] = "created_at"
    sort_order: Optional[str] = "desc"
