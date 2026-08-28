import { Request, Response } from 'express';
import { Categoria } from '../model/Categoria';

export class CategoriaController {
  static async listar(req: Request, res: Response): Promise<Response> {
    try {
      const categorias = await Categoria.listarTodas();
      return res.status(200).json(categorias);
    } catch (error) {
      console.error('Erro ao listar categorias:', error);
      return res.status(500).json({ mensagem: 'Erro interno ao consultar categorias.' });
    }
  }

  static async buscarPorNome(req: Request, res: Response): Promise<Response> {
    try {
      const { nome } = req.params;
      const categoria = await Categoria.buscarPorNome(String(nome));

      if (!categoria) {
        return res.status(404).json({ mensagem: 'Categoria não encontrada.' });
      }

      return res.status(200).json(categoria);
    } catch (error) {
      console.error('Erro ao buscar categoria:', error);
      return res.status(500).json({ mensagem: 'Erro interno ao buscar categoria.' });
    }
  }

  static async cadastrar(req: Request, res: Response): Promise<Response> {
    try {
      const { nome_categoria, descricao } = req.body;

    
      if (!nome_categoria || typeof nome_categoria !== 'string' || nome_categoria.trim() === '') {
        return res.status(400).json({ mensagem: 'O campo nome_categoria é obrigatório.' });
      }

      const categoriaExistente = await Categoria.buscarPorNome(nome_categoria);
      if (categoriaExistente) {
        return res.status(409).json({ mensagem: 'Já existe uma categoria cadastrada com este nome.' });
      }

      const novaCategoria = await Categoria.cadastrar({
        nome_categoria: nome_categoria.trim(),
        descricao: descricao ? descricao.trim() : undefined,
      });

      return res.status(201).json({
        mensagem: 'Categoria cadastrada com sucesso!',
        categoria: novaCategoria,
      });
    } catch (error) {
      console.error('Erro ao cadastrar categoria:', error);
      return res.status(500).json({ mensagem: 'Erro interno ao cadastrar categoria.' });
    }
  }
}