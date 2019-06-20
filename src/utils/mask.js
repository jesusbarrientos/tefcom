export default {
    phone: {
        mask: ['+(56) F ####-####', '+(56) FF ###-####'],
        tokens: {
            '#': {
                pattern: /[0-9]/
            },
            'F': {
                pattern: /[1-9]/
            }
        }
    },
    rut: {
        mask: ['F.###.###-V', 'F#.###.###-V'],
        tokens: {
            '#': {
                pattern: /[0-9]/
            },
            'V': {
                pattern: /[0-9kK]/,
                transform: v => v.toLocaleUpperCase()
            },
            'F': {
                pattern: /[1-9]/
            }
        }
    }
}
