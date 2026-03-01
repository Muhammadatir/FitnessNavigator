# Contributing to FitnessNavigator

Thank you for your interest in contributing to FitnessNavigator! This document provides guidelines for collaborating on this project.

## Getting Started

### Prerequisites
- Python 3.7+
- Git
- GitHub account

### Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/AZFARULLAHKHAN/fitnessnavigator.git
   cd fitnessnavigator
   ```

2. Install dependencies:
   ```bash
   cd FitnessNavigator
   pip install -r requirements.txt
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Add your API keys to .env file
   ```

4. Run the application:
   ```bash
   python app.py
   ```

## Development Workflow

### Branch Strategy
- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/feature-name` - New features
- `bugfix/bug-description` - Bug fixes
- `hotfix/critical-fix` - Critical production fixes

### Making Changes
1. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and test locally

3. Commit with clear messages:
   ```bash
   git add .
   git commit -m "Add: brief description of changes"
   ```

4. Push to your branch:
   ```bash
   git push origin feature/your-feature-name
   ```

5. Create a Pull Request on GitHub

## Code Standards

### Python Code
- Follow PEP 8 style guidelines
- Use meaningful variable and function names
- Add docstrings for functions and classes
- Keep functions small and focused

### HTML/CSS
- Use semantic HTML elements
- Maintain consistent indentation
- Follow existing CSS naming conventions

### JavaScript
- Use ES6+ features where appropriate
- Add comments for complex logic
- Test functionality across browsers

## Pull Request Guidelines

### Before Submitting
- [ ] Test your changes locally
- [ ] Ensure code follows project standards
- [ ] Update documentation if needed
- [ ] Add/update tests if applicable

### PR Description Template
```
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement

## Testing
- [ ] Tested locally
- [ ] All existing tests pass

## Screenshots (if applicable)
Add screenshots for UI changes
```

## Project Structure

```
FitnessNavigator/
├── FitnessNavigator/
│   ├── app.py              # Main Flask application
│   ├── routes.py           # Application routes
│   ├── utils.py            # Utility functions
│   ├── food_recognition.py # Food scanning features
│   ├── pdf_generator.py    # PDF report generation
│   ├── templates/          # HTML templates
│   ├── static/            # CSS, JS, images
│   └── requirements.txt   # Python dependencies
├── README.md
└── CONTRIBUTING.md
```

## Feature Areas

### Current Features
- Dashboard and progress tracking
- Workout and diet planning
- AI fitness buddy chat
- Meal scanner
- Body tracker
- Social challenges
- PDF report generation

### Areas for Contribution
- Mobile responsiveness improvements
- Additional AI features
- Enhanced food recognition
- Social features expansion
- Performance optimizations
- Testing coverage
- Documentation improvements

## Reporting Issues

### Bug Reports
Include:
- Steps to reproduce
- Expected vs actual behavior
- Browser/OS information
- Screenshots if applicable

### Feature Requests
Include:
- Clear description of the feature
- Use case and benefits
- Possible implementation approach

## Communication

- Use GitHub Issues for bug reports and feature requests
- Use Pull Request comments for code discussions
- Be respectful and constructive in all interactions

## Questions?

If you have questions about contributing, feel free to:
- Open an issue with the "question" label
- Contact the maintainers

Thank you for contributing to FitnessNavigator! 🏋️‍♂️💪