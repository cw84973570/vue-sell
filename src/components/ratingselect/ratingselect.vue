<template>
    <!-- 评论切换组件 -->
    <div class="ratingselect">
        <div class="rating-type border-1px">
            <span @click="select(2)" class="block positive" :class="{'active': selected===2}">{{desc.all}}<span class=count>{{ratings.length}}</span></span>
            <span @click="select(0)" class="block positive" :class="{'active': selected===0}">{{desc.positive}}<span class=count>{{positives.length}}</span></span>
            <span @click="select(1)" class="block negative" :class="{'active': selected===1}">{{desc.negative}}<span class=count>{{negatives.length}}</span></span>
        </div>
        <div @click="toggleContent" class="switch" :class="{'on': partContent}">
            <span class="icon-check_circle"></span>
            <span class="text">只看有内容的评价</span>
        </div>
    </div>
</template>

<script>
    import { bus } from '../../common/js/bus.js'
    const POSITIVE = 0
    const NEGATIVE = 1
    const ALL = 2
    export default {
        props: {
            ratings: {
                type: Array,
                default () {
                    return []
                }
            },
            selectType: {
                type: Number,
                default: ALL
            },
            onlyContent: {
                type: Boolean,
                default: false
            },
            desc: {
                type: Object,
                default () {
                    return {
                        all: '全部',
                        positive: '满意',
                        negative: '不满意'
                    }
                }
            }
        },
        data () {
            return {
                selected: this.selectType,
                partContent: this.onlyContent
            }
        },
        methods: {
            select (type) {
                // let that = this
                // 可以直接通过事件触发监听直接在父组件中修改属性而不用data返回一个局部变量
                this.selected = type
                // console.log(this.onlyContent)
                bus.$emit('rating-type-food', type)
                bus.$emit('rating-type-ratings', type)
            },
            toggleContent () {
                // let that = this
                this.partContent = !this.partContent
                // bus.$emit('content-toggle', this.onlyContent)
                bus.$emit('content-toggle-food', this.partContent)
                bus.$emit('content-toggle-ratings', this.partContent)
            }
        },
        computed: {
            positives () {
                return this.ratings.filter((rating) => {
                    return rating.rateType === POSITIVE
                })
            }, 
            negatives () {
                return this.ratings.filter((rating) => {
                    return rating.rateType === NEGATIVE
                })
            }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus">
    @import "../../common/stylus/mixin.styl"
    .ratingselect
        .rating-type
            padding: 18px 0
            margin: 0 18px
            border-1px(rgba(7, 17, 27, 0.1))
            font-size: 0
            .block
                display: inline-block
                padding: 8px 12px
                margin-right: 8px
                border-radius: 1px
                font-size: 12px
                color: rgb(77, 85, 93)
                &.active
                    color: #fff
                .count
                    margin-left: 2px
                    line-height: 16px
                    font-size: 8px
                &.positive
                   background: rgba(0, 160, 220, 0.2)
                   &.active
                       background: rgb(0, 160, 220)
                &.negative
                    background: rgba(77,85, 93, 0.2)
                    &.active
                        background: rgb(77,85, 93)
        .switch
            padding: 12px 18px
            line-height: 24px
            border-bottom: 1px solid rgba(7, 17, 27, 0.1)
            color: rgb(147, 153, 159)
            font-size: 0
            &.on
                .icon-check_circle
                    color: #00c850
            .icon-check_circle
                display: inline-block
                vertical-align: top
                margin-right: 4px
                font-size: 24px
            .text
                display: inline-block
                vertical-align: top
                font-size: 12px
</style>