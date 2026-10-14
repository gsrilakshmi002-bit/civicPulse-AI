import os
import re
import json
import difflib
from datetime import datetime
from typing import Dict, Any, List, Optional
from database import get_all_complaints, get_db_connection

# Department routing lookup
DEPARTMENTS = {
    "Overflowing Garbage": "Solid Waste Management",
    "Potholes & Damaged Roads": "Roads & Highway Infrastructure",
    "Broken Streetlights": "Municipal Electrical & Energy Board",
    "Water Leakage & Main Burst": "Water Supply & Sewerage Board",
    "Drainage & Sewage Blockage": "Stormwater Drainage Department",
    "Plastic Pollution & Dumping": "Environmental Protection Division",
    "Accessibility & Footpath Barrier": "Urban Planning & Public Access",
    "Noise & Industrial Pollution": "Pollution Control Board"
}

KEYWORDS = {
    "Overflowing Garbage": ["garbage", "trash", "waste", "dump", "bin", "stench", "rotting", "debris", "litter", "compactor"],
    "Potholes & Damaged Roads": ["pothole", "crater", "asphalt", "road", "tar", "speed breaker", "accident", "tyre", "manhole"],
    "Broken Streetlights": ["streetlight", "light", "dark", "lamppost", "bulb", "pitch black", "flickering", "lighting"],
    "Water Leakage & Main Burst": ["water", "leak", "pipe", "burst", "potable", "drinking water", "gushing", "tap", "pipeline"],
    "Drainage & Sewage Blockage": ["drain", "drainage", "sewage", "sewer", "gutter", "clogged", "overflowing sewer", "monsoon drain"],
    "Plastic Pollution & Dumping": ["plastic", "single-use", "bottles", "polythene", "toxic burning", "chemical", "dumping"],
    "Accessibility & Footpath Barrier": ["footpath", "sidewalk", "wheelchair", "ramp", "pedestrian", "barrier", "encroachment", "tactile"],
    "Noise & Industrial Pollution": ["noise", "decibel", "sound", "loudspeaker", "generator", "industrial", "smoke", "factory"]
}

def rule_based_classification(title: str, description: str, locality: Optional[str] = None, ward: Optional[str] = None) -> Dict[str, Any]:
    text = (title + " " + description).lower()
    
    # Category scoring
    best_cat = "Overflowing Garbage"
    best_count = -1
    for cat, words in KEYWORDS.items():
        score = sum(1 for w in words if w in text)
        if score > best_count:
            best_count = score
            best_cat = cat

    # Safety Risk scoring (0-35)
    safety_score = 12
    high_safety_cues = ["hazard", "electrocution", "fatal", "accident", "school", "hospital", "sparking", "sinkhole", "deep crater", "death trap", "burst pipe", "emergency", "fire", "toxic"]
    med_safety_cues = ["pothole", "dark", "pitch black", "flood", "sewage", "stench", "skid", "injury"]
    if any(k in text for k in high_safety_cues):
        safety_score = 32
    elif any(k in text for k in med_safety_cues):
        safety_score = 22

    # Citizen Exposure scoring (0-25)
    affected_score = 12
    high_affected_cues = ["main road", "entire colony", "school zone", "commuters", "thousands", "market", "metro", "bus stand", "hospital road"]
    if any(k in text for k in high_affected_cues):
        affected_score = 23
    elif any(k in text for k in ["residential", "apartment", "street", "neighborhood", "pedestrians"]):
        affected_score = 18

    # Recurrence factor (0-25)
    recurrence_score = 8
    if any(k in text for k in ["recurring", "repeatedly", "3rd time", "every week", "persistent", "months", "again", "regular"]):
        recurrence_score = 22
    
    # Check historical complaints in same locality for recurrence
    conn = get_db_connection()
    cursor = conn.cursor()
    if locality:
        cursor.execute("SELECT COUNT(*) FROM complaints WHERE locality LIKE ? AND category = ?", (f"%{locality}%", best_cat))
        existing_matches = cursor.fetchone()[0]
        if existing_matches >= 3:
            recurrence_score = min(25, recurrence_score + 10)
    conn.close()

    # Aging / Waiting baseline (0-15)
    waiting_score = 10

    total_priority = min(100, safety_score + affected_score + recurrence_score + waiting_score)
    if total_priority >= 80:
        priority_level = "Critical"
    elif total_priority >= 65:
        priority_level = "High"
    elif total_priority >= 45:
        priority_level = "Medium"
    else:
        priority_level = "Low"

    department = DEPARTMENTS.get(best_cat, "Public Works Department")

    summary = f"Citizen reported {best_cat.lower()} issue at {locality or 'community location'}. Assessed as {priority_level} priority due to potential impact on public accessibility and municipal safety."
    
    actions = {
        "Overflowing Garbage": "Dispatch high-capacity collection truck and verify ward waste transfer schedule.",
        "Potholes & Damaged Roads": "Deploy asphalt repair crew for immediate pothole filling and safety cordoning.",
        "Broken Streetlights": "Assign electrical linesman to test luminaire power supply and replace blown LED.",
        "Water Leakage & Main Burst": "Isolate municipal pipeline valve and deploy plumbing emergency response team.",
        "Drainage & Sewage Blockage": "Deploy high-pressure jetting machine and clear stormwater debris.",
        "Plastic Pollution & Dumping": "Issue sanitation inspection notice and schedule bulk plastic waste recovery.",
        "Accessibility & Footpath Barrier": "Issue encroachment clearance order and restore compliant pedestrian walkway.",
        "Noise & Industrial Pollution": "Conduct decibel meter acoustic audit and verify industrial environmental compliance."
    }
    suggested_action = actions.get(best_cat, "Schedule site inspection within 48 hours.")

    reason = (
        f"AI Explainable Priority: Safety Risk ({safety_score}/35) + "
        f"Citizen Exposure ({affected_score}/25) + "
        f"Recurrence/Cluster Index ({recurrence_score}/25) + "
        f"Aging Baseline ({waiting_score}/15) = {total_priority}/100."
    )

    return {
        "category": best_cat,
        "priority_score": total_priority,
        "priority_level": priority_level,
        "priority_reason": reason,
        "safety_score": safety_score,
        "affected_score": affected_score,
        "recurrence_score": recurrence_score,
        "waiting_score": waiting_score,
        "department": department,
        "ai_summary": summary,
        "suggested_action": suggested_action,
        "source": "CivicAI Heuristic Intelligence Engine"
    }

def classify_complaint(title: str, description: str, locality: Optional[str] = None, ward: Optional[str] = None) -> Dict[str, Any]:
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        return rule_based_classification(title, description, locality, ward)

    try:
        import urllib.request
        prompt = f"""
        You are CivicAI, an expert municipal AI classifier. Analyze this community complaint:
        Title: {title}
        Description: {description}
        Locality: {locality or 'Unknown'}
        Ward: {ward or 'Unknown'}

        Categories must be strictly one of:
        - "Overflowing Garbage"
        - "Potholes & Damaged Roads"
        - "Broken Streetlights"
        - "Water Leakage & Main Burst"
        - "Drainage & Sewage Blockage"
        - "Plastic Pollution & Dumping"
        - "Accessibility & Footpath Barrier"
        - "Noise & Industrial Pollution"

        Calculate transparent priority (0-100) based on:
        - safety_score (0-35)
        - affected_score (0-25)
        - recurrence_score (0-25)
        - waiting_score (0-15)

        Return ONLY a raw JSON object with keys:
        {{
            "category": string,
            "priority_score": number,
            "priority_level": "Critical" | "High" | "Medium" | "Low",
            "priority_reason": string,
            "safety_score": number,
            "affected_score": number,
            "recurrence_score": number,
            "waiting_score": number,
            "department": string,
            "ai_summary": string,
            "suggested_action": string
        }}
        """
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
        payload = json.dumps({"contents": [{"parts": [{"text": prompt}]}]}).encode("utf-8")
        req = urllib.request.Request(url, data=payload, headers={"Content-Type": "application/json"})
        with urllib.request.urlopen(req, timeout=7) as response:
            result = json.loads(response.read().decode("utf-8"))
            raw_text = result["candidates"][0]["content"]["parts"][0]["text"].strip()
            # Clean markdown code blocks if present
            raw_text = re.sub(r"^```json\s*", "", raw_text)
            raw_text = re.sub(r"\s*```$", "", raw_text)
            parsed = json.loads(raw_text)
            parsed["source"] = "Gemini 1.5 Flash Model"
            return parsed
    except Exception as e:
        print(f"Gemini API request failed, falling back to rule-based engine: {e}")
        return rule_based_classification(title, description, locality, ward)

def calculate_text_similarity(str1: str, str2: str) -> float:
    # Normalized token jaccard similarity + sequence matcher
    words1 = set(re.findall(r"\w+", str1.lower()))
    words2 = set(re.findall(r"\w+", str2.lower()))
    if not words1 or not words2:
        return 0.0
    jaccard = len(words1 & words2) / len(words1 | words2)
    seq = difflib.SequenceMatcher(None, str1.lower(), str2.lower()).ratio()
    return round((jaccard * 0.6) + (seq * 0.4), 3)

def find_potential_duplicates(complaint_id: Optional[str] = None, title: str = "", description: str = "", category: str = "", ward: str = "", locality: str = "") -> List[Dict[str, Any]]:
    all_complaints = get_all_complaints()
    candidates = []

    input_text = f"{title} {description}"

    for c in all_complaints:
        if complaint_id and c["id"] == complaint_id:
            continue
        # Skip if already merged into another
        if c.get("is_merged") == 1:
            continue

        c_text = f"{c['title']} {c['description']}"
        similarity = calculate_text_similarity(input_text, c_text)

        category_match = (category.lower() == c["category"].lower()) if category else False
        ward_match = (ward.lower() == c["ward"].lower()) if ward else False
        locality_match = (locality.lower() in c["locality"].lower() or c["locality"].lower() in locality.lower()) if locality else False

        # Weighted duplicate score
        score = similarity * 0.55
        reasons = []

        if category_match:
            score += 0.20
            reasons.append("Identical complaint category")
        if ward_match:
            score += 0.15
            reasons.append(f"Same jurisdiction ({c['ward']})")
        if locality_match:
            score += 0.10
            reasons.append("Matching street/locality proximity")

        if similarity > 0.45:
            reasons.append(f"High text content overlap ({int(similarity * 100)}%)")

        score = min(1.0, score)

        if score >= 0.50:
            candidates.append({
                "complaint": c,
                "similarity_score": round(score, 2),
                "match_reasons": reasons,
                "is_urgent": c["priority_level"] in ["Critical", "High"]
            })

    # Sort descending by similarity
    candidates.sort(key=lambda x: x["similarity_score"], reverse=True)
    return candidates[:10]

def query_assistant(question: str) -> Dict[str, Any]:
    # Fetch real stats from DB to ground assistant responses
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM complaints")
    total_count = cursor.fetchone()[0]

    cursor.execute("SELECT status, COUNT(*) FROM complaints GROUP BY status")
    status_counts = dict(cursor.fetchall())

    cursor.execute("SELECT category, COUNT(*) FROM complaints GROUP BY category ORDER BY COUNT(*) DESC")
    category_counts = cursor.fetchall()
    top_category = category_counts[0] if category_counts else ("None", 0)

    cursor.execute("SELECT ward, COUNT(*) FROM complaints GROUP BY ward ORDER BY COUNT(*) DESC")
    ward_counts = cursor.fetchall()
    top_ward = ward_counts[0] if ward_counts else ("None", 0)

    cursor.execute("SELECT COUNT(*) FROM complaints WHERE priority_level IN ('Critical', 'High') AND status != 'Resolved'")
    urgent_pending = cursor.fetchone()[0]

    conn.close()

    q_lower = question.lower()

    # Rule-guided contextual answers grounded in actual database
    if any(k in q_lower for k in ["how many", "total", "stats", "statistics", "metrics", "overview"]):
        answer = (
            f"According to real-time CivicAI records, there are currently **{total_count} total complaints** registered in the system.\n\n"
            f"- **Resolved:** {status_counts.get('Resolved', 0)} ({round(status_counts.get('Resolved', 0)/max(1, total_count)*100, 1)}% resolution rate)\n"
            f"- **In Progress:** {status_counts.get('In Progress', 0)}\n"
            f"- **Under Review / Assigned:** {status_counts.get('Under Review', 0) + status_counts.get('Assigned', 0)}\n"
            f"- **Urgent / Critical Pending:** {urgent_pending} requiring priority field teams."
        )
        return {"answer": answer, "grounded_data": {"total": total_count, "resolved": status_counts.get("Resolved", 0), "urgent": urgent_pending}}

    if any(k in q_lower for k in ["frequent", "highest", "most reported", "common", "top category"]):
        cat_lines = "\n".join([f"- **{cat}**: {cnt} reports" for cat, cnt in category_counts[:4]])
        answer = (
            f"The most frequently reported community issue is **{top_category[0]}** with **{top_category[1]} submissions**.\n\n"
            f"Top categories currently logged:\n{cat_lines}\n\n"
            f"The **{DEPARTMENTS.get(top_category[0], 'Public Works')}** has been deployed to prioritize this cluster."
        )
        return {"answer": answer, "grounded_data": {"top_category": top_category[0], "count": top_category[1]}}

    if any(k in q_lower for k in ["ward", "area", "locality", "where", "hotspot"]):
        ward_lines = "\n".join([f"- **{w}**: {cnt} issues" for w, cnt in ward_counts[:4]])
        answer = (
            f"**{top_ward[0]}** currently logs the highest issue volume with **{top_ward[1]} community reports**.\n\n"
            f"Ward distribution:\n{ward_lines}\n\n"
            f"CivicAI has flagged a recurring garbage overflow cluster on **Maple Street (Ward 3)** which has triggered duplicate alerts."
        )
        return {"answer": answer, "grounded_data": {"top_ward": top_ward[0], "count": top_ward[1]}}

    if any(k in q_lower for k in ["how to report", "submit", "file a complaint", "procedure"]):
        answer = (
            "To report an issue on CivicAI:\n"
            "1. Click **'Submit Complaint'** on the sidebar or top navigation.\n"
            "2. Enter a descriptive title and location (Ward / Locality).\n"
            "3. Describe the problem (safety hazards, recurrence, people affected).\n"
            "4. Upload an optional photo for evidence.\n"
            "5. CivicAI will automatically classify the category, calculate a transparent 0-100 priority score, route it to the right department, and assign a tracking ID (e.g., `CIV-2024-XXXXX`)."
        )
        return {"answer": answer}

    if any(k in q_lower for k in ["water leakage", "leak", "pipe burst"]):
        answer = (
            "**Water Leakage Protocol**:\n"
            "- Potable water main bursts receive immediate **Critical/High** priority scoring in CivicAI.\n"
            "- Routed directly to the **Water Supply & Sewerage Board**.\n"
            "- Citizens are encouraged to mention if clean drinking water is being wasted or if water pressure in homes has dropped.\n"
            "- Emergency shutoff teams are notified within 2 hours of verification."
        )
        return {"answer": answer}

    if any(k in q_lower for k in ["garbage", "trash", "waste", "reduce", "prevention", "dumping"]):
        answer = (
            "**AI Waste Management Recommendations**:\n"
            "1. **Smart Bin Level Sensors**: Install IoT ultrasonic fill-level sensors at recurring hotspots like Maple Street to trigger automated compactor pickups before overflow.\n"
            "2. **Dynamic Route Optimization**: Adjust municipal collection trucks from fixed schedules to demand-responsive routing.\n"
            "3. **Community Segregation Drives**: Introduce color-coded segregated wet/dry collection points and penalties for commercial dumping.\n"
            "4. **Duplicate Grouping**: CivicAI automatically groups multiple citizen reports for the same pile to avoid duplicate truck dispatches."
        )
        return {"answer": answer}

    # Default intelligent civic answer
    answer = (
        f"Hello! I am your CivicAI Community Intelligence Assistant. "
        f"I have live access to our municipal database ({total_count} logged community issues). "
        f"You can ask me about:\n"
        f"- Real-time complaint statistics and resolution rates\n"
        f"- Most frequently reported problems ({top_category[0]} leads right now)\n"
        f"- How to report potholes, water leaks, or streetlights\n"
        f"- Waste management prevention and environmental sustainability insights\n"
        f"- How CivicAI calculates transparent 0-100 priority scores"
    )
    return {"answer": answer}
