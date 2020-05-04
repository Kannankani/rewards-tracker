# Rewards Tracker

Rewards management app that tracks rewards balance and transaction for each user.

Developed using node.js, typescript, dynamodb and AWS Lamda with serverless framework. oauth2 JWT is used for authorization.

## How it works

-  User is created with 100 bonus rewards on first time access
- 10 loyalty bonus is rewarded at every hour (simulating reward accumulation)
- Total points are caped at 250 points
- User can withdraw up to available points
- User can request to wipeout account. This deletes user record and all rewards records

## Architecture

- ```serverlss.yml``` contains necessary resources and function definitions to deploy the service
- ```resources``` folder has all resources and function definition for each service. This improves readablity and maintenablity in serverless.yml
- ```dataLayer``` contains user and rewards modes and data access objects
- ```lamda``` folder has source for all function handlers
    - ```auth``` subfolder has jwt token validation
    - ```http``` subfolder has all request handlers

## front end

- TODO.

## Testing

- Since there is no frond end yet, postman collection in ```test``` folder can be used to test
- ```authToken``` variable has to be set to a valid JWT token 

## Services

- getUser
    - Returns user record. New user is created if user does not exist with 100 sign in bonus


      ```
        {
            "user": {
                "userId": "google-oauth2|101894484717126395090",
                "createdAt": "2020-05-03T22:51:20.838Z",
                "pointsTotal": 100,
                "avatarUrl": null
            }
        }
      ```

- getuploadURL

    returns a S3 presigned URL to upload optional avatar.


    response

        ```
        {
            "uploadURL": "https://serverless-sk-reward-tracker-dev.s3.amazonaws.com/google-oauth2%7C101894484717126395090?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA5PDI4WZVLE3LH4PD%2F20200503%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20200503T235523Z&X-Amz-Expires=300&X-Amz-Signature=6eaf2deea2efb87d74128bd967fcff27bf7ae2e441d1b860a3c6631b17277b15&X-Amz-SignedHeaders=host"
        }
        ```

    user record is updated with the URL. getUser response after this call

        ```
            {
                "user": {
                "createdAt": "2020-05-03T23:55:18.449Z",
                "pointsTotal": 100,
                "avatarUrl": "https://serverless-sk-reward-tracker-dev.s3.amazonaws.com/google-oauth2|101894484717126395090",
                "userId": "google-oauth2|101894484717126395090"
                }
            }    

        ```

- deleteUser

    - deletes current user. Returns null on succes. Returs error if user not found

        Error response

        ```
        {
            "err": "user not found"
        }
        ```

- getRewards
    - get rewards/redemption details for current user

    ```
    {
        "redeems": [
        {
            "createdAt": "2020-05-03T22:52:11.813Z",
            "description": "Movie Ticket",
            "userId": "google-oauth2|101894484717126395090",
            "points": 10
        },
        {
            "createdAt": "2020-05-03T22:51:51.115Z",
            "description": "Hotel Booking",
            "userId": "google-oauth2|101894484717126395090",
            "points": 45
        },
        {
            "createdAt": "2020-05-03T22:51:20.840Z",
            "description": "sign in bonus",
            "userId": "google-oauth2|101894484717126395090",
            "points": 100
        }
        ]
    }
    ```

- redeemRewards
    - Request to redeem rewards for current users. Rewards totals adjusted. Returns error if there are not eough points

        request body

        ```
        {
	        "description": "Movie Ticket",
	        "points": 10
        }
        ```

        response 

        ```
        {
        "user": {
            "createdAt": "2020-05-03T22:51:20.838Z",
            "pointsTotal": 45,
            "avatarUrl": null,
            "userId": "google-oauth2|101894484717126395090"
        }
        }
        ```
        not enough points error response

        ```

        {
            "err": "not enough points to redeem"
        }

        ```


- giveRewards

    - Runs at scheduled interval and adds loyalty points to all users. This is recorded in the details also.

        Rewards list after this run

        ```
        {
        "redeems": [
        {
            "createdAt": "2020-05-03T23:05:00.028Z",
            "description": "Loyalty bonus",
            "userId": "google-oauth2|101894484717126395090",
            "points": 10
        },
        {
            "createdAt": "2020-05-03T23:00:00.028Z",
            "description": "Loyalty bonus",
            "userId": "google-oauth2|101894484717126395090",
            "points": 10
        },
        {
            "createdAt": "2020-05-03T22:52:11.813Z",
            "description": "Movie Ticket",
            "userId": "google-oauth2|101894484717126395090",
            "points": 10
        },
        {
            "createdAt": "2020-05-03T22:51:51.115Z",
            "description": "Hotel Booking",
            "userId": "google-oauth2|101894484717126395090",
            "points": 45
        },
        {
            "createdAt": "2020-05-03T22:51:20.840Z",
            "description": "sign in bonus",
            "userId": "google-oauth2|101894484717126395090",
            "points": 100
        }
        ]
        }
        ```

- getAllusers
        
    This is provided to verify delete user function. Getuser cannot be used to verify after delete since it will crete an account when user not found. This lists all users on the account
