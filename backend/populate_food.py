import os
import random
from pathlib import Path

import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from api.models import Category, FoodItem
from django.conf import settings


SEED_DATA = {
    'Pizza': [
        ('Margherita Pizza', 'Classic tomato, basil, and mozzarella.'),
        ('Farmhouse Pizza', 'Loaded with fresh vegetables and cheese.'),
        ('Pepper Paneer Pizza', 'Spicy paneer cubes with peppers and onion.'),
    ],
    'Burger': [
        ('Classic Veg Burger', 'Crispy patty, lettuce, and house sauce.'),
        ('Cheese Burst Burger', 'Double cheese with a soft toasted bun.'),
        ('Smoky Chicken Burger', 'Grilled chicken with smoky mayo.'),
    ],
    'Pasta': [
        ('Alfredo Pasta', 'Creamy white sauce pasta with herbs.'),
        ('Arrabbiata Pasta', 'Tangy red sauce with chili flakes.'),
        ('Pesto Pasta', 'Fresh basil pesto with parmesan finish.'),
    ],
    'Salad': [
        ('Greek Salad', 'Cucumber, olives, feta, and tomatoes.'),
        ('Caesar Salad', 'Crisp lettuce with creamy dressing.'),
        ('Quinoa Bowl', 'Protein-rich quinoa with mixed veggies.'),
    ],
    'Drinks': [
        ('Cold Coffee', 'Chilled coffee with milk and foam.'),
        ('Lemon Mint Cooler', 'Refreshing citrus and mint drink.'),
        ('Mango Shake', 'Thick mango blend with ice cream.'),
    ],
    'Dessert': [
        ('Chocolate Brownie', 'Warm brownie with rich cocoa flavor.'),
        ('Vanilla Ice Cream', 'Smooth vanilla scoop dessert.'),
        ('Cheesecake Slice', 'Creamy baked cheesecake with crumbs.'),
    ],
}


def get_image_pool():
    image_dir = Path(settings.MEDIA_ROOT) / 'images'
    if not image_dir.exists():
        return []

    preferred = sorted(image_dir.glob('food_*.png'))
    extras = sorted(image_dir.glob('*.jpg')) + sorted(image_dir.glob('*.jpeg')) + sorted(image_dir.glob('*.png'))

    all_files = preferred + [img for img in extras if img not in preferred]
    relative_paths = [f"images/{img.name}" for img in all_files]
    return relative_paths


def seed():
    created_items = 0
    updated_images = 0
    image_pool = get_image_pool()
    image_index = 0

    for category_name, items in SEED_DATA.items():
        category, _ = Category.objects.get_or_create(name=category_name)
        for name, description in items:
            image_path = image_pool[image_index % len(image_pool)] if image_pool else ''
            image_index += 1
            _, created = FoodItem.objects.get_or_create(
                name=name,
                defaults={
                    'description': description,
                    'price': round(random.uniform(120, 480), 2),
                    'category': category,
                    'image': image_path,
                },
            )
            if created:
                created_items += 1

    # Backfill missing images for existing rows so cards are not all using same fallback.
    if image_pool:
        for item in FoodItem.objects.filter(image='') | FoodItem.objects.filter(image__isnull=True):
            item.image = image_pool[image_index % len(image_pool)]
            image_index += 1
            item.save(update_fields=['image'])
            updated_images += 1

    print(f'Seeding complete. Added {created_items} new food items. Updated {updated_images} items with images.')


if __name__ == '__main__':
    seed()
