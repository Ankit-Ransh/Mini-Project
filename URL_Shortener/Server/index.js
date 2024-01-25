require("dotenv").config();

const server = require("./config/middleware");

const user = require("./controller/users");
server.use('/user', user);

const verifyId = require("./controller/verification");
server.get('/:id', verifyId);

const PORT = process.env.PORT;
server.listen(`${PORT}`, () => {
    console.log(`Server connected at PORT ${PORT}`);
});




