import { badRequest } from './http.js'

export const invalidPasswordResponse = () => {
    return badRequest({
        message: 'Password must be at least 6 characters',
    })
}

export const emailIsAlreadyInUseResponse = () => {
    return badRequest({
        message: 'Invalid e-mail. Please provide a valid one',
    })
}

export const userNotFoundResponse = () => {
    return badRequest({
        message: 'User not found',
    })
}
