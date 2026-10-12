"""Course 4: Internet and Email. Uses a built-in pretend web browser and a pretend email program.

"browser" lessons: data = {
  "sites": {url: {"title", "body" (markdown, links as [text](url)), "keywords": [...]}},
  "home": url shown in the first tab,
  "tasks": [{"instruction", "check"}]
}
browser checks: visited {url}, onPage {url}, tabsAtLeast {n}, searched {includes}, bookmarked {url},
                wentBack, closedTab, refreshed

"email" lessons: data = {
  "account": "you@example.com", "contacts": [{"name","address"}], "files": [names],
  "inbox": [{"id","from","address","subject","body","date","unread"}],
  "tasks": [{"instruction", "check"}]
}
email checks: sent {to, subjectIncludes?, bodyIncludes?, minWords?, attachment?, replyTo?},
              opened {id}, spam {id}, notSpam {id}, deleted {id}, starred {id}
"""

SITES = {
    "city-library.example": {
        "title": "City Library",
        "keywords": ["library", "books", "borrow"],
        "body": """
# Welcome to City Library

Borrow books, use the free computers, and join our reading groups.

- [Opening hours](city-library.example/hours)
- [Join the library](city-library.example/join)
- [Events this month](city-library.example/events)
""",
    },
    "city-library.example/hours": {
        "title": "Opening hours - City Library",
        "keywords": ["library", "hours", "open"],
        "body": """
# Opening hours

| Day | Hours |
|-----|-------|
| Monday to Friday | 9:00 to 18:00 |
| Saturday | 10:00 to 16:00 |
| Sunday | Closed |

[Back to the library home page](city-library.example)
""",
    },
    "city-library.example/join": {
        "title": "Join - City Library",
        "keywords": ["library", "join", "card"],
        "body": """
# Join the library

Bring a letter with your address to the front desk and we will make you a card on the spot. It is free.

[Back to the library home page](city-library.example)
""",
    },
    "city-library.example/events": {
        "title": "Events - City Library",
        "keywords": ["library", "events", "reading group", "computer class"],
        "body": """
# Events this month

- **Tuesday 14th, 10:00** - Beginners' computer club. All welcome.
- **Thursday 23rd, 18:30** - Reading group: this month's novel.

[Back to the library home page](city-library.example)
""",
    },
    "weather.example": {
        "title": "Weather Now",
        "keywords": ["weather", "forecast", "rain", "tomorrow", "sun"],
        "body": """
# Weather Now

**Today:** Sunny, 21°C.

**Tomorrow:** Cloudy with showers in the afternoon, 17°C. Take an umbrella!

[Five-day forecast](weather.example/week)
""",
    },
    "weather.example/week": {
        "title": "Five-day forecast - Weather Now",
        "keywords": ["weather", "forecast", "week"],
        "body": """
# Five-day forecast

| Day | Weather |
|-----|---------|
| Tomorrow | Showers, 17°C |
| Wednesday | Sunny, 22°C |
| Thursday | Sunny, 24°C |
| Friday | Cloudy, 19°C |
| Saturday | Rain, 15°C |

[Back](weather.example)
""",
    },
    "recipes.example": {
        "title": "Easy Recipes",
        "keywords": ["recipe", "recipes", "cook", "pancakes", "soup", "food"],
        "body": """
# Easy Recipes

Simple food for busy people.

- [Pancakes](recipes.example/pancakes)
- [Tomato soup](recipes.example/soup)
""",
    },
    "recipes.example/pancakes": {
        "title": "Pancakes - Easy Recipes",
        "keywords": ["recipe", "pancakes", "flour", "eggs"],
        "body": """
# Pancakes

**You need:** 1 cup flour, 1 egg, 1 cup milk, a pinch of salt, butter for the pan.

1. Whisk everything together until smooth.
2. Heat a little butter in a pan.
3. Pour in a small ladle of batter, cook until bubbles appear, flip, cook the other side.

[Back to recipes](recipes.example)
""",
    },
    "recipes.example/soup": {
        "title": "Tomato soup - Easy Recipes",
        "keywords": ["recipe", "soup", "tomato"],
        "body": """
# Tomato soup

Fry an onion, add a tin of tomatoes and a cup of water, simmer for 15 minutes, blend. Season to taste.

[Back to recipes](recipes.example)
""",
    },
    "bus-times.example": {
        "title": "Bus Times",
        "keywords": ["bus", "times", "timetable", "number 12"],
        "body": """
# Bus Times

**Number 12** to the town centre: every 15 minutes from 6:00 to 23:00.

**Number 34** to the hospital: every 30 minutes from 7:00 to 20:00.
""",
    },
    "prize-winner.example": {
        "title": "CONGRATULATIONS YOU WON!!!",
        "keywords": ["prize", "won", "winner", "free"],
        "body": """
# 🎉 CONGRATULATIONS! You are our 1,000,000th visitor!

**Click here NOW to claim your FREE prize!** Enter your bank card number to receive your reward. Hurry, only 2 minutes left!!!

> This is a pretend scam page. A real one would try to take your money. Close pages like this.
""",
    },
}


def browser_lesson(slug, title, intro, tasks, home="start.example", minutes=5):
    return {"slug": slug, "title": title, "kind": "browser", "minutes": minutes, "content": intro,
            "data": {"sites": SITES, "home": home, "tasks": tasks}}


INBOX = [
    {"id": "rose", "from": "Aunt Rose", "address": "rose.m@example.com", "date": "Today 09:12", "unread": True,
     "subject": "Sunday lunch?",
     "body": "Hello dear,\n\nAre you free for lunch on Sunday? I am making your favourite. Let me know, and send me a photo of the garden if you can!\n\nLove,\nRose"},
    {"id": "library", "from": "City Library", "address": "news@city-library.example", "date": "Yesterday", "unread": True,
     "subject": "Your book is ready to collect",
     "body": "The book you reserved is now at the front desk. Please collect it within 7 days.\n\nCity Library"},
    {"id": "sam", "from": "Sam Okafor", "address": "sam@example.com", "date": "Monday", "unread": False,
     "subject": "Welcome to the computer club",
     "body": "Hi!\n\nGreat to meet you at the library. Reply to this email so I have your address.\n\nSam"},
]

PHISH_INBOX = [
    {"id": "bank", "from": "YourBank Security", "address": "security@yourbank-verify-account.ru", "date": "Today 07:40", "unread": True,
     "subject": "URGENT: your account will be closed in 24 hours",
     "body": "Dear customer,\n\nWe detected unusual activity. Click the link below and enter your card number, PIN and password to keep your account open.\n\nhttp://yourbank-verify-account.ru/login\n\nYourBank Security Team"},
    {"id": "rose2", "from": "Aunt Rose", "address": "rose.m@example.com", "date": "Today 08:15", "unread": True,
     "subject": "Photos from Sunday",
     "body": "Lovely to see you on Sunday! Here are the photos. Rose x"},
    {"id": "parcel", "from": "Parcel Delivery", "address": "no-reply@parcel-track-7781.xyz", "date": "Yesterday", "unread": True,
     "subject": "Your parcel could not be delivered",
     "body": "A parcel is waiting for you. Pay the £1.99 redelivery fee by entering your card details here: http://parcel-track-7781.xyz/pay\n\nYou have not ordered anything? Pay anyway to avoid charges."},
    {"id": "library2", "from": "City Library", "address": "news@city-library.example", "date": "Monday", "unread": False,
     "subject": "Beginners' computer club: next Tuesday",
     "body": "A reminder that the computer club meets on Tuesday at 10:00. Bring your questions!\n\nCity Library"},
    {"id": "prize", "from": "Prize Department", "address": "winner@lucky-draw-prizes.biz", "date": "Monday", "unread": True,
     "subject": "You have WON £5,000!!! Claim now",
     "body": "Congratulations! You were selected at random. To receive your prize, reply with your full name, date of birth, address and bank account number within 48 hours."},
    {"id": "sam2", "from": "Sam Okafor", "address": "sam@example.com", "date": "Last week", "unread": False,
     "subject": "Re: Welcome to the computer club",
     "body": "Thanks for replying! See you Tuesday.\n\nSam"},
]


def email_lesson(slug, title, intro, tasks, inbox=None, files=None, minutes=5):
    return {"slug": slug, "title": title, "kind": "email", "minutes": minutes, "content": intro,
            "data": {
                "account": "you@example.com",
                "contacts": [{"name": "Aunt Rose", "address": "rose.m@example.com"},
                             {"name": "Sam Okafor", "address": "sam@example.com"},
                             {"name": "City Library", "address": "news@city-library.example"}],
                "files": files or ["garden.jpg", "letter to bank.docx", "holiday.jpg"],
                "inbox": inbox or INBOX,
                "tasks": tasks,
            }}


COURSE = {
    "slug": "internet",
    "title": "Internet and Email",
    "icon": "🌍",
    "description": "Use a web browser, search well, send and reply to email, and spot scams. "
                   "Practise in a pretend browser and inbox where nothing can go wrong.",
    "modules": [
        {
            "title": "The internet and the browser",
            "lessons": [
                {
                    "slug": "internet-what",
                    "title": "What is the internet?",
                    "kind": "reading",
                    "minutes": 5,
                    "content": """
# The internet

The **internet** is millions of computers around the world connected to each other. When your computer joins in, it can fetch pages, pictures and videos from any of them.

## Getting connected

Your computer connects through **Wi-Fi** (radio waves from a box at home called the **router**) or a **cable** plugged into that box. The router connects to the phone line or fibre, and from there to the world. If the Wi-Fi icon 📶 at the bottom right shows a globe with a line through it, you are not connected.

## Websites and addresses

A **website** is a set of pages that someone has put on the internet. Every website has an **address** (also called a URL or web address), such as **www.bbc.co.uk** or **city-library.example**. You type the address into the **browser** and the page appears.

The ending tells you a little about the site: **.com** (company), **.org** (organisation), **.gov** (government), **.co.uk** (United Kingdom), **.ac** (university).

## The browser

The **browser** is the program that shows websites. You already have one: **Microsoft Edge** comes with Windows, and many people install **Google Chrome**. They all work the same way, and this website (Study Buddy) is open in a browser right now.

## Pages have links

A **link** is text or a picture that takes you to another page when you click it. Links are usually **blue** or **underlined**, and the pointer becomes a **hand** 👆 when it is over one. Following links is how you move around the web.

## Search engines

When you do not know an address, you ask a **search engine** such as **Google** or **Bing**: type a few words, press Enter, and it lists pages that match. We practise this next.
""",
                },
                {
                    "slug": "internet-browser-parts",
                    "title": "Parts of the browser",
                    "kind": "reading",
                    "minutes": 5,
                    "content": """
# Parts of the browser

Look at the top of the browser window.

## The address bar

The long box at the top is the **address bar**. Click in it, type an address such as **weather.example**, and press **Enter**. If you type ordinary words instead, the browser treats them as a **search**. So the address bar does both jobs.

## Back, forward and refresh

- **←  Back** returns to the page you were on before. Press it several times to go further back.
- **→  Forward** goes forward again after you went back.
- **↻  Refresh** (reload) fetches the page again. Use it if a page looks stuck or out of date.

## Tabs

Browsers can show several pages at once, each in a **tab** along the very top. Click a tab to switch to it. Click the **+** to open a new empty tab, and the **×** on a tab to close it. Tabs let you keep the bus timetable open while you read the news.

## Bookmarks (favourites)

Found a page you will want again? Click the **star ☆** in the address bar to **bookmark** it. Bookmarked pages appear in the **bookmarks bar** or the bookmarks menu, one click away.

## Scrolling and zooming

Pages are often longer than the screen. Scroll down with the mouse wheel. If text is too small, hold **Ctrl** and press **+** to zoom in, **Ctrl** and **-** to zoom out, **Ctrl** and **0** to reset.

## Pop-ups and cookies

Many sites show a box asking you to **accept cookies**. Cookies are small notes a site keeps about your visit. Choosing **Reject** or **Only necessary** is fine. If a window pops up that you did not ask for, close it with its **×**.

The next lesson is practice in a pretend browser.
""",
                },
                browser_lesson("internet-browser-practice", "Practice: visit a website",
                               "The pretend browser below works like a real one. Click in the address bar, type the address, press Enter. Click links on the page. Use Back to return.",
                               [
                                   {"instruction": "Go to city-library.example (type it in the address bar and press Enter).", "check": {"type": "visited", "url": "city-library.example"}},
                                   {"instruction": "Click the Opening hours link.", "check": {"type": "visited", "url": "city-library.example/hours"}},
                                   {"instruction": "Press the Back button to return to the library home page.", "check": {"type": "wentBack"}},
                                   {"instruction": "Click the Events this month link.", "check": {"type": "visited", "url": "city-library.example/events"}},
                                   {"instruction": "Bookmark the events page with the star.", "check": {"type": "bookmarked", "url": "city-library.example/events"}},
                                   {"instruction": "Open a new tab with the + button and go to weather.example.", "check": {"type": "tabsAtLeast", "n": 2}},
                                   {"instruction": "The weather page should be open.", "check": {"type": "visited", "url": "weather.example"}},
                               ], minutes=6),
                {
                    "slug": "internet-search",
                    "title": "Searching well",
                    "kind": "reading",
                    "minutes": 5,
                    "content": """
# Searching well

A search engine finds pages that contain the words you type. A few habits make it work much better.

## Use the important words only

Not *what time does the number 12 bus go into town please*, but **bus 12 times**. The engine ignores little words anyway.

## Be specific

**pancake recipe** finds thousands of pages. **easy pancake recipe 1 egg** finds the one you want.

## Reading the results

Each result shows a **title** (the link), the **address** underneath, and a few lines of text. Read the address: is it the real company, the council, the library? Click the title to open the page. Use **Back** to return to the results and try another.

## Watch out for adverts

The first results are often marked **Ad** or **Sponsored**. Someone paid to be there. They are not always the best answer. Scroll a little to the ordinary results.

## Quotation marks

Put a phrase in quotes to find those exact words together: **"computer club" library**.

## Searching inside a page

A long page? Press **Ctrl + F**, type a word, and the browser highlights it on the page.

## Is it true?

Anyone can put a page on the internet. If something matters, such as health or money, check it against a second site you trust: the government, the health service, a well-known newspaper.
""",
                },
                browser_lesson("internet-search-practice", "Practice: search for an answer",
                               "Type words into the address bar (not an address) and press Enter to search. Read the results, click the best one.",
                               [
                                   {"instruction": "Search for: weather tomorrow", "check": {"type": "searched", "includes": "weather"}},
                                   {"instruction": "Open the Weather Now result and find tomorrow's forecast.", "check": {"type": "visited", "url": "weather.example"}},
                                   {"instruction": "Search for a pancake recipe.", "check": {"type": "searched", "includes": "pancake"}},
                                   {"instruction": "Open the pancakes page.", "check": {"type": "visited", "url": "recipes.example/pancakes"}},
                                   {"instruction": "Search for: bus 12 times, and open the Bus Times page.", "check": {"type": "visited", "url": "bus-times.example"}},
                                   {"instruction": "A result says you have won a prize. Open it, read it, then close that tab with its ×.", "check": {"type": "closedTab", "url": "prize-winner.example"}},
                               ], minutes=6),
                {
                    "slug": "internet-quiz-1",
                    "title": "Check: browsing and searching",
                    "kind": "quiz",
                    "minutes": 3,
                    "content": "Score 70% to pass.",
                    "data": {
                        "passScore": 70,
                        "questions": [
                            {"q": "Where do you type a website address?", "options": ["The taskbar", "The address bar at the top of the browser", "The Start menu", "A new email"], "answer": 1, "explain": "The address bar, then press Enter."},
                            {"q": "The pointer turns into a hand over some blue text. What is it?", "options": ["An advert", "A link", "A virus", "A tab"], "answer": 1, "explain": "A link takes you to another page when clicked."},
                            {"q": "Which button returns you to the page you were on before?", "options": ["Refresh", "Home", "Back", "Close"], "answer": 2, "explain": "Back (the left arrow)."},
                            {"q": "What does the star in the address bar do?", "options": ["Rates the page", "Bookmarks the page so you can find it again", "Deletes the page", "Prints the page"], "answer": 1, "explain": "A bookmark (favourite) saves the address."},
                            {"q": "Which search finds a bus timetable fastest?", "options": ["please tell me when the bus goes", "bus 12 times", "bus", "I need a bus"], "answer": 1, "explain": "Use the important words only."},
                            {"q": "A page says you are the millionth visitor and have won a prize. You should:", "options": ["Enter your card number", "Close it", "Tell your friends", "Phone the number shown"], "answer": 1, "explain": "Nobody gives away prizes to random visitors. It is a scam."},
                        ],
                    },
                },
            ],
        },
        {
            "title": "Email",
            "lessons": [
                {
                    "slug": "email-what",
                    "title": "What is email?",
                    "kind": "reading",
                    "minutes": 5,
                    "content": """
# Email

**Email** is a letter sent over the internet. It arrives in seconds, costs nothing, and can carry photos and documents.

## Addresses

Every person has an **email address** that looks like **name@somewhere.com**. The part before the **@** is the person, the part after is the company that handles their mail (gmail.com, outlook.com, yahoo.com). Addresses have no spaces and capital letters do not matter.

## The parts of an email

| Part | Meaning |
|------|---------|
| **To** | The address you are sending to. |
| **Cc** | Extra people who get a copy. |
| **Subject** | A short title, like the headline of a letter. Always fill it in. |
| **Body** | The message itself. |
| **Attachment** 📎 | A file sent along with the message: a photo, a document. |

## Your mailbox

- **Inbox**: mail that has arrived. **Bold** messages are unread.
- **Sent**: copies of everything you sent.
- **Drafts**: messages you started but have not sent.
- **Spam** (or Junk): mail the program thinks is rubbish or a scam.
- **Bin** (or Trash): deleted mail, kept for a while in case you change your mind.

## Reading and replying

Click a message to open it. Then:

- **Reply** answers the sender. The subject becomes *Re: ...* and the address is filled in for you.
- **Reply all** answers everyone who was on the message.
- **Forward** sends the message on to someone else.

## Writing a new email

Click **New** (or **Compose**), fill in **To** and **Subject**, type your message, and click **Send**. Start with a greeting and finish with your name, just as you would in a letter. Read it once before sending: you cannot unsend an email.

Email programs look slightly different (Outlook, Gmail, the Mail app) but have exactly these parts. The next lesson is practice in a pretend one.
""",
                },
                email_lesson("email-send", "Practice: send an email",
                             "Click **New email**. Fill in To, Subject and the message. Then click **Send**. You can pick an address from the contacts list or type it.",
                             [
                                 {"instruction": "Send an email to sam@example.com with the subject 'Hello from the computer club'.", "check": {"type": "sent", "to": "sam@example.com", "subjectIncludes": "hello"}},
                                 {"instruction": "The message should be at least 10 words and end with your name.", "check": {"type": "sent", "to": "sam@example.com", "minWords": 10}},
                             ], minutes=5),
                email_lesson("email-reply-attach", "Practice: reply and attach a photo",
                             "Open the email from Aunt Rose, click **Reply**, write your answer, use the **📎 Attach** button to add garden.jpg, and send.",
                             [
                                 {"instruction": "Open the email from Aunt Rose.", "check": {"type": "opened", "id": "rose"}},
                                 {"instruction": "Reply to it (the To box fills in by itself).", "check": {"type": "sent", "replyTo": "rose", "minWords": 5}},
                                 {"instruction": "Your reply should include the photo garden.jpg as an attachment.", "check": {"type": "sent", "replyTo": "rose", "attachment": "garden.jpg"}},
                                 {"instruction": "Open the email from the City Library and star it so you remember to collect your book.", "check": {"type": "starred", "id": "library"}},
                             ], minutes=6),
                {
                    "slug": "email-tips",
                    "title": "Email habits that help",
                    "kind": "reading",
                    "minutes": 4,
                    "content": """
# Good email habits

## Writing

- Always put a **subject**. *Sunday lunch* is better than *Hi* or nothing.
- Keep it short. One topic per email if you can.
- Say who you are if the person might not know your address.
- Avoid writing in ALL CAPITALS. It reads as shouting.
- **Read it once** before pressing Send. Check the **To** address especially.

## Attachments

- Click **Attach** 📎, find the file, click Open. Wait for it to finish uploading before you send.
- Photos straight from a phone can be very large. Most programs offer to make them smaller; say yes.
- Only open attachments from people you know. An unexpected attachment, even from a friend, can be a virus: ask them first.

## Keeping tidy

- **Delete** mail you do not need. It goes to the Bin for a month.
- **Star** or flag mail you must come back to.
- Make **folders** (or labels) such as *Family*, *Bills*, *Receipts* and move mail into them.
- Click **Unsubscribe** at the bottom of newsletters you no longer want. This is safe for genuine companies.

## Reply vs Reply all

**Reply** goes to one person. **Reply all** goes to everyone on the message. If a message went to 30 people, think before choosing Reply all.

## If you are not sure it is genuine

Do not click anything. Go to the next module.
""",
                },
            ],
        },
        {
            "title": "Staying safe online",
            "lessons": [
                {
                    "slug": "internet-passwords",
                    "title": "Passwords",
                    "kind": "reading",
                    "minutes": 5,
                    "content": """
# Passwords

A password is the key to your email, your bank, your shopping accounts. A few rules keep the key safe.

## Make it strong

- **Long** beats complicated. Three or four random words joined together, such as *purple-tractor-lamp-ocean*, is long, strong and easy to remember.
- Avoid names, birthdays, *password*, *123456* and the name of your pet. Criminals try those first.
- Different accounts, **different passwords**. If one site is hacked, the others stay safe. At the very least, your **email password** must be unique, because email can reset all the others.

## Keep it to yourself

- No genuine company, bank or technician will **ever** ask for your password by phone, email or text.
- Do not type it on a shared computer and leave yourself signed in.
- Writing passwords in a **notebook kept at home** is fine for most people. A sticky note on the screen is not.

## Let the computer remember

Browsers and phones offer to **save passwords**. For a computer only you use, this is safe and convenient. A **password manager** (built into Edge, Chrome and iPhone/Android) can even invent strong passwords for you.

## Two-step verification

Many services offer **two-step** (two-factor) verification: after the password, they text a code to your phone. Turn it on for email and banking. Even someone who learns your password cannot get in without your phone.

## If you forget

Every site has a **Forgotten password?** link on the sign-in page. It sends a reset link to your email. This is why your email password matters most.

## Signs something is wrong

- An email saying *your password was changed* that you did not ask for.
- Being signed out unexpectedly.

Change the password straight away, from the site's own page (not from a link in the email).
""",
                },
                {
                    "slug": "internet-scams",
                    "title": "Spotting scams",
                    "kind": "reading",
                    "minutes": 6,
                    "content": """
# Scams

Most scams work by **rushing** or **frightening** you into doing something you would never do calmly. Once you know the tricks, they are easy to spot.

## Phishing

A **phishing** email or text pretends to be your bank, the post office, the tax office or a big company. It says there is a problem and asks you to click a link and *confirm your details*. The link leads to a fake copy of the real site, which steals what you type.

**Signs of phishing:**

- **Urgency**: *within 24 hours*, *your account will be closed*, *final warning*.
- A **sender address** that is not quite right: *security@yourbank-verify.ru* instead of *@yourbank.com*. Look at the address, not just the name.
- **Dear customer** instead of your name.
- Asks for a **password, PIN, card number** or payment. Real companies never do this by email.
- Spelling mistakes and odd grammar.
- A link whose address does not match the company. Hover over it (do not click) and look at the bottom of the window.

**What to do:** do not click, do not reply. Mark it as **spam**. If you are worried about your real account, open the bank's website yourself by typing its address, or phone the number on your card.

## Phone calls

*We are from Microsoft and your computer has a virus.* *We are the bank, move your money to a safe account.* **Hang up.** Microsoft does not phone people. Banks never ask you to move money.

## Pop-ups and fake virus warnings

A page that flashes **YOUR COMPUTER IS INFECTED, CALL THIS NUMBER** is a scam, every time. Close the browser. If it will not close, press **Ctrl + Alt + Delete** and end it from Task Manager. Nothing is actually wrong with the computer.

## Too good to be true

Prizes you never entered. A stranger who wants to share millions. A famous brand selling at 90% off on a site you have never heard of. Someone online who falls in love fast and then needs money for a ticket. All scams.

## Paying safely

- Shop on sites you know. Look for the **padlock 🔒** in the address bar.
- Never pay by **gift card** or **bank transfer** to someone you have not met. A genuine shop takes a card.

## If it happens anyway

It happens to clever people every day. Tell your bank immediately: they can often stop the payment. Change your passwords. Do not be embarrassed.
""",
                },
                email_lesson("internet-phish-practice", "Practice: find the scams in the inbox",
                             "This inbox has six emails. **Two are genuine** and the rest are scams. Open each one, look at the sender's address and what it asks for, then use **Report spam** on the scams. Do not mark the genuine ones.",
                             [
                                 {"instruction": "Report the fake bank email as spam.", "check": {"type": "spam", "id": "bank"}},
                                 {"instruction": "Report the parcel fee email as spam.", "check": {"type": "spam", "id": "parcel"}},
                                 {"instruction": "Report the prize email as spam.", "check": {"type": "spam", "id": "prize"}},
                                 {"instruction": "Leave Aunt Rose's email alone (it is genuine).", "check": {"type": "notSpam", "id": "rose2"}},
                                 {"instruction": "Leave the City Library and Sam's emails alone (they are genuine).", "check": {"type": "notSpam", "id": "library2"}},
                             ], inbox=PHISH_INBOX, minutes=6),
                {
                    "slug": "internet-downloads",
                    "title": "Downloading safely",
                    "kind": "reading",
                    "minutes": 4,
                    "content": """
# Downloading

**Downloading** means copying something from the internet onto your computer: a photo, a PDF bill, a program.

## Where it goes

Downloads land in the **Downloads** folder. The browser shows a small arrow or a bar at the top right while it happens; click it to open the file.

## Documents and pictures are safe

A PDF, a photo, a Word document from a site or person you know: open it. If a document asks you to *Enable content* or *Enable macros*, say **no** unless you were expecting it.

## Programs need care

A **program** (.exe, .msi) can do anything to the computer. Only download programs:

- From the **Microsoft Store** (Start > Microsoft Store), or
- From the **maker's own website**: get Zoom from zoom.us, Chrome from google.com/chrome.

Never from a pop-up, an email, or a *download now* button on a random site. If Windows shows a blue **SmartScreen** warning when you open a download, stop and ask someone.

## Free things that are not free

Sites offering free films, music or software often bundle unwanted programs. If a download page has three different Download buttons, close it.

## Keeping things tidy

Downloads piles up. Move the things you want into Documents or Pictures, and delete the rest.
""",
                },
                {
                    "slug": "internet-quiz-2",
                    "title": "Final check: email and safety",
                    "kind": "quiz",
                    "minutes": 4,
                    "content": "Score 70% to pass.",
                    "data": {
                        "passScore": 70,
                        "questions": [
                            {"q": "Which is a good password?", "options": ["password1", "your birthday", "three or four random words joined together", "123456"], "answer": 2, "explain": "Long and random beats short and clever."},
                            {"q": "Your bank emails asking you to click a link and confirm your PIN. What do you do?", "options": ["Click and enter it", "Reply with the PIN", "Mark it as spam and contact the bank yourself if worried", "Forward it to friends"], "answer": 2, "explain": "Banks never ask for PINs or passwords by email."},
                            {"q": "What does the Reply button do?", "options": ["Deletes the email", "Writes an answer to the sender with the address filled in", "Sends the email to everyone", "Prints the email"], "answer": 1, "explain": "Reply answers the person who wrote to you."},
                            {"q": "Someone phones saying they are Microsoft and your computer has a virus.", "options": ["Let them connect to fix it", "Pay them", "Hang up", "Give them your password"], "answer": 2, "explain": "Microsoft never phones. Hang up."},
                            {"q": "Which email address is most likely a scam?", "options": ["news@city-library.example", "sam@example.com", "security@yourbank-verify-account.ru", "rose.m@example.com"], "answer": 2, "explain": "A real bank uses its own address. Look at what comes after the @."},
                            {"q": "Where should you download programs from?", "options": ["Any site with a big Download button", "Email attachments", "The Microsoft Store or the maker's own website", "Pop-ups"], "answer": 2, "explain": "Trusted sources only."},
                            {"q": "What is an attachment?", "options": ["A file sent with an email", "A kind of virus", "The subject line", "A reply"], "answer": 0, "explain": "Photos and documents travel as attachments."},
                            {"q": "A page flashes 'YOUR COMPUTER IS INFECTED, CALL NOW'. You should:", "options": ["Call the number", "Close the browser; nothing is wrong", "Download their fix", "Enter your card details"], "answer": 1, "explain": "Fake virus warnings are scams, every time."},
                        ],
                    },
                },
            ],
        },
    ],
}
