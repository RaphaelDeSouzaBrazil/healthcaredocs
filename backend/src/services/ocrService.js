const fs = require("fs");
const path = require("path");

const { createWorker } = require("tesseract.js");
const { PDFParse } = require("pdf-parse");


/**
 * =========================================================
 * SMARTDOCS
 * OCR SERVICE
 * =========================================================
 *
 * Responsável por:
 *
 * - Ler imagens
 * - Ler PDFs digitais
 * - Aplicar OCR em PDFs escaneados
 * - Normalizar o texto extraído
 * - Entregar texto ao analyzerService
 *
 * =========================================================
 */


/**
 * Quantidade máxima de páginas que iremos
 * processar com OCR em PDFs escaneados.
 *
 * Isso protege o servidor contra PDFs enormes.
 */
const MAX_PAGINAS_OCR = 10;


/**
 * Quantidade mínima de caracteres para considerar
 * que um PDF já possui texto pesquisável.
 */
const MIN_TEXTO_PDF = 40;


/**
 * Worker do Tesseract.
 *
 * Mantemos uma instância reutilizável para evitar
 * criar um novo worker para cada arquivo.
 */
let worker = null;


/**
 * =========================================================
 * CRIAR WORKER
 * =========================================================
 */
async function obterWorker() {

    if (worker) {
        return worker;
    }

    console.log(
        "SmartDocs OCR: inicializando Tesseract..."
    );

    worker = await createWorker(
        "por"
    );

    console.log(
        "SmartDocs OCR: Tesseract pronto."
    );

    return worker;
}


/**
 * =========================================================
 * NORMALIZAR TEXTO
 * =========================================================
 */
function limparTexto(texto = "") {

    return String(texto)
        .replace(/\r/g, "\n")
        .replace(/[ \t]+/g, " ")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
}


/**
 * =========================================================
 * VERIFICAR ARQUIVO
 * =========================================================
 */
function validarArquivo(caminhoArquivo) {

    if (!caminhoArquivo) {

        throw new Error(
            "Caminho do arquivo não informado."
        );
    }


    if (!fs.existsSync(caminhoArquivo)) {

        throw new Error(
            `Arquivo não encontrado: ${caminhoArquivo}`
        );
    }

}


/**
 * =========================================================
 * OCR EM IMAGEM
 * =========================================================
 */
async function extrairTextoImagem(
    caminhoOuBuffer
) {

    try {

        const tesseract =
            await obterWorker();


        console.log(
            "SmartDocs OCR: analisando imagem..."
        );


        const resultado =
            await tesseract.recognize(
                caminhoOuBuffer
            );


        const texto =
            resultado?.data?.text || "";


        const confianca =
            Number(
                resultado?.data?.confidence || 0
            );


        return {

            sucesso: true,

            metodo: "ocr",

            texto:
                limparTexto(texto),

            confianca,

            paginas: 1

        };


    } catch (erro) {

        console.error(
            "Erro no OCR da imagem:",
            erro
        );


        return {

            sucesso: false,

            metodo: "ocr",

            texto: "",

            confianca: 0,

            paginas: 0,

            erro:
                erro.message

        };

    }

}


/**
 * =========================================================
 * EXTRAIR TEXTO DE PDF DIGITAL
 * =========================================================
 */
async function extrairTextoPdfDigital(
    caminhoArquivo
) {

    const buffer =
        fs.readFileSync(
            caminhoArquivo
        );


    const parser =
        new PDFParse({
            data: buffer
        });


    try {

        const resultado =
            await parser.getText();


        return {

            texto:
                limparTexto(
                    resultado.text || ""
                ),

            totalPaginas:
                resultado.total || 0

        };


    } finally {

        await parser.destroy();

    }

}


/**
 * =========================================================
 * OCR EM PDF ESCANEADO
 * =========================================================
 *
 * Caso o PDF não tenha camada de texto,
 * renderizamos as páginas como imagens PNG
 * e aplicamos Tesseract.
 */
async function extrairTextoPdfComOCR(
    caminhoArquivo
) {

    const buffer =
        fs.readFileSync(
            caminhoArquivo
        );


    const parser =
        new PDFParse({
            data: buffer
        });


    try {

        /**
         * Renderiza no máximo 10 páginas.
         *
         * desiredWidth aumenta a resolução da
         * imagem para melhorar OCR.
         */
        const screenshots =
            await parser.getScreenshot({

                first:
                    MAX_PAGINAS_OCR,

                desiredWidth:
                    1800,

                imageBuffer:
                    true,

                imageDataUrl:
                    false

            });


        const paginas =
            screenshots.pages || [];


        let textoCompleto = "";

        let somaConfianca = 0;

        let paginasProcessadas = 0;


        for (
            let indice = 0;
            indice < paginas.length;
            indice++
        ) {

            const pagina =
                paginas[indice];


            if (!pagina.data) {
                continue;
            }


            console.log(
                `SmartDocs OCR: página ${
                    indice + 1
                }/${paginas.length}`
            );


            const resultadoOCR =
                await extrairTextoImagem(
                    pagina.data
                );


            if (
                resultadoOCR.sucesso &&
                resultadoOCR.texto
            ) {

                textoCompleto +=
                    `\n\n--- PÁGINA ${
                        indice + 1
                    } ---\n\n`;

                textoCompleto +=
                    resultadoOCR.texto;


                somaConfianca +=
                    resultadoOCR.confianca;


                paginasProcessadas++;

            }

        }


        const confiancaMedia =
            paginasProcessadas > 0
                ? somaConfianca /
                  paginasProcessadas
                : 0;


        return {

            sucesso:
                textoCompleto.length > 0,

            metodo:
                "pdf_ocr",

            texto:
                limparTexto(
                    textoCompleto
                ),

            confianca:
                confiancaMedia,

            paginas:
                paginasProcessadas

        };


    } finally {

        await parser.destroy();

    }

}


/**
 * =========================================================
 * EXTRAIR TEXTO DE PDF
 * =========================================================
 */
async function extrairTextoPdf(
    caminhoArquivo
) {

    try {

        /**
         * PRIMEIRA TENTATIVA
         *
         * PDF com texto pesquisável.
         */
        const resultadoDigital =
            await extrairTextoPdfDigital(
                caminhoArquivo
            );


        if (
            resultadoDigital.texto.length >=
            MIN_TEXTO_PDF
        ) {

            console.log(
                "SmartDocs OCR: PDF possui texto nativo."
            );


            return {

                sucesso: true,

                metodo:
                    "pdf_text",

                texto:
                    resultadoDigital.texto,

                /**
                 * Não é confiança OCR.
                 * Texto veio diretamente do PDF.
                 */
                confianca:
                    100,

                paginas:
                    resultadoDigital.totalPaginas

            };

        }


        /**
         * SEGUNDA TENTATIVA
         *
         * Provavelmente PDF escaneado.
         */
        console.log(
            "SmartDocs OCR: PDF sem texto suficiente. Iniciando OCR..."
        );


        return await extrairTextoPdfComOCR(
            caminhoArquivo
        );


    } catch (erro) {

        console.error(
            "Erro ao processar PDF:",
            erro
        );


        return {

            sucesso: false,

            metodo: "pdf",

            texto: "",

            confianca: 0,

            paginas: 0,

            erro:
                erro.message

        };

    }

}


/**
 * =========================================================
 * FUNÇÃO PRINCIPAL
 * =========================================================
 *
 * Esta é a função que o analyzerService irá chamar.
 */
async function extrairTexto(file) {

    if (!file) {

        throw new Error(
            "Arquivo não informado para OCR."
        );

    }


    const caminhoArquivo =
        file.path;


    validarArquivo(
        caminhoArquivo
    );


    const mimetype =
        String(
            file.mimetype || ""
        ).toLowerCase();


    const extensao =
        path
            .extname(
                file.originalname ||
                file.filename ||
                ""
            )
            .toLowerCase();


    console.log(
        `SmartDocs OCR: processando ${
            file.originalname ||
            file.filename
        }`
    );


    /**
     * =====================================================
     * IMAGENS
     * =====================================================
     */
    const imagemValida =
        mimetype.startsWith("image/") ||
        [
            ".jpg",
            ".jpeg",
            ".png",
            ".webp",
            ".bmp",
            ".tiff",
            ".tif"
        ].includes(extensao);


    if (imagemValida) {

        return await extrairTextoImagem(
            caminhoArquivo
        );

    }


    /**
     * =====================================================
     * PDF
     * =====================================================
     */
    const pdfValido =
        mimetype ===
            "application/pdf" ||
        extensao ===
            ".pdf";


    if (pdfValido) {

        return await extrairTextoPdf(
            caminhoArquivo
        );

    }


    /**
     * =====================================================
     * FORMATO NÃO SUPORTADO
     * =====================================================
     */
    return {

        sucesso: false,

        metodo:
            "nao_suportado",

        texto: "",

        confianca: 0,

        paginas: 0,

        erro:
            `Formato de arquivo não suportado: ${
                mimetype || extensao
            }`

    };

}


/**
 * =========================================================
 * ENCERRAR OCR
 * =========================================================
 *
 * Útil quando o Node for encerrado.
 */
async function encerrarOCR() {

    if (!worker) {
        return;
    }


    try {

        await worker.terminate();

    } catch (erro) {

        console.error(
            "Erro ao encerrar OCR:",
            erro.message
        );

    }


    worker = null;

}


/**
 * =========================================================
 * EXPORTS
 * =========================================================
 */
module.exports = {

    extrairTexto,

    extrairTextoImagem,

    extrairTextoPdf,

    limparTexto,

    encerrarOCR

};