from django.db.models.signals import post_save
from django.dispatch import receiver


def try_generate_certificate(attendance):
    
    try:
        has_present = bool(getattr(attendance, 'present', False))
    except Exception:
        has_present = False

    
    has_survey = False
    try:
        manager = getattr(attendance, 'survey_responses', None)
        if manager is not None:
            
            try:
                has_survey = manager.exists()
            except Exception:
               
                try:
                    has_survey = len(list(manager.all())) > 0
                except Exception:
                    has_survey = False
    except Exception:
        has_survey = False

    if has_present and has_survey and not getattr(attendance, 'certificate', None):
        
        from .utils import generate_certificate_image
        try:
            content = generate_certificate_image(attendance)
            
            try:
                attendance.certificate.save(content.name, content)
                attendance.save()
            except Exception:
                
                setattr(attendance, '_generated_certificate_content', content)
        except Exception:
           
            pass


@receiver(post_save)
def attendance_and_survey_post_save(sender, instance, created, **kwargs):
    """
    This single receiver listens to post_save for any model. We check the
    instance class name to run certificate generation only for Attendance or
    SurveyResponse instances.
    """
    model_name = sender.__name__ if hasattr(sender, '__name__') else str(sender)
    
    if model_name in ('Attendance', 'SurveyResponse'):
        try:
            
            if model_name == 'SurveyResponse':
                att = getattr(instance, 'attendance', None)
                if att is not None:
                    try_generate_certificate(att)
            else:  
                try_generate_certificate(instance)
        except Exception:
           
            pass
