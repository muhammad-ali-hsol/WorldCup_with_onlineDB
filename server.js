const app=require('./index')
const {dbConnection}=require('./config/dbConnect')

_PORT=process.env.PORT;

app.listen(_PORT, async () => {
    console.log(`server is listening on port : ${_PORT}`);
    await dbConnection();
  })