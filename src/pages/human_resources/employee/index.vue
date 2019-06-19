<template>
    <div>
        <mq-layout mq="desktop">
            <employee-desktop :data="data" :loading-data="loadingStatus" :events="event" @emit="onEmit($event)" />
        </mq-layout>

        <mq-layout :mq="['mobile', 'tablet']">
            <employee-mobile />
        </mq-layout>
    </div>
</template>

<script>
    import EmployeeDesktop from './desktop/index'
    import EmployeeMobile from './mobile/index'

    const data = {
        employees: []
    }
    const event = {
        CREATE: 'create',
        EDIT: 'edit',
        DELETE: 'delete'
    }

    export default {
        name: 'Employee',
        components: { EmployeeMobile, EmployeeDesktop },
        data() {
            return {
                data,
                event,
                loadingStatus: true
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
                    case this.event.CREATE: {
                        event.callback(this.addEmployee(event.body))
                        break
                    }

                    case this.event.EDIT: {
                        event.callback(this.editEmployee(event.body))
                        break
                    }

                    case this.event.DELETE: {
                        this.deleteEmployee(event.body)
                        break
                    }
                }
            },
            addEmployee(request) {
                return new Promise((resolve, reject) => {
                    this.$axios.$put(process.env.apiBaseUrl + '/employee/new', request)
                        .then((response) => {
                            // Exito en el registro
                            if (response.ok) {
                                this.$notification.success({
                                    message: 'Registro Exitoso!',
                                    description: response.message
                                })

                                this.loadEmployees()

                                resolve(null)
                            } else {
                                this.$notification.error({
                                    message: 'Error!',
                                    description: response.message,
                                    duration: 8
                                })

                                reject(null)
                            }
                        })
                        .catch(() => {
                            this.$notification.error({
                                message: 'Error!',
                                description: 'Ha ocurrido un error en la petición, inténtelo nuevamente. Si sigue teniendo este problema, contáctece con soporte.',
                                duration: 8
                            })

                            reject(null)
                        })
                })
            },
            deleteEmployee(request) {
                this.loadingStatus = true

                this.$axios.$post(process.env.apiBaseUrl + '/employee/delete', request)
                    .then((response) => {
                        // Exito en la eliminación
                        if (response.ok) {
                            this.$notification.success({
                                message: 'Eliminación Exitosa!',
                                description: response.message
                            })

                            this.loadEmployees()
                        } else {
                            this.$notification.error({
                                message: 'Error!',
                                description: response.message,
                                duration: 8
                            })

                            this.loadingStatus = false
                        }
                    })
                    .catch(() => {
                        this.$notification.error({
                            message: 'Error!',
                            description: 'Ha ocurrido un error en la petición, inténtelo nuevamente. Si sigue teniendo este problema, contáctece con soporte.',
                            duration: 8
                        })

                        this.loadingStatus = false
                    })
            },
            editEmployee(request) {
                const parsedRequest = {
                    key: {
                        id: 'rut',
                        value: request.rut
                    },
                    editable: []
                }

                // Agrega atributos al request en formato correcto
                Object.keys(request).forEach((item) => {
                    if (item !== 'rut' && request[item]) {
                        parsedRequest.editable.push({
                            id: item,
                            value: request[item]
                        })
                    }
                })

                return new Promise((resolve, reject) => {
                    this.$axios.post(process.env.apiBaseUrl + '/employee/edit', parsedRequest)
                        .then((response) => {
                            // Exito en la modificación
                            if (response.data.ok) {
                                this.$notification.success({
                                    message: 'Modificación Exitosa!',
                                    description: response.data.message
                                })

                                this.loadEmployees()

                                resolve(null)
                            } else {
                                this.$notification.error({
                                    message: 'Error!',
                                    description: response.message,
                                    duration: 8
                                })

                                reject(null)
                            }
                        })
                        .catch(() => {
                            this.$notification.error({
                                message: 'Error!',
                                description: 'Ha ocurrido un error en la petición, inténtelo nuevamente. Si sigue teniendo este problema, contáctece con soporte.',
                                duration: 8
                            })

                            reject(null)
                        })
                })
            }
        }
    }
</script>
