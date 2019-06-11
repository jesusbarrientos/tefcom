<template>
    <div id="employee-page-mobile">

        <!--CONTENT AREA-->
        <div id="employee-list-scroll-area" class="content-area" infinite-wrapper>
            <p v-for="d of data">
                {{ d.name }}
            </p>

            <infinite-loading @infinite="infiniteHandler" />
        </div>

        <!--BUTTON AREA-->
        <div class="new-employee">
            <a-button type="primary" block>
                Nuevo Empleado
            </a-button>
        </div>
    </div>
</template>

<script>
    import InfiniteLoading from 'vue-infinite-loading'

    export default {
        name: 'EmployeeMobile',
        components: { InfiniteLoading },
        data() {
            return {
                data: [
                    { name: 'Inicio' }
                ],
                last: 0
            }
        },
        methods: {
            infiniteHandler($state) {
                let aux = 0

                for (let i = this.last; i < this.last + 10; i++) {
                    this.data.push({ name: i++ })
                    aux = i
                }

                this.last = aux
                $state.loaded()
            }
        }
    }
</script>

<style scoped>

</style>
