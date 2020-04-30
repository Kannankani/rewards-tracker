import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'



import { User } from './dataModel/user'
import { createLogger } from '../utils/logger'


export class UserAccess {
    constructor (
        private readonly logger = createLogger('UserDataAccess'),
        private readonly userTable = process.env.USER_TABLE,
        private readonly docClient: DocumentClient = createDynamoDBClient(logger)
    ) {}

    async createUser (user: User): Promise <User> {
        this.logger.info ('create user: ', user)

        const query = {
            TableName: this.userTable,
            Item: user
        }

        try {
            await this.docClient.put(query).promise()
        }
        catch (err) {
            throw (err)
            return
        }
        return user
    }

    async getAllUsers (): Promise <User []> {
        this.logger.info ("getting all users")
        const query = {
            TableName: this.userTable
        }

        try {
            const users = await this.docClient.scan (query).promise()
            return users.Items as User[]
        }
        catch (err) {
            throw (err)
            return
        }
    }

    async getUser (userId: string): Promise <User> {
        this.logger.info ("get user", userId)
        const query = {
            TableName: this.userTable,
            Key: {
                "userId" : userId
            }
        }

        try {
            const user = await this.docClient.get (query).promise()
            return user.Item as User
        }
        catch (err) {
            throw (err)
            return
        }
    }
}

function createDynamoDBClient(logger) {
    if (process.env.IS_OFFLINE) {
      logger.info ('Creating a local DynamoDB instance')
        // return new XAWS.DynamoDB.DocumentClient({
        return new DocumentClient({
        region: 'localhost',
        endpoint: 'http://localhost:8000'
      })
    }
    const XAWS = AWSXRay.captureAWS(AWS)
    return new XAWS.DynamoDB.DocumentClient()
}