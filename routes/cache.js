var express = require('express');
var router = express.Router();
var cacheService = require('../services/cache.service');
var logger = require('../utilities/logger');
// var utilities = require('../utilities/utilities');

router.get('/:key', async (req, res, next) => {
    try {
        var record = await cacheService.getSingleRecord(req.params.key);
        if (!record) {
            logger.info('Cache miss');
            // normally I could just send a not found error
            // res.status(404).send({ success: false, message: 'could not find the record' });
            var newRecord = await cacheService.addNewRecord({ key: req.params.key, value: 'randomString' });
            if (newRecord) {
                return res.status(201).send({
                    success: true,
                    message: 'key not found so new record created with key and random string generated as value',
                    data: newRecord
                });
            }
        } else {
            logger.info('Cache hit');
            return res.status(200).send({ success: true, record });
        }

    } catch (error) {
        logger.error(error);
        res.status(500).send({ success: false, message: 'Something bad happened' });
    }
});

router.get('/', async (req, res, next) => {
    try {
        var allRecords = await cacheService.getAllRecords();
        return res.status(200).send({ success: true, allRecords });

    } catch (error) {
        logger.error(error);
        res.status(500).send({ success: false, message: 'Something bad happened' });
    }
});

router.post('/', async (req, res, next) => {
    try {
        var newRecord = await cacheService.addNewRecord(req.body);
        if (newRecord) {
            return res.status(201).send({ success: true, message: 'record added successfully!', data: newRecord });
        }
    } catch (error) {
        logger.error(error);
        res.status(500).send({ success: false, message: 'Something bad happened' });
    }
})

router.put('/:key', async (req, res, next) => {
    try {
        var updatedRecord = await cacheService.updateSingleRecord(req.params.key, req.body);
        if (updatedRecord) {
            return res.status(201).send({ success: true, message: 'record updated successfully!', data: updatedRecord });
        }
    } catch (error) {
        logger.error(error);
        res.status(500).send({ success: false, message: 'Something bad happened' });
    }
});

router.delete('/:key', async (req, res, next) => {
    try {
        var deletedRecord = await cacheService.deleteSingleRecord(req.params.key);
        if (deletedRecord) {
            return res.status(200).send({ success: true, message: `record with key ${req.params.key} deleted successfully!` });
        }
    } catch (error) {
        logger.error(error);
        res.status(500).send({ success: false, message: 'Something bad happened' });
    }
});

router.delete('/', async (req, res, next) => {
    try {
        return await cacheService.deleteAllRecords();
    } catch (error) {
        logger.error(error);
        res.status(500).send({ success: false, message: 'Something bad happened' });
    }
});


module.exports = router;
