<template>
    <div class="job-content">
        <a-row v-for="(e, index) of job.others" type="flex" justify="space-between" align="bottom">
            <a-col :span="20">
                <a-row type="flex" :gutter="10" align="bottom">
                    <a-col :span="11">
                        <label for="other_description">Descripción</label>
                        <a-input id="other_description" v-model="e.description" placeholder="Descripción" @change="setValue(e, 'description')" />
                    </a-col>

                    <a-col :span="3">
                        <a-tooltip>
                            <template slot="title">
                                El precio se debe expresar en Pesos Chilenos (CLP).
                            </template>
                            <label for="other_price">Precio</label>
                            <a-input-number
                                id="other_price"
                                v-model="e.price"
                                :default-value="0"
                                :formatter="value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                                :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                                :precision="2"
                                :min="1"
                                @change="setValue(e, 'price')"
                            />
                        </a-tooltip>
                    </a-col>

                    <a-col :span="3">
                        <a-tooltip>
                            <template slot="title">
                                ¿El precio incluye IVA?
                            </template>
                            <label for="other_iva">IVA</label>
                            <a-select id="other_iva" v-model="e.include_iva" :default-value="0" style="width: 100%">
                                <a-select-option :value="1">
                                    Si
                                </a-select-option>

                                <a-select-option :value="0">
                                    No
                                </a-select-option>
                            </a-select>
                        </a-tooltip>
                    </a-col>

                    <a-col :span="3">
                        <label for="other_count">Cantidad</label>
                        <a-input-number id="other_count" v-model="e.count" :min="1" style="width: 100%" @change="setValue(e, 'count')" />
                    </a-col>

                    <a-col :span="3">
                        <label for="other-total">Total</label>
                        <a-input-number
                            id="other-total"
                            :value="calculateTotalOfOther(e)"
                            :formatter="value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                            :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                            :precision="2"
                            style="width: 100%; color: black"
                            disabled
                        />
                    </a-col>
                </a-row>
            </a-col>

            <a-col :span="4">
                <a-row type="flex" justify="end">
                    <a-button type="danger" @click="removeElement(index, job.others)">
                        Eliminar
                    </a-button>
                </a-row>
            </a-col>

            <a-divider />
        </a-row>

        <a-row type="flex" justify="end" align="bottom" class="bottom-bar-button">
            <a-button type="primary" @click="addOther()">
                Agregar Concepto
            </a-button>
        </a-row>
    </div>
</template>

<script>
    export default {
        name: 'OtherSection',
        props: {
            job: {
                required: true
            }
        },
        methods: {
            /**
             * Agrega fila con nuevo concepto.
             */
            addOther() {
                this.job.others.push({ description: '', price: 1, count: 1, include_iva: 0, total: 1 })
            },
            /**
             * Quita un material de la lista para exportar (job).
             */
            removeElement(index, list) {
                list.splice(index, 1)
            },
            /**
             * Calcula el total del concepto actual.
             */
            calculateTotalOfOther(e) {
                let total = 0
                if (e.include_iva)
                    total = e.price * e.count
                else
                    total = (e.price * 1.19) * e.count
                e.total = parseFloat(total.toFixed(2))
                return e.total
            },
            setValue(e, attr) {
                switch (attr) {
                    case 'description': {
                        if (e.description === '')
                            e.description = undefined
                        break
                    }
                    case 'count': {
                        if (!e.count)
                            e.count = 1
                        break
                    }
                    case 'price': {
                        if (!e.price)
                            e.price = 1
                        break
                    }
                }
            }
        }
    }
</script>

<style scoped>

</style>
