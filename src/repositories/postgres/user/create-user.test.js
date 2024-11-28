import { user } from '../../../tests/index.js'
import { PostgresCreateUserRepository } from './create-user'

describe('CreateUserRepository', () => {
    it('should create a user on db', async () => {
        //arrange
        const sut = new PostgresCreateUserRepository()

        //act
        const result = sut.execute(user)

        //assert
        expect(result).not.toBeNull()
    })
})
