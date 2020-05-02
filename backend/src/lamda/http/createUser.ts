import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { createLogger } from '../../utils/logger';
import { User } from '../../dataLayer/dataModel/user';
// import * as uuid from 'uuid'
import { UserAccess } from '../../dataLayer/userAccess';

import { RedeemAccess } from '../../dataLayer/redeemAccess';
import { Redeem } from '../../dataLayer/dataModel/redeem';
import { ret_err_msg, ret_ok, getUserId } from '../lamdaUtils';



export const createUser: APIGatewayProxyHandler = async (event, _context) => {
    // temp code remove
    console.log ('host: ', event.headers.Host)
    const logger = createLogger('Create User')
    var user = <User>{}
    const userDA = new UserAccess()
    
    logger.info ('creating user')

    user.userId = getUserId (event)
    // user.userId = uuid.v4()
    user.createdAt = new Date().toISOString()
    user.pointsTotal = 100
    user.avatarUrl = null

    try {
      await userDA.createUser (user)
    }
    catch (err) {
      logger.info ('create user error:', err)
      return ret_err_msg (500, 'unable to create user')
    }

    try {
      add_open_bonus (user)
    }

    catch (err) {
      logger.info ('sign in rewards error', err)
      return ret_err_msg (500, 'sign in bonus rewards error')
    }

    return ret_ok (201, 'user', user)
}

function add_open_bonus(user: User) {
  const redeemDA = new RedeemAccess()
  const redeem = <Redeem> {
    userId: user.userId,
    createdAt: new Date().toISOString(),
    description: 'Openig Bonus', 
    points: 100
  }
  try {
    redeemDA.createRedeem (redeem)
  }
  catch (err) {
    throw (err)
    return
  }
}
