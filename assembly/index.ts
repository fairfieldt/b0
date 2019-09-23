// The entry file of your WebAssembly module.

//type i8 = number;
//type u8 = number;
//type i32 = number;
//type bool = boolean;


const stack = new Uint32Array(64);
let sp: i32 = -1;

const addInt = (): void => {
  const i: u32 = stack[sp];
  const j: u32 = stack[--sp];
  const result = i + j;
  stack[sp] = result as u32;
};

const subInt = (): void => {
  const i: u32 = stack[sp];
  const j: u32 = stack[--sp];
  const result = j - i;
  stack[sp] = result as u32;
};

const isLiteral = (val: string): boolean => {
  for (let i = 0; i < val.length; i++) {
    const s = val.charCodeAt(i);
    if (s > 57 || s < 48) {
      return false;
    }
  }
  return true;
};

const pushLiteral = (val: string): void => {
  const num = Number.parseInt(val);
  stack[++sp] = num as u32;
};

const applyOp = (val: string): boolean => {
  const c = val.charAt(0);
  if (c == '+') {
    addInt();
  } else if (c == '-') {
    subInt();
  }
  return true;
};

const buildDef = (source: string[]): bool => {
  return true;
};


let sourceBuffer: Uint8Array;
export function getSourceBuffer (len: i32): Uint8Array {
  sourceBuffer = new Uint8Array(len);
  return sourceBuffer;
};
export function getStackBuffer (): Uint32Array {
  return stack;
};


export function _eval (): i32 {
  const s = String.UTF8.decode(sourceBuffer.buffer);
  const parts = s.split(' ');
  if (s.startsWith("def ")) {
    buildDef(parts);
  } else {
    parts.forEach((part: string) => {
      part = part.trim();
      if (isLiteral(part)) {
        pushLiteral(part);
      } else {
        applyOp(part);
      }
    //  printStack();
    });
  }
  return sp;
}