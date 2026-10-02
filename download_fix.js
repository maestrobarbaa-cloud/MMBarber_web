const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'public', 'obr', 'national');

const titles = {
  uk_arms: 'File:Royal_Coat_of_Arms_of_the_United_Kingdom.svg',
  es_shield: 'File:Coat_of_arms_of_Spain.svg',
  nl_arms: 'File:Coat_of_arms_of_the_Netherlands.svg',
  be_arms: 'File:Great_coat_of_arms_of_Belgium.svg',
  de_eagle: 'File:Coat_of_arms_of_Germany.svg',
  at_eagle: 'File:Coat_of_arms_of_Austria.svg',
  pl_eagle: 'File:Coat_of_arms_of_Poland.svg',
  cz_lion: 'File:Lion_from_small_coat_of_arms_of_the_Czech_Republic.svg',
  cz_eagle: 'File:Moravian_Eagle.svg',
  cz_silesian: 'File:Silesian_Eagle.svg'
};

const headers = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' };
const delay = ms => new Promise(res => setTimeout(res, ms));

async function main() {
  for (const [key, title] of Object.entries(titles)) {
     const dest = path.join(dir, `${key}.svg`);
     if (fs.existsSync(dest) && fs.statSync(dest).size > 1000) {
        console.log(`Skipping ${key}`);
        continue;
     }
     try {
       const res = await fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=${title}&prop=imageinfo&iiprop=url&format=json`, { headers });
       const json = await res.json();
       const pages = json.query.pages;
       const page = Object.values(pages)[0];
       if (page.imageinfo && page.imageinfo[0].url) {
           const url = page.imageinfo[0].url;
           const imgRes = await fetch(url, { headers });
           if (!imgRes.ok) throw new Error(imgRes.status);
           fs.writeFileSync(dest, Buffer.from(await imgRes.arrayBuffer()));
           console.log(`Success ${key}`);
       } else {
           console.error(`No url for ${title}`);
       }
     } catch (e) {
       console.error(`Failed ${key}:`, e.message);
     }
     await delay(2000);
  }
}
main();
