import firebase_admin
from firebase_admin import credentials, firestore
import os
import json

# Initialize Firebase (for demo purposes, we'll use a mock configuration)
def initialize_firebase():
    """
    Initialize Firebase Admin SDK
    For production, you would use actual Firebase credentials
    """
    try:
        # Check if Firebase is already initialized
        if not firebase_admin._apps:
            # For demo purposes, we'll create a mock credential
            # In production, you would use:
            # cred = credentials.Certificate('path/to/firebase-credentials.json')
            # firebase_admin.initialize_app(cred)
            
            # Mock initialization for demo
            print("Firebase would be initialized here with actual credentials")
            return None
        return firestore.client()
    except Exception as e:
        print(f"Firebase initialization error: {e}")
        return None

def get_firestore_client():
    """
    Get Firestore client
    Returns None for demo purposes
    """
    return initialize_firebase()

# Mock Firestore data for demo
MOCK_LEADERBOARD_DATA = [
    {"name": "Alice Smith", "donations": 2450, "referral_code": "alice2025"},
    {"name": "Bob Jones", "donations": 1700, "referral_code": "bob2025"},
    {"name": "Charlie Brown", "donations": 3200, "referral_code": "charlie2025"},
    {"name": "Diana Prince", "donations": 1850, "referral_code": "diana2025"},
    {"name": "Eve Wilson", "donations": 2100, "referral_code": "eve2025"},
    {"name": "Frank Miller", "donations": 1450, "referral_code": "frank2025"},
    {"name": "Grace Lee", "donations": 2750, "referral_code": "grace2025"},
    {"name": "Henry Ford", "donations": 1950, "referral_code": "henry2025"},
]

def get_leaderboard_data():
    """
    Get leaderboard data from Firestore or return mock data
    """
    db = get_firestore_client()
    
    if db is None:
        # Return mock data for demo
        return sorted(MOCK_LEADERBOARD_DATA, key=lambda x: x["donations"], reverse=True)
    
    try:
        # Actual Firestore query
        leaderboard_ref = db.collection('leaderboard')
        docs = leaderboard_ref.stream()
        
        leaderboard = []
        for doc in docs:
            data = doc.to_dict()
            leaderboard.append({
                "name": data.get("name", "Unknown"),
                "donations": data.get("donations", 0),
                "referral_code": data.get("referral_code", "")
            })
        
        return sorted(leaderboard, key=lambda x: x["donations"], reverse=True)
    except Exception as e:
        print(f"Error fetching leaderboard: {e}")
        return sorted(MOCK_LEADERBOARD_DATA, key=lambda x: x["donations"], reverse=True)

def add_leaderboard_entry(name, donations, referral_code):
    """
    Add entry to leaderboard in Firestore
    """
    db = get_firestore_client()
    
    if db is None:
        print(f"Mock: Would add {name} with {donations} donations to Firestore")
        return True
    
    try:
        db.collection('leaderboard').add({
            'name': name,
            'donations': donations,
            'referral_code': referral_code,
            'created_at': firestore.SERVER_TIMESTAMP
        })
        return True
    except Exception as e:
        print(f"Error adding leaderboard entry: {e}")
        return False