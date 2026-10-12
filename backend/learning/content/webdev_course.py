"""Course: Web development basics (HTML, CSS, a little JavaScript) in a live playground.

Every lesson ends with a "Learn more on W3Schools" box. W3Schools (https://www.w3schools.com) is the
best-known free reference for web development; its pages have short explanations, examples and a
"Try it Yourself" editor, so the learner can keep exploring after each lesson here.
"""

W3 = "https://www.w3schools.com"


def w3(*pairs):
    """Render a 'Learn more on W3Schools' box from (label, path) pairs."""
    lines = "\n".join(f"- [{label}]({W3}/{path})" for label, path in pairs)
    return f"\n\n## Learn more on W3Schools\n\n{lines}\n\nEach page has a **Try it Yourself** button that opens a live editor just like the one below.\n"


def web_lesson(slug, title, content, html, css, checks, minutes=8, js=""):
    return {
        "slug": slug,
        "title": title,
        "kind": "web",
        "minutes": minutes,
        "content": content,
        "data": {"html": html, "css": css, "js": js, "checks": checks},
    }


COURSE = {
    "slug": "webdev",
    "title": "Web Development",
    "icon": "🌐",
    "description": "Build real web pages with HTML and CSS, then make them interactive with JavaScript. "
                   "Edit code on the left, see the page update on the right, and keep going on W3Schools.",
    "modules": [
        # ------------------------------------------------------------------ HTML
        {
            "title": "HTML: the structure of a page",
            "lessons": [
                {
                    "slug": "web-how-it-works",
                    "title": "What happens when you open a website",
                    "kind": "reading",
                    "minutes": 6,
                    "content": """
# How the web works

When you type **www.example.com** into a browser:

1. Your **browser** (Chrome, Edge, Firefox, Safari) looks up the address and sends a **request** across the internet.
2. A **server**, a computer somewhere else that is switched on all day, sends back a set of files.
3. The browser reads those files and **draws** the page on your screen.

The address you typed is a **URL** (Uniform Resource Locator). `https://` means the connection is encrypted, `www.example.com` is the **domain** (the server's name), and anything after a `/` points to a page on that server.

## The three languages of a web page

| Language | Job | Think of it as |
|----------|-----|----------------|
| **HTML** | Content and structure: headings, paragraphs, images, links | The skeleton |
| **CSS** | Appearance: colours, sizes, spacing, layout | The clothes |
| **JavaScript** | Behaviour: what happens when you click, type or scroll | The muscles |

You already know JavaScript from the previous course. In this course you will learn HTML and CSS, then connect JavaScript to the page.

## Front end and back end

- Everything the browser draws is the **front end**. That is what this course teaches.
- Code that runs on the server (saving your data, logging you in) is the **back end**. This app's back end is written in Python with Django, and the two talk to each other over the internet protocol HTTP.

## About W3Schools

[W3Schools](https://www.w3schools.com) is a free website with tutorials and references for HTML, CSS and JavaScript. Every lesson here ends with links to the matching W3Schools pages. Use them when you want more examples, and press the green **Try it Yourself** button on any of their pages to experiment in a live editor.

## The playground

Every practice lesson has an editor with **index.html**, **style.css** and sometimes **script.js** tabs, and a live **preview**. Change the code and the preview updates. The **Checks** list tells you when the task is done.

A tiny web page:

```html
<h1>My page</h1>
<p>Welcome to my first web page.</p>
```

Those `<h1>` and `<p>` things are **tags**. Let's learn them.
""" + w3(("HTML Introduction", "html/html_intro.asp"), ("CSS Introduction", "css/css_intro.asp"),
         ("JavaScript Introduction", "js/js_intro.asp"), ("How the web works: HTML, CSS and JS editor", "html/html_editors.asp")),
                },
                web_lesson(
                    "web-first-page",
                    "Your first HTML: headings and paragraphs",
                    """
# Tags and elements

HTML is made of **elements**. An element usually has an opening tag, some content, and a closing tag:

```html
<p>This is a paragraph.</p>
```

- `<p>` opens, `</p>` closes (note the slash).
- The whole thing, tags plus content, is the **element**.
- Tag names are not case sensitive, but lowercase is the convention.

## Headings

`<h1>` is the biggest heading and should be used once per page for the main title. `<h2>` is for sections, `<h3>` for sub-sections, down to `<h6>`. Search engines use headings to understand what a page is about, so use them for structure, not just for big text.

## Paragraphs and whitespace

The browser ignores extra spaces and blank lines in your HTML. Ten spaces become one; a new line in the code does **not** start a new line on the page. Only tags like `<p>` and `<br>` (line break) do that.

## Your task

1. Change the `<h1>` text to **About Me**.
2. Add a `<h2>` with the text **My hobbies**.
3. Add a second `<p>` paragraph (any text).
""" + w3(("HTML Basic Examples", "html/html_basic.asp"), ("HTML Elements", "html/html_elements.asp"),
         ("HTML Headings", "html/html_headings.asp"), ("HTML Paragraphs", "html/html_paragraphs.asp")),
                    "<h1>Hello</h1>\n<p>This is my first web page.</p>\n",
                    "",
                    [
                        {"type": "textIncludes", "selector": "h1", "text": "About Me", "label": "h1 says About Me"},
                        {"type": "textIncludes", "selector": "h2", "text": "My hobbies", "label": "h2 says My hobbies"},
                        {"type": "count", "selector": "p", "min": 2, "label": "at least two paragraphs"},
                    ],
                ),
                web_lesson(
                    "web-text-formatting",
                    "Formatting text: bold, italic, breaks and comments",
                    """
# Text formatting tags

| Tag | Meaning | Looks like |
|-----|---------|------------|
| `<strong>` | important text | **bold** |
| `<em>` | emphasised text | *italic* |
| `<mark>` | highlighted | yellow background |
| `<small>` | fine print | smaller |
| `<br>` | line break | starts a new line (no closing tag) |
| `<hr>` | horizontal rule | a dividing line (no closing tag) |

`<b>` and `<i>` also exist and look the same, but `<strong>` and `<em>` carry **meaning**, which helps screen readers and search engines.

## Comments

Notes for yourself that the browser ignores:

```html
<!-- This is a comment. It does not show on the page. -->
```

## Your task

1. Wrap the words **Save the date** in `<strong>`.
2. Wrap the words **this Friday** in `<em>`.
3. Add a `<br>` so that the address is on two lines (street on one line, city on the next).
4. Add an `<hr>` between the heading and the paragraph.
""" + w3(("HTML Formatting", "html/html_formatting.asp"), ("HTML Comments", "html/html_comments.asp"),
         ("HTML Line Breaks", "html/html_paragraphs.asp")),
                    "<h1>Party invitation</h1>\n<p>Save the date: the party is this Friday at 7pm.</p>\n<p>12 Palm Street Nairobi</p>\n",
                    "",
                    [
                        {"type": "textIncludes", "selector": "strong", "text": "Save the date", "label": "Save the date is inside <strong>"},
                        {"type": "textIncludes", "selector": "em", "text": "this Friday", "label": "this Friday is inside <em>"},
                        {"type": "count", "selector": "p br", "min": 1, "label": "a <br> inside the address paragraph"},
                        {"type": "count", "selector": "hr", "min": 1, "label": "an <hr> dividing line"},
                    ],
                ),
                web_lesson(
                    "web-links-images",
                    "Links and images",
                    """
# Links

```html
<a href="https://www.wikipedia.org">Go to Wikipedia</a>
```

- `<a>` is the **anchor** (link) tag.
- `href` is an **attribute**: extra information inside the opening tag. It holds the address.
- The text between the tags is what the user clicks.
- Add `target="_blank"` to open the link in a new tab.

Links can point to another website (an **absolute** address starting with `https://`) or to another page of your own site (a **relative** address such as `about.html`). An email link looks like `href="mailto:someone@example.com"`.

# Images

```html
<img src="https://picsum.photos/200" alt="A random photo" width="200">
```

- `<img>` has **no closing tag** (it is an *empty* element).
- `src` is the picture address. `alt` describes the picture for people who cannot see it, and shows if the image fails to load. Always include it.
- `width` and `height` attributes set the size in pixels. Setting only one keeps the proportions.

Common image formats: **.jpg** for photos, **.png** for graphics with transparency, **.gif** for simple animations, **.svg** for icons and logos that must stay sharp at any size.

## Your task

1. Add a link to `https://www.google.com` with the text **Search the web** that opens in a new tab.
2. Add an image with `src="https://picsum.photos/300/200"` and any `alt` text.
""" + w3(("HTML Links", "html/html_links.asp"), ("HTML Images", "html/html_images.asp"),
         ("HTML Attributes", "html/html_attributes.asp"), ("HTML File Paths", "html/html_filepaths.asp")),
                    "<h1>Useful things</h1>\n<p>Here is a link and a picture.</p>\n",
                    "",
                    [
                        {"type": "attr", "selector": "a", "attr": "href", "includes": "google.com", "label": "link points to google.com"},
                        {"type": "textIncludes", "selector": "a", "text": "Search the web", "label": "link text is Search the web"},
                        {"type": "attr", "selector": "a", "attr": "target", "includes": "_blank", "label": "link opens in a new tab"},
                        {"type": "attr", "selector": "img", "attr": "src", "includes": "picsum.photos", "label": "image from picsum.photos"},
                        {"type": "attrExists", "selector": "img", "attr": "alt", "label": "image has alt text"},
                    ],
                ),
                web_lesson(
                    "web-lists",
                    "Lists",
                    """
# Lists

Unordered list (bullets):

```html
<ul>
  <li>Milk</li>
  <li>Bread</li>
</ul>
```

Ordered list (numbers):

```html
<ol>
  <li>Preheat the oven</li>
  <li>Mix the batter</li>
</ol>
```

`ul` = unordered list, `ol` = ordered list, `li` = list item. Items always go inside `<li>`.

## Nested lists

A list can live inside a list item:

```html
<ul>
  <li>Fruit
    <ul>
      <li>Mango</li>
      <li>Banana</li>
    </ul>
  </li>
  <li>Vegetables</li>
</ul>
```

## Description lists

`<dl>` with `<dt>` (term) and `<dd>` (description) is handy for glossaries.

## Your task

Make a `<ul>` with at least 3 favourite foods, and an `<ol>` with at least 3 steps to make tea. Put a nested `<ul>` with at least 2 items inside one of the food items (for example, kinds of fruit).
""" + w3(("HTML Lists", "html/html_lists.asp"), ("HTML Unordered Lists", "html/html_lists_unordered.asp"),
         ("HTML Ordered Lists", "html/html_lists_ordered.asp"), ("HTML Description Lists", "html/html_lists_other.asp")),
                    "<h1>My lists</h1>\n<h2>Favourite foods</h2>\n\n<h2>How to make tea</h2>\n",
                    "",
                    [
                        {"type": "count", "selector": "ul li", "min": 3, "label": "bullet list with 3+ items"},
                        {"type": "count", "selector": "ol li", "min": 3, "label": "numbered list with 3+ steps"},
                        {"type": "count", "selector": "ul li ul li", "min": 2, "label": "a nested list with 2+ items"},
                    ],
                ),
                web_lesson(
                    "web-tables",
                    "Tables",
                    """
# Tables

Tables are for **data in rows and columns** (timetables, prices, results). They are not for page layout.

```html
<table>
  <tr>
    <th>Name</th>
    <th>Age</th>
  </tr>
  <tr>
    <td>Ann</td>
    <td>30</td>
  </tr>
</table>
```

- `<table>` wraps everything.
- `<tr>` is a **table row**.
- `<th>` is a **header cell** (bold and centred by default).
- `<td>` is a normal **data cell**.

Borders are added with CSS, not HTML:

```css
table, th, td { border: 1px solid #999; border-collapse: collapse; padding: 6px 12px; }
```

`border-collapse: collapse` merges the double lines into single ones.

## Your task

Build a timetable: a `<table>` with a header row (`<th>` for **Day** and **Activity**) and at least 3 data rows. The CSS tab already gives it borders.
""" + w3(("HTML Tables", "html/html_tables.asp"), ("HTML Table Borders", "html/html_table_borders.asp"),
         ("HTML Table Headers", "html/html_table_headers.asp"), ("CSS Tables", "css/css_table.asp")),
                    "<h1>My week</h1>\n<!-- build the table here -->\n",
                    "table, th, td { border: 1px solid #999; border-collapse: collapse; padding: 6px 12px; }\nth { background: #eee; }\n",
                    [
                        {"type": "count", "selector": "table", "min": 1, "label": "a <table> exists"},
                        {"type": "count", "selector": "table th", "min": 2, "label": "a header row with 2+ <th> cells"},
                        {"type": "count", "selector": "table tr", "min": 4, "label": "4+ rows (header plus 3 data rows)"},
                        {"type": "count", "selector": "table td", "min": 6, "label": "6+ data cells"},
                    ],
                ),
                web_lesson(
                    "web-structure",
                    "A complete page: head, body, div",
                    """
# The full skeleton

A real HTML file looks like this:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>My page</title>
    <link rel="stylesheet" href="style.css">
  </head>
  <body>
    <h1>Hello</h1>
  </body>
</html>
```

- `<!DOCTYPE html>` tells the browser this is modern HTML.
- `<head>` holds information *about* the page: the `<title>` shown on the browser tab, the character set, the viewport setting for phones, and links to CSS files. Nothing in the head is drawn on the page.
- `<body>` holds everything you see.

In the playground we only write what goes inside `<body>`; the rest is added for you.

# Grouping with div and span

`<div>` is an invisible **block** box used to group things so you can style or position them as one unit. `<span>` is the same idea for a few words **inside** a line.

```html
<div class="card">
  <h2>Title</h2>
  <p>Text with <span class="highlight">one special word</span>.</p>
</div>
```

`class` is an attribute that gives the element a name. CSS uses it to find the element (next module). Many elements can share one class, and one element can have several classes separated by spaces: `class="card featured"`.

## Your task

Wrap the heading and paragraph in a `<div>` with `class="card"`. Add a second `<div class="card">` with its own `<h2>` and `<p>`. Inside one paragraph, wrap a word in `<span class="highlight">`.
""" + w3(("HTML Page Structure", "html/html_basic.asp"), ("HTML <head> Element", "html/html_head.asp"),
         ("HTML Block and Inline Elements", "html/html_blocks.asp"), ("HTML class Attribute", "html/html_classes.asp")),
                    "<h2>Card one</h2>\n<p>Some text.</p>\n",
                    ".card { border: 1px solid #ccc; padding: 12px; margin: 8px; border-radius: 8px; }\n.highlight { background: yellow; }\n",
                    [
                        {"type": "count", "selector": "div.card", "min": 2, "label": "two div elements with class card"},
                        {"type": "count", "selector": "div.card h2", "min": 2, "label": "each card has an h2"},
                        {"type": "count", "selector": "div.card p", "min": 2, "label": "each card has a p"},
                        {"type": "count", "selector": "p span.highlight", "min": 1, "label": "a highlighted span inside a paragraph"},
                    ],
                ),
                web_lesson(
                    "web-semantic",
                    "Semantic HTML: header, nav, main, footer",
                    """
# Tags that describe meaning

You *could* build a whole page out of `<div>`s, but HTML has tags that say what each part **is**. They help search engines, screen readers, and other developers reading your code.

| Tag | Use it for |
|-----|-----------|
| `<header>` | the top of the page: logo, site title |
| `<nav>` | the menu of links |
| `<main>` | the main content (once per page) |
| `<section>` | a themed group of content with its own heading |
| `<article>` | something that could stand alone: a blog post, a product |
| `<aside>` | side content: related links, adverts |
| `<footer>` | the bottom: copyright, contact details |

```html
<header>
  <h1>My Bakery</h1>
  <nav>
    <a href="#">Home</a>
    <a href="#">Menu</a>
  </nav>
</header>
<main>
  <section>
    <h2>Fresh today</h2>
    <p>Sourdough and croissants.</p>
  </section>
</main>
<footer>
  <p>© 2024 My Bakery</p>
</footer>
```

## Your task

Rebuild the page with semantic tags: a `<header>` containing the `<h1>` and a `<nav>` with at least 2 links, a `<main>` with at least one `<section>` that has an `<h2>`, and a `<footer>` with a paragraph.
""" + w3(("HTML Semantic Elements", "html/html5_semantic_elements.asp"), ("HTML Layout Elements", "html/html_layout.asp")),
                    "<h1>My Bakery</h1>\n<a href=\"#\">Home</a> <a href=\"#\">Menu</a>\n<h2>Fresh today</h2>\n<p>Sourdough and croissants.</p>\n<p>© 2024 My Bakery</p>\n",
                    "header { background: #f3e9d2; padding: 12px; }\nnav a { margin-right: 12px; }\nfooter { color: #777; font-size: 14px; margin-top: 20px; }\n",
                    [
                        {"type": "count", "selector": "header h1", "min": 1, "label": "the h1 is inside <header>"},
                        {"type": "count", "selector": "header nav a", "min": 2, "label": "a <nav> with 2+ links inside the header"},
                        {"type": "count", "selector": "main section h2", "min": 1, "label": "a <section> with an h2 inside <main>"},
                        {"type": "count", "selector": "footer p", "min": 1, "label": "a paragraph inside <footer>"},
                    ],
                ),
            ],
        },
        # ------------------------------------------------------------------- CSS
        {
            "title": "CSS: making it look good",
            "lessons": [
                web_lesson(
                    "web-css-intro",
                    "CSS: colours and your first rules",
                    """
# CSS rules

CSS (Cascading Style Sheets) says *which* elements to style and *how*:

```css
h1 {
  color: red;
  font-size: 40px;
}
p {
  color: #333333;
  font-family: Arial, sans-serif;
}
```

- `h1` is the **selector**: which elements.
- Inside `{ }` are **declarations**: `property: value;` Each one ends with a semicolon.
- `/* like this */` is a CSS comment.

## Three ways to add CSS

1. **External** file: `<link rel="stylesheet" href="style.css">` in the head. Best for real sites. This is what the playground's **style.css** tab represents.
2. **Internal**: a `<style>` block inside the head.
3. **Inline**: `<p style="color: red">` on one element. Quick, but messy. Avoid it.

## Colours

| Way | Example |
|-----|---------|
| Name | `red`, `tomato`, `steelblue`, `lightyellow` (about 140 names) |
| Hex | `#ff0000` (red), `#000` (black), `#ffffff` (white) |
| RGB | `rgb(255, 0, 0)` |
| With transparency | `rgba(0, 0, 0, 0.5)` (half-transparent black) |

Hex colours are two digits each for red, green and blue, from `00` (none) to `ff` (full).

## Your task

Switch to the **style.css** tab.

1. Make the `h1` colour `darkblue`.
2. Give the `body` a `background-color` of `lightyellow`.
3. Make every `p` have `font-size: 20px`.
""" + w3(("CSS Syntax", "css/css_syntax.asp"), ("How To Add CSS", "css/css_howto.asp"),
         ("CSS Colors", "css/css_colors.asp"), ("CSS Comments", "css/css_comments.asp"), ("HTML Color Picker", "colors/colors_picker.asp")),
                    "<h1>Colour me</h1>\n<p>This paragraph should be bigger.</p>\n<p>So should this one.</p>\n",
                    "/* write CSS here */\n",
                    [
                        {"type": "css", "selector": "h1", "prop": "color", "value": "rgb(0, 0, 139)", "label": "h1 is darkblue"},
                        {"type": "css", "selector": "body", "prop": "background-color", "value": "rgb(255, 255, 224)", "label": "body is lightyellow"},
                        {"type": "css", "selector": "p", "prop": "font-size", "value": "20px", "label": "p is 20px"},
                    ],
                ),
                web_lesson(
                    "web-classes",
                    "Selectors: classes, ids and more",
                    """
# Picking specific elements

Styling every `<p>` is often too much. Give elements a **class** and target that:

```html
<p class="note">Important!</p>
```

```css
.note {
  color: orange;
  font-weight: bold;
}
```

The dot `.` before `note` means "elements with class note". Many elements can share a class.

An **id** is for one unique element. Use `#`:

```html
<h1 id="main-title">Hi</h1>
```

```css
#main-title { text-align: center; }
```

## More selectors

| Selector | Matches |
|----------|---------|
| `p` | every `<p>` |
| `.note` | anything with class note |
| `#title` | the one element with id title |
| `h1, h2` | all h1 **and** all h2 (grouping) |
| `nav a` | every `<a>` **inside** a `<nav>` (descendant) |
| `p.note` | only `<p>` elements that have class note |
| `*` | everything |

## When rules disagree

If two rules target the same element, the more **specific** one wins: an id beats a class, a class beats a tag name. If they are equally specific, the one written **later** wins. That is the "cascading" in Cascading Style Sheets.

## Your task

1. In HTML, add `class="warning"` to the second paragraph.
2. In CSS, make `.warning` have `color: red`.
3. In CSS, centre `#title` with `text-align: center`.
4. In CSS, make links inside the `nav` have `text-decoration: none` (use a descendant selector).
""" + w3(("CSS Selectors", "css/css_selectors.asp"), ("CSS Combinators", "css/css_combinators.asp"),
         ("CSS Specificity", "css/css_specificity.asp"), ("HTML id Attribute", "html/html_id.asp")),
                    '<h1 id="title">Rules</h1>\n<nav><a href="#">Home</a> <a href="#">About</a></nav>\n<p>Please be kind.</p>\n<p>Do not run near the pool.</p>\n',
                    "",
                    [
                        {"type": "css", "selector": ".warning", "prop": "color", "value": "rgb(255, 0, 0)", "label": "the .warning paragraph is red"},
                        {"type": "css", "selector": "#title", "prop": "text-align", "value": "center", "label": "#title is centred"},
                        {"type": "css", "selector": "nav a", "prop": "text-decoration-line", "value": "none", "label": "nav links have no underline"},
                    ],
                ),
                web_lesson(
                    "web-text-styling",
                    "Fonts and text",
                    """
# Styling text

```css
body {
  font-family: Georgia, "Times New Roman", serif;
  font-size: 18px;
  line-height: 1.6;
}
h1 {
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
}
```

| Property | What it does | Example values |
|----------|--------------|----------------|
| `font-family` | the typeface; list several, the browser uses the first it has | `Arial, sans-serif` |
| `font-size` | size | `16px`, `1.2em`, `120%` |
| `font-weight` | thickness | `normal`, `bold`, `400`, `700` |
| `font-style` | slant | `italic` |
| `line-height` | space between lines | `1.5` (1.5 times the font size) |
| `text-align` | horizontal alignment | `left`, `center`, `right`, `justify` |
| `text-decoration` | lines | `underline`, `none` (remove link underline) |
| `text-transform` | case | `uppercase`, `capitalize` |
| `letter-spacing` | space between letters | `2px` |

The last name in a `font-family` list should be a **generic family**: `serif` (with feet, like Times), `sans-serif` (clean, like Arial), or `monospace` (code).

## Web fonts

To use a font the visitor may not have installed, link it from [Google Fonts](https://fonts.google.com): copy their `<link>` into your head, then use the name in `font-family`.

## Your task

1. Give `body` a `font-family` that starts with `Georgia`.
2. Make `h1` `text-transform: uppercase` and `letter-spacing: 3px`.
3. Make `.lead` `font-size: 22px` and `font-style: italic`.
""" + w3(("CSS Fonts", "css/css_font.asp"), ("CSS Font Family", "css/css_font_family.asp"), ("CSS Text", "css/css_text.asp"),
         ("CSS Google Fonts", "css/css_font_google.asp"), ("CSS Units", "css/css_units.asp")),
                    '<h1>Fresh bread</h1>\n<p class="lead">Baked every morning at six.</p>\n<p>We use stone-ground flour and a sourdough starter that is twelve years old.</p>\n',
                    "",
                    [
                        {"type": "cssIncludes", "selector": "body", "prop": "font-family", "value": "Georgia", "label": "body font starts with Georgia"},
                        {"type": "css", "selector": "h1", "prop": "text-transform", "value": "uppercase", "label": "h1 is uppercase"},
                        {"type": "css", "selector": "h1", "prop": "letter-spacing", "value": "3px", "label": "h1 letter-spacing is 3px"},
                        {"type": "css", "selector": ".lead", "prop": "font-size", "value": "22px", "label": ".lead is 22px"},
                        {"type": "css", "selector": ".lead", "prop": "font-style", "value": "italic", "label": ".lead is italic"},
                    ],
                ),
                web_lesson(
                    "web-box-model",
                    "The box model: padding, border, margin",
                    """
# Every element is a box

```
+-------------------- margin --------------------+
|  +---------------- border -----------------+   |
|  |  +------------ padding -------------+   |   |
|  |  |           content                |   |   |
|  |  +----------------------------------+   |   |
|  +-----------------------------------------+   |
+------------------------------------------------+
```

- **padding**: space *inside* the border, around the content.
- **border**: the edge line.
- **margin**: space *outside*, between this box and its neighbours.

```css
.box {
  padding: 16px;
  border: 2px solid black;
  margin: 20px;
  background-color: lightblue;
}
```

## Shorthands

- `padding: 10px 20px;` means 10px top and bottom, 20px left and right.
- `padding: 5px 10px 15px 20px;` goes clockwise: top, right, bottom, left.
- `padding-top`, `margin-left` and so on set one side.
- `border: 3px solid green;` is width, style (`solid`, `dashed`, `dotted`), colour.
- `margin: 0 auto;` with a `width` centres a block horizontally.

## Width, height and box-sizing

`width: 300px` sets the content width; padding and border are added on top, so the box is wider than 300px. Most developers add this rule to every project so that `width` means the whole box:

```css
* { box-sizing: border-box; }
```

`border-radius: 12px;` rounds the corners.

## Your task

Style `.box` so it has `padding: 20px`, a `border` of `3px solid green`, `margin: 10px` and `border-radius: 12px`.
""" + w3(("CSS Box Model", "css/css_boxmodel.asp"), ("CSS Padding", "css/css_padding.asp"), ("CSS Borders", "css/css_border.asp"),
         ("CSS Margins", "css/css_margin.asp"), ("CSS Box Sizing", "css/css3_box-sizing.asp"), ("CSS Rounded Corners", "css/css3_borders.asp")),
                    '<div class="box">Box one</div>\n<div class="box">Box two</div>\n',
                    ".box { background-color: #e8f4ff; }\n",
                    [
                        {"type": "css", "selector": ".box", "prop": "padding-top", "value": "20px", "label": "padding is 20px"},
                        {"type": "css", "selector": ".box", "prop": "border-top-width", "value": "3px", "label": "border is 3px"},
                        {"type": "css", "selector": ".box", "prop": "border-top-color", "value": "rgb(0, 128, 0)", "label": "border is green"},
                        {"type": "css", "selector": ".box", "prop": "margin-top", "value": "10px", "label": "margin is 10px"},
                        {"type": "css", "selector": ".box", "prop": "border-top-left-radius", "value": "12px", "label": "corners are rounded 12px"},
                    ],
                ),
                web_lesson(
                    "web-backgrounds",
                    "Backgrounds, gradients and shadows",
                    """
# Backgrounds

```css
.hero {
  background-color: #1e293b;
  background-image: linear-gradient(135deg, #4f46e5, #ec4899);
  color: white;
}
.photo {
  background-image: url("https://picsum.photos/600/300");
  background-size: cover;        /* fill the box, crop if needed */
  background-position: center;
  background-repeat: no-repeat;
  height: 200px;
}
```

- `background-color` is a plain colour.
- `background-image` can be a picture with `url(...)` or a **gradient**: `linear-gradient(direction, colour1, colour2)`.
- `background-size: cover` makes a picture fill the box.

# Shadows

```css
.card { box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2); }
h1 { text-shadow: 2px 2px 4px gray; }
```

`box-shadow` values are: horizontal offset, vertical offset, blur, colour. A soft shadow makes a box look like it floats above the page.

## Your task

1. Give `.hero` a `background-image` that is a `linear-gradient` (any two colours) and `color: white`.
2. Give `.card` a `box-shadow` (any) and `border-radius: 16px`.
3. Give `.photo` a `background-image` using `url("https://picsum.photos/600/300")` and `background-size: cover`.
""" + w3(("CSS Backgrounds", "css/css_background.asp"), ("CSS Gradients", "css/css3_gradients.asp"),
         ("CSS Shadow Effects", "css/css3_shadows.asp"), ("CSS Background Image", "css/css_background_image.asp")),
                    '<div class="hero"><h1>Summer sale</h1></div>\n<div class="card">Up to 50% off this week.</div>\n<div class="photo"></div>\n',
                    ".hero { padding: 30px; }\n.card { background: white; padding: 20px; margin: 16px 0; }\n.photo { height: 160px; }\n",
                    [
                        {"type": "cssIncludes", "selector": ".hero", "prop": "background-image", "value": "linear-gradient", "label": ".hero has a gradient background"},
                        {"type": "css", "selector": ".hero", "prop": "color", "value": "rgb(255, 255, 255)", "label": ".hero text is white"},
                        {"type": "cssNot", "selector": ".card", "prop": "box-shadow", "value": "none", "label": ".card has a shadow"},
                        {"type": "css", "selector": ".card", "prop": "border-top-left-radius", "value": "16px", "label": ".card corners are 16px"},
                        {"type": "cssIncludes", "selector": ".photo", "prop": "background-image", "value": "picsum.photos", "label": ".photo shows the picture"},
                        {"type": "css", "selector": ".photo", "prop": "background-size", "value": "cover", "label": ".photo background-size is cover"},
                    ],
                ),
                {
                    "slug": "web-display-position",
                    "title": "Display and position",
                    "kind": "reading",
                    "minutes": 6,
                    "content": """
# Block and inline

Every element is either a **block** or an **inline** box by default.

- **Block** elements start on a new line and stretch the full width: `<div>`, `<p>`, `<h1>`, `<ul>`, `<section>`.
- **Inline** elements sit inside a line of text and only take the width they need: `<a>`, `<span>`, `<strong>`, `<img>`.

The `display` property changes this:

| Value | Effect |
|-------|--------|
| `block` | behaves like a div |
| `inline` | behaves like a span (width and height are ignored) |
| `inline-block` | sits in a line **and** accepts width, height, padding (great for buttons) |
| `none` | removed from the page entirely |
| `flex`, `grid` | turns the element into a layout container (next lessons) |

`visibility: hidden` hides an element but keeps its space; `display: none` removes it.

# Position

`position` controls where a box sits relative to normal flow. It is used together with `top`, `right`, `bottom`, `left`.

| Value | Meaning |
|-------|---------|
| `static` | the default: normal flow, offsets ignored |
| `relative` | normal flow, but nudged by the offsets; also becomes the reference point for absolute children |
| `absolute` | taken out of the flow and placed relative to the nearest positioned ancestor |
| `fixed` | pinned to the browser window; stays while scrolling (cookie banners, chat buttons) |
| `sticky` | scrolls normally until it reaches an offset, then sticks (sticky headers) |

```css
.badge-holder { position: relative; }
.badge { position: absolute; top: 8px; right: 8px; }
.topbar { position: sticky; top: 0; }
```

`z-index` decides which positioned element is on top when they overlap: higher numbers win.

# Overflow

If content is bigger than its box, `overflow: hidden` clips it, `overflow: auto` adds scrollbars.

You will use `display: flex` and `display: grid` for most layouts; `position` is for the special cases above.
""" + w3(("CSS Display", "css/css_display_visibility.asp"), ("CSS Position", "css/css_positioning.asp"),
         ("CSS z-index", "css/css_z-index.asp"), ("CSS Overflow", "css/css_overflow.asp"), ("CSS Inline-block", "css/css_inline-block.asp")),
                },
                web_lesson(
                    "web-flexbox",
                    "Layout with Flexbox",
                    """
# Putting things side by side

By default, block elements stack vertically. **Flexbox** lines them up in a row:

```css
.row {
  display: flex;
  gap: 12px;
  justify-content: center;   /* along the row: flex-start, center, flex-end, space-between, space-around */
  align-items: center;       /* across the row: stretch, center, flex-start, flex-end */
}
```

Put `display: flex` on the **parent** (the container). Its children become flexible items.

## Useful container properties

| Property | What it controls |
|----------|------------------|
| `flex-direction` | `row` (default) or `column` |
| `flex-wrap` | `wrap` lets items drop to a new line when there is no room |
| `justify-content` | spacing along the main direction |
| `align-items` | alignment across the other direction |
| `gap` | space between items |

## Useful item properties

- `flex: 1` makes an item grow to fill the free space. Give every item `flex: 1` and they share the row equally.
- `order: -1` moves an item to the front.

A very common pattern is a navigation bar: a logo on the left and links on the right, using `justify-content: space-between`.

## Your task

1. Make `.row` a flex container with `display: flex`, a `gap` of `16px`, and `justify-content: space-between`.
2. Make `.nav` a flex container with `align-items: center` and `justify-content: space-between`.
3. Give `.grow` `flex: 1` so the middle box fills the spare space (its `flex-grow` becomes 1).
""" + w3(("CSS Flexbox", "css/css3_flexbox.asp"), ("CSS Flex Container", "css/css3_flexbox_container.asp"),
         ("CSS Flex Items", "css/css3_flexbox_items.asp"), ("CSS Navigation Bar", "css/css_navbar.asp")),
                    '<div class="nav"><strong>Logo</strong><span><a href="#">Home</a> <a href="#">Shop</a></span></div>\n<div class="row">\n  <div class="item">A</div>\n  <div class="item grow">B (grows)</div>\n  <div class="item">C</div>\n</div>\n',
                    ".item { background: #cde; padding: 20px; border-radius: 8px; }\n.nav { background: #eee; padding: 10px 16px; margin-bottom: 16px; }\n.row {\n  /* make it flex */\n}\n",
                    [
                        {"type": "css", "selector": ".row", "prop": "display", "value": "flex", "label": "row is display flex"},
                        {"type": "css", "selector": ".row", "prop": "gap", "value": "16px", "label": "gap is 16px"},
                        {"type": "css", "selector": ".row", "prop": "justify-content", "value": "space-between", "label": "justify-content is space-between"},
                        {"type": "css", "selector": ".nav", "prop": "display", "value": "flex", "label": "nav is display flex"},
                        {"type": "css", "selector": ".nav", "prop": "align-items", "value": "center", "label": "nav align-items is center"},
                        {"type": "css", "selector": ".grow", "prop": "flex-grow", "value": "1", "label": ".grow has flex: 1"},
                    ],
                    10,
                ),
                web_lesson(
                    "web-grid",
                    "Layout with CSS Grid",
                    """
# Grid: rows and columns at once

Flexbox lays things out in one direction. **Grid** does two: columns *and* rows.

```css
.gallery {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;   /* three equal columns */
  gap: 12px;
}
```

- `1fr` means one **fraction** of the free space. `2fr 1fr` makes the first column twice as wide.
- `repeat(3, 1fr)` is a shortcut for `1fr 1fr 1fr`.
- `grid-template-columns: 200px 1fr` makes a fixed sidebar and a flexible main area.
- Rows are created automatically as items are added.

An item can span several columns:

```css
.wide { grid-column: span 2; }
```

## A whole page layout

```css
.page {
  display: grid;
  grid-template-columns: 220px 1fr;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
}
header { grid-area: header; }
```

`grid-template-areas` lets you draw the layout as a little map.

## Your task

1. Make `.gallery` `display: grid` with `grid-template-columns: repeat(3, 1fr)` and `gap: 12px`.
2. Make the item with class `wide` span two columns with `grid-column: span 2`.
""" + w3(("CSS Grid Layout", "css/css_grid.asp"), ("CSS Grid Container", "css/css_grid_container.asp"),
         ("CSS Grid Item", "css/css_grid_item.asp"), ("CSS Website Layout", "css/css_website_layout.asp")),
                    '<div class="gallery">\n  <div class="tile wide">1 (wide)</div>\n  <div class="tile">2</div>\n  <div class="tile">3</div>\n  <div class="tile">4</div>\n  <div class="tile">5</div>\n</div>\n',
                    ".tile { background: #ffe0b2; padding: 24px; text-align: center; border-radius: 8px; }\n.gallery {\n  /* make it a grid */\n}\n",
                    [
                        {"type": "css", "selector": ".gallery", "prop": "display", "value": "grid", "label": "gallery is display grid"},
                        {"type": "cssMatches", "selector": ".gallery", "prop": "grid-template-columns", "value": "^\\S+px \\S+px \\S+px$", "label": "three columns"},
                        {"type": "css", "selector": ".gallery", "prop": "gap", "value": "12px", "label": "gap is 12px"},
                        {"type": "css", "selector": ".wide", "prop": "grid-column-start", "value": "span 2", "label": ".wide spans two columns"},
                    ],
                    10,
                ),
                web_lesson(
                    "web-responsive",
                    "Responsive design: pages that fit every screen",
                    """
# One page, many screens

More than half of web visits come from phones. A **responsive** page rearranges itself to fit the screen instead of forcing the visitor to zoom and scroll sideways.

## 1. The viewport tag

In the head of every page:

```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```

Without it, phones pretend to be 980px wide and shrink everything. (The playground adds it for you.)

## 2. Flexible sizes

- Use `%`, `fr`, `max-width` and `flex` instead of fixed pixel widths for big boxes.
- `img { max-width: 100%; height: auto; }` stops images from overflowing small screens.

## 3. Media queries

A media query applies CSS only when a condition is true, usually the screen width:

```css
.columns { display: flex; gap: 16px; }

@media (max-width: 600px) {
  .columns { flex-direction: column; }   /* stack on phones */
  h1 { font-size: 24px; }
}
```

`max-width: 600px` means "when the screen is 600px wide or narrower". Many developers write the phone styles first and use `@media (min-width: 600px)` for larger screens; that is called **mobile first**.

## Testing

Drag your browser window narrower, or press **F12** and click the phone icon to simulate devices.

## Your task

The checker tests your page at **phone width (360px)**.

1. Add `img { max-width: 100%; height: auto; }`.
2. Add a media query for `max-width: 600px` that sets `.columns` to `flex-direction: column`.
3. Inside the same media query, hide `.sidebar` with `display: none`.
""" + w3(("CSS Responsive Web Design Intro", "css/css_rwd_intro.asp"), ("CSS RWD Viewport", "css/css_rwd_viewport.asp"),
         ("CSS Media Queries", "css/css_rwd_mediaqueries.asp"), ("CSS RWD Images", "css/css_rwd_images.asp")),
                    '<h1>Travel diary</h1>\n<div class="columns">\n  <main>\n    <img src="https://picsum.photos/900/400" alt="Mountains">\n    <p>Day one: we hiked to the lake.</p>\n  </main>\n  <aside class="sidebar">Related posts</aside>\n</div>\n',
                    ".columns { display: flex; gap: 16px; }\nmain { flex: 1; }\n.sidebar { width: 160px; background: #eee; padding: 12px; }\n",
                    [
                        {"type": "css", "selector": "img", "prop": "max-width", "value": "100%", "label": "images never overflow (max-width 100%)"},
                        {"type": "css", "selector": ".columns", "prop": "flex-direction", "value": "column", "label": "at phone width the columns stack"},
                        {"type": "css", "selector": ".sidebar", "prop": "display", "value": "none", "label": "at phone width the sidebar is hidden"},
                    ],
                    10,
                ),
                web_lesson(
                    "web-hover-transitions",
                    "Hover effects and transitions",
                    """
# Reacting to the mouse

A **pseudo-class** selects an element in a particular state. `:hover` is the one you will use most:

```css
.btn { background: #4f46e5; color: white; padding: 10px 20px; border-radius: 8px; cursor: pointer; }
.btn:hover { background: #3730a3; }
a:hover { text-decoration: underline; }
```

`cursor: pointer` turns the arrow into a hand, telling the visitor "this is clickable".

Other handy pseudo-classes: `:active` (while pressed), `:focus` (keyboard focus on an input), `:first-child`, `:nth-child(2n)` (every second item, for striped tables).

# Smooth changes with transitions

Without a transition the colour jumps instantly. With one, it animates:

```css
.btn {
  transition: background 0.3s, transform 0.3s;
}
.btn:hover {
  transform: translateY(-2px) scale(1.03);
}
```

`transition: property duration;` goes on the **normal** state, not on `:hover`. `all 0.3s` transitions every property.

`transform` moves, scales or rotates without affecting the layout around the element.

## Your task

1. Give `.btn` `cursor: pointer` and a `transition` of `0.3s` (for `all` or for `background`).
2. Add a `.btn:hover` rule that changes the background colour (hover over the preview to see it).
3. Give `.card` a `transition` and a `.card:hover` rule with `transform: translateY(-4px)`.
""" + w3(("CSS Pseudo-classes", "css/css_pseudo_classes.asp"), ("CSS Transitions", "css/css3_transitions.asp"),
         ("CSS 2D Transforms", "css/css3_2dtransforms.asp"), ("CSS Buttons", "css/css3_buttons.asp"), ("CSS Animations", "css/css3_animations.asp")),
                    '<button class="btn">Hover me</button>\n<div class="card">Hover the card</div>\n',
                    ".btn { background: #4f46e5; color: white; border: none; padding: 10px 20px; border-radius: 8px; font-size: 16px; }\n.card { background: white; border: 1px solid #ddd; padding: 20px; margin-top: 16px; border-radius: 12px; }\n",
                    [
                        {"type": "css", "selector": ".btn", "prop": "cursor", "value": "pointer", "label": ".btn shows a hand cursor"},
                        {"type": "cssNot", "selector": ".btn", "prop": "transition-duration", "value": "0s", "label": ".btn has a transition"},
                        {"type": "cssNot", "selector": ".card", "prop": "transition-duration", "value": "0s", "label": ".card has a transition"},
                    ],
                ),
                {
                    "slug": "web-quiz-1",
                    "title": "Check: HTML and CSS",
                    "kind": "quiz",
                    "minutes": 6,
                    "content": "Score 70% to pass. If you are unsure, the W3Schools links in each lesson are a good place to look things up.",
                    "data": {
                        "passScore": 70,
                        "questions": [
                            {"q": "Which language gives a page its structure?", "options": ["CSS", "HTML", "JavaScript", "MySQL"], "answer": 1, "explain": "HTML is the skeleton."},
                            {"q": "Which tag makes a clickable link?", "options": ["<link>", "<a>", "<p>", "<url>"], "answer": 1, "explain": "The anchor tag <a> with an href."},
                            {"q": "Which attribute describes an image for people who cannot see it?", "options": ["title", "src", "alt", "desc"], "answer": 2, "explain": "alt text. It also shows if the image fails to load."},
                            {"q": "In CSS, what does .card select?", "options": ["An element with id card", "All elements with class card", "A <card> tag", "Nothing"], "answer": 1, "explain": "A dot means class; a hash means id."},
                            {"q": "Which property makes space inside the border?", "options": ["margin", "padding", "gap", "border"], "answer": 1, "explain": "Padding is inside; margin is outside."},
                            {"q": "Where does display: flex go?", "options": ["On each child", "On the parent container", "In the head", "On the body only"], "answer": 1, "explain": "The parent becomes a flex container."},
                            {"q": "Which tag should hold a page's main navigation links?", "options": ["<nav>", "<div>", "<menu>", "<links>"], "answer": 0, "explain": "<nav> is the semantic tag for navigation."},
                            {"q": "What does @media (max-width: 600px) { ... } do?", "options": ["Applies the styles only on screens 600px wide or narrower", "Sets the page width to 600px", "Loads a 600px image", "Nothing without JavaScript"], "answer": 0, "explain": "That is a media query for small screens."},
                            {"q": "Which selector styles every <a> inside a <nav>?", "options": ["nav + a", "nav.a", "nav a", "a nav"], "answer": 2, "explain": "A space between selectors means descendant."},
                            {"q": "Which value removes an element from the page completely?", "options": ["visibility: hidden", "opacity: 0", "display: none", "position: absolute"], "answer": 2, "explain": "display: none removes it and its space."},
                        ],
                    },
                },
            ],
        },
        # -------------------------------------------------------------------- JS
        {
            "title": "JavaScript: making pages interactive",
            "lessons": [
                web_lesson(
                    "web-forms",
                    "Forms: buttons, inputs and more",
                    """
# Forms

Pages collect information with form elements:

```html
<form>
  <label for="name">Your name</label>
  <input id="name" type="text" placeholder="e.g. Amina" required>

  <label for="age">Age</label>
  <input id="age" type="number" min="1" max="120">

  <label for="city">City</label>
  <select id="city">
    <option>Nairobi</option>
    <option>Mombasa</option>
  </select>

  <label for="msg">Message</label>
  <textarea id="msg" rows="4"></textarea>

  <label><input type="checkbox"> Send me news</label>

  <button type="submit">Send</button>
</form>
```

- `<input>` is a one-line box. `type` can be `text`, `email`, `password`, `number`, `date`, `checkbox`, `radio`, `file`, `color`, `range`...
- `<label for="id">` is the text next to a box. Clicking the label focuses the box, and screen readers read it aloud.
- `placeholder` is the grey hint text. `required` stops the form from submitting while empty.
- `<select>` with `<option>`s is a dropdown. `<textarea>` is a multi-line box.
- `<button>` is a clickable button. Inside a `<form>`, `type="submit"` sends the form.

Nothing happens yet when you click. That is JavaScript's job (next lessons). On a real site the form's `action` attribute points to the server that receives the data.

## Your task

Build a newsletter form: an `<input>` with `id="email"` and `type="email"` with a `<label for="email">`, a `<select>` with at least 2 options, a `<textarea>`, and a `<button>` with the text **Subscribe**.
""" + w3(("HTML Forms", "html/html_forms.asp"), ("HTML Form Elements", "html/html_form_elements.asp"),
         ("HTML Input Types", "html/html_form_input_types.asp"), ("HTML Input Attributes", "html/html_form_attributes.asp"), ("CSS Forms", "css/css_form.asp")),
                    "<h2>Newsletter</h2>\n",
                    "input, button, select, textarea { font-size: 16px; padding: 8px; display: block; margin: 6px 0 14px; }\nlabel { font-weight: bold; }\n",
                    [
                        {"type": "attr", "selector": "input#email", "attr": "type", "includes": "email", "label": "an email input with id email"},
                        {"type": "attr", "selector": "label", "attr": "for", "includes": "email", "label": "a label for the email box"},
                        {"type": "count", "selector": "select option", "min": 2, "label": "a dropdown with 2+ options"},
                        {"type": "count", "selector": "textarea", "min": 1, "label": "a textarea"},
                        {"type": "textIncludes", "selector": "button", "text": "Subscribe", "label": "button says Subscribe"},
                    ],
                    10,
                ),
                {
                    "slug": "web-js-where",
                    "title": "Where JavaScript lives: the script tag and the DOM",
                    "kind": "reading",
                    "minutes": 5,
                    "content": """
# Adding JavaScript to a page

JavaScript goes inside a `<script>` tag, usually just before `</body>` so the page has loaded before the script runs:

```html
<body>
  <h1 id="title">Hello</h1>
  <script src="script.js"></script>
</body>
```

`src` points to a separate file (recommended). You can also write code directly between `<script>` and `</script>`. In the playground the **script.js** tab is that file.

# The DOM

When the browser reads your HTML it builds a tree of objects in memory: the **Document Object Model**. JavaScript can read and change that tree, and the page updates immediately.

```js
let title = document.getElementById("title");   // find
title.textContent = "Welcome!";                    // change the text
title.style.color = "red";                         // change a style
```

## Finding elements

| Method | Returns |
|--------|---------|
| `document.getElementById("x")` | the one element with id x |
| `document.querySelector(".card")` | the **first** element matching a CSS selector |
| `document.querySelectorAll("li")` | **all** matching elements (loop with `for...of`) |

## Changing elements

| Property / method | What it changes |
|-------------------|-----------------|
| `el.textContent` | the text inside |
| `el.innerHTML` | the HTML inside (careful with untrusted text) |
| `el.style.color` | one CSS property (write `backgroundColor` for `background-color`) |
| `el.classList.add("x")` / `.remove("x")` / `.toggle("x")` | its classes (usually better than style) |
| `el.setAttribute("src", "a.jpg")` | an attribute |

## Seeing what is going on

`console.log(...)` prints to the browser **console**. Press **F12** and open the **Console** tab to see it and any errors. Errors tell you the line number: read them, they are your friend.

## Events

An **event** is something that happens: a click, a key press, the page finishing loading. You attach a function to an event with `addEventListener`; the next lesson does exactly that.
""" + w3(("JavaScript Where To", "js/js_whereto.asp"), ("JavaScript HTML DOM", "js/js_htmldom.asp"),
         ("DOM Elements", "js/js_htmldom_elements.asp"), ("DOM HTML (changing content)", "js/js_htmldom_html.asp"),
         ("DOM CSS (changing styles)", "js/js_htmldom_css.asp"), ("JavaScript Output / console", "js/js_output.asp")),
                },
                web_lesson(
                    "web-js-click",
                    "JavaScript: react to a click",
                    """
# Connecting JavaScript to the page

JavaScript can **find** an element and **change** it when something happens:

```js
let button = document.getElementById("go");
let output = document.getElementById("message");

button.addEventListener("click", function () {
  output.textContent = "You clicked!";
});
```

- `document.getElementById("go")` finds the element whose id is `go`.
- `addEventListener("click", ...)` runs the function **every time** the button is clicked. The function is called an **event handler**.
- `textContent` is the text inside the element.

Other events you can listen for: `"mouseover"`, `"keydown"`, `"input"` (text box changed), `"submit"` (form sent), `"change"` (dropdown changed).

Open the **script.js** tab in the playground.

## Your task

When the button with id `counter` is clicked, increase a number and show it inside the `<span id="count">`. Starting at 0, after three clicks it should show **3**. The checker simulates clicks for you on a hidden copy of your page.
""" + w3(("JavaScript Events", "js/js_events.asp"), ("DOM EventListener", "js/js_htmldom_eventlistener.asp"),
         ("DOM Events", "js/js_htmldom_events.asp"), ("JavaScript Functions", "js/js_functions.asp")),
                    '<button id="counter">Click me</button>\n<p>Clicks: <span id="count">0</span></p>\n',
                    "button { font-size: 18px; padding: 10px 20px; }\n",
                    [
                        {"type": "clickThen", "selector": "#counter", "times": 3, "target": "#count", "text": "3", "label": "after 3 clicks the count shows 3"},
                    ],
                    10,
                    'let clicks = 0;\nlet button = document.getElementById("counter");\nlet count = document.getElementById("count");\n\n// add the click listener here\n',
                ),
                web_lesson(
                    "web-js-input",
                    "Reading what the user typed",
                    """
# Reading an input

```js
let box = document.getElementById("name");
let btn = document.getElementById("greet");
let out = document.getElementById("result");

btn.addEventListener("click", function () {
  out.textContent = "Hello, " + box.value + "!";
});
```

`box.value` is whatever the user typed in the text box. For a `<select>` it is the chosen option; for a checkbox use `box.checked` (true or false).

To react **while** typing instead of on a click, listen for the `"input"` event on the box itself:

```js
box.addEventListener("input", function () {
  out.textContent = box.value.length + " letters";
});
```

## Your task

Make the greeting work: when **Greet** is clicked, show `Hello, NAME!` inside `#result`, where NAME is the typed text. The checker types **Sam** and clicks.
""" + w3(("DOM Forms", "js/js_htmldom_forms.asp"), ("HTML DOM Input Text value", "jsref/prop_text_value.asp"),
         ("JavaScript Strings", "js/js_strings.asp"), ("DOM EventListener", "js/js_htmldom_eventlistener.asp")),
                    '<input id="name" placeholder="Your name">\n<button id="greet">Greet</button>\n<p id="result"></p>\n',
                    "input, button { font-size: 16px; padding: 8px; }\n",
                    [
                        {"type": "typeClickThen", "input": "#name", "value": "Sam", "selector": "#greet", "target": "#result", "text": "Hello, Sam!", "label": "greets Sam by name"},
                    ],
                    10,
                    '// find the elements and add a click listener\n',
                ),
                web_lesson(
                    "web-js-dom",
                    "Changing styles and classes with JavaScript",
                    """
# Styling from JavaScript

You can change CSS from code in two ways.

**Directly**, one property at a time:

```js
let box = document.getElementById("box");
box.style.backgroundColor = "tomato";   // CSS background-color
box.style.fontSize = "24px";
```

Property names lose their hyphens and use capital letters: `background-color` becomes `backgroundColor`.

**With classes**, which is cleaner because the CSS stays in the stylesheet:

```css
.dark { background: #111; color: #eee; }
```

```js
let page = document.body;
document.getElementById("theme").addEventListener("click", function () {
  page.classList.toggle("dark");   // add if missing, remove if present
});
```

`classList.add`, `.remove`, `.toggle` and `.contains` are the four you need.

## Showing and hiding

```js
panel.style.display = "none";     // hide
panel.style.display = "block";    // show
```

or toggle a `.hidden { display: none; }` class.

## Your task

1. Clicking `#theme` should **toggle** the class `dark` on `document.body`. (The CSS for `.dark` is already there.)
2. Clicking `#bigger` should set the `fontSize` of `#text` to `24px`.
""" + w3(("DOM CSS", "js/js_htmldom_css.asp"), ("HTML DOM classList", "jsref/prop_element_classlist.asp"),
         ("HTML DOM Style Object", "jsref/dom_obj_style.asp"), ("JavaScript Style Display", "jsref/prop_style_display.asp")),
                    '<button id="theme">Toggle dark mode</button>\n<button id="bigger">Bigger text</button>\n<p id="text">The quick brown fox jumps over the lazy dog.</p>\n',
                    "body { transition: background 0.3s; padding: 16px; }\n.dark { background: #111; color: #eee; }\nbutton { font-size: 16px; padding: 8px 14px; }\n",
                    [
                        {"type": "clickThenClass", "selector": "#theme", "times": 1, "target": "body", "class": "dark", "label": "one click on Toggle adds the dark class to body"},
                        {"type": "clickThen", "selector": "#bigger", "times": 1, "target": "#text", "text": "The quick brown fox jumps over the lazy dog.", "label": "the text is still there after clicking Bigger"},
                        {"type": "css", "selector": "#text", "prop": "font-size", "value": "24px", "label": "after clicking Bigger the text is 24px"},
                    ],
                    10,
                    '// theme button: toggle the "dark" class on document.body\n\n// bigger button: set the font size of #text to 24px\n',
                ),
                web_lesson(
                    "web-js-validation",
                    "Checking what the user typed (validation)",
                    """
# Validation

Never trust that a visitor filled a form correctly. **Validate** before you accept it.

HTML can do simple checks for you: `required`, `type="email"`, `minlength="3"`, `min`, `max`. The browser shows a message and refuses to submit.

JavaScript lets you check anything and show your own messages:

```js
let email = document.getElementById("email");
let msg = document.getElementById("msg");

document.getElementById("send").addEventListener("click", function () {
  let value = email.value.trim();          // remove spaces at the ends
  if (value === "") {
    msg.textContent = "Please enter your email";
    msg.style.color = "red";
  } else if (!value.includes("@")) {
    msg.textContent = "That does not look like an email";
    msg.style.color = "red";
  } else {
    msg.textContent = "Thanks!";
    msg.style.color = "green";
  }
});
```

- `.trim()` removes spaces from both ends.
- `.includes("@")` is a quick (not perfect) email check.
- Always set the message in **every** branch, so an old error disappears when the input becomes valid.

## Your task

Finish the code so that clicking **Send**:

- shows **Please enter your email** in `#msg` when the box is empty,
- shows **Thanks!** when the box contains an `@`.

The checker tries both.
""" + w3(("JavaScript Form Validation", "js/js_validation.asp"), ("JavaScript if else", "js/js_if_else.asp"),
         ("JavaScript String Methods", "js/js_string_methods.asp"), ("HTML Input Attributes (required)", "html/html_form_attributes.asp")),
                    '<label for="email">Email</label>\n<input id="email" type="email" placeholder="you@example.com">\n<button id="send">Send</button>\n<p id="msg"></p>\n',
                    "input, button { font-size: 16px; padding: 8px; }\n",
                    [
                        {"type": "typeClickThen", "input": "#email", "value": "", "selector": "#send", "target": "#msg", "text": "Please enter your email", "label": "empty box shows: Please enter your email"},
                        {"type": "typeClickThen", "input": "#email", "value": "sam@example.com", "selector": "#send", "target": "#msg", "text": "Thanks!", "label": "a valid email shows: Thanks!"},
                    ],
                    12,
                    'let email = document.getElementById("email");\nlet msg = document.getElementById("msg");\n\ndocument.getElementById("send").addEventListener("click", function () {\n  let value = email.value.trim();\n  // your checks here\n});\n',
                ),
                web_lesson(
                    "web-project",
                    "Final project: a profile card",
                    """
# Build a profile card

Combine everything:

**HTML**

- A `<div class="card">` containing an `<img>`, an `<h2>` with a name, a `<p>` with a short bio, and a `<ul>` of 3 skills.
- A `<button id="like">` with the text **Like** and a `<span id="likes">0</span>`.

**CSS**

- `.card` gets `padding: 20px`, a `border-radius` of `12px`, `text-align: center`, a `box-shadow`, and `max-width: 320px` with `margin: 0 auto` to centre it.
- The image gets `border-radius: 50%` to make it a circle.

**JS**

- Each click on **Like** increases the number in `#likes`.

Take your time. This is a real web page you built from nothing. When it works, try it on W3Schools' Try it Yourself editor too, and then save it as `index.html` on your computer and open it in your browser.
""" + w3(("CSS Card Example", "howto/howto_css_cards.asp"), ("CSS Profile Card", "howto/howto_css_profile_card.asp"),
         ("CSS Rounded Images", "howto/howto_css_rounded_images.asp"), ("Try it Yourself editor", "html/tryit.asp?filename=tryhtml_default")),
                    '<!-- build the card here -->\n',
                    "body { font-family: Arial, sans-serif; background: #f4f6fb; padding: 20px; }\n",
                    [
                        {"type": "count", "selector": "div.card img", "min": 1, "label": "card has an image"},
                        {"type": "count", "selector": "div.card h2", "min": 1, "label": "card has a name heading"},
                        {"type": "count", "selector": "div.card ul li", "min": 3, "label": "card lists 3 skills"},
                        {"type": "css", "selector": ".card", "prop": "padding-top", "value": "20px", "label": "card padding is 20px"},
                        {"type": "css", "selector": ".card", "prop": "text-align", "value": "center", "label": "card text is centred"},
                        {"type": "cssNot", "selector": ".card", "prop": "box-shadow", "value": "none", "label": "card has a shadow"},
                        {"type": "css", "selector": ".card img", "prop": "border-top-left-radius", "value": "50%", "label": "the image is round"},
                        {"type": "clickThen", "selector": "#like", "times": 2, "target": "#likes", "text": "2", "label": "like button counts clicks"},
                    ],
                    15,
                    "",
                ),
                {
                    "slug": "web-quiz-2",
                    "title": "Check: forms and JavaScript",
                    "kind": "quiz",
                    "minutes": 5,
                    "content": "Score 70% to pass.",
                    "data": {
                        "passScore": 70,
                        "questions": [
                            {"q": "Which method finds the element with id=\"go\"?", "options": ["document.find(\"go\")", "document.getElementById(\"go\")", "getElement(\"#go\")", "document.id(\"go\")"], "answer": 1, "explain": "getElementById takes the id without the #."},
                            {"q": "What does el.textContent = \"Hi\" do?", "options": ["Adds a class", "Replaces the text inside the element", "Creates a new element", "Hides the element"], "answer": 1, "explain": "textContent is the text inside."},
                            {"q": "How do you run code when a button is clicked?", "options": ["button.onclick()", "button.addEventListener(\"click\", function () { ... })", "button.run(\"click\")", "click(button)"], "answer": 1, "explain": "addEventListener attaches a handler."},
                            {"q": "Where is the text a visitor typed into an <input>?", "options": ["input.text", "input.textContent", "input.value", "input.innerHTML"], "answer": 2, "explain": "Form fields expose their content as .value."},
                            {"q": "Which JavaScript property changes CSS background-color?", "options": ["style.background-color", "style.backgroundColor", "css.background", "background"], "answer": 1, "explain": "Hyphens become camelCase in JavaScript."},
                            {"q": "What does classList.toggle(\"dark\") do?", "options": ["Always adds dark", "Always removes dark", "Adds dark if missing, removes it if present", "Renames the class"], "answer": 2, "explain": "Toggle switches the class on and off."},
                            {"q": "Which attribute stops a form from submitting while a box is empty?", "options": ["needed", "required", "validate", "mandatory"], "answer": 1, "explain": "required is built-in HTML validation."},
                            {"q": "Where should the <script> tag usually go?", "options": ["Before the <html> tag", "Inside <title>", "Just before </body>", "It does not matter and never affects anything"], "answer": 2, "explain": "At the end of body, so the elements exist before the script looks for them."},
                        ],
                    },
                },
                {
                    "slug": "web-whats-next",
                    "title": "What to learn next",
                    "kind": "reading",
                    "minutes": 4,
                    "content": """
# Congratulations!

You started by learning where the **F** and **J** keys are. Now you can:

- Type without looking at your hands
- Write and format documents in Microsoft Word
- Write programs with variables, conditions, loops and functions
- Build responsive web pages with HTML, CSS and JavaScript

## Keep going on W3Schools

W3Schools has far more than this course could cover. A good order:

1. **HTML tutorial**, start to finish. You know most of it now; fill in the gaps (iframes, video, audio, entities).
2. **CSS tutorial**: animations, variables, pseudo-elements, and the "CSS Advanced" section.
3. **JavaScript tutorial**: arrays and objects in depth, dates, JSON, `fetch` to load data from a server, and the "JS Async" section.
4. **How To**: copy-and-paste recipes for menus, sliders, modals and whole page layouts.
5. The **references** (HTML tag list, CSS property list, JavaScript methods) are what professionals search every day.
6. W3Schools also has **exercises** and **quizzes** for each tutorial, and optional paid certificates if you ever want one.

## Make real files

Create a folder, save `index.html`, `style.css` and `script.js` in a text editor like **Visual Studio Code** (free), and open `index.html` in your browser. Then try publishing it for free on **GitHub Pages** or **Netlify** so friends can see it.

## Other good free resources

- **MDN Web Docs**: the most complete reference, written by the people who make browsers.
- **freeCodeCamp**: long, project-based courses with certificates.
- **The Odin Project**: a full path to becoming a web developer.

## Next skills

Responsive design in depth, a JavaScript framework such as **Angular** or React, and a backend language such as Python with **Django**. This very app is built with Angular, Django, GraphQL and MySQL: you now understand every layer of it.

Keep practising a little every day. You are a web developer now.
""" + w3(("W3Schools home: all tutorials", ""), ("HTML Tutorial", "html/default.asp"), ("CSS Tutorial", "css/default.asp"),
         ("JavaScript Tutorial", "js/default.asp"), ("How To section", "howto/default.asp"), ("HTML Tag Reference", "tags/default.asp"),
         ("CSS Reference", "cssref/index.php"), ("JavaScript Reference", "jsref/default.asp"), ("HTML Exercises", "html/html_exercises.asp")),
                },
            ],
        },
    ],
}
