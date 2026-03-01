# Team Collaboration Guide

## Quick Setup for New Team Members
```bash
git clone https://github.com/AZFARULLAHKHAN/fitnessnavigator.git
cd fitnessnavigator
pip install -r requirements_clean.txt
cp .env.example .env
# Add GEMINI_API_KEY to .env
python app.py
```

## Workflow
1. **Create Issue** - Use templates for bugs/features
2. **Create Branch** - `git checkout -b feature/issue-name`
3. **Develop** - Make changes, test locally
4. **Pull Request** - Use PR template, request review
5. **Review** - Team reviews code
6. **Merge** - After approval

## Branch Naming
- `feature/feature-name` - New features
- `bugfix/bug-description` - Bug fixes
- `hotfix/critical-fix` - Critical fixes

## Code Review Checklist
- [ ] Code follows Python PEP 8
- [ ] Functions have docstrings
- [ ] No hardcoded API keys
- [ ] Features tested locally
- [ ] Documentation updated

## Team Roles
- **Maintainer**: @AZFARULLAHKHAN
- **Contributors**: Add team members here
- **Reviewers**: Assign code reviewers