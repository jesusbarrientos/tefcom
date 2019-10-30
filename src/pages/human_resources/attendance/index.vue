<template>
    <div>
        <mq-layout mq="desktop">
            <attendance-desktop :body="data" :body-data="bodyData" :loading="loading" :event="event" @emit="onEmit($event)" />
        </mq-layout>

        <mq-layout :mq="['mobile', 'tablet']" />

        <edit-attendance :show="showEditComponent" :event="event" @emit="onEmit($event)" />

        <a-modal :visible="confirmVisible" :closable="false" :centered="true">
            <template slot="title">
                <div style="display: flex">
                    <a-icon type="question-circle" style="color: #ffcf00; font-size: 1.2rem; margin: 2px 10px 0 0" />
                    <h4>{{ confirmData.title }}</h4>
                </div>
            </template>

            <p align="center">
                {{ confirmData.content }}
            </p>

            <template slot="footer">
                <a-button key="cancel" @click="confirmData.onCancel">
                    {{ confirmData.cancelText }}
                </a-button>
                <a-button key="entry" type="primary" ghost @click="confirmData.onEntry">
                    {{ confirmData.entryText }}
                </a-button>
                <a-button key="exit" type="primary" @click="confirmData.onExit">
                    {{ confirmData.exitText }}
                </a-button>
            </template>
        </a-modal>
    </div>
</template>

<script>
    import moment from 'moment'
    import EditAttendance from '../../../components/edit-attendance/index'
    import AttendanceDesktop from './desktop/index'

    const event = {
        GET: 'get',
        REGISTER: 'register',
        EDIT: 'edit',
        CONFIRM_EDIT: 'confirm_edit',
        SHOW_EDIT: 'show_edit',
        DELETE: 'delete'
    }

    const data = {
        employees: [],
        attendances: []
    }

    const bodyData = {
        rut: undefined,
        date: undefined,
        use_as_exit: false,
        new_attendance: true
    }

    export default {
        name: 'Attendance',
        components: { EditAttendance, AttendanceDesktop },
        data() {
            return {
                data,
                bodyData,
                event,
                loadingStatus: {
                    employees: false,
                    attendance: false,
                    register: true
                },
                confirmVisible: false,
                confirmData: {},
                attendanceDataRequest: {
                    Limit: 20
                },
                showEditComponent: false
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
            this.loadData()
        },
        methods: {
            async loadData() {
                this.loadEmployees()
            },
            loadEmployees() {
                this.$axios.$get(process.env.apiBaseUrl + '/employee/getall')
                    .then((response) => {
                        this.data.employees = response.body
                        this.loadAttendances()
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

                this.$axios.$post(process.env.apiBaseUrl + '/employee/attendance/getall', this.attendanceDataRequest)
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
            /**
             * Método que captura los eventos creados por los hijos.
             * @param event
             */
            onEmit(event) {
                switch (event.type) {
                    case this.event.GET: {
                        this.loadAttendances()
                        break
                    }

                    case this.event.REGISTER: {
                        event.callback(this.addAttendance(event.body))
                        break
                    }

                    case this.event.EDIT: {
                        this.showEditModal(event.body)
                        break
                    }

                    case this.event.CONFIRM_EDIT: {
                        event.callback(this.editAttendance())
                        break
                    }

                    case this.event.SHOW_EDIT: {
                        this.$store.commit('attendance/reset')
                        this.showEditComponent = false
                        break
                    }

                    case this.event.DELETE: {
                        this.deleteAttendance(event.body)
                        break
                    }
                }
            },
            addAttendance(request) {
                this.loadingStatus.register = false

                return new Promise((resolve, reject) => {
                    this.$axios.$post(process.env.apiBaseUrl + '/employee/attendance/register', request)
                        .then((response) => {
                            // Exito en el registro
                            if (response.ok) {
                                if (!response.confirm) {
                                    this.$notification.success({
                                        message: 'Registro Exitoso!',
                                        description: response.message
                                    })

                                    resolve(null)

                                    this.data.attendances = []
                                    this.loadAttendances()
                                } else {
                                    let self = this

                                    this.confirmData = {
                                        title: response.message,
                                        content: 'Fecha Pendiente: ' + moment(response.body.date).format('DD-MM-YYYY'),
                                        exitText: 'Registrar como salida',
                                        entryText: 'Registrar como entrada',
                                        cancelText: 'Cancelar',
                                        onExit() {
                                            self.confirmVisible = false
                                            resolve(true)
                                        },
                                        onEntry() {
                                            self.confirmVisible = false
                                            resolve(false)
                                        },
                                        onCancel() {
                                            self.confirmVisible = false
                                            resolve(null)
                                        }
                                    }

                                    this.confirmVisible = true
                                }
                            } else {
                                this.$notification.error({
                                    message: 'Error!',
                                    description: response.message,
                                    duration: 8
                                })

                                reject()
                            }
                        })
                        .catch(() => {
                            this.$notification.error({
                                message: 'Error!',
                                description: 'Ha ocurrido un error en la petición, inténtelo nuevamente. Si sigue teniendo este problema, contáctece con soporte.',
                                duration: 8
                            })

                            reject()
                        })
                        .finally(() => {
                            this.loadingStatus.register = true
                        })
                })
            },
            editAttendance() {
                return new Promise((resolve, reject) => {
                    const request = {
                        rut: this.$store.state.attendance.rut,
                        old_date: this.$store.state.attendance.old_date.toISOString(),
                        entry: this.$store.state.attendance.entry.toISOString(),
                        exit: this.$store.state.attendance.exit ? this.$store.state.attendance.exit.toISOString() : undefined
                    }

                    this.$axios.$post(process.env.apiBaseUrl + '/employee/attendance/edit', request)
                        .then((response) => {
                            // Exito en el registro
                            if (response.ok) {
                                this.$notification.success({
                                    message: 'Edición Exitosa!',
                                    description: response.message
                                })

                                resolve()

                                this.$store.commit('attendance/reset')
                                this.data.attendances = []
                                this.loadAttendances()
                            } else {
                                this.$notification.error({
                                    message: 'Error!',
                                    description: response.message,
                                    duration: 8
                                })

                                reject()
                            }
                        })
                        .catch(() => {
                            this.$notification.error({
                                message: 'Error!',
                                description: 'Ha ocurrido un error en la petición, inténtelo nuevamente. Si sigue teniendo este problema, contáctece con soporte.',
                                duration: 8
                            })

                            reject()
                        })
                })
            },
            deleteAttendance(record) {
                this.loadingStatus.register = false

                const date = this.getFullDate(record.entry_date, record.entry_hour)

                const request = {
                    rut: record.rut,
                    date: date.toISOString()
                }

                this.$axios.$post(process.env.apiBaseUrl + '/employee/attendance/delete', request)
                    .then((response) => {
                        if (response.ok) {
                            this.$notification.success({
                                message: 'Registro Eliminado!',
                                description: response.message
                            })

                            this.data.attendances = []
                            this.loadAttendances()
                        } else {
                            this.$notification.error({
                                message: 'Error!',
                                description: response.message,
                                duration: 8
                            })
                        }
                    })
                    .catch(() => {
                        this.$notification.error({
                            message: 'Error!',
                            description: 'Ha ocurrido un error en la petición, inténtelo nuevamente. Si sigue teniendo este problema, contáctece con soporte.',
                            duration: 8
                        })
                    })
                    .finally(() => {
                        this.loadingStatus.register = true
                    })
            },
            showEditModal(record) {
                let entry = this.getFullDate(record.entry_date, record.entry_hour)
                let exit = this.getFullDate(record.exit_date, record.exit_hour)

                this.$store.commit('attendance/setAttendance', {
                    rut: record.rut,
                    employee: record.employee,
                    old_date: entry,
                    entry: entry,
                    exit: exit
                })

                this.showEditComponent = true
            },
            getFullDate(date, time) {
                let dateArray = date.split('-')
                return moment(`${dateArray[2]}-${dateArray[1]}-${dateArray[0]} ${time}`)
            }
        }
    }
</script>
