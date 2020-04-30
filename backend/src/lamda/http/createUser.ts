import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { createLogger } from '../../utils/logger';
import { User } from '../../dataLayer/dataModel/user';
import * as uuid from 'uuid'
import { UserAccess } from '../../dataLayer/userAccess';



export const createUser: APIGatewayProxyHandler = async (event, _context) => {
    // temp code remove
    console.log (event)
    const logger = createLogger('UserDataAccess')
    var user = <User>{}
    const userDA = new UserAccess()
    
    logger.info ('creating user')

    user.userId = uuid.v4()
    user.createdAt = new Date().toISOString()
    user.rewardsTotal = 0

    try {
      userDA.createUser (user)
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify ({
          user
        })
      }
      
    }
    catch (err) {
      logger.info ('create user error:', err)
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
          err: 'unable to create user'
        })
      }
    }
}
