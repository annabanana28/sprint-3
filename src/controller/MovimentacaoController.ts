import { Request, Response } from 'express';
import { Movimentacao } from '../model/Movimentacao';
import { Produto } from '../model/Produto';

export class MovimentacaoController {
  private static MOTIVOS_VALIDOS = [
    'VENDA',
    'USO INTERNO',
    'PERDA',
    'PRODUTO DANIFICADO',
    'CORREÇÃO',
  ];

  static async listar(req: Request, res: Response): Promise<Response> {
    try {
      const movimentacoes = await Movimentacao.listarTodas();
      return res.status(200).json(movimentacoes);
    } catch (error) {
      console.error('Erro ao listar movimentações:', error);
      return res.status(500).json({ mensagem: 'Erro interno ao consultar movimentações.' });
    }
  }

  static async buscarPorProduto(req: Request, res: Response): Promise<Response> {
    try {
      const { codigoProduto } = req.params;
      const movimentacoes = await Movimentacao.buscarPorProduto(String(codigoProduto));
      return res.status(200).json(movimentacoes);
    } catch (error) {
      console.error('Erro ao buscar movimentações por produto:', error);
      return res.status(500).json({ mensagem: 'Erro interno ao consultar movimentações.' });
    }
  }

  static async cadastrar(req: Request, res: Response): Promise<Response> {
    try {
      const {
        produto,
        tipo,
        quantidade,
        observacao,
        motivo_retirada,
        preco_unitario,
        movimentacao_origem,
      } = req.body;

      // Validações Backend
      if (!produto || !tipo || quantidade === undefined) {
        return res.status(400).json({ mensagem: 'Produto, tipo e quantidade são obrigatórios.' });
      }

      if (!['ENTRADA', 'RETIRADA'].includes(tipo)) {
        return res.status(400).json({ mensagem: 'Tipo de movimentação inválido. Use ENTRADA ou RETIRADA.' });
      }

      if (typeof quantidade !== 'number' || quantidade <= 0) {
        return res.status(400).json({ mensagem: 'Quantidade deve ser um número inteiro maior que zero.' });
      }

      // Validar existência do produto
      const produtoExistente = await Produto.buscarPorCodigo(produto);
      if (!produtoExistente) {
        return res.status(404).json({ mensagem: 'Produto não encontrado.' });
      }

      // Validação de motivo na retirada
      if (tipo === 'RETIRADA') {
        if (!motivo_retirada || !MovimentacaoController.MOTIVOS_VALIDOS.includes(motivo_retirada)) {
          return res.status(400).json({
            mensagem: `Motivo de retirada inválido. Motivos permitidos: ${MovimentacaoController.MOTIVOS_VALIDOS.join(', ')}`,
          });
        }
      }

      // Cálculo de valor_total se preco_unitario for enviado
      let valor_total = null;
      if (preco_unitario) {
        if (typeof preco_unitario !== 'number' || preco_unitario < 0) {
          return res.status(400).json({ mensagem: 'Preço unitário inválido.' });
        }
        valor_total = preco_unitario * quantidade;
      }

      const novaMovimentacao = await Movimentacao.cadastrar({
        produto,
        tipo,
        quantidade,
        observacao,
        motivo_retirada: tipo === 'RETIRADA' ? motivo_retirada : null,
        preco_unitario,
        valor_total,
        movimentacao_origem,
      });

      return res.status(201).json({
        mensagem: 'Movimentação registrada com sucesso!',
        movimentacao: novaMovimentacao,
      });
    } catch (error) {
      console.error('Erro ao cadastrar movimentação:', error);
      return res.status(500).json({ mensagem: 'Erro interno ao registrar movimentação.' });
    }
  }
}