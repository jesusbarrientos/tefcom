<template>
    <div>
        <mq-layout mq="desktop">
            <attendance-desktop />
        </mq-layout>

        <mq-layout :mq="['mobile', 'tablet']" />
    </div>
</template>

<script>
    import AttendanceDesktop from './desktop/index'
    export default {
        name: 'Attendance',
        components: { AttendanceDesktop },
        data() {
            return {
            }
        }
    }
</script>
