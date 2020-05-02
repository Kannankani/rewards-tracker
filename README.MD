# Rewards Tracker

Rewards management app that tracks rewards balance and transaction for each user.

Developed using node.js, typescript, dynamodb and AWS Lamda with serverless framework.

## How it works

-  User is created with 100 bonus rewards on first time access
- 10 loyalty bonus is rewarded at every hour (simulating reward accumoation)
- Total points are caped at 250 points
- User can withdraw up to avaialbe points

## Services

- getUsers
    - Returns total points for current user

- getRewards
    - get rewards/redemption details for current user

- redeemRewards
    - Request to redeem rewards for current users. Returns error if there are not eough points

- giveRewards

    - Runs at scheduled interval and adds loyalty points to all users

## Testing

`test` folder has postman collection to submit requests