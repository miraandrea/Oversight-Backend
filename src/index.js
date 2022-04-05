// Initialize
const app = require("./app");

// Port
const PORT = process.env.PORT || 4000;

// Listener
app.listen(PORT, console.log(`Server running on port ${PORT}`));
