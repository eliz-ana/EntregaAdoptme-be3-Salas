import mongoose  from "mongoose";   

export async function connectDB(uri){
    try {
        await mongoose.connect(uri,{dbName:'adoptme'});
        console.log("Database connected");
    } catch (err) {
        console.error('[db] connection error:', err.message);
        throw err;
    }
}

export async function disconnectDB() {
  await mongoose.connection.close();
}