import { CreateTransactionController } from './create-transaction'
import { transaction } from '../../tests'

describe('CreateTransactionController', () => {
    class CreateTransactionUseCaseStub {
        async execute() {
            return transaction
        }
    }

    const makeSut = () => {
        const createTransactionUseCase = new CreateTransactionUseCaseStub()
        const sut = new CreateTransactionController(createTransactionUseCase)

        return { createTransactionUseCase, sut }
    }

    const baseHttpRequest = {
        body: {
            ...transaction,
            id: undefined,
        },
    }

    it('should return 201 when creating transaction successfully (expense)', async () => {
        //arrange
        const { sut } = makeSut()

        //act
        const result = await sut.execute(baseHttpRequest)

        //assert
        expect(result.statusCode).toBe(201)
    })

    it('should return 201 when creating transaction successfully (earning)', async () => {
        //arrange
        const { sut } = makeSut()

        //act
        const result = await sut.execute({
            body: {
                ...baseHttpRequest.body,
                type: 'EARNING',
            },
        })

        //assert
        expect(result.statusCode).toBe(201)
    })

    it('should return 201 when creating transaction successfully (investment)', async () => {
        //arrange
        const { sut } = makeSut()

        //act
        const result = await sut.execute({
            body: {
                ...baseHttpRequest.body,
                type: 'INVESTMENT',
            },
        })

        //assert
        expect(result.statusCode).toBe(201)
    })

    it('should return 400 when missing user_id', async () => {
        //arrange
        const { sut } = makeSut()

        //act
        const result = await sut.execute({
            body: {
                ...baseHttpRequest.body,
                user_id: undefined,
            },
        })

        //assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when missing name', async () => {
        //arrange
        const { sut } = makeSut()

        //act
        const result = await sut.execute({
            body: {
                ...baseHttpRequest.body,
                name: undefined,
            },
        })

        //assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when missing date', async () => {
        //arrange
        const { sut } = makeSut()

        //act
        const result = await sut.execute({
            body: {
                ...baseHttpRequest.body,
                date: undefined,
            },
        })

        //assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when missing type', async () => {
        //arrange
        const { sut } = makeSut()

        //act
        const result = await sut.execute({
            body: {
                ...baseHttpRequest.body,
                type: undefined,
            },
        })

        //assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when missing amount', async () => {
        //arrange
        const { sut } = makeSut()

        //act
        const result = await sut.execute({
            body: {
                ...baseHttpRequest.body,
                amount: undefined,
            },
        })

        //assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when date is invalid', async () => {
        //arrange
        const { sut } = makeSut()

        //act
        const result = await sut.execute({
            body: {
                ...baseHttpRequest.body,
                date: 'invalid_date',
            },
        })

        //assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when type is not EXPENSE, EARNING or INVESTMENT', async () => {
        //arrange
        const { sut } = makeSut()

        //act
        const result = await sut.execute({
            body: {
                ...baseHttpRequest.body,
                type: 'invalid_type',
            },
        })

        //assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when amount is not a valid currency', async () => {
        //arrange
        const { sut } = makeSut()

        //act
        const result = await sut.execute({
            body: {
                ...baseHttpRequest.body,
                amount: 'invalid_amount',
            },
        })

        //assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 500 when CreateTransactionUseCase throws', async () => {
        //arrange
        const { sut, createTransactionUseCase } = makeSut()
        jest.spyOn(createTransactionUseCase, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        //act
        const result = await sut.execute(baseHttpRequest)

        //assert
        expect(result.statusCode).toBe(500)
    })

    it('should call CreateTransactionUseCase with correct params', async () => {
        //arrange
        const { sut, createTransactionUseCase } = makeSut()
        const executeSpy = jest.spyOn(createTransactionUseCase, 'execute')

        //act
        await sut.execute(baseHttpRequest)

        //assert
        expect(executeSpy).toHaveBeenCalledWith(baseHttpRequest.body)
    })
})
