function structure_test(structure, fields) {
    let bad_fields = []
    fields.forEach(element => {
        let param = structure[element]
        if(param === undefined) bad_fields.push(element)
    })
    return bad_fields.join(', ')
}

module.exports = {
    structure_test
}