const fs = require('fs');
const path = 'request.xml';
const data = fs.readFileSync(path, 'utf8');

console.log('Checking for hidden/non-printable characters in request.xml...');
let found = false;
for (let i = 0; i < data.length; i++) {
  const code = data.charCodeAt(i);
  // Printable ASCII: 32-126, newline (10), carriage return (13), tab (9)
  if ((code < 32 && code !== 10 && code !== 13 && code !== 9) || code > 126) {
    console.log(`Hidden char at pos ${i}: 0x${code.toString(16)} (${data[i]})`);
    found = true;
  }
}
if (!found) {
  console.log('No hidden or non-printable characters found.');
} 