// Various variable declarators and property patterns which can apparently break

for (const a of b) {}
var foo, bar;
let x, y;
const d = 1, e = 2;
export default {
  [process.env.NODE_ENV]: process.env.NODE_ENV
};