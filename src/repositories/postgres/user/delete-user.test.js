import { prisma } from '../../../../prisma/prisma'
import { user } from '../../../tests'
import { PostgresDeleteUserRepository } from './delete-user'

describe('DeleteUserRepository', () => {
    it('should delete a user on db', async () => {
        await prisma.user.create({
            data: user,
        })

        //arrange
        const sut = new PostgresDeleteUserRepository()

        //act
        const result = await sut.execute(user.id)

        //assert
        expect(result).toStrictEqual(user)
    })

    it('should call Prisma with correct params', async () => {
        //arrange
        await prisma.user.create({ data: user })
        const sut = new PostgresDeleteUserRepository()
        const prismaSpy = jest.spyOn(prisma.user, 'delete')

        //act
        await sut.execute(user.id)

        //assert
        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                id: user.id,
            },
        })
    })

    it('should throw generic error if Prisma throws generic error', async () => {
        //arrange
        const sut = new PostgresDeleteUserRepository()
        jest.spyOn(prisma.user, 'delete').mockRejectedValueOnce(new Error())

        //act
        const promise = sut.execute(user.id)

        //assert
        await expect(promise).rejects.toThrow()
    })
})
