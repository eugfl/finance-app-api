import { prisma } from '../../../../prisma/prisma'
import { PostgresGetTransactionsByUserIdRepository } from './get-transactions-by-user-id'
import { user, transaction } from '../../../tests'
import dayjs from 'dayjs'

describe('GetTransactionByUserIdRepository', () => {
    it('should get transactions by user id on db', async () => {
        //arrange
        const sut = new PostgresGetTransactionsByUserIdRepository()
        await prisma.user.create({ data: user })
        await prisma.transaction.create({
            data: { ...transaction, user_id: user.id },
        })

        //act
        const result = await sut.execute(user.id)

        //assert
        expect(result.length).toBe(1)
        expect(result[0].name).toBe(transaction.name)
        expect(result[0].type).toBe(transaction.type)
        expect(result[0].user_id).toBe(user.id)
        expect(String(result[0].amount)).toBe(String(transaction.amount))
        expect(dayjs(result[0].date).daysInMonth()).toBe(
            dayjs(transaction.date).daysInMonth(),
        )
        expect(dayjs(result[0].date).month()).toBe(
            dayjs(transaction.date).month(),
        )
        expect(dayjs(result[0].date).year()).toBe(
            dayjs(transaction.date).year(),
        )
    })

    it('should call Prisma with correct params', async () => {
        //arrange
        const prismaSpy = jest.spyOn(prisma.transaction, 'findMany')
        const sut = new PostgresGetTransactionsByUserIdRepository()

        //act
        await sut.execute(user.id)

        //assert
        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                user_id: user.id,
            },
        })
    })
})
