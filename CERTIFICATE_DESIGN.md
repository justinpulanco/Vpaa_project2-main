# Certificate Design 📜

## ✅ Updated Certificate with Inspirational Message!

---

## Certificate Layout:

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│         HOLY CROSS OF DAVAO COLLEGE                 │
│      Vice President for Academic Affairs            │
│                                                     │
│              ═══ CERTIFICATE ═══                    │
│                OF ACHIEVEMENT                       │
│              ─────────────────                      │
│                                                     │
│           This is to certify that                   │
│                                                     │
│              JUAN DELA CRUZ                         │
│                                                     │
│      has successfully attended the event:           │
│                                                     │
│          "Python Workshop 2025"                     │
│                                                     │
│  Your participation and dedication to learning      │
│              inspire us all.                        │
│  May the knowledge you've gained today empower      │
│         you to reach new heights                    │
│  and make a positive impact in your community       │
│              and beyond.                            │
│  Continue to pursue excellence in all your          │
│              endeavors!                             │
│                                                     │
│          Date: December 03, 2025                    │
│                                                     │
│              ─────────────                          │
│           Authorized Signature                      │
│      Holy Cross of Davao College                    │
│   Vice President for Academic Affairs               │
│                                                     │
│         Certificate ID: 12345                       │
│  This certificate is proof of attendance and        │
│         completion of the event.                    │
└─────────────────────────────────────────────────────┘
```

---

## Features:

### 🎨 Design Elements:
- ✅ **HCDC Header** - School name and VPAA office
- ✅ **Elegant Border** - Blue decorative border
- ✅ **Circular Background** - Subtle light blue circle
- ✅ **Professional Typography** - Multiple font styles and sizes
- ✅ **Color Scheme** - HCDC maroon, blue, and gray tones

### 📝 Content:
- ✅ **Recipient Name** - Bold and prominent
- ✅ **Event Title** - Clearly displayed
- ✅ **Inspirational Message** - 4-line motivational speech
- ✅ **Date** - Event date
- ✅ **Signature Section** - HCDC VPAA authorization
- ✅ **Certificate ID** - Unique identifier
- ✅ **Watermark** - "VPAA SYSTEM" diagonal watermark

---

## Inspirational Message:

```
"Your participation and dedication to learning inspire us all.
May the knowledge you've gained today empower you to reach new heights
and make a positive impact in your community and beyond.
Continue to pursue excellence in all your endeavors!"
```

---

## Colors Used:

- **HCDC Maroon**: RGB(0.6, 0.0, 0.15) - School branding
- **Certificate Blue**: RGB(0.1, 0.3, 0.6) - Main accents
- **Border Blue**: RGB(0.2, 0.4, 0.7) - Decorative elements
- **Text Gray**: RGB(0.3, 0.3, 0.3) - Body text
- **Background**: RGB(0.95, 0.95, 0.95) - Light gray

---

## How to Test:

1. **Complete event flow** (Time In → Time Out → Survey)
2. **Download certificate**
3. **Open PDF** - See the beautiful design!

---

## To Customize Further:

Edit `vpaasystem/vpass/models.py` in the `generate_certificate()` function:

### Change Message:
```python
message_lines = [
    "Your custom message line 1",
    "Your custom message line 2",
    "Your custom message line 3",
    "Your custom message line 4"
]
```

### Change Colors:
```python
c.setFillColorRGB(0.6, 0.0, 0.15)  # Red, Green, Blue (0-1)
```

### Change Fonts:
```python
c.setFont('Helvetica-Bold', 24)  # Font name, size
```

---

## Sample Certificate Names:

The certificate will show:
- **Full Name**: From attendee registration
- **Event Title**: From event details
- **Date**: Event start date
- **Certificate ID**: Unique attendance ID

---

**The certificate now has a beautiful inspirational message!** 🎓✨

Restart Django server to apply changes:
```bash
cd vpaasystem
python manage.py runserver 0.0.0.0:8000
```
