# 🏥 HealthcareDocs

### Healthcare Document Intelligence

O **HealthcareDocs** é uma plataforma de inteligência documental voltada para o setor de saúde, criada para automatizar a leitura, classificação, estruturação e análise documental de arquivos médicos, clínicos, hospitalares e administrativos.

A aplicação utiliza **OCR, processamento de documentos e extração estruturada de dados** para transformar arquivos como PDFs e imagens em informações organizadas e utilizáveis por sistemas, dashboards e processos de auditoria.

> **Objetivo:** reduzir o trabalho manual envolvido na conferência, organização e interpretação documental dentro de processos de saúde.

---

## 📌 Sobre o projeto

Hospitais, clínicas, laboratórios e outras organizações da área da saúde trabalham diariamente com grandes volumes de documentos.

Entre eles:

* Resultados de exames laboratoriais;
* Laudos de exames de imagem;
* Prescrições médicas;
* Pedidos de exames;
* Evoluções clínicas;
* Anamneses;
* Relatórios médicos;
* Atestados;
* Termos de consentimento;
* Documentos cirúrgicos;
* Avaliações pré-anestésicas;
* Sumários de alta;
* Guias de convênio;
* Autorizações de procedimentos;
* Documentos administrativos relacionados ao atendimento.

Grande parte dessas informações ainda precisa ser consultada, classificada ou conferida manualmente.

O **SmartDocs** foi desenvolvido para criar uma camada de inteligência entre o documento original e os sistemas que precisam utilizar essas informações.

---

# ⚙️ Como funciona

O fluxo principal da aplicação segue a arquitetura:

```text
PDF / Imagem
      ↓
Upload
      ↓
OCR / Extração de texto
      ↓
Classificação documental
      ↓
Extração de dados estruturados
      ↓
Validação
      ↓
Persistência no MongoDB
      ↓
API
      ↓
Dashboard / Interface
```

O documento enviado passa por diferentes etapas até que seu conteúdo seja convertido em informação estruturada.

---

# 🧠 Principais funcionalidades

## 📤 Upload de documentos

O sistema permite o envio de múltiplos arquivos para processamento.

Formatos previstos no fluxo incluem:

```text
PDF
JPG
JPEG
PNG
WEBP
BMP
TIFF
```

---

## 🔎 OCR e extração de texto

O SmartDocs possui uma camada responsável pela leitura dos documentos.

Para arquivos PDF que já possuem texto incorporado, o sistema tenta extrair diretamente seu conteúdo.

Quando necessário, pode utilizar **OCR (Optical Character Recognition)** para reconhecer informações presentes em documentos digitalizados ou imagens.

Tecnologias utilizadas nesta etapa incluem:

* `Tesseract.js`
* `pdf-parse`

---

# 🗂️ Classificação automática de documentos

Após a extração do texto, o sistema analisa seu conteúdo e tenta identificar automaticamente o tipo documental.

Entre os tipos atualmente previstos estão:

```text
RESULTADO_LABORATORIAL
LAUDO_IMAGEM
LAUDO_MEDICO
PRESCRICAO_MEDICA
PEDIDO_EXAME
EVOLUCAO_CLINICA
ANAMNESE
RELATORIO_MEDICO
ATESTADO_MEDICO
TERMO_CONSENTIMENTO
TERMO_CIRURGICO
AVALIACAO_PRE_ANESTESICA
SUMARIO_ALTA
GUIA_CONVENIO
AUTORIZACAO_PROCEDIMENTO
DOCUMENTO_IDENTIFICACAO
CARTEIRINHA_CONVENIO
ENCAMINHAMENTO
```

A classificação utiliza elementos encontrados no conteúdo do documento para determinar sua categoria e calcular uma estimativa de confiança.

---

# 🧪 Exames laboratoriais

Para resultados laboratoriais, o SmartDocs consegue transformar informações encontradas no documento em dados estruturados.

Exemplo:

```text
Exame: Glicemia em Jejum
Resultado: 126
Unidade: mg/dL
Referência: 70 - 99
Status: FORA_DA_REFERENCIA
```

A aplicação pode organizar informações como:

| Informação | Exemplo               |
| ---------- | --------------------- |
| Paciente   | TESTE SMARTDOCS SILVA |
| Exame      | Glicemia em Jejum     |
| Resultado  | 126                   |
| Unidade    | mg/dL                 |
| Referência | 70 - 99               |
| Status     | Fora da referência    |

Também são calculados indicadores documentais como:

* Total de exames identificados;
* Resultados dentro da referência;
* Resultados fora da referência;
* Resultados não interpretados.

> O status é baseado exclusivamente na comparação com os valores de referência presentes no próprio documento e **não representa diagnóstico médico**.

---

# 🩻 Laudos de exames de imagem

O SmartDocs também possui suporte à análise textual de **laudos de diagnóstico por imagem**.

Atualmente o sistema pode identificar modalidades como:

* Tomografia Computadorizada;
* Ressonância Magnética;
* Radiografia;
* Ultrassonografia;
* Mamografia;
* Densitometria Óssea;
* PET-CT;
* Ecocardiograma;
* Angiotomografia;
* Angiorressonância.

---

## Informações estruturadas de imagem

A partir do texto de um laudo, o sistema pode extrair informações como:

```text
Modalidade
Exame
Região anatômica
Lateralidade
Paciente
Data do exame
Médico responsável
CRM
Indicação clínica
Técnica
Achados
Conclusão
Uso de contraste
```

Exemplo:

```text
Modalidade:
Tomografia Computadorizada

Região anatômica:
Tórax

Técnica:
Aquisição volumétrica do tórax sem administração
de meio de contraste intravenoso.

Achados:
Informações descritas pelo médico radiologista.

Conclusão:
Conclusão presente no documento original.
```

---

# 📊 Completude documental

Para laudos de imagem, o SmartDocs também verifica se determinadas informações importantes foram encontradas.

Exemplo:

| Informação       | Encontrada |
| ---------------- | :--------: |
| Paciente         |      ✅     |
| Data do exame    |      ✅     |
| Modalidade       |      ✅     |
| Região anatômica |      ✅     |
| Técnica          |      ✅     |
| Achados          |      ✅     |
| Conclusão        |      ✅     |
| Médico           |      ✅     |
| CRM              |      ✅     |

O sistema pode então calcular um percentual de completude documental.

```text
Completude documental: 100%
```

Essa análise está relacionada à **estrutura e presença das informações no documento**, e não à validade clínica do conteúdo.

---

# ⚠️ Alertas

Durante o processamento, o SmartDocs pode gerar alertas relacionados à análise documental.

Exemplos:

```text
DOCUMENTO_NAO_IDENTIFICADO
REVISAO_MANUAL
RESULTADO_FORA_REFERENCIA
LAUDO_IMAGEM_INCOMPLETO
CONCLUSAO_NAO_IDENTIFICADA
DOCUMENTO_FALTANTE
```

Esses alertas permitem identificar rapidamente documentos que podem precisar de revisão.

---

# 🏥 Processos clínicos

A arquitetura foi preparada para permitir regras diferentes de acordo com o processo analisado.

Entre os processos atualmente previstos estão:

```text
Atendimento ambulatorial

Pronto atendimento

Internação

Cirurgia

Exames laboratoriais

Diagnóstico por imagem

Auditoria clínica
```

Cada processo pode futuramente possuir suas próprias regras documentais.

Exemplo:

```text
Cirurgia
   ↓
Termo cirúrgico
   +
Avaliação pré-anestésica
```

Caso um documento obrigatório não seja encontrado, o sistema pode sinalizar a pendência.

---

# 📊 Dashboard

O SmartDocs possui uma interface de dashboard para acompanhar informações processadas pelo sistema.

Entre os indicadores disponíveis ou previstos estão:

* Total de processamentos;
* Total de documentos;
* Total de exames;
* Resultados dentro da referência;
* Resultados fora da referência;
* Confiança média;
* Tipos de documentos processados;
* Exames mais processados;
* Volume de processamento;
* Processamentos recentes.

A arquitetura permite evoluir o dashboard com indicadores específicos para diagnóstico por imagem, como:

```text
Modalidades mais processadas

Tomografias
Ressonâncias
Radiografias
Ultrassonografias

Regiões anatômicas

Completude média dos laudos

Laudos com conclusão

Laudos que necessitam revisão
```

---

# 🗄️ Persistência de dados

Os processamentos são armazenados utilizando:

**MongoDB + Mongoose**

Estrutura simplificada:

```text
Processamento
│
├── Tipo do processo
├── Status
├── Resumo
├── Alertas
│
└── Documentos
      │
      ├── Informações do arquivo
      ├── Classificação
      ├── Confiança
      ├── OCR
      ├── Texto extraído
      │
      ├── Dados laboratoriais
      │      └── Exames
      │
      └── Dados de imagem
             ├── Modalidade
             ├── Região
             ├── Técnica
             ├── Achados
             ├── Conclusão
             └── Completude
```

---

# 🛠️ Tecnologias utilizadas

## Front-end

* HTML5
* CSS3
* JavaScript
* Bootstrap 5
* Bootstrap Icons
* Chart.js

## Back-end

* Node.js
* Express.js
* JavaScript
* REST API

## Banco de dados

* MongoDB
* Mongoose

## Processamento documental

* Tesseract.js
* pdf-parse
* OCR
* Extração estruturada de informações
* Classificação documental

---

# 📁 Estrutura do projeto

```text
smartdocs/
│
├── backend/
│   │
│   ├── config/
│   │   └── database.js
│   │
│   ├── controllers/
│   │   ├── uploadController.js
│   │   └── dashboardController.js
│   │
│   ├── models/
│   │   ├── Documento.js
│   │   └── Processamento.js
│   │
│   ├── routes/
│   │   ├── uploadRoutes.js
│   │   └── dashboardRoutes.js
│   │
│   ├── services/
│   │   ├── analyzerService.js
│   │   ├── clinicalExtractorService.js
│   │   ├── imagingExtractorService.js
│   │   ├── documentoService.js
│   │   ├── ocrService.js
│   │   └── processamentoService.js
│   │
│   ├── uploads/
│   │
│   ├── app.js
│   ├── .env
│   └── package.json
│
├── frontend/
│   │
│   ├── js/
│   │   ├── upload.js
│   │   └── dashboard.js
│   │
│   └── pages/
│       ├── upload.html
│       └── dashboard.html
│
├── .gitignore
└── README.md
```

---

# 🚀 Executando o projeto

## 1. Clone o repositório

```bash
git clone https://github.com/RaphaelDeSouzaBrazil/healthcaredocs.git
```

Entre na pasta:

```bash
cd healthcaredocs
```

---

## 2. Instale as dependências do backend

```bash
cd backend
npm install
```

---

## 3. Configure as variáveis de ambiente

Crie um arquivo:

```text
backend/.env
```

Exemplo:

```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/smartdocs
```

> O arquivo `.env` não deve ser enviado para o GitHub.

---

## 4. Inicie o MongoDB

Certifique-se de que sua instância local do MongoDB esteja disponível.

Banco utilizado durante o desenvolvimento:

```text
smartdocs
```

---

## 5. Inicie o backend

Dentro de:

```text
backend/
```

execute:

```bash
npm run dev
```

ou, dependendo da configuração do projeto:

```bash
npm start
```

A API será disponibilizada localmente, por padrão, em:

```text
http://localhost:3000
```

---

## 6. Execute o frontend

Durante o desenvolvimento, o frontend pode ser executado utilizando o **Live Server** do VS Code.

Exemplo:

```text
http://127.0.0.1:5500/frontend/pages/upload.html
```

Dashboard:

```text
http://127.0.0.1:5500/frontend/pages/dashboard.html
```

---

# 🔌 API

Alguns dos endpoints disponíveis:

### Upload e processamento

```http
POST /api/upload
```

### Dashboard

```http
GET /api/dashboard/resumo
GET /api/dashboard/status-exames
GET /api/dashboard/exames
GET /api/dashboard/tipos-documentos
GET /api/dashboard/recentes
GET /api/dashboard/volume
```

---

# 🔐 Segurança e privacidade

O SmartDocs trabalha com uma categoria de informação que exige atenção especial à segurança e privacidade.

Durante o desenvolvimento, recomenda-se utilizar exclusivamente:

* Documentos fictícios;
* Dados sintéticos;
* Documentos anonimizados;
* Informações criadas especificamente para testes.

Arquivos enviados durante os testes não devem ser versionados.

Por esse motivo, diretórios como:

```text
backend/uploads/
```

e arquivos como:

```text
.env
```

devem permanecer no `.gitignore`.

Uma implementação destinada a ambientes reais deverá considerar, entre outros aspectos:

* Controle de acesso;
* Autenticação e autorização;
* Criptografia;
* Minimização de dados;
* Política de retenção;
* Auditoria;
* Logs seguros;
* Gestão de credenciais;
* Proteção de dados pessoais e sensíveis;
* Requisitos regulatórios aplicáveis.

---

# ⚕️ Aviso importante

O **SmartDocs não é um sistema de diagnóstico médico**.

O projeto realiza processamento documental, classificação, extração e organização de informações encontradas nos documentos fornecidos.

O sistema não deve ser utilizado para substituir:

* Avaliação médica;
* Diagnóstico;
* Interpretação clínica profissional;
* Decisão terapêutica;
* Avaliação radiológica;
* Julgamento de profissionais de saúde.

Em resultados laboratoriais, classificações como `NORMAL` ou `FORA_DA_REFERENCIA` representam exclusivamente comparações computacionais com intervalos de referência identificados no documento.

Em laudos de imagem, o sistema trabalha atualmente com o **conteúdo textual do laudo**, não realizando interpretação diagnóstica dos pixels das imagens médicas.

---

# 🗺️ Roadmap

O projeto poderá evoluir para recursos como:

* [ ] Ampliação da classificação documental;
* [ ] Novos tipos de exames laboratoriais;
* [ ] Novas modalidades de diagnóstico por imagem;
* [ ] Regras documentais configuráveis;
* [ ] Auditoria automatizada de processos;
* [ ] Histórico de pacientes;
* [ ] Pesquisa avançada de documentos;
* [ ] Indicadores específicos de diagnóstico por imagem;
* [ ] Controle de usuários e permissões;
* [ ] Autenticação;
* [ ] Trilhas de auditoria;
* [ ] Integração com sistemas hospitalares;
* [ ] Integração com APIs;
* [ ] Processamento assíncrono de grandes volumes;
* [ ] Inteligência Artificial aplicada à compreensão documental;
* [ ] Modelos de linguagem para extração contextual;
* [ ] Integração com padrões de interoperabilidade em saúde;
* [ ] Suporte futuro a fluxos relacionados a DICOM.

---

# 💡 Visão do projeto

O SmartDocs parte de uma ideia simples:

> **Documentos de saúde não deveriam ser apenas arquivos. Eles podem ser transformados em dados estruturados, pesquisáveis e utilizáveis.**

A proposta é construir uma camada de inteligência documental capaz de ajudar organizações de saúde a transformar grandes volumes de documentos em informações organizadas para apoiar processos operacionais, administrativos e de auditoria.

---

# 👨‍💻 Desenvolvimento

Projeto desenvolvido por **Raphael De Souza**.

Áreas envolvidas no desenvolvimento:

```text
UX/UI Design
Product Design
Front-End Development
Back-End Development
APIs
MongoDB
OCR
Document Intelligence
Data Processing
Healthcare Technology
Artificial Intelligence
```

---

# 📄 Licença

Este projeto está em desenvolvimento.

Os termos de licença, distribuição e utilização são de propriedade de Raphael De Souza.

---

<p align="center">
  <strong>SmartDocs</strong><br>
  Healthcare Document Intelligence
</p>

<p align="center">
  Transformando documentos de saúde em informação estruturada.
</p>
