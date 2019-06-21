<template>
    <div>
        <a-collapse v-if="budget.jobs.length > 0">
            <!--JOBS-->
            <a-collapse-panel v-for="(job, index) of budget.jobs" :key="index" :header="job.name">
                <a-row class="resume-job-row" :gutter="10">
                    <a-col :span="6">
                        <label for="total-employee">Subtotal Empleados</label>
                        <a-input-number
                            id="total-employee"
                            :value="calculateTotalEmployees(job)"
                            :formatter="value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                            :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                            style="width: 100%; color: black"
                            disabled
                        />
                    </a-col>

                    <a-col :span="6">
                        <label for="total-material">Subtotal Materiales</label>
                        <a-input-number
                            id="total-material"
                            :value="calculateTotalMaterials(job)"
                            :formatter="value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                            :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                            style="width: 100%; color: black"
                            disabled
                        />
                    </a-col>

                    <a-col :span="6">
                        <label for="total-others">Subtotal Conceptos</label>
                        <a-input-number
                            id="total-others"
                            v-model="job.subtotal.others"
                            :formatter="value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                            :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                            style="width: 100%; color: black"
                            disabled
                        />
                    </a-col>

                    <a-col :span="6">
                        <a-tooltip>
                            <template slot="title">
                                Valor total del trabajo. No incluye IVA.
                            </template>
                            <label for="total">Total Neto</label>
                            <a-input-number
                                id="total"
                                :value="calculateTotalJob(job)"
                                :formatter="value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                                :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                                style="width: 100%; color: black"
                                disabled
                            />
                        </a-tooltip>
                    </a-col>
                </a-row>

                <a-tabs default-active-key="1" tab-position="left">
                    <a-tab-pane key="1" tab="Configuración">
                        <job-config-tab :job="job" :index="index" :budget-jobs-list="budget.jobs" />
                    </a-tab-pane>
                    <a-tab-pane key="2" tab="Empleados">
                        <hhrr-section :data="data.employees" :job="job" />
                    </a-tab-pane>
                    <a-tab-pane key="3" tab="Materiales">
                        <material-section :data="data.materials" :job="job" />
                    </a-tab-pane>
                    <a-tab-pane key="4" tab="Otros Conceptos">
                        Content of tab 4
                    </a-tab-pane>
                </a-tabs>
            </a-collapse-panel>
        </a-collapse>
    </div>
</template>

<script>
    import JobConfigTab from './JobConfigTab'
    import HhrrSection from './HhrrSection'
    import MaterialSection from './MaterialSection'

    export default {
        name: 'JobsSection',
        components: { MaterialSection, JobConfigTab, HhrrSection },
        props: {
            budget: {
                required: true
            },
            data: {
                required: true
            }
        },
        methods: {
            /**
             * Calcula el total del trabajo.
             */
            calculateTotalJob(job) {
                return (job.subtotal.employees + job.subtotal.materials + job.subtotal.others) * job.count
            },
            /**
             * Calcula el total de la mano de obra.
             */
            calculateTotalEmployees(job) {
                let total = 0
                job.employees.forEach((e) => {
                    total += e.total * job.days_est
                })
                job.subtotal.employees = parseFloat(total.toFixed(2))
                return job.subtotal.employees
            },
            /**
             * Calcula el total de los materiales.
             */
            calculateTotalMaterials(job) {
                let total = 0
                job.materials.forEach((e) => {
                    total += e.total
                })
                job.subtotal.materials = parseFloat(total.toFixed(2))
                return job.subtotal.materials
            }
        }
    }
</script>

<style scoped>

</style>
