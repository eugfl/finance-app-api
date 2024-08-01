import { UserNotFoundError } from '../../errors/user.js'
import {
    checkIfIdIsValid,
    invalidIdResponse,
    requiredFieldsMissingResponse,
    serverError,
    userNotFoundResponse,
    ok,
} from '../helpers/index.js'

export class GetTransactionsByUserIdController {
    constructor(getTrasanctionsByUserIdUseCase) {
        this.getTrasanctionsByUserIdUseCase = getTrasanctionsByUserIdUseCase
    }
    async execute(httpRequest) {
        try {
            const userId = httpRequest.query.userId

            if (!userId) {
                return requiredFieldsMissingResponse('userId')
            }

            const userIdIsValid = checkIfIdIsValid(userId)

            if (!userIdIsValid) {
                return invalidIdResponse()
            }

            const transactions =
                await this.getTrasanctionsByUserIdUseCase.execute(userId)

            return ok(transactions)
        } catch (error) {
            console.error(error)

            if (error instanceof UserNotFoundError) {
                return userNotFoundResponse()
            }

            return serverError()
        }
    }
}
