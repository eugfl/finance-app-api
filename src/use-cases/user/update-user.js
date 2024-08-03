import { EmailAlreadyInUseError } from '../../errors/user.js'

export class UpdateUserUseCase {
    constructor(
        updateUserRepository,
        getUserByEmailRepository,
        passwordHasherAdapter,
    ) {
        this.updateUserRepository = updateUserRepository
        this.getUserByEmailRepository = getUserByEmailRepository
        this.passwordHasherAdapter = passwordHasherAdapter
    }

    async execute(userId, updateUserParams) {
        if (updateUserParams.email) {
            const userWithProvidedEmail =
                await this.getUserByEmailRepository.execute(
                    updateUserParams.email,
                )

            if (userWithProvidedEmail && userWithProvidedEmail.id !== userId) {
                throw new EmailAlreadyInUseError(updateUserParams.email)
            }
        }

        const user = {
            ...updateUserParams,
        }

        if (updateUserParams.password) {
            const hashedPassword = await this.passwordHasherAdapter.execute(
                updateUserParams.password,
            )

            user.password = hashedPassword
        }

        const updatedUser = await this.updateUserRepository.execute(
            userId,
            user,
        )

        return updatedUser
    }
}
