import { RouteRecordRaw, createRouter, createWebHashHistory } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/login",
  },
  {
      path: "/login",
      // @ts-ignore
    component: () => import("@/pages/login.vue"),
  },
  {
    path: "/home",
    component: () => import("@/pages/home/index.vue"),
  },
];

const router = createRouter({
    routes,
    history:createWebHashHistory()
})

export default router