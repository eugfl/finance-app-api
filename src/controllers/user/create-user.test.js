import { faker } from '@faker-js/faker'
import { CreateUserController } from './create-user'
import { EmailAlreadyInUseError } from '../../errors/user'

describe('Create User Controller', () => {
    class CreateUserUseCaseStub {
        execute(user) {
            return user
        }
    }

    const makeSut = () => {
        const createUserUseCase = new CreateUserUseCaseStub()
        const sut = new CreateUserController(createUserUseCase)

        return { createUserUseCase, sut }
    }

    it('should return 201 when creating a user successfully', async () => {
        // arange
        const { sut } = makeSut()

        const httpResquest = {
            body: {
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password({ length: 7 }),
            },
        }

        // act

        const result = await sut.execute(httpResquest)

        // assert
        expect(result.statusCode).toBe(201)
        expect(result.body).toBe(httpResquest.body)
    })

    it('should return 400 if first_name is not provided', async () => {
        // arange
        const { sut } = makeSut()

        const httpResquest = {
            body: {
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password({ length: 7 }),
            },
        }

        // act
        const result = await sut.execute(httpResquest)

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if last_name is not provided', async () => {
        // arange
        const { sut } = makeSut()

        const httpResquest = {
            body: {
                first_name: faker.person.firstName(),
                email: faker.internet.email(),
                password: faker.internet.password({ length: 7 }),
            },
        }

        // act
        const result = await sut.execute(httpResquest)

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if email is not provided', async () => {
        // arange
        const { sut } = makeSut()

        const httpResquest = {
            body: {
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                password: faker.internet.password({ length: 7 }),
            },
        }

        // act
        const result = await sut.execute(httpResquest)

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if email is not valid', async () => {
        // arange
        const { sut } = makeSut()

        const httpResquest = {
            body: {
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: 'invalid_email',
                password: faker.internet.password({ length: 7 }),
            },
        }

        // act

        const result = await sut.execute(httpResquest)

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if password is not provided', async () => {
        // arange
        const { sut } = makeSut()

        const httpResquest = {
            body: {
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
            },
        }

        // act
        const result = await sut.execute(httpResquest)

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if password is less than 6 characters', async () => {
        // arange
        const { sut } = makeSut()

        const httpResquest = {
            body: {
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password({ length: 5 }),
            },
        }

        // act

        const result = await sut.execute(httpResquest)

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should call CreateUserUseCase with correct params', async () => {
        // arrange
        const { createUserUseCase, sut } = makeSut()

        const httpResquest = {
            body: {
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password({ length: 7 }),
            },
        }

        const executeSpy = jest.spyOn(createUserUseCase, 'execute')

        // act
        await sut.execute(httpResquest)

        // assert
        expect(executeSpy).toHaveBeenCalledWith(httpResquest.body)
    })

    it('should return 500 if CreateUserUseCase throws', async () => {
        // arange
        const { createUserUseCase, sut } = makeSut()

        const httpResquest = {
            body: {
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password({ length: 7 }),
            },
        }
        jest.spyOn(createUserUseCase, 'execute').mockImplementationOnce(() => {
            throw new Error()
        })

        // act
        const result = await sut.execute(httpResquest)

        // assert
        expect(result.statusCode).toBe(500)
    })

    it('should return 500 if CreateUserUseCase throws EmailIsAlreadyInUseError', async () => {
        // arange
        const { createUserUseCase, sut } = makeSut()

        const httpResquest = {
            body: {
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password({ length: 7 }),
            },
        }
        jest.spyOn(createUserUseCase, 'execute').mockImplementationOnce(() => {
            throw new EmailAlreadyInUseError(httpResquest.body.email)
        })

        // act
        const result = await sut.execute(httpResquest)

        // assert
        expect(result.statusCode).toBe(400)
    })
})
