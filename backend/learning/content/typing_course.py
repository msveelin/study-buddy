"""Course 1: Touch typing for complete beginners."""


def typing_lesson(slug, title, intro, text, keys, target_wpm, target_acc=90, minutes=6):
    return {
        "slug": slug,
        "title": title,
        "kind": "typing",
        "minutes": minutes,
        "content": intro,
        "data": {"text": text, "keys": keys, "targetWpm": target_wpm, "targetAccuracy": target_acc},
    }


COURSE = {
    "slug": "typing",
    "title": "Keyboard & Touch Typing",
    "icon": "⌨️",
    "description": "Learn where every key lives and type without looking at your hands. "
                   "Start with two keys and build up to full sentences.",
    "modules": [
        {
            "title": "Getting ready",
            "lessons": [
                {
                    "slug": "typing-welcome",
                    "title": "Welcome: how to sit and where to put your hands",
                    "kind": "reading",
                    "minutes": 4,
                    "content": """
# Welcome to typing!

Typing is the first skill on your journey. Once your fingers know the keyboard, everything else on a computer becomes faster and easier.

## How to sit

- Sit up straight with your feet flat on the floor.
- Keep your elbows bent at about 90 degrees, close to your body.
- The screen should be about an arm's length away, with the top at eye level.
- Keep your wrists straight, floating just above the keyboard (do not rest them on the desk while typing).

## The home row

Look at the keyboard. In the middle row of letters you will see **A S D F** on the left and **J K L ;** on the right. This row is called the **home row**. Your fingers rest here and return here after every key press.

Feel the keys **F** and **J**. They have a small bump on them. The bumps let you find the home row without looking down.

## Finger placement

| Finger | Left hand | Right hand |
|--------|-----------|------------|
| Index  | F         | J          |
| Middle | D         | K          |
| Ring   | S         | L          |
| Pinky  | A         | ;          |
| Thumbs | Space bar | Space bar  |

## The golden rule

**Do not look at your hands.** It feels slow at first. That is normal. Accuracy comes first, speed comes later by itself.

Click **Mark as done** and move to the first practice.
""",
                },
                typing_lesson(
                    "typing-fj",
                    "F and J: the bumpy keys",
                    """
Put your left index finger on **F** and your right index finger on **J**. Feel the bumps.

Press the **space bar** with either thumb. Type the text below exactly as shown. The next character to type is highlighted.
""",
                    "f j f j fj fj jf jf ff jj fjf jfj f j fj jf ff jj fj jf fjf jfj",
                    ["f", "j"], 0, 85, 4,
                ),
                typing_lesson(
                    "typing-dk",
                    "D and K: middle fingers",
                    "Keep your index fingers on F and J. Now use your **middle fingers** for **D** and **K**.",
                    "d k d k dk kd fd jk df kj dk kd fdk jkd dkf kdj fd jk dk kd fdjk",
                    ["d", "k", "f", "j"], 0, 85, 4,
                ),
                typing_lesson(
                    "typing-sl",
                    "S and L: ring fingers",
                    "Your **ring fingers** press **S** and **L**. Ring fingers are weak at first. Go slowly.",
                    "s l s l sl ls ds kl sd lk sl ls fsd jlk sdf lkj sl ls sdl lks",
                    ["s", "l", "d", "k", "f", "j"], 0, 85, 4,
                ),
                typing_lesson(
                    "typing-a-semicolon",
                    "A and ; : pinky fingers",
                    "Your **pinky fingers** press **A** and **;** (semicolon). Now you know the whole home row!",
                    "a ; a ; a; ;a sa l; as ;l asdf ;lkj fdsa jkl; a;sl dkfj asdf jkl; a ; as ;l",
                    ["a", ";", "s", "l", "d", "k", "f", "j"], 0, 85, 4,
                ),
                typing_lesson(
                    "typing-home-row-words",
                    "Home row words",
                    "Real words using only the home row. Remember: return every finger to its home key after pressing.",
                    "sad lad dad fad ask all fall lass flask salad as a sad lad asks dad; a lass falls; add a salad",
                    ["a", "s", "d", "f", "j", "k", "l", ";"], 10, 88, 5,
                ),
            ],
        },
        {
            "title": "Reaching up and down",
            "lessons": [
                typing_lesson(
                    "typing-gh",
                    "G and H: index finger stretch",
                    "Your index fingers also reach sideways: left index reaches to **G**, right index reaches to **H**. Then bring the finger back to F or J.",
                    "g h g h gh hg fg jh gf hj half gash hash glad flag shag sag has had gas lag; glad hall",
                    ["g", "h"], 10, 88, 5,
                ),
                typing_lesson(
                    "typing-ei",
                    "E and I: reaching to the top row",
                    "Reach **up** with your middle fingers. Left middle finger goes to **E**, right middle finger goes to **I**. Return to D and K afterwards.",
                    "e i e i ei ie de ki ed ik lie die sea sie side idea seek fish dish like life hike field",
                    ["e", "i"], 12, 88, 5,
                ),
                typing_lesson(
                    "typing-ru",
                    "R and U: index fingers up",
                    "Left index reaches up to **R**, right index reaches up to **U**.",
                    "r u r u ru ur fr ju rf uj rug fur run sure hurl rude lure rules free user ruler sugar",
                    ["r", "u"], 12, 88, 5,
                ),
                typing_lesson(
                    "typing-ty",
                    "T and Y: the long stretch",
                    "The index fingers stretch up and inward for **T** and **Y**. These are the hardest reaches on the top row.",
                    "t y t y ty yt ft jy tf yj the try yet they tie yes type thy style duty tasty",
                    ["t", "y"], 14, 88, 5,
                ),
                typing_lesson(
                    "typing-wo",
                    "W and O: ring fingers up",
                    "Ring fingers reach up: left to **W**, right to **O**.",
                    "w o w o wo ow sw lo ws ol who how low owl two wood slow show world hollow follow",
                    ["w", "o"], 14, 88, 5,
                ),
                typing_lesson(
                    "typing-qp",
                    "Q and P: pinkies up",
                    "Pinky fingers reach up: left to **Q**, right to **P**.",
                    "q p q p qp pq aq ;p qa p; quip pup quit paper quote equip prop apple people quiet",
                    ["q", "p"], 14, 88, 5,
                ),
                typing_lesson(
                    "typing-bottom-row",
                    "The bottom row: Z X C V B N M",
                    """
Now reach **down**:

- Left pinky: **Z**, ring: **X**, middle: **C**, index: **V** (and stretch to **B**)
- Right index: **N** and **M**, middle: **,** ring: **.** pinky: **/**

The right index finger covers both **N** and **M**. Take it slowly.
""",
                    "z x c v b n m zx cv bn m, can van ban man zinc mix box next move cabin vexing",
                    ["z", "x", "c", "v", "b", "n", "m"], 14, 88, 6,
                ),
                typing_lesson(
                    "typing-all-letters",
                    "All the letters together",
                    "Every letter of the alphabet. Keep your eyes on the screen!",
                    "the quick brown fox jumps over the lazy dog. pack my box with five dozen liquor jugs.",
                    [], 16, 88, 6,
                ),
            ],
        },
        {
            "title": "Capitals, numbers and symbols",
            "lessons": [
                typing_lesson(
                    "typing-shift",
                    "Capital letters with Shift",
                    """
To type a capital letter, hold **Shift** with the pinky of the *opposite* hand, then press the letter.

- Capital **A** (left hand letter): hold **right Shift** with the right pinky, press A.
- Capital **J** (right hand letter): hold **left Shift** with the left pinky, press J.

Never use the same hand for Shift and the letter. That twists your hand.
""",
                    "The Dog. My Cat. Sam And Jill. New York. Big Red Bus. Ask Dad. Kind Lion. Fast Jet. Hello World",
                    ["shift"], 16, 88, 6,
                ),
                typing_lesson(
                    "typing-punctuation",
                    "Full stops, commas and question marks",
                    """
- **,** (comma) is under K: right middle finger reaches down.
- **.** (full stop) is under L: right ring finger reaches down.
- **?** is Shift + / : right pinky reaches down, left pinky holds Shift.
- **'** (apostrophe) is right of ; : right pinky.
""",
                    "Hello, how are you? I am fine, thank you. It's late. Where is it? Don't worry, we'll go.",
                    [",", ".", "?", "'"], 18, 88, 6,
                ),
                typing_lesson(
                    "typing-numbers",
                    "The number row",
                    """
Numbers sit above the top letter row. Each finger reaches up two rows:

- Left: pinky **1**, ring **2**, middle **3**, index **4** and **5**
- Right: index **6** and **7**, middle **8**, ring **9**, pinky **0**
""",
                    "1 2 3 4 5 6 7 8 9 0 12 34 56 78 90 2024 100 365 24 7 in 2024 we had 12 months and 365 days",
                    ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"], 18, 88, 6,
                ),
                typing_lesson(
                    "typing-symbols",
                    "Common symbols: @ # $ % & ( ) - _ =",
                    "Hold Shift and press a number key. Also practice the minus and equals keys at the end of the number row.",
                    "me@mail.com #1 fan 100% done (yes) 5-3=2 a_b $20 & more; price = 10 - 2",
                    ["@", "#", "$", "%", "&", "(", ")", "-", "_", "="], 18, 88, 6,
                ),
            ],
        },
        {
            "title": "Speed and fluency",
            "lessons": [
                typing_lesson(
                    "typing-common-words",
                    "The 50 most common English words",
                    "These words make up almost half of everything you will ever type. Learn them by feel.",
                    "the of and to in is you that it he was for on are as with his they I at be this have from or one had by word but not what all were we when your can said there use an each which she do how their if",
                    [], 20, 90, 6,
                ),
                typing_lesson(
                    "typing-sentences",
                    "Short sentences",
                    "Full sentences with capitals and punctuation. Aim for a steady rhythm rather than bursts of speed.",
                    "The sun is warm today. We will walk to the park after lunch. My friend has a new blue bike. Can you help me carry these bags? Thank you very much.",
                    [], 22, 90, 7,
                ),
                typing_lesson(
                    "typing-paragraph",
                    "A whole paragraph",
                    "Your first paragraph. Keep going even if you make a mistake: press Backspace to fix it and continue.",
                    "Computers are tools that follow instructions. When you type, each key sends a signal to the computer, which shows a letter on the screen. Learning to type well means you can spend your time thinking about your ideas instead of hunting for keys. Practice a little every day and your speed will grow.",
                    [], 24, 90, 8,
                ),
                typing_lesson(
                    "typing-speed-test",
                    "Speed test: 30 words per minute",
                    "This is the final test for this course. Type the paragraph with at least 90% accuracy and 30 words per minute. You can retry as many times as you like.",
                    "Every expert was once a beginner. The keys that felt strange a few days ago now feel familiar under your fingers. Keep your eyes on the screen, keep your wrists relaxed, and trust your hands. You have learned the whole keyboard, and that is something to be proud of.",
                    [], 30, 90, 8,
                ),
                {
                    "slug": "typing-quiz",
                    "title": "Keyboard knowledge check",
                    "kind": "quiz",
                    "minutes": 4,
                    "content": "A quick check of what you have learned. Score 70% or more to pass.",
                    "data": {
                        "passScore": 70,
                        "questions": [
                            {"q": "Which two keys have small bumps so you can find them without looking?",
                             "options": ["A and ;", "F and J", "D and K", "G and H"], "answer": 1,
                             "explain": "F and J have bumps. Your index fingers rest on them."},
                            {"q": "Which finger presses the space bar?",
                             "options": ["Index finger", "Pinky", "Thumb", "Ring finger"], "answer": 2,
                             "explain": "Either thumb presses the space bar."},
                            {"q": "To type a capital A, which Shift key should you hold?",
                             "options": ["Left Shift", "Right Shift", "Either, with the same hand", "Caps Lock"], "answer": 1,
                             "explain": "A is a left-hand key, so the right pinky holds Shift."},
                            {"q": "What is the row A S D F J K L ; called?",
                             "options": ["Top row", "Home row", "Bottom row", "Number row"], "answer": 1,
                             "explain": "It is the home row, where your fingers rest."},
                            {"q": "What should you do when you make a typing mistake?",
                             "options": ["Start over from the beginning", "Press Backspace, fix it, continue", "Ignore it and keep typing", "Look at your hands"], "answer": 1,
                             "explain": "Backspace deletes the last character. Fix it and keep going."},
                        ],
                    },
                },
            ],
        },
        {
            "title": "Shortcuts everyone uses",
            "lessons": [
                {
                    "slug": "typing-shortcuts-intro",
                    "title": "Keyboard shortcuts: the same everywhere",
                    "kind": "reading",
                    "minutes": 5,
                    "content": """
# Keyboard shortcuts

A **shortcut** is a key combination that does a job instantly, without the mouse. **Ctrl + C** means: hold down the **Ctrl** key (bottom left), tap **C**, let go of both. The best thing about shortcuts is that the same ones work in Word, Excel, email, the browser, File Explorer, everywhere.

## The ones worth learning first

| Shortcut | Does | Think of it as |
|----------|------|----------------|
| **Ctrl + C** | **Copy** the selected text or file | C for Copy |
| **Ctrl + V** | **Paste** what you copied | V looks like an arrow pointing down: put it here |
| **Ctrl + X** | **Cut** (copy and remove) | X like scissors |
| **Ctrl + Z** | **Undo** the last thing | Z for zap it back |
| **Ctrl + Y** | **Redo** what you just undid | |
| **Ctrl + A** | Select **All** | |
| **Ctrl + S** | **Save** | S for Save. Press it often. |
| **Ctrl + P** | **Print** | |
| **Ctrl + F** | **Find** a word on the page | |
| **Ctrl + B / I / U** | **Bold / Italic / Underline** | |

## Keys that are shortcuts on their own

| Key | Does |
|-----|------|
| **Enter** | Confirm, or start a new line. |
| **Esc** | Cancel, close a menu or pop-up. |
| **Tab** | Jump to the next box in a form. **Shift + Tab** goes back. |
| **Backspace** | Delete the letter to the **left** of the cursor. |
| **Delete** | Delete the letter to the **right**, or delete the selected file. |
| **Home / End** | Jump to the start / end of the line. |
| **Caps Lock** | Capital letters until pressed again. If EVERYTHING COMES OUT IN CAPITALS, press it once. |
| **F2** | Rename the selected file. |

## Windows shortcuts

| Shortcut | Does |
|----------|------|
| **Alt + Tab** | Switch between open windows. |
| **⊞ Win** | Open the Start menu. |
| **⊞ Win + E** | Open File Explorer. |
| **⊞ Win + D** | Show the desktop (hide all windows). Press again to bring them back. |
| **⊞ Win + L** | Lock the computer when you walk away. |
| **Alt + F4** | Close the current program. |
| **Ctrl + Alt + Delete** | The rescue screen, with Task Manager. |

You do not need to learn them all at once. The next two lessons practise the ones you will use every day.
""",
                },
                {
                    "slug": "typing-shortcuts-practice",
                    "title": "Practice: press the shortcuts",
                    "kind": "shortcuts",
                    "minutes": 5,
                    "content": "Press each shortcut shown. Hold the first key, tap the second, let go. The trainer tells you when it felt the right keys.",
                    "data": {
                        "combos": [
                            {"keys": "Ctrl+C", "name": "Copy"},
                            {"keys": "Ctrl+V", "name": "Paste"},
                            {"keys": "Ctrl+X", "name": "Cut"},
                            {"keys": "Ctrl+Z", "name": "Undo"},
                            {"keys": "Ctrl+Y", "name": "Redo"},
                            {"keys": "Ctrl+A", "name": "Select all"},
                            {"keys": "Ctrl+S", "name": "Save"},
                            {"keys": "Ctrl+P", "name": "Print"},
                            {"keys": "Ctrl+F", "name": "Find"},
                            {"keys": "Ctrl+B", "name": "Bold"},
                            {"keys": "Escape", "name": "Cancel (Esc)"},
                            {"keys": "F2", "name": "Rename"},
                            {"keys": "Shift+Tab", "name": "Previous box"},
                            {"keys": "Ctrl+Home", "name": "Jump to the top"},
                        ],
                    },
                },
                {
                    "slug": "typing-shortcuts-editor",
                    "title": "Practice: copy, paste and undo for real",
                    "kind": "shortcuts",
                    "minutes": 5,
                    "content": "Now use the shortcuts on real text. Select text by dragging across it (or double-click a word), then use Ctrl + C, Ctrl + V, Ctrl + X and Ctrl + Z in the box below.",
                    "data": {
                        "editor": {
                            "text": "The quick brown fox.\nJump!",
                            "tasks": [
                                {"instruction": "Select the word Jump! and copy it (Ctrl + C). Then click at the end of the text and paste it twice (Ctrl + V) so Jump! appears three times.", "check": {"type": "countOccurrences", "text": "Jump!", "n": 3}},
                                {"instruction": "Select the word quick, cut it (Ctrl + X) so the first line reads: The brown fox.", "check": {"type": "textIncludes", "text": "The brown fox."}},
                                {"instruction": "Press Ctrl + Z until quick is back.", "check": {"type": "textIncludes", "text": "The quick brown fox."}},
                                {"instruction": "Press Ctrl + A to select everything, then type: Shortcuts save time", "check": {"type": "textEquals", "text": "Shortcuts save time"}},
                            ],
                        },
                    },
                },
            ],
        },
    ],
}
