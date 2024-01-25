const {express, cors, bodyParser } = require("./imports")

const server = express();

server.use(cors());
server.use(bodyParser.json());

// CORS middleware
server.use((req, res, next) => {
    // Replace '*' with the appropriate origin(s) or configure it dynamically
    res.setHeader("Access-Control-Allow-Origin", "*");

    // Add other allowed methods as needed
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");

    // Add other allowed headers as needed
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    // Handle preflight request
    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }

    // Set cache-control headers to prevent caching
    res.setHeader(
        "Cache-Control",
        "no-store, no-cache, must-revalidate, proxy-revalidate"
    );
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    next();
});

module.exports = server;