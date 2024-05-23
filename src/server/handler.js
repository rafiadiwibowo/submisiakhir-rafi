const crypto = require('crypto');
const storeData = require('../services/storeData');
const predictionClassification = require('../services/inferenceService');
const loadHistories = require('../services/loadHistories');

async function postPredictionHandler(request, h) {
    try {
        const { image } = request.payload;
        const { model } = request.server.app;

        const prediction = await predictionClassification(model, image);
        const id = crypto.randomUUID();
        const createdAt = new Date().toISOString();

        const data = {
            id,
            result: prediction.label,
            suggestion: prediction.suggestion,
            createdAt,
        };

        await storeData(id, data);

        return h.response({
            status: 'success',
            message: 'Model is predicted successfully',
            data,
        }).code(201);

    } catch (error) {
        return h.response({
            status: 'fail',
            message: 'Terjadi kesalahan dalam melakukan prediksi',
        }).code(400);
    }
}

async function getPredictionHistoriesHandler(request, h) {
    try {
        const loadedHistories = await loadHistories();
        const result = [];

        loadedHistories.forEach((d) => {
            const data = {
                id: d.id,
                history: d.data(),
            };
            result.push(data);
        });

        return h.response({
            status: 'success',
            data: result,
        }).code(200);

    } catch (error) {
        return h.response({
            status: 'error',
            message: 'Terjadi kesalahan dalam melakukan pengambilan Histories',
            error: error.message,
        }).code(400);
    }
}

module.exports = { postPredictionHandler, getPredictionHistoriesHandler };
