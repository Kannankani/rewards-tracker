import axios from "axios"

const host = 'http://localhost:3000'
const userURL = host + '/dev/user'
const rewardsURL = host + '/dev/user/rewards'
const redeemURL = userURL + '/redeem'


export default {
    async getUsers(accessToken) {
        // const accessToken = await this.$auth.getTokenSilently()
        // const accessToken = 'invalid'
        try {
          let res = await axios.get(userURL, {
            headers: {
              "Access-Control-Allow-Origin": "*",
              Authorization: `Bearer ${accessToken}`
            }
          })
          return res.data;
        }
        catch (err) {
          throw (err)
        }
    },

    async getRewardsSv (accessToken) {

      let res = ''
      // return rewards
      try {
          res = await axios.get (rewardsURL, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        })
      }
      catch (err) {
        throw (err)
      }
      return res.data.redeems
    },

    async redeemRewards (accessToken, data) {
        let res = ''

        try {
          res = await axios.post (redeemURL,
            data,
            {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }

          })
        } 
        catch (err) {
          throw (err)
        }
        return res.data
    }
}

