import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const saltRounds = 10

  const password1 = await bcrypt.hash('Teste@123', saltRounds)
  const password2 = await bcrypt.hash('Senha@456', saltRounds)

  // Cria usuários
  const user1 = await prisma.user.create({
    data: {
      name: 'Alisson',
      email: 'alisson@example.com',
      password: password1
    }
  })

  const user2 = await prisma.user.create({
    data: {
      name: 'João',
      email: 'joao@example.com',
      password: password2
    }
  })

  // Fontes de dívida
  const fonte1 = await prisma.debtSource.create({
    data: {
      name: 'Nubank',
      type: 'CARTAO',
      dueDay: 10,
      userId: user1.id
    }
  })

  const fonte2 = await prisma.debtSource.create({
    data: {
      name: 'Empréstimo Banco',
      type: 'BANCO',
      dueDay: 5,
      userId: user2.id
    }
  })

  const fonte3 = await prisma.debtSource.create({
    data: {
      name: 'Empréstimo Pessoal',
      type: 'PESSOA',
      dueDay: 15,
      userId: user1.id,
      description: 'Empréstimo com amigo'
    }
  })

  // Dívidas
  const divida1 = await prisma.debt.create({
    data: {
      title: 'Compra de notebook Dell',
      amount: 1500.0,
      createdAt: new Date('2025-05-10'),
      description: 'Compra notebook',
      userId: user1.id,
      debtSourceId: fonte1.id,
      installmentsNumber: 10
    }
  })

  const divida2 = await prisma.debt.create({
    data: {
      title: 'Viagem GAGA',
      amount: 1500.0,
      createdAt: new Date('2025-05-10'),
      userId: user2.id,
      debtSourceId: fonte2.id,
      installmentsNumber: 3
    }
  })

  // Parcelas
  // await prisma.installment.createMany({
  //   data: [
  //     {
  //       amount: 1500.0,
  //       month: 5,
  //       year: 2025,
  //       status: 'PENDING',
  //       type: 'ELETRONICO',
  //       debtId: divida1.id
  //     },
  //     {
  //       amount: 1800.0,
  //       month: 5,
  //       year: 2025,
  //       status: 'PAID',
  //       type: 'VIAGEM',
  //       debtId: divida2.id
  //     }
  //   ]
  // })

  console.log('🌱 Seeds criadas com sucesso!')
}

main()  dueDate: string
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => {
    prisma.$disconnect()
  })
