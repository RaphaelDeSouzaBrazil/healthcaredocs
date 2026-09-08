/**
 * =========================================================
 * SMARTDOCS
 * EXPRESS APPLICATION
 * =========================================================
 */


/**
 * =========================================================
 * ENVIRONMENT
 * =========================================================
 */
require("dotenv").config();


/**
 * =========================================================
 * DEPENDENCIES
 * =========================================================
 */
const express =
    require("express");

const cors =
    require("cors");


/**
 * =========================================================
 * DATABASE
 * =========================================================
 */
const {
    conectarBanco
} =
    require("./config/database");


/**
 * =========================================================
 * ROUTES
 * =========================================================
 */
const uploadRoutes =
    require("./routes/uploadRoutes");

const dashboardRoutes =
    require("./routes/dashboardRoutes");


/**
 * =========================================================
 * EXPRESS APP
 * =========================================================
 */
const app =
    express();


/**
 * =========================================================
 * MIDDLEWARES
 * =========================================================
 */
app.use(
    cors()
);


app.use(
    express.json({
        limit: "10mb"
    })
);


app.use(
    express.urlencoded({
        extended: true,
        limit: "10mb"
    })
);


/**
 * =========================================================
 * STATIC UPLOADS
 * =========================================================
 */
app.use(
    "/uploads",
    express.static("uploads")
);


/**
 * =========================================================
 * DATABASE CONNECTION
 * =========================================================
 */
conectarBanco();


/**
 * =========================================================
 * API ROUTES
 * =========================================================
 */


/**
 * Upload e processamento
 *
 * POST
 * /api/upload
 */
app.use(
    "/api/upload",
    uploadRoutes
);


/**
 * Dashboard / Analytics
 *
 * GET /api/dashboard/resumo
 * GET /api/dashboard/status-exames
 * GET /api/dashboard/exames
 * GET /api/dashboard/tipos-documentos
 * GET /api/dashboard/recentes
 * GET /api/dashboard/volume
 */
app.use(
    "/api/dashboard",
    dashboardRoutes
);


/**
 * =========================================================
 * HEALTH CHECK
 * =========================================================
 */
app.get(
    "/",
    (
        req,
        res
    ) => {

        res.json({

            projeto:
                "SmartDocs",

            descricao:
                "Healthcare Document Intelligence",

            status:
                "online",

            api: {

                upload:
                    "/api/upload",

                dashboard:
                    "/api/dashboard"

            }

        });

    }
);


/**
 * =========================================================
 * API STATUS
 * =========================================================
 */
app.get(
    "/api",
    (
        req,
        res
    ) => {

        res.json({

            sucesso:
                true,

            projeto:
                "SmartDocs",

            status:
                "API online",

            endpoints: {

                upload:
                    "POST /api/upload",

                dashboardResumo:
                    "GET /api/dashboard/resumo",

                dashboardStatusExames:
                    "GET /api/dashboard/status-exames",

                dashboardExames:
                    "GET /api/dashboard/exames",

                dashboardTiposDocumentos:
                    "GET /api/dashboard/tipos-documentos",

                dashboardRecentes:
                    "GET /api/dashboard/recentes",

                dashboardVolume:
                    "GET /api/dashboard/volume"

            }

        });

    }
);


/**
 * =========================================================
 * 404
 * =========================================================
 */
app.use(
    (
        req,
        res
    ) => {

        return res
            .status(404)
            .json({

                sucesso:
                    false,

                mensagem:
                    "Rota não encontrada.",

                rota:
                    req.originalUrl

            });

    }
);


/**
 * =========================================================
 * GLOBAL ERROR HANDLER
 * =========================================================
 */
app.use(
    (
        erro,
        req,
        res,
        next
    ) => {

        console.error(
            "Erro global SmartDocs:",
            erro
        );


        return res
            .status(
                erro.status ||
                500
            )
            .json({

                sucesso:
                    false,

                mensagem:
                    erro.message ||
                    "Erro interno do servidor."

            });

    }
);


/**
 * =========================================================
 * EXPORT
 * =========================================================
 */
module.exports =
    app;