<template>
    <div>
        <mq-layout mq="desktop">
            <budget-desktop />
        </mq-layout>

        <mq-layout :mq="['mobile', 'tablet']">
            <budget-mobile />
        </mq-layout>
    </div>
</template>

<script>
    import BudgetDesktop from './desktop/index'
    import BudgetMobile from './mobile/index'

    export default {
        name: 'Budget',
        components: { BudgetMobile, BudgetDesktop }
    }
</script>

<style scoped>

</style>
