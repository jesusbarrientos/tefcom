<template>
    <div>
        <mq-layout mq="desktop">
            <material-desktop :data="data" :loading-data="loadingStatus" :events="event" @emit="onEmit($event)" />
        </mq-layout>

        <mq-layout :mq="['mobile', 'tablet']">
            <material-desktop :data="data" :loading-data="loadingStatus" :events="event" @emit="onEmit($event)" />
        </mq-layout>
    </div>
</template>

<script>
    import MaterialDesktop from './desktop'
    import MaterialMobile from './mobile'

    const data = []
    const event = {
        CREATE: 'create',
        EDIT: 'edit',
        DELETE: 'delete'
    }

    export default {
        name: 'Material',
        components: { MaterialMobile, MaterialDesktop },
        data() {
            return {
                data,
                event,
                loadingStatus: true
            }
        },
        created() {
            this.loadMaterials()
        },
        methods: {
            loadMaterials() {
                this.loadingStatus = true

                this.$axios.$get(process.env.apiBaseUrl + '/material/getall')
                    .then((response) => {
                        this.data = response.body
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
                        event.callback(this.addMaterial(event.body))
                        break
                    }

                    case this.event.EDIT: {
                        event.callback(this.editMaterial(event.body))
                        break
                    }

                    case this.event.DELETE: {
                        this.deleteMaterial(event.body)
                        break
                    }
                }
            },
            addMaterial(request) {
                const currentDate = new Date()
                const date = currentDate.getDate() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getFullYear() + '/' + currentDate.getHours() + ':' + currentDate.getMinutes() + ':' + currentDate.getSeconds()
                const parsedRequest = {
                    id: `${request.description},${request.category},${date}`,
                    ...request
                }

                return new Promise((resolve, reject) => {
                    this.$axios.$post(process.env.apiBaseUrl + '/material/new', parsedRequest)
                        .then((response) => {
                            // Exito en el registro
                            if (response.ok) {
                                this.$notification.success({
                                    message: 'Registro Exitoso!',
                                    description: response.message
                                })

                                this.loadMaterials()

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
            editMaterial(request) {
                const parsedRequest = {
                    key: {
                        id: 'description',
                        value: request.description
                    },
                    sort: {
                        id: 'category',
                        value: request.category
                    },
                    editable: [
                        {
                            id: 'suppliers',
                            value: request.suppliers
                        }
                    ]
                }

                return new Promise((resolve, reject) => {
                    this.$axios.post(process.env.apiBaseUrl + '/material/edit', parsedRequest)
                        .then((response) => {
                            // Exito en la modificación
                            if (response.data.ok) {
                                this.$notification.success({
                                    message: 'Modificación Exitosa!',
                                    description: response.data.message
                                })

                                this.loadMaterials()

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
            deleteMaterial(request) {
                this.loadingStatus = true

                this.$axios.$post(process.env.apiBaseUrl + '/material/delete', request)
                    .then((response) => {
                        // Exito en la eliminación
                        if (response.ok) {
                            this.$notification.success({
                                message: 'Eliminación Exitosa!',
                                description: response.message
                            })

                            this.loadMaterials()
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
            }
        }
    }
</script>

<style scoped>

</style>
