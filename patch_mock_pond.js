const fs = require('fs');
const path = require('path');

const pondPath = path.join('c:', 'Users', 'micka', 'Documents', 'MMBarber_web', 'src', 'components', 'seznamka', 'Pond.tsx');
let content = fs.readFileSync(pondPath, 'utf8');

// Add trusted properties to some mock profiles in Pond.tsx
content = content.replace(
  /name: 'Adam',/g,
  `name: 'Adam', trustedRater: true, trustedRatingsReceived: 45,`
);
content = content.replace(
  /name: 'Klra',/g,
  `name: 'Klára', trustedRater: true, trustedRatingsReceived: 12,`
);
content = content.replace(
  /name: 'Klára',/g,
  `name: 'Klára', trustedRater: true, trustedRatingsReceived: 12,`
);
content = content.replace(
  /name: 'Tom',/g,
  `name: 'Tomáš', trustedRater: false, trustedRatingsReceived: 2,`
);
content = content.replace(
  /name: 'Tomáš',/g,
  `name: 'Tomáš', trustedRater: false, trustedRatingsReceived: 2,`
);
content = content.replace(
  /name: 'Petra',/g,
  `name: 'Petra', trustedRater: true, trustedRatingsReceived: 89,`
);

fs.writeFileSync(pondPath, content);
console.log('Done modifying Pond.tsx mock profiles');
