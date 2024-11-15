import { faker } from '@faker-js/faker'
import { CreateUserController } from './create-user'
import { EmailAlreadyInUseError } from '../../errors/user'
import { user } from '../../tests'

describe('Create User Controller', () => {
    class CreateUserUseCaseStub {
        async execute() {
            return user
        }
    }

    const makeSut = () => {
        const createUserUseCase = new CreateUserUseCaseStub()
        const sut = new CreateUserController(createUserUseCase)

        return { createUserUseCase, sut }
    }

    const httpResquest = {
        body: {
            ...user,
            id: undefined,
        },
    }

    it('should return 201 when creating a user successfully', async () => {
        // arange
        const { sut } = makeSut()

        // act
        const result = await sut.execute(httpResquest)

        // assert
        expect(result.statusCode).toBe(201)
        expect(result.body).toBe(user)
    })

    it('should return 400 if first_name is not provided', async () => {
        // arange
        const { sut } = makeSut()

        // act
        const result = await sut.execute({
            body: {
                ...httpResquest.body,
                first_name: undefined,
            },
        })

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if last_name is not provided', async () => {
        // arange
        const { sut } = makeSut()

        // act
        const result = await sut.execute({
            body: {
                ...httpResquest.body,
                last_name: undefined,
            },
        })

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if email is not provided', async () => {
        // arange
        const { sut } = makeSut()

        // act
        const result = await sut.execute({
            body: {
                ...httpResquest.body,
                email: undefined,
            },
        })

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if email is not valid', async () => {
        // arange
        const { sut } = makeSut()

        // act

        const result = await sut.execute({
            body: {
                ...httpResquest.body,
                email: 'invalid_email',
            },
        })

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if password is not provided', async () => {
        // arange
        const { sut } = makeSut()

        // act
        const result = await sut.execute({
            body: {
                ...httpResquest.body,
                password: undefined,
            },
        })

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if password is less than 6 characters', async () => {
        // arange
        const { sut } = makeSut()

        // act
        const result = await sut.execute({
            body: {
                ...httpResquest.body,
                password: faker.internet.password({ length: 5 }),
            },
        })

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should call CreateUserUseCase with correct params', async () => {
        // arrange
        const { createUserUseCase, sut } = makeSut()
        const executeSpy = jest.spyOn(createUserUseCase, 'execute')

        // act
        await sut.execute(httpResquest)

        // assert
        expect(executeSpy).toHaveBeenCalledWith(httpResquest.body)
    })

    it('should return 500 if CreateUserUseCase throws', async () => {
        // arange
        const { createUserUseCase, sut } = makeSut()
        jest.spyOn(createUserUseCase, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        // act
        const result = await sut.execute(httpResquest)

        // assert
        expect(result.statusCode).toBe(500)
    })

    it('should return 500 if CreateUserUseCase throws EmailIsAlreadyInUseError', async () => {
        // arange
        const { createUserUseCase, sut } = makeSut()
        jest.spyOn(createUserUseCase, 'execute').mockRejectedValueOnce(
            new EmailAlreadyInUseError(httpResquest.body.email),
        )

        // act
        const result = await sut.execute(httpResquest)

        // assert
        expect(result.statusCode).toBe(400)
    })
})
