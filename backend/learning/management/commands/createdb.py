"""Create the MySQL database if it does not exist yet (uses the credentials in settings)."""
from django.conf import settings
from django.core.management.base import BaseCommand
import MySQLdb


class Command(BaseCommand):
    help = "Create the MySQL database named in settings if missing."
    requires_system_checks = []

    def handle(self, *args, **options):
        db = settings.DATABASES["default"]
        conn = MySQLdb.connect(host=db["HOST"], port=int(db["PORT"]), user=db["USER"], passwd=db["PASSWORD"])
        cur = conn.cursor()
        cur.execute(
            f"CREATE DATABASE IF NOT EXISTS `{db['NAME']}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"
        )
        conn.close()
        self.stdout.write(self.style.SUCCESS(f"Database {db['NAME']} is ready."))
