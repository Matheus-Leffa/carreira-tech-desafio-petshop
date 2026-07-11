const Contato = require('../models/Contato');

function getContatoPayload(body) {
  return {
    nome: typeof body.nome === 'string' ? body.nome.trim() : '',
    email: typeof body.email === 'string' ? body.email.trim() : '',
    telefone: typeof body.telefone === 'string' ? body.telefone.trim() : '',
    servico: typeof body.servico === 'string' ? body.servico.trim() : '',
    mensagem: typeof body.mensagem === 'string' ? body.mensagem.trim() : ''
  };
}

function isValidEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

function validateContatoPayload(payload) {
  const errors = {};

  if (!payload.nome) errors.nome = 'Nome é obrigatório.';
  if (!payload.email) {
    errors.email = 'Email é obrigatório.';
  } else if (!isValidEmail(payload.email)) {
    errors.email = 'Email inválido.';
  }
  if (!payload.telefone) errors.telefone = 'Telefone é obrigatório.';
  if (!payload.servico) errors.servico = 'Serviço é obrigatório.';
  if (!payload.mensagem) errors.mensagem = 'Mensagem é obrigatória.';

  return errors;
}

function hasValidationErrors(errors) {
  return Object.keys(errors).length > 0;
}

function sendValidationResponse(res, errors) {
  return res.status(400).json({
    message: 'Dados inválidos.',
    errors
  });
}

async function createContato(req, res) {
  const payload = getContatoPayload(req.body);
  const errors = validateContatoPayload(payload);

  if (hasValidationErrors(errors)) {
    return sendValidationResponse(res, errors);
  }

  try {
    const contato = await Contato.create(payload);

    return res.status(201).json({
      message: 'Contato enviado com sucesso.',
      data: contato
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Erro ao salvar o contato.',
      error: 'INTERNAL_SERVER_ERROR'
    });
  }
}

module.exports = {
  createContato
};