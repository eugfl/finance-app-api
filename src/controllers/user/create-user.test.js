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
})
