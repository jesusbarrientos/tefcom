<template>
    <div>
        <mq-layout mq="desktop">
            <employee-desktop />
        </mq-layout>

        <mq-layout :mq="['mobile', 'tablet']">
            <employee-mobile />
        </mq-layout>
    </div>
</template>

<script>
    import EmployeeDesktop from './desktop/index'
    import EmployeeMobile from './mobile/index'

    export default {
        name: 'Employee',
        components: { EmployeeMobile, EmployeeDesktop }
    }
</script>

<style scoped>

</style>
