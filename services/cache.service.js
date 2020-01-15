var RecordsCache = require('../models/cache.model');
var utilities = require('../utilities/random_string_generator');
var logger = require('../utilities/logger');

var cacheService = {};

cacheService.getSingleRecord = async (recordKey) => {
    var record = await RecordsCache.findOne({ key: recordKey });
    return record;
};

cacheService.getAllRecords = async () => {
    var recordList = await RecordsCache.find();
    return recordList;
};

cacheService.addNewRecord = async (record) => {
    // at 10 records, the oldest record will be overwritten
    var recordsCount = await RecordsCache.find().estimatedDocumentCount();
    if (recordsCount >= 10) {
        var oldestRecord = RecordsCache.find().sort({ _id: -1 }).limit(1);
        logger.log(oldestRecord);
        await this.deleteSingleRecord(oldestRecord[0].data.key);
        var newRecord = new RecordsCache(record);
        return await newRecord.save();

    } else {
        var newRecord = new RecordsCache(record);
        return await newRecord.save();
    }
}

cacheService.updateSingleRecord = async (recordKey, newValue) => {
    RecordsCache.findOneAndUpdate({ key: recordKey }, { $set: { value: newValue } });
    return await this.getSingleRecord(record.key);
}

cacheService.deleteSingleRecord = async (recordKey) => {
    return await RecordsCache.findOneAndDelete({ key: recordKey });
};

cacheService.deleteAllRecords = async () => {
    return await RecordsCache.deleteMany({});
};

module.exports = cacheService;