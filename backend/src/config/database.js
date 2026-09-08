const mongoose = require("mongoose");


/**
 * =========================================================
 * SMARTDOCS
 * DATABASE CONNECTION
 * =========================================================
 */
async function conectarBanco() {

    try {

        const mongoUri =
            process.env.MONGO_URI;


        if (!mongoUri) {

            throw new Error(
                "A variável MONGO_URI não foi configurada."
            );
        }


        await mongoose.connect(
            mongoUri
        );


        console.log(
            "MongoDB conectado ao SmartDocs."
        );


    } catch (erro) {

        console.error(
            "Erro ao conectar ao MongoDB:",
            erro.message
        );


        process.exit(1);

    }

}


module.exports = {
    conectarBanco
};