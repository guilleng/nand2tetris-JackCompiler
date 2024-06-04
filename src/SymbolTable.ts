type Entry = {
  type: string,
  kind: string,
  index: number
}

export class SymbolTable {
  private classTable: Map<string, Entry>;
  private subroutineTable: Map<string, Entry>;
  private counts: { static: number, field: number, arg: number, var: number };

  constructor() {
    this.classTable = new Map();
    this.subroutineTable = new Map();
    this.counts= { static: 0, field: 0, arg: 0, var: 0 };
  }
  
  public startSubroutine() {
    this.subroutineTable.clear(); 
    this.counts.arg = 0;
    this.counts.var = 0;
  }
  
  public define(name: string, type: string, kind: string) {
    let entry: Entry;
    let index: number;

    if (kind === 'static' || kind === 'field') {
      index = this.counts[kind]++;
      entry = { type: type, kind: kind, index: index };
      this.classTable.set(name, entry);
    } else if (kind === 'arg' || kind === 'var') {
      index = this.counts[kind]++;
      entry = { type: type, kind: kind, index: index };
      this.subroutineTable.set(name, entry);
    } else {
      throw new Error(`Unreachable`);
    }
  }

  public varCount(kind: string): number {
    if (kind === 'static' || kind === 'field') {
      return this.counts[kind];
    } else if (kind === 'arg' || kind === 'var') {
      return this.counts[kind];
    } else {
      throw new Error(`Unreachable`);
    }
  }

  public kindOf(name: string): string {
    let subroutineScope = this.subroutineTable.get(name);
    let classScope = this.classTable.get(name);

    if (subroutineScope) {
      return subroutineScope.kind;
    } else if (classScope) {
      return classScope.kind;
    } else { 
      return 'NONE';
    }
  }

  public typeOf(name: string): string {
    let subroutineScope = this.subroutineTable.get(name);
    let classScope = this.classTable.get(name);

    if (subroutineScope) {
      return subroutineScope.type;
    } else if (classScope) {
      return classScope.type;
    } else {
      return 'NONE';
    }
  }

  public indexOf(name: string): number {
    let subroutineScope = this.subroutineTable.get(name);
    let classScope = this.classTable.get(name);

    if (subroutineScope) {
      return subroutineScope.index;
    } else if (classScope) {
      return classScope.index;
    } else {
      return -1;
    }
  }
}
