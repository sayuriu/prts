const fs = require('fs');
const chars = require('../ref/AN-EN-Tags/json/tl-char.json');
console.log(Object.keys(chars).length);
for (const char in chars) {
	fs.writeFileSync(`./assets/gamedata/json/info/charnames/${char.replace(/wtf is this \?/g, "char_159_peacok").replace(/and this \?/g, "char_003_kalts")}.json`, JSON.stringify(chars[char], null, 4));
}