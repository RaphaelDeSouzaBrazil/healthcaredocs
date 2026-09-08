const express =
    require("express");


const dashboardController =
    require("../controllers/dashboardController");


const router =
    express.Router();


router.get(
    "/resumo",
    dashboardController.resumo
);


router.get(
    "/status-exames",
    dashboardController.statusExames
);


router.get(
    "/exames",
    dashboardController.examesMaisProcessados
);


router.get(
    "/tipos-documentos",
    dashboardController.tiposDocumentos
);


router.get(
    "/recentes",
    dashboardController.recentes
);


router.get(
    "/volume",
    dashboardController.volume
);


module.exports =
    router;