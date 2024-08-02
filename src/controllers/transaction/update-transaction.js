import { updateTransactionSchema } from '../../schemas/index.js'
import {
    serverError,
    badRequest,
    ok,
    checkIfIdIsValid,
    invalidIdResponse,
} from '../helpers/index.js'
import { ZodError } from 'zod'

export class UpdateTransactionController {
    constructor(UpdateTransactionUseCase) {
        this.UpdateTransactionUseCase = UpdateTransactionUseCase
    }
    async execute(httpRequest) {
        try {
            const idIsValid = checkIfIdIsValid(httpRequest.params.transactionId)

            if (!idIsValid) {
                return invalidIdResponse()
            }

            const params = httpRequest.body

            await updateTransactionSchema.parseAsync(params)

            const transaction = await this.UpdateTransactionUseCase.execute(
                httpRequest.params.transactionId,
                params,
            )

            return ok(transaction)
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
