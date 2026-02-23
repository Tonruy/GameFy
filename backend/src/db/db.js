const mongoose = require('mongoose');

const connectToDB = async () => {
try {
	// URI para apis de recurso. URL donde acceder
	const uri = process.env.MONGO_URI;
	await mongoose.connect(uri);
	console.log('Servidor MongoDB conectado');

} catch(error) {
	console.error('Error conectado a MongoDB: ',error.message);
	process.exit(1)
	}
}

module.exports = connectToDB