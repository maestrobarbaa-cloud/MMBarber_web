import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding fake profiles...')

  const fakeUsers = [
    {
      email: 'alex@example.com',
      name: 'Alex',
      profile: {
        name: 'Alex',
        age: '28',
        gender: 'male',
        seeking: JSON.stringify(['female']),
        city: 'Praha',
        height: '185',
        smoking: 'no',
        drinking: 'socially',
        interests: 'Káva, Posilovna, Cestování',
        bio: 'Hledám někoho na společné výlety a dobrou kávu. Jsem hodně aktivní.',
        photos: JSON.stringify(['https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80']),
        salonVerified: true,
        physicallyVerifiedAt: JSON.stringify(['MMBarber Praha 1']),
        trustScore: 95,
        extendedData: JSON.stringify({
          accountType: 'individual',
          trustEndorsements: [{ count: 3, salonId: 'salon1', salonName: 'MMBarber Praha 1' }],
          wingmanEndorsements: [{ author: 'Karel (Wingman)', text: 'Alex je super chlap, nezkazí žádnou srandu.' }],
          voicePrompt: { question: 'Moje nejhorší rande?', url: '#' },
          categories: ['sports', 'coffee'],
          mbti: 'ENTJ',
          socialBattery: 'extrovert',
          energy: 'high',
          lifestylePrefs: { pace: 'fast', sport: 'zasadni' },
          characterTraits: { honesty: 'zasadni', humor: 'hodne' },
          currentStatus: { text: 'Dneska večer drink?', expiresAt: Date.now() + 1000 * 60 * 60 * 5 }
        })
      }
    },
    {
      email: 'mia@example.com',
      name: 'Mia',
      profile: {
        name: 'Mia',
        age: '25',
        gender: 'female',
        seeking: JSON.stringify(['male', 'female']),
        city: 'Brno',
        height: '168',
        smoking: 'yes',
        drinking: 'often',
        interests: 'Kluby, Umění, Tetování',
        bio: 'Život je moc krátký na to být doma. Hledám parťáka na parties.',
        photos: JSON.stringify(['https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80']),
        salonVerified: false,
        trustScore: 40,
        reportsCount: 1,
        extendedData: JSON.stringify({
          accountType: 'individual',
          categories: ['nightlife', 'art'],
          mbti: 'ISFP',
          socialBattery: 'ambivert',
          energy: 'medium',
          lifestylePrefs: { parties: 'zasadni', nature: 'vubec' },
          nsfwCategories: ['open_relationship'],
          familyStatus: 'taken',
          guiltyPleasures: ['Reality shows', 'Fast food v noci']
        })
      }
    },
    {
      email: 'david@example.com',
      name: 'David',
      profile: {
        name: 'David',
        age: '34',
        gender: 'male',
        seeking: JSON.stringify(['female']),
        city: 'Ostrava',
        height: '178',
        smoking: 'no',
        drinking: 'no',
        interests: 'Knihy, Pes, Filmy',
        bio: 'Introvert, co rád tráví večery doma se psem a dobrým filmem.',
        photos: JSON.stringify(['https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80']),
        salonVerified: true,
        trustScore: 100,
        extendedData: JSON.stringify({
          accountType: 'pet',
          pets: [{ id: '1', type: 'dog', breed: 'Zlatý retrívr', name: 'Max', purpose: 'walk' }],
          animals: { havePets: ['dog'], petsAtHomeBother: 'no' },
          mbti: 'INTJ',
          socialBattery: 'introvert',
          energy: 'low',
          lifestylePrefs: { homeTime: 'zasadni', parties: 'vubec' },
          rituals: ['Ranní káva a kniha'],
          locations: [{ city: 'Ostrava', radiusKm: 20 }]
        })
      }
    },
    {
      email: 'sara@example.com',
      name: 'Sára',
      profile: {
        name: 'Sára',
        age: '29',
        gender: 'female',
        seeking: JSON.stringify(['male']),
        city: 'Plzeň',
        height: '172',
        smoking: 'no',
        drinking: 'socially',
        interests: 'Jóga, Vegan, Příroda',
        bio: 'Hledám někoho, kdo sdílí podobné hodnoty. Cvičím jógu a miluju hory.',
        photos: JSON.stringify(['https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80']),
        salonVerified: true,
        physicallyVerifiedAt: JSON.stringify(['SafeSpot Plzeň']),
        trustScore: 88,
        extendedData: JSON.stringify({
          accountType: 'individual',
          categories: ['yoga', 'nature', 'vegan'],
          mbti: 'ENFJ',
          socialBattery: 'extrovert',
          lifestylePrefs: { nature: 'zasadni', sport: 'hodne' },
          values: { traditionalVsModern: 'modern', faithImportance: 'vubec' },
          secretDesires: 'Jet na měsíc do Indie',
          secretDesiresReveal: 'mutual'
        })
      }
    },
    {
      email: 'couple@example.com',
      name: 'Tom & Jana',
      profile: {
        name: 'Tom & Jana',
        age: '30',
        gender: 'couple',
        seeking: JSON.stringify(['female']),
        city: 'Praha',
        height: '175',
        smoking: 'sometimes',
        drinking: 'socially',
        interests: 'Víno, Deskovky, Swing',
        bio: 'Jsme pár a hledáme sympatickou slečnu na občasné zpestření víkendů.',
        photos: JSON.stringify(['https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80']),
        salonVerified: false,
        trustScore: 75,
        extendedData: JSON.stringify({
          accountType: 'couple',
          familyStatus: 'married',
          members: [
            { id: '1', name: 'Tom', age: '32', gender: 'male', height: '185', smoking: 'no', drinking: 'socially' },
            { id: '2', name: 'Jana', age: '28', gender: 'female', height: '165', smoking: 'yes', drinking: 'often' }
          ],
          nsfwCategories: ['threesome', 'swinging'],
          categories: ['boardgames', 'wine']
        })
      }
    }
  ]

  for (const fake of fakeUsers) {
    const user = await prisma.user.upsert({
      where: { email: fake.email },
      update: {},
      create: {
        email: fake.email,
        name: fake.name,
        role: 'USER'
      }
    })

    await prisma.profile.upsert({
      where: { userId: user.id },
      update: fake.profile,
      create: {
        ...fake.profile,
        userId: user.id
      }
    })
  }

  console.log('Fake profiles created!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
