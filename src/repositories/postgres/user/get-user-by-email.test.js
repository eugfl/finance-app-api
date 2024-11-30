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
})
