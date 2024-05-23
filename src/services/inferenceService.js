const tf = require('@tensorflow/tfjs-node');
const InputError = require('../exceptions/InputError');

async function predictionClassification(model, image) {
    try {
        const tensor = tf.node
            .decodeJpeg(image)
            .resizeNearestNeighbor([224, 224])
            .expandDims()
            .toFloat();

        const prediction = model.predict(tensor);
        const scores = await prediction.data();

        let label = '';
        let suggestion = '';

        if (scores > 0.5) {
            label = 'Cancer';
            suggestion = 'Kanker terdeteksi';
        } else {
            label = 'Non-cancer';
            suggestion = 'Kanker tidak terdeteksi';
        }

        return { label, suggestion };
    } catch (error) {
        throw new InputError('Terjadi kesalahan dalam melakukan prediksi');
    }
}

module.exports = predictionClassification;
