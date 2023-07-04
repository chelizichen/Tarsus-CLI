<template>
    <div>
        <div class="hello">{{ state.msg }} {{ state.num }}</div>
        <button @click="add()">click to add</button>
        <div>created by chelizichen</div>
        <RouterView></RouterView>
    </div>
</template> 

<script setup lang="ts">
import { reactive } from 'vue';
import { RouterView } from 'vue-router';
import { testRequest } from '@/api/test';
import { onMounted } from 'vue';

onMounted(async () => {
    const data = await testRequest()
    state.msg = data.data.msg
})

const state = reactive({
    num: <number>1,
    msg:<string>""
})

function add() {
    state.num += 1;
}
</script>

<style  lang="scss" scoped>
.hello{
    color:red
}
</style>