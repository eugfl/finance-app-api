import { prisma } from '../../../../prisma/prisma'
import { PostgresGetUserByEmailRepository } from './get-user-by-email'
import { user as fakeUser } from '../../../tests'

describe('GetUserByEmailRepository', () => {
    it('should get user by email on db', async () => {
        //arrange
        const user = await prisma.user.create({ data: fakeUser })
        const sut = new PostgresGetUserByEmailRepository()

        //act
        const result = await sut.execute(user.email)

        //assert
        expect(result).toStrictEqual(user)
    })

    it('should call Prisma with correct params', async () => {
        //arrange
        const sut = new PostgresGetUserByEmailRepository()
        const prismaSpy = jest.spyOn(prisma.user, 'findUnique')

        //act
        await sut.execute(fakeUser.email)

        //assert
        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                email: fakeUser.email,
            },
        })
    })

    it('should throw if Prisma throws', async () => {
        //arrange
        const sut = new PostgresGetUserByEmailRepository()
        jest.spyOn(prisma.user, 'findUnique').mockRejectedValueOnce(new Error())

        //act
        const promise = sut.execute(fakeUser.email)

        //assert
        await expect(promise).rejects.toThrow()
    })
})
