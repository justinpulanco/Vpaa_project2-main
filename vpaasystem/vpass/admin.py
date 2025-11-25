from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
from .models import Event, Attendee, Attendance, Survey, SurveyResponse, UserProfile

# Register your models here.
class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False
    verbose_name_plural = 'Profile'
    fk_name = 'user'

class CustomUserAdmin(BaseUserAdmin):
    inlines = (UserProfileInline,)
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff', 'get_role')
    list_select_related = ('profile', )

    def get_role(self, instance):
        return instance.profile.get_role_display()
    get_role.short_description = 'Role'

    def get_inline_instances(self, request, obj=None):
        if not obj:
            return list()
        return super(CustomUserAdmin, self).get_inline_instances(request, obj)

class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'start', 'end', 'created_by')
    list_filter = ('start', 'end')
    search_fields = ('title', 'description')

class AttendeeAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'email', 'student_id', 'user')
    search_fields = ('full_name', 'email', 'student_id')

class SurveyAdmin(admin.ModelAdmin):
    list_display = ('title', 'event', 'is_active', 'created_by', 'created_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('title', 'event__title')

# Unregister the default User admin
admin.site.unregister(User)

# Register all models with their custom admin classes
admin.site.register(User, CustomUserAdmin)
admin.site.register(Event, EventAdmin)
admin.site.register(Attendee, AttendeeAdmin)
admin.site.register(Attendance)
admin.site.register(Survey, SurveyAdmin)
admin.site.register(SurveyResponse)