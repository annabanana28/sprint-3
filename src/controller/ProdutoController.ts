import { Request, Response } from 'express';
import { Produto } from '../model/Produto';
import { Categoria } from '../model/Categoria';

export class ProdutoController {
  static async listar(req: Request, res: Response): Promise<Response> {
    try {
      const produtos = await Produto.listarTodos();
      return res.status(200).json(produtos);
    } catch (error) {
      console.error("Erro ao listar produtos:", error);
      return res.status(500).json({ mensagem: 'Erro interno ao consultar produtos.' });
    }
  }

  static async buscarPorCodigo(req: Request, res: Response): Promise<Response> {
    try {
      const { codigo } = req.params;
      const produto = await Produto.buscarPorCodigo(String(codigo));
      
      if (!produto) {
        return res.status(404).json({ mensagem: 'Produto não encontrado.' });
      }

      return res.status(200).json(produto);
    } catch (error) {
      console.error("Erro ao buscar produto por código:", error);
      return res.status(500).json({ mensagem: 'Erro interno ao buscar produto.' });
    }
  }

  static async listarReposicao(req: Request, res: Response): Promise<Response> {
    try {
      const produtos = await Produto.listarReposicao();
      return res.status(200).json(produtos);
    } catch (error) {
      console.error("Erro ao listar reposição:", error);
      return res.status(500).json({ mensagem: 'Erro interno ao buscar produtos para reposição.' });
    }
  }

  static async cadastrar(req: Request, res: Response): Promise<Response> {
    try {
      const { codigo_produto, nome, categoria, preco_unitario, quantidade_disponivel, quantidade_minima, status } = req.body;

      // 1. Validação de campos obrigatórios
      if (!codigo_produto || !nome || !categoria || preco_unitario === undefined) {
        return res.status(400).json({ mensagem: 'Código, nome, categoria e preço unitário são obrigatórios.' });
      }

      // 2. Validação de formato/valores numéricos (regras de CHECK do banco)
      if (typeof preco_unitario !== 'number' || preco_unitario < 0) {
        return res.status(400).json({ mensagem: 'O preço unitário deve ser um número maior ou igual a zero.' });
      }

      if (quantidade_disponivel !== undefined && (typeof quantidade_disponivel !== 'number' || quantidade_disponivel < 0)) {
        return res.status(400).json({ mensagem: 'A quantidade disponível não pode ser negativa.' });
      }

      if (quantidade_minima !== undefined && (typeof quantidade_minima !== 'number' || quantidade_minima < 0)) {
        return res.status(400).json({ mensagem: 'A quantidade mínima não pode ser negativa.' });
      }

      if (status && !['ATIVO', 'DESATIVADO'].includes(status)) {
        return res.status(400).json({ mensagem: 'Status deve ser ATIVO ou DESATIVADO.' });
      }

      // 3. Validação de chave estrangeira (FK da Categoria)
      const categoriaExiste = await Categoria.buscarPorNome(categoria);
      if (!categoriaExiste) {
        return res.status(400).json({ mensagem: 'A categoria informada não existe no banco de dados.' });
      }

      // 4. Validação de duplicidade de PK
      const produtoExiste = await Produto.buscarPorCodigo(codigo_produto);
      if (produtoExiste) {
        return res.status(409).json({ mensagem: 'Já existe um produto com este código.' });
      }

      const novoProduto = await Produto.cadastrar(req.body);

      return res.status(201).json({
        mensagem: 'Produto cadastrado com sucesso!',
        produto: novoProduto
      });

    } catch (error) {
      console.error('Erro no cadastro:', error);
      return res.status(500).json({ mensagem: 'Erro interno do servidor ao cadastrar produto.' });
    }
  }
}