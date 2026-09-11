
import express from "express";

import { handlerReadiness } from "./api/readiness.js";
import {middlewareLogResponses, middlewareMetricsInc} from "./api/middleware.js"
import {handlerGetMetrics} from "./api/metrics.js";
import { handlerRestMetrics } from "./api/rest.js";
import { handlerValidateChirp } from "./api/validateChirp.js";

const app = express();
const PORT = 8080;

app.use("/app",middlewareMetricsInc, express.static("./src/app"));
app.use(middlewareLogResponses,express.json());

app.get("/api/healthz", handlerReadiness);
app.get("/admin/metrics", handlerGetMetrics);
app.post("/admin/reset", handlerRestMetrics);
app.post("/api/validate_chirp",handlerValidateChirp);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

