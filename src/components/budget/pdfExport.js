
function setAPI(API) {
    API.myText = function (txt, options, x, y) {
        options = options || {}
        /* Use the options align property to specify desired text alignment
         * Param x will be ignored if desired text alignment is 'center'.
         * Usage of options can easily extend the function to apply different text
         * styles and sizes
        */
        if (options.align === 'center') {
            // Get current font size
            let fontSize = this.internal.getFontSize()

            // Get page width
            let pageWidth = this.internal.pageSize.width

            // Get the actual text's width
            /* You multiply the unit width of your string by your font size and divide
             * by the internal scale factor. The division is necessary
             * for the case where you use units other than 'pt' in the constructor
             * of jsPDF.
            */
            let txtWidth = this.getStringUnitWidth(txt) * fontSize / this.internal.scaleFactor

            // Calculate text's x coordinate
            x = (pageWidth - txtWidth) / 2
        }

        // Draw text at x,y
        this.text(txt, x, y)
    }
}

/**
 * Imprime PDF para la cotización del cliente.
 * @param budget
 */
export function exportBudgetPDF(budget) {
    if (process.browser) {
        const JsPDF = require('jspdf')
        require('jspdf-autotable')

        setAPI(JsPDF.API)

        const doc = new JsPDF({
            orientation: 'portrait',
            unit: 'px',
            format: 'letter'
        })

        generateBudgetPDF(budget, doc)
        doc.save('COT-' + budget.number + '.pdf')
    }
}

/**
 * Genera PDF para la cotización del cliente.
 * @param budget
 * @param doc
 */
function generateBudgetPDF(budget, doc) {
    doc.myText('Tefcom', { align: 'center' }, 1, 20)

    const jobs = []
    budget.jobs.forEach((j, index) => {
        jobs.push({
            id: index + 1,
            name: j.name,
            count: j.count.toString(),
            total: (j.subtotal.employees + j.subtotal.materials + j.subtotal.others).toString()
        })
    })

    // Tabla de trabajos
    if (jobs.length > 0) {
        const table = {
            headers: [
                {
                    'dataKey': 'id',
                    'header': 'Item'
                },
                {
                    'dataKey': 'name',
                    'header': 'Descripción'
                },
                {
                    'dataKey': 'count',
                    'header': 'Cantidad'
                },
                {
                    'dataKey': 'total',
                    'header': 'Total Neto Unitario'
                }
            ],
            data: jobs,
            option: {
                printHeaders: true
            }
        }

        doc.autoTable({
            columns: table.headers,
            body: table.data
        })
    }

    doc.text('Footer', 20, doc.lastAutoTable.finalY + 20)
}
