import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { createLogger } from '../../utils/logger';
import { ret_ok, ret_err_msg, getUserId } from '../lamdaUtils';
import { RedeemAccess } from '../../dataLayer/redeemAccess';



export const GetRewards: APIGatewayProxyHandler = async (event, _context) => {

    console.log (event.headers.Host)
    const logger = createLogger('GetRewards')
    const redeemDA = new RedeemAccess ()

    const userId = getUserId (event)

    
    logger.info ('getRedeem', {'user' : userId})

    try {
      const redeems = await redeemDA.getRedeem4User (userId)
      return ret_ok (200, 'redeems', redeems)      
    }
    catch (err) {
      logger.info ('get redeem error:', err)
      return ret_err_msg (500, 'unable to get details')
    }
}
