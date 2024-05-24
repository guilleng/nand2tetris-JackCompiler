import { EOL } from "os";
import * as fs from 'fs';
import readlinePromises from 'readline';
import * as fsPromises from 'fs/promises';

/*
 * Resolves to a string[] array of the lines in `file`.
 */
export async function readFile(file: string): Promise<string[]> {
  let code: string[] = [];
	const inputStream = await fs.createReadStream(file);
	let rl = readlinePromises.createInterface({
		input: inputStream,
		crlfDelay: Infinity,
	});

	let i = 1;
	for await (const line of rl) {
		code.push(line);
	}

  return code;
}

/*
 * Return a valid HTML entity.
 */
export function symbolToEntity(char: string): string {
    if (char === '<') {
      return '&lt;';
    }
    if (char === '>') {
      return '&gt;';
    }
    if (char === '"') {
      return '&quot;';
    }
    if (char === '&') {
      return '&amp;';
    }
    return ""+char;
}


export async function writeToFile(lines: string[], file: string): Promise<void> {

  for (const line of lines) {
    await fsPromises.appendFile(file, `${line}${EOL}`, 'utf8');
  }
}
