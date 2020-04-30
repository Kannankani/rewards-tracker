import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { createLogger } from '../../utils/logger';
import { UserAccess } from '../../dataLayer/userAccess';



export const getUser: APIGatewayProxyHandler = async (event, _context) => {
    // temp code remove
    console.log (event)
    const logger = createLogger('UserDataAccess')
    const userDA = new UserAccess()
    const userId = event.pathParameters.userId
    
    logger.info ('getuser for', userId)

    try {
      const users = userDA.getUser (userId)
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify ({
          users
        })
      }
      
    }
    catch (err) {
      logger.info ('get user error:', err)
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
          err: 'unable to scan users'
        })
      }
    }
}
