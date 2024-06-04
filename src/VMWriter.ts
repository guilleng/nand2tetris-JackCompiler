export class VMWriter {
  private output: string[];

  constructor() {
    this.output = [];
  }
  
  public writePush(segment: string, index: number):void {
  }

  public writePop(segment: string, index: number):void {
  }

  public writeArithmetic(command: string, index: number):void {
  }

  public writeLabel(label: string):void {
  }

  public writeGoto(label: string):void {
  }

  public writeIf(label: string):void {
  }

  public writeCall(name: string, nArgs: number):void {
  }

  public writeFunction(name: string, nLocals: number):void {
  }

  public writeReturn():void {
  }
}
