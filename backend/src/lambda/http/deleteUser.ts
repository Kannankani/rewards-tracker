import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { createLogger } from '../../utils/logger';
import { User } from '../../dataLayer/dataModel/user';
// import * as uuid from 'uuid'
import { UserAccess } from '../../dataLayer/userAccess';

import { getUserId, ret_err_msg, ret_ok} from '../lamdaUtils';
import { RedeemAccess } from '../../dataLayer/redeemAccess';


export const DeleteUser: APIGatewayProxyHandler = async (event, _context) => {

    const logger = createLogger('Delete User')
    var user = <User>{}
    const userDA = new UserAccess()
    const redeemDA = new RedeemAccess()

    user.userId = getUserId (event)
    
    logger.info ('deleting user', {user: user.userId})

    try {
        user = await userDA.getUser (user.userId)
        if (user == undefined)
            return ret_err_msg (500, 'user not found')
        await userDA.deleteUser (user.userId)
        await redeemDA.deleteRedeems (user)
    }   
    catch (err) {
        logger.info ('user delete err', err)
        return ret_err_msg (500,'error in delete user')
    }

    return ret_ok (200)

}

