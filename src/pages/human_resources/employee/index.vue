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
                this.$axios.$get('https://1nmeia9rt8.execute-api.us-east-2.amazonaws.com/beta/Tefcom-getAllEmployees')
                    .then((response) => {
                        this.data.employees = response.body
                    })
                    .catch((e) => {
                        this.$notification.error({
                            message: 'Error',
                            description: 'Ha ocurrido un error en la obtención de los empleados, inténtelo nuevamente. Si sigue teniendo este problema, contáctece con soporte.',
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
                        console.log('Add', event.body)
                        break
                    }

                    case this.event.EDIT: {
                        console.log('Edit', event.body)
                        break
                    }

                    case this.event.DELETE: {
                        console.log('Delete', event.body)
                        break
                    }
                }
            }
        }
    }
</script>
