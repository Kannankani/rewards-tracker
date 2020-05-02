import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { createLogger } from '../../utils/logger';
import { UserAccess } from '../../dataLayer/userAccess';
import { ret_ok, ret_err_msg, award_bonus} from '../lamdaUtils';
import { User } from '../../dataLayer/dataModel/user';
import { RedeemAccess } from '../../dataLayer/redeemAccess';



export const GiveRewards: APIGatewayProxyHandler = async ({}, _context) => {

    const logger = createLogger('giveRewards')
    const userDA = new UserAccess()
    const redeemDA = new RedeemAccess()
    var users:User[]
    const loyatyPoints = 10
    const maxPoints = 250
    
    logger.info ('giving rewards')

    try {
       users = await userDA.getAllUsers ()
    }
    catch (err) {
      logger.info ('get users error:', err)
      return ret_err_msg (500, 'get users error')
    }

    for (var user of users) {
        const oldPoints = user.pointsTotal
        user.pointsTotal += loyatyPoints
        if (user.pointsTotal >= maxPoints) 
            user.pointsTotal = maxPoints
        if (user.pointsTotal != oldPoints) {
            try {
                await userDA.updateUser (user)
            }
            catch (err) {
                logger.info ('bonus update error for user', user.userId)
            }
            try {
                award_bonus (user, 'Loyalty bonus', loyatyPoints, redeemDA)
            }
            catch (err) {
                logger.info ('award entry error for ', user.userId)
            }
        }

    }
    ret_ok (200)
    
}
