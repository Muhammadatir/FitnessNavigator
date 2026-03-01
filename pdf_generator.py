from reportlab.lib.pagesizes import letter, A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from io import BytesIO
import datetime

def generate_grocery_list(diet_plan, user_data):
    """Generate grocery list from diet plan"""
    grocery_items = {
        'Proteins': {},
        'Vegetables': {},
        'Fruits': {},
        'Grains': {},
        'Dairy': {},
        'Others': {}
    }
    
    # Extract ingredients from diet plan
    for day, meals in diet_plan.items():
        for meal_type, meal_info in meals.items():
            if isinstance(meal_info, dict) and 'meal' in meal_info:
                meal_text = meal_info['meal'].lower()
            else:
                meal_text = str(meal_info).lower()
            
            # Categorize ingredients
            if any(word in meal_text for word in ['chicken', 'fish', 'egg', 'tofu', 'beef', 'turkey', 'salmon']):
                if 'chicken' in meal_text: grocery_items['Proteins']['Chicken breast'] = '1 kg'
                if 'fish' in meal_text or 'salmon' in meal_text: grocery_items['Proteins']['Fish fillets'] = '800g'
                if 'egg' in meal_text: grocery_items['Proteins']['Eggs'] = '12 pieces'
                if 'tofu' in meal_text: grocery_items['Proteins']['Tofu'] = '400g'
                if 'beef' in meal_text: grocery_items['Proteins']['Lean beef'] = '600g'
                if 'turkey' in meal_text: grocery_items['Proteins']['Turkey'] = '500g'
            
            if any(word in meal_text for word in ['spinach', 'broccoli', 'carrot', 'bell pepper', 'tomato', 'cucumber']):
                grocery_items['Vegetables']['Mixed vegetables'] = '2 kg'
                grocery_items['Vegetables']['Leafy greens'] = '500g'
                grocery_items['Vegetables']['Tomatoes'] = '1 kg'
                grocery_items['Vegetables']['Onions'] = '500g'
            
            if any(word in meal_text for word in ['apple', 'banana', 'berries', 'orange', 'fruit']):
                grocery_items['Fruits']['Bananas'] = '1 dozen'
                grocery_items['Fruits']['Apples'] = '1 kg'
                grocery_items['Fruits']['Mixed berries'] = '500g'
                grocery_items['Fruits']['Oranges'] = '6 pieces'
            
            if any(word in meal_text for word in ['rice', 'oats', 'bread', 'quinoa', 'pasta']):
                grocery_items['Grains']['Brown rice'] = '1 kg'
                grocery_items['Grains']['Oats'] = '500g'
                grocery_items['Grains']['Whole grain bread'] = '2 loaves'
                if 'quinoa' in meal_text: grocery_items['Grains']['Quinoa'] = '500g'
                if 'pasta' in meal_text: grocery_items['Grains']['Whole grain pasta'] = '500g'
            
            if any(word in meal_text for word in ['milk', 'yogurt', 'cheese']):
                grocery_items['Dairy']['Greek yogurt'] = '1 kg'
                grocery_items['Dairy']['Milk'] = '2 liters'
                if 'cheese' in meal_text: grocery_items['Dairy']['Cheese'] = '200g'
            
            if any(word in meal_text for word in ['nuts', 'oil', 'honey', 'spices']):
                grocery_items['Others']['Mixed nuts'] = '300g'
                grocery_items['Others']['Olive oil'] = '500ml'
                grocery_items['Others']['Honey'] = '250g'
                grocery_items['Others']['Spices & herbs'] = 'As needed'
    
    return grocery_items

def create_diet_pdf(user_data, diet_plan):
    """Create PDF for diet plan"""
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4)
    styles = getSampleStyleSheet()
    story = []
    
    # Title
    title_style = ParagraphStyle('CustomTitle', parent=styles['Heading1'], 
                                fontSize=24, spaceAfter=30, textColor=colors.blue)
    story.append(Paragraph("🍽️ Personalized Diet Plan", title_style))
    story.append(Spacer(1, 20))
    
    # User info
    user_info = f"""
    <b>Name:</b> User<br/>
    <b>Age:</b> {user_data['age']} years<br/>
    <b>Gender:</b> {user_data['gender'].title()}<br/>
    <b>Height:</b> {user_data['height']} cm<br/>
    <b>Weight:</b> {user_data['weight']} kg<br/>
    <b>BMI:</b> {user_data['bmi']:.1f} ({user_data['bmi_category']})<br/>
    <b>Food Preference:</b> {user_data['food_preference'].title()}<br/>
    <b>Generated on:</b> {datetime.datetime.now().strftime('%B %d, %Y')}
    """
    story.append(Paragraph(user_info, styles['Normal']))
    story.append(Spacer(1, 20))
    
    # Diet plan
    for day, meals in diet_plan.items():
        story.append(Paragraph(f"<b>{day}</b>", styles['Heading2']))
        
        for meal_type, meal_info in meals.items():
            if isinstance(meal_info, dict):
                meal_text = meal_info.get('meal', 'Not specified')
                details = meal_info.get('details', '')
                calories = meal_info.get('calories', '')
            else:
                meal_text = str(meal_info)
                details = ''
                calories = ''
            
            story.append(Paragraph(f"<b>{meal_type.title()}:</b> {meal_text}", styles['Normal']))
            if details:
                story.append(Paragraph(f"<i>{details}</i>", styles['Normal']))
            if calories:
                story.append(Paragraph(f"<i>{calories}</i>", styles['Normal']))
            story.append(Spacer(1, 10))
        
        story.append(Spacer(1, 15))
    
    doc.build(story)
    buffer.seek(0)
    return buffer

def create_workout_pdf(user_data, workout_plan):
    """Create PDF for workout plan"""
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4)
    styles = getSampleStyleSheet()
    story = []
    
    # Title
    title_style = ParagraphStyle('CustomTitle', parent=styles['Heading1'], 
                                fontSize=24, spaceAfter=30, textColor=colors.red)
    story.append(Paragraph("💪 Personalized Workout Plan", title_style))
    story.append(Spacer(1, 20))
    
    # User info
    user_info = f"""
    <b>Name:</b> User<br/>
    <b>Age:</b> {user_data['age']} years<br/>
    <b>Gender:</b> {user_data['gender'].title()}<br/>
    <b>Intensity Level:</b> {user_data['intensity'].title()}<br/>
    <b>Generated on:</b> {datetime.datetime.now().strftime('%B %d, %Y')}
    """
    story.append(Paragraph(user_info, styles['Normal']))
    story.append(Spacer(1, 20))
    
    # Workout plan
    for week, days in workout_plan.items():
        story.append(Paragraph(f"<b>{week}</b>", styles['Heading2']))
        
        for day, workout in days.items():
            story.append(Paragraph(f"<b>{day} - {workout['focus']}</b>", styles['Heading3']))
            
            if 'exercises' in workout:
                for exercise in workout['exercises']:
                    if isinstance(exercise, dict):
                        name = exercise.get('name', 'Exercise')
                        details = exercise.get('details', '')
                        story.append(Paragraph(f"• <b>{name}:</b> {details}", styles['Normal']))
                    else:
                        story.append(Paragraph(f"• {exercise}", styles['Normal']))
            
            if 'notes' in workout:
                story.append(Paragraph(f"<i>Notes: {workout['notes']}</i>", styles['Normal']))
            
            story.append(Spacer(1, 15))
    
    doc.build(story)
    buffer.seek(0)
    return buffer

def create_grocery_pdf(grocery_list, user_data):
    """Create PDF for grocery list"""
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4)
    styles = getSampleStyleSheet()
    story = []
    
    # Title
    title_style = ParagraphStyle('CustomTitle', parent=styles['Heading1'], 
                                fontSize=24, spaceAfter=30, textColor=colors.green)
    story.append(Paragraph("🛒 Weekly Grocery List", title_style))
    story.append(Spacer(1, 20))
    
    # User info
    user_info = f"""
    <b>Diet Plan for:</b> {user_data['gender'].title()}, {user_data['age']} years<br/>
    <b>Food Preference:</b> {user_data['food_preference'].title()}<br/>
    <b>Generated on:</b> {datetime.datetime.now().strftime('%B %d, %Y')}<br/>
    <b>Valid for:</b> 7 days
    """
    story.append(Paragraph(user_info, styles['Normal']))
    story.append(Spacer(1, 20))
    
    # Grocery categories
    for category, items in grocery_list.items():
        if items:  # Only show categories with items
            story.append(Paragraph(f"<b>{category}</b>", styles['Heading2']))
            
            # Create table for items
            data = [['Item', 'Quantity']]
            for item, quantity in items.items():
                data.append([item, quantity])
            
            table = Table(data, colWidths=[3*inch, 1.5*inch])
            table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, 0), 12),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
                ('GRID', (0, 0), (-1, -1), 1, colors.black)
            ]))
            
            story.append(table)
            story.append(Spacer(1, 20))
    
    # Shopping tips
    story.append(Paragraph("<b>Shopping Tips:</b>", styles['Heading2']))
    tips = [
        "• Buy fresh vegetables and fruits for better nutrition",
        "• Choose lean cuts of meat and fish",
        "• Opt for whole grain products when possible",
        "• Check expiry dates, especially for dairy products",
        "• Consider buying in bulk for non-perishable items"
    ]
    
    for tip in tips:
        story.append(Paragraph(tip, styles['Normal']))
    
    doc.build(story)
    buffer.seek(0)
    return buffer