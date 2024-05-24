import { Tokenizer } from '../src/JackTokenizer';
import { symbolToEntity } from '../src/Utils';

const Tab = '  ';

const KeywordConstants = ['true', 'false', 'null', 'this'];
const UnaryOp = ['-', '~'];
const Op = ['+', '-', '*', '/', '&', '|', '<', '>', '='];

export class CompilationEngine {
  private tokenizer: Tokenizer;
  private indentLevel: number;
  private lines: string[];

  constructor(fileLines: string[]) {
    this.tokenizer = new Tokenizer(fileLines);
    this.indentLevel = 0;
    this.lines = [];

    while (this.tokenizer.hasMoreTokens()) {
      try {
        this.nest('class', this.compileClass);
      } catch(e) {
        console.log(e);
        this.xml.forEach(l => console.log(l));
        process.exit(1);
      }
    }
  }
  
  get xml(){ return this.lines; }

  private log(s: string, tag: string = '') { 
    const indentLevel = Tab.repeat(this.indentLevel); 
    const entity = symbolToEntity(s);

    if (tag) {
      this.lines.push(`${indentLevel}<${tag}> ${entity} </${tag}>`);
    } else {
      this.lines.push(`${indentLevel}${entity}`);
    }
  }

  /*
   * Marks up and indents non-terminal elements.
   */
  private nest(tag: string, f: Function) {
    this.log(`<${tag}>`);
    this.indentLevel++;
    f.call(this);
    this.indentLevel--;
    this.log(`</${tag}>`);
  }

  /*
   * Aids at asserting whether the next token complies with the expected program
   * structure.
   */
  private peek(type: string, possible: string[] = []): boolean {
    switch (type) {
    case 'keyword':
      return (this.tokenizer.tokenType() === 'KEYWORD' && possible.includes(this.tokenizer.keyWord()));
      break;

    case 'symbol':
      return this.tokenizer.tokenType() === 'SYMBOL' && possible.includes(this.tokenizer.keyWord());
      break;

    case 'identifier':
      return this.tokenizer.tokenType() === 'IDENTIFIER';
      break;

    case 'type':
      return this.peek('keyword', ['int', 'char', 'boolean']) || this.peek('identifier');
      break;
      
    case 'statement':
      return this.peek('keyword', ['let', 'if', 'while', 'do', 'return']);
      break;

    case 'term':
      let type = this.tokenizer.tokenType();
      return type === 'INT_CONST' || type === 'STRING_CONST' 
          || this.peek('identifier') || this.peek('keyword', KeywordConstants)
          || this.peek('symbol', ['(']) || this.peek('symbol', UnaryOp);
      break;

     case 'integer':
      return this.tokenizer.tokenType() === 'INT_CONST';
     break;

     case 'string':
      return this.tokenizer.tokenType() === 'STRING_CONST';
     break;

    default:
      return false;
    }
  }

  /*
   * Log a token or throw an error.
   */
  private next(type: string, expected: string[] = []) {
    let n = this.tokenizer.lineno();

    switch (type) {
    case 'keyword':
      if (this.peek(type, expected)) {
          this.log(this.tokenizer.keyWord(), type);
      } else {
        throw new Error(`line ${n}: expected keyword(s) [${expected}] not found`);
      }
      break;

    case 'identifier':
      if (this.peek(type)) {
          this.log(this.tokenizer.identifier(), type);
      } else {
        throw new Error(`line ${n}: identifier expected`);
      }
      break;

    case 'symbol':
      if (this.peek(type, expected)) {
        this.log(this.tokenizer.symbol(), type);
      } else {
        throw new Error(`line ${n}: expected symbol [${expected}] not found`);
      }
      break;

    case 'type':
      if (this.peek('keyword', ['int', 'char', 'boolean'])) {
        this.log(this.tokenizer.keyWord(), 'keyword');
      } else if (this.peek('identifier')) {
        this.log(this.tokenizer.identifier(), 'identifier');
      } else {
        throw new Error(`line ${n}: type declaration expected`);
      }
      break;

    case 'literal':
      if (this.tokenizer.tokenType() === 'INT_CONST') {
        this.log(''+this.tokenizer.intVal(), 'integerConstant');
      } else {
        this.log(this.tokenizer.stringVal(), 'stringConstant');
      }
      break;
    }
    this.tokenizer.advance();
  }

  public compileClass(): void {
    this.next('keyword', ['class']);
    this.next('identifier');
    this.next('symbol', ['{']);

    while (this.peek('keyword', ['static', 'field'])) {
      this.nest('classVarDec', this.compileClassVarDec);
    }
    while (this.peek('keyword', ['constructor', 'function', 'method'])) {
      this.nest('subroutineDec', this.compileSubroutine);
    }
    this.next('symbol', ['}']);
  }

  public compileClassVarDec(): void {
    this.next('keyword', ['static', 'field']);
    this.next('type');
    this.next('identifier');
    while (this.peek('symbol', [','])) {
      this.next('symbol', [',']);
      this.next('identifier');
    }
    this.next('symbol', [';']);
  }

  public compileSubroutine(): void {
    this.next('keyword', ['constructor', 'function', 'method']);

    if (this.peek('type')) {
      this.next('type')
    } else {
      this.next('keyword', ['void']);
    }
    this.next('identifier');
    this.next('symbol', ['(']);
    this.nest('parameterList', this.compileParameterList);
    this.next('symbol', [')']);
    this.nest('subroutineBody', this.compileSubroutineBody);
  }

  public compileParameterList(): void {
    if (this.peek('type')) {
      this.next('type');
      this.next('identifier');
      while (this.peek('symbol', [','])) {
        this.next('symbol', [',']);
        this.next('type');
        this.next('identifier');
      }
    }
  }

  public compileSubroutineBody(): void {
    this.next('symbol', ['{']);
    while (this.peek('keyword', ['var'])) {
      this.nest('varDec', this.compileVarDec);
    }
    this.nest('statements', this.compileStatements);
    this.next('symbol', ['}']);
  }

  public compileVarDec(): void {
    this.next('keyword', ['var']);
    this.next('type');
    this.next('identifier');
    while (this.peek('symbol', [','])) {
      this.next('symbol', [',']);
      this.next('identifier');
    }
    this.next('symbol', [';']);
  }

  public compileStatements(): void {
    while (this.peek('statement')){
      switch (this.tokenizer.keyWord()) {
      case 'let':
        this.nest('letStatement', this.compileLet);       break;
      case 'do':
        this.nest('doStatement', this.compileDo);         break;
      case 'return':
        this.nest('returnStatement', this.compileReturn); break;
      case 'if':
        this.nest('ifStatement', this.compileIf);         break;
      case 'while':
        this.nest('whileStatement', this.compileWhile);   break;
      default: break;
      }
    }
  }

  public compileDo() {
    this.next('keyword', ['do']);

    this.next('identifier');
    if (this.peek('symbol', ['.'])) {
      this.next('symbol', ['.']);
      this.next('identifier');
    } 
    this.next('symbol', ['(']);
    this.nest('expressionList', this.compileExpressionList);
    this.next('symbol', [')']);
    this.next('symbol', [';']);
  }

  public compileLet() {
    this.next('keyword', ['let']);
    this.next('identifier');

    if (this.peek('symbol', ['['])) {
      this.next('symbol', ['[']);
      this.nest('expression', this.compileExpression);
      this.next('symbol', [']']);
    }

    this.next('symbol', ['=']);
    this.nest('expression', this.compileExpression);
    this.next('symbol', [';']);
  }

  public compileWhile() {
    this.next('keyword', ['while']);
    this.next('symbol', ['(']);
    this.nest('expression', this.compileExpression);
    this.next('symbol', [')']);
    this.next('symbol', ['{']);
    this.nest('statements', this.compileStatements);
    this.next('symbol', ['}']);
  }

  public compileReturn() {
    this.next('keyword', ['return']);
    if (this.peek('term')) {
      this.nest('expression', this.compileExpression);
    }
    this.next('symbol', [';']);
  }

  public compileIf() {
    this.next('keyword', ['if']);
    this.next('symbol', ['(']);
    this.nest('expression', this.compileExpression);
    this.next('symbol', [')']);
    this.next('symbol', ['{']);
    this.nest('statements', this.compileStatements);
    this.next('symbol', ['}']);

    if (this.peek('keyword', ['else'])) {
      this.next('keyword', ['else']);
      this.next('symbol', ['{']);
      this.nest('statements', this.compileStatements);
      this.next('symbol', ['}']);
    }
  }

  public compileExpression() {
    if (this.peek('term')) {
      this.nest('term', this.compileTerm);
    }
    while (this.peek('symbol', Op)) {
      this.next('symbol', Op);
      this.nest('term', this.compileTerm);
    }
  }

  public compileExpressionList() {
    if (this.peek('term')) {
      this.nest('expression', this.compileExpression);
    }
    while (this.peek('symbol', [','])) {
      this.next('symbol', [',']);
      this.nest('expression', this.compileExpression);
    }
  }

  public compileTerm() {
    switch (this.tokenizer.tokenType()) {
      case 'INT_CONST':
      case 'STRING_CONST':
        this.next('literal');                   
        break;

      case 'KEYWORD':
        this.next('keyword', KeywordConstants); 
        break;

      case 'SYMBOL':
        if (this.peek('symbol', UnaryOp)) {
          this.next('symbol', UnaryOp);
          this.nest('term', this.compileTerm);
        } else {
          this.next('symbol', ['(']);
          this.nest('expression', this.compileExpression);
          this.next('symbol', [')']);
        } 
        break;

      case 'IDENTIFIER':
        this.next('identifier');

        if (this.peek('symbol', ['(', '.'])) {            // subroutineCall
          if (this.peek('symbol', ['.'])) {
            this.next('symbol', ['.']);
            this.next('identifier');
          } 
          this.next('symbol', ['(']);
          this.nest('expressionList', this.compileExpressionList);
          this.next('symbol', [')']);
        } 

        if (this.peek('symbol', ['['])) {                 // varName[expression]
          this.next('symbol', ['[']);
          this.nest('expression', this.compileExpression);
          this.next('symbol', [']']);
        }

        break;                                            // varName
    }
  }
}
