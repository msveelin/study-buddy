"""Course 5: Windows Settings and Housekeeping. Uses a built-in pretend Settings app.

"settings" lessons: data = {"tasks": [{"instruction", "check"}]}
checks: wallpaper {value}, theme {value: light|dark}, brightnessMin {value}, textScale {value},
        wifi {ssid}, language {value}, uninstalled {app}, notUninstalled {app}, updated,
        printerDefault {name}, nightLight
"""


def settings_lesson(slug, title, intro, tasks, minutes=5):
    return {"slug": slug, "title": title, "kind": "settings", "minutes": minutes, "content": intro,
            "data": {"tasks": tasks}}


COURSE = {
    "slug": "settings",
    "title": "Settings and Housekeeping",
    "icon": "⚙️",
    "description": "Make the computer yours: wallpaper, text size, brightness, Wi-Fi, keyboard language, "
                   "installing and removing programs, updates and printers.",
    "modules": [
        {
            "title": "Making it comfortable",
            "lessons": [
                {
                    "slug": "settings-welcome",
                    "title": "The Settings app",
                    "kind": "reading",
                    "minutes": 4,
                    "content": """
# Settings

Almost everything about how the computer looks and behaves is changed in one place: the **Settings** app.

## Opening it

- Click **Start ⊞**, then the **gear icon ⚙️**, or
- Press **⊞ Win + I** together, or
- Click Start and type **settings**.

## Finding your way

Settings has a list of **categories** down the left side. The ones you will use:

| Category | What is inside |
|----------|----------------|
| **System** | Display (brightness, text size), sound, notifications, power, storage. |
| **Bluetooth & devices** | Printers, mouse, keyboard, headphones. |
| **Network & internet** | Wi-Fi. |
| **Personalisation** | Wallpaper, colours, light or dark mode, the lock screen. |
| **Apps** | The programs that are installed. Remove the ones you do not want. |
| **Accounts** | Your name, picture and sign-in PIN. |
| **Time & language** | Clock, region, keyboard language. |
| **Accessibility** | Bigger text, magnifier, narrator, high contrast. |
| **Windows Update** | Updates. |

There is a **search box** at the top left. Type what you want, such as *wallpaper* or *brightness*, and Settings jumps straight there.

## Nothing here is dangerous

You cannot break the computer by changing a setting. Every change can be changed back. Explore.

The practice lessons use a pretend Settings app that looks like the real one.
""",
                },
                settings_lesson("settings-personalise", "Practice: wallpaper and dark mode",
                                "Open **Personalisation** in the pretend Settings app. Pick a background picture, then choose between light and dark mode.",
                                [
                                    {"instruction": "Change the desktop background to Mountains.", "check": {"type": "wallpaper", "value": "Mountains"}},
                                    {"instruction": "Switch to Dark mode.", "check": {"type": "theme", "value": "dark"}},
                                    {"instruction": "Switch back to Light mode.", "check": {"type": "theme", "value": "light"}},
                                ], minutes=4),
                settings_lesson("settings-display", "Practice: brightness and text size",
                                "Open **System > Display**. Drag the brightness slider, and choose a bigger text size. Bigger text is the single most useful setting for many people.",
                                [
                                    {"instruction": "Set the brightness to at least 70%.", "check": {"type": "brightnessMin", "value": 70}},
                                    {"instruction": "Set the text size (Scale) to 125%.", "check": {"type": "textScale", "value": 125}},
                                    {"instruction": "Turn on Night light (warmer colours in the evening).", "check": {"type": "nightLight"}},
                                ], minutes=4),
                {
                    "slug": "settings-accessibility",
                    "title": "Accessibility: making the computer easier to see and hear",
                    "kind": "reading",
                    "minutes": 4,
                    "content": """
# Accessibility

Windows has many helpers for eyes, ears and hands. They are in **Settings > Accessibility**, and anyone can use them.

## For seeing

- **Text size**: one slider makes all text bigger everywhere.
- **Magnifier**: press **⊞ Win** and **+** to zoom in on the screen like a magnifying glass. **⊞ Win + Esc** turns it off.
- **Mouse pointer**: make the pointer bigger and a bright colour so it is easy to find.
- **Contrast themes**: strong colours for people who find pale screens hard.
- **Narrator**: reads the screen aloud. **⊞ Win + Ctrl + Enter** turns it on and off.

## For hearing

- **Captions**: live subtitles for any video or call.
- **Mono audio** and visual alerts instead of sounds.

## For hands

- **Sticky keys**: press Ctrl, then C, one after the other instead of together.
- **On-screen keyboard**: a keyboard you click with the mouse.
- **Voice typing**: press **⊞ Win + H** and speak. Works in Word, email, anywhere you can type.
- **Mouse keys**: move the pointer with the number pad.

## In this app

Study Buddy has its own **Bigger text** switch and **Read aloud** button on every reading lesson. Find them in the sidebar under Help.
""",
                },
            ],
        },
        {
            "title": "Connecting and typing in your language",
            "lessons": [
                settings_lesson("settings-wifi", "Practice: connect to Wi-Fi",
                                """
Open **Network & internet > Wi-Fi**. Make sure Wi-Fi is switched on, pick your network from the list and click **Connect**. The first time, it asks for the **network key** (password), which is printed on a sticker on the router. Tick **Connect automatically** so it remembers.

For this practice the network is **Home-WiFi** and the key on the sticker is **sunflower42**.
""",
                                [
                                    {"instruction": "Turn Wi-Fi on.", "check": {"type": "wifiOn"}},
                                    {"instruction": "Connect to the network Home-WiFi using the key from the sticker.", "check": {"type": "wifi", "ssid": "Home-WiFi"}},
                                ], minutes=4),
                settings_lesson("settings-language", "Practice: keyboard language and time",
                                """
If the keyboard types the wrong symbols (an @ where you wanted a quote mark), the **keyboard language** is wrong. Open **Time & language > Language & region**, add the language you need, and choose it. The clock and date are in the same place.
""",
                                [
                                    {"instruction": "Add the keyboard language English (United Kingdom).", "check": {"type": "language", "value": "English (United Kingdom)"}},
                                    {"instruction": "Turn on 'Set time automatically'.", "check": {"type": "autoTime"}},
                                ], minutes=4),
            ],
        },
        {
            "title": "Programs, updates and printers",
            "lessons": [
                {
                    "slug": "settings-install",
                    "title": "Installing and removing programs",
                    "kind": "reading",
                    "minutes": 5,
                    "content": """
# Installing and removing programs

## Where to get programs

1. **Microsoft Store**: click Start, open **Microsoft Store**, search, click **Get** or **Install**. Safe, and updates itself.
2. **The maker's own website**: for example, Zoom from zoom.us. Download the installer (a .exe file), open it from Downloads, and follow the steps: **Next, Next, Install, Finish**.

Read each step. Installers sometimes offer extra things you did not ask for, such as a toolbar or a different search engine, with a **ticked box**. Untick them.

## Removing (uninstalling)

Do not just delete the program's icon: that removes only the shortcut. Instead:

1. **Settings > Apps > Installed apps**.
2. Find the program in the list (there is a search box).
3. Click the **⋯** next to it and choose **Uninstall**.

Removing a program you do not recognise is usually safe, but leave anything with **Microsoft**, **Windows**, **Intel**, **NVIDIA** or **Realtek** in the name: those are parts of the computer.

## Signs of a junk program

- Toolbars, *PC cleaners*, *driver updaters*, *speed boosters*. Windows does not need them.
- Pop-ups saying your computer has 300 problems and you must pay to fix them.
- A program you did not install yourself.

Uninstall them.
""",
                },
                settings_lesson("settings-uninstall", "Practice: remove a junk program",
                                "Open **Apps > Installed apps** in the pretend Settings. Two junk programs have sneaked in. Uninstall them and leave the rest alone.",
                                [
                                    {"instruction": "Uninstall 'Super PC Cleaner Pro'.", "check": {"type": "uninstalled", "app": "Super PC Cleaner Pro"}},
                                    {"instruction": "Uninstall 'Weather Toolbar'.", "check": {"type": "uninstalled", "app": "Weather Toolbar"}},
                                    {"instruction": "Keep Microsoft Word.", "check": {"type": "notUninstalled", "app": "Microsoft Word"}},
                                    {"instruction": "Keep Microsoft Edge.", "check": {"type": "notUninstalled", "app": "Microsoft Edge"}},
                                ], minutes=4),
                settings_lesson("settings-update", "Practice: Windows Update",
                                """
Updates fix problems and close security holes. Windows installs them by itself, but you can check: **Settings > Windows Update > Check for updates**. If one needs a restart, save your work and click **Restart now**, or let it happen overnight.
""",
                                [
                                    {"instruction": "Open Windows Update and click Check for updates.", "check": {"type": "checkedUpdates"}},
                                    {"instruction": "Install the update and restart.", "check": {"type": "updated"}},
                                ], minutes=3),
                {
                    "slug": "settings-printers",
                    "title": "Printers",
                    "kind": "reading",
                    "minutes": 4,
                    "content": """
# Printers

## Connecting a printer

Most modern printers connect by **Wi-Fi**. Follow the printer's own screen to join your Wi-Fi network, then on the computer go to **Settings > Bluetooth & devices > Printers & scanners > Add device**. The printer appears after a moment; click **Add**.

A printer with a **USB cable** is even simpler: plug it in, and Windows sets it up by itself.

## Printing

In any program, press **Ctrl + P**. A dialog box shows:

- **Printer**: pick yours if there is more than one. *Microsoft Print to PDF* makes a file instead of paper.
- **Copies**.
- **Pages**: all, or just some, such as *1-2*.
- **Colour** or black and white, **one-sided** or **two-sided**.

Click **Print**.

## When it does not print

1. Is it switched on, with paper, and no error light?
2. Is it on the same Wi-Fi as the computer?
3. In Printers & scanners, click the printer and **Open print queue**. Cancel anything stuck.
4. Turn the printer off and on.

## Scanning

Many printers also **scan**. Put the paper face-down on the glass, and use the **Windows Scan** app or the printer's own app. The result is a picture or PDF saved in Pictures or Documents.
""",
                },
                settings_lesson("settings-printer-practice", "Practice: add a printer",
                                "Open **Bluetooth & devices > Printers & scanners**, add the printer called **HP OfficeJet (Living room)**, and make it the default.",
                                [
                                    {"instruction": "Add the printer HP OfficeJet (Living room).", "check": {"type": "printerAdded", "name": "HP OfficeJet (Living room)"}},
                                    {"instruction": "Set it as the default printer.", "check": {"type": "printerDefault", "name": "HP OfficeJet (Living room)"}},
                                ], minutes=3),
                {
                    "slug": "settings-quiz",
                    "title": "Check: settings and housekeeping",
                    "kind": "quiz",
                    "minutes": 4,
                    "content": "Score 70% to pass.",
                    "data": {
                        "passScore": 70,
                        "questions": [
                            {"q": "Which keys open Settings?", "options": ["Win + I", "Ctrl + S", "Alt + F4", "Win + L"], "answer": 0, "explain": "Win + I, or Start then the gear icon."},
                            {"q": "Where do you make all text bigger?", "options": ["Personalisation", "System > Display, or Accessibility > Text size", "Windows Update", "Apps"], "answer": 1, "explain": "Display scale or Accessibility text size."},
                            {"q": "Where is the Wi-Fi network key usually printed?", "options": ["On the keyboard", "On a sticker on the router", "In the Start menu", "On the screen"], "answer": 1, "explain": "Look on the router."},
                            {"q": "How do you properly remove a program?", "options": ["Delete its desktop icon", "Settings > Apps > Uninstall", "Restart", "Drag it to the Recycle Bin"], "answer": 1, "explain": "Deleting the icon only removes the shortcut."},
                            {"q": "Which program should you probably uninstall?", "options": ["Microsoft Edge", "Super PC Cleaner Pro", "Intel Graphics", "Windows Security"], "answer": 1, "explain": "PC cleaners and boosters are junk."},
                            {"q": "Which keys print from almost any program?", "options": ["Ctrl + P", "Ctrl + Z", "Win + P", "Alt + P"], "answer": 0, "explain": "Ctrl + P opens the print dialog."},
                            {"q": "The keyboard types @ when you press the quote key. What is wrong?", "options": ["The keyboard is broken", "The keyboard language is set wrong", "Caps Lock is on", "The mouse"], "answer": 1, "explain": "US and UK layouts swap those keys. Change it in Time & language."},
                        ],
                    },
                },
            ],
        },
    ],
}
