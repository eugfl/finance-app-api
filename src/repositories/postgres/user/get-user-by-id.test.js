import { prisma } from '../../../../prisma/prisma'
import { PostgresGetUserByIdRepository } from './get-user-by-id'
import { user as fakeUser } from '../../../tests'

describe('PostgresGetUserByIdRepository', () => {
    it('should get user by id on db', async () => {
        //arrange
        const user = await prisma.user.create({ data: fakeUser })
        const sut = new PostgresGetUserByIdRepository()

        //act
        const result = await sut.execute(user.id)

        //assert
        expect(result).toStrictEqual(user)
    })
})
