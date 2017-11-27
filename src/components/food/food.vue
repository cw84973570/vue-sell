<template>
    <!-- 商品详情组件 -->
    <transition name="move">
        <div v-show="showFlag" class="food" ref="food">
            <div class="food-content">
                <div class="image-header">
                    <img :src="food.image">
                    <div class="back" @click="hide">                   
                        <i class="icon-arrow_lift"></i>
                    </div>
                </div>
                <div class="content">
                    <h1 class="title">{{food.name}}</h1>
                    <div class="detail">
                        <span class="sell-count">月售{{food.sellCount}}份</span>
                        <span class="rating">好评率{{food.rating}}%</span>
                    </div>
                    <div class="price">
                        <span class="now">￥{{food.price}}</span>
                        <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                    </div>
                    <div class="cartcontrol-wrapper">
                        <cartcontrol :food="food"></cartcontrol>
                    </div>
                    <transition name="fade">
                        <div @click.stop.prevent="addFirst" class="buy" v-show="!food.count || food.count===0">加入购物车</div>
                    </transition>
                </div>
                <split v-show="food.info"></split>
                <div class="info" v-show="food.info">
                    <h1 class="title">商品介绍</h1>
                    <p class="text">{{food.info}}</p>
                </div>
                <split></split>
                <div class="ratings">
                    <h1 class="title">商品评价</h1>
                    <ratingselect :select-type="selectType" :only-content="onlyContent" :ratings="food.ratings" :desc="desc"></ratingselect>
                    <div class="rating-wrapper">
                        <ul v-show="food.ratings && food.ratings.length">
                            <li v-show="needShow(rating.rateType,rating.text)" v-for="rating in food.ratings" class="rating-item border-1px">
                                <div class="user">
                                    <span class="name">{{rating.username}}</span>
                                    <img class="avatar" width="12" height="12" :src="rating.avatar">
                                </div>
                                <div class="time">{{rating.rateTime | formatDate}}</div>
                                <p class="text">
                                    <span :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}"></span>{{rating.text}}
                                </p>
                            </li>
                        </ul>
                        <div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
    import BScroll from 'better-scroll'
    import { bus } from '../../common/js/bus.js'
    import Vue from 'vue'
    import cartcontrol from '../cartcontrol/cartControl.vue'
    import split from '../split/split.vue'
    import ratingselect from '../ratingselect/ratingselect.vue'
    import { formatDate } from '../../common/js/date.js'
    // const POSITIVE = 0
    // const NEGATIVE = 1
    const ALL = 2
    export default {
        props: {
            food: {
                type: Object
            }
        },
        data () {
            return {
                showFlag: false,          
                selectType: ALL,
                onlyContent: false,
                desc: {
                    all: '全部',
                    positive: '推荐',
                    negative: '吐槽'
                }
            }
        },
        methods: {
            show () {
                this.showFlag = true
                this.selectType = ALL
                this.onlyContent = false
                this.$nextTick(() => {
                    if (!this.scroll) {
                        this.scroll = new BScroll(this.$refs.food, {
                            click: true
                        })
                    } else {
                        this.scroll.refresh()
                    }
                })
            },
            hide () {
                this.showFlag = false
            },
            addFirst (event) {
                // console.log('click')
                // 添加小球抛入购物车动画
                bus.$emit('cart-add', event.target)
                // 添加商品到购物车
                Vue.set(this.food, 'count', 1)
            },
            needShow (type, text) {
                // 需要观察子组件数据改变
                // 显示有内容的评价并且没有内容，返回false
                // console.log(this.onlyContent)
                if (this.onlyContent && !text) {
                    return false
                }
                // 显示评价类型为全部，返回true
                if (this.selectType === ALL) {
                    return true
                } else {
                    // 显示与选择相符的类型，好评与差评
                    return type === this.selectType
                }
            },
            // 事件监听回调函数
            _ratingTypeFood (type) {
                // let that = this
                this.selectType = type
                // console.log(this.scroll)
                this.$nextTick(() => {
                    // console.log(this.scroll)
                    this.scroll.refresh()
                })
            },
            _contentToggleFood (onlyContent) {
                // console.log(this.onlyContent)
                console.log(onlyContent)
                this.onlyContent = onlyContent
                this.$nextTick(() => {
                    this.scroll.refresh()
                })
            }
        },
        // 监听事件
        created () {
            bus.$on('rating-type-food', this._ratingTypeFood)
            bus.$on('content-toggle-food', this._contentToggleFood)
        },
        beforeDestroy () {
            // console.log('done!')
            bus.$off('rating-type-food', this._ratingTypeFood)
            bus.$off('content-toggle-food', this._contentToggleFood)
        },
        filters: {
            formatDate  (time) {
                let date = new Date(time)
                return formatDate(date, 'yyy-MM-dd hh:mm')
            }
        },
        components: {cartcontrol, split, ratingselect}
    }
</script>

<style lang="stylus" rel="stylesheet/stylus">
    @import "../../common/stylus/mixin.styl"
    .food
        position: fixed
        left: 0
        top: 0
        bottom: 48px
        z-index: 30
        width: 100%
        background: #fff
        &.move-enter-active, &.move-leave-active
            transition: all 0.2s linear
        &.move-enter, &.move-leave-to
            transform: translate3d(100%, 0, 0)
        .food-content
            .image-header
                position: relative
                width: 100%
                height: 0
                // 宽高相等的容器
                padding-top: 100%
                img
                    position: absolute
                    top: 0
                    left: 0
                    width: 100%
                    height: 100%
                .back
                    position: absolute
                    top: 10px
                    left: 0
                    .icon-arrow_lift
                        display: block
                        // 增加按钮可点击区域
                        padding: 10px
                        font-size: 20px
                        color: #fff
            .content
                position: relative
                padding: 18px
                .title
                    margin-bottom: 8px
                    font-size: 14px
                    font-weight: 700
                    line-height: 14px
                    color: rgb(7, 17, 27)
                .detail
                    height: 10px
                    margin-bottom: 18px
                    font-size: 0
                    line-height: 10px
                    color: rgb(147, 157, 159)
                    .sell-count
                        display: inline-block
                        font-size: 10px
                        margin-right: 12px
                    .rating
                        display: inline-block
                        font-size: 10px
                .price
                    line-height: 24px
                    .now
                        font-size: 14px
                        font-weight: 700
                        color: rgb(240, 20, 20)
                    .old
                        font-size: 10px
                        text-decoration: line-through
                        color: rgb(147, 157, 159)
                .cartcontrol-wrapper
                    position: absolute
                    right: 12px
                    bottom: 12px
                .buy
                    position: absolute
                    right: 18px
                    bottom: 18px
                    z-index: 10
                    height: 24px
                    line-height: 24px
                    padding: 0 12px
                    box-sizing: border-box
                    border-radius: 12px
                    font-size: 10px
                    color: #fff
                    background: rgb(0, 160, 220)
                    &.fade-enter-active, &.fade-leave-active
                        transition: all 0.3s
                    &.fade-enter, &.fade-leave-to
                        opacity: 0
            .info
                padding: 18px
                .title
                    display: inline-block
                    font-size: 14px
                    line-height: 14px
                    color: rgb(7, 17, 27)
                .text
                    display: inline-block
                    margin-bottom: 6px
                    padding: 0 8px
                    font-size: 12px
                    font-weight: 200
                    line-height: 24px
                    color: rgb(77, 85, 93)
            .ratings
                padding-top: 18px
                .title
                    margin-left: 18px
                    font-size: 14px
                    line-height: 14px
                    color: rgb(7, 17, 27)
                .rating-wrapper
                    padding: 0 18px
                    .rating-item
                        position: relative
                        padding: 16px 0
                        border-1px(rgba(7, 17, 27, 0.1))
                        .user
                            position: absolute
                            right: 0
                            top: 16px
                            line-height: 12px
                            font-size: 0
                            .name
                                display: inline-block
                                margin-right: 6px
                                vertical-align: top
                                font-size: 10px
                                color: rgb(147, 153, 159)
                            .avatar
                                border-radius: 50%
                        .time
                            margin-bottom: 6px
                            line-height: 12px
                            font-size: 10px
                            color: rgb(147, 153, 159)
                        .text
                            line-height: 16px
                            font-size: 12px
                            color: rgb(7, 17, 27)
                            .icon-thumb_up, .icon-thumb_down
                                margin-right: 4px
                                line-height: 16px
                                font-size: 12px
                            .icon-thumb_up
                                color: rgb(0, 160,220)
                            .icon-thumb_down
                                color: rgb(147, 153, 159)
                    .no-rating
                        padding: 16px 0
                        font-size: 12px
                        color: rgb(147, 153, 159)
                        
</style>