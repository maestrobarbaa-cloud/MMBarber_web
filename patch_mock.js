const fs = require('fs');
const path = require('path');

const mockPath = path.join('c:', 'Users', 'micka', 'Documents', 'MMBarber_web', 'src', 'components', 'seznamka', 'MockProfiles.ts');
let content = fs.readFileSync(mockPath, 'utf8');

// Inject trustedRatingsReceived and trustedRater into MockProfiles
content = content.replace(
  /name: 'Michal',/g,
  `name: 'Michal',\n    trustedRater: true,\n    trustedRatingsReceived: 24,`
);

content = content.replace(
  /name: 'Veronika',/g,
  `name: 'Veronika',\n    trustedRater: true,\n    trustedRatingsReceived: 12,`
);

content = content.replace(
  /name: 'David',/g,
  `name: 'David',\n    trustedRater: false,\n    trustedRatingsReceived: 3,`
);

fs.writeFileSync(mockPath, content);
console.log('Done modifying MockProfiles.ts');
