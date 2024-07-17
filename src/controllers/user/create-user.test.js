import { CreateUserController } from './create-user'

describe('Create User Controller', () => {
    class CreateUserUseCaseStub {
        execute(user) {
            return user
        }
    }

    it('should return 201 when creating a user successfully', async () => {
        // arange
        const createUserUseCase = new CreateUserUseCaseStub()
        const createUserController = new CreateUserController(createUserUseCase)

        const httpResquest = {
            body: {
                first_name: 'Gabriel',
                last_name: 'Figueiredo',
                email: 'eugfl@gmail.com',
                password: '123456',
            },
        }

        // act

        const result = await createUserController.execute(httpResquest)

        // assert
        expect(result.statusCode).toBe(201)
        expect(result.body).toBe(httpResquest.body)
    })

    it('should return 400 if first_name is not provided', async () => {
        // arange
        const createUserUseCase = new CreateUserUseCaseStub()
        const createUserController = new CreateUserController(createUserUseCase)

        const httpResquest = {
            body: {
                last_name: 'Figueiredo',
                email: 'eugfl@gmail.com',
                password: '123456',
            },
        }

        // act
        const result = await createUserController.execute(httpResquest)

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if last_name is not provided', async () => {
        // arange
        const createUserUseCase = new CreateUserUseCaseStub()
        const createUserController = new CreateUserController(createUserUseCase)

        const httpResquest = {
            body: {
                first_name: 'Gabriel',
                email: 'eugfl@gmail.com',
                password: '123456',
            },
        }

        // act
        const result = await createUserController.execute(httpResquest)

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if email is not provided', async () => {
        // arange
        const createUserUseCase = new CreateUserUseCaseStub()
        const createUserController = new CreateUserController(createUserUseCase)

        const httpResquest = {
            body: {
                first_name: 'Gabriel',
                last_name: 'Figueiredo',
                password: '123456',
            },
        }

        // act
        const result = await createUserController.execute(httpResquest)

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if email is not valid', async () => {
        // arange
        const createUserUseCase = new CreateUserUseCaseStub()
        const createUserController = new CreateUserController(createUserUseCase)

        const httpResquest = {
            body: {
                first_name: 'Gabriel',
                last_name: 'Figueiredo',
                email: 'eugfl',
                password: '123456',
            },
        }

        // act

        const result = await createUserController.execute(httpResquest)

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if password is not provided', async () => {
        // arange
        const createUserUseCase = new CreateUserUseCaseStub()
        const createUserController = new CreateUserController(createUserUseCase)

        const httpResquest = {
            body: {
                first_name: 'Gabriel',
                last_name: 'Figueiredo',
                email: 'eugfl@gmail.com',
            },
        }

        // act
        const result = await createUserController.execute(httpResquest)

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if password is less than 6 characters', async () => {
        // arange
        const createUserUseCase = new CreateUserUseCaseStub()
        const createUserController = new CreateUserController(createUserUseCase)

        const httpResquest = {
            body: {
                first_name: 'Gabriel',
                last_name: 'Figueiredo',
                email: 'eugfl@hotmail.com',
                password: '123',
            },
        }

        // act

        const result = await createUserController.execute(httpResquest)

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should call CreateUserUseCase with correct params', async () => {
        // arrange
        const createUserUseCase = new CreateUserUseCaseStub()
        const createUserController = new CreateUserController(createUserUseCase)

        const httpResquest = {
            body: {
                first_name: 'Gabriel',
                last_name: 'Figueiredo',
                email: 'eugfl@hotmail.com',
                password: '123456',
            },
        }

        const executeSpy = jest.spyOn(createUserUseCase, 'execute')

        // act
        await createUserController.execute(httpResquest)

        // assert
        expect(executeSpy).toHaveBeenCalledWith(httpResquest.body)
    })
})
