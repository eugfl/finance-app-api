import { UserNotFoundError } from '../../errors/user'
import { GetTransactionsByUserIdController } from './get-transactions-by-user-id'
import { faker } from '@faker-js/faker'

describe('GetTransactionsByUserIdController', () => {
    class GetTransactionsByUserIdUseCaseStub {
        async execute() {
            return [
                {
                    user_id: faker.string.uuid(),
                    id: faker.string.uuid(),
                    name: faker.commerce.productName(),
                    date: faker.date.anytime().toISOString(),
                    type: 'EXPENSE',
                    amount: Number(faker.finance.amount()),
                },
            ]
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
})
