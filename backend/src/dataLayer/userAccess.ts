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
            Item: user,  
            ReturnValues: 'ALL_OLD'
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
        this.logger.info ("get user for: ", {'user':userId})
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

    async updateUser (user: User): Promise<void> {
        this.logger.info ('update points', user)


        const query = {
            TableName: this.userTable, 
            Key: { userId: user.userId} ,
            UpdateExpression: 
                'set pointsTotal = :v_points',
            ExpressionAttributeValues: {
                ':v_points': user.pointsTotal
            },
            ReturnValues: 'UPDATED_NEW'
        }

        try {
            await this.docClient.update (query).promise()
            return
        }
        catch (err) {
            this.logger.info ('update err: ', user)
            throw (err)
            return
        }

    }


    async updateUserURL (user: User): Promise<void> {
        this.logger.info ('update URL', user)


        const query = {
            TableName: this.userTable, 
            Key: { userId: user.userId} ,
            UpdateExpression: 
                'set avatarUrl = :v_URL',
            ExpressionAttributeValues: {
                ':v_URL': user.avatarUrl
            },
            ReturnValues: 'UPDATED_NEW'
        }

        try {
            await this.docClient.update (query).promise()
            return
        }
        catch (err) {
            this.logger.info ('update err: ', user)
            throw (err)
            return
        }
    }

    async deleteUser (userId: string): Promise <void> {
        this.logger.info ('delete user')
        const query = {
            TableName: process.env.USER_TABLE,
            Key  : { userId: userId }
        }

        try {
            await this.docClient.delete (query).promise()
        }
        catch (err) {
            throw (err)
        }
    }
}

function createDynamoDBClient(logger) {
    if (process.env.IS_OFFLINE) {
      logger.info ('Creating a local DynamoDB instance: ', 
        {'url': process.env.DB_OFFLINE_URL})
        // return new XAWS.DynamoDB.DocumentClient({
        return new DocumentClient({
        region: 'localhost',
        endpoint: process.env.DB_OFFLINE_URL
        //endpoint: 'http://localhost:8000'
      })
    }
    const XAWS = AWSXRay.captureAWS(AWS)
    return new XAWS.DynamoDB.DocumentClient()
}