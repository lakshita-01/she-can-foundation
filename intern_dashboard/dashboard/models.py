from django.db import models
from django.contrib.auth.models import User

class Intern(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    referral_code = models.CharField(max_length=20, unique=True)
    total_donations = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.get_full_name()} - {self.referral_code}"

class Reward(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    required_donations = models.DecimalField(max_digits=10, decimal_places=2)
    icon = models.CharField(max_length=50, default='🏆')
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.title

class InternReward(models.Model):
    intern = models.ForeignKey(Intern, on_delete=models.CASCADE)
    reward = models.ForeignKey(Reward, on_delete=models.CASCADE)
    unlocked_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('intern', 'reward')
    
    def __str__(self):
        return f"{self.intern.user.get_full_name()} - {self.reward.title}"

class Donation(models.Model):
    intern = models.ForeignKey(Intern, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    donor_name = models.CharField(max_length=100, blank=True)
    donor_email = models.EmailField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"₹{self.amount} - {self.intern.user.get_full_name()}"
