import validator from 'validator'
import { IdGeneratorAdapter } from './id-generator'

describe('IdGeneratorAdapter', () => {
    it('should return a random id', async () => {
        //arrange
        const sut = new IdGeneratorAdapter()

        //act
        const result = await sut.execute()

        //assert
        expect(result).toBeTruthy()
        expect(typeof result).toBe('string')
        expect(validator.isUUID(result)).toBe(true)
    })
})
