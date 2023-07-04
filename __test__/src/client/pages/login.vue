<template>
    <div>
        <div>Login界面</div>
        <button @click="router.push('/home')">进入主页</button>
    </div>
</template>

<script setup lang="ts">

import { useRouter } from 'vue-router';

const router = useRouter()




</script>

