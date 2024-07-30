import { DeleteTransactionController } from './delete-transaction'
import { faker } from '@faker-js/faker'

describe('DeleteTransactionController', () => {
    class DeleteTransactionUseCaseStub {
        async execute() {
            return {
                user_id: faker.string.uuid(),
                id: faker.string.uuid(),
                name: faker.commerce.productName(),
                date: faker.date.anytime().toISOString(),
                type: 'EXPENSE',
                amount: Number(faker.finance.amount()),
            }
        }
    }

    const makeSut = () => {
        const deleteTransactionUseCase = new DeleteTransactionUseCaseStub()
        const sut = new DeleteTransactionController(deleteTransactionUseCase)

        return { deleteTransactionUseCase, sut }
    }

    it('should return 200 when deleting a transaction successfully', async () => {
        //arrange
        const { sut } = makeSut()

        //act
        const result = await sut.execute({
            params: { transactionId: faker.string.uuid() },
        })

        //assert
        expect(result.statusCode).toBe(200)
    })
})
