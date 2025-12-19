from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
import logging

logger = logging.getLogger(__name__)

def custom_exception_handler(exc, context):
    """
    Custom exception handler that provides more user-friendly error messages
    """
    response = exception_handler(exc, context)
    
    if response is not None:
        # Log the error for debugging
        logger.error(f"API Error: {exc} - Context: {context}")
        
        # Create user-friendly error messages
        error_messages = {
            400: "Bad request. Please check your input data.",
            401: "Authentication required. Please log in.",
            403: "Permission denied. You don't have access to this resource.",
            404: "Resource not found.",
            405: "Method not allowed.",
            429: "Too many requests. Please try again later.",
            500: "Internal server error. Please try again later.",
        }
        
        status_code = response.status_code
        
        # Handle validation errors specially
        if status_code == 400 and hasattr(exc, 'detail'):
            if isinstance(exc.detail, dict):
                # Field-specific validation errors
                field_errors = {}
                for field, errors in exc.detail.items():
                    if isinstance(errors, list):
                        field_errors[field] = errors[0] if errors else "Invalid value"
                    else:
                        field_errors[field] = str(errors)
                
                custom_response = {
                    'success': False,
                    'message': "Validation failed",
                    'errors': field_errors,
                    'status_code': status_code
                }
            else:
                custom_response = {
                    'success': False,
                    'message': str(exc.detail),
                    'status_code': status_code
                }
        else:
            # Generic error response
            custom_response = {
                'success': False,
                'message': error_messages.get(status_code, str(exc)),
                'status_code': status_code
            }
        
        response.data = custom_response
    
    return response