function structure_test(structure, fields) {
    let bad_fields = []
    fields.forEach(element => {
        let param = structure[element]
        if(param === undefined) bad_fields.push(element)
    })
    return bad_fields.join(', ')
}
function array_test(array, name, regex) {
    try {
        let bad_fields = []
        array.forEach((e, i, arr) => {
            let s = e.toString()
            let f = s.match(regex).join()
            if(f.length !== s.length) bad_fields.push(`${name}[${i}] = ${e}`)
        })
        return bad_fields.join(', ')
    }
    catch {
        return `Field ${name} is not array`
    }
}

module.exports = {
    structure_test,
    array_test
}