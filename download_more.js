const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'public', 'obr', 'national');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const titles = {
  fr_arms: 'File:Armoiries_de_la_République_française.svg',
  gr_arms: 'File:Coat_of_arms_of_Greece.svg',
  sk_arms: 'File:Coat_of_arms_of_Slovakia.svg',
  se_arms: 'File:Coat_of_arms_of_Sweden.svg',
  fi_arms: 'File:Coat_of_arms_of_Finland.svg',
  dk_arms: 'File:National_Coat_of_arms_of_Denmark.svg',
  ie_arms: 'File:Coat_of_arms_of_Ireland.svg',
  ch_arms: 'File:Coat_of_arms_of_Switzerland.svg',
  tr_emblem: 'File:National_emblem_of_Turkey.svg'
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
       await delay(2000);
     } catch(e) {
       console.error(`Failed ${key}:`, e.message);
     }
  }
}
main();
