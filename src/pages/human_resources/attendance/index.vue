<template>
    <div>
        <a-spin tip="Cargando..." :spinning="loadingStatus">
            <mq-layout mq="desktop">
                <attendance-desktop :body="data" :body-data="bodyData" :event="event" @emit="onEmit($event)" />
            </mq-layout>

            <mq-layout :mq="['mobile', 'tablet']" />
        </a-spin>

        <a-modal :visible="confirmVisible" :closable="false" :centered="true">
            <template slot="title">
                <div style="display: flex">
                    <a-icon type="question-circle" style="color: #ffcf00; font-size: 1.2rem; margin: 2px 10px 0 0"/>
                    <h4>{{ confirmData.title }}</h4>
                </div>
            </template>

            <p align="center">{{ confirmData.content }}</p>

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
    import AttendanceDesktop from './desktop/index'

    const event = {
        REGISTER: 'register'
    }

    const data = {
        employees: []
    }

    const bodyData = {
        rut: undefined,
        date: undefined,
        use_as_exit: false,
        new_attendance: true
    }

    export default {
        name: 'Attendance',
        components: { AttendanceDesktop },
        data() {
            return {
                data,
                bodyData,
                event,
                loadingStatus: true,
                confirmVisible: false,
                confirmData: {}
            }
        },
        created() {
            this.loadEmployees()
        },
        methods: {
            loadEmployees() {
                this.loadingStatus = true

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
                        this.loadingStatus = false
                    })
            },
            /**
             * Método que captura los eventos creados por los hijos.
             * @param event
             */
            onEmit(event) {
                switch (event.type) {
                    case this.event.REGISTER: {
                        event.callback(this.addAttendance(event.body))
                        break
                    }
                }
            },
            addAttendance(request) {
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
                })
            }
        }
    }
</script>
