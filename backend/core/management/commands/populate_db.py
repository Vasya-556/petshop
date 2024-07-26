import random
from django.core.management.base import BaseCommand
from core.models import *

class Command(BaseCommand):
    help = 'Populate the database with sample data.'

    def handle(self, *args, **kwargs):
        categories = ['Dogs', 'Cats', 'Birds', 'Reptiles', 'Fish']
        for category_name in categories:
            Category.objects.get_or_create(name=category_name)

        usernames = ['john_doe', 'jane_smith', 'alice_jones', 'bob_brown', 'charlie_davis']
        users = []
        for username in usernames:
            user, created = CustomUser.objects.get_or_create(
                username=username,
                email=f'{username}@example.com',
                password='password123'  
            )
            users.append(user)

        products_data = {
            'Dogs': [
                {'name': 'Golden Retriever', 'description': 'Friendly and devoted dog', 'price': 1000.00, 'stock': 5},
                {'name': 'Bulldog', 'description': 'Calm and courageous breed', 'price': 800.00, 'stock': 3},
                {'name': 'Beagle', 'description': 'Curious and merry dog', 'price': 600.00, 'stock': 4},
                {'name': 'Poodle', 'description': 'Intelligent and trainable', 'price': 900.00, 'stock': 2},
            ],
            'Cats': [
                {'name': 'Persian Cat', 'description': 'Calm and affectionate cat', 'price': 800.00, 'stock': 3},
                {'name': 'Siamese Cat', 'description': 'Vocal and affectionate', 'price': 700.00, 'stock': 5},
                {'name': 'Maine Coon', 'description': 'Large and sociable breed', 'price': 900.00, 'stock': 4},
                {'name': 'Ragdoll', 'description': 'Gentle and friendly', 'price': 950.00, 'stock': 3},
            ],
            'Birds': [
                {'name': 'Cockatiel', 'description': 'Social and playful bird', 'price': 200.00, 'stock': 10},
                {'name': 'Budgerigar', 'description': 'Small and cheerful parakeet', 'price': 50.00, 'stock': 15},
                {'name': 'African Grey', 'description': 'Intelligent and chatty', 'price': 1200.00, 'stock': 2},
            ],
            'Reptiles': [
                {'name': 'Bearded Dragon', 'description': 'Easy to care for reptile', 'price': 300.00, 'stock': 8},
                {'name': 'Ball Python', 'description': 'Gentle and calm snake', 'price': 200.00, 'stock': 5},
                {'name': 'Leopard Gecko', 'description': 'Colorful and hardy lizard', 'price': 150.00, 'stock': 10},
            ],
            'Fish': [
                {'name': 'Betta Fish', 'description': 'Colorful and low maintenance fish', 'price': 20.00, 'stock': 15},
                {'name': 'Goldfish', 'description': 'Classic aquarium fish', 'price': 10.00, 'stock': 20},
                {'name': 'Guppy', 'description': 'Small and colorful fish', 'price': 5.00, 'stock': 25},
            ],
        }

        product_objects = []
        for category_name, product_list in products_data.items():
            category = Category.objects.get(name=category_name)
            for product_data in product_list:
                product, created = Product.objects.get_or_create(
                    p_name=product_data['name'],
                    description=product_data['description'],
                    price=product_data['price'],
                    stock=product_data['stock'],
                    category=category
                )
                product_objects.append(product)

        for user in users:
            cart = Cart.objects.create(user=user)
            product_list = Product.objects.all()

            selected_products = random.sample(list(product_list), k=random.randint(1, 3))  

            for product in selected_products:
                quantity = random.randint(1, 5)  
                CartItem.objects.create(cart=cart, product=product, quantity=quantity)

                rating_value = random.randint(1, 5)
                Rating.objects.get_or_create(user=user, product_id=product, rating=rating_value)

                comments = [
                    "So cute! Look at those big eyes!",
                    "Adorable little fluffball!",
                    "What a playful puppy!",
                    "This kitty is so curious!",
                    "Sweet little face—perfect for cuddles!",
                    "Look at that tail wagging!",
                    "Such a friendly little bunny!",
                    "This fish has vibrant colors!",
                    "What a gentle giant!",
                    "So much personality in this little one!"
                ]

                comment_text = random.choice(comments)  
                Comment.objects.create(author=user, product=product, text=comment_text)

        self.stdout.write(self.style.SUCCESS('Database populated with sample data successfully!'))
