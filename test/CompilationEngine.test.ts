import * as path from 'path';
import { EOL } from "os";
import { readFile, writeToFile } from '../src/Utils';

import { CompilationEngine	 } from '../src/CompilationEngine';

const execSync = require('child_process').execSync;


function parseFile(lines: string[]): string[] {
  const compilator = new CompilationEngine(lines);
  //const print = compilator.xml;
  //print.forEach(l => console.log(l));

  return compilator.xml;
}

describe('Parser Tests', () => {
	it('ExpressionLessSquare/Main.jack', async () => {

    const Main = 'test/resources/ExpressionLessSquare/Main.jack'; 
    const Output = 'test/resources/ExpressionLessSquare/Main.tag.xml'; 
    const Expected = 'test/resources/ExpressionLessSquare/Main.xml'; 

    const fileLines = await readFile(Main);
    const tagged = parseFile(fileLines);
    await writeToFile(tagged, Output);
    execSync(`TextComparer ${Output} ${Expected}`);
    execSync(`rm ${Output}`);
    });

});
