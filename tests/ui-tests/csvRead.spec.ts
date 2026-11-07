import fs from 'fs'; //fs means file system
import path from 'path';
import { parse } from 'csv-parse/sync';
import { test } from '@playwright/test';

const filePath = path.resolve('test-data/ui-data/input.csv');

const records: any = parse(fs.readFileSync(filePath, 'utf-8'), {  //'utf-8' tells Node.js how to decode the CSV file's bytes into a JavaScript string that it can work with.
    columns: true,
    skip_empty_lines: true,
    delimiter: ','
});

for (const record of records) {
    test(`foo: ${record.key}`, async ({ }) => {
        console.log(record.key, record.value, record.value2);
    });
}

/*
Bits, Bytes, Binary, Decimal, Hexadecimal, ASCII, UTF-8 and UTF-16

## 1. What are bits and bytes?
Before understanding how computers store text, we need to understand how computers represent data.

### Bit

A **bit** is the smallest unit of digital data. A bit can have only two possible values:
- `0`
- `1`

Think of it like a light switch: it can be OFF (`0`) or ON (`1`).

### Byte

A **byte** is a group of 8 bits. For example: 01001010
This is 8 bits, which means it is 1 byte. A byte can represent 256 different values, from 0 to 255.

Why 256? Because each bit in 1 byte multiplies by 2 and by 8 bits, we have: 256 = 2 × 2 × 2 × 2 × 2 × 2 × 2 × 2 = 256

**Remember:**
- 1 bit = one binary digit.
- 1 byte = 8 bits.
- 1 byte can represent a value from 0 to 255.

A byte is a unit of data. It is not necessarily one character. A character can require multiple bytes, depending on its encoding.



## 2. What are binary, decimal and hexadecimal?

These are number systems. They are different ways of representing numbers.

### Decimal (base 10)

Decimal is the number system we use in everyday life. The word decimal comes from the Latin word *decem*, meaning ten.
It uses 10 digits: 0 1 2 3 4 5 6 7 8 9

### Binary (base 2)
Binary uses only two digits: 0 and 1

The word binary comes from *bi*, meaning two. Computers use binary to represent and process data.
After 1, we carry over to the next position:
0
1
10
11
100
101
110
111
1000

Notice that binary `10` means decimal 2, not decimal 10.

Each position represents a power of 2:

| Position     | 128 | 64 | 32 | 16 | 8 | 4 | 2 | 1 |
| Binary digit | 0   | 1  | 0  | 0  | 1 | 0 | 1 | 0 |

For example: 01001010
To convert it to decimal, multiply each binary digit by its position value and add: 0+64+0+0+8+0+2+0=74
Therefore: 01001010 (binary) = 74 (decimal)

### Hexadecimal (base 16)

Hexadecimal uses 16 symbols: 0 1 2 3 4 5 6 7 8 9 A B C D E F

The letters represent values greater than 9:
| Decimal | Hexadecimal |
|:||
| 10 | A |
| 11 | B |
| 12 | C |
| 13 | D |
| 14 | E |
| 15 | F |

The name hexadecimal comes from the Greek *hexadeca*, meaning sixteen. After F, we carry over to the next position:
E
F
10
11
12

Important: hexadecimal `10` means decimal 16, not decimal 10. Each position represents a power of 16:
| Position | 256 | 16 | 1 |
| Example  |     | 4  | 8 |

For example: 48 = 4 times 16 + 8 times 1 = 72
Therefore: 48 (hexadecimal) = 72 (decimal)

## 3. How do we convert between number systems?
Let's use the number 74 as our example.

### A. Decimal to binary

We can convert decimal to binary by repeatedly dividing by 2 and recording the remainders. Example: Convert 74 to binary.

74 ÷ 2 = 37 remainder 0
37 ÷ 2 = 18 remainder 1
18 ÷ 2 = 9  remainder 0
9  ÷ 2 = 4  remainder 1
4  ÷ 2 = 2  remainder 0
2  ÷ 2 = 1  remainder 0
1  ÷ 2 = 0  remainder 1

Read the remainders from bottom to top: 1001010. Because we are representing one byte, we can add a leading zero:
01001010
So: 74 (decimal) = 01001010 (binary)

### B. Binary to decimal
Multiply each digit by its position value and add the results. Example: 01001010
Position values, from right to left: 128 64 32 16 8 4 2 1 = 100111010
binary 100111010 = decimal 314.
Calculation: 256 + 32 + 16 + 8 +2 = 314
Binary digit	1	0	0	1	1	1	0	1	0
Position value	256	128	64	32	16	8	4	2	1

### C. Decimal to hexadecimal

Divide the decimal number by 16 and record the remainders. Example: Convert 74 to hexadecimal.
74 ÷ 16 = 4 remainder 10
4  ÷ 16 = 0 remainder 4

Our remainder 10 is represented by A in hexadecimal. Read the remainders from bottom to top: 4A
Verify: 4 times 16 + 10 times 1=74
Therefore: 74 (decimal) = 4A (hexadecimal)

### D. Binary to hexadecimal

This conversion is particularly easy. **Every group of 4 binary bits corresponds to exactly one hexadecimal digit.**

Why? Four bits can represent 16 different values: And hexadecimal has exactly 16 symbols.

Example: 01001010

Step 1: Split into groups of four, starting from the right. 0100  1010

Step 2: Convert each group to decimal.

First group: 0100 = 4
Second group: 1010 = 8 + 2 = 10

Step 3: Convert decimal 10 to hexadecimal A.
0100 = 4
1010 = A
Final result: 01001010 (binary) = 4A (hexadecimal)


### Summary of the same number in three systems

| Number system | Representation |
| Binary        | `01001010`     |
| Decimal       | `74`           |
| Hexadecimal   | `4A`           |

These are three different ways of representing the same numeric value.

## 4. How are characters stored in a computer?
Now that we understand bits, bytes and number systems, let's connect them to text.
When you save a CSV file, the text you see is ultimately stored as bytes on your computer.

For example:
csv
name,age
Javid,36

The computer needs a way to interpret those bytes as letters, numbers and symbols. This is where character encoding comes in.

## 5. What is ASCII?

ASCII stands for **American Standard Code for Information Interchange**.

It is an older character encoding standard that assigns numeric values to basic English letters, numbers and symbols.

For example:

| Character | ASCII decimal |
| A | 65 |
| B | 66 |
| C | 67 |
| J | 74 |
| a | 97 |
| b | 98 |
| 0 | 48 |
| 1 | 49 |

ASCII originally defines 128 values, from 0 to 127.

Let's use the letter J.

ASCII assigns J the decimal value 74.

We can represent that same value in different number systems:

| Representation | Value      |
| ASCII decimal  | 74         |
| Binary         | `01001010` |
| Hexadecimal    | `4A`       |

Important: ASCII gives us the numeric value associated with a character. Binary and hexadecimal are simply ways to represent that value.

## 6. What is Unicode?

ASCII is limited to basic English characters and symbols.

But computers need to represent many other writing systems and symbols, including:

- Cyrillic: Ж, Я
- Chinese: 中
- Arabic: ع
- Japanese: あ
- Emoji: 😊

**Unicode** is a universal standard that assigns numeric identifiers called *code points* to characters and symbols.

Examples:

| Character | Unicode code point |

| J  | U+004A  |
| A  | U+0041  |
| 中 | U+4E2D  |
| 😊| U+1F60A |

A Unicode code point is an identifier for a character or symbol.

One detail: what appears as one character on screen can sometimes consist of multiple Unicode code points.

Unicode defines the code points. It does not, by itself, determine how those code points are stored as bytes.

That is the job of character encoding formats such as UTF-8 and UTF-16.


## 7. What is UTF-8?

UTF-8 stands for **Unicode Transformation Format – 8-bit**.

It is a character encoding standard that tells computers how to represent Unicode code points using bytes.

UTF-8 uses between 1 and 4 bytes per Unicode code point.

Examples:

| Char | Unicode code point | UTF-8 bytes | Hexadecimal representation |
| J    | U+004A | 1  | `4A`           |
| é    | U+00E9 | 2  | `C3 A9`        |
| 中   | U+4E2D | 3  | `E4 B8 AD`     |
| 😊  | U+1F60A | 4 | `F0 9F 98 8A`  |

### Why does hexadecimal sometimes have more than two digits?

Remember:
- 1 byte = 8 bits.
- 1 hexadecimal digit represents 4 bits.
- Therefore, 1 byte = 2 hexadecimal digits.

For example:
J = 4A
J needs 1 byte, so it has 2 hexadecimal digits.

But the emoji 😊 needs 4 bytes: F0 9F 98 8A
Each pair represents one byte. Therefore, 4 bytes are displayed using 8 hexadecimal digits.

**Important distinction:**
- UTF-8 bytes tell us how many bytes are needed.
- Hexadecimal shows the actual byte values in a readable format.


## 8. What is UTF-16, and how is it different from UTF-8?
JavaScript strings internally use UTF-16 code units. Let's understand the distinction.
- Unicode assigns code points to characters.
- UTF-8 represents Unicode code points using 8-bit bytes.
- UTF-16 represents Unicode code points using 16-bit code units.

UTF-16 uses:
- One 16-bit code unit for many common characters.
- Two 16-bit code units (a surrogate pair) for code points above U+FFFF.

For example:

| Character | Unicode code point | UTF-16 code units |
| J   | U+004A  | 1 |
| A   | U+0041  | 1 |
| 中  | U+4E2D  | 1 |
| 😊 | U+1F60A | 2 |

This explains something interesting in JavaScript:
console.log("J".length);  // 1
console.log("😊".length); // 2


Why does 😊 return 2?

Because JavaScript's string length counts UTF-16 code units, not Unicode code points or UTF-8 bytes.
The emoji is one Unicode code point, but it requires two UTF-16 code units.

### UTF-8 vs UTF-16

| Feature | UTF-8 | UTF-16 |
| Basic unit              | 8-bit byte | 16-bit code unit |
| Common English letters  | 1 byte     | 1 code unit (2 bytes) |
| Many other characters   | 2–4 bytes  | 1 code unit |
| Emoji such as 😊       | 4 bytes    | 2 code units |


## 9. How does this relate to JavaScript and Node.js?
Let's return to the original code:

const records: any = parse(
    fs.readFileSync(filePath, 'utf-8'),
    {
        columns: true,
        skip_empty_lines: true
    }
);


Let's understand what happens.
### Step 1: The CSV file is stored as bytes. For example, the file contains:
csv
name,age
Javid,36

Those characters are stored as bytes, using an encoding such as UTF-8.
### Step 2: Node.js reads the file and decodes its bytes.
fs.readFileSync(filePath, 'utf-8')

The `'utf-8'` argument tells Node.js how to interpret the file's bytes.
Node decodes the UTF-8 bytes and returns a JavaScript string.
Without `'utf-8'`, `fs.readFileSync()` returns a Buffer instead of a string.

### Step 3: The parser converts the text into structured records.
parse(csvText, {
    columns: true,
    skip_empty_lines: true
});


- `columns: true` tells the parser to use the first row as column names.
- `skip_empty_lines: true` tells it to ignore empty lines.

The result looks like:

js
[
    { name: "Javid", age: "36" }
]


Notice that the parser produces structured JavaScript data. UTF-8 itself does not convert CSV text into objects.
### Step 4: You can also convert JavaScript strings into UTF-8 bytes.

For example: const name = "Javid";
const buffer = Buffer.from(name, "utf-8");
console.log(buffer);
console.log(buffer.toString("hex"));
console.log(buffer.toString("utf-8"));

Output:
<Buffer 4a 61 76 69 64>
4a61766964
Javid

Each pair of hexadecimal digits represents one byte.
JavaScript strings use UTF-16 code units internally, but `Buffer.from(name, "utf-8")` converts the string into UTF-8 bytes.


## 10. Final summary: How everything connects

| Concept           | Meaning |
| Bit               | A single 0 or 1 |
| Byte              | A group of 8 bits |
| Binary            | Number system using 0 and 1 |
| Decimal           | Number system using 0–9 |
| Hexadecimal       | Number system using 0–9 and A–F |
| ASCII             | Older character encoding for basic English characters and symbols |
| Unicode           | Standard assigning code points to characters and symbols |
| UTF-8             | Encoding Unicode code points into 1–4 bytes |
| UTF-16            | Encoding Unicode code points into 1 or 2 16-bit code units |
| JavaScript string | A sequence of UTF-16 code units |
| Node.js Buffer    | A way to work with raw bytes |

**The big picture:**
1. Computers store and process data using bits (0s and 1s).
2. Eight bits make one byte.
3. Binary, decimal and hexadecimal are different ways to represent numeric values.
4. ASCII and Unicode provide numeric identifiers for characters.
5. UTF-8 and UTF-16 determine how Unicode code points are represented in memory or files.
6. Node.js uses encoding information such as `'utf-8'` to decode file bytes into JavaScript strings.
*/