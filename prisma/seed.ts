import { PrismaClient } from "../generated/prisma/client"
import { faker } from '@faker-js/faker'
import dotenv from 'dotenv'

dotenv.config()
const prisma = new PrismaClient()
async function main() {
  await prisma.$transaction(async tx =>{

    const userIds: number[] = []
    const adminUser = await tx.user.create({
      data:{
        email: 'admin@example.com',
        //admin password
        //salt: lOWw3NVrMm9XQ4EP
        password: '$argon2i$v=19$m=16,t=2,p=1$bE9XdzNOVnJNbTlYUTRFUA$yJ9oHFBt3ajn1YE6PdzT8w',
        profileKep: 'https://lipsum.app/id/24/1600x900'
      }
    })
    userIds.push(adminUser.id)
    for(let i = 0; i < 10;i++){
      const xUser = await tx.user.create({
        data:{
          email: `user${i}@exmp.com`,
          //password1234
          password: '$argon2i$v=19$m=16,t=2,p=1$bE9XdzNOVnJNbTlYUTRFUA$swuGhgNo7BvtkabZq1WAEw',
          profileKep: ``
        }
      })
      userIds.push(xUser.id)
    }
    for(let i =0; i <10;i++){
      
      await tx.product.create({
        data:{
          name: faker.food.ingredient(),
          price: faker.commerce.price({
            min: 0.5,
            max: 200,
            dec: 2,
            
          }),
          experationDate: faker.datatype.boolean(0.2) ? null: faker.date.soon(),
          whislistedByUser: {
            connect: faker.helpers.arrayElements(userIds).map(id=>({id}))
          }
          
        }
      })
    }
  })
  }
  main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
