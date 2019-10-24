/**
 * Deja como undefined los valores vacios.
 * @param object
 */
export function parseRequest(object) {
    // Recorre los atributos del objeto
    if (object) {
        Object.keys(object).forEach((key) => {
            evaluateAttribute(object, key)
        })
    }
}

/**
 * Evalua que tipo de dato es el valor.
 * @param object
 * @param key
 */
function evaluateAttribute(object, key) {
    switch (typeof object[key]) {
        case 'string': {
            object[key] = (object[key] !== '') ? object[key] : undefined
            break
        }

        case 'object': {
            evaluateObject(object, key)
        }
    }
}

/**
 * Evalua que tipo de objeto es el valor.
 * @param object
 * @param key
 */
function evaluateObject(object, key) {
    const moment = require('moment')

    if (Array.isArray(object[key])) {
        object[key].forEach((e, k) => {
            evaluateAttribute(object[key], k)
        })
    } else if (!moment.isMoment(object[key]))
        parseRequest(object[key])
}

/**
 * Deja como mayusculas todos los string del objeto.
 * @param object
 * @param key
 */
export function stringToUppercase(object, key) {
    const voca = require('voca')

    // Recorre los atributos del objeto
    if (object) {
        Object.keys(object).forEach((k) => {
            if (typeof object[k] === 'string')
                object[k] = voca.upperCase(object[k])
        })
    }
}
