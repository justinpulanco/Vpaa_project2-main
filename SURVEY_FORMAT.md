# How to Create Surveys in Django Admin

## Survey Questions Format

When creating a survey in Django Admin, the **questions** field must be in this format:

```json
[
  {
    "question": "How satisfied are you with the event?",
    "type": "rating"
  },
  {
    "question": "What did you like most?",
    "type": "text"
  },
  {
    "question": "Would you attend again?",
    "type": "rating"
  }
]
```

## Field Types:
- **"rating"** - Shows dropdown with 1-5 rating
- **"text"** - Shows text input box

## Steps to Create Survey:

1. Go to Django Admin: http://localhost:8000/admin/
2. Click **Surveys** → **Add Survey**
3. Fill in:
   - **Title**: Survey name
   - **Event**: Select the event
   - **Is active**: Check this box
   - **Questions**: Paste the JSON format above
4. Click **Save**

## Example Survey:

```json
[
  {
    "question": "Rate the event overall",
    "type": "rating"
  },
  {
    "question": "What can we improve?",
    "type": "text"
  },
  {
    "question": "Rate the venue",
    "type": "rating"
  }
]
```

## ✅ I Already Fixed Testing1 Survey!

The survey for "Testing1" event now has 3 questions:
1. How satisfied are you with the event? (rating)
2. What did you like most? (text)
3. Would you attend again? (rating)

Just refresh the frontend and it will show!
