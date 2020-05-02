import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { RedeemAccess } from '../../dataLayer/redeemAccess';
import { createLogger } from '../../utils/logger';
import { UserAccess } from '../../dataLayer/userAccess';
import { User } from '../../dataLayer/dataModel/user';
import { Redeem } from '../../dataLayer/dataModel/redeem'
import { ret_err_msg, ret_ok, getUserId } from '../lamdaUtils';



export const RedeemRewards: APIGatewayProxyHandler = async (event, _context) => {
    console.log ('host: ', event.headers.Host)
    const redeemDA = new RedeemAccess()
    const userDA = new UserAccess()
    const logger = createLogger ("RedeemRewards")
    const userId = getUserId (event)
    const req = JSON.parse(event.body)
    const redeem = <Redeem> {
        userId: userId, 
        createdAt: new Date().toISOString(),
        description: req.description,
        points: req.points
    }


    var user:User

    logger.info ('post user ', {'user':userId})

    try {
        user = await userDA.getUser (userId)
    }
    catch (err) {
        logger.info ('unable to get user: ', err)
        return ret_err_msg (500,'unable to read user data')
    } 

    if (user.pointsTotal < redeem.points) {
        logger.info ('not enough points', 
            {available: user.pointsTotal,
             Requested: redeem.points})
        return ret_err_msg (500,'not enough points to redeem')
    }

    user.pointsTotal -= redeem.points

    try {
        await userDA.updateUser (user)
    }
    catch (err) {
        logger.info ('redeem user update error', err)
        return ret_err_msg (500, 'redeem error: user update')
    }

    try {
        await redeemDA.createRedeem (redeem)
        return ret_ok (200, 'user',user)
    }
    catch (err) {
        logger.info ('redeem error, after user update', err)
        return ret_err_msg (500, 'redeem error: point update')
        
    }
}


