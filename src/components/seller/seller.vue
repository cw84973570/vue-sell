<template>
    <div class="seller" ref="seller">
        <div class="seller-content">
            <div class="overview">
                <h1 class="title">{{seller.name}}</h1>
                <div class="desc border-1px">
                    <star :size="36" :score="seller.score"></star>
                    <span class="text">({{seller.ratingCount}})</span>
                    <span class="text">月售{{seller.sellCount}}单</span>
                </div>
                <ul class="remark">
                    <li class="block">
                        <h2>起送价</h2>
                        <div class="content">
                            <span class="stress">{{seller.minPrice}}</span>元
                        </div>
                    </li>
                    <li class="block">
                        <h2>商家配送</h2>
                        <div class="content">
                            <span class="stress">{{seller.deliveryPrice}}</span>元
                        </div>
                    </li>
                    <li class="block">
                        <h2>平均配送时间</h2>
                        <div class="content">
                            <span class="stress">{{seller.deliveryTime}}</span>分钟
                        </div>
                    </li>
                </ul>
                <div class="favorite" @click="toggleFavorite()">
                    <span class="icon-favorite" :class="{ 'active': favorite}"></span>
                    <span class="text">{{favoriteText}}</span>
                </div>
            </div>
            <split></split>
            <div class="bulletin">
                <h1 class="title">公告与活动</h1>
                <div class="content-wrapper border-1px">
                    <p class="content">{{seller.bulletin}}</p>
                </div>
                <ul v-if="seller.supports" class="supports">
                    <li class="support-item border-1px" v-for="(item,index) in seller.supports">
                        <icon :size="4" :type="item.type" class="icon"></icon>
                        <span class="text">{{item.description}}</span>
                    </li>
                </ul>
            </div>
            <split></split>
            <div class="pics">
                <h1 class="title">商家实景</h1>
                <div class="pic-wrapper" ref="picWrapper">
                    <ul class="pic-list" ref="picList">
                        <li class="pic-item" v-for="pic in seller.pics">
                            <img :src="pic" width="120" height="90">
                        </li>
                    </ul>
                </div>
            </div>
            <split></split>
            <div class="info">
                <h1 class="title border-1px">商家信息</h1>
                <ul>
                    <li class="info-item" v-for="info in seller.infos">{{info}}</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    import star from '../star/star.vue'
    import split from '../split/split.vue'
    import icon from '../icon/icon.vue'
    import BScroll from 'better-scroll'
    import { saveToLocal, loadFromLocal } from '../../common/js/store.js'
    export default{
        props: {
            seller: {
                type: Object
            }
        },
        data () {
            return {
                // 从缓存中读取收藏状态的值，默认false
                favorite: (() => {
                    return loadFromLocal(this.seller.id, 'favorite', false)
                })()
            }
        },
        computed: {
            favoriteText () {
                return this.favorite ? '已收藏' : '收藏'
            }
        },
        // el被新创建的vm.$el替换，并被挂载到实例上去调用
        mounted () {
            this._initScroll()
        },
        methods: {
            _initScroll () {
                if (this.seller.pics && !this.scroll) {
                    // 初始化纵向滚动
                    this.scroll = new BScroll(this.$refs.seller, {click: true})
                    // 初始化横向滚动
                    // 设置ul的宽度
                    let picWidth = 120
                    let margin = 6
                    let width = (picWidth + margin) * this.seller.pics.length - 6
                    this.$refs.picList.style.width = width + 'px'
                    this.picScroll = new BScroll(this.$refs.picWrapper, {
                        scrollX: true,
                        // 在横向滚动的时候保留纵向的原生滚动
                        eventPassthrough: 'vertical'
                    })
                }
            },
            toggleFavorite () {
                this.favorite = !this.favorite
                // console.log(this.favorite)
                // 将收藏状态写入缓存
                saveToLocal(this.seller.id, 'favorite', this.favorite)
            }
        },
        updated () {
            // console.log('updated')
            this._initScroll()
            // console.log(this.picScroll)
        },
        // created () {
        //     console.log(1)
        //     this.$nextTick(() => {
        //         console.log(2)
        //     })
        //     console.log(3)
        // },
        // watch: {
        //     seller: {
        //         handler: function () {
        //             console.log('watch')
        //             console.log(this.seller.avatar)
        //             this._initScroll()
        //         },
        //         deep: true
        //     }
        // },
        components: {star, split, icon}
    }
</script>

<style lang="stylus" rel="stylesheet/stylus">
    @import "../../common/stylus/mixin.styl"
    .seller
        position: absolute   
        top: 174px
        bottom: 0
        left: 0
        width: 100%
        overflow: hidden
        .seller-content
            .overview
                position: relative
                padding: 18px
                .title
                    margin-bottom: 8px
                    line-height: 14px
                    color: rgb(7, 17, 27)
                    font-size: 14px   
                .desc
                    padding-bottom: 18px
                    // line-height: 18px
                    border-1px(rgba(7, 17, 27, 0.1))
                    font-size: 0
                    .star
                        display: inline-block
                        margin-right: 8px
                        vertical-align: top
                    .text
                        display: inline-block
                        margin-right: 12px                   
                        line-height: 18px
                        vertical-align: top
                        font-size: 10px
                .remark
                    display: flex
                    padding-top: 18px
                    .block
                        flex: 1
                        text-align: center
                        border-right: 1px solid rgba(7, 17, 27, 0.1)
                        &:last-child
                            border: none
                        h2
                            margin-bottom: 4px
                            line-height: 10px
                            font-size: 10px
                            color: rgb(147, 153, 159)
                        .content
                            lilne-height: 24px
                            font-size: 10px
                            color: rgb(7, 17, 27)
                            .stress
                                font-size: 24px
                .favorite
                    position: absolute
                    right: 11px
                    top: 18px
                    width: 50px
                    text-align: center
                    .icon-favorite
                        display: block
                        margin-bottom: 4px
                        line-height: 24px
                        font-size: 24px
                        color: #d4d6d9
                        &.active
                            color: rgb(240, 20, 20)
                    .text
                        // display: block
                        line-height: 10px
                        font-size: 10px
                        color: rgb(77, 85, 93)
            .bulletin
                padding: 18px 18px 0 18px
                .title
                    margin-bottom: 8px
                    line-height: 14px
                    color: rgb(7, 17, 27)
                    font-size: 14px
                .content-wrapper
                    padding: 0 12px 16px 12px
                    border-1px(rgba(7, 17, 27, 0.1))
                    .content
                        line-height: 24px
                        font-size: 12px
                        color: rgb(240, 20, 20)
                .supports
                    .support-item
                        padding: 16px 12px
                        font-size: 0
                        border-1px(rgba(7, 17, 27, 0.1))
                        &:last-child
                            border-none()
                    .icon
                        width: 16px
                        height: 16px
                        margin-right: 6px
                        background-size: 16px 16px
                    .text
                        line-height: 16px
                        font-size: 12px
                        color: rgb(7, 17, 27)            
            .pics
                padding: 18px
                .title
                    margin-bottom: 12px
                    line-height: 14px
                    color: rgb(7, 17, 27)
                    font-size: 14px
                .pic-wrapper
                    width: 100%
                    white-space: nowrap
                    .pic-list
                        font-size: 0
                        .pic-item
                            display: inline-block
                            margin-right: 6px
                            width: 120px
                            height: 90px
                            &:last-child
                                margin: 0
            .info
                padding: 18px 18px 0 18px
                color: rgb(7, 17, 27)
                .title
                    padding-bottom: 12px
                    border-1px(rgba(7, 17, 27, 0.1))
                    line-height: 14px
                    color: rgb(7, 17, 27)
                    font-size: 14px
                .info-item
                    padding: 16px 12px
                    border-1px(rgba(7, 17, 27, 0.1))
                    line-height: 16px
                    font-size: 12px
                    color: rgb(7, 17, 27)
                    &:last-child
                        border-none()
</style>