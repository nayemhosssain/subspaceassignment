const app = require('./app');
const { ServerPort } = require('./secret');


app.listen(ServerPort, () =>{
  console.log(`Server is running on ${ServerPort}`);

})