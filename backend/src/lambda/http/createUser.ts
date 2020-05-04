import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { createLogger } from '../../utils/logger';
import { User } from '../../dataLayer/dataModel/user';
// import * as uuid from 'uuid'
import { UserAccess } from '../../dataLayer/userAccess';

import { getUserId, ret_err_msg, ret_ok, createUserHelper } from '../lamdaUtils';


export const createUser: APIGatewayProxyHandler = async (event, _context) => {

    const logger = createLogger('Create User')
    var userId = getUserId (event)
    var user:User
    const userDA = new UserAccess()
    
    logger.info ('creating user')

    try {
      user = createUserHelper (userId, userDA)
    }
    catch (err) {
      logger.info ('create user error:', err)
      return ret_err_msg (500, 'unable to create user')
    }
    return ret_ok (201, 'user', user)
}

