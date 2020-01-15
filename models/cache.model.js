var mongoose = require('mongoose');


var Schema = mongoose.Schema;

var recordsCacheSchema = new Schema({
    key:  { type: String, required: true },
    value:  { type: String, required: true }
});


const RecordsCache = mongoose.model('RecordsCache', recordsCacheSchema);
module.exports = RecordsCache;
