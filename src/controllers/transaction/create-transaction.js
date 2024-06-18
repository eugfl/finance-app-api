import { createTransactionSchema } from '../../schemas/index.js'
import { created, serverError, badRequest } from '../helpers/index.js'
import { ZodError } from 'zod'

export class CreateTransactionController {
    constructor(createTransactionUseCase) {
        this.createTransactionUseCase = createTransactionUseCase
    }

    async execute(httpResquest) {
        try {
            const params = httpResquest.body

            await createTransactionSchema.parseAsync(params)

            const transaction =
                await this.createTransactionUseCase.execute(params)

            return created(transaction)
        } catch (error) {
            if (error instanceof ZodError) {
                return badRequest({
                    message: error.errors[0].message,
                })
            }

            console.error(error)
            return serverError()
        }
    }
}
