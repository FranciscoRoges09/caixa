// Arquivo: api/consulta.js

// Lógica de Serverless Function em Node.js para atuar como Proxy
// O Vercel lida com o 'node-fetch' e outras dependências Node.js.

// Pega o token da Variavel de Ambiente (Passo 1)
const API_TOKEN = process.env.APELA_API_TOKEN;

export default async function handler(req, res) {
    // 1. Configura os cabeçalhos de CORS para permitir acesso do seu front-end
    res.setHeader('Access-Control-Allow-Origin', 'https://caixa-phi.vercel.app'); 
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Se for uma requisição OPTIONS (pré-voo CORS), responde OK e encerra
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (!API_TOKEN) {
        return res.status(500).json({ status: 500, erro: 'Token da API não configurado no servidor.' });
    }

    // Pega o CPF do parâmetro de URL da requisição
    const { cpf } = req.query;

    if (!cpf) {
        return res.status(400).json({ status: 400, erro: 'CPF não fornecido.' });
    }

    try {
        // 2. Monta a URL da API Externa com o token e CPF
        const externalApiUrl = `https://apela-api.tech/?user=${API_TOKEN}&cpf=${cpf}`;
        
        // 3. Faz a requisição no lado do SERVIDOR (ignora o CORS do navegador)
        const response = await fetch(externalApiUrl);
        const data = await response.json();
        
        // 4. Devolve a resposta (o JSON com o nome) para o seu front-end
        res.status(response.status).json(data);

    } catch (error) {
        console.error('Erro ao comunicar com a API externa:', error);
        res.status(500).json({ status: 500, erro: 'Erro interno do servidor proxy. Verifique os logs.' });
    }
}