<template>
    <a-spin :spinning="loadingStatus" tip="Cargando...">

        <div id="budget-page-desktop">
            <a-back-top />

            <a-row type="flex" justify="center">
                <a-col :sm="{ span: 24 }" :xxl="{ span: 20 }">
                    <a-card title="Generar Cotización" :bordered="false">
                        <!--EXTRA-->
                        <div slot="extra">
                            <a-popconfirm title="Los cambios no guardados se sobrescribirán, ¿Desea continuar con la operación?" placement="bottomRight" ok-text="Si" cancel-text="No" @confirm="methods.newBudget()">
                                <a-button size="small" type="primary">
                                    Nueva
                                </a-button>
                            </a-popconfirm>
                            <a-button size="small" type="primary" @click="showModal">
                                Cargar
                            </a-button>
                            <a-button size="small" type="primary" @click="methods.saveBudget()">
                                Guardar
                            </a-button>
                            <no-ssr>
                                <a-button size="small" type="primary" @click="exportBudgetPDF(data.company, parsedBudget())">
                                    Generar PDF
                                </a-button>
                            </no-ssr>
                        </div>

                        <!--GLOBAL DATA-->
                        <a-divider orientation="left">
                            Datos Globales
                        </a-divider>

                        <a-row :gutter="10" type="flex" align="bottom">
                            <a-col :span="3">
                                <label for="badget-number">Número de Cotización</label>
                                <a-input-number id="badget-number" v-model="budget.number" :min="1" style="width: 100%; color: black;" disabled />
                            </a-col>

                            <a-col :span="4">
                                <label for="badget-date">Fecha de Solicitud</label>
                                <a-date-picker
                                    id="badget-date"
                                    v-model="budget.date"
                                    format="DD-MM-YYYY"
                                    placeholder=""
                                    :allow-clear="false"
                                    style="width: 100%"
                                    @change="dateChange"
                                />
                            </a-col>

                            <a-col :span="2">
                                <a-tooltip>
                                    <template slot="title">
                                        Tiempo que es válida esta cotización desde la fecha de solicitud.
                                    </template>
                                    <label for="badget-duration">Validez</label>
                                    <a-input-number id="badget-duration" v-model="budget.duration" :min="1" style="width: 100%" />
                                </a-tooltip>
                            </a-col>

                            <a-col :span="4" :offset="3">
                                <label for="total_neto">Total Neto</label>
                                <a-input-number
                                    id="total_neto"
                                    :value="budget.total.subtotal(budget)"
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
                                    :value="budget.total.iva(budget)"
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
                                    :value="budget.total.total(budget)"
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
                                <a-input id="badget-company" v-model="budget.client.company" @change="methods.setValue('client-company')" />
                            </a-col>

                            <a-col :span="4">
                                <label for="badget-rut">Rut</label>
                                <a-input id="badget-rut" v-model="budget.client.rut" v-mask="Mask.rut" @change="methods.setValue('client-rut')" />
                            </a-col>

                            <a-col :span="8">
                                <label for="badget-contact">Contacto</label>
                                <a-input id="badget-contact" v-model="budget.client.contact" @change="methods.setValue('client-contact')" />
                            </a-col>

                            <a-col :span="4">
                                <label for="badget-phone">Teléfono</label>
                                <a-input id="badget-phone" v-model="budget.client.phone" v-mask="Mask.phone" @change="methods.setValue('client-phone')" />
                            </a-col>
                        </a-row>

                        <a-row :gutter="10">
                            <a-col :span="6">
                                <label for="badget-email">Correo Electrónico</label>
                                <a-input id="badget-email" v-model="budget.client.email" @change="methods.setValue('client-email')" />
                            </a-col>

                            <a-col :span="7">
                                <label for="badget-address">Dirección</label>
                                <a-input id="badget-address" v-model="budget.client.address" @change="methods.setValue('client-address')" />
                            </a-col>

                            <a-col :span="4">
                                <label for="badget-city">Comuna</label>
                                <a-input id="badget-city" v-model="budget.client.comuna" @change="methods.setValue('client-comuna')" />
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
                                    @change="methods.setValue('client-discount')"
                                />
                            </a-col>

                            <a-col :span="4">
                                <label for="badget-payment">Tipo de Pago</label>
                                <a-input id="badget-payment" v-model="budget.client.paymentType" @change="methods.setValue('client-paymentType')" />
                            </a-col>
                        </a-row>

                        <!--DETAIL-->
                        <a-divider orientation="left">
                            Detalle
                        </a-divider>

                        <a-tabs default-active-key="1">
                            <a-tab-pane key="1" tab="Trabajos">
                                <jobs-section :budget="budget" :data="data" />

                                <a-row type="flex" justify="start" style="margin-top: 20px">
                                    <a-button type="primary" @click="addJob">
                                        Agregar Trabajo
                                    </a-button>
                                </a-row>
                            </a-tab-pane>
                            <a-tab-pane key="2" tab="Condición de Pago">
                                <a-textarea v-model="budget.payment_condition" placeholder="Condiciones de pago..." :autosize="{ minRows: 10, maxRows: 20 }" />
                            </a-tab-pane>
                            <a-tab-pane key="3" tab="Notas">
                                <a-textarea v-model="budget.notes" placeholder="Notas..." :autosize="{ minRows: 10, maxRows: 20 }" />
                            </a-tab-pane>
                        </a-tabs>

                        <!--MODALS-->
                        <a-modal
                            v-model="visibleModal"
                            title="Carga de Cotización"
                            :footer="null"
                        >
                            <a-form :form="formLoad">
                                <label for="load_number">Número de Cotización</label>
                                <a-form-item :required="false">
                                    <a-input-number
                                        id="load_number"
                                        v-decorator="[
                                            'id',
                                            {
                                                initialValue: 1,
                                                rules: [{ required: true, message: 'Ingrese un número de cotización!' }]
                                            }
                                        ]"
                                        :min="1"
                                        :max="maxId"
                                        :precision="0"
                                    />
                                </a-form-item>

                                <label for="load_format">Tipo de Carga</label>
                                <a-form-item :required="false">
                                    <a-select
                                        id="load_format"
                                        v-decorator="[
                                            'status',
                                            {
                                                initialValue: 'saved',
                                                rules: [{ required: true, message: 'Seleccione una opción!' }]
                                            }
                                        ]"
                                    >
                                        <a-select-option value="new">
                                            Generar nueva cotización a partir de una anterior.
                                        </a-select-option>
                                        <a-select-option value="saved">
                                            Modificar una cotización anterior.
                                        </a-select-option>
                                    </a-select>
                                </a-form-item>

                                <a-popconfirm title="Los cambios no guardados se sobrescribirán, ¿Desea continuar con la operación?" ok-text="Si" cancel-text="No" @confirm="loadBudget">
                                    <a-button type="primary">
                                        Cargar Cotización
                                    </a-button>
                                </a-popconfirm>
                            </a-form>
                        </a-modal>
                    </a-card>
                </a-col>
            </a-row>
        </div>
    </a-spin>
</template>

<script>
    import moment from 'moment'
    import HhrrSection from '../../../../components/budget/HhrrSection'
    import MaterialSection from '../../../../components/budget/MaterialSection'
    import OtherSection from '../../../../components/budget/OtherSection'
    import Mask from '@/utils/mask.js'
    import JobsSection from '../../../../components/budget/JobsSection'
    import { exportBudgetPDF } from '../../../../components/budget/pdfExport'

    const comunas = []

    export default {
        name: 'BudgetDesktop',
        components: { JobsSection, OtherSection, MaterialSection, HhrrSection },
        props: {
            data: {
                required: true
            },
            budget: {
                required: true
            },
            parsedBudget: {
                required: true
            },
            loadingStatus: {
                required: true
            },
            methods: {
                required: true
            }
        },
        data() {
            return {
                Mask,
                moment,
                exportBudgetPDF,
                comunas,
                visibleModal: false,
                formLoad: this.$form.createForm(this),
                maxId: 1
            }
        },
        methods: {
            addJob() {
                this.budget.jobs.push({
                    name: 'Trabajo Nuevo',
                    days_est: 1,
                    count: 1,
                    description: undefined,
                    subtotal: {
                        employees: 0,
                        materials: 0,
                        others: 0
                    },
                    total: 0,
                    employees: [],
                    materials: [],
                    others: []
                })
            },
            showModal() {
                this.methods.loadLastNumber()
                    .then((result) => {
                        setTimeout(() => {
                            this.formLoad.setFieldsValue({
                                id: result
                            })
                            this.maxId = result
                        }, 100)
                    })
                    .catch(() => {
                        setTimeout(() => {
                            this.formLoad.setFieldsValue({
                                id: 1
                            })
                            this.maxId = 1
                        }, 100)
                    })
                    .finally(() => {
                        this.visibleModal = true
                    })
            },
            loadBudget($event) {
                $event.preventDefault()

                if (this.formLoad.validateFields()) {
                    this.visibleModal = false
                    this.methods.loadBudget(this.formLoad.getFieldsValue())
                }
            },
            dateChange(date, dateString) {
                if (!dateString)
                    this.budget.date = moment(new Date())
            }
        }
    }
</script>

<style scoped>
    .city-select {
        width: 100%;
    }
</style>
