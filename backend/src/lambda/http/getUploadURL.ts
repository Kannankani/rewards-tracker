import 'source-map-support/register'
import * as AWS  from 'aws-sdk'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import { getUserId, ret_err_msg, ret_ok } from '../lamdaUtils'
import { UserAccess } from '../../dataLayer/userAccess'
import { User } from '../../dataLayer/dataModel/user'

const s3 = new AWS.S3({
  signatureVersion: 'v4'
})

const bucketName = process.env.IMAGES_S3_BUCKET
const urlExpiration = Number(process.env.SIGNED_URL_EXPIRATION)


export const GetUploadURL: APIGatewayProxyHandler = async (event, _context) => {
  const userId = getUserId (event)
  const logger = createLogger('generateURL')
  var uploadURL:string
  var user: User
  const userDA = new UserAccess()

  logger.info('generate URL for:', {'user': userId})


  try {

    uploadURL = s3.getSignedUrl('putObject', {
        Bucket: bucketName,
        Key: userId,
        Expires: urlExpiration
      })

    user = await userDA.getUser (userId)
    user.avatarUrl = "https://" + bucketName + 
                        ".s3.amazonaws.com/" + 
                        user.userId
    await userDA.updateUserURL (user)
    return ret_ok (200,'uploadURL', uploadURL)
  }
  catch (err) { 
      logger.info ('err in get URL', err)
      return ret_err_msg (500,'unable to generate URL')
  }

 
}