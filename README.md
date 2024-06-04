JackCompiler from Nand2Tetris
=============================

This folder contains an unfinished TypeScript implementation of the Jack
Compiler from [NandToTetris](https://www.nand2tetris.org/).  The code adheres 
to the specified API outlined in Projects 10 and 11.

Development Approach
--------------------

Unit testing leveraged by the `mocha` framework. 

```bash
npm test            # Run tests
npx tsc             # Run the typescript transpiler.
```

### Stage I

The compiler's front-end that performs syntax analysis is complete and all test
passing.
