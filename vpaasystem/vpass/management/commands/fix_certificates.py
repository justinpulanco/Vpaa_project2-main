from django.core.management.base import BaseCommand
from vpass.models import Attendance


class Command(BaseCommand):
    help = 'Convert all PNG certificates to PDF format'

    def handle(self, *args, **options):
        # Find all attendances with PNG certificates
        attendances = Attendance.objects.filter(certificate__icontains='.png')
        
        total = attendances.count()
        self.stdout.write(f'Found {total} PNG certificates to convert...\n')
        
        success = 0
        failed = 0
        
        for attendance in attendances:
            try:
                # Delete old PNG certificate
                old_cert = str(attendance.certificate)
                attendance.certificate.delete(save=False)
                
                # Generate new PDF certificate
                if attendance.generate_certificate():
                    success += 1
                    self.stdout.write(self.style.SUCCESS(
                        f'✓ Converted: {old_cert} → {attendance.certificate}'
                    ))
                else:
                    failed += 1
                    self.stdout.write(self.style.ERROR(
                        f'✗ Failed to generate certificate for attendance {attendance.id}'
                    ))
            except Exception as e:
                failed += 1
                self.stdout.write(self.style.ERROR(
                    f'✗ Error converting attendance {attendance.id}: {str(e)}'
                ))
        
        self.stdout.write('\n' + '='*50)
        self.stdout.write(self.style.SUCCESS(f'\n✓ Successfully converted: {success}'))
        if failed > 0:
            self.stdout.write(self.style.ERROR(f'✗ Failed: {failed}'))
        self.stdout.write(f'\nTotal processed: {total}\n')
