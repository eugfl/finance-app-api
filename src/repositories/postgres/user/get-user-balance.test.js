import { faker } from '@faker-js/faker'
import { prisma } from '../../../../prisma/prisma'
import { user as fakeUser } from '../../../tests'
import { PostgresGetUserBalanceRepository } from './get-user-balance'
import { TransactionType } from '@prisma/client'

describe('GetUserBalance', () => {
    it('should get user balance on db', async () => {
        //arrange
        const user = await prisma.user.create({ data: fakeUser })
        await prisma.transaction.createMany({
            data: [
                {
                    name: faker.string.sample(),
                    amount: 5000,
                    date: faker.date.recent(),
                    type: 'EARNING',
                    user_id: user.id,
                },
                {
                    name: faker.string.sample(),
                    amount: 5000,
                    date: faker.date.recent(),
                    type: 'EARNING',
                    user_id: user.id,
                },
                {
                    name: faker.string.sample(),
                    amount: 1000,
                    date: faker.date.recent(),
                    type: 'EXPENSE',
                    user_id: user.id,
                },
                {
                    name: faker.string.sample(),
                    amount: 1000,
                    date: faker.date.recent(),
                    type: 'EXPENSE',
                    user_id: user.id,
                },
                {
                    name: faker.string.sample(),
                    amount: 3000,
                    date: faker.date.recent(),
                    type: 'INVESTMENT',
                    user_id: user.id,
                },
                {
                    name: faker.string.sample(),
                    amount: 3000,
                    date: faker.date.recent(),
                    type: 'INVESTMENT',
                    user_id: user.id,
                },
            ],
        })

        //act
        const sut = new PostgresGetUserBalanceRepository()
        const result = await sut.execute(user.id)

        //assert
        expect(result.earnings.toString()).toBe('10000')
        expect(result.expenses.toString()).toBe('2000')
        expect(result.investments.toString()).toBe('6000')
        expect(result.balance.toString()).toBe('2000')
    })

    it('should call Prisma with correct params', async () => {
        //arrange
        const sut = new PostgresGetUserBalanceRepository()
        const prismaSpy = jest.spyOn(prisma.transaction, 'aggregate')

        //act
        await sut.execute(fakeUser.id)

        //assert
        expect(prismaSpy).toHaveBeenCalledTimes(3)
        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                user_id: fakeUser.id,
                type: TransactionType.EXPENSE,
            },
            _sum: {
                amount: true,
            },
        })
        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                user_id: fakeUser.id,
                type: TransactionType.EARNING,
            },
            _sum: {
                amount: true,
            },
        })
        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                user_id: fakeUser.id,
                type: TransactionType.INVESTMENT,
            },
            _sum: {
                amount: true,
            },
        })
    })

    it('should throw if Prisma throws', async () => {
        //arrange
        const sut = new PostgresGetUserBalanceRepository()
        jest.spyOn(prisma.transaction, 'aggregate').mockRejectedValueOnce(
            new Error(),
        )

        //act
        const promise = sut.execute(fakeUser.id)

        //assert
        await expect(promise).rejects.toThrow()
    })
})
