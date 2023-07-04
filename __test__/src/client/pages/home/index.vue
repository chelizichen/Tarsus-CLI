<template>
    <div>
        <div>Home界面</div>
        <button @click="router.push('/login')">返回登录</button>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter()
</script>

<style scoped>

</style>