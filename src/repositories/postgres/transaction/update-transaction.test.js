import { prisma } from '../../../../prisma/prisma'
import { PostgresUpdateTransactionRepository } from './update-transaction'
import { faker } from '@faker-js/faker'
import { transaction, user } from '../../../tests'
import { TransactionType } from '@prisma/client'
import dayjs from 'dayjs'

describe('PostgresUpdateTransactionRepository', () => {
    const params = {
        id: faker.string.uuid(),
        user_id: user.id,
        name: faker.commerce.productName(),
        date: faker.date.anytime().toISOString(),
        type: TransactionType.EXPENSE,
        amount: Number(faker.finance.amount()),
    }

    it('should update a transaction on db', async () => {
        //arrange
        await prisma.user.create({ data: user })
        await prisma.transaction.create({
            data: { ...transaction, user_id: user.id },
        })
        const sut = new PostgresUpdateTransactionRepository()

        //act
        const result = await sut.execute(transaction.id, params)

        //assert
        expect(result.name).toBe(params.name)
        expect(result.type).toBe(params.type)
        expect(result.user_id).toBe(user.id)
        expect(String(result.amount)).toBe(String(params.amount))
        expect(dayjs(result.date).daysInMonth()).toBe(
            dayjs(params.date).daysInMonth(),
        )
        expect(dayjs(result.date).month()).toBe(dayjs(params.date).month())
        expect(dayjs(result.date).year()).toBe(dayjs(params.date).year())
    })

    it('should call Prisma with correct params', async () => {
        //arrange
        await prisma.user.create({ data: user })
        await prisma.transaction.create({
            data: { ...transaction, user_id: user.id },
        })
        const prismaSpy = jest.spyOn(prisma.transaction, 'update')
        const sut = new PostgresUpdateTransactionRepository()

        //act
        await sut.execute(transaction.id, { ...transaction, user_id: user.id })

        //assert
        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                id: transaction.id,
            },
            data: { ...transaction, user_id: user.id },
        })
    })

    it('should throws if Prisma throws', async () => {
        //arrange
        const sut = new PostgresUpdateTransactionRepository()
        jest.spyOn(prisma.transaction, 'update').mockRejectedValueOnce(
            new Error(),
        )

        //act
        const promise = sut.execute(transaction.id, transaction)

        //assert
        await expect(promise).rejects.toThrow()
    })
})
