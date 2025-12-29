import mongoose from "mongoose";
function isValidObjectId(id: string): boolean {
    return mongoose.Types.ObjectId.isValid(id);
}

export default isValidObjectId;
