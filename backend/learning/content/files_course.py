"""Course 3: Files and Folders. Uses a built-in pretend File Explorer.

"files" lessons: data = {
  "fs": nested dict; a folder is a dict, a file is the string "file"
  "bin": optional list of {"name", "from"} items already in the Recycle Bin
  "tasks": [{"instruction", "check"}]
}
checks: exists {path, kind}, notExists {path}, inBin {name}, notInBin {name}, binEmpty,
        opened {path} (file was double-clicked), visited {path} (folder was opened)
"""

HOME = {
    "Desktop": {"Shortcut to Word": "file"},
    "Documents": {"homework.txt": "file", "letter to bank.docx": "file", "untitled.txt": "file"},
    "Downloads": {"photo.jpg": "file", "report.docx": "file", "setup-installer.exe": "file", "budget 2026.xlsx": "file"},
    "Pictures": {"Holiday": {"beach.jpg": "file", "sunset.jpg": "file"}},
    "Music": {},
    "Videos": {},
}


def files_lesson(slug, title, intro, tasks, fs=None, bin_items=None, minutes=5):
    return {"slug": slug, "title": title, "kind": "files", "minutes": minutes, "content": intro,
            "data": {"fs": fs or HOME, "bin": bin_items or [], "tasks": tasks}}


COURSE = {
    "slug": "files",
    "title": "Files and Folders",
    "icon": "📁",
    "description": "Where your things live. Find, open, make, rename, move, copy and delete files "
                   "in a practice File Explorer that works like the real one.",
    "modules": [
        {
            "title": "What is a file?",
            "lessons": [
                {
                    "slug": "files-what",
                    "title": "Files, folders and where things live",
                    "kind": "reading",
                    "minutes": 6,
                    "content": """
# Files and folders

## A file

A **file** is one saved thing. A letter you wrote, a photo, a song, a spreadsheet: each is a file. A file has:

- A **name**, chosen by you, such as *letter to bank*.
- An **extension**: a dot and a few letters at the end that say what kind of file it is. Windows often hides it, but the icon shows the type.

| Extension | Kind of file | Opens with |
|-----------|--------------|------------|
| **.docx** | Word document | Microsoft Word |
| **.xlsx** | Spreadsheet | Microsoft Excel |
| **.pdf** | A fixed document, like a printed page | The web browser or a PDF reader |
| **.jpg**, **.png** | Picture | Photos |
| **.mp3** | Music | Media Player |
| **.mp4** | Video | Media Player |
| **.txt** | Plain text | Notepad |
| **.exe** | A **program installer**. Only open these if you trust where they came from. | Windows |

## A folder

A **folder** is a container for files, like a cardboard folder in a filing cabinet. Folders can hold other folders. That is how you keep hundreds of files tidy: *Documents > Tax > 2026*.

## Where things live

Windows gives you a few ready-made folders:

| Folder | What goes there |
|--------|-----------------|
| **Desktop** | What you see behind the windows. Good for a few shortcuts. Do not pile everything here. |
| **Documents** | Letters, essays, spreadsheets. The default place programs save to. |
| **Downloads** | Everything you download from the internet lands here. |
| **Pictures**, **Music**, **Videos** | Exactly what they say. |

All of these live on the computer's main **drive**, called **C:**. A USB stick or external disk appears as another drive with its own letter, such as **D:** or **E:**.

## Sizes

Files have sizes measured in **KB** (kilobytes, tiny), **MB** (megabytes, a photo or a song) and **GB** (gigabytes, a film or a thousand photos). Your drive has a limit; Windows warns you when it fills up.
""",
                },
                {
                    "slug": "files-explorer",
                    "title": "Meet File Explorer",
                    "kind": "reading",
                    "minutes": 5,
                    "content": """
# File Explorer

**File Explorer** is the program that shows your files and folders. Open it by clicking the **yellow folder** on the taskbar, or by pressing **⊞ Win + E**.

## The parts

- **Navigation pane** (left): a list of your main folders: Desktop, Documents, Downloads, Pictures, This PC. Click one to jump there.
- **Address bar** (top): shows **where you are**, for example *This PC > Documents > School*. Each part is clickable.
- **Back ←** and **Up ↑** buttons: go to where you just were, or to the folder that contains this one.
- **Search box** (top right): type part of a file name to find it.
- **The main area**: the files and folders inside the current folder.
- **New**, **Cut**, **Copy**, **Paste**, **Rename**, **Delete** buttons on the toolbar. The same commands are in the **right-click menu**.

## Opening things

- **Double-click a folder** to look inside it.
- **Double-click a file** to open it in its program (Word for .docx, Photos for .jpg).
- Click a file **once** to select it (it turns blue). Then the toolbar buttons act on it.

## Views

The **View** menu lets you see big icons (good for photos) or a **Details** list showing the date and size of each file. Click a column heading, such as **Name** or **Date modified**, to sort by it.

The next lesson is practice in a pretend File Explorer that looks and works like the real one.
""",
                },
                files_lesson("files-open", "Practice: find and open a file",
                             "Use the pretend File Explorer below. Double-click folders to look inside them, use the **Back** and **Up** buttons to come out again, and double-click a file to open it.",
                             [
                                 {"instruction": "Open the Documents folder.", "check": {"type": "visited", "path": "Documents"}},
                                 {"instruction": "Open the file homework.txt (double-click it).", "check": {"type": "opened", "path": "Documents/homework.txt"}},
                                 {"instruction": "Go into Pictures, then into the Holiday folder.", "check": {"type": "visited", "path": "Pictures/Holiday"}},
                                 {"instruction": "Open the picture sunset.jpg.", "check": {"type": "opened", "path": "Pictures/Holiday/sunset.jpg"}},
                             ], minutes=4),
            ],
        },
        {
            "title": "Making and organising",
            "lessons": [
                files_lesson("files-new-folder", "Practice: make a folder and move a file into it",
                             """
Two ways to make a folder: click **New > Folder** on the toolbar, or right-click an empty space and choose **New > Folder**. Type the name and press **Enter**.

To move a file: **drag** it onto the folder, or select it, **Cut** (Ctrl + X), open the folder, **Paste** (Ctrl + V).
""",
                             [
                                 {"instruction": "Open Documents and create a new folder called School.", "check": {"type": "exists", "path": "Documents/School", "kind": "folder"}},
                                 {"instruction": "Move homework.txt into the School folder.", "check": {"type": "exists", "path": "Documents/School/homework.txt", "kind": "file"}},
                                 {"instruction": "homework.txt should no longer be loose in Documents.", "check": {"type": "notExists", "path": "Documents/homework.txt"}},
                             ], minutes=5),
                files_lesson("files-rename", "Practice: rename files",
                             """
A good name tells you what is inside without opening it. To rename: select the file, click **Rename** (or press **F2**, or right-click > Rename), type the new name, press **Enter**.

Keep the extension (the part after the dot) the same, or Windows may not know how to open the file.
""",
                             [
                                 {"instruction": "In Documents, rename untitled.txt to shopping list.txt", "check": {"type": "exists", "path": "Documents/shopping list.txt", "kind": "file"}},
                                 {"instruction": "untitled.txt should be gone.", "check": {"type": "notExists", "path": "Documents/untitled.txt"}},
                                 {"instruction": "Rename the folder Holiday (inside Pictures) to Holiday 2026", "check": {"type": "exists", "path": "Pictures/Holiday 2026", "kind": "folder"}},
                             ], minutes=4),
                {
                    "slug": "files-copy-vs-move",
                    "title": "Copy or move?",
                    "kind": "reading",
                    "minutes": 4,
                    "content": """
# Copy or move?

- **Move** takes the file out of one folder and puts it in another. There is still **one** copy.
- **Copy** leaves the original where it is and makes a **second** copy somewhere else.

## The keyboard way

1. Click the file to select it.
2. Press **Ctrl + X** to **cut** (for a move) or **Ctrl + C** to **copy**.
3. Open the folder you want it in.
4. Press **Ctrl + V** to **paste**.

The same three commands, **Cut**, **Copy** and **Paste**, are on the toolbar and in the right-click menu. They work in Word, in email, in the browser, everywhere.

## The dragging way

- Drag a file to a folder **on the same drive**: it **moves**.
- Drag it to a **different drive** (a USB stick): it **copies**.
- Hold **Ctrl** while dragging to force a copy.

## Selecting more than one

- **Ctrl + click** each file to add it to the selection.
- Click the first, then **Shift + click** the last, to select everything in between.
- **Ctrl + A** selects everything in the folder.

## Downloads is not a filing cabinet

Everything from the internet lands in **Downloads**. Move the things you want to keep into Documents or Pictures, and delete the rest now and again.
""",
                },
                files_lesson("files-copy-move", "Practice: copy and move",
                             "Use Cut, Copy and Paste (toolbar, right-click, or Ctrl + X / C / V) or drag the files.",
                             [
                                 {"instruction": "Copy photo.jpg from Downloads into Pictures (it should then be in both places).", "check": {"type": "exists", "path": "Pictures/photo.jpg", "kind": "file"}},
                                 {"instruction": "photo.jpg is still in Downloads (a copy, not a move).", "check": {"type": "exists", "path": "Downloads/photo.jpg", "kind": "file"}},
                                 {"instruction": "Move report.docx from Downloads into Documents.", "check": {"type": "exists", "path": "Documents/report.docx", "kind": "file"}},
                                 {"instruction": "report.docx is no longer in Downloads.", "check": {"type": "notExists", "path": "Downloads/report.docx"}},
                                 {"instruction": "Move budget 2026.xlsx from Downloads into Documents too.", "check": {"type": "exists", "path": "Documents/budget 2026.xlsx", "kind": "file"}},
                             ], minutes=6),
                files_lesson("files-delete", "Practice: delete and restore",
                             """
Deleting a file sends it to the **Recycle Bin**. It is not gone yet: open the Recycle Bin and choose **Restore** to get it back. Choosing **Empty Recycle Bin** deletes everything in it for good.

To delete: select the file and press the **Delete** key, or click Delete on the toolbar, or right-click > Delete.
""",
                             [
                                 {"instruction": "Delete setup-installer.exe from Downloads.", "check": {"type": "inBin", "name": "setup-installer.exe"}},
                                 {"instruction": "Delete Shortcut to Word from the Desktop.", "check": {"type": "inBin", "name": "Shortcut to Word"}},
                                 {"instruction": "Oops! important.docx was deleted earlier by mistake. Open the Recycle Bin and restore it.", "check": {"type": "exists", "path": "Documents/important.docx", "kind": "file"}},
                                 {"instruction": "Now empty the Recycle Bin.", "check": {"type": "binEmpty"}},
                             ],
                             bin_items=[{"name": "important.docx", "from": "Documents"}, {"name": "old notes.txt", "from": "Documents"}],
                             minutes=5),
            ],
        },
        {
            "title": "Finding things and taking them with you",
            "lessons": [
                {
                    "slug": "files-usb-cloud",
                    "title": "USB sticks, the cloud and searching",
                    "kind": "reading",
                    "minutes": 5,
                    "content": """
# Taking files with you

## USB sticks

A **USB stick** (flash drive, memory stick) is a tiny drive you plug into a USB port on the computer.

1. Plug it in. After a moment it appears in File Explorer under **This PC** with its own letter, such as **E:**.
2. Copy files to it the same way you copy between folders.
3. Before pulling it out, click the **USB icon** in the system tray (bottom right) and choose **Eject**. Wait for *Safe to remove*. This stops files being half-written.

## The cloud

**OneDrive**, **Google Drive** and similar services keep a copy of your files on the internet, so you can open them from another computer or your phone, and they survive if the computer breaks. OneDrive comes with Windows: the folders with a little **cloud** icon are being backed up. A green tick ✓ means the copy is up to date.

## Searching

Cannot remember where you put something? In File Explorer, click the **search box** at the top right and type part of the name. Windows lists every matching file in the folder you are in and all the folders inside it. Searching from **This PC** searches everywhere.

You can also search from the **Start menu**: press ⊞ Win, type the name, and the file appears in the results.

## Backing up

Keeping a second copy of important files is called a **backup**. The cloud does this automatically. A USB stick or external disk copied every month is a good second habit. Photos and documents cannot be re-downloaded if they are lost.
""",
                },
                files_lesson("files-search", "Practice: search for a file",
                             "Use the **search box** at the top right of the pretend explorer. Type part of the name and press Enter. Then double-click the result to open it.",
                             [
                                 {"instruction": "Search for 'budget' and open the file you find.", "check": {"type": "opened", "path": "Downloads/budget 2026.xlsx"}},
                                 {"instruction": "Search for 'sunset' and open the picture.", "check": {"type": "opened", "path": "Pictures/Holiday/sunset.jpg"}},
                                 {"instruction": "Make a folder in Documents called Backup and copy letter to bank.docx into it.", "check": {"type": "exists", "path": "Documents/Backup/letter to bank.docx", "kind": "file"}},
                             ], minutes=5),
                {
                    "slug": "files-quiz",
                    "title": "Check: files and folders",
                    "kind": "quiz",
                    "minutes": 4,
                    "content": "Score 70% to pass.",
                    "data": {
                        "passScore": 70,
                        "questions": [
                            {"q": "What is the ending .docx on a file name called?", "options": ["The folder", "The extension", "The drive", "The icon"], "answer": 1, "explain": "The extension says what kind of file it is."},
                            {"q": "Where do files from the internet land?", "options": ["Desktop", "Documents", "Downloads", "Recycle Bin"], "answer": 2, "explain": "Downloads, unless you choose somewhere else."},
                            {"q": "Which keys cut, copy and paste?", "options": ["Ctrl+X, Ctrl+C, Ctrl+V", "Ctrl+A, Ctrl+B, Ctrl+C", "Alt+X, Alt+C, Alt+V", "Shift+1, 2, 3"], "answer": 0, "explain": "X cuts, C copies, V pastes."},
                            {"q": "You deleted a file by mistake. Where is it?", "options": ["Gone forever", "In the Recycle Bin", "In Downloads", "On the internet"], "answer": 1, "explain": "Open the Recycle Bin and click Restore."},
                            {"q": "Which key renames the selected file?", "options": ["F1", "F2", "Esc", "Enter"], "answer": 1, "explain": "F2 starts renaming."},
                            {"q": "What should you do before pulling out a USB stick?", "options": ["Nothing", "Restart", "Click Eject in the system tray", "Delete its files"], "answer": 2, "explain": "Eject makes sure every file is fully written."},
                            {"q": "A file is in Documents. You drag it into the Pictures folder. What happens?", "options": ["It is copied", "It is moved", "It is deleted", "Nothing"], "answer": 1, "explain": "Dragging on the same drive moves the file."},
                        ],
                    },
                },
            ],
        },
    ],
}
