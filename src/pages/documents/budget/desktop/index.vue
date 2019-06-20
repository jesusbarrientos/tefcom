<template>
    <div id="budget-page-desktop">
        <a-back-top />

        <a-row type="flex" justify="center">
            <a-col :span="20">
                <a-card title="Generar Cotización" :bordered="false">
                    <!--EXTRA-->
                    <div slot="extra">
                        <a-button size="small" type="primary">
                            Cargar
                        </a-button>
                        <a-button size="small" type="primary" @click="exportToJsonFile">
                            Guardar
                        </a-button>
                        <a-button size="small" type="primary">
                            Imprimir
                        </a-button>
                    </div>

                    <!--GLOBAL DATA-->
                    <a-divider orientation="left">
                        Datos Globales
                    </a-divider>

                    <a-row :gutter="10">
                        <a-col :span="3">
                            <label for="badget-number">Número de Cotización</label>
                            <a-input-number id="badget-number" v-model="budget.number" :min="1" style="width: 100%" />
                        </a-col>

                        <a-col :span="3">
                            <label for="badget-date">Fecha de Solicitud</label>
                            <a-date-picker id="badget-date" v-model="budget.date" format="DD-MM-YYYY" placeholder="" style="width: 100%" />
                        </a-col>

                        <a-col :span="3">
                            <a-tooltip>
                                <template slot="title">
                                    Tiempo que es válida esta cotización una vez que es entregada al cliente.
                                </template>
                                <label for="badget-duration">Duración de Cotización</label>
                                <a-input-number id="badget-duration" v-model="budget.duration" :min="1" style="width: 100%" />
                            </a-tooltip>
                        </a-col>

                        <a-col :span="4" :offset="3">
                            <label for="total_neto">Total Neto</label>
                            <a-input-number
                                id="total_neto"
                                :value="calculateTotalNeto()"
                                :formatter="value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                                :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                                :precision="2"
                                style="width: 100%; color: black"
                                disabled
                            />
                        </a-col>

                        <a-col :span="4">
                            <label for="total_iva">IVA 19%</label>
                            <a-input-number
                                id="total_iva"
                                :value="calculateTotalIVA()"
                                :formatter="value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                                :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                                :precision="2"
                                style="width: 100%; color: black"
                                disabled
                            />
                        </a-col>

                        <a-col :span="4">
                            <label for="total">Valor Total</label>
                            <a-input-number
                                id="total"
                                :value="calculateTotal()"
                                :formatter="value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                                :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                                :precision="2"
                                style="width: 100%; color: black"
                                disabled
                            />
                        </a-col>
                    </a-row>

                    <!--CLIENT-->
                    <a-divider orientation="left">
                        Cliente
                    </a-divider>

                    <a-row :gutter="10">
                        <a-col :span="8">
                            <label for="badget-company">Nombre Empresa</label>
                            <a-input id="badget-company" v-model="budget.client.company" />
                        </a-col>

                        <a-col :span="4">
                            <label for="badget-rut">Rut</label>
                            <a-input id="badget-rut" v-model="budget.client.rut" v-mask="Mask.rut" />
                        </a-col>

                        <a-col :span="8">
                            <label for="badget-contact">Contacto</label>
                            <a-input id="badget-contact" v-model="budget.client.contact" />
                        </a-col>

                        <a-col :span="4">
                            <label for="badget-phone">Teléfono</label>
                            <a-input id="badget-phone" v-model="budget.client.phone" />
                        </a-col>
                    </a-row>

                    <a-row :gutter="10">
                        <a-col :span="6">
                            <label for="badget-email">Correo Electrónico</label>
                            <a-input id="badget-email" v-model="budget.client.email" />
                        </a-col>

                        <a-col :span="7">
                            <label for="badget-address">Dirección</label>
                            <a-input id="badget-address" v-model="budget.client.address" />
                        </a-col>

                        <a-col :span="4">
                            <label for="badget-city">Comuna</label>
                            <a-select
                                id="badget-city"
                                show-search
                                :value="budget.client.comuna"
                                :default-active-first-option="false"
                                :show-arrow="false"
                                :filter-option="false"
                                :not-found-content="null"
                                class="city-select"
                                @search="onSearchCity"
                                @select="onSelectCity"
                            >
                                <a-select-option v-for="c in comunas" :key="c.nombre">
                                    {{ c.nombre }}
                                </a-select-option>
                            </a-select>
                        </a-col>

                        <a-col :span="3">
                            <label for="badget-discount">Descuento</label>
                            <a-input-number
                                id="badget-discount"
                                v-model="budget.client.discount"
                                :min="0"
                                :max="100"
                                :formatter="value => `${value}%`"
                                :parser="value => value.replace('%', '')"
                                style="width: 100%"
                            />
                        </a-col>

                        <a-col :span="4">
                            <label for="badget-payment">Tipo de Pago</label>
                            <a-input id="badget-payment" v-model="budget.client.paymentType" />
                        </a-col>
                    </a-row>

                    <!--DETAIL-->
                    <a-divider orientation="left">
                        Detalle
                    </a-divider>

                    <a-collapse>
                        <!--EMPLOYEES-->
                        <a-collapse-panel key="1" header="Mano de Obra">
                            <hhrr-section :data="data.employees" :budget="budget" />
                        </a-collapse-panel>

                        <!--MATERIALS-->
                        <a-collapse-panel key="2" header="Materiales">
                            <material-section :data="data.materials" :budget="budget" />
                        </a-collapse-panel>

                        <!--OTHERS CONCEPTS-->
                        <a-collapse-panel key="3" header="Otros Conceptos">
                            <other-section :budget="budget" />
                        </a-collapse-panel>

                        <!--PROCEDURE-->
                        <a-collapse-panel key="4" header="Procedimiento">
                            <a-textarea v-model="budget.procedure" placeholder="Procedimientos por parte de la mano de obra..." :autosize="{ minRows: 4, maxRows: 10 }" />
                        </a-collapse-panel>

                        <!--PAYMENTS-->
                        <a-collapse-panel key="5" header="Condiciones de Pago">
                            <a-textarea v-model="budget.payment_condition" placeholder="Condiciones de pago..." :autosize="{ minRows: 4, maxRows: 10 }" />
                        </a-collapse-panel>

                        <!--NOTES-->
                        <a-collapse-panel key="6" header="Notas">
                        </a-collapse-panel>
                    </a-collapse>
                </a-card>
            </a-col>
        </a-row>
    </div>
</template>

<script>
    import HhrrSection from '../../../../components/budget/HhrrSection'
    import MaterialSection from '../../../../components/budget/MaterialSection'
    import OtherSection from '../../../../components/budget/OtherSection'
    import Mask from '@/utils/mask.js'

    const comunas = []

    export default {
        name: 'BudgetDesktop',
        components: { OtherSection, MaterialSection, HhrrSection },
        props: {
            data: {
                required: true
            },
            budget: {
                required: true
            }
        },
        data() {
            return {
                Mask,
                comunas
            }
        },
        methods: {
            /**
             * Calcula el total neto del presupuesto.
             * @returns {number}
             */
            calculateTotalNeto() {
                const subtotal = this.budget.subtotal.employees + this.budget.subtotal.materials + this.budget.subtotal.others
                const total = subtotal * (1 - this.budget.client.discount / 100)
                this.budget.total = total
                return total
            },
            calculateTotalIVA() {
                return this.budget.total * 0.19
            },
            calculateTotal() {
                return this.budget.total + this.calculateTotalIVA()
            },
            onSearchCity(value) {
                this.comunas = this.data.comunas.filter((c) => {
                    return c.nombre.toLowerCase().indexOf(value.toLowerCase()) > -1
                })
            },
            onSelectCity(value) {
                this.budget.client.comuna = value
            },
            exportToJsonFile() {
                const dataStr = JSON.stringify(this.budget)
                const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr)

                const now = new Date()
                const date = new Date(this.budget.date)
                const day = date.getDate()
                const month = date.getMonth() + 1
                const year = date.getFullYear()
                const hour = now.getHours()
                const min = now.getMinutes()

                const exportFileDefaultName = `cot_${day}${month}${year}_${hour}${min}.json`

                const linkElement = document.createElement('a')
                linkElement.setAttribute('href', dataUri)
                linkElement.setAttribute('download', exportFileDefaultName)
                linkElement.click()
                linkElement.remove()
            }
        }
    }
</script>

<style scoped>
    .city-select {
        width: 100%;
    }
</style>
