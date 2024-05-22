from django.contrib.auth.models import User
from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class Category(models.Model):
    name = models.CharField(max_length=50)
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name_plural = "Categories"
    
class CustomUser(models.Model):
    STATUS_CHOICES = (
        ('admin', 'Admin'),
        ('user', 'User'),
    )

    username = models.CharField(max_length=20, unique=True)
    email = models.EmailField(max_length=20, unique=True)
    password = models.CharField(max_length=120)
    status = models.CharField(max_length=5, choices=STATUS_CHOICES, default='user')
    profile_image = models.ImageField(upload_to='profile_images/', blank=True, null=True)

    def __str__(self):
        return self.username
    
class Product(models.Model):
    p_name = models.CharField(max_length=20)
    description = models.TextField()
    product_image = models.ImageField(upload_to='product_images/', blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField()
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')

    def __str__(self):
        return self.p_name