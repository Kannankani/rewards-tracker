import { APIGatewayProxyEvent } from "aws-lambda";

import * as AWS  from 'aws-sdk'
import { parseUserId } from "./auth/authUtils";
import { RedeemAccess } from "../dataLayer/redeemAccess";
import { Redeem } from "../dataLayer/dataModel/redeem";
import { User } from "../dataLayer/dataModel/user";
import { UserAccess } from "../dataLayer/userAccess";

const s3 = new AWS.S3({
  signatureVersion: 'v4'
})

const bucketName = process.env.IMAGES_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

/**
 * Get a user id from an API Gateway event
 * @param event an event from API Gateway
 *
 * @returns a user id from a JWT token
 */
export function getUserId(event: APIGatewayProxyEvent): string {

  return event.pathParameters.userId

  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  return parseUserId(jwtToken)
}

export function getPresignedURL (todoId: string): string {
  return s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: todoId,
    Expires: urlExpiration
  })
}

export function ret_ok(code: number, k?,v?) {

  var body:string
  if (k== undefined) {
    body = '{}'
  }
  else {
    body = JSON.stringify({ [k]:v});
  }

  return {
      statusCode: code,
      headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
      },
      body: body
  };
}
export function ret_err_msg(code: number, msg: string) {
  const r = {
      statusCode: code,
      headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
          err: msg
      })
  };
  return r;
}

export function award_bonus(user: User, description:string,
   points:number, inRedeemDA?: RedeemAccess) {
  
  var redeemDA: RedeemAccess;
  const redeem = <Redeem> {
    userId: user.userId,
    createdAt: new Date().toISOString(),
    description: description, 
    points: points
  }  
  
  if (inRedeemDA == undefined)
    redeemDA = new RedeemAccess()
  else
    redeemDA = inRedeemDA

  try {
    redeemDA.createRedeem (redeem)
  }
  catch (err) {
    throw (err)
    return
  }
}

export function createUserHelper (userId:string, userDA:UserAccess): User {

    var user = <User> {}
    user.userId = userId
    user.createdAt = new Date().toISOString()
    user.pointsTotal = 100
    user.avatarUrl = null

    try {
      userDA.createUser (user)
    }
    catch (err) {
      throw (err)
      return
    }

    try {
      award_bonus (user,'sign in bonus', 100)
    }
    catch (err) {
      throw (err)
      return
    }
    return user
}