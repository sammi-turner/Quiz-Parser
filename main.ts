import chalk from "npm:chalk";
import inquirer from "npm:inquirer";
import { createSpinner } from "npm:nanospinner";
import { delay } from "https://deno.land/std@0.224.0/async/delay.ts";

interface Question {
  name: string;
  type: "list";
  message: string;
  choices: string[];
  correctAnswer: string;
}

interface QuizData {
  questions: Question[];
}

interface ShuffledQuestion {
  question: Question;
  shuffledChoices: string[];
}

let score = 0;

const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const prepareShuffledQuestion = (question: Question): ShuffledQuestion => {
  const shuffledChoices = shuffleArray([...question.choices]);
  return {
    question,
    shuffledChoices,
  };
};

const loadQuestions = async (filename: string): Promise<Question[]> => {
  try {
    const jsonContent = await Deno.readTextFile(filename);
    const quizData: QuizData = JSON.parse(jsonContent);
    return quizData.questions;
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      console.error(chalk.red(`Error: Quiz file '${filename}' not found`));
    } else {
      console.error(chalk.red("Error loading questions:"), error);
    }
    Deno.exit(1);
  }
};

const handleAnswer = async (
  isCorrect: boolean,
  userAnswer: string,
  correctAnswer: string
) => {
  const spinner = createSpinner("Checking answer...").start();
  await delay(1000);
  if (isCorrect) {
    spinner.success({ text: chalk.green("Correct! 🎉\n") });
    score++;
  } else {
    spinner.error({ 
      text: chalk.red(`Wrong! 😢\nYou answered: "${userAnswer}"\nCorrect answer was: "${correctAnswer}"`)
    });
  }
};

const askQuestion = async (question: Question) => {
  const shuffled = prepareShuffledQuestion(question);
  const answer = await inquirer.prompt({
    name: "quiz",
    type: question.type,
    message: question.message,
    choices: shuffled.shuffledChoices,
  });

  const selectedAnswer = answer.quiz;
  const isCorrect = selectedAnswer === question.correctAnswer;
  console.log("Selected answer:", selectedAnswer);
  console.log("Is correct?", isCorrect);
  await handleAnswer(isCorrect, selectedAnswer, question.correctAnswer);
};

const gameOver = (totalQuestions: number) => {
  console.log(chalk.blue(`Your final score is : ${score}/${totalQuestions}`));
  if (score === totalQuestions) {
    console.log(chalk.green("Perfect! 🏆"));
  } else if (score >= (totalQuestions * 2) / 3) {
    console.log(chalk.yellow("Good job! Keep learning! 📚"));
  } else {
    console.log(chalk.red("Keep practicing! You'll get better! 💪"));
  }
};

const printUsage = () => {
  console.log(chalk.blue("Usage:"));
  console.log("  quiz                     Run with default questions.json");
  console.log("  quiz <filename.json>     Run with specific quiz file");
  Deno.exit(1);
};

const main = async () => {
  const args = Deno.args;
  let quizFile = "questions.json";
  if (args.length > 1) {
    console.error(chalk.red("Error: Too many arguments"));
    printUsage();
  } else if (args.length === 1) {
    if (args[0] === "--help" || args[0] === "-h") {
      printUsage();
    }
    quizFile = args[0];
  }
  console.log();
  const questions = await loadQuestions(quizFile);
  if (questions.length === 0) {
    console.error(chalk.red("Error: No questions found in quiz file"));
    Deno.exit(1);
  }
  for (const question of questions) {
    await askQuestion(question);
  }
  await gameOver(questions.length);
};

main().catch(console.error);