import random
from datetime import datetime, timedelta
from database import init_db, insert_complaint, get_db_connection

# Seed categories
CATEGORIES = [
    "Overflowing Garbage",
    "Potholes & Damaged Roads",
    "Broken Streetlights",
    "Water Leakage & Main Burst",
    "Drainage & Sewage Blockage",
    "Plastic Pollution & Dumping",
    "Accessibility & Footpath Barrier",
    "Noise & Industrial Pollution"
]

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

WARDS = [
    {"ward": "Ward 1", "locality": "Downtown Central Business District", "lat": 12.9716, "lng": 77.5946},
    {"ward": "Ward 2", "locality": "Westside Residential Suburbs", "lat": 12.9601, "lng": 77.5732},
    {"ward": "Ward 3", "locality": "Green Valley & Maple Gardens", "lat": 12.9845, "lng": 77.6201},
    {"ward": "Ward 4", "locality": "Industrial Corridor Sector 7", "lat": 12.9421, "lng": 77.6324},
    {"ward": "Ward 5", "locality": "North End Tech Park & Harbor", "lat": 13.0112, "lng": 77.6015},
    {"ward": "Ward 6", "locality": "South Park District & Market", "lat": 12.9234, "lng": 77.5819}
]

CITIZEN_NAMES = [
    "Aarav Sharma", "Priya Nair", "Vikram Malhotra", "Ananya Rao", "Rohan Mehta",
    "Sneha Iyer", "David Chen", "Fatima Al-Mansoor", "Kavita Deshmukh", "Arjun Patel",
    "Sunita Reddy", "Karthik Swaminathan", "Zoya Khan", "Rajeshwari Pillai", "Marcus Vance"
]

STATUS_CHOICES = ["Submitted", "Under Review", "Assigned", "In Progress", "Resolved", "Resolved", "Resolved"]

def generate_priority(category, description):
    # Rule based priority breakdown
    safety = 10
    affected = 10
    recurrence = 10
    waiting = random.randint(5, 15)

    low_desc = description.lower()
    if any(k in low_desc for k in ["hazard", "electrocution", "fatal", "accident", "school", "hospital", "burst", "severe", "overflowing into homes"]):
        safety = random.randint(28, 35)
    elif any(k in low_desc for k in ["pothole", "dark", "stench", "traffic", "flood", "leaking"]):
        safety = random.randint(18, 27)

    if any(k in low_desc for k in ["main road", "entire colony", "school zone", "commuters", "thousands", "market"]):
        affected = random.randint(20, 25)
    else:
        affected = random.randint(10, 19)

    if any(k in low_desc for k in ["recurring", "repeatedly", "3rd time", "every week", "months", "persistent"]):
        recurrence = random.randint(20, 25)
    else:
        recurrence = random.randint(5, 15)

    total = min(100, safety + affected + recurrence + waiting)
    if total >= 80:
        level = "Critical"
    elif total >= 65:
        level = "High"
    elif total >= 45:
        level = "Medium"
    else:
        level = "Low"

    reason = f"Calculated based on Safety Risk ({safety}/35), Citizen Exposure ({affected}/25), Recurrence Index ({recurrence}/25), and Aging Factor ({waiting}/15)."
    return total, level, reason, safety, affected, recurrence, waiting

def seed_database():
    init_db()
    conn = get_db_connection()
    cursor = conn.cursor()
    # Check if complaints already seeded
    cursor.execute("SELECT COUNT(*) FROM complaints")
    count = cursor.fetchone()[0]
    conn.close()

    if count >= 80:
        print(f"Database already populated with {count} complaints. Skipping initial seed.")
        return

    print("Generating 105 realistic synthetic demonstration complaint records...")

    # Specific hackathon showcase cluster: Maple Street Recurring Garbage Cluster
    maple_cluster = [
        {
            "id": "CIV-2024-00101",
            "title": "Severe overflowing garbage and rotting stench at Maple Street 4th Cross",
            "description": "Massive mound of uncollected municipal waste spilling onto the main road near Maple Gardens gate. Animals scattering plastic bags, foul odor affecting nearby school children and residents.",
            "category": "Overflowing Garbage",
            "ward": "Ward 3",
            "locality": "Green Valley & Maple Gardens",
            "lat": 12.9848,
            "lng": 77.6205,
            "citizen_name": "Aarav Sharma",
            "days_ago": 3,
            "status": "In Progress"
        },
        {
            "id": "CIV-2024-00102",
            "title": "Uncollected trash pile blocking pedestrian walkway on Maple Street",
            "description": "Garbage bins are overflowing completely at Maple St corner 4th cross. Trash has spread 20 meters down the street. It has been 5 days without waste pickup.",
            "category": "Overflowing Garbage",
            "ward": "Ward 3",
            "locality": "Green Valley & Maple Gardens",
            "lat": 12.9849,
            "lng": 77.6208,
            "citizen_name": "Sneha Iyer",
            "days_ago": 2,
            "status": "Under Review"
        },
        {
            "id": "CIV-2024-00103",
            "title": "Rotting garbage hotspot and stray dogs on Maple Street 4th Cross",
            "description": "Critical garbage accumulation right outside Maple Gardens apartments. Intense foul smell and disease hazard. Please clear immediately.",
            "category": "Overflowing Garbage",
            "ward": "Ward 3",
            "locality": "Green Valley & Maple Gardens",
            "lat": 12.9846,
            "lng": 77.6202,
            "citizen_name": "Kavita Deshmukh",
            "days_ago": 1,
            "status": "Submitted"
        },
        {
            "id": "CIV-2024-00104",
            "title": "Dumpster overflow spilling onto traffic lane on Maple Street",
            "description": "Overflowing public waste bin on Maple Street 4th Cross is forcing two-wheelers into oncoming traffic. Urgent clearance needed.",
            "category": "Overflowing Garbage",
            "ward": "Ward 3",
            "locality": "Green Valley & Maple Gardens",
            "lat": 12.9851,
            "lng": 77.6210,
            "citizen_name": "Rohan Mehta",
            "days_ago": 1,
            "status": "Submitted"
        }
    ]

    # Insert cluster items first
    now = datetime.now()
    for item in maple_cluster:
        created_time = (now - timedelta(days=item["days_ago"], hours=random.randint(1, 10))).isoformat()
        score, level, reason, s, a, r, w = generate_priority(item["category"], item["description"])
        # Give higher recurrence for showcase
        r = 24
        score = min(96, s + a + r + w)
        level = "Critical"
        comp_data = {
            "id": item["id"],
            "title": item["title"],
            "description": item["description"],
            "category": item["category"],
            "priority_score": score,
            "priority_level": level,
            "priority_reason": f"CRITICAL RECURRENCE HOTSPOT: Safety ({s}/35), High Citizen Exposure ({a}/25), Recurrence Hotspot ({r}/25), Aging ({w}/15). Multiple cluster reports detected within 50m radius.",
            "safety_score": s,
            "affected_score": a,
            "recurrence_score": r,
            "waiting_score": w,
            "status": item["status"],
            "citizen_name": item["citizen_name"],
            "citizen_email": f"{item['citizen_name'].lower().replace(' ', '.')}@civicai.demo",
            "locality": item["locality"],
            "ward": item["ward"],
            "latitude": item["lat"],
            "longitude": item["lng"],
            "image_url": "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80",
            "department": DEPARTMENTS[item["category"]],
            "ai_summary": "Urgent municipal garbage overflow causing severe pedestrian obstruction, public health hazard, and recurring waste hotspot in Maple Gardens.",
            "suggested_action": "Deploy rapid response compactor truck, inspect neighborhood collection schedule, and install automated smart bin sensor.",
            "created_at": created_time,
            "updated_at": created_time
        }
        insert_complaint(comp_data)

    # Pre-seed 101 diverse complaints across 6 months
    sample_templates = [
        # Potholes
        ("Deep hazardous pothole near school crossing causing bike skids", "Deep crater on arterial road, approx 15 inches deep. Multiple two-wheelers had near-miss accidents this morning outside St. Anne's School.", "Potholes & Damaged Roads", "Critical"),
        ("Asphalt erosion and uneven road surface after heavy rainfall", "The stretch of 200m between 2nd avenue and market road has cratered. Vehicles are getting tyre punctures regularly.", "Potholes & Damaged Roads", "High"),
        ("Exposed manhole ring without proper safety barricade", "Manhole cover is sunken 4 inches below asphalt level on inner ring road. Extreme night-time driving danger.", "Potholes & Damaged Roads", "Critical"),
        ("Speed breaker paint peeled off causing sudden braking", "Unmarked speed bump causing vehicles to launch into the air. Paint warning stripes needed.", "Potholes & Damaged Roads", "Medium"),
        # Streetlights
        ("All 6 streetlights non-operational on 5th Main connector", "Complete pitch black stretch of road for 400 meters. Senior citizens and women feel very unsafe walking home after 8 PM.", "Broken Streetlights", "High"),
        ("Flickering LED street fixture near community park", "Streetlight blinking continuously like a strobe light, disturbing residents and leaving corner dark.", "Broken Streetlights", "Low"),
        ("Exposed live electrical wires dangling from broken lamppost", "A truck hit the municipal lamppost yesterday. Sparking wires are hanging 4 feet from the ground near bus stand.", "Broken Streetlights", "Critical"),
        # Water Leakage
        ("Major underground potable water pipe burst flooding road", "Clean drinking water gushing out under pressure for the last 18 hours. Thousands of gallons being wasted while road is submerged.", "Water Leakage & Main Burst", "Critical"),
        ("Continuous seepage from municipal distribution valve", "Drinking water pipe joint leaking slowly, eroding sidewalk pavers over past two weeks.", "Water Leakage & Main Burst", "Medium"),
        ("Low water pressure and muddy supply in residential colony", "Water delivered through municipal taps is brown and turbid for 3 consecutive days.", "Water Leakage & Main Burst", "High"),
        # Drainage
        ("Stormwater drain clogged with plastic debris causing local flooding", "Monsoon drain is fully choked with single-use plastic and thermocol. Even moderate rain causes waterlogging inside houses.", "Drainage & Sewage Blockage", "High"),
        ("Overflowing open sewer manhole near vegetable market", "Black sewage water overflowing onto the pedestrian pathway. Intolerable stench and extreme health hazard for vegetable buyers.", "Drainage & Sewage Blockage", "Critical"),
        ("Missing concrete drain slab creating pedestrian death trap", "Open stormwater trench next to sidewalk. Pedestrians can easily fall in at night.", "Drainage & Sewage Blockage", "High"),
        # Plastic & Waste
        ("Illegal commercial plastic dumping in vacant municipal plot", "Contractor dumping plastic packaging rolls and hazardous chemical containers at night behind Sector 7 warehouse.", "Plastic Pollution & Dumping", "High"),
        ("Single-use plastic cups littering lake promenade", "Picnickers and food stalls dumping hundreds of plastic bottles and disposable cutlery directly into the wetland buffer zone.", "Plastic Pollution & Dumping", "Medium"),
        ("Toxic open burning of plastic waste and dry leaves", "Security guard and cleaners setting fire to massive heaps of plastic trash every evening at 6 PM. Heavy acrid smoke.", "Plastic Pollution & Dumping", "Critical"),
        # Accessibility
        ("Wheelchair ramp blocked by unpermitted billboard and generator", "Municipal footpath ramp to the community health center is completely obstructed by private generator.", "Accessibility & Footpath Barrier", "High"),
        ("Broken tactile paving for visually impaired commuters", "Tactile guiding tiles along metro station exit 2 are shattered and missing, causing trip hazard.", "Accessibility & Footpath Barrier", "Medium"),
        ("Encroachment of entire 3-meter sidewalk by automobile workshop", "Mechanics parking customer cars across the pedestrian walkway, forcing children onto heavy traffic road.", "Accessibility & Footpath Barrier", "High"),
        # Noise
        ("Industrial diesel generator operating without acoustic enclosure", "Severe decibel violation 24/7 adjacent to residential block, exceeding permissible ambient noise standards.", "Noise & Industrial Pollution", "Medium")
    ]

    images_pool = [
        "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1611288875685-147055a92d4b?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80"
    ]

    for i in range(105, 206):
        template = random.choice(sample_templates)
        ward_info = random.choice(WARDS)
        cat = template[2]
        title = template[0]
        desc = template[1]

        # Add variations
        days_ago = random.randint(1, 150)
        c_time = (now - timedelta(days=days_ago, hours=random.randint(0, 23), minutes=random.randint(0, 59))).isoformat()
        
        status = random.choice(STATUS_CHOICES)
        if days_ago > 60:
            status = "Resolved" if random.random() > 0.15 else "In Progress"

        score, level, reason, s, a, r, w = generate_priority(cat, desc)
        # Add slight jitter to coordinate
        lat = ward_info["lat"] + random.uniform(-0.015, 0.015)
        lng = ward_info["lng"] + random.uniform(-0.015, 0.015)
        citizen = random.choice(CITIZEN_NAMES)

        rejection = None
        if status == "Rejected":
            rejection = "Jurisdiction issue: Property is under private housing society maintenance, not municipal corporation."

        comp_data = {
            "id": f"CIV-2024-{i:05d}",
            "title": title,
            "description": desc,
            "category": cat,
            "priority_score": score,
            "priority_level": level,
            "priority_reason": reason,
            "safety_score": s,
            "affected_score": a,
            "recurrence_score": r,
            "waiting_score": w,
            "status": status,
            "citizen_name": citizen,
            "citizen_email": f"{citizen.lower().replace(' ', '.')}@civicai.demo",
            "locality": ward_info["locality"],
            "ward": ward_info["ward"],
            "latitude": round(lat, 5),
            "longitude": round(lng, 5),
            "image_url": random.choice(images_pool),
            "department": DEPARTMENTS[cat],
            "ai_summary": f"Automated summary: {title}. Evaluated for citizen impact and assigned to {DEPARTMENTS[cat]}.",
            "suggested_action": f"Schedule inspection crew from {DEPARTMENTS[cat]} within 48h to evaluate and clear site.",
            "rejection_reason": rejection,
            "created_at": c_time,
            "updated_at": (datetime.fromisoformat(c_time) + timedelta(days=random.randint(1, 5))).isoformat() if status != "Submitted" else c_time
        }
        insert_complaint(comp_data)

    print("Successfully seeded database with 105 realistic complaint records!")

def reset_all_data():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DROP TABLE IF EXISTS complaints")
    cursor.execute("DROP TABLE IF EXISTS status_history")
    cursor.execute("DROP TABLE IF EXISTS duplicate_links")
    conn.commit()
    conn.close()
    seed_database()
    return {"status": "success", "message": "Demo database successfully reset and re-seeded with 105 realistic records."}

if __name__ == "__main__":
    reset_all_data()
