import chalk from 'npm:chalk';
import inquirer from 'npm:inquirer';
import { createSpinner } from 'npm:nanospinner';
import { delay } from "https://deno.land/std@0.224.0/async/delay.ts";

interface Question {
    name: string;
    type: 'list';
    message: string;
    choices: string[];
    correct: number;
}

interface QuizData {
    questions: Question[];
}

let playerName: string;
let score = 0;

async function loadQuestions(filename: string): Promise<Question[]> {
    try {
        const jsonContent = await Deno.readTextFile(filename);
        const quizData: QuizData = JSON.parse(jsonContent);
        return quizData.questions;
    } catch (error) {
        if (error instanceof Deno.errors.NotFound) {
            console.error(chalk.red(`Error: Quiz file '${filename}' not found`));
        } else {
            console.error(chalk.red('Error loading questions:'), error);
        }
        Deno.exit(1);
    }
}

async function welcome() {
    console.clear();
    console.log(chalk.blue('Welcome to Quiz Parser!\n'));
    
    const { name } = await inquirer.prompt({
        name: 'name',
        type: 'input',
        message: 'What is your name?',
        default: 'Player'
    });
    
    playerName = name;
    console.log(chalk.yellow(`\nHello, ${playerName}! Let's begin.\n`));
}

async function handleAnswer(isCorrect: boolean) {
    const spinner = createSpinner('Checking answer...').start();
    await delay(1000);
    
    if (isCorrect) {
        spinner.success({ text: chalk.green('Correct! 🎉') });
        score++;
    } else {
        spinner.error({ text: chalk.red('Wrong! 😢') });
    }
}

async function askQuestion(question: Question) {
    const answer = await inquirer.prompt({
        name: 'quiz',
        type: question.type,
        message: question.message,
        choices: question.choices
    });
    
    await handleAnswer(question.choices.indexOf(answer.quiz) === question.correct);
}

function gameOver(totalQuestions: number) {
    console.log(chalk.bgBlue(`\nThanks for playing, ${playerName}!`));
    console.log(chalk.blue(`Your final score: ${score}/${totalQuestions}`));
    
    if (score === totalQuestions) {
        console.log(chalk.green('Perfect score! 🏆'));
    } else if (score >= totalQuestions / 2) {
        console.log(chalk.yellow('Good job! Keep learning! 📚'));
    } else {
        console.log(chalk.red('Keep practicing! You\'ll get better! 💪'));
    }
}

function printUsage() {
    console.log(chalk.blue('Usage:'));
    console.log('  quiz                     Run with default questions.json');
    console.log('  quiz <filename.json>     Run with specific quiz file');
    Deno.exit(1);
}

async function main() {
    const args = Deno.args;
    
    // Handle command line arguments
    let quizFile = 'questions.json';  // default
    
    if (args.length > 1) {
        console.error(chalk.red('Error: Too many arguments'));
        printUsage();
    } else if (args.length === 1) {
        if (args[0] === '--help' || args[0] === '-h') {
            printUsage();
        }
        quizFile = args[0];
    }
    
    const questions = await loadQuestions(quizFile);
    
    if (questions.length === 0) {
        console.error(chalk.red('Error: No questions found in quiz file'));
        Deno.exit(1);
    }
    
    await welcome();
    
    for (const question of questions) {
        await askQuestion(question);
    }
    
    await gameOver(questions.length);
}

main().catch(console.error);