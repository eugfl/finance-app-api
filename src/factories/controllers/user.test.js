import {
    CreateUserController,
    GetUserByIdController,
} from '../../controllers/index.js'
import { makeCreateUserController, makeGetUserByIdController } from './user.js'

describe('UserControllerFactories', () => {
    it('should return a valid GetUserByIdController instance', () => {
        expect(makeGetUserByIdController()).toBeInstanceOf(
            GetUserByIdController,
        )
    })

    it('should return a valid CreateUserController instance', () => {
        expect(makeCreateUserController()).toBeInstanceOf(CreateUserController)
    })
})
