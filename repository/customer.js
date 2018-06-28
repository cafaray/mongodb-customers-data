const customerData = require('./m3-customer-data.json')
const customerAddres = require('./m3-customer-address-data.json')


var integrate = function(from, to) {    
    var array = []
    var x=0
    while (from<to){         
        if (from >= customerData.length) break
        customerData[from].country=customerAddres[from].country
        customerData[from].city=customerAddres[from].city
        customerData[from].state=customerAddres[from].state
        customerData[from].phone=customerAddres[from].phone
        array[x++]=customerData[from]
        from++
    }
    console.log('to: ' + to + '['+customerData.length+']')
    return array
};

module.exports.integrate = integrate;