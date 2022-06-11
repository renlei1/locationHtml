<template>
    <div>
        <h2>信息修改</h2>
    </div>
</template>

<script>
import request from '@/utils/request'

export default {
    name: 'PersonalCenter',
    data() {
        return {
           
        }
    },
    methods: {

    },
    mounted() {
        request.get('api/users/' + this.$store.state.username).then((response => {
            console.log(response.data)
        }))
    }
}
</script>
