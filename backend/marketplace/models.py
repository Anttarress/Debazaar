from django.db import models
from django.contrib.auth.models import User
from django.utils.translation import gettext_lazy as _


class CategoryChoices(models.TextChoices):
    ELECTRONICS = 'electronics', _('Electronics')
    CLOTHING = 'clothing', _('Clothing & Fashion')
    HOME_GARDEN = 'home_garden', _('Home & Garden')
    SPORTS = 'sports', _('Sports & Outdoors')
    BOOKS = 'books', _('Books & Media')
    HEALTH = 'health', _('Health & Beauty')
    TOYS = 'toys', _('Toys & Games')
    AUTOMOTIVE = 'automotive', _('Automotive')
    ART = 'art', _('Art & Collectibles')
    DIGITAL = 'digital', _('Digital Products')
    SERVICES = 'services', _('Services')
    OTHER = 'other', _('Other')


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    telegram_id = models.BigIntegerField(unique=True)
    wallet_address = models.CharField(max_length=42, blank=True, null=True)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.00)
    total_ratings = models.IntegerField(default=0)
    dispute_count = models.IntegerField(default=0)
    total_orders = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    
    @property
    def dispute_rate(self):
        if self.total_orders == 0:
            return 0
        return (self.dispute_count / self.total_orders) * 100

    def __str__(self):
        return f"{self.user.username} (TG: {self.telegram_id})"


class Listing(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('sold', 'Sold'),
    ]
    
    seller = models.ForeignKey(User, on_delete=models.CASCADE, related_name='listings')
    title = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=10, default='USDT')
    token_address = models.CharField(max_length=42)
    file_path = models.CharField(max_length=500, blank=True, null=True)
    metadata_cid = models.CharField(max_length=100, blank=True, null=True)
    image_url = models.TextField(default='')
    image_cid = models.CharField(max_length=100, blank=True, null=True)
    category = models.CharField(max_length=20, choices=CategoryChoices.choices, default=CategoryChoices.OTHER)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} - ${self.price}"


class Order(models.Model):
    STATUS_CHOICES = [
        ('created', 'Created'),
        ('paid', 'Paid'),
        ('delivered', 'Delivered'),
        ('confirmed', 'Confirmed'),
        ('disputed', 'Disputed'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    order_id = models.CharField(max_length=66, unique=True)  # bytes32 as hex
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name='orders')
    buyer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='purchases')
    seller = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sales')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    token_address = models.CharField(max_length=42)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='created')
    escrow_tx_hash = models.CharField(max_length=66, blank=True, null=True)
    delivery_cid = models.CharField(max_length=100, blank=True, null=True)
    deadline = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Order {self.order_id[:8]}... - {self.listing.title}"


class Dispute(models.Model):
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('in_progress', 'In Progress'),
        ('resolved', 'Resolved'),
        ('closed', 'Closed'),
    ]
    
    RESULT_CHOICES = [
        ('buyer_wins', 'Buyer Wins'),
        ('seller_wins', 'Seller Wins'),
        ('partial_refund', 'Partial Refund'),
        ('pending', 'Pending'),
    ]
    
    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name='dispute')
    initiator = models.ForeignKey(User, on_delete=models.CASCADE)
    reason = models.TextField()
    evidence_files = models.JSONField(default=list)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    result = models.CharField(max_length=20, choices=RESULT_CHOICES, default='pending')
    arbitrator_notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    resolved_at = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return f"Dispute for Order {self.order.order_id[:8]}..."


# Mock Smart Contract Functions (placeholders)
class MockSmartContract:
    @staticmethod
    def create_escrow(order_id, seller_address, token_address, amount, deadline):
        """Mock function - returns True for MVP"""
        return True
    
    @staticmethod
    def deposit(order_id, buyer_address, amount):
        """Mock function - returns True for MVP"""
        return True
    
    @staticmethod
    def confirm_delivery(order_id, buyer_address):
        """Mock function - returns True for MVP"""
        return True
    
    @staticmethod
    def release_funds(order_id):
        """Mock function - returns True for MVP"""
        return True
    
    @staticmethod
    def open_dispute(order_id, evidence_uri):
        """Mock function - returns True for MVP"""
        return True
    
    @staticmethod
    def resolve_dispute(order_id, winner_address, seller_share):
        """Mock function - returns True for MVP"""
        return True