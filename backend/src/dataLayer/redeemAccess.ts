import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'


import { createLogger } from '../utils/logger'
import { Redeem } from './dataModel/redeem'
import { User } from './dataModel/user'


export class RedeemAccess {
    constructor (
        private readonly logger = createLogger('RedeemDataAccess'),
        private readonly redeemTable = process.env.REDEEM_TABLE,
        private readonly docClient: DocumentClient = createDynamoDBClient(logger)
    ) {}

    async createRedeem (redeem: Redeem): Promise <Redeem> {
        this.logger.info ('create redeem: ', redeem)

        const query = {
            TableName: this.redeemTable,
            Item: redeem
        }

        try {
            await this.docClient.put(query).promise()
        }
        catch (err) {
            throw (err)
            return
        }
        return redeem
    }

    async getRedeem4User (userId: string): Promise < Redeem[]> {
        this.logger.info ("getting txns for: ", userId)
        const query = {
            TableName: this.redeemTable, 
            KeyConditionExpression: "userId = :v_userId",
            ExpressionAttributeValues: {
                ":v_userId": userId
            },
            ScanIndexForward : false
        }

        try {
            const redeem = await this.docClient.query (query).promise()
            return redeem.Items as Redeem[]
        }
        catch (err) {
            throw (err)
            return
        }
    }

    async getAllRedeem (): Promise < Redeem[]> {
        this.logger.info ("getting all txns ")
        const query = {
            TableName: this.redeemTable
        }

        try {
            const redeem = await this.docClient.scan (query).promise()
            return redeem.Items as Redeem[]
        }
        catch (err) {
            throw (err)
            return
        }
    }

    async deleteRedeems (user: User): Promise <void> {
        this.logger.info ('delete redeem')

        try {
            const redeems = this.getRedeem4User (user.userId)
            if (redeems != undefined) {
                (await redeems).forEach (this.deleteRedeem, this)
            }
        }
        catch (err) { throw (err) }
    }

    async deleteRedeem (redeem: Redeem): Promise <void> {
        const query = {
            TableName: this.redeemTable,
            Key: { 
                userId: redeem.userId,
                createdAt: redeem.createdAt
            }
        }
        await this.docClient.delete (query). promise()
    }

}

function createDynamoDBClient(logger) {
    if (process.env.IS_OFFLINE) {
      logger.info ('Creating a local DynamoDB instance')
        // return new XAWS.DynamoDB.DocumentClient({
        return new DocumentClient({
        region: 'localhost',
        endpoint: process.env.DB_OFFLINE_URL
      })
    }
    logger.info ('creating aws xray db instance')
    const XAWS = AWSXRay.captureAWS(AWS)
    return new XAWS.DynamoDB.DocumentClient()
}