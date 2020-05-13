<template>
    <div id ="Rewards" class="container">
        <table class = "table">
            <tr class = "thead">
                <th> Date </th>
                <th> Description </th>
                <th> Points </th>
                
            </tr>
            <br/>
            <tbody>
                <tr v-for="reward in rewards" :key="reward.createdAt">
                    <td>{{ reward.createdAt }}</td>
                    <td>{{ reward.description }}</td>
                    <td style="text-align:right">{{ reward.points }}</td>
                </tr>
            </tbody>
        </table>
            
    </div>
</template>


<script>

import services from '../services/services.js'

export default {
    name: 'Rewards',
    data () {
        return {rewards: []}
    },
    created () {
        this.getRewardsData()
    },
    mounted () {
        this.$root.$on('PointsRedeemed',() => {
            this.getRewardsData()
        } )

    },
    methods: {
        async getRewardsData () {
            let accessToken = await this.$auth.getTokenSilently()

            
            services.getRewardsSv(accessToken).then (r => {
                this.rewards = r
                //this.$set(this, "rewards", r);
            })
        }
    }
}

</script>

<style scoped>
.Rewards.thead {
    color:darkcyan;
}
</style>