import { faker } from '@faker-js/faker'
import { prisma } from '../../../../prisma/prisma'
import { user as fakeUser } from '../../../tests'
import { PostgresUpdateUserRepository } from './update-user'

describe('PostgresUpdateUserRepository', () => {
    const updateUserParams = {
        id: faker.string.uuid(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
    }

    it('', async () => {
        //arrange
        const user = await prisma.user.create({ data: fakeUser })
        const sut = new PostgresUpdateUserRepository()

        //act
        const result = await sut.execute(user.id, updateUserParams)

        //assert
        expect(result).toStrictEqual(updateUserParams)
    })

    it('should call Prisma with correct params', async () => {
        //arrange
        const user = await prisma.user.create({ data: fakeUser })
        const sut = new PostgresUpdateUserRepository()
        const prismaSpy = jest.spyOn(prisma.user, 'update')

        //act
        await sut.execute(user.id, updateUserParams)

        //assert
        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                id: user.id,
            },
            data: updateUserParams,
        })
    })

    it('should throw if Prisma throws', async () => {
        //arrange
        const sut = new PostgresUpdateUserRepository()
        jest.spyOn(prisma.user, 'update').mockRejectedValueOnce(new Error())

        //act
        const promise = sut.execute(updateUserParams)

        //assert
        await expect(promise).rejects.toThrow()
    })
})
