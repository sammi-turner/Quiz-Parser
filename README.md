<br>

# Quiz Parser

A command-line quiz app built with Deno and TypeScript that loads quiz questions
from JSON files.

<br>

## Features.

- Interactive command-line interface with coloured output
- Custom quiz content through simple JSON files
- Spinner animations for answer feedback
- Score tracking

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

## External dependencies

- chalk: for terminal string styling
- inquirer: for interactive command line prompts
- nanospinner: for terminal spinners

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
      "correctAnswer": "Second option"
    }
  ]
}
```

<br>

## Generating Quizzes with LLMs

Large Language Models (LLMs) can help create quiz content that follows the Quiz Parser's JSON format. 

When prompting an LLM to generate quizzes, consider these guidelines for best results.

<br>

### Basic Prompting Strategy

Start with a clear, structured prompt that specifies your requirements. Here's an effective template.

```
Please create a quiz about [YOUR TOPIC] with [NUMBER] multiple-choice questions.

For each question:

- Write a clear, specific question
- Provide four distinct answer choices
- Ensure only one answer is correct
- Make incorrect choices plausible but clearly wrong
- Format the output as JSON following this structure:

{
  "questions": [
    {
      "name": "descriptive-id",
      "type": "list",
      "message": "Question text",
      "choices": [
        "First option",
        "Second option",
        "Third option",
        "Fourth option"
      ],
      "correctAnswer": "The correct option"
    }
  ]
}
```

<br>

### Enhancing Quiz Quality

To generate more effective quizzes:

1. Specify the difficulty level : tell the LLM whether you want beginner, intermediate, or advanced questions.
2. Define the scope : list specific subtopics or concepts you want to cover.
3. Request variety : ask for different types of questions (definition, application, comparison, etc.).
4. Add constraints : specify any requirements about answer length, terminology usage, or topic restrictions.

<br>

### Example Prompt

Here's a complete example prompt that incorporates these practices.

```
Please create a quiz about JavaScript fundamentals with 5 multiple-choice questions. 

Requirements:
- Target intermediate developers
- Cover concepts like closures, hoisting, and promises
- Keep questions focused on practical usage
- Make wrong answers represent common misconceptions
- Ensure all answers are between 5-15 words

Output the quiz in valid JSON format matching this structure:
{
  "questions": [
    {
      "name": "concept-name",
      "type": "list",
      "message": "Question text",
      "choices": ["array of 4 options"],
      "correctAnswer": "exactly matches one of the choices"
    }
  ]
}
```

<br>
