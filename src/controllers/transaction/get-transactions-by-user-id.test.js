import { UserNotFoundError } from '../../errors/user'
import { GetTransactionsByUserIdController } from './get-transactions-by-user-id'
import { faker } from '@faker-js/faker'
import { transaction } from '../../tests'

describe('GetTransactionsByUserIdController', () => {
    class GetTransactionsByUserIdUseCaseStub {
        async execute() {
            return [transaction]
        }
    }

    const makeSut = () => {
        const getTransactionsByUserIdUseCase =
            new GetTransactionsByUserIdUseCaseStub()
        const sut = new GetTransactionsByUserIdController(
            getTransactionsByUserIdUseCase,
        )

        return { getTransactionsByUserIdUseCase, sut }
    }

    it('should return 200 when finding transaction by user id successfully', async () => {
        //arrange
        const { sut } = makeSut()

        //act
        const result = await sut.execute({
            query: { userId: faker.string.uuid() },
        })

        //assert
        expect(result.statusCode).toBe(200)
    })

    it('should return 400 when missing userId param', async () => {
        //arrange
        const { sut } = makeSut()

        //act
        const result = await sut.execute({
            query: { userId: undefined },
        })

        //assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when missing userId param is invalid', async () => {
        //arrange
        const { sut } = makeSut()

        //act
        const result = await sut.execute({
            query: { userId: 'invalid_user_id' },
        })

        //assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 404 when user is not found', async () => {
        //arrange
        const { sut, getTransactionsByUserIdUseCase } = makeSut()
        jest.spyOn(
            getTransactionsByUserIdUseCase,
            'execute',
        ).mockRejectedValueOnce(new UserNotFoundError())

        //act
        const result = await sut.execute({
            query: { userId: faker.string.uuid() },
        })

        //assert
        expect(result.statusCode).toBe(404)
    })

    it('should return 500 when GetTransactionByUserIdUseCase throws generic error', async () => {
        //arrange
        const { sut, getTransactionsByUserIdUseCase } = makeSut()
        jest.spyOn(
            getTransactionsByUserIdUseCase,
            'execute',
        ).mockRejectedValueOnce(new Error())

        //act
        const result = await sut.execute({
            query: { userId: faker.string.uuid() },
        })

        //assert
        expect(result.statusCode).toBe(500)
    })

    it('should call GetTransactionByUserIdUseCase with correct params', async () => {
        //arrange
        const { sut, getTransactionsByUserIdUseCase } = makeSut()
        const executeSpy = jest.spyOn(getTransactionsByUserIdUseCase, 'execute')

        const userId = faker.string.uuid()
        //act
        await sut.execute({
            query: { userId: userId },
        })

        //assert
        expect(executeSpy).toHaveBeenCalledWith(userId)
    })
})
