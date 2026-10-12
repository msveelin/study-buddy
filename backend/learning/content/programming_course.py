"""Course 3: Introduction to programming with JavaScript (runs in the browser playground)."""


def code_lesson(slug, title, content, starter, tests, solution, minutes=8):
    return {
        "slug": slug,
        "title": title,
        "kind": "code",
        "minutes": minutes,
        "content": content,
        "data": {"starter": starter, "tests": tests, "solution": solution},
    }


COURSE = {
    "slug": "programming",
    "title": "Introduction to Programming",
    "icon": "💻",
    "description": "Learn to think like a programmer and write real code in JavaScript, "
                   "the language of the web. Every lesson runs in a built-in code playground.",
    "modules": [
        {
            "title": "What is programming?",
            "lessons": [
                {
                    "slug": "prog-what-is-programming",
                    "title": "What is a program?",
                    "kind": "reading",
                    "minutes": 5,
                    "content": """
# What is programming?

A **program** is a list of instructions that a computer follows, one after another, exactly as written.

Computers are fast but not clever. They do *exactly* what you say, not what you *mean*. That is why instructions must be precise.

## A recipe is a program

> 1. Boil water.
> 2. Put the pasta in the water.
> 3. Wait 10 minutes.
> 4. Drain the water.

A recipe has **steps** in **order**. Some steps repeat ("stir every minute"). Some depend on a condition ("if the pasta is soft, stop"). Programs are the same: **sequence**, **repetition** and **decisions**.

## Programming languages

Humans write in English, Swahili, French... Computers understand **programming languages**. There are many: Python, Java, C, JavaScript. They all express the same ideas with slightly different words.

We will use **JavaScript**. Why?

- It runs inside every web browser, so there is nothing to install.
- It powers almost every website you have ever used.
- It is a good first language and leads straight into web development (your next course).

## What you will learn

- How to show text on the screen
- How to store information in **variables**
- How to do maths and work with text
- How to make **decisions** with `if`
- How to **repeat** things with loops
- How to package code into **functions**

Every lesson has a playground where you write code and press **Run**. Mistakes are normal. Read the error, fix it, run again.
""",
                },
                code_lesson(
                    "prog-hello",
                    "Your first program: Hello, world!",
                    """
# Hello, world!

The traditional first program just prints a greeting. In JavaScript you print with `console.log`:

```js
console.log("Hello, world!");
```

- `console.log` is a **command** that shows text in the output panel.
- The text inside the quotes is called a **string**.
- The `;` at the end marks the end of the instruction (like a full stop).

## Your task

Change the program so it prints **Hello, I am learning to code!** then press **Run**.
""",
                    'console.log("Hello, world!");\n',
                    [{"type": "outputIncludes", "value": "Hello, I am learning to code!"}],
                    'console.log("Hello, I am learning to code!");',
                    6,
                ),
                code_lesson(
                    "prog-multiple-lines",
                    "One instruction after another",
                    """
# Sequence

The computer runs your lines **from top to bottom**. Each `console.log` adds a new line of output.

```js
console.log("First");
console.log("Second");
console.log("Third");
```

## Your task

Print these three lines in this exact order:

1. `Wake up`
2. `Brush teeth`
3. `Eat breakfast`
""",
                    "// Write three console.log lines here\n",
                    [{"type": "outputEquals", "value": "Wake up\nBrush teeth\nEat breakfast"}],
                    'console.log("Wake up");\nconsole.log("Brush teeth");\nconsole.log("Eat breakfast");',
                    6,
                ),
            ],
        },
        {
            "title": "Storing information",
            "lessons": [
                code_lesson(
                    "prog-variables",
                    "Variables: boxes with labels",
                    """
# Variables

A **variable** is a labelled box that holds a value. You create one with `let`:

```js
let name = "Amina";
let age = 25;
console.log(name);
console.log(age);
```

- `let` says "make a new variable".
- `name` is the label. You choose it. No spaces allowed.
- `=` puts the value into the box.

You can change what is in the box later:

```js
age = 26;
```

## Your task

Create a variable called `city` holding the name of your city, and a variable `year` holding the number 2024. Print both.
""",
                    '// Create the variables here\n\nconsole.log(city);\nconsole.log(year);\n',
                    [{"type": "outputLines", "value": 2}, {"type": "outputIncludes", "value": "2024"}],
                    'let city = "Nairobi";\nlet year = 2024;\nconsole.log(city);\nconsole.log(year);',
                ),
                code_lesson(
                    "prog-numbers",
                    "Numbers and maths",
                    """
# Maths in code

JavaScript can do arithmetic:

| Symbol | Meaning | Example | Result |
|--------|---------|---------|--------|
| `+` | add | `2 + 3` | 5 |
| `-` | subtract | `10 - 4` | 6 |
| `*` | multiply | `6 * 7` | 42 |
| `/` | divide | `20 / 4` | 5 |
| `%` | remainder | `7 % 3` | 1 |

```js
let apples = 5;
let oranges = 3;
let total = apples + oranges;
console.log(total);   // 8
```

(Text after `//` is a **comment**. The computer ignores it. Comments are notes for humans.)

## Your task

A ticket costs 350 and you want to buy 4. Store the price in `price`, the count in `count`, calculate the total into `total` and print it. The output must be `1400`.
""",
                    'let price = 350;\nlet count = 4;\n// calculate total here\n\nconsole.log(total);\n',
                    [{"type": "outputIncludes", "value": "1400"}],
                    'let price = 350;\nlet count = 4;\nlet total = price * count;\nconsole.log(total);',
                ),
                code_lesson(
                    "prog-strings",
                    "Strings: working with text",
                    """
# Strings

Text in quotes is a **string**. You can join strings with `+`:

```js
let first = "Grace";
let last = "Hopper";
console.log(first + " " + last);   // Grace Hopper
```

Notice the `" "`: a string containing just a space. Without it you would get `GraceHopper`.

Useful tricks:

```js
let word = "hello";
console.log(word.length);          // 5
console.log(word.toUpperCase());   // HELLO
```

## Your task

Make a variable `name` with your name, then print the sentence `Hello, NAME! Welcome.` where NAME is the value. For example: `Hello, Amina! Welcome.`
""",
                    'let name = "Amina";\n// print the greeting\n',
                    [{"type": "outputMatches", "value": "^Hello, .+! Welcome\\.$"}],
                    'let name = "Amina";\nconsole.log("Hello, " + name + "! Welcome.");',
                ),
                {
                    "slug": "prog-quiz-1",
                    "title": "Check: variables and values",
                    "kind": "quiz",
                    "minutes": 4,
                    "content": "Score 70% to pass.",
                    "data": {
                        "passScore": 70,
                        "questions": [
                            {"q": "Which keyword creates a new variable?", "options": ["var", "let", "make", "new"], "answer": 1, "explain": "We use let. (var also works but is old style.)"},
                            {"q": "What does console.log(3 * 4) show?", "options": ["7", "34", "12", "3 * 4"], "answer": 2, "explain": "* means multiply."},
                            {"q": "What is \"hello\"?", "options": ["A number", "A string", "A variable", "A comment"], "answer": 1, "explain": "Anything in quotes is a string."},
                            {"q": "What does \"a\" + \"b\" give?", "options": ["ab", "a b", "an error", "2"], "answer": 0, "explain": "+ joins strings with nothing between."},
                            {"q": "What does the computer do with text after // ?", "options": ["Runs it", "Prints it", "Ignores it", "Deletes the file"], "answer": 2, "explain": "It is a comment, for humans only."},
                        ],
                    },
                },
            ],
        },
        {
            "title": "Making decisions",
            "lessons": [
                code_lesson(
                    "prog-if",
                    "If: doing something only sometimes",
                    """
# Decisions with if

```js
let temperature = 32;
if (temperature > 30) {
  console.log("It is hot!");
}
```

- The part in `( )` is a **condition**: a question with a yes/no answer.
- The code in `{ }` runs **only if** the answer is yes (true).

Comparison symbols:

| Symbol | Meaning |
|--------|---------|
| `>` | greater than |
| `<` | less than |
| `>=` | greater than or equal |
| `<=` | less than or equal |
| `===` | is equal to |
| `!==` | is not equal to |

Careful: one `=` **puts a value in a box**. Three `===` **compares**.

## Your task

The variable `age` holds a number. If it is 18 or more, print `You can vote`. Try changing the age to test both cases. The test uses age 20.
""",
                    'let age = 20;\n// write the if here\n',
                    [{"type": "outputIncludes", "value": "You can vote"}],
                    'let age = 20;\nif (age >= 18) {\n  console.log("You can vote");\n}',
                ),
                code_lesson(
                    "prog-if-else",
                    "Else: the other path",
                    """
# if ... else

`else` runs when the condition is **false**:

```js
let score = 45;
if (score >= 50) {
  console.log("Pass");
} else {
  console.log("Fail");
}
```

You can chain more conditions with `else if`:

```js
if (score >= 80) {
  console.log("Excellent");
} else if (score >= 50) {
  console.log("Pass");
} else {
  console.log("Fail");
}
```

## Your task

`number` holds a number. Print `even` if it is even and `odd` if it is odd. Hint: a number is even when `number % 2 === 0`. The test uses 7.
""",
                    'let number = 7;\n',
                    [{"type": "outputEquals", "value": "odd"}],
                    'let number = 7;\nif (number % 2 === 0) {\n  console.log("even");\n} else {\n  console.log("odd");\n}',
                ),
            ],
        },
        {
            "title": "Repeating things",
            "lessons": [
                code_lesson(
                    "prog-for-loop",
                    "Loops: repeat without copy-paste",
                    """
# The for loop

To print the numbers 1 to 5 you *could* write five `console.log` lines. A loop is better:

```js
for (let i = 1; i <= 5; i = i + 1) {
  console.log(i);
}
```

Read it as: *start with i = 1; keep going while i is 5 or less; after each round add 1 to i.*

The body in `{ }` runs once for every value of `i`.

`i = i + 1` is so common that there is a shortcut: `i++`.

## Your task

Print the numbers from 1 to 10, one per line.
""",
                    '// write a for loop here\n',
                    [{"type": "outputEquals", "value": "1\n2\n3\n4\n5\n6\n7\n8\n9\n10"}],
                    'for (let i = 1; i <= 10; i++) {\n  console.log(i);\n}',
                ),
                code_lesson(
                    "prog-loop-sum",
                    "Loops that calculate",
                    """
# Adding up with a loop

A loop can build up a result step by step:

```js
let total = 0;
for (let i = 1; i <= 3; i++) {
  total = total + i;
}
console.log(total);   // 1 + 2 + 3 = 6
```

`total` starts at 0. Each round, the current `i` is added.

## Your task

Print the **7 times table**: lines `7 x 1 = 7` through `7 x 10 = 70`. Build each line with string joining, e.g. `"7 x " + i + " = " + (7 * i)`.
""",
                    'for (let i = 1; i <= 10; i++) {\n  // print one line of the table\n}\n',
                    [{"type": "outputIncludes", "value": "7 x 1 = 7"}, {"type": "outputIncludes", "value": "7 x 10 = 70"}, {"type": "outputLines", "value": 10}],
                    'for (let i = 1; i <= 10; i++) {\n  console.log("7 x " + i + " = " + (7 * i));\n}',
                ),
                code_lesson(
                    "prog-while",
                    "While loops",
                    """
# while: repeat until something changes

A `while` loop keeps going as long as its condition is true:

```js
let count = 3;
while (count > 0) {
  console.log(count);
  count--;        // same as count = count - 1
}
console.log("Go!");
```

Output: 3, 2, 1, Go!

**Danger:** if the condition never becomes false, the loop runs forever. Always make sure something inside the loop changes the condition.

## Your task

Start with `money = 100`. While `money` is greater than 0, print the money then subtract 30. Expected output: 100, 70, 40, 10 (one per line).
""",
                    'let money = 100;\n',
                    [{"type": "outputEquals", "value": "100\n70\n40\n10"}],
                    'let money = 100;\nwhile (money > 0) {\n  console.log(money);\n  money = money - 30;\n}',
                ),
            ],
        },
        {
            "title": "Functions and collections",
            "lessons": [
                code_lesson(
                    "prog-functions",
                    "Functions: name a piece of code",
                    """
# Functions

A **function** is a named block of code you can run as many times as you like:

```js
function greet(name) {
  console.log("Hello, " + name + "!");
}

greet("Ali");
greet("Zara");
```

- `function greet(name)` **defines** the function. `name` is a **parameter**: an input.
- `greet("Ali")` **calls** it, sending `"Ali"` in as `name`.

Functions can also **return** a result:

```js
function double(x) {
  return x * 2;
}
let answer = double(21);
console.log(answer);   // 42
```

## Your task

Write a function `square(n)` that returns n multiplied by itself. Then print `square(4)` and `square(9)`.
""",
                    '// define square here\n\nconsole.log(square(4));\nconsole.log(square(9));\n',
                    [{"type": "outputEquals", "value": "16\n81"}],
                    'function square(n) {\n  return n * n;\n}\nconsole.log(square(4));\nconsole.log(square(9));',
                ),
                code_lesson(
                    "prog-arrays",
                    "Arrays: lists of things",
                    """
# Arrays

An **array** is a list stored in one variable:

```js
let fruits = ["apple", "banana", "mango"];
console.log(fruits[0]);        // apple   (counting starts at 0!)
console.log(fruits.length);    // 3
fruits.push("orange");         // add to the end
```

Loop through every item:

```js
for (let fruit of fruits) {
  console.log(fruit);
}
```

## Your task

`scores` is an array of numbers. Use a loop to add them all up and print the total. Expected: `270`.
""",
                    'let scores = [80, 95, 60, 35];\nlet total = 0;\n// loop and add\n\nconsole.log(total);\n',
                    [{"type": "outputIncludes", "value": "270"}],
                    'let scores = [80, 95, 60, 35];\nlet total = 0;\nfor (let s of scores) {\n  total = total + s;\n}\nconsole.log(total);',
                ),
                code_lesson(
                    "prog-objects",
                    "Objects: things with properties",
                    """
# Objects

An **object** groups related values under names:

```js
let student = {
  name: "Kofi",
  age: 19,
  city: "Accra"
};
console.log(student.name);   // Kofi
student.age = 20;            // change a property
```

Arrays of objects are everywhere in real programs:

```js
let people = [
  { name: "Ann", age: 30 },
  { name: "Ben", age: 12 }
];
for (let p of people) {
  console.log(p.name + " is " + p.age);
}
```

## Your task

Loop through `people` and print only the names of people aged 18 or more, one per line. Expected: `Ann` then `Dede`.
""",
                    'let people = [\n  { name: "Ann", age: 30 },\n  { name: "Ben", age: 12 },\n  { name: "Dede", age: 45 },\n  { name: "Eli", age: 9 }\n];\n',
                    [{"type": "outputEquals", "value": "Ann\nDede"}],
                    'let people = [\n  { name: "Ann", age: 30 },\n  { name: "Ben", age: 12 },\n  { name: "Dede", age: 45 },\n  { name: "Eli", age: 9 }\n];\nfor (let p of people) {\n  if (p.age >= 18) {\n    console.log(p.name);\n  }\n}',
                ),
                code_lesson(
                    "prog-project",
                    "Mini project: grade calculator",
                    """
# Putting it all together

Write a function `grade(score)` that returns:

- `"A"` for 80 and above
- `"B"` for 65 to 79
- `"C"` for 50 to 64
- `"F"` below 50

Then loop through the `scores` array and print each score with its grade, like `92: A`.

Expected output:

```
92: A
70: B
55: C
20: F
```
""",
                    'let scores = [92, 70, 55, 20];\n\nfunction grade(score) {\n  // return the right letter\n}\n\n// loop and print\n',
                    [{"type": "outputEquals", "value": "92: A\n70: B\n55: C\n20: F"}],
                    'let scores = [92, 70, 55, 20];\nfunction grade(score) {\n  if (score >= 80) return "A";\n  else if (score >= 65) return "B";\n  else if (score >= 50) return "C";\n  else return "F";\n}\nfor (let s of scores) {\n  console.log(s + ": " + grade(s));\n}',
                    12,
                ),
                {
                    "slug": "prog-quiz-2",
                    "title": "Final check: programming",
                    "kind": "quiz",
                    "minutes": 5,
                    "content": "Score 70% to pass.",
                    "data": {
                        "passScore": 70,
                        "questions": [
                            {"q": "What runs the code inside an if block?", "options": ["Always", "Only when the condition is true", "Only when it is false", "Never"], "answer": 1, "explain": "if runs its block when the condition is true."},
                            {"q": "Which compares two values for equality?", "options": ["=", "==>", "===", "=>"], "answer": 2, "explain": "=== compares. = assigns."},
                            {"q": "In let a = [10, 20, 30]; what is a[1]?", "options": ["10", "20", "30", "1"], "answer": 1, "explain": "Counting starts at 0, so index 1 is the second item."},
                            {"q": "What does return do in a function?", "options": ["Prints a value", "Sends a value back to the caller and stops", "Restarts the loop", "Deletes the function"], "answer": 1, "explain": "return hands a result back."},
                            {"q": "How many times does this run: for (let i = 0; i < 3; i++) { ... }", "options": ["2", "3", "4", "Forever"], "answer": 1, "explain": "i takes 0, 1, 2."},
                            {"q": "What is a danger with while loops?", "options": ["They are slow", "They can run forever if the condition never changes", "They cannot print", "They need arrays"], "answer": 1, "explain": "Always make the condition change inside the loop."},
                        ],
                    },
                },
            ],
        },
    ],
}
