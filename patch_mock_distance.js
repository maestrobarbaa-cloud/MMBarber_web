const fs = require('fs');
const path = require('path');

const pondPath = path.join('c:', 'Users', 'micka', 'Documents', 'MMBarber_web', 'src', 'components', 'seznamka', 'Pond.tsx');
let content = fs.readFileSync(pondPath, 'utf8');

// Add distanceFromUser to some mock profiles in Pond.tsx
content = content.replace(
  /name: 'Adam', trustedRater: true, trustedRatingsReceived: 45,/g,
  `name: 'Adam', trustedRater: true, trustedRatingsReceived: 45, distanceFromUser: 5,`
);
content = content.replace(
  /name: 'Klára', trustedRater: true, trustedRatingsReceived: 12,/g,
  `name: 'Klára', trustedRater: true, trustedRatingsReceived: 12, distanceFromUser: 120,`
);
content = content.replace(
  /name: 'Tomáš', trustedRater: false, trustedRatingsReceived: 2,/g,
  `name: 'Tomáš', trustedRater: false, trustedRatingsReceived: 2, distanceFromUser: 2,`
);
content = content.replace(
  /name: 'Petra', trustedRater: true, trustedRatingsReceived: 89,/g,
  `name: 'Petra', trustedRater: true, trustedRatingsReceived: 89, distanceFromUser: 45,`
);
// Some others that I didn't touch last time:
content = content.replace(
  /name: 'Martin', age: '27', city: 'Plzeň', gender: 'male',/g,
  `name: 'Martin', age: '27', city: 'Plzeň', gender: 'male', distanceFromUser: 85,`
);
content = content.replace(
  /name: 'Lucie', age: '24', city: 'Brno', gender: 'female',/g,
  `name: 'Lucie', age: '24', city: 'Brno', gender: 'female', distanceFromUser: 210,`
);
content = content.replace(
  /name: 'Lukáš', age: '26', city: 'Ostrava', gender: 'male',/g,
  `name: 'Lukáš', age: '26', city: 'Ostrava', gender: 'male', distanceFromUser: 300,`
);
content = content.replace(
  /name: 'Nikola', age: '23', city: 'Praha', gender: 'female',/g,
  `name: 'Nikola', age: '23', city: 'Praha', gender: 'female', distanceFromUser: 12,`
);

fs.writeFileSync(pondPath, content);
console.log('Done modifying Pond.tsx distance data');
