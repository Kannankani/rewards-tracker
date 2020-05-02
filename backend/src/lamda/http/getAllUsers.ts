import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { createLogger } from '../../utils/logger';
import { UserAccess } from '../../dataLayer/userAccess';
import { ret_ok, ret_err_msg } from '../lamdaUtils';



export const getAllUsers: APIGatewayProxyHandler = async (event, _context) => {
    // temp code remove
    console.log ('host: ', event.headers.Host)
    const logger = createLogger('getAllUsers')
    const userDA = new UserAccess()
    
    logger.info ('get All Users')

    try {
      const users = await userDA.getAllUsers ()
      return ret_ok (200, 'users', users)
    }
    catch (err) {
      logger.info ('get users error:', err)
      return ret_err_msg (500, 'get users error')
    }
}
