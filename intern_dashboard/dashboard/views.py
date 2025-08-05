from django.shortcuts import render, get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from .models import Intern, Reward, InternReward, Donation
from .firebase_config import get_leaderboard_data, add_leaderboard_entry
import random
import string

class TestAPIView(APIView):
    """
    Simple test endpoint to verify API is working
    """
    def get(self, request):
        return Response({
            "message": "API is working!",
            "status": "success",
            "timestamp": "2024-01-15T10:30:00Z"
        }, status=status.HTTP_200_OK)

class InternDashboardView(APIView):
    """
    API endpoint for intern dashboard data
    """
    def get(self, request, id):
        try:
            # Try to get intern from database
            try:
                intern = Intern.objects.get(id=id)
                user = intern.user
                
                # Get intern's rewards
                intern_rewards = InternReward.objects.filter(intern=intern)
                all_rewards = Reward.objects.all()
                
                rewards_data = []
                for reward in all_rewards:
                    is_unlocked = intern_rewards.filter(reward=reward).exists()
                    rewards_data.append({
                        "id": reward.id,
                        "title": reward.title,
                        "description": reward.description,
                        "required_donations": float(reward.required_donations),
                        "icon": reward.icon,
                        "unlocked": is_unlocked
                    })
                
                # Get recent donations
                recent_donations = Donation.objects.filter(intern=intern).order_by('-created_at')[:5]
                donations_data = []
                for donation in recent_donations:
                    donations_data.append({
                        "amount": float(donation.amount),
                        "donor_name": donation.donor_name or "Anonymous",
                        "date": donation.created_at.strftime("%Y-%m-%d %H:%M")
                    })
                
                data = {
                    "id": intern.id,
                    "name": user.get_full_name() or user.username,
                    "email": user.email,
                    "referral_code": intern.referral_code,
                    "total_donations": float(intern.total_donations),
                    "rewards": rewards_data,
                    "recent_donations": donations_data,
                    "progress": {
                        "current_level": self.get_current_level(float(intern.total_donations)),
                        "next_milestone": self.get_next_milestone(float(intern.total_donations)),
                        "progress_percentage": self.get_progress_percentage(float(intern.total_donations))
                    }
                }
                
            except Intern.DoesNotExist:
                # Return dummy data for demo
                data = self.get_dummy_intern_data(id)
            
            return Response(data, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {"error": f"Error fetching dashboard data: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def get_dummy_intern_data(self, intern_id):
        """Generate dummy data for demo purposes"""
        names = ["Alice Smith", "Bob Jones", "Charlie Brown", "Diana Prince", "Eve Wilson"]
        name = names[intern_id % len(names)]
        
        total_donations = random.randint(1000, 5000)
        
        return {
            "id": intern_id,
            "name": name,
            "email": f"{name.lower().replace(' ', '.')}@example.com",
            "referral_code": f"{name.split()[0].lower()}{random.randint(1000, 9999)}",
            "total_donations": total_donations,
            "rewards": [
                {
                    "id": 1,
                    "title": "First Donation",
                    "description": "Complete your first donation",
                    "required_donations": 100,
                    "icon": "🎯",
                    "unlocked": total_donations >= 100
                },
                {
                    "id": 2,
                    "title": "Rising Star",
                    "description": "Reach ₹1000 in donations",
                    "required_donations": 1000,
                    "icon": "⭐",
                    "unlocked": total_donations >= 1000
                },
                {
                    "id": 3,
                    "title": "Champion",
                    "description": "Reach ₹2500 in donations",
                    "required_donations": 2500,
                    "icon": "🏆",
                    "unlocked": total_donations >= 2500
                },
                {
                    "id": 4,
                    "title": "Legend",
                    "description": "Reach ₹5000 in donations",
                    "required_donations": 5000,
                    "icon": "👑",
                    "unlocked": total_donations >= 5000
                }
            ],
            "recent_donations": [
                {"amount": 500, "donor_name": "John Doe", "date": "2024-01-15 14:30"},
                {"amount": 250, "donor_name": "Jane Smith", "date": "2024-01-14 10:15"},
                {"amount": 750, "donor_name": "Anonymous", "date": "2024-01-13 16:45"},
            ],
            "progress": {
                "current_level": self.get_current_level(total_donations),
                "next_milestone": self.get_next_milestone(total_donations),
                "progress_percentage": self.get_progress_percentage(total_donations)
            }
        }
    
    def get_current_level(self, donations):
        """Determine current level based on donations"""
        if donations >= 5000:
            return "Legend"
        elif donations >= 2500:
            return "Champion"
        elif donations >= 1000:
            return "Rising Star"
        elif donations >= 100:
            return "Starter"
        else:
            return "Beginner"
    
    def get_next_milestone(self, donations):
        """Get next milestone amount"""
        milestones = [100, 1000, 2500, 5000, 10000]
        for milestone in milestones:
            if donations < milestone:
                return milestone
        return 10000
    
    def get_progress_percentage(self, donations):
        """Calculate progress percentage to next milestone"""
        next_milestone = self.get_next_milestone(donations)
        if next_milestone == 100:
            return (donations / 100) * 100
        elif next_milestone == 1000:
            return ((donations - 100) / 900) * 100
        elif next_milestone == 2500:
            return ((donations - 1000) / 1500) * 100
        elif next_milestone == 5000:
            return ((donations - 2500) / 2500) * 100
        else:
            return ((donations - 5000) / 5000) * 100

class LeaderboardView(APIView):
    """
    API endpoint for leaderboard data
    """
    def get(self, request):
        try:
            # Get data from Firebase or mock data
            leaderboard_data = get_leaderboard_data()
            
            # Add ranking
            for i, entry in enumerate(leaderboard_data):
                entry['rank'] = i + 1
                entry['badge'] = self.get_rank_badge(i + 1)
            
            return Response({
                "leaderboard": leaderboard_data,
                "total_participants": len(leaderboard_data),
                "last_updated": "2024-01-15T10:30:00Z"
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {"error": f"Error fetching leaderboard: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def get_rank_badge(self, rank):
        """Get badge based on rank"""
        if rank == 1:
            return "🥇"
        elif rank == 2:
            return "🥈"
        elif rank == 3:
            return "🥉"
        elif rank <= 10:
            return "🏅"
        else:
            return "🎖️"

class InternStatsView(APIView):
    """
    API endpoint for intern statistics
    """
    def get(self, request, id):
        try:
            # Generate dummy stats for demo
            stats = {
                "total_donations": random.randint(1000, 5000),
                "total_donors": random.randint(10, 50),
                "average_donation": random.randint(100, 500),
                "this_month": {
                    "donations": random.randint(200, 1000),
                    "donors": random.randint(5, 15),
                    "growth": random.randint(-10, 50)
                },
                "donation_trend": [
                    {"month": "Jan", "amount": random.randint(200, 800)},
                    {"month": "Feb", "amount": random.randint(200, 800)},
                    {"month": "Mar", "amount": random.randint(200, 800)},
                    {"month": "Apr", "amount": random.randint(200, 800)},
                    {"month": "May", "amount": random.randint(200, 800)},
                    {"month": "Jun", "amount": random.randint(200, 800)},
                ]
            }
            
            return Response(stats, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {"error": f"Error fetching stats: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class CreateInternView(APIView):
    """
    API endpoint to create a new intern (for demo purposes)
    """
    def post(self, request):
        try:
            name = request.data.get('name')
            email = request.data.get('email')
            
            if not name or not email:
                return Response(
                    {"error": "Name and email are required"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Generate referral code
            referral_code = f"{name.split()[0].lower()}{''.join(random.choices(string.digits, k=4))}"
            
            # For demo, return success without actually creating
            return Response({
                "message": "Intern created successfully",
                "intern": {
                    "id": random.randint(1, 1000),
                    "name": name,
                    "email": email,
                    "referral_code": referral_code,
                    "total_donations": 0
                }
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response(
                {"error": f"Error creating intern: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
