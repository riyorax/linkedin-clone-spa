import { PrismaClient } from '@prisma/client'
import { faker, fi } from '@faker-js/faker'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function seedDatabase() {
  console.time('Database Seeding')
  
  // Clear existing data to prevent conflicts
  await prisma.chat.deleteMany()
  await prisma.connection.deleteMany()
  await prisma.feed.deleteMany()
  await prisma.users.deleteMany()

  // Generate Users
  const users: any[] = []
  const userCount = 250

  for (let i = 0; i < userCount; i++) {
    const firstName = faker.person.firstName()
    const lastName = faker.person.lastName()
    const salt = await bcrypt.genSalt(10)
    const password = firstName + lastName + i
    const password_hash = await bcrypt.hash(password, salt)

    const user = await prisma.users.create({
      data: {
        username: faker.internet.username(
            {
                firstName: firstName,
                lastName: lastName,
            }
        ) + i,
        email: faker.internet.email({ 
          firstName: firstName, 
          lastName: lastName 
        }).replace('@', `${i}@`),
        password_hash: password_hash,
        full_name: `${firstName} ${lastName}`,
        work_history: faker.person.jobDescriptor(),
        skills: faker.helpers.multiple(() => faker.person.jobArea(), { count: { min: 1, max: 5 } }).join(', '),
        profile_photo_path: faker.image.avatarGitHub()
      }
    })
    users.push(user)
  }

  // Generate Connections
    const connections: any[] = [];
    for (let i = 0; i < userCount * 2; i++) {
    const fromUser = faker.helpers.arrayElement(users);
    const toUser = faker.helpers.arrayElement(users.filter(u => u.id !== fromUser.id));

    try {
        // Create the first connection (fromUser -> toUser)
        const connection1 = await prisma.connection.create({
        data: {
            from_id: fromUser.id,
            to_id: toUser.id,
            created_at: faker.date.recent(),
        },
        });
        connections.push(connection1);

        // Create the reciprocal connection (toUser -> fromUser)
        const connection2 = await prisma.connection.create({
        data: {
            from_id: toUser.id,
            to_id: fromUser.id,
            created_at: faker.date.recent(),
        },
        });
        connections.push(connection2);
    } catch (error) {
        // Skip if a connection already exists or another error occurs
        continue;
    }
}

  // Generate Feeds
  const feeds: any[] = []
  for (let i = 0; i < userCount; i++) {
    const randomUser = faker.helpers.arrayElement(users)
    
    const feed = await prisma.feed.create({
      data: {
        content: faker.lorem.paragraph(),
        user_id: randomUser.id,
        created_at: faker.date.recent(),
        updated_at: faker.date.recent()
      }
    })
    feeds.push(feed)
  }

  console.timeEnd('Database Seeding')
  console.log(`Seeded ${userCount} users, ${connections.length} connections, ${feeds.length} feeds`)
}

seedDatabase()
  .catch((e) => {
    console.error(e)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })