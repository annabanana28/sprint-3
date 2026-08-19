import { Request, Response } from 'express';
import { Produto } from '../model/Produto';

export class ProdutoController {
  
  // Listar todos os produtos
  static async listar(req: Request, res: Response): Promise<Response> {
    try {
      const produtos = await Produto.listarTodos();
      return res.status(200).json(produtos);
    } catch (error) {
      console.error("Erro ao listar produtos:", error);
      return res.status(500).json({ mensagem: 'Erro interno ao consultar produtos.' });
    }
  }

  // Buscar produto por código
  static async buscarPorCodigo(req: Request, res: Response): Promise<Response> {
    try {
      const { codigo } = req.params;
      
      // String(codigo) força o TypeScript a entender o parâmetro como string simples
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

  // Listar produtos para reposição (Estoque baixo)
  static async listarReposicao(req: Request, res: Response): Promise<Response> {
    try {
      const produtos = await Produto.listarReposicao();
      return res.status(200).json(produtos);
    } catch (error) {
      console.error("Erro ao listar reposição:", error);
      return res.status(500).json({ mensagem: 'Erro interno ao buscar produtos para reposição.' });
    }
  }

  // Cadastrar produto
  static async cadastrar(req: Request, res: Response): Promise<Response> {
    try {
      const dadosProduto = req.body;
      
      // Validação básica se os campos obrigatórios vieram preenchidos
      if (!dadosProduto.codigo_produto || !dadosProduto.nome || !dadosProduto.preco_unitario) {
        return res.status(400).json({ mensagem: 'Campos obrigatórios faltando.' });
      }

      const novoProduto = await Produto.cadastrar(dadosProduto);

      // Retorna a mensagem de confirmação junto com o produto criado
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