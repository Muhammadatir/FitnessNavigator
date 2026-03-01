// BMI Calculator JS

document.addEventListener('DOMContentLoaded', function() {
    // BMI calculation functionality
    const bmiCalculator = document.getElementById('bmi-calculator');
    const heightInput = document.getElementById('height');
    const weightInput = document.getElementById('weight');
    const calculateBmiButton = document.getElementById('calculate-bmi');
    const bmiResult = document.getElementById('bmi-result');
    const bmiValue = document.getElementById('bmi-value');
    const bmiCategory = document.getElementById('bmi-category');
    
    // BMI quick calculator on homepage
    if (bmiCalculator && heightInput && weightInput && calculateBmiButton && bmiResult) {
        calculateBmiButton.addEventListener('click', function() {
            const height = parseFloat(heightInput.value); // height in cm
            const weight = parseFloat(weightInput.value); // weight in kg
            
            if (isNaN(height) || isNaN(weight) || height <= 0 || weight <= 0) {
                alert('Please enter valid height and weight values');
                return;
            }
            
            // Convert height from cm to m
            const heightInMeters = height / 100;
            
            // Calculate BMI
            const bmi = weight / (heightInMeters * heightInMeters);
            const roundedBmi = bmi.toFixed(1);
            
            // Determine BMI category
            let category = '';
            let categoryClass = '';
            
            if (bmi < 18.5) {
                category = 'Underweight';
                categoryClass = 'bmi-underweight';
            } else if (bmi < 25) {
                category = 'Normal weight';
                categoryClass = 'bmi-normal';
            } else if (bmi < 30) {
                category = 'Overweight';
                categoryClass = 'bmi-overweight';
            } else {
                category = 'Obese';
                categoryClass = 'bmi-obese';
            }
            
            // Display the result
            bmiValue.textContent = roundedBmi;
            bmiCategory.textContent = category;
            
            // Clear existing classes and add the appropriate one
            bmiResult.className = 'bmi-result ' + categoryClass;
            
            // Show the result
            bmiResult.style.display = 'block';
        });
    }
    
    // Reset BMI form when input changes
    if (heightInput) {
        heightInput.addEventListener('input', function() {
            if (bmiResult) {
                bmiResult.style.display = 'none';
            }
        });
    }
    
    if (weightInput) {
        weightInput.addEventListener('input', function() {
            if (bmiResult) {
                bmiResult.style.display = 'none';
            }
        });
    }
});
