const accounting = require('accounting');

module.exports = (totalCost, totalRuntime, pricePerMin)=>{
    const formattedPrice = accounting.formatMoney(pricePerMin)
    return `Price Per Min: ${formattedPrice}
###### Total Runtime: ${totalRuntime}
### Total Cost: ${totalCost}`
}