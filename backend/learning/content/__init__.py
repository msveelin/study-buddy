"""All course content lives here as plain Python data so it is easy to edit.

Run `python manage.py seed` after changing anything in this package.
"""
from .computer_course import COURSE as COMPUTER
from .mouse_course import COURSE as MOUSE
from .typing_course import COURSE as TYPING
from .files_course import COURSE as FILES
from .internet_course import COURSE as INTERNET
from .settings_course import COURSE as SETTINGS
from .word_course import COURSE as WORD
from .excel_course import COURSE as EXCEL
from .programming_course import COURSE as PROGRAMMING
from .webdev_course import COURSE as WEBDEV

# Order matters: this is the path a complete beginner follows.
COURSES = [COMPUTER, MOUSE, TYPING, FILES, INTERNET, SETTINGS, WORD, EXCEL, PROGRAMMING, WEBDEV]
