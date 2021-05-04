import Vue from 'vue'
import VueRouter from 'vue-router'
import SellerPage from '@/views/SellerPage'
import TrendPage from '@/views/TrendPage'
import MapPage from '@/views/MapPage'
import RankPage from '@/views/RankPage'
Vue.use(VueRouter)

const routes = [
    {
        path:'/sellerPage',
        component:SellerPage
    },
    {
        path:'/trendPage',
        component:TrendPage
    },
    {
        path:'/mapPage',
        component:MapPage
    },{
        path:'/RankPage',
        component:RankPage
    }
]

const router = new VueRouter({
  routes
})

export default router
