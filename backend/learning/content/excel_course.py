"""Course 7: Excel Basics. Uses a built-in pretend spreadsheet.

"sheet" lessons: data = {"cells": {"A1": "Item", ...} starter values, "tasks": [{"instruction", "check"}]}
checks: cellEquals {cell, value}, cellFormula {cell, includes}, cellBold {cell}, cellFilled {cell},
        rangeFilled {range}, cellNumber {cell}, cellFill {cell}, cellItalic {cell}
Formulas supported by the pretend sheet: + - * / ( ), cell references, SUM, AVERAGE, MIN, MAX, COUNT.
"""


def sheet_lesson(slug, title, intro, tasks, cells=None, minutes=5):
    return {"slug": slug, "title": title, "kind": "sheet", "minutes": minutes, "content": intro,
            "data": {"cells": cells or {}, "tasks": tasks}}


SHOPPING = {"A1": "Item", "B1": "Price", "A2": "Bread", "B2": 1.5, "A3": "Milk", "B3": 1.2, "A4": "Eggs", "B4": 2.8, "A5": "Apples", "B5": 3}

COURSE = {
    "slug": "excel",
    "title": "Excel Basics",
    "icon": "📊",
    "description": "Tables of numbers that add themselves up. Cells, rows, columns, formulas and a simple budget, "
                   "in a practice spreadsheet that works like Excel.",
    "modules": [
        {
            "title": "Meet the spreadsheet",
            "lessons": [
                {
                    "slug": "excel-what",
                    "title": "What is a spreadsheet?",
                    "kind": "reading",
                    "minutes": 5,
                    "content": """
# Spreadsheets

A **spreadsheet** is a grid of boxes for numbers and words. Its special trick: it can **add up, average and compare** the numbers for you, and when you change one number, every total updates by itself. Shopping lists, budgets, club memberships, marks, invoices: all spreadsheet jobs.

**Microsoft Excel** is the best-known spreadsheet program. Google Sheets and LibreOffice Calc work the same way.

## The grid

- **Columns** run up and down and are named with **letters**: A, B, C...
- **Rows** run across and are named with **numbers**: 1, 2, 3...
- A **cell** is one box. Its name is its column letter plus its row number: **A1** is the top-left cell, **B3** is column B, row 3.

## Putting things in

1. **Click** a cell. It gets a thick border: it is **selected**.
2. **Type**. What you type appears in the cell and in the **formula bar** above the grid.
3. Press **Enter** to finish and move down, or **Tab** to move right.

Arrow keys move between cells. **Delete** clears a cell. **Double-click** a cell to edit what is already in it.

## Words and numbers

Excel notices whether you typed a **number** or a **word**. Numbers sit on the right of the cell and can be added up. Words sit on the left. If a number sits on the left, you probably typed a letter in it by accident.

## Sheets and files

One Excel file is called a **workbook** and can have several **sheets**, shown as tabs at the bottom. Save it like any file: **Ctrl + S**. It gets the extension **.xlsx**.

The next lesson is practice in a pretend spreadsheet.
""",
                },
                sheet_lesson("excel-enter", "Practice: type into cells",
                             "Click a cell, type, press Enter. Build the shopping list below. Use Tab to move to the next column.",
                             [
                                 {"instruction": "Type Item in A1 and Price in B1.", "check": {"type": "cellEquals", "cell": "A1", "value": "Item"}},
                                 {"instruction": "B1 should say Price.", "check": {"type": "cellEquals", "cell": "B1", "value": "Price"}},
                                 {"instruction": "Type Bread in A2 and 1.5 in B2.", "check": {"type": "cellEquals", "cell": "B2", "value": 1.5}},
                                 {"instruction": "Type Milk in A3 and 1.2 in B3.", "check": {"type": "cellEquals", "cell": "B3", "value": 1.2}},
                                 {"instruction": "Type Eggs in A4 and 2.8 in B4.", "check": {"type": "cellEquals", "cell": "B4", "value": 2.8}},
                                 {"instruction": "Make sure A2 to A4 all have item names.", "check": {"type": "rangeFilled", "range": "A2:A4"}},
                             ], minutes=5),
                {
                    "slug": "excel-formulas",
                    "title": "Formulas: making it add up",
                    "kind": "reading",
                    "minutes": 6,
                    "content": """
# Formulas

A **formula** is a sum that Excel works out for you. Every formula starts with an **equals sign =**. That is how Excel knows it is a sum and not a word.

## Simple sums

| Type this | You get |
|-----------|---------|
| `=2+3` | 5 |
| `=10-4` | 6 |
| `=6*7` | 42 (the star means multiply) |
| `=20/4` | 5 (the slash means divide) |

## Using cells

The clever part: instead of numbers, use **cell names**.

`=B2+B3` adds whatever is in B2 and B3. If you change B2 later, the answer changes by itself.

`=B2*3` multiplies B2 by three.

## SUM: adding a whole column

Adding ten cells with plus signs is slow. Use **SUM** with a **range**:

`=SUM(B2:B5)` adds everything from B2 down to B5. The colon means *to*.

Even quicker: click the empty cell under the numbers and press the **AutoSum Σ** button on the toolbar. Excel writes the SUM for you.

## Other useful ones

| Formula | What it gives |
|---------|---------------|
| `=AVERAGE(B2:B5)` | The average |
| `=MAX(B2:B5)` | The biggest |
| `=MIN(B2:B5)` | The smallest |
| `=COUNT(B2:B5)` | How many numbers |

## Reading a formula

Click a cell with a formula. The cell shows the **answer**; the **formula bar** above shows the **formula**. To change it, edit the formula bar or double-click the cell.

## Errors

- **#NAME?** : a misspelled function, such as SUMM.
- **#DIV/0!** : dividing by an empty cell or zero.
- **#VALUE!** : a word where a number should be.
- **#####** : the number is too wide for the column. Make the column wider by dragging the line between the column letters.

## Fill down

Type a formula once, then drag the small square at the bottom-right of the cell (the **fill handle**) downwards. Excel copies the formula to each row, adjusting the cell names as it goes.
""",
                },
                sheet_lesson("excel-sum", "Practice: add it up",
                             "The shopping list is filled in. Add a total. Remember: every formula starts with **=**. Try the **Σ AutoSum** button too.",
                             [
                                 {"instruction": "Type Total in A6.", "check": {"type": "cellEquals", "cell": "A6", "value": "Total"}},
                                 {"instruction": "In B6 write a formula that adds B2 to B5 (for example =SUM(B2:B5)).", "check": {"type": "cellFormula", "cell": "B6", "includes": "SUM"}},
                                 {"instruction": "B6 should show 8.5.", "check": {"type": "cellEquals", "cell": "B6", "value": 8.5}},
                                 {"instruction": "In A7 type Most expensive, and in B7 use =MAX(B2:B5).", "check": {"type": "cellFormula", "cell": "B7", "includes": "MAX"}},
                                 {"instruction": "In A8 type Average, and in B8 use =AVERAGE(B2:B5).", "check": {"type": "cellFormula", "cell": "B8", "includes": "AVERAGE"}},
                                 {"instruction": "Change the price of apples (B5) to 4. The total should become 9.5 by itself.", "check": {"type": "cellEquals", "cell": "B6", "value": 9.5}},
                             ], cells=SHOPPING, minutes=6),
            ],
        },
        {
            "title": "Making it look right",
            "lessons": [
                {
                    "slug": "excel-format",
                    "title": "Formatting cells",
                    "kind": "reading",
                    "minutes": 4,
                    "content": """
# Formatting

Formatting changes how a cell **looks**, not what is in it.

## Select first

Click a cell, or **drag** across several, or click a **column letter** to select the whole column, or a **row number** for the whole row. Then use the toolbar.

## Text

**Bold** (Ctrl + B), *italic* (Ctrl + I), underline, font size and colour, exactly as in Word. Headings in bold make a table much easier to read.

## Fill colour

The **paint bucket** 🪣 colours the background of the cell. Use it to highlight a total or a heading row.

## Numbers

The **number format** buttons turn 1.5 into **£1.50** (currency), 0.25 into **25%** (percentage), or add a thousands separator: 12,000. The number inside does not change, only how it shows.

## Columns and rows

- Drag the line between two column letters to make a column **wider**. Double-click it to fit the widest entry.
- **Right-click** a row number or column letter to **insert** or **delete** a row or column.

## Alignment

Centre, left, right, like Word. Numbers look best right-aligned, which Excel does by itself.

## Borders

The **borders** button draws lines around cells, which prints nicely.
""",
                },
                sheet_lesson("excel-format-practice", "Practice: headings and highlights",
                             "Make the shopping list easier to read. Select a cell, then use the toolbar buttons.",
                             [
                                 {"instruction": "Make the headings A1 and B1 bold.", "check": {"type": "cellBold", "cell": "A1"}},
                                 {"instruction": "B1 should be bold too.", "check": {"type": "cellBold", "cell": "B1"}},
                                 {"instruction": "Give the Total row (A6) a fill colour.", "check": {"type": "cellFill", "cell": "A6"}},
                                 {"instruction": "Make the word Total in A6 bold.", "check": {"type": "cellBold", "cell": "A6"}},
                             ], cells={**SHOPPING, "A6": "Total", "B6": "=SUM(B2:B5)"}, minutes=4),
                {
                    "slug": "excel-sort",
                    "title": "Sorting, filtering and charts",
                    "kind": "reading",
                    "minutes": 4,
                    "content": """
# Sorting, filtering and charts

## Sorting

Click any cell inside the table, then **Data > Sort**. Choose the column (for example Price) and **smallest to largest**. Excel keeps each row together, so the names stay with their prices.

Quick way: click one cell in the column you want to sort by, then the **A→Z** or **Z→A** button.

## Filtering

**Data > Filter** adds a small arrow to every heading. Click an arrow and untick what you do not want to see. Only matching rows stay visible; nothing is deleted. Click **Clear filter** to see everything again.

## Charts

Select the table (including headings), then **Insert > Chart** and pick a **column chart** or **pie chart**. The chart appears next to the table and updates when the numbers change. Drag it to move it, drag a corner to resize it.

## Freeze panes

For a long table, **View > Freeze Panes > Freeze Top Row** keeps the headings visible while you scroll.

## Printing

**Ctrl + P**, then in the settings choose **Fit sheet on one page** if it spills over.
""",
                },
            ],
        },
        {
            "title": "A real project",
            "lessons": [
                sheet_lesson("excel-budget", "Project: a monthly budget",
                             """
Build a simple monthly budget. Put your income at the top, list the things you spend on, add up the spending, and work out what is left.

| | A | B |
|-|---|---|
| 1 | Monthly budget | |
| 2 | Income | 1500 |
| 4 | Rent | 650 |
| 5 | Food | 300 |
| 6 | Bills | 180 |
| 7 | Travel | 90 |
| 8 | Total spending | =SUM(B4:B7) |
| 9 | Left over | =B2-B8 |
""",
                             [
                                 {"instruction": "A1: Monthly budget (bold).", "check": {"type": "cellBold", "cell": "A1"}},
                                 {"instruction": "A2: Income, B2: 1500.", "check": {"type": "cellEquals", "cell": "B2", "value": 1500}},
                                 {"instruction": "Rows 4 to 7: Rent 650, Food 300, Bills 180, Travel 90.", "check": {"type": "rangeFilled", "range": "A4:B7"}},
                                 {"instruction": "B4 to B7 must be numbers.", "check": {"type": "cellNumber", "cell": "B7"}},
                                 {"instruction": "A8: Total spending, B8: a SUM of B4 to B7.", "check": {"type": "cellFormula", "cell": "B8", "includes": "SUM"}},
                                 {"instruction": "B8 should show 1220.", "check": {"type": "cellEquals", "cell": "B8", "value": 1220}},
                                 {"instruction": "A9: Left over, B9: =B2-B8.", "check": {"type": "cellEquals", "cell": "B9", "value": 280}},
                                 {"instruction": "Make A8 and A9 bold.", "check": {"type": "cellBold", "cell": "A9"}},
                             ], minutes=8),
                {
                    "slug": "excel-quiz",
                    "title": "Check: spreadsheets",
                    "kind": "quiz",
                    "minutes": 4,
                    "content": "Score 70% to pass.",
                    "data": {
                        "passScore": 70,
                        "questions": [
                            {"q": "What is the name of the cell in column C, row 4?", "options": ["4C", "C4", "CD", "Row C"], "answer": 1, "explain": "Column letter then row number."},
                            {"q": "Every formula must start with:", "options": ["+", "=", "SUM", "a number"], "answer": 1, "explain": "The equals sign tells Excel it is a formula."},
                            {"q": "Which formula adds B2 to B9?", "options": ["=ADD(B2-B9)", "=B2+B9", "=SUM(B2:B9)", "SUM B2 B9"], "answer": 2, "explain": "SUM with a range B2:B9."},
                            {"q": "Which symbol multiplies?", "options": ["x", "*", "^", "%"], "answer": 1, "explain": "The star."},
                            {"q": "A cell shows #####. What is wrong?", "options": ["The formula is broken", "The column is too narrow", "A virus", "Nothing"], "answer": 1, "explain": "Widen the column."},
                            {"q": "You change a number that a SUM uses. What happens to the total?", "options": ["Nothing", "It updates by itself", "It shows an error", "You must retype it"], "answer": 1, "explain": "Formulas recalculate automatically."},
                            {"q": "Where do you see the formula behind a cell?", "options": ["The formula bar above the grid", "The taskbar", "The address bar", "The Start menu"], "answer": 0, "explain": "Click the cell and look at the formula bar."},
                        ],
                    },
                },
            ],
        },
    ],
}
