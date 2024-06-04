JackCompiler from Nand2Tetris
=============================

This folder contains an unfinished implementation of the Jack Compiler from 
[NandToTetris](https://www.nand2tetris.org/).  The code adheres to the specified 
API outlined in Projects 10 and 11.

Development Approach
--------------------

Built using the Node.js runtime with TypeScript.  Unit testing leveraged by the 
`mocha` framework. 

```bash
npm test            # Run tests
npx tsc             # Run the typescript transpiler.
```

### Stage I

The compiler's front-end that performs syntax analysis is complete and tests are
passing.

### Stage II

Code generation (SymbolTable and VMWRiter modules) are not implemented (and 
perhaps never will).