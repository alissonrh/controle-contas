import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const saltRounds = 10

  const password1 = await bcrypt.hash('@dmin123', saltRounds)
  const password2 = await bcrypt.hash('Senha@456', saltRounds)

  // === Usuários ===
  const [user1, user2] = await Promise.all([
    prisma.user.create({
      data: {
        name: 'admin',
        email: 'admin@admin.com',
        password: password1
      }
    }),
    prisma.user.create({
      data: {
        name: 'João',
        email: 'joao@example.com',
        password: password2
      }
    })
  ])

  // === Fontes de dívida ===
  const [fonte1, fonte2, fonte3] = await Promise.all([
    prisma.debtSource.create({
      data: {
        name: 'Nubank',
        type: 'CARTAO',
        dueDay: 10,
        userId: user1.id
      }
    }),
    prisma.debtSource.create({
      data: {
        name: 'Empréstimo Banco',
        type: 'BANCO',
        dueDay: 5,
        userId: user2.id
      }
    }),
    prisma.debtSource.create({
      data: {
        name: 'Empréstimo Pessoal',
        type: 'PESSOA',
        dueDay: 15,
        userId: user1.id,
        description: 'Empréstimo com amigo'
      }
    })
  ])

  // === Viagem ===
  const trip = await prisma.trip.create({
    data: {
      userId: user2.id,
      startDate: new Date('2025-06-01'),
      endDate: new Date('2025-06-07'),
      location: 'Nova York',
      description: 'Viagem para conhecer a cidade'
    }
  })

  // === Dívidas ===
  const [divida1, divida2] = await Promise.all([
    prisma.debt.create({
      data: {
        title: 'Compra de notebook Dell',
        amount: 1500.0,
        createdAt: new Date('2025-05-10'),
        description: 'Notebook Dell XPS',
        userId: user1.id,
        debtSourceId: fonte1.id,
        installmentsNumber: 10,
        type: 'ELETRONICO'
      }
    }),
    prisma.debt.create({
      data: {
        title: 'Viagem GAGA',
        amount: 1500.0,
        createdAt: new Date('2025-05-10'),
        userId: user2.id,
        debtSourceId: fonte2.id,
        installmentsNumber: 3,
        type: 'VIAGEM',
        tripId: trip.id
      }
    })
  ])

  // === Parcelas (installments) da dívida 2 ===
  const installments = [0, 1, 2].map((i) =>
    prisma.installment.create({
      data: {
        amount: 500,
        month: 6 + i,
        year: 2025,
        status: i === 0 ? 'PAID' : 'PENDING',
        userId: user2.id,
        debtId: divida2.id
      }
    })
  )

  await Promise.all(installments)

  console.log('🌱 Seeds criadas com sucesso!')
}

main()
  .catch((e) => {
    console.error('Erro ao criar seed:', e)
    process.exit(1)
  })
  .finally(() => {
    prisma.$disconnect()
  })
