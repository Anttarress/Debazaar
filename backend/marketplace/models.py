from django.db import models
from django.contrib.auth.models import User
from django.utils.translation import gettext_lazy as _


class CategoryChoices(models.TextChoices):
    # Educational Content
    ONLINE_COURSES = 'online_courses', _('Online Courses & Training')
    EBOOKS_GUIDES = 'ebooks_guides', _('E-books & Guides')
    RESEARCH_REPORTS = 'research_reports', _('Research Reports & Playbooks')
    CHEAT_SHEETS = 'cheat_sheets', _('Cheat Sheets & Templates')
    
    # Creative Assets
    GRAPHIC_DESIGN = 'graphic_design', _('Graphic Design Templates')
    WEBSITE_THEMES = 'website_themes', _('Website Themes & UI Kits')
    STOCK_MEDIA = 'stock_media', _('Stock Photography & Illustrations')
    VIDEO_TEMPLATES = 'video_templates', _('Video Editing Templates')
    
    # Software & Development
    CODE_SCRIPTS = 'code_scripts', _('Scripts & Code Snippets')
    DEV_TOOLS = 'dev_tools', _('Developer Tools & Plugins')
    EXTENSIONS = 'extensions', _('Browser Extensions & Add-ons')
    
    # Business & Productivity
    SPREADSHEETS = 'spreadsheets', _('Spreadsheets & Dashboards')
    BUSINESS_TEMPLATES = 'business_templates', _('Business Templates & Documents')
    MARKETING_KITS = 'marketing_kits', _('Marketing Kits & Creatives')
    AUTOMATION_WORKFLOWS = 'automation_workflows', _('Automation Workflows')
    
    # Digital Services
    CONSULTING = 'consulting', _('Consulting & Advisory')
    CUSTOM_DEVELOPMENT = 'custom_development', _('Custom Development')
    DESIGN_SERVICES = 'design_services', _('Design Services')
    
    # Other
    OTHER = 'other', _('Other Digital Products')


class CurrencyChoices(models.TextChoices):
    USDT = 'USDT', _('Tether USD')
    USDC = 'USDC', _('USD Coin')
    BTC = 'BTC', _('Bitcoin')


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
    
    DELIVERY_METHOD_CHOICES = [
        ('file_download', 'File Download'),
        ('encrypted_link', 'Encrypted Download Link'),
        ('streaming_access', 'Streaming Access'),
        ('repository_access', 'Repository Access'),
        ('email_delivery', 'Email Delivery'),
        ('custom_delivery', 'Custom Delivery Method'),
    ]
    
    ARBITRATION_METHOD_CHOICES = [
        ('file_hash_verification', 'File Hash Verification'),
        ('content_audit', 'Content Audit'),
        ('usage_verification', 'Usage Verification'),
        ('expert_review', 'Expert Review'),
        ('community_voting', 'Community Voting'),
        ('automated_testing', 'Automated Testing'),
    ]
    
    seller = models.ForeignKey(User, on_delete=models.CASCADE, related_name='listings')
    title = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=18, decimal_places=8, help_text="Price with up to 8 decimal places for precise crypto amounts")
    currency = models.CharField(max_length=10, choices=CurrencyChoices.choices, default=CurrencyChoices.USDT)
    token_address = models.CharField(max_length=42)
    file_path = models.CharField(max_length=500, blank=True, null=True)
    metadata_cid = models.CharField(max_length=100, blank=True, null=True)
    image_url = models.TextField(default='')
    image_cid = models.CharField(max_length=100, blank=True, null=True)
    category = models.CharField(max_length=30, choices=CategoryChoices.choices, default=CategoryChoices.OTHER)
    delivery_method = models.CharField(max_length=20, choices=DELIVERY_METHOD_CHOICES, default='file_download')
    arbitration_method = models.CharField(max_length=25, choices=ARBITRATION_METHOD_CHOICES, default='file_hash_verification')
    file_hash = models.CharField(max_length=64, blank=True, null=True, help_text="SHA-256 hash for file verification")
    access_duration_days = models.IntegerField(default=30, help_text="Number of days buyer has access to content")
    requires_license_key = models.BooleanField(default=False, help_text="Whether product requires license key activation")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def get_default_delivery_method(self):
        """Get default delivery method based on category"""
        category_delivery_map = {
            CategoryChoices.ONLINE_COURSES: 'streaming_access',
            CategoryChoices.EBOOKS_GUIDES: 'encrypted_link',
            CategoryChoices.RESEARCH_REPORTS: 'encrypted_link',
            CategoryChoices.CHEAT_SHEETS: 'file_download',
            CategoryChoices.GRAPHIC_DESIGN: 'encrypted_link',
            CategoryChoices.WEBSITE_THEMES: 'repository_access',
            CategoryChoices.STOCK_MEDIA: 'encrypted_link',
            CategoryChoices.VIDEO_TEMPLATES: 'encrypted_link',
            CategoryChoices.CODE_SCRIPTS: 'repository_access',
            CategoryChoices.DEV_TOOLS: 'repository_access',
            CategoryChoices.EXTENSIONS: 'repository_access',
            CategoryChoices.SPREADSHEETS: 'encrypted_link',
            CategoryChoices.BUSINESS_TEMPLATES: 'encrypted_link',
            CategoryChoices.MARKETING_KITS: 'encrypted_link',
            CategoryChoices.AUTOMATION_WORKFLOWS: 'custom_delivery',
            CategoryChoices.CONSULTING: 'custom_delivery',
            CategoryChoices.CUSTOM_DEVELOPMENT: 'custom_delivery',
            CategoryChoices.DESIGN_SERVICES: 'custom_delivery',
        }
        return category_delivery_map.get(self.category, 'file_download')
    
    def get_default_arbitration_method(self):
        """Get default arbitration method based on category"""
        category_arbitration_map = {
            CategoryChoices.ONLINE_COURSES: 'usage_verification',
            CategoryChoices.EBOOKS_GUIDES: 'file_hash_verification',
            CategoryChoices.RESEARCH_REPORTS: 'content_audit',
            CategoryChoices.CHEAT_SHEETS: 'file_hash_verification',
            CategoryChoices.GRAPHIC_DESIGN: 'content_audit',
            CategoryChoices.WEBSITE_THEMES: 'automated_testing',
            CategoryChoices.STOCK_MEDIA: 'content_audit',
            CategoryChoices.VIDEO_TEMPLATES: 'content_audit',
            CategoryChoices.CODE_SCRIPTS: 'automated_testing',
            CategoryChoices.DEV_TOOLS: 'automated_testing',
            CategoryChoices.EXTENSIONS: 'automated_testing',
            CategoryChoices.SPREADSHEETS: 'usage_verification',
            CategoryChoices.BUSINESS_TEMPLATES: 'content_audit',
            CategoryChoices.MARKETING_KITS: 'content_audit',
            CategoryChoices.AUTOMATION_WORKFLOWS: 'expert_review',
            CategoryChoices.CONSULTING: 'expert_review',
            CategoryChoices.CUSTOM_DEVELOPMENT: 'expert_review',
            CategoryChoices.DESIGN_SERVICES: 'expert_review',
        }
        return category_arbitration_map.get(self.category, 'file_hash_verification')
    
    def save(self, *args, **kwargs):
        # Set default delivery and arbitration methods if not specified
        if not self.delivery_method:
            self.delivery_method = self.get_default_delivery_method()
        if not self.arbitration_method:
            self.arbitration_method = self.get_default_arbitration_method()
        super().save(*args, **kwargs)

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
    amount = models.DecimalField(max_digits=18, decimal_places=8, help_text="Order amount with up to 8 decimal places")
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