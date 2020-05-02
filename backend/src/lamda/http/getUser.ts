import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { createLogger } from '../../utils/logger';
import { UserAccess } from '../../dataLayer/userAccess';
import { ret_ok, ret_err_msg, getUserId } from '../lamdaUtils';



export const getUser: APIGatewayProxyHandler = async (event, _context) => {
    // temp code remove
    console.log (event.headers.Host)
    const logger = createLogger('GetUser')
    const userDA = new UserAccess()

    const userId = getUserId (event)

    
    logger.info ('getuser', {'user' : userId})

    try {
      const user = await userDA.getUser (userId)
      return ret_ok (200, 'user', user)      
    }
    catch (err) {
      logger.info ('get user error:', err)
      return ret_err_msg (500, 'unable to get user')
    }
}
