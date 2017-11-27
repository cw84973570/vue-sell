<template>
    <span class="icon" :class="[supportsType,iconType]"></span>
</template>
<script>
    // 小图标组件
    export default{
        // 请求父组件数据
        props: {
            // 图片大小，下划线后面的数字
            size: {
                type: Number
            },
            // 图片类型，classMap里面的五种
            type: {
                type: Number
            }
        },
        created () {
            this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
        },
        //  计算class
        computed: {
            iconType: function () {
                return 'icon-' + this.size
            },
            supportsType: function () {
                // console.log(this.classMap[this.type])
                return this.classMap[this.type]
            }
        }
    }
</script>
<style lang="stylus" rel="stylesheet/stylus">
    @import "../../common/stylus/mixin.styl"
    .icon
        display: inline-block
        vertical-align: top
        width: 12px
        height: 12px
        background-size: 12px 12px
        background-repeat: no-repeat
    .icon-1
        &.decrease
            bg-image('decrease_1')
        &.discount
            bg-image('discount_1')
        &.guarantee
            bg-image('guarantee_1')
        &.invoice
            bg-image('invoice_1')
        &.special
            bg-image('special_1')
    .icon-2
        &.decrease
            bg-image('decrease_2')
        &.discount
            bg-image('discount_2')
        &.guarantee
            bg-image('guarantee_2')
        &.invoice
            bg-image('invoice_2')
        &.special
            bg-image('special_2')
    .icon-3
        &.decrease
            bg-image('decrease_3')
        &.discount
            bg-image('discount_3')
        &.guarantee
            bg-image('guarantee_3')
        &.invoice
            bg-image('invoice_3')
        &.special
            bg-image('special_3')
    .icon-4
        &.decrease
            bg-image('decrease_4')
        &.discount
            bg-image('discount_4')
        &.guarantee
            bg-image('guarantee_4')
        &.invoice
            bg-image('invoice_4')
        &.special
            bg-image('special_4')
</style>