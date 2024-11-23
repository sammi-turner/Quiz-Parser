<br>

# Quiz Parser

A command-line quiz app built with Deno and TypeScript that loads quiz questions
from JSON files.

<br>

## Features.

- Interactive command-line interface with colorful output
- Custom quiz content through simple JSON files
- Spinner animations for answer feedback
- Score tracking and personalized end-game messages
- Written in TypeScript for type safety

<br>

## Prerequisite

Deno [installed](https://docs.deno.com/runtime/getting_started/installation/) on your machine.

<br>

## Compile the binary

```sh
deno compile -A --output=quiz main.ts
```

<br>

## Usage

```sh
./quiz
```

Runs "questions.json" by default. Alternatively use

```sh
./quiz name-of-quiz.json
```

to run a specific json file.

<br>

## Creating Custom Quizzes

Create your own quiz by making a new questions.json file. Follow this format:

```json
{
  "questions": [
    {
      "name": "unique-question-id",
      "type": "list",
      "message": "Your question text here?",
      "choices": [
        "First option",
        "Second option",
        "Third option",
        "Fourth option"
      ],
      "correct": 2 // Index of correct answer (0-based)
    }
  ]
}
```

<br>

## External dependencies

- chalk: for terminal string styling
- inquirer: for interactive command line prompts
- nanospinner: for terminal spinners

<br>
