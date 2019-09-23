const repl = require("repl");
const fs = require("fs");
const loader = require("assemblyscript/lib/loader");

const compiled = new WebAssembly.Module(fs.readFileSync(__dirname + "/build/optimized.wasm"));
const imports = {
  env: {
    abort(_msg, _file, line, column) {
       console.error("abort called at index.ts:" + line + ":" + column);
    }
  }
};
const printStack = (buf, sp) => {
  console.log('__________');
  for (let i = sp; i >= 0; i--) {
    console.log(i + ': \t' + buf[i])
  }
  console.log('__________');
};

const mod = loader.instantiate(compiled);

const stackBufPtr = mod.getStackBuffer();
const stackBuf = mod.__getUint32Array(stackBufPtr);

const textEncoder = new TextEncoder();
const __eval = (cmd, context, filename, cb) => {
  const buf = textEncoder.encode(cmd);
  const sourceBufPtr = mod.getSourceBuffer(buf.byteLength);
  const sourceBuf = mod.__getUint8Array(sourceBufPtr);
  sourceBuf.set(buf);
  const result = mod._eval();
  printStack(stackBuf, result);
  cb(null, result);
}

repl.start({
  eval: __eval
});