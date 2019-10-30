<template>
    <div>
        <mq-layout mq="desktop">
            <document-attendance-desktop :loading="loading" :data="data" :data-request="attendanceDataRequest" :event="event" @emit="onEmit($event)" />
        </mq-layout>

        <mq-layout :mq="['mobile', 'tablet']" />
    </div>
</template>

<script>
    import DocumentAttendanceDesktop from './desktop/index'

    const event = {
        GET: 'get',
        FILTER: 'filter'
    }

    export default {
        name: 'DocumentAttendance',
        components: { DocumentAttendanceDesktop },
        data() {
            return {
                event,
                data: {
                    employees: [],
                    attendances: []
                },
                loadingStatus: {
                    employees: false,
                    attendance: true
                },
                attendanceDataRequest: {
                    Limit: 20
                }
            }
        },
        computed: {
            loading: function () {
                let status = false
                for (let key of Object.keys(this.loadingStatus)) {
                    if (!this.loadingStatus[key]) {
                        status = true
                        break
                    }
                }

                return status
            }
        },
        created() {
            this.loadEmployees()
        },
        methods: {
            loadEmployees() {
                this.$axios.$get(process.env.apiBaseUrl + '/employee/getall')
                    .then((response) => {
                        this.data.employees = response.body
                    })
                    .catch((e) => {
                        this.$notification.error({
                            message: 'Error!',
                            description: 'Ha ocurrido un error en la obtención de los empleados. Si sigue teniendo este problema, contáctece con soporte.',
                            duration: 8
                        })
                    })
                    .finally(() => {
                        this.loadingStatus.employees = true
                    })
            },
            loadAttendances() {
                this.loadingStatus.attendance = false

                this.$axios.$post(process.env.apiBaseUrl + '/employee/attendance/get-filtered', this.attendanceDataRequest)
                    .then((response) => {
                        response.body.forEach((e) => {
                            if (!this.existsAttendanceAlready(e))
                                this.data.attendances.push(e)
                        })

                        if (response.LastEvaluatedKey) {
                            this.attendanceDataRequest.Limit = 10
                            this.attendanceDataRequest['LastEvaluatedKey'] = response.LastEvaluatedKey
                        }
                    })
                    .catch((e) => {
                        this.$notification.error({
                            message: 'Error!',
                            description: 'Ha ocurrido un error en la obtención de los empleados. Si sigue teniendo este problema, contáctece con soporte.',
                            duration: 8
                        })
                    })
                    .finally(() => {
                        this.loadingStatus.attendance = true
                    })
            },
            existsAttendanceAlready(attendance) {
                let element = this.data.attendances.find((e) => {
                    return e.rut === attendance.rut && e.entry_date === attendance.entry_date && e.exit_date === attendance.exit_date
                })

                return element !== undefined
            },
            onEmit(event) {
                switch (event.type) {
                    case this.event.GET: {
                        this.loadAttendances()
                        break
                    }

                    case this.event.FILTER: {
                        this.data.attendances = []
                        this.loadAttendances()
                        break
                    }
                }
            }
        }
    }
</script>

<style scoped>

</style>
