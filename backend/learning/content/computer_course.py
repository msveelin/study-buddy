"""Course 0: Using the Computer. For someone who has never used one before.

Every lesson here is reading plus a short quiz. There is no practice that needs
typing skill, because typing comes later. If clicking is still hard, the Mouse
course (next) has practice for that.
"""


def quiz(slug, title, questions, minutes=4, pass_score=70):
    return {
        "slug": slug,
        "title": title,
        "kind": "quiz",
        "minutes": minutes,
        "content": "Pick the best answer for each question. Score %d%% to pass. You can try as many times as you like." % pass_score,
        "data": {"passScore": pass_score, "questions": questions},
    }


COURSE = {
    "slug": "computer",
    "title": "Using the Computer",
    "icon": "🖥️",
    "description": "Start from zero: what the parts are called, how to turn it on and off, "
                   "what the desktop, windows and programs are, and what to do when you get stuck.",
    "modules": [
        {
            "title": "What is a computer?",
            "lessons": [
                {
                    "slug": "computer-welcome",
                    "title": "Welcome! The parts of a computer",
                    "kind": "reading",
                    "minutes": 5,
                    "content": """
# Welcome to your first lesson

You are reading this on a computer right now. Well done, that is already a start!

This website is called **Study Buddy**. Each page like this one is a **lesson**. When you finish reading, you press the green button at the bottom that says **I have read this**, and the next lesson appears.

> If moving the pointer or pressing buttons feels hard right now, ask someone to sit with you for the first few lessons. The next course, **Mouse Basics**, will teach you to click with confidence.

## The parts

A computer is a few pieces working together:

| Part | What it does |
|------|--------------|
| **Screen** (or monitor) | Shows you pictures and words. It is the part you look at. |
| **Keyboard** | The board full of letter and number keys. You use it to type. |
| **Mouse** | The small object you move with your hand. It moves the **pointer** (the little arrow) on the screen. On a laptop, the flat rectangle below the keys is the **touchpad** and does the same job. |
| **The computer itself** | On a **desktop** computer it is a box with the power button. On a **laptop** everything is built into one folding unit. |
| **Speakers** | Make sound. Often built into the screen or laptop. |
| **Cables** | Carry power and connect the parts. A laptop has a battery, so it also works without the power cable for a few hours. |

## Desktop or laptop?

- A **desktop** stays on a desk. The screen, keyboard and mouse are separate and plugged into the box.
- A **laptop** folds shut and can be carried. The keyboard and touchpad are built in. You can still plug in a mouse if you prefer it.

Everything in this course works the same way on both.

## The pointer

Look at the screen and move the mouse a little. The small arrow that moves is the **pointer** (some people say cursor). You use it to point at things and then press the mouse button to **click** them. That is how you tell the computer what you want.
""",
                },
                {
                    "slug": "computer-on-off",
                    "title": "Turning it on, signing in and turning it off",
                    "kind": "reading",
                    "minutes": 6,
                    "content": """
# Turning the computer on and off

## Turning it on

1. Find the **power button**. It has this symbol: ⏻. On a desktop it is on the front of the box; on a laptop it is above the keyboard or on the side.
2. Press it **once** and let go. Do not hold it down.
3. Wait. Lights come on, the screen wakes up, and after half a minute or so you see the **lock screen**: a picture with the time on it.

If nothing happens, check that the power cable is plugged into the wall and into the computer, and that the socket is switched on. A laptop may simply need charging.

## Signing in

Click anywhere (or press any key) and the lock screen slides away. You see your **name** and a box asking for a **PIN** or **password**.

- Type it and press **Enter** (the big key on the right of the keyboard).
- The letters show as dots so nobody can read them over your shoulder.
- **Never tell anyone your password**, even someone who phones and says they are from the computer company. Real companies never ask.

After a moment the **desktop** appears. You are in!

## Turning it off properly

Do not just pull the plug or hold the power button. The computer needs a moment to tidy up and save things. Instead:

1. Click the **Start button**: the Windows logo ⊞ at the bottom of the screen.
2. Click the **power icon** ⏻ in the menu that appears.
3. Choose **Shut down**.

The screen goes dark and the lights go off. Now it is safe to unplug or close the lid.

## Shut down, sleep or restart?

| Choice | What happens | When to use it |
|--------|--------------|----------------|
| **Sleep** | The screen goes off but everything you had open is kept. Wakes up in seconds when you press a key. | Short breaks. Closing a laptop lid usually sleeps it. |
| **Shut down** | Everything closes and the computer turns off fully. | End of the day, or before unplugging. |
| **Restart** | Turns off and straight back on again. | When something is misbehaving, or after an update asks for it. |

## When it is frozen

If the computer ignores everything for several minutes, you may hold the power button for about **10 seconds** until it switches off. Use this only as a last resort, because anything you had not saved is lost.

> **Updates**: sometimes when you shut down you see *Updating, do not turn off your computer*. Leave it alone and let it finish, even if it takes a while.
""",
                },
                {
                    "slug": "computer-desktop",
                    "title": "The desktop, the taskbar and the Start button",
                    "kind": "reading",
                    "minutes": 6,
                    "content": """
# The desktop

After you sign in you see the **desktop**. Think of it as the top of a real desk: a background picture with a few small pictures on it.

## Icons

The small pictures are **icons**. Each one stands for something: a program, a file, a folder or the Recycle Bin. You open an icon by **double-clicking** it (two quick clicks). You will practise that in the Mouse course.

## The taskbar

The strip along the **bottom** of the screen is the **taskbar**. From left to right you usually find:

1. **Start button** ⊞ (the Windows logo). Click it to see all your programs, and to shut down.
2. **Search** 🔍. Type the name of anything (a program, a file, a setting) and Windows finds it.
3. **Pinned programs**: icons for programs you use a lot, such as the web browser or File Explorer (the yellow folder).
4. **Open programs**: anything that is running right now also shows here, with a line under it. Click one to bring it to the front.
5. **System tray** (bottom right): tiny icons for **Wi-Fi** 📶, **sound** 🔊 and **battery** 🔋, then the **clock and date**. Click them to adjust things.
6. **Notifications** 🔔: little messages from Windows and your programs.

## The Start menu

Click the Start button once. A menu opens with:

- **Pinned** programs at the top: the ones you use most.
- **All apps** (or **All**): the complete list, in alphabetical order.
- Your **name** and the **power** button at the bottom.

Click anywhere outside the menu, or press the **Esc** key (top left of the keyboard), to close it without choosing anything.

## Do not worry about breaking it

Beginners often worry that one wrong click will ruin the computer. It will not. Almost everything can be undone or closed. The only things to be careful about are **deleting files** and **giving your password to anyone**. We will cover both later.
""",
                },
                quiz("computer-quiz-1", "Check: the parts and the desktop", [
                    {"q": "What is the small arrow that moves when you move the mouse?", "options": ["The icon", "The pointer", "The taskbar", "The window"], "answer": 1, "explain": "The pointer (or cursor) follows the mouse."},
                    {"q": "What is the correct way to turn the computer off?", "options": ["Pull the plug", "Hold the power button", "Start button > Power > Shut down", "Close the lid"], "answer": 2, "explain": "Shut down from the Start menu so the computer can tidy up first."},
                    {"q": "Where is the taskbar?", "options": ["Along the bottom of the screen", "In the middle of the screen", "Inside the keyboard", "On the mouse"], "answer": 0, "explain": "The taskbar is the strip along the bottom, with the Start button at its left."},
                    {"q": "Someone phones and says they are from Microsoft and need your password. What do you do?", "options": ["Tell them", "Tell them half of it", "Refuse and hang up", "Ask them to email you"], "answer": 2, "explain": "Nobody genuine will ever ask for your password."},
                    {"q": "Which option keeps everything open and wakes up in seconds?", "options": ["Shut down", "Sleep", "Restart", "Unplug"], "answer": 1, "explain": "Sleep is for short breaks."},
                    {"q": "The screen says 'Updating, do not turn off your computer'. What do you do?", "options": ["Turn it off anyway", "Wait for it to finish", "Press every key", "Unplug it"], "answer": 1, "explain": "Updates must finish. Interrupting them can cause problems."},
                ]),
            ],
        },
        {
            "title": "Windows and programs",
            "lessons": [
                {
                    "slug": "computer-windows",
                    "title": "What is a window?",
                    "kind": "reading",
                    "minutes": 6,
                    "content": """
# Windows

When you open a program, it appears inside a rectangle on the screen. That rectangle is a **window**. You can have several windows open at once, like several sheets of paper on a desk, and the one on top is the one you are working in.

## The top of every window

Every window has a **title bar** along its top. On its right are three small buttons:

| Button | Name | What it does |
|--------|------|--------------|
| **—** | Minimise | Hides the window down into the taskbar. It is not closed; click its icon on the taskbar to bring it back. |
| **☐** | Maximise / Restore | Makes the window fill the whole screen. Click again to shrink it back. |
| **✕** | Close | Closes the window (and the program if it was the last window). If you had unsaved work, the program asks whether to save it first. |

## Moving and resizing

- **Move**: point at the title bar, press and hold the left mouse button, move the mouse, then let go. This is called **dragging**.
- **Resize**: point at any edge or corner of the window. The pointer becomes a double arrow ↔. Drag to make the window bigger or smaller.
- **Snap**: drag a window to the very left or right edge of the screen and it fills that half. Handy for comparing two things.

## Switching between windows

- Click the window you want, if you can see part of it.
- Or click its icon on the **taskbar**.
- Or hold **Alt** and press **Tab** to flip through the open windows. Let go of Alt on the one you want.

## Dialog boxes

Sometimes a small window pops up with a question and buttons such as **OK**, **Cancel**, **Yes**, **No** or **Save**. This is a **dialog box**. Read it before choosing. If you are unsure, **Cancel** is almost always the safe choice: it means *do nothing*.

## Scrolling

If a window shows a long page, a thin bar on its right edge is the **scrollbar**. Roll the **wheel** on the mouse, or drag the scrollbar, to move the page up and down. On a touchpad, slide two fingers up or down.
""",
                },
                {
                    "slug": "computer-programs",
                    "title": "Programs and apps",
                    "kind": "reading",
                    "minutes": 5,
                    "content": """
# Programs

A **program** (also called an **app** or application) is a tool that does a job. The computer has many:

| Program | Job |
|---------|-----|
| **Microsoft Edge**, **Chrome** | A **web browser**: looks at websites on the internet. |
| **File Explorer** (yellow folder icon) | Shows your files and folders. |
| **Microsoft Word** | Writes letters and documents. |
| **Microsoft Excel** | Works with numbers in tables. |
| **Settings** (gear icon) | Changes how the computer behaves. |
| **Calculator**, **Photos**, **Mail**, **Notepad** | Exactly what they sound like. |

## Opening a program

Any of these works:

1. **Start menu**: click Start ⊞, find the program and click it once.
2. **Search**: click Start or the search box, type the first few letters, for example *calc*, and press **Enter** when Calculator appears.
3. **Taskbar**: click its icon if it is pinned there.
4. **Desktop**: double-click its icon if there is one.

Opening takes a few seconds. A spinning circle next to the pointer means *wait, I am working on it*.

## Closing a program

Click the **✕** in the top right corner of its window. If it asks *Do you want to save changes?*, choose **Save** if you want to keep your work.

## Pinning

If you use a program every day, pin it to the taskbar: find it in the Start menu, **right-click** it and choose **Pin to taskbar**. Now it is one click away.

## When a program stops responding

Sometimes a window goes pale and its title says **(Not Responding)**. Give it a minute, it may recover. If not, press **Ctrl + Alt + Delete** together, choose **Task Manager**, click the stuck program and press **End task**.
""",
                },
                {
                    "slug": "computer-tray",
                    "title": "Sound, Wi-Fi, battery and notifications",
                    "kind": "reading",
                    "minutes": 4,
                    "content": """
# The bottom-right corner

The little icons at the bottom right of the taskbar are the **system tray**. They tell you how the computer is doing and let you adjust the basics quickly.

## Sound 🔊

Click the speaker icon. A slider appears: drag it right for louder, left for quieter. A speaker with an **✕** means the sound is **muted**; click it to unmute. Many keyboards also have volume keys, often on the F keys at the top, used together with the **Fn** key.

## Wi-Fi 📶

The curved-lines icon shows your internet connection. Click it to see the list of nearby Wi-Fi networks. Yours should say **Connected**. If it shows a globe 🌐 with a line through it, you are not connected: the Settings course shows how to fix that.

## Battery 🔋 (laptops)

Shows how much charge is left. Click it to see the percentage. Below about 20% you should plug the charger in. A small plug ⚡ on the icon means it is charging.

## Clock and date

Click the time to see a calendar and your notifications.

## Notifications 🔔

Programs and Windows send short messages here, such as *Update available* or *New email*. Click the bell (or the time) to read them. You can ignore most of them. Never click a notification that says your computer has a virus and asks you to call a phone number: that is a scam, which we cover in the Internet course.

## Quick settings

Clicking the Wi-Fi, sound or battery icon opens a small panel with buttons for **Wi-Fi**, **Bluetooth**, **Airplane mode**, **brightness** and **volume** all together. It is the fastest way to adjust these.
""",
                },
                quiz("computer-quiz-2", "Check: windows and programs", [
                    {"q": "Which button hides a window into the taskbar without closing it?", "options": ["Minimise (—)", "Maximise (☐)", "Close (✕)", "Start"], "answer": 0, "explain": "Minimise hides it; click its taskbar icon to bring it back."},
                    {"q": "How do you move a window?", "options": ["Drag its title bar", "Double-click it", "Press Enter", "Drag the taskbar"], "answer": 0, "explain": "Press and hold on the title bar, move, let go."},
                    {"q": "A dialog box asks something you do not understand. The safe choice is usually:", "options": ["Yes", "OK", "Cancel", "Delete"], "answer": 2, "explain": "Cancel means do nothing."},
                    {"q": "What is the quickest way to open Calculator?", "options": ["Restart the computer", "Click Start, type calc, press Enter", "Unplug the mouse", "Open Word"], "answer": 1, "explain": "Searching from the Start menu finds any program."},
                    {"q": "Which keys open Task Manager when a program is stuck?", "options": ["Ctrl + Alt + Delete", "Alt + F4", "Shift + Enter", "Esc + Tab"], "answer": 0, "explain": "Ctrl + Alt + Delete, then Task Manager, then End task."},
                    {"q": "Where do you click to make the sound louder?", "options": ["The Start button", "The speaker icon at the bottom right", "The Recycle Bin", "The title bar"], "answer": 1, "explain": "The system tray holds sound, Wi-Fi and battery."},
                ]),
            ],
        },
        {
            "title": "Looking after it and getting unstuck",
            "lessons": [
                {
                    "slug": "computer-care",
                    "title": "Looking after your computer",
                    "kind": "reading",
                    "minutes": 4,
                    "content": """
# Looking after your computer

Computers are tough, but a few habits keep them healthy for years.

## Everyday care

- Keep **drinks** away from the keyboard. One spilled cup can ruin a laptop.
- Do not **block the vents** (the slots that blow warm air). On a laptop, avoid using it on a soft bed or cushion for long.
- **Carry a laptop closed** and hold it by the base, not the screen.
- Wipe the screen with a **soft dry cloth**, never with spray cleaner.
- Pull cables out by the **plug**, not the wire.

## Battery (laptops)

- It is fine to leave it plugged in. Modern batteries manage themselves.
- If you are not going to use it for a week or more, charge it to about half and shut it down.

## Shutting down and updates

- Shut down properly from the Start menu, as you learned earlier.
- Let **updates** finish. They fix problems and keep you safe. If the computer says it needs to restart, save your work and let it.

## Keep things saved

Programs like Word keep your work only while they are open, unless you **save** it. You will learn saving in the Files and Word courses. The habit to build: press **Ctrl + S** often.

## Antivirus

Windows comes with **Windows Security** built in and turned on. You do not need to buy anything extra. If a website or pop-up tells you that you *must* install their antivirus, close it.
""",
                },
                {
                    "slug": "computer-stuck",
                    "title": "What to do when you are stuck",
                    "kind": "reading",
                    "minutes": 5,
                    "content": """
# When you are stuck

Everyone gets stuck. Experts simply have a list of things to try. Here is yours, in order.

## 1. Read what is on the screen

Most of the time the computer is telling you exactly what it wants: *Save changes?*, *Enter your PIN*, *Connect to a network*. Read the whole message slowly before clicking anything.

## 2. Press Esc

The **Esc** key (top left of the keyboard) means *never mind*. It closes menus, pop-ups and many dialog boxes.

## 3. Close the window

Click the **✕** in the top right. If you did not mean to close it, you can open it again.

## 4. Undo

Did you just change something by accident? Press **Ctrl + Z** (hold Ctrl, tap Z). This **undoes** the last thing you did in most programs. Press it again to undo more.

## 5. Wait a moment

A spinning circle means the computer is busy. Give it 30 seconds before clicking again. Clicking many times while it is busy only adds to the queue.

## 6. Restart

Start ⊞ > Power ⏻ > **Restart**. This fixes a surprising number of problems.

## 7. Ask

Ask a friend, a family member, or the library. Say what you were trying to do and what the screen said. A photo of the screen taken with your phone helps a lot.

## Things that are NOT emergencies

- The screen went dark: the computer is probably asleep. Move the mouse or press a key.
- A window disappeared: it is probably minimised. Look at the taskbar.
- The text is tiny: this app has a **Bigger text** switch in the Help page (see the sidebar). Windows has one too, in Settings.
- The pointer vanished: move the mouse, or on a laptop press the touchpad.

## Things that ARE worth care

- A message asking you to **pay**, **call a number** or **enter your password** that you did not expect. Close it. Ask someone before doing anything.
- A message asking **Delete?** or **Permanently delete?** Only say yes if you are sure.
""",
                },
                {
                    "slug": "computer-words",
                    "title": "Words you will hear (and the Help page)",
                    "kind": "reading",
                    "minutes": 4,
                    "content": """
# Words people use

Computer people use a lot of words that sound harder than they are. Here are the ones you have already met, and a few you will meet soon.

| Word | Plain meaning |
|------|---------------|
| **Click** | Press and release the left mouse button once. |
| **Double-click** | Two quick clicks. Opens things. |
| **Right-click** | Press the right mouse button. Opens a menu of choices. |
| **Drag** | Hold the button down while moving the mouse, then let go. |
| **Pointer / cursor** | The arrow that moves with the mouse. In a text box, the blinking line where typing appears is also called the cursor. |
| **Window** | A rectangle on screen that holds a program. |
| **Menu** | A list of choices that drops down when you click something. |
| **Tab** | In a browser, one of several pages open at once. On the keyboard, the key that jumps to the next box. |
| **Icon** | A small picture that stands for a program, file or folder. |
| **File** | One saved thing: a letter, a photo, a song. |
| **Folder** | A container for files, like a paper folder. |
| **Save** | Keep your work so it is still there tomorrow. |
| **Download** | Copy something from the internet onto your computer. |
| **Browser** | The program that shows websites. |
| **Link** | Text or a picture you click to go somewhere else. Usually blue or underlined. |
| **Log in / sign in** | Tell the computer or a website who you are. |

## The Help page

This app has a **Help & Glossary** page: look for it in the sidebar on the left. It has:

- Every word in this table and many more, with a search box.
- A guide to the common **icons and buttons**.
- A **Bigger text** switch.
- A **Read aloud** feature: every reading lesson has a 🔊 button that reads the lesson to you.
- The **tour** of this website, if you would like to see it again.

You do not need to memorise anything. Come back to the Help page whenever a word puzzles you.
""",
                },
                quiz("computer-quiz-3", "Final check: using the computer", [
                    {"q": "Which key means 'never mind' and closes menus and pop-ups?", "options": ["Enter", "Esc", "Shift", "Caps Lock"], "answer": 1, "explain": "Esc, top left of the keyboard."},
                    {"q": "Which keys undo your last action?", "options": ["Ctrl + Z", "Ctrl + S", "Alt + F4", "Ctrl + P"], "answer": 0, "explain": "Ctrl + Z is undo in almost every program."},
                    {"q": "A pop-up says your computer has a virus and you must call a phone number. What should you do?", "options": ["Call the number", "Pay to remove it", "Close it; it is a scam", "Give it your password"], "answer": 2, "explain": "Windows never asks you to call a number. These pop-ups are scams."},
                    {"q": "The screen has gone black. The most likely reason is:", "options": ["It is broken", "It is asleep", "A virus", "The internet is off"], "answer": 1, "explain": "Move the mouse or press a key to wake it."},
                    {"q": "What is a folder?", "options": ["A program", "A container for files", "A kind of mouse", "A website"], "answer": 1, "explain": "Folders hold files, like paper folders hold papers."},
                    {"q": "Which is a good habit?", "options": ["Spray cleaner on the screen", "Pull cables by the wire", "Let updates finish", "Hold the power button to turn off every day"], "answer": 2, "explain": "Let updates finish; they keep the computer safe."},
                    {"q": "A window vanished but the program is still open. Where is it?", "options": ["Deleted", "Minimised, on the taskbar", "In the Recycle Bin", "On the internet"], "answer": 1, "explain": "Minimised windows wait on the taskbar."},
                ], minutes=5),
            ],
        },
    ],
}
