import { UpdateUserController } from './update-user'
import { faker } from '@faker-js/faker'

describe('UpdateUserController', () => {
    class UpdateUserUseCaseStub {
        async execute(user) {
            return user
        }
    }

    const makeSut = () => {
        const updateUserUseCase = new UpdateUserUseCaseStub()
        const sut = new UpdateUserController(updateUserUseCase)

        return { updateUserUseCase, sut }
    }

    const httpResquest = {
        params: { userId: faker.string.uuid() },
        body: {
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password({ length: 7 }),
        },
    }

    it('should return 200 when updating a user successfully', async () => {
        //arrange
        const { sut } = makeSut()

        //act
        const response = await sut.execute(httpResquest)

        //assert
        expect(response.statusCode).toBe(200)
    })

    it('should return 400 when invalid email is provided', async () => {
        //arrange
        const { sut } = makeSut()

        //act
        const response = await sut.execute({
            params: httpResquest.params,
            body: {
                ...httpResquest.body,
                email: 'invalid_email',
            },
        })

        //assert
        expect(response.statusCode).toBe(400)
    })

    it('should return 400 when invalid passsword is provided', async () => {
        //arrange
        const { sut } = makeSut()

        //act
        const response = await sut.execute({
            params: httpResquest.params,
            body: {
                ...httpResquest.body,
                password: faker.internet.password({ length: 5 }),
            },
        })

        //assert
        expect(response.statusCode).toBe(400)
    })

    it('should return 400 when invalid id is provided', async () => {
        //arrange
        const { sut } = makeSut()

        //act
        const response = await sut.execute({
            params: httpResquest.params,
            body: {
                ...httpResquest.body,
                userId: 'invalid_id',
            },
        })

        //assert
        expect(response.statusCode).toBe(400)
    })
})
