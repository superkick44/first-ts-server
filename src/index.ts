
import express from "express";

import { handlerReadiness } from "./api/readiness.js";
import {middlewareLogResponses, middlewareMetricsInc} from "./api/middleware.js"
import {handlerGetMetrics} from "./api/metrics.js";
import { handlerRestMetrics } from "./api/rest.js";

const app = express();
const PORT = 8080;

app.use("/app",middlewareMetricsInc, express.static("./src/app"));
app.use(middlewareLogResponses);

app.get("/api/healthz", handlerReadiness);
app.get("/api/metrics", handlerGetMetrics);
app.get("/api/reset", handlerRestMetrics);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

