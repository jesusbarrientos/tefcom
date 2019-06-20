<template>
    <div>
        <a-row v-for="(e, index) of budget.others" type="flex" justify="space-between">
            <a-col :span="20">
                <a-row type="flex" align="middle" :gutter="10">
                    <a-col :span="13">
                        <a-tooltip>
                            <template slot="title">
                                Descripción
                            </template>
                            <a-input v-model="e.description" placeholder="Descripción" />
                        </a-tooltip>
                    </a-col>

                    <a-col :span="4">
                        <a-tooltip>
                            <template slot="title">
                                Cantidad
                            </template>
                            <a-input-number v-model="e.count" :min="1" style="width: 100%" />
                        </a-tooltip>
                    </a-col>

                    <a-col :span="4">
                        <a-tooltip>
                            <template slot="title">
                                Precio
                            </template>
                            <a-input-number
                                v-model="e.price"
                                :formatter="value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                                :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                                :min="1"
                                style="width: 100%"
                            />
                        </a-tooltip>
                    </a-col>

                    <a-col :span="3">
                        <a-tooltip>
                            <template slot="title">
                                El precio incluye IVA
                            </template>
                            <a-checkbox @change="onChangeIva($event, e)">
                                IVA
                            </a-checkbox>
                        </a-tooltip>
                    </a-col>
                </a-row>
            </a-col>

            <a-button type="danger" @click="removeElement(index, budget.others)">
                Eliminar
            </a-button>
        </a-row>

        <a-row type="flex" justify="space-between" align="bottom">
            <a-col :span="5">
                <label for="total-other">Subtotal</label>
                <a-input-number
                    id="total-other"
                    :value="calculateTotalOthers()"
                    :formatter="value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                    :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                    style="width: 100%; color: black"
                    disabled
                />
            </a-col>

            <a-col :lg="{ span: 8 }" :xl="{ span: 5 }">
                <a-button type="primary" block @click="addOther()">
                    Agregar Concepto
                </a-button>
            </a-col>
        </a-row>
    </div>
</template>

<script>
    export default {
        name: 'OtherSection',
        props: {
            budget: {
                required: true
            }
        },
        methods: {
            /**
             * Agrega fila con nuevo concepto.
             */
            addOther() {
                this.budget.others.push({ description: '', price: 1, count: 1, include_iva: false })
            },
            /**
             * Evento para cambiar valor del check IVA.
             */
            onChangeIva($event, other) {
                other.include_iva = $event.target.checked
            },
            /**
             * Calcula el total de la lista de conceptos.
             */
            calculateTotalOthers() {
                let total = 0
                this.budget.others.forEach((o) => {
                    if (o.include_iva)
                        total += o.price * o.count
                    else
                        total += (o.price * 1.19) * o.count
                })
                this.budget.subtotal.others = total
                return total
            },
            /**
             * Quita un material de la lista para exportar (budget).
             */
            removeElement(index, list) {
                list.splice(index, 1)
            }
        }
    }
</script>

<style scoped>

</style>
