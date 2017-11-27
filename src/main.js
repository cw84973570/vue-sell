// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import app from './App'
// import router from './router'
import VueRouter from 'vue-router'
// 与后台进行数据交互的插件，类似于jquery里的$.ajax
import VueResource from 'vue-resource'
import goods from 'components/goods/goods.vue'
import seller from 'components/seller/seller.vue'
import ratings from 'components/ratings/ratings.vue'
import './common/stylus/index.styl'
Vue.use(VueRouter)
Vue.use(VueResource)
// 阻止Vue在启动时产生提示
Vue.config.productionTip = false
const router = new VueRouter({
    routes: [{
        path: '/goods',
        component: goods
    },
    {
        path: '/seller',
        component: seller
    },
    {
        path: '/ratings',
        component: ratings
    },
    // 主页指向/goods路径，就是说主页自动跳转到/goods路径下
    {
        path: '/',
        redirect: '/goods'
    }
    ],
    // 设置活动路由的class
    linkActiveClass: 'active'
})
/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    template: '<app></app>',
    // render: h => h(app)
    //  注册组件
    components: { app }
})
// router.go('seller')
