<template>
    <div class="goods">
        <div class="menu-wrapper" ref="menuWrapper">
            <ul>
                <li v-for="(item, index) in goods" class="menu-item menu-item-hook" :class="{current:currentIndex===index}">
                    <span class="text border-1px" @click="selectMenu(index)">
                        <icon :size="3" :type="item.type" v-show="item.type>0"></icon>{{item.name}}
                    </span>
                </li>
            </ul>
        </div>
        <div class="foods-wrapper" ref="foodsWrapper">
            <ul>
                <li v-for="item in goods" class="food-list food-list-hook">
                    <h1 class="title">{{item.name}}</h1>
                    <ul>
                        <li @click="selectFood(food)" v-for="food in item.foods" class="food-item border-1px">
                            <div class="pic">
                                <img width="57px" height="57px" :src="food.icon">
                            </div>
                            <div class="content">
                                <h2 class="name">{{food.name}}</h2>
                                <p class="desc">{{food.description}}</p>
                                <div class="extra">
                                    <span class="count">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
                                </div>
                                <div class="price">
                                    <span class="now">￥{{food.price}}</span> <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                                </div>
                                <div class="cartcontrol-wrapper">
                                    <cartcontrol :food="food"></cartcontrol>
                                </div>
                            </div>
                        </li>
                    </ul>
                </li>
            </ul>      
        </div>
        <shopcart :deliveryPrice="seller.deliveryPrice" :minPrice="seller.minPrice" :select-foods="selectFoods" ref="shopcart"></shopcart>
        <food :food="selectedFood" ref="food"></food>
    </div>
</template>

<script>
    import BScroll from 'better-scroll'
    const ERR_OK = 0
    import icon from '../icon/icon.vue'
    import shopcart from '../shopcart/shopcart.vue'
    import cartcontrol from '../cartcontrol/cartControl.vue'
    import { bus } from '../../common/js/bus.js'
    import food from '../food/food.vue'
    export default {
        props: {
            seller: {
                type: Object
            }
        },
        data () {
            return {
                goods: [],
                // foodWrapper里每个区间的高度
                listHeight: [],
                // 右侧区间的实时高度,与左侧区间做一个映射
                scrollY: 0,
                selectedFood: {}
                // 窗口高度
                // windowHeight: document.documentElement.clientHeight
            }
        },
        // 计算右侧实时高度所在的区间
        computed: {
            currentIndex: function () {
                for (let i = 0; i < this.listHeight.length; i++) {
                    let height1 = this.listHeight[i]
                    let height2 = this.listHeight[i + 1]
                    if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
                        return i
                    }
                }
                return 0
            },
            selectFoods () {
                let foods = []
                this.goods.forEach((good) => {
                    good.foods.forEach((food) => {
                        if (food.count) {
                            foods.push(food)
                        }
                    })
                })
                return foods
            }
        },
        // 被挂载的元素被替换后调用该钩子
        // updated () {
        //     this.windowHeight = document.documentElement.clientHeight
        //     let that = this
        //     // 浏览器尺寸变更事件
        //     window.onresize = function () {
        //         if (that.windowHeight !== document.documentElement.clientHeight) {
        //             console.log(that.windowHeight)
        //             console.log(that.menuScroll)
        //             that.menuScroll = new BScroll(that.$refs.menuWrapper, {click: true})
        //             that.menuScroll.refresh()
        //             that.foodsScroll.refresh()
        //             console.log(that.menuScroll)
        //         }
        //         that.windowHeight = document.documentElement.clientHeight
        //     }
        // },
        created () {
            this.$http.get('/api/goods').then((response) => {
                response = response.body
                if (response.errno === ERR_OK) {
                    this.goods = response.data
                    // console.log(this.goods)
                    this.$nextTick(() => {
                        this._initScroll()
                        this._calculateHeight()
                    })
                }
            })
            this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
            // 监听事件
            bus.$on('cart-add', this._cartAdd)
            // this.windowHeight = document.documentElement.clientHeight
            // console.log(this.windowHeight)
        },
        beforeDestroy () {
            bus.$off('cart-add', this._cartAdd)
            this.foodsScroll.off('scroll', this._scroll)
        },
        components: {
            icon, shopcart, cartcontrol, food
        },
        methods: {
            // 点击左侧栏右侧栏滚动到相应的位置效果
            selectMenu (index) {
                let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')
                // console.log(index)
                let el = foodList[index]
                this.foodsScroll.scrollToElement(el, 300)
            },
            // // 滚动右侧栏的同时将左侧高亮的栏滚动到相应的位置
            // // vue绑定scroll事件无效果，故用betterScroll监听事件
            // scrollMenu () {
            //     let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')
            //     let el = foodList[this.currentIndex - 3]
            //     if (el) {
            //         this.foodsScroll.scrollToElement(el, 300)
            //     }
            // },
            selectFood (food) {
                this.selectedFood = food
                this.$refs.food.show()
            },
            _drop (target) {
                // 体验优化，异步执行下落动画
                this.$nextTick(() => {
                    this.$refs.shopcart.drop(target)
                })
            },
            _initScroll () {
                // 允许点击事件
                // if (this.menuScroll) {
                //     this.menuScroll.refresh()
                // }
                this.menuScroll = new BScroll(this.$refs.menuWrapper, {click: true})
                // 当 probeType 为 3 的时候，不仅在屏幕滑动的过程中，而且在 momentum 滚动动画运行过程中实时派发 scroll 事件。
                // console.log(this.menuScroll)
                this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {click: true, probeType: 3})
                // console.log(this.menuScroll)
                // console.log(this.$refs.menuWrapper)
                // 监听滚动事件
                this.foodsScroll.on('scroll', this._scroll)
            },
            // 计算每个区间高度并将高度值push进数组
            _calculateHeight: function () {
                // 获取食物分类区间
                let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')
                // 初始化高度
                let height = 0
                // 将第一个区间的高度push进数组
                this.listHeight.push(height)
                // 遍历区间取得每个区间的高度并push进数组
                for (let i = 0; i < foodList.length; i++) {
                    let item = foodList[i]
                    height += item.clientHeight
                    this.listHeight.push(height)
                }
            },
            // 监听事件的回调函数
            _cartAdd (target) {
                this._drop(target)
            },
            _scroll (pos) {
                this.scrollY = Math.abs(Math.round(pos.y))
                let menuItem = this.$refs.menuWrapper.getElementsByClassName('menu-item-hook')
                let el = menuItem[this.currentIndex - 3]
                // console.log(menuItem.length)
                if (el) {
                    this.menuScroll.scrollToElement(el, 300)
                }
            }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus">
    @import "../../common/stylus/mixin.styl"
    .goods
        display: flex
        position: absolute
        width: 100%
        top: 174px
        bottom: 46px
        overflow: hidden
        .menu-wrapper
            flex: 0 0 80px
            width: 80px
            background: #f3f5f7
        .menu-item
            display: table
            width: 56px
            height: 54px
            padding: 0px 12px
            line-height: 14px
            .icon
                margin-right: 2px
            &.current
                position: relative
                z-index: 10
                margin-top: -1px
                background: #fff
                font-weight: 700
                .text
                    border-none()
            .text
                display: table-cell
                width: 56px
                vertical-align: middle
                border-1px(rgba(7,17,27,0.1))
                font-size: 12px
        .foods-wrapper
            flex: 1
            .title
                padding-left: 14px
                height: 26px
                line-height: 26px
                border-left: 2px solid #d9dde1
                font-size: 12px
                color: rgb(147,153,159)
                background: #f3f5f7
            .food-item
                display: flex
                margin: 18px 18px 0px 18px
                padding-bottom: 18px
                border-1px(rgba(7, 17, 27, 0.1))
                &:last-child
                    border-none()
                .pic
                    flex: 0 0 57px
                    margin-right: 10px
                .content
                    flex: 1
                    .name
                        display: inline-block
                        margin: 2px 0px 8px 0
                        height: 14px
                        line-height: 14px
                        font-size: 14px
                        color: rgb(7,17,27)
                    .desc, .extra
                        line-height: 10px
                        font-size: 10px
                        color: rgb(147, 153, 159)
                    .desc
                        margin-bottom: 8px
                    .extra
                        .count
                            margin-right: 12px
                    .price
                        font-weight: 700
                        line-height: 24px
                        .now
                            margin-right: 8px
                            font-size: 14px
                            color: rgb(240, 20, 20)
                        .old
                            text-decoration: line-through
                            font-size: 10px
                            color: rgb(147, 153, 159)
                    .cartcontrol-wrapper
                        position: absolute
                        right: 0
                        bottom: 12px
</style>