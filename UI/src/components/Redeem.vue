<template>
    <div id="Redeem">
        <div class="container">
            <form @submit.prevent="handleSubmit">
                <div class = "field is-horizontal">
                    <div class = "field-label has-text-link">
                        <label>Available:</label>
                    </div>
                    <div class = "field">
                        {{redeem.availPoints}}
                    </div>
                    <div class = "field-label has-text-link">
                        <label>Desc:</label>
                    </div>
                    <div class = "field-body">
                        <div class = "field">
                            <input 
                                type = "text"
                                ref = "first" 
                                :class="{ 'has-error': submitting && invalidDesc }"
                                v-model = "redeem.description" 
                                @focus="clearStatus"
                                @keypress="clearStatus"
                            />
                        </div>
                    </div>
                    <div class = "field-label has-text-link">
                        <label>Points</label>
                    </div>
                    <div class = "field-body">
                        <input 
                            v-model = "redeem.points" 
                            :class="{ 'has-error': submitting && invalidPoints }"
                            type="number"
                            min="1"
                            @focus="clearStatus"
                            @keypress="clearStatus"
                        />
                    </div>
                    <div>
                        <button v-if="!isDisabled" class = "button is-link"> Redeem </button>
                    </div>                           
                </div>
                <div>
                    <p v-if="error && submitting" 
                        class="error-message">!Please fill out all required fields
                    </p>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import services from '../services/services.js'

export default {
    name: "Redeem",
    data () { 
        return {
            error: false,
            submitting: false,
            success: false,
            redeem: {
                availPoints: -10,
                description: '',
                points: ''
            }
        }
    },
    created() {
        this.getUserData()
    },
    computed: {
        invalidDesc () {
            return this.redeem.description === ''

        },
        invalidPoints () {
            if (this.redeem.points === '')
                return true

            if (this.redeem.points < 1)
                return true

            if (this.redeem.points > this.redeem.availPoints)
                return true 
            return false
        },
        isDisabled () {
            if (this.redeem.availPoints <= 0)
                return true
            return false
            /*
            if (this.redeem.description === '')
                return true
            if (this.redeem.points === '')
                return true 
            if (this.redeem.points > this.redeem.availPoints)
                return true
            return false
            */
        }
    },
    methods: {      
        handleSubmit() {
            // console.log ('on handle submit')
            this.clearStatus()
            this.submitting = true; 

             if (this.invalidDesc || this.invalidPoints) {
                this.error = true
                return
            }

            // write code here to handle redeem


            this.redeemPoints().then ( r => {
                // if success reset

                this.error = false
                this.success = true
                this.submitting = false
                this.redeem.description = ''
                this.redeem.points = ''
            })
            .error (err=> {
                this.error = true
                return
            })
        },
        clearStatus() {
            this.success = false
            this.error = false
        },
        async getUserData () {
            let accessToken = await this.$auth.getTokenSilently()
            services.getUsers (accessToken)
                .then (r => {
                    this.redeem.availPoints = r.user.pointsTotal
                })
        }, 

        async redeemPoints () {
            let accessToken = await this.$auth.getTokenSilently()
            let data = {
                description: this.redeem.description,
                points: this.redeem.points
            }
            services.redeemRewards (accessToken, data)
                .then (r => {
                    this.redeem.availPoints = r.user.pointsTotal
                    this.$root.$emit('PointsRedeemed')
                })
        }
    }
}
</script>

<style scoped>
form {
  margin-bottom: 2rem;
}
[class*="-message"] {
  font-weight: 500;
}
.error-message {
  color: #d33c40;
}
.success-message {
  color: #32a95d;
}
</style>