from django.core.files.base import ContentFile
import os


def generate_certificate_image(attendance, template_text=None):
    """
    Generate a simple certificate image using PIL and return a Django ContentFile ready to save.

    This function does **not** access Django settings at import time. It resolves
    font paths relative to this file and performs local imports for Pillow/io so
    importing the module is safe in lightweight/test environments.
    """
    
    import io
    from PIL import Image, ImageDraw, ImageFont

    
    width, height = 1200, 850
    image = Image.new('RGB', (width, height), color=(255, 255, 255))
    draw = ImageDraw.Draw(image)

    
    try:
        app_dir = os.path.dirname(__file__)
        font_path = os.path.join(app_dir, '..', 'fonts', 'OpenSans-Bold.ttf')
        
        font_path = os.path.abspath(font_path)
        if os.path.exists(font_path):
            title_font = ImageFont.truetype(font_path, 48)
            name_font = ImageFont.truetype(font_path, 60)
            body_font = ImageFont.truetype(font_path, 28)
        else:
            raise FileNotFoundError
    except Exception:
        title_font = ImageFont.load_default()
        name_font = ImageFont.load_default()
        body_font = ImageFont.load_default()

    
    draw.text((60, 60), "Certificate of Attendance", font=title_font, fill=(0, 0, 0))

    
    name_text = getattr(attendance.attendee, 'full_name', str(attendance.attendee))
   
    w, h = draw.textsize(name_text, font=name_font)
    draw.text(((width - w) / 2, 250), name_text, font=name_font, fill=(0, 0, 128))

    
    ev_title = getattr(attendance.event, 'title', str(attendance.event))
    ev_text = f"has attended the event: {ev_title}"
    w2, _ = draw.textsize(ev_text, font=body_font)
    draw.text(((width - w2) / 2, 350), ev_text, font=body_font, fill=(0, 0, 0))

    date_text = ''
    try:
        date_text = attendance.timestamp.strftime('%B %d, %Y')
    except Exception:
        date_text = ''

    if date_text:
        draw.text(((width - draw.textsize(date_text, font=body_font)[0]) / 2, 400), date_text, font=body_font)

    
    if template_text:
        draw.text((60, 480), template_text, font=body_font)

   
    buffer = io.BytesIO()
    image.save(buffer, format='PNG')
    buffer.seek(0)
    
    fname = f'certificate_{getattr(attendance, "id", "temp")}.png'
    return ContentFile(buffer.read(), name=fname)