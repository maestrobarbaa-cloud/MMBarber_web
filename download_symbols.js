const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'public', 'obr', 'national');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const titles = {
  usa_eagle: 'File:Greater_coat_of_arms_of_the_United_States.svg',
  uk_arms: 'File:Royal_coat_of_arms_of_the_United_Kingdom.svg',
  it_emblem: 'File:Emblem_of_Italy.svg',
  es_shield: 'File:Coat_of_arms_of_Spain.svg',
  ca_arms: 'File:Coat_of_arms_of_Canada.svg',
  ru_eagle: 'File:Coat_of_Arms_of_the_Russian_Federation.svg',
  lt_vytis: 'File:Coat_of_arms_of_Lithuania.svg',
  lv_arms: 'File:Coat_of_arms_of_Latvia.svg',
  ee_arms: 'File:Coat_of_arms_of_Estonia.svg',
  nl_arms: 'File:Coat_of_arms_of_the_Netherlands.svg',
  be_arms: 'File:Great_coat_of_arms_of_Belgium.svg',
  pt_arms: 'File:Coat_of_arms_of_Portugal.svg',
  ro_arms: 'File:Coat_of_arms_of_Romania.svg',
  bg_arms: 'File:Coat_of_arms_of_Bulgaria.svg',
  hr_arms: 'File:Coat_of_arms_of_Croatia.svg',
  si_arms: 'File:Coat_of_arms_of_Slovenia.svg',
  de_eagle: 'File:Coat_of_arms_of_Germany.svg',
  at_eagle: 'File:Coat_of_arms_of_Austria.svg',
  pl_eagle: 'File:Coat_of_arms_of_Poland.svg',
  cz_lion: 'File:Lion_from_small_coat_of_arms_of_the_Czech_Republic.svg',
  cz_eagle: 'File:Moravian_Eagle.svg',
  cz_silesian: 'File:Silesian_Eagle.svg'
};

const delay = ms => new Promise(res => setTimeout(res, ms));

const headers = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' };

async function getUrl(title) {
  const res = await fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=${title}&prop=imageinfo&iiprop=url&format=json`, { headers });
  const json = await res.json();
  const pages = json.query.pages;
  const page = Object.values(pages)[0];
  if (page.imageinfo && page.imageinfo[0].url) {
    return page.imageinfo[0].url;
  }
  throw new Error('No image url found for ' + title);
}

async function download(url, dest) {
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error('Status ' + res.status);
  const buffer = await res.arrayBuffer();
  fs.writeFileSync(dest, Buffer.from(buffer));
}

async function main() {
  for (const [key, title] of Object.entries(titles)) {
     const dest = path.join(dir, `${key}.svg`);
     if (fs.existsSync(dest) && fs.statSync(dest).size > 1000) {
        console.log(`Skipping ${key}`);
        continue;
     }
     try {
       console.log(`Fetching URL for ${key}...`);
       const url = await getUrl(title);
       console.log(`Downloading ${url}...`);
       await download(url, dest);
       console.log(`Success ${key}`);
       await delay(2000); // 2 second delay
     } catch(e) {
       console.error(`Failed ${key}:`, e.message);
     }
  }
}
main();
