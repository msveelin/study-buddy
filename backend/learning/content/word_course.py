"""Course 2: Microsoft Word for beginners.

Reading lessons explain the real Microsoft Word. "word" lessons open a built-in practice
editor that imitates the Word toolbar so the learner can practise without needing Word installed.
"""

COURSE = {
    "slug": "word",
    "title": "Microsoft Word Basics",
    "icon": "📝",
    "description": "Create, format and save documents. Practise in a built-in editor that works like "
                   "the Word toolbar, then do the same in real Word.",
    "modules": [
        {
            "title": "Meet Microsoft Word",
            "lessons": [
                {
                    "slug": "word-what-is-word",
                    "title": "What is Microsoft Word?",
                    "kind": "reading",
                    "minutes": 4,
                    "content": """
# What is Microsoft Word?

Microsoft Word is a **word processor**: a program for writing documents such as letters, essays, reports, CVs and posters.

Think of it as a very smart sheet of paper:

- You type words and they appear on the page.
- You can make words **bold**, *italic*, bigger, smaller, coloured.
- You can add pictures, tables and lists.
- You can **save** your work and open it again later.
- You can print it or send it to someone by email.

## Opening Word

1. Click the **Start** button (Windows logo at the bottom left of the screen).
2. Type **Word**.
3. Click **Word** in the list.

Word opens with a **start screen**. Click **Blank document** to get an empty page.

## Parts of the Word window

- **Title bar** (very top): shows the name of the document, e.g. *Document1 - Word*.
- **Ribbon**: the wide strip of buttons under the title bar. It has tabs: **Home**, **Insert**, **Layout**, **References**, **Review**, **View**.
- **Page**: the big white area where you type.
- **Status bar** (bottom): shows the page number and word count.

In the next lesson you will practise in our built-in editor. It has the same kind of buttons as the Word **Home** tab.
""",
                },
                {
                    "slug": "word-first-document",
                    "title": "Your first document",
                    "kind": "word",
                    "minutes": 6,
                    "content": """
Below is a practice editor. The buttons work like the ones on the Word **Home** tab.

Complete each task. The checker on the right tells you when a task is done.
""",
                    "data": {
                        "starterHtml": "",
                        "tasks": [
                            {"instruction": "Click inside the page and type the sentence: My name is on this page.",
                             "check": {"type": "containsText", "text": "My name is on this page"}},
                            {"instruction": "Press Enter to start a new line, then type: I am learning Word.",
                             "check": {"type": "containsText", "text": "I am learning Word"}},
                            {"instruction": "Write at least 12 words in total.",
                             "check": {"type": "minWords", "n": 12}},
                        ],
                    },
                },
                {
                    "slug": "word-saving",
                    "title": "Saving and opening documents",
                    "kind": "reading",
                    "minutes": 5,
                    "content": """
# Saving your work

If you close Word without saving, your work is **gone**. Save early, save often.

## Save for the first time

1. Click **File** (top left) then **Save As**, or press **Ctrl + S**.
2. Choose where to save. **Documents** is a good place.
3. Type a name in the **File name** box, for example *My first letter*.
4. Click **Save**.

Word documents end with **.docx**. Word adds this automatically.

## Saving again

After the first save, just press **Ctrl + S** every few minutes. Word overwrites the file with your latest version. No questions asked.

## Opening a document

- In Word: **File > Open > Browse**, find the file, click **Open**.
- Or in File Explorer: find the file and **double-click** it.

## Useful keyboard shortcuts

| Shortcut | What it does |
|----------|--------------|
| Ctrl + S | Save |
| Ctrl + Z | Undo the last change |
| Ctrl + Y | Redo |
| Ctrl + P | Print |
| Ctrl + N | New blank document |

**Ctrl + Z (Undo)** is your best friend. If anything goes wrong, press it until things look right again.
""",
                },
            ],
        },
        {
            "title": "Editing text",
            "lessons": [
                {
                    "slug": "word-selecting",
                    "title": "Selecting, deleting, copying and pasting",
                    "kind": "reading",
                    "minutes": 5,
                    "content": """
# Selecting text

Before you can change text, you must **select** it. Selected text is highlighted in blue/grey.

- **Drag**: press the left mouse button at the start, move to the end, release.
- **Double-click** a word to select that word.
- **Triple-click** to select the whole paragraph.
- **Ctrl + A** selects everything in the document.
- Hold **Shift** and press the arrow keys to select letter by letter.

## Deleting

- **Backspace** deletes the character to the **left** of the cursor.
- **Delete** deletes the character to the **right**.
- Select text and press either key to delete the whole selection.

## Copy, cut and paste

| Shortcut | Name | What it does |
|----------|------|--------------|
| Ctrl + C | Copy | Copies the selection (the original stays) |
| Ctrl + X | Cut | Removes the selection and keeps it in memory |
| Ctrl + V | Paste | Puts the copied/cut text where the cursor is |

The memory where copied text waits is called the **clipboard**. It holds one thing at a time.

## Moving around

- **Home** / **End** jump to the start / end of the line.
- **Ctrl + Home** / **Ctrl + End** jump to the start / end of the document.
""",
                },
                {
                    "slug": "word-edit-practice",
                    "title": "Practice: fix the paragraph",
                    "kind": "word",
                    "minutes": 6,
                    "content": "Use selecting, deleting and typing to fix the text in the editor.",
                    "data": {
                        "starterHtml": "<p>Teh cat sat on the the mat. It was a sunny day day. The cat was happy</p>",
                        "tasks": [
                            {"instruction": "Fix the spelling of the first word so it says: The",
                             "check": {"type": "containsText", "text": "The cat sat"}},
                            {"instruction": "Remove the repeated word so it reads: on the mat",
                             "check": {"type": "notContainsText", "text": "the the"}},
                            {"instruction": "Remove the repeated word in: a sunny day",
                             "check": {"type": "notContainsText", "text": "day day"}},
                            {"instruction": "Add a full stop at the end of the last sentence.",
                             "check": {"type": "containsText", "text": "happy."}},
                        ],
                    },
                },
            ],
        },
        {
            "title": "Formatting",
            "lessons": [
                {
                    "slug": "word-formatting-text",
                    "title": "Bold, italic, underline, fonts and colours",
                    "kind": "reading",
                    "minutes": 5,
                    "content": """
# Making text look the way you want

All of these buttons live on the **Home** tab of the ribbon, in the **Font** group.

| Button | Shortcut | Effect |
|--------|----------|--------|
| **B**  | Ctrl + B | **Bold** (thick letters) |
| *I*    | Ctrl + I | *Italic* (slanted letters) |
| U      | Ctrl + U | Underlined |

**How to use them:** select the text first, then click the button. Or click the button, type, and click again to turn it off.

## Font and size

- The **font** box (e.g. *Calibri*, *Arial*, *Times New Roman*) changes the shape of the letters.
- The **size** box changes how big they are. 11 or 12 is normal for body text. 16 to 24 is good for headings.

## Colour

The **A** with a coloured bar underneath is **Font Color**. Click the small arrow next to it to pick a colour.

## Headings

Instead of making headings bold by hand, Word has **Styles** (further right on the Home tab). Click **Heading 1** for a main title, **Heading 2** for a section title. Styles keep your document tidy and let Word build a table of contents later.
""",
                },
                {
                    "slug": "word-format-practice",
                    "title": "Practice: format a notice",
                    "kind": "word",
                    "minutes": 7,
                    "content": "Format the notice using the toolbar buttons. Select text first, then click a button.",
                    "data": {
                        "starterHtml": "<p>Community Clean-up Day</p><p>Join us this Saturday at 9am in the park.</p><p>Bring gloves and water.</p><p>Everyone is welcome!</p>",
                        "tasks": [
                            {"instruction": "Make the title (Community Clean-up Day) bold.",
                             "check": {"type": "style", "text": "Community Clean-up Day", "prop": "bold"}},
                            {"instruction": "Make the title a Heading 1 using the style box.",
                             "check": {"type": "tag", "text": "Community Clean-up Day", "tag": "h1"}},
                            {"instruction": "Make the words Saturday at 9am italic.",
                             "check": {"type": "style", "text": "Saturday at 9am", "prop": "italic"}},
                            {"instruction": "Underline: Everyone is welcome!",
                             "check": {"type": "style", "text": "Everyone is welcome!", "prop": "underline"}},
                            {"instruction": "Give the words Bring gloves and water a colour (any colour except black).",
                             "check": {"type": "style", "text": "Bring gloves and water", "prop": "color"}},
                        ],
                    },
                },
                {
                    "slug": "word-paragraphs",
                    "title": "Alignment, spacing and lists",
                    "kind": "reading",
                    "minutes": 5,
                    "content": """
# Paragraph formatting

The **Paragraph** group on the Home tab controls whole paragraphs, not single letters. You only need to click somewhere inside the paragraph; no need to select it.

## Alignment

| Button | Shortcut | Result |
|--------|----------|--------|
| Align Left | Ctrl + L | Text starts at the left edge (normal) |
| Center | Ctrl + E | Text sits in the middle (good for titles) |
| Align Right | Ctrl + R | Text ends at the right edge (dates on letters) |
| Justify | Ctrl + J | Both edges straight (newspapers) |

## Lists

- **Bullets** make a list with dots, like this one.
- **Numbering** makes a list with 1, 2, 3.

Click the button, type an item, press **Enter** for the next item. Press **Enter twice** to stop the list.

## Line spacing

The **Line and Paragraph Spacing** button (arrows up and down next to lines) lets you choose 1.0, 1.15, 1.5 or 2.0 spacing. Teachers often ask for 1.5 or double spacing.

## Indent

**Increase Indent** pushes the paragraph in from the left. **Tab** at the start of a line indents just the first line.
""",
                },
                {
                    "slug": "word-paragraph-practice",
                    "title": "Practice: a shopping list and a poem",
                    "kind": "word",
                    "minutes": 7,
                    "content": "Use alignment and list buttons.",
                    "data": {
                        "starterHtml": "<p>Shopping List</p><p>Milk</p><p>Bread</p><p>Eggs</p><p>Roses are red</p><p>Violets are blue</p>",
                        "tasks": [
                            {"instruction": "Center the title: Shopping List",
                             "check": {"type": "style", "text": "Shopping List", "prop": "center"}},
                            {"instruction": "Turn Milk, Bread and Eggs into a bulleted list (3 items).",
                             "check": {"type": "list", "kind": "ul", "min": 3}},
                            {"instruction": "Align the two poem lines (Roses are red / Violets are blue) to the right.",
                             "check": {"type": "style", "text": "Roses are red", "prop": "right"}},
                            {"instruction": "Add a numbered list with at least 2 steps anywhere (e.g. 1. Go to shop 2. Buy items).",
                             "check": {"type": "list", "kind": "ol", "min": 2}},
                        ],
                    },
                },
            ],
        },
        {
            "title": "Pages, pictures and tables",
            "lessons": [
                {
                    "slug": "word-insert",
                    "title": "Inserting pictures, tables and page breaks",
                    "kind": "reading",
                    "minutes": 5,
                    "content": """
# The Insert tab

Everything that is not plain text comes from the **Insert** tab.

## Pictures

**Insert > Pictures > This Device**, find the photo, click **Insert**. Drag the corner handles to resize it. Use **Wrap Text** (appears when the picture is selected) to make text flow around it.

## Tables

**Insert > Table**, then drag over the grid to pick the number of rows and columns. Click a cell and type. Press **Tab** to move to the next cell.

## Page breaks

To start text on a brand new page, press **Ctrl + Enter**. Never press Enter twenty times to reach the next page: it breaks as soon as you edit anything above.

## Headers, footers and page numbers

**Insert > Page Number > Bottom of Page** adds numbers to every page automatically. **Header** and **Footer** put text at the top or bottom of every page (your name, the title, the date).

## Shapes, symbols and links

- **Shapes**: arrows, boxes, circles.
- **Symbol**: special characters like ©, °, €.
- **Link**: turns text into a clickable web address.
""",
                },
                {
                    "slug": "word-layout",
                    "title": "Page layout and printing",
                    "kind": "reading",
                    "minutes": 4,
                    "content": """
# The Layout tab

- **Margins**: the empty space around the edges. *Normal* is fine for most things.
- **Orientation**: **Portrait** (tall) or **Landscape** (wide). Posters and wide tables often use landscape.
- **Size**: A4 is standard in most countries; Letter in the USA.
- **Columns**: split the page into newspaper-style columns.

# Checking your document

- **Review > Spelling & Grammar** (or press **F7**). Red wavy lines mean a spelling problem; blue means grammar. Right-click a wavy word for suggestions.
- **Word count** is shown in the status bar at the bottom.

# Printing

1. Press **Ctrl + P**.
2. Check the preview on the right.
3. Choose the printer and number of copies.
4. Click **Print**.

To make a **PDF** (a file anyone can open, even without Word): **File > Save As**, choose **PDF** in the file type box.
""",
                },
                {
                    "slug": "word-quiz",
                    "title": "Word knowledge check",
                    "kind": "quiz",
                    "minutes": 5,
                    "content": "Score 70% or more to pass.",
                    "data": {
                        "passScore": 70,
                        "questions": [
                            {"q": "Which shortcut saves your document?", "options": ["Ctrl + P", "Ctrl + S", "Ctrl + Z", "Ctrl + B"], "answer": 1, "explain": "Ctrl + S saves. Ctrl + P prints."},
                            {"q": "Which shortcut undoes your last change?", "options": ["Ctrl + U", "Ctrl + X", "Ctrl + Z", "Ctrl + C"], "answer": 2, "explain": "Ctrl + Z is Undo."},
                            {"q": "What must you do before clicking the Bold button to make existing text bold?", "options": ["Save the file", "Select the text", "Press Enter", "Nothing"], "answer": 1, "explain": "Select first, then format."},
                            {"q": "Which tab holds Pictures and Tables?", "options": ["Home", "Layout", "Insert", "Review"], "answer": 2, "explain": "Everything you add goes through Insert."},
                            {"q": "How do you start a new page properly?", "options": ["Press Enter many times", "Ctrl + Enter", "Ctrl + N", "Insert > Picture"], "answer": 1, "explain": "Ctrl + Enter inserts a page break."},
                            {"q": "What does Ctrl + E do?", "options": ["Exits Word", "Centers the paragraph", "Makes text bold", "Opens email"], "answer": 1, "explain": "Ctrl + E centers."},
                            {"q": "A Word document file usually ends with:", "options": [".txt", ".jpg", ".docx", ".exe"], "answer": 2, "explain": ".docx is the Word format."},
                        ],
                    },
                },
                {
                    "slug": "word-final-project",
                    "title": "Final project: write a letter",
                    "kind": "word",
                    "minutes": 12,
                    "content": """
Write a short formal letter using everything you have learned. Then, if you have Microsoft Word, do the same thing in real Word and save it as **My letter.docx**.
""",
                    "data": {
                        "starterHtml": "",
                        "tasks": [
                            {"instruction": "Type a date on the first line and align it to the right.",
                             "check": {"type": "anyStyle", "prop": "right"}},
                            {"instruction": "Add a greeting line that starts with Dear",
                             "check": {"type": "containsText", "text": "Dear"}},
                            {"instruction": "Write a body of at least 40 words.",
                             "check": {"type": "minWords", "n": 40}},
                            {"instruction": "Make at least one word or phrase bold.",
                             "check": {"type": "anyStyle", "prop": "bold"}},
                            {"instruction": "Add a bulleted list with at least 2 items.",
                             "check": {"type": "list", "kind": "ul", "min": 2}},
                            {"instruction": "Finish with a closing such as: Yours sincerely",
                             "check": {"type": "containsTextAny", "texts": ["Yours sincerely", "Yours faithfully", "Kind regards", "Best regards"]}},
                        ],
                    },
                },
            ],
        },
    ],
}
