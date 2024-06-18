import { badRequest } from './index.js'

export const checkIfAmountIsValid = (amount) => {
    if (typeof amount !== 'number') {
        return false
    }
}

export const checkIfTypeIsValid = (type) => {
    return ['EARNING', 'EXPENSE', 'INVESTMENT'].includes(type)
}

export const invalidAmountResponse = () => {
    return badRequest({
        message: 'The amount must be a valid currency',
    })
}

export const invalidTypeResponde = () => {
    return badRequest({
        message: 'The type must be EARNING, EXPENSE or INVESTMENT',
    })
}
