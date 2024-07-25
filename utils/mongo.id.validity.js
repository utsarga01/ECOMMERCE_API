import mongoose from 'mongoose';

const checkMongoIdValidity = (id) => mongoose.isValidObjectId(id);

export default checkMongoIdValidity;