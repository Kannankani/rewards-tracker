import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { createLogger } from '../../utils/logger';
import { UserAccess } from '../../dataLayer/userAccess';



export const getAllUsers: APIGatewayProxyHandler = async (event, _context) => {
    // temp code remove
    console.log (event)
    const logger = createLogger('getAllUsers')
    const userDA = new UserAccess()
    
    logger.info ('get All Users')

    try {
      const users = userDA.getAllUsers ()
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
      logger.info ('get users error:', err)
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
