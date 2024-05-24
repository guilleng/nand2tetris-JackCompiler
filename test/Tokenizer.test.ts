import * as path from 'path';
import { EOL } from "os";
import { Tokenizer } from '../src/JackTokenizer';
import { readFile, writeToFile, symbolToEntity } from '../src/Utils';

const execSync = require('child_process').execSync;

function tokenizeFile(lines: string[]): string[] {

  const tokens = new Tokenizer(lines);

  let output: string[] = [`<tokens>`];

  while (tokens.hasMoreTokens()) {
    switch (tokens.tokenType()) {
      case "KEYWORD":
        output.push(`<keyword> ${tokens.keyWord()} </keyword>`);
      break;
      case "SYMBOL":
        output.push(`<symbol> ${symbolToEntity(tokens.symbol())} </symbol>`);
      break;
      case "INT_CONST":
        output.push(`<integerConstant> ${tokens.intVal()} </integerConstant>`);
      break;
      case "STRING_CONST":
        output.push(`<stringConstant> ${tokens.stringVal()} </stringConstant>`);
      break;
      case "IDENTIFIER":
        output.push(`<identifier> ${tokens.identifier()} </identifier>`);
      break;
    }
    tokens.advance();
  }
  output.push(`</tokens>`);

  return output;
}

describe('Tokenizer Tests', () => {
	it('ArrayTest/Main.jack', async () => {

    const Main = 'test/resources/ArrayTest/Main.jack'; 
    const Output = 'test/resources/ArrayTest/Main.tok.xml'; 
    const Expected = 'test/resources/ArrayTest/MainT.xml'; 

		const fileLines = await readFile(Main);
    const tokens = tokenizeFile(fileLines);
    await writeToFile(tokens, Output);

    execSync(`TextComparer ${Output} ${Expected}`);
    execSync(`rm ${Output}`);
	});

	it('ExpressionLessSquare/Main.jack', async () => {

    const Main = 'test/resources/ExpressionLessSquare/Main.jack'; 
    const Output = 'test/resources/ExpressionLessSquare/Main.tok.xml'; 
    const Expected = 'test/resources/ExpressionLessSquare/MainT.xml'; 

		const fileLines = await readFile(Main);
    const tokens = tokenizeFile(fileLines);
    await writeToFile(tokens, Output);

    execSync(`TextComparer ${Output} ${Expected}`);
    execSync(`rm ${Output}`);
	});

	it('ExpressionLessSquare/Square.jack', async () => {

    const Main = 'test/resources/ExpressionLessSquare/Square.jack'; 
    const Output = 'test/resources/ExpressionLessSquare/Square.tok.xml'; 
    const Expected = 'test/resources/ExpressionLessSquare/SquareT.xml'; 

		const fileLines = await readFile(Main);
    const tokens = tokenizeFile(fileLines);
    await writeToFile(tokens, Output);

    execSync(`TextComparer ${Output} ${Expected}`);
    execSync(`rm ${Output}`);
	});

	it('ExpressionLessSquare/SquareGame.jack', async () => {

    const Main = 'test/resources/ExpressionLessSquare/SquareGame.jack'; 
    const Output = 'test/resources/ExpressionLessSquare/SquareGame.tok.xml'; 
    const Expected = 'test/resources/ExpressionLessSquare/SquareGameT.xml'; 

		const fileLines = await readFile(Main);
    const tokens = tokenizeFile(fileLines);
    await writeToFile(tokens, Output);

    execSync(`TextComparer ${Output} ${Expected}`);
    execSync(`rm ${Output}`);
	});

	it('Square/Main.jack', async () => {

    const Main = 'test/resources/Square/Main.jack'; 
    const Output = 'test/resources/Square/Main.tok.xml'; 
    const Expected = 'test/resources/Square/MainT.xml'; 

		const fileLines = await readFile(Main);
    const tokens = tokenizeFile(fileLines);
    await writeToFile(tokens, Output);

    execSync(`TextComparer ${Output} ${Expected}`);
    execSync(`rm ${Output}`);
	});

	it('Square/Square.jack', async () => {

    const Main = 'test/resources/Square/Square.jack'; 
    const Output = 'test/resources/Square/Square.tok.xml'; 
    const Expected = 'test/resources/Square/SquareT.xml'; 

		const fileLines = await readFile(Main);
    const tokens = tokenizeFile(fileLines);
    await writeToFile(tokens, Output);

    execSync(`TextComparer ${Output} ${Expected}`);
    execSync(`rm ${Output}`);
	});

	it('Square/SquareGame.jack', async () => {

    const Main = 'test/resources/Square/SquareGame.jack'; 
    const Output = 'test/resources/Square/SquareGame.tok.xml'; 
    const Expected = 'test/resources/Square/SquareGameT.xml'; 

		const fileLines = await readFile(Main);
    const tokens = tokenizeFile(fileLines);
    await writeToFile(tokens, Output);

    execSync(`TextComparer ${Output} ${Expected}`);
    execSync(`rm ${Output}`);
	});
});
