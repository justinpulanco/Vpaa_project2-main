# Contributing to VPAA System

## Welcome Contributors! 🎉

Thank you for your interest in contributing to the VPAA System. This document provides guidelines and information for contributors.

## Code of Conduct

- Be respectful and inclusive
- Help others learn and grow
- Focus on constructive feedback
- Maintain professionalism

## Getting Started

### 1. Fork the Repository
```bash
git clone https://github.com/[your-username]/Vpaa_project2.git
cd Vpaa_project2
```

### 2. Set Up Development Environment
Follow the installation guide in [README.md](README.md)

### 3. Create a Branch
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

## Development Workflow

### Branch Naming Convention
- `feature/feature-name` - New features
- `fix/bug-description` - Bug fixes
- `docs/documentation-update` - Documentation changes
- `refactor/component-name` - Code refactoring

### Commit Message Format
```
type(scope): description

[optional body]

[optional footer]
```

Examples:
```
feat(auth): add JWT token refresh functionality
fix(qr): resolve QR scanner camera permission issue
docs(api): update API documentation for events endpoint
```

### Code Style Guidelines

#### Frontend (React)
- Use functional components with hooks
- Follow ESLint configuration
- Use meaningful component and variable names
- Add PropTypes for type checking
- Write unit tests for components

```javascript
// Good
const EventCard = ({ event, onSelect }) => {
  const handleClick = () => {
    onSelect(event.id);
  };

  return (
    <div className="event-card" onClick={handleClick}>
      <h3>{event.title}</h3>
      <p>{event.description}</p>
    </div>
  );
};
```

#### Backend (Django)
- Follow PEP 8 style guide
- Use descriptive function and variable names
- Add docstrings to functions and classes
- Write unit tests for models and views
- Use Django best practices

```python
# Good
class Event(models.Model):
    """Model representing an event/class session."""
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def generate_qr_code(self):
        """Generate QR code for event check-in."""
        # Implementation here
        pass
```

## Testing Requirements

### Before Submitting
- [ ] All existing tests pass
- [ ] New features have corresponding tests
- [ ] Code follows style guidelines
- [ ] Documentation is updated if needed

### Running Tests
```bash
# Frontend tests
cd frontend
npm test

# Backend tests
cd vpaasystem
python manage.py test
```

## Pull Request Process

### 1. Update Your Branch
```bash
git checkout main
git pull origin main
git checkout your-branch
git rebase main
```

### 2. Create Pull Request
- Use descriptive title
- Fill out PR template
- Link related issues
- Add screenshots for UI changes

### 3. PR Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring

## Testing
- [ ] Tests pass locally
- [ ] Added new tests if needed

## Screenshots (if applicable)
[Add screenshots here]

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
```

## Issue Reporting

### Bug Reports
Include:
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots/error messages
- Environment details

### Feature Requests
Include:
- Problem description
- Proposed solution
- Alternative solutions considered
- Additional context

## Development Setup Tips

### Useful Commands
```bash
# Start both frontend and backend
npm run dev  # (if you have a dev script)

# Reset database
python manage.py flush
python manage.py migrate

# Create test data
python manage.py loaddata fixtures/test_data.json
```

### Environment Variables
Create `.env` files for local development:

**Backend (.env)**
```
SECRET_KEY=your-dev-secret-key
DEBUG=True
DATABASE_URL=sqlite:///db.sqlite3
```

**Frontend (.env)**
```
REACT_APP_API_URL=http://localhost:8000/api
```

## Documentation

### When to Update Documentation
- Adding new features
- Changing API endpoints
- Modifying installation process
- Adding new dependencies

### Documentation Files
- `README.md` - Main project documentation
- `API_DOCUMENTATION.md` - API reference
- `DEPLOYMENT.md` - Deployment instructions
- `SECURITY.md` - Security information

## Getting Help

### Resources
- Django Documentation: https://docs.djangoproject.com/
- React Documentation: https://reactjs.org/docs/
- Project Issues: [GitHub Issues](link-to-issues)

### Contact
- Create an issue for bugs/features
- Discussion forum: [Link if available]
- Email: [your-email@example.com]

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

Thank you for contributing to VPAA System! 🚀