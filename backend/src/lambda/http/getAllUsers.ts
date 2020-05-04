import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { createLogger } from '../../utils/logger';
import { UserAccess } from '../../dataLayer/userAccess';
import { ret_ok, ret_err_msg, getUserId } from '../lamdaUtils';



export const getAllUsers: APIGatewayProxyHandler = async (event, _context) => {

    const logger = createLogger('getAllUsers')
    const userDA = new UserAccess()
    const userId = getUserId (event)
    
    logger.info ('get All Users for', {user: userId})

    try {
      const users = await userDA.getAllUsers ()
      return ret_ok (200, 'users', users)
    }
    catch (err) {
      logger.info ('get users error:', err)
      return ret_err_msg (500, 'get users error')
    }
}
