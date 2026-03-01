from utils import generate_diet_plan

# Test the diet plan generation
test_data = {
    'gender': 'male',
    'food_preference': 'veg',
    'bmi_category': 'Normal weight'
}

diet_plan = generate_diet_plan(test_data['gender'], test_data['food_preference'], test_data['bmi_category'])

print("Generated diet plan keys:", list(diet_plan.keys()))
print("\nFull diet plan:")
for day, meals in diet_plan.items():
    print(f"\n{day}:")
    print(f"  Breakfast: {meals['breakfast']['meal']}")
    print(f"  Lunch: {meals['lunch']['meal']}")
    print(f"  Dinner: {meals['dinner']['meal']}")