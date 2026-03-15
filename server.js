// first server making and then the database connection

import app from "./src/app.js";
import connectDb from "./src/config/database.js"

connectDb();



// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
}); 