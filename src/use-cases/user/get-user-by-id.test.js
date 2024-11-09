import { GetUserByIdUseCase } from './get-user-by-id'
import { faker } from '@faker-js/faker'

describe('GetUserByIdUseCase', () => {
    const user = {
        id: faker.string.uuid(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({
            lenght: 7,
        }),
    }

    class getUserByIdRepositoryStub {
        async execute() {
            return user
        }
    }
    const makeSut = () => {
        const getUserByIdRepository = new getUserByIdRepositoryStub()
        const sut = new GetUserByIdUseCase(getUserByIdRepository)

        return {
            sut,
            getUserByIdRepository,
        }
    }
    it('should get user by id successfully', async () => {
        //arrange
        const { sut } = makeSut()

        //act
        const result = await sut.execute(faker.string.uuid())

        //assert
        expect(result).toEqual(user)
    })
})
