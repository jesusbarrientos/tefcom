<template>
    <div>
        <mq-layout mq="desktop">
            <attendance-desktop :view-data="viewData" @event="onEmit($event)" />
        </mq-layout>

        <mq-layout :mq="['mobile', 'tablet']">
            <attendance-mobile :view-data="viewData" @event="onEmit($event)" />
        </mq-layout>
    </div>
</template>

<script>
    import moment from 'moment'
    import AttendanceDesktop from './desktop/index'
    import AttendanceMobile from './mobile/index'

    const viewData = {
        event: {
            GET: 'get',
            REGISTER: 'register',
            EDIT: 'edit',
            SHOW_EDIT: 'show_edit',
            DELETE: 'delete'
        },
        data: {
            employees: [],
            attendances: []
        },
        bodyData: {
            rut: undefined,
            date: undefined,
            use_as_exit: false,
            new_attendance: true
        },
        modal: {
            confirmAdd: {
                display: false,
                data: {}
            }
        }
    }

    export default {
        name: 'Attendance',
        components: { AttendanceMobile, AttendanceDesktop },
        data() {
            return {
                confirmVisible: false,
                confirmData: {},
                attendanceDataRequest: {
                    Limit: 20
                },
                showEditComponent: false,

                viewData
            }
        },
        created() {
            this.loadData()
        },
        methods: {
            async loadData() {
                await this.loadEmployees()
            },
            async loadEmployees() {
                this.$store.commit('spin/set', { show: true, tip: 'Obteniendo Empleados' })

                await this.$axios.$get(process.env.apiBaseUrl + '/employee/getall')
                    .then(async (response) => {
                        viewData.data.employees = response.body
                        await this.loadAttendances()
                    })
                    .catch((e) => {
                        this.$store.commit('alert/setState', {
                            type: 'error',
                            message: 'Error!',
                            description: 'Ha ocurrido un error en la obtención de los empleados. Si sigue teniendo este problema, contáctece con soporte.',
                            duration: 8
                        })
                    })
                    .finally(() => {
                        this.$store.commit('spin/reset')
                    })
            },
            async loadAttendances() {
                this.$store.commit('spin/set', { show: true, tip: 'Obteniendo Asistencias' })

                await this.$axios.$post(process.env.apiBaseUrl + '/employee/attendance/getall', this.attendanceDataRequest)
                    .then((response) => {
                        response.body.forEach((e) => {
                            if (!this.existsAttendanceAlready(e))
                                viewData.data.attendances.push(e)
                        })

                        if (response.LastEvaluatedKey) {
                            this.attendanceDataRequest.Limit = 10
                            this.attendanceDataRequest['LastEvaluatedKey'] = response.LastEvaluatedKey
                        }
                    })
                    .catch((e) => {
                        this.$store.commit('alert/setState', {
                            type: 'error',
                            message: 'Error!',
                            description: 'Ha ocurrido un error en la obtención de las asistencias. Si sigue teniendo este problema, contáctece con soporte.',
                            duration: 8
                        })
                    })
                    .finally(() => {
                        this.$store.commit('spin/reset')
                    })
            },
            existsAttendanceAlready(attendance) {
                let element = viewData.data.attendances.find((e) => {
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
                    case viewData.event.GET: {
                        this.loadAttendances()
                        break
                    }

                    case viewData.event.REGISTER: {
                        event.callback(this.addAttendance(event.body))
                        break
                    }

                    case viewData.event.EDIT: {
                        event.callback(this.editAttendance(event.body))
                        break
                    }

                    case viewData.event.DELETE: {
                        event.callback(this.deleteAttendance(event.body))
                        break
                    }
                }
            },

            /**
             * Llama a servicio de aws-api-gateway para registrar asistencia.
             * @param request
             */
            addAttendance(request) {
                this.$store.commit('spin/set', { show: true, tip: 'Registrando Asistencia' })

                return new Promise((resolve, reject) => {
                    this.$axios.$post(process.env.apiBaseUrl + '/employee/attendance/register', request)
                        .then((response) => {
                            // Exito en el registro
                            if (response.ok) {
                                if (!response.confirm) {
                                    resolve({
                                        message: 'Registro Exitoso!',
                                        description: response.message,
                                        duration: 3
                                    })

                                    viewData.data.attendances = []
                                    this.loadAttendances()
                                } else {
                                    viewData.modal.confirmAdd.data = {
                                        date: moment(response.body.date).format('DD-MM-YYYY'),
                                        onExit() {
                                            viewData.modal.confirmAdd.display = false
                                            resolve(true)
                                        },
                                        onEntry() {
                                            viewData.modal.confirmAdd.display = false
                                            resolve(false)
                                        },
                                        onCancel() {
                                            viewData.modal.confirmAdd.display = false
                                            resolve(null)
                                        }
                                    }

                                    viewData.modal.confirmAdd.display = true
                                    this.$store.commit('spin/reset')
                                }
                            } else {
                                reject({
                                    message: 'Error!',
                                    description: response.message,
                                    duration: 8
                                })

                                this.$store.commit('spin/reset')
                            }
                        })
                        .catch(() => {
                            reject({
                                message: 'Error!',
                                description: 'Ha ocurrido un error en la petición, inténtelo nuevamente. Si sigue teniendo este problema, contáctece con soporte.',
                                duration: 8
                            })

                            this.$store.commit('spin/reset')
                        })
                })
            },

            /**
             * Llama a servicio de aws-api-gateway para eliminar asistencia.
             * @param record
             * @returns {Promise<unknown>}
             */
            deleteAttendance(record) {
                this.$store.commit('spin/set', { show: true, tip: 'Eliminando Asistencia' })

                const request = {
                    rut: record.rut,
                    date: record.entry.toISOString()
                }

                return new Promise((resolve, reject) => {
                    this.$axios.$post(process.env.apiBaseUrl + '/employee/attendance/delete', request)
                        .then((response) => {
                            if (response.ok) {
                                resolve({
                                    message: 'Registro Eliminado!',
                                    description: response.message,
                                    duration: 3
                                })

                                viewData.data.attendances = []
                                this.loadAttendances()
                            } else {
                                reject({
                                    message: 'Error!',
                                    description: response.message,
                                    duration: 8
                                })

                                this.$store.commit('spin/reset')
                            }
                        })
                        .catch(() => {
                            reject({
                                message: 'Error!',
                                description: 'Ha ocurrido un error en la petición, inténtelo nuevamente. Si sigue teniendo este problema, contáctece con soporte.',
                                duration: 8
                            })

                            this.$store.commit('spin/reset')
                        })
                })
            },

            /**
             * Llama a servicio de aws-api-gateway para editar asistencia.
             * @param record
             * @returns {Promise<unknown>}
             */
            editAttendance(record) {
                this.$store.commit('spin/set', { show: true, tip: 'Editando Asistencia' })

                return new Promise((resolve, reject) => {
                    const request = {
                        rut: record.rut,
                        old_date: record.old_date.toISOString(),
                        entry: record.entry.toISOString(),
                        exit: record.exit != null ? record.exit.toISOString() : undefined
                    }

                    this.$axios.$post(process.env.apiBaseUrl + '/employee/attendance/edit', request)
                        .then((response) => {
                            // Exito en el registro
                            if (response.ok) {
                                resolve({
                                    message: 'Edición Exitosa!',
                                    description: response.message,
                                    duration: 3
                                })

                                viewData.data.attendances = []
                                this.loadAttendances()
                            } else {
                                reject({
                                    message: 'Error!',
                                    description: response.message,
                                    duration: 8
                                })

                                this.$store.commit('spin/reset')
                            }
                        })
                        .catch(() => {
                            reject({
                                message: 'Error!',
                                description: 'Ha ocurrido un error en la petición, inténtelo nuevamente. Si sigue teniendo este problema, contáctece con soporte.',
                                duration: 8
                            })

                            this.$store.commit('spin/reset')
                        })
                })
            }
        }
    }
</script>
