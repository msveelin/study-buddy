"""Course 1: Mouse Basics. Practice games for pointing, clicking, dragging and scrolling.

"mouse" lessons open the mouse trainer. `data.tasks` is a list of mini-games run in order:
  hover        {count}             move the pointer onto the circles
  click        {count}             click the circles
  doubleClick  {count}             double-click the folders
  rightClick   {count, menuItem}   right-click the file and pick a menu item
  drag         {count}             drag the shapes into the matching boxes
  scroll       {}                  scroll a long box and click the button at the bottom
  selectText   {text}              drag across a word to select it
  menu         {menu, item}        open a drop-down menu and choose an item
  window       {}                  maximise, restore, move and close a window
"""


def mouse_lesson(slug, title, intro, tasks, minutes=5):
    return {"slug": slug, "title": title, "kind": "mouse", "minutes": minutes, "content": intro,
            "data": {"tasks": tasks}}


COURSE = {
    "slug": "mouse",
    "title": "Mouse Basics",
    "icon": "🖱️",
    "description": "Point, click, double-click, right-click, drag and scroll with confidence. "
                   "Short games that make your hand and the pointer friends.",
    "modules": [
        {
            "title": "Holding the mouse",
            "lessons": [
                {
                    "slug": "mouse-welcome",
                    "title": "How to hold the mouse",
                    "kind": "reading",
                    "minutes": 4,
                    "content": """
# The mouse

The mouse is how you point at things on the screen. Learn it well and everything else becomes easy.

## Holding it

- Rest your **palm** lightly on the back of the mouse. Do not grip it hard.
- Your **index finger** rests on the **left button**. Your **middle finger** rests on the **right button**.
- The small wheel between them is the **scroll wheel**.
- Keep the mouse flat on the desk or mouse mat. Move it with your whole hand, keeping your wrist relaxed.

If you run out of desk, **lift** the mouse, put it back in the middle, and carry on. The pointer stays where it was.

## The three actions

| Action | How | What it is for |
|--------|-----|----------------|
| **Click** | Press and release the **left** button once, quickly. | Choosing things, pressing buttons, following links. |
| **Double-click** | Two quick clicks on the left button, without moving the mouse between them. | Opening files, folders and programs on the desktop. |
| **Right-click** | Press and release the **right** button once. | Opens a **menu** of extra choices for whatever you clicked on. |

And two more:

- **Drag**: press the left button and **hold it down**, move the mouse, then let go. Moves things from one place to another.
- **Scroll**: roll the wheel towards you to move a page down, away from you to move it up.

## Pointer shapes

The pointer changes shape to tell you what will happen when you click:

- **Arrow** ↖: normal pointing.
- **Hand** 👆: you are over a link or button. Clicking will do something.
- **I-beam** I: you are over text. Clicking puts the typing cursor there.
- **Spinning circle** ◌: the computer is busy. Wait.
- **Double arrow** ↔: you can drag to resize.

## On a laptop touchpad

- Slide one finger to move the pointer.
- **Tap** once (or press the bottom-left of the pad) to click.
- Tap twice to double-click.
- Tap with **two fingers** (or press the bottom-right) to right-click.
- Slide **two fingers** up or down to scroll.

Ready? The next lessons are little games. Take your time and repeat them as often as you like.
""",
                },
                mouse_lesson("mouse-hover", "Game: move the pointer",
                             "Move the pointer onto each circle and hold it there for a moment. No clicking yet, just moving.",
                             [{"type": "hover", "count": 6}], minutes=3),
                mouse_lesson("mouse-click", "Game: click the circles",
                             "Click each circle once. Keep the mouse still while you press, and press lightly. Press the **left** button, the one under your index finger.",
                             [{"type": "click", "count": 8}], minutes=4),
                mouse_lesson("mouse-double-click", "Game: double-click to open",
                             "Double-clicking opens folders and files. Click twice, quickly, without moving the mouse between clicks. If the folder does not open, try clicking a little faster.",
                             [{"type": "doubleClick", "count": 6}], minutes=4),
            ],
        },
        {
            "title": "Right-click, drag and scroll",
            "lessons": [
                mouse_lesson("mouse-right-click", "Game: right-click for a menu",
                             "Press the **right** button on the file. A menu pops up. Then click (left button) the item the instruction asks for. Right-click menus are how you rename, copy and delete things.",
                             [{"type": "rightClick", "count": 4, "menuItem": "Open"}], minutes=4),
                mouse_lesson("mouse-drag", "Game: drag and drop",
                             "Point at a shape, press the left button and **keep it held down**, move to the matching box, then let go. This is how you move files into folders and windows around the screen.",
                             [{"type": "drag", "count": 4}], minutes=5),
                mouse_lesson("mouse-scroll", "Game: scroll down the page",
                             "Not everything fits on the screen. Point inside the box and roll the **wheel** towards you to move down. On a touchpad slide two fingers downwards. Find the button at the bottom and click it.",
                             [{"type": "scroll"}], minutes=3),
                mouse_lesson("mouse-select", "Game: select a word",
                             "To select text, point just before the first letter, hold the left button, drag across the word, and let go. The word turns blue. Selected text can then be copied, deleted or made bold. (Tip: double-clicking a word also selects it.)",
                             [{"type": "selectText", "text": "orange"}, {"type": "selectText", "text": "big red bus"}], minutes=4),
                {
                    "slug": "mouse-quiz",
                    "title": "Check: mouse actions",
                    "kind": "quiz",
                    "minutes": 3,
                    "content": "Score 70% to pass.",
                    "data": {
                        "passScore": 70,
                        "questions": [
                            {"q": "Which button do you press to open a menu of extra choices?", "options": ["Left", "Right", "The wheel", "Both"], "answer": 1, "explain": "Right-click opens a menu."},
                            {"q": "How do you open a folder on the desktop?", "options": ["One click", "Double-click", "Right-click", "Scroll"], "answer": 1, "explain": "Double-click opens things."},
                            {"q": "What is dragging?", "options": ["Clicking twice", "Holding the button while moving", "Rolling the wheel", "Pressing both buttons"], "answer": 1, "explain": "Hold, move, release."},
                            {"q": "The pointer turns into a hand. What does it mean?", "options": ["The computer is busy", "You can type here", "Clicking will follow a link or press a button", "The mouse is broken"], "answer": 2, "explain": "A hand means clickable."},
                            {"q": "You run out of desk while moving the mouse. What do you do?", "options": ["Push harder", "Lift the mouse and put it back in the middle", "Restart", "Buy a bigger desk"], "answer": 1, "explain": "Lifting the mouse does not move the pointer."},
                            {"q": "On a touchpad, how do you right-click?", "options": ["Tap with two fingers", "Tap once", "Slide up", "Press Enter"], "answer": 0, "explain": "Two-finger tap, or the bottom-right corner of the pad."},
                        ],
                    },
                },
            ],
        },
        {
            "title": "Putting it together",
            "lessons": [
                mouse_lesson("mouse-menus", "Game: menus",
                             "Programs keep most of their commands in **menus** along the top: File, Edit, View... Click a menu name to open it, then click the command you want. Click somewhere else, or press Esc, to close a menu without choosing.",
                             [{"type": "menu", "menu": "File", "item": "Save"}, {"type": "menu", "menu": "Edit", "item": "Undo"}, {"type": "menu", "menu": "View", "item": "Zoom in"}], minutes=4),
                mouse_lesson("mouse-window", "Game: control a window",
                             "Every window has three buttons at the top right: minimise, maximise and close. The title bar can be dragged to move the window. Follow the instructions in the game.",
                             [{"type": "window"}], minutes=5),
                mouse_lesson("mouse-challenge", "Challenge: a bit of everything",
                             "A mix of everything you have learned. Go at your own pace.",
                             [{"type": "click", "count": 5}, {"type": "doubleClick", "count": 3}, {"type": "rightClick", "count": 2, "menuItem": "Rename"},
                              {"type": "drag", "count": 3}, {"type": "scroll"}, {"type": "selectText", "text": "well done"}], minutes=6),
            ],
        },
    ],
}
