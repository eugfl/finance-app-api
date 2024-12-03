import { EmailAlreadyInUseError, UserNotFoundError } from '../../errors/user'
import { UpdateUserController } from './update-user'
import { faker } from '@faker-js/faker'
import { user } from '../../tests/index.js'

describe('UpdateUserController', () => {
    class UpdateUserUseCaseStub {
        async execute() {
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

    it('should return 400 when an unallowed field is provided', async () => {
        //arrange
        const { sut } = makeSut()

        //act
        const response = await sut.execute({
            params: httpResquest.params,
            body: {
                ...httpResquest.body,
                unallowed_field: 'unallowed_value',
            },
        })

        //assert
        expect(response.statusCode).toBe(400)
    })

    it('should return 500 if UpdateUserUseCase throws with generic error', async () => {
        //arrange
        const { sut, updateUserUseCase } = makeSut()
        jest.spyOn(updateUserUseCase, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        //act
        const response = await sut.execute({
            params: httpResquest.params,
            body: httpResquest.body,
        })

        //assert
        expect(response.statusCode).toBe(500)
    })

    it('should return 400 if UpdateUserUseCase throws EmailAlreadyInUseError', async () => {
        //arrange
        const { sut, updateUserUseCase } = makeSut()
        jest.spyOn(updateUserUseCase, 'execute').mockRejectedValueOnce(
            new EmailAlreadyInUseError(faker.internet.email()),
        )

        //act
        const response = await sut.execute({
            params: httpResquest.params,
            body: httpResquest.body,
        })

        //assert
        expect(response.statusCode).toBe(400)
    })

    it('should call UpdateUserUseCase with correct params', async () => {
        //arrange
        const { sut, updateUserUseCase } = makeSut()
        const executeSpy = jest.spyOn(updateUserUseCase, 'execute')

        //act
        await sut.execute(httpResquest)

        //assert
        expect(executeSpy).toHaveBeenCalledWith(
            httpResquest.params.userId,
            httpResquest.body,
        )
    })

    it('should return 404 if UpdateUserUseCase throws UserNotFoundError', async () => {
        //arrange
        const { sut, updateUserUseCase } = makeSut()
        jest.spyOn(updateUserUseCase, 'execute').mockRejectedValueOnce(
            new UserNotFoundError(user),
        )

        //act
        const response = await sut.execute(httpResquest)
        //assert
        expect(response.statusCode).toBe(404)
    })

    it('should return 400 with invalidIdResponse structure for invalid id', async () => {
        // arrange
        const { sut } = makeSut()
        const validationHelpers = require('../helpers/validation.js')
        jest.spyOn(validationHelpers, 'checkIfIdIsValid').mockReturnValueOnce(
            false,
        )

        // act
        const response = await sut.execute(httpResquest)

        // assert
        expect(response.statusCode).toBe(400)
        expect(response.body).toHaveProperty('message')
    })
})
