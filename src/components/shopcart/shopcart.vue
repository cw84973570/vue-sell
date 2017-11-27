<template>
    <div>
        <div class="shopcart">
            <div class="content" @click="toggleList">
                <div class="content-left">
                    <div class="logo-wrapper">
                        <div class="logo" :class="{'highlight':totalCount>0}">
                            <i class="icon-shopping_cart" :class="{'highlight':totalCount>0}"></i>
                        </div>
                        <div class="num" v-show="totalCount>0">{{totalCount}}</div>
                    </div>   
                    <div class="price" :class="{'highlight':totalPrice>0}">￥{{totalPrice}}</div>
                    <div class="desc">另需配送费￥{{deliveryPrice}}元</div>               
                </div>
                <div class="content-right" @click.stop.prevent="pay">
                    <div class="pay" :class="payClass">{{payDesc}}</div>
                </div>
            </div>
            <transition-group name="drop" class="ball-container" tag="div" @before-enter="beforeDrop" @enter="dropping" @after-enter="afterDrop">
                <div class="ball" v-for="ball in balls" v-show="ball.show" :key="ball.index">
                    <div class="inner inner-drop inner-hook"></div>
                </div>
            </transition-group>
            <transition name="fold">
                <div class="shopcart-list" v-show="listShow">
                    <div class="list-header">
                        <h1 class="title">购物车</h1>
                        <span class="empty" @click="empty">清空</span>
                    </div>
                    <div class="list-content" ref="listContent">
                        <ul>
                            <li class="food" v-for="food in selectFoods">
                                <span class="name">{{food.name}}</span>
                                <div class="price">
                                    <span>￥{{food.price*food.count}}</span>
                                </div>
                                <div class="cartcontrol-wrapper">
                                    <cartcontrol :food="food"></cartcontrol>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </transition>
        </div>
        <transition name="fade">
            <div class="list-mask" v-show="listShow" @click="hideList"></div>
        </transition>
    </div>
</template>
<script>
    import cartcontrol from '../cartcontrol/cartControl.vue'
    import BScroll from 'better-scroll'
    export default{
        props: {
            selectFoods: {
                type: Array,
                default () {
                    return []
                }
            },
            deliveryPrice: {
                type: Number,
                default: 0
            },
            minPrice: {
                type: Number,
                default: 0
            }
        },
        data () {
            return {
                balls: [
                    {
                        show: false, index: 1
                    },
                    {
                        show: false, index: 2
                    },
                    {
                        show: false, index: 3
                    },
                    {
                        show: false, index: 4
                    },
                    {
                        show: false, index: 5
                    }
                ],
                dropBalls: [],
                fold: true
            }
        },
        computed: {
            totalPrice () {
                let total = 0
                this.selectFoods.forEach((food) => {
                    total += food.price * food.count
                })
                return total
            },
            totalCount () {
                let count = 0
                this.selectFoods.forEach((food) => {
                    count += food.count
                })
                return count
            },
            payDesc () {
                if (this.totalPrice === 0) {
                    return `￥${this.minPrice}元起送`
                } else if (this.totalPrice < this.minPrice) {
                    let diff = this.minPrice - this.totalPrice
                    return `还差￥${diff}元起送`
                } else {
                    return '去结算'
                }
            },
            payClass () {
                if (this.totalPrice < this.minPrice) {
                    return 'not-enough'
                }
                return 'enough'
            },
            listShow () {
                if (!this.totalCount) {
                    this.fold = true
                    return false
                }
                let show = !this.fold
                // 只有列表展示的时候才需要滚动,所以在这里初始化betterScroll
                if (show) {
                    this.$nextTick(() => {
                        if (!this.scroll) {
                            this.scroll = new BScroll(this.$refs.listContent, { click: true })
                        } else {
                            this.scroll.refresh()
                        }
                    })
                }
                return show
            }
        },
        methods: {
            drop (el) {
                // console.log(el)
                for (let i = 0; i < this.balls.length; i++) {
                    let ball = this.balls[i]
                    if (!ball.show) {
                        ball.show = true
                        ball.el = el
                        this.dropBalls.push(ball)
                        return
                    }
                }
            },
            beforeDrop (el) {
                let count = this.balls.length
                while (count--) {
                    let ball = this.balls[count]
                    // 计算小球初始和终点位置的差值
                    if (ball.show) {
                        // 获得元素相对于视口的位置，left和top就是相对于视口的偏移
                        let rect = ball.el.getBoundingClientRect()
                        let x = rect.left - 32
                        let y = -(window.innerHeight - rect.top - 22)
                        // 让元素在动画初始的位置显示
                        el.style.display = ''
                        // 让元素的外层做一个Y轴的动画
                        el.style.webkitTransform = `translate3d(0,${y}px,0`
                        el.style.transform = `translate3d(0,${y}px,0`
                        // 让元素的内层做一个X轴的动画
                        let inner = el.getElementsByClassName('inner-hook')[0]
                        inner.style.webkitTransform = `translate3d(${x}px,0,0)`
                        inner.style.transform = `translate3d(${x}px,0,0)`
                    }
                }
            },
            dropping (el, done) {
                /* eslint-disable no-unused-vars */
                // 触发浏览器重绘
                let rf = el.offsetHeight
                // 重置样式
                this.$nextTick(() => {
                    el.style.webkitTransform = 'translate3d(0,0,0)'
                    el.style.transform = 'translate3d(0,0,0)'
                    let inner = el.getElementsByClassName('inner-hook')[0]
                    inner.style.webkitTransform = 'translate3d(0,0,0)'
                    inner.style.transform = 'translate3d(0,0,0)'
                    // 告诉vue动画结束
                    el.addEventListener('transitionend', done)
                })
            },
            afterDrop (el) {
                // 删除并返回第一个元素
                let ball = this.dropBalls.shift()
                // 回收完成动画的小球
                if (ball) {
                    ball.show = false
                    el.style.display = 'none'
                }
            },
            toggleList () {
                if (!this.totalCount) {
                    return
                }
                this.fold = !this.fold
            },
            empty () {
                this.selectFoods.forEach((food) => {
                    food.count = 0
                })
            },
            hideList () {
                this.fold = true
            },
            pay () {
                if (this.totalPrice < this.minPrice) {
                    return
                }
                window.alert(`支付${this.totalPrice}元`)
            }
        },
        components: { cartcontrol }
    }
</script>
<style lang="stylus" rel="stylesheet/stylus">
    @import '../../common/stylus/mixin.styl'
    .shopcart
        position: fixed
        left: 0
        bottom: 0
        width: 100%
        height: 48px
        z-index: 50
        .content
            display: flex
            background: #141d27
            font-size: 0
            color: rgba(255, 255, 255, 0.4)
            .content-left
                flex: 1
                .logo-wrapper
                    display: inline-block
                    position: relative
                    vertical-align: top
                    top: -10px
                    margin: 0 12px
                    padding: 6px
                    width: 56px
                    height: 56px
                    box-sizing: border-box
                    border-radius: 50%
                    background: #141d27
                    .logo
                        width: 100%
                        height: 100%
                        border-radius: 50%
                        background: #2b343c
                        text-align: center
                        &.highlight
                            background: rgb(0, 160, 220)
                        .icon-shopping_cart
                            line-height 44px
                            font-size: 24px
                            color: #80858a
                            &.highlight
                                color: #fff
                    .num
                        position: absolute
                        top: 0
                        right: 0
                        width: 24px
                        height: 16px
                        line-height: 16px
                        text-align: center
                        border-radius: 16px
                        font-size: 9px
                        font-weight: 700
                        color: #fff
                        background: rgb(240, 20, 20)
                        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4)
                .price
                    display: inline-block
                    vertical-align: top
                    margin-top: 12px
                    line-height: 24px
                    padding-right: 12px
                    box-sizing: border-box
                    border-right: 1px solid rgba(255, 255, 255, 0.1)
                    font-size: 16px
                    font-weight: 700
                    &.highlight
                        color: #fff
                .desc
                    display: inline-block
                    vertical-align: top
                    margin: 12px 0 0 12px
                    line-height: 24px
                    font-size: 10px
            .content-right
                flex: 0 0 105px
                width: 105px
                .pay
                    height: 48px
                    line-height: 48px
                    text-align: center
                    font-size: 12px
                    font-weight: 700 
                    &.not-enough
                        background: #2b333b
                    &.enough
                        background: #00b43c
                        color: #fff
        .ball-container
            .ball
                position: fixed
                // 小球最终的位置
                left: 32px
                bottom: 22px
                z-index: 200
                .inner
                    // 设计师没要求大概设个宽高
                    width: 16px
                    height: 16px
                    border-radius: 50px
                    background: rgb(0, 160, 220)
                &.drop-enter-active
                    // 贝塞尔曲线
                    transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41)
                    .inner-drop
                        transition: all 0.4s linear
        .shopcart-list
            position: absolute
            top: 0
            left: 0
            z-index: -1
            width: 100%
            transform: translate3d(0, -100%, 0)
            &.fold-enter-active, &.fold-leave-active
                transition: all 0.5s
            &.fold-enter, &.fold-leave-to
                transform: translate3d(0, 0, 0)
            .list-header
                height: 40px
                line-height: 40px
                padding: 0 18px
                background: #f3f5f7
                border-bottom: 1px solid rgba(7, 17, 27, 0.1)
                .title
                    float: left
                    font-size: 14px
                    color: rgb(7, 17, 27)
                .empty
                    float: right
                    font-size: 12px
                    color: rgb(0, 160, 220)
            .list-content
                padding: 0 18px
                max-height: 217px
                overflow: hidden
                background: #fff
                .food
                    position: relative
                    padding: 12px 0
                    box-sizing: border-box
                    border-1px(rgba(7, 17, 27, 0.1))
                    .name
                        line-height: 24px
                        font-size: 14px
                        color: rgb(7, 17, 27)
                    .price
                        position: absolute
                        right: 90px
                        bottom: 12px
                        line-height: 24px
                        font-weight: 700
                        font-size: 14px
                        color: rgb(240, 20, 20)
                    .cartcontrol-wrapper
                        position: absolute
                        right: 0
                        bottom: 6px
    .list-mask
        position: fixed
        top: 0
        left: 0
        width: 100%
        height: 100%
        z-index: 40
        backdrop-filter: blur(10px)
        opacity: 1
        background: rgba(7, 17, 27, 0.6)
        &.fade-enter-active, &.fade-leave-active
            transition: all 0.5s
        &.fade-enter, &.fade-leave-to
            opacity: 0
</style>