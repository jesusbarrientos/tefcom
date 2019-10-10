<template>
    <div class="job-content">
        <a-row type="flex" :gutter="10" align="bottom">
            <a-col :span="16">
                <label for="name">Nombre del Trabajo</label>
                <a-input id="name" v-model="job.name" @change="setValue(job, 'name')" />
            </a-col>

            <a-col :span="4">
                <a-tooltip>
                    <template slot="title">
                        Tiempo estimado que se espera en terminar este trabajo en días. Este siempre se debe redondear hacia arriba.
                        Por ejemplo, si un trabajo se estima que se puede completar en un cuarto de día (0,25), entonces se colocaría un 1.
                    </template>
                    <label>Días Estimados</label>
                    <a-input-number
                        v-model="job.days_est"
                        :default-value="1"
                        :min="1"
                        :precision="0"
                        style="width: 100%"
                        @change="validateMinDays"
                    />
                </a-tooltip>
            </a-col>

            <a-col :span="4">
                <a-tooltip>
                    <template slot="title">
                        Es probable que una cierta tarea se deba repetir. Por ejemplo, mantención de varios servidores del
                        mismo tipo, marca o modelo.
                    </template>
                    <label>Cantidad</label>
                    <a-input-number
                        v-model="job.count"
                        :default-value="1"
                        :min="1"
                        :precision="0"
                        style="width: 100%"
                        @change="validateMinCount"
                    />
                </a-tooltip>
            </a-col>
        </a-row>

        <a-row>
            <a-col>
                <label for="description">Descripción</label>
                <a-textarea id="description" v-model="job.description" placeholder="El trabajo consiste en..." :autosize="{ minRows: 6, maxRows: 10 }" @change="setValue(job, 'description')" />
            </a-col>
        </a-row>

        <a-row>
            <a-col>
                <a-popconfirm title="¿Estás seguro de querer eliminar este trabajo?" ok-text="Si" cancel-text="No" @confirm="deleteJob">
                    <a-button type="danger" block>
                        Eliminar Trabajo
                    </a-button>
                </a-popconfirm>
            </a-col>
        </a-row>
    </div>
</template>

<script>
    export default {
        name: 'JobConfigTab',
        props: {
            budgetJobsList: {
                required: true
            },
            job: {
                required: true
            },
            index: {
                required: true
            }
        },
        methods: {
            validateMinDays(value) {
                if (!value)
                    this.job.days_est = 1
            },
            validateMinCount(value) {
                if (!value)
                    this.job.count = 1
            },
            deleteJob() {
                this.budgetJobsList.splice(this.index, 1)
            },
            setValue(job, attr) {
                switch (attr) {
                    case 'name': {
                        if (job.name === '')
                            job.name = undefined
                        break
                    }

                    case 'description': {
                        if (job.description === '')
                            job.description = undefined
                        break
                    }
                }
            }
        }
    }
</script>

<style scoped>

</style>
