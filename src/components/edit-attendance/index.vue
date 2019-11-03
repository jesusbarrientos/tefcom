<template>
    <div>
        <mq-layout mq="desktop">
            <edit-attendance-desktop :show="show" :event="event" :set-value="setValue" @emit="onEmit($event)" />
        </mq-layout>

        <mq-layout :mq="['mobile', 'tablet']" />
    </div>
</template>

<script>
    import EditAttendanceDesktop from './desktop/index'

    const attendance = {
        rut: undefined,
        old_date: undefined,
        new_date: undefined,
        entry: undefined,
        exit: undefined
    }

    export default {
        name: 'EditAttendance',
        components: { EditAttendanceDesktop },
        props: {
            show: {
                required: true,
                default: false
            },
            event: {
                required: true
            }
        },
        data() {
            return {
                attendance
            }
        },
        methods: {
            setValue(props, fields) {
                Object.keys(fields).forEach((k) => {
                    switch (fields[k].name) {
                        case 'entry': {
                            this.$store.commit('attendance/setEntry', fields[k].value)
                            break
                        }

                        case 'exit': {
                            this.$store.commit('attendance/setExit', fields[k].value)
                            break
                        }
                    }
                })
            },
            onEmit(event) {
                this.loading = true

                this.$emit('emit', {
                    ...event,
                    callback: (promise) => {
                        promise
                            .then(() => {
                                this.$store.commit('attendance/setOldDate', this.$store.state.attendance.entry)
                            })
                            .finally(() => {
                                event.callback(promise)
                            })
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>
