import * as path from 'path';
import { EOL } from "os";
import { readFile, writeToFile } from '../src/Utils';

import { CompilationEngine	 } from '../src/CompilationEngine';

const execSync = require('child_process').execSync;

describe('Parser Tests', () => {

	it('ExpressionLessSquare/Main.jack', async () => {

    const Main = 'test/resources/ExpressionLessSquare/Main.jack'; 
    const OutputFile = 'test/resources/ExpressionLessSquare/Main.tag.xml'; 
    const ExpectedFile = 'test/resources/ExpressionLessSquare/Main.xml'; 

    const code = await readFile(Main);
    const compiler = new CompilationEngine(code);

    await writeToFile(compiler.xml, OutputFile);
    execSync(`TextComparer ${OutputFile} ${ExpectedFile}`);
    execSync(`rm ${OutputFile}`);
  });

	it('ExpressionLessSquare/Square.jack', async () => {
    const Main = 'test/resources/ExpressionLessSquare/Square.jack'; 
    const OutputFile = 'test/resources/ExpressionLessSquare/Square.tag.xml'; 
    const ExpectedFile = 'test/resources/ExpressionLessSquare/Square.xml'; 

    const code = await readFile(Main);
    const compiler = new CompilationEngine(code);
    
    await writeToFile(compiler.xml, OutputFile);
    execSync(`TextComparer ${OutputFile} ${ExpectedFile}`);
    execSync(`rm ${OutputFile}`);
  });

	it('ExpressionLessSquare/SquareGame.jack', async () => {
    const Main = 'test/resources/ExpressionLessSquare/SquareGame.jack'; 
    const OutputFile = 'test/resources/ExpressionLessSquare/SquareGame.tag.xml'; 
    const ExpectedFile = 'test/resources/ExpressionLessSquare/SquareGame.xml'; 

    const code = await readFile(Main);
    const compiler = new CompilationEngine(code);
    
    await writeToFile(compiler.xml, OutputFile);
    execSync(`TextComparer ${OutputFile} ${ExpectedFile}`);
    execSync(`rm ${OutputFile}`);
  });

	it('ArrayTest/Main.jack', async () => {
    const Main = 'test/resources/ArrayTest/Main.jack'; 
    const OutputFile = 'test/resources/ArrayTest/Main.tag.xml'; 
    const ExpectedFile = 'test/resources/ArrayTest/Main.xml'; 

    const code = await readFile(Main);
    const compiler = new CompilationEngine(code);
    
    await writeToFile(compiler.xml, OutputFile);
    execSync(`TextComparer ${OutputFile} ${ExpectedFile}`);
    execSync(`rm ${OutputFile}`);
  });

	it('Square/Main.jack', async () => {

    const Main = 'test/resources/Square/Main.jack'; 
    const OutputFile = 'test/resources/Square/Main.tag.xml'; 
    const ExpectedFile = 'test/resources/Square/Main.xml'; 

    const code = await readFile(Main);
    const compiler = new CompilationEngine(code);

    await writeToFile(compiler.xml, OutputFile);
    execSync(`TextComparer ${OutputFile} ${ExpectedFile}`);
    execSync(`rm ${OutputFile}`);
  });

	it('Square/Square.jack', async () => {

    const Main = 'test/resources/Square/Square.jack'; 
    const OutputFile = 'test/resources/Square/Square.tag.xml'; 
    const ExpectedFile = 'test/resources/Square/Square.xml'; 

    const code = await readFile(Main);
    const compiler = new CompilationEngine(code);

    await writeToFile(compiler.xml, OutputFile);
    execSync(`TextComparer ${OutputFile} ${ExpectedFile}`);
    execSync(`rm ${OutputFile}`);
  });

	it('Square/SquareGame.jack', async () => {

    const Main = 'test/resources/Square/SquareGame.jack'; 
    const OutputFile = 'test/resources/Square/SquareGame.tag.xml'; 
    const ExpectedFile = 'test/resources/Square/SquareGame.xml'; 

    const code = await readFile(Main);
    const compiler = new CompilationEngine(code);

    await writeToFile(compiler.xml, OutputFile);
    execSync(`TextComparer ${OutputFile} ${ExpectedFile}`);
    execSync(`rm ${OutputFile}`);
  });

});
