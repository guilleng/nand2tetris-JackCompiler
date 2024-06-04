export type Token = {
  type: string,
  val: string,
  lineno: number
};

export class Tokenizer {
  private tokens: Token[];

  private keywordRe = "\\b(class|constructor|function|method|field|static|var|int|char|boolean|void|true|false|null|this|let|do|if|else|while|return)\\b";
  private identifierRe = "\\b([a-zA-Z_][a-zA-Z0-9_]*)\\b";
  private symbolRe = "([\\-\\[\\]{}().,;+*/&|<>=~])";
  private int_constRe = "(\\d+)";
  private string_constRe = '"(.+)"';
  private tokensRe = new RegExp(`(${this.keywordRe})|(${this.identifierRe})|(${this.symbolRe})|(${this.int_constRe})|(${this.string_constRe})`, 'g');

  /*
   * Rudimentary comment stripping functions.  For serious handling of comments we
   * need a full-blown parser.  Two-tier: First pass removes inline comments,
   * then multi-line and API-style comments.
   */
  private stripInlineComments(lines: string[]): string[] {
    const inlineRe = /\/\/.*|\/\*[\s\S]*?\*\//g;

    return lines.map(line => line.replace(inlineRe, '').trim());
  }

  private stripAPIComments(lines: string[]): string[] {
    const openingRe = /\/\*/;
    const closingRe = /\*\//;

    let stripCode: string[] = [];
    let flag: boolean = false;

    for (const line of lines) {
      if (openingRe.test(line)) {
        flag = true;
      }

      if (flag) {
        stripCode.push('');
      } else {
        stripCode.push(line);
      }

      if (closingRe.test(line)) {
        flag = false;
      }

    }
    return stripCode;
  }

  private makeTokenObj(token: string, lineno: number): Token {
		if (token.match(this.keywordRe)) {
			return { 
				type: "KEYWORD", 
				val: `${token}`,
				lineno: lineno
			};
		} else if (token.match(this.symbolRe)) {
			return { 
				type: "SYMBOL", 
				val: `${token}`,
				lineno: lineno
			};
		} else if (token.match(this.int_constRe)) {
			return { 
				type: "INT_CONST", 
				val: `${token}`,
				lineno: lineno
			};
		} else if (token.match(this.string_constRe)) {
			return { 
				type: "STRING_CONST", 
				val: token.slice(1, -1),
				lineno: lineno
			};
		} else if (token.match(this.identifierRe)) {
			return { 
				type: "IDENTIFIER", 
				val: `${token}`,
				lineno: lineno
			};
		} else {
			throw new Error(`Unreachable`);
		}
  }

  constructor(fileLines: string[]) {
		this.tokens = [];
		let cleanLines = this.stripAPIComments(this.stripInlineComments(fileLines));

		let lineno = 1;
		for (const line of cleanLines) {
      let matches; 

			if ((matches = line.match(this.tokensRe)) !== null) {
				matches.forEach((match) => this.tokens.push(this.makeTokenObj(match, lineno)));
			}
      lineno++;
		}
	}

  get token(): Token {
    return this.tokens[0];
  }

  public hasMoreTokens(): boolean {
    return this.tokens.length !== 0;
  }

  public advance(): void {
    this.tokens.shift();
  }

  public tokenType(): string {
    return this.tokens[0].type;
  }

  public keyWord(): string {
    return this.tokens[0].val;
  }

  public symbol(): string {
    return this.tokens[0].val;
  }
  
  public identifier(): string {
    return this.tokens[0].val;
  }

  public intVal(): number {
    return parseInt(this.tokens[0].val);
  }

  public stringVal(): string {
    return this.tokens[0].val;
  }

  public lineno(): number {
    return this.tokens[0].lineno;
  }
}
