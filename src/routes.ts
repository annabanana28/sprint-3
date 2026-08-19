import { Router } from 'express';
import { ProdutoController } from './controller/ProdutoController';

const router = Router();

// Rotas da Entidade Produto
router.post('/produtos', ProdutoController.cadastrar);
router.get('/produtos', ProdutoController.listar);
router.get('/produtos/reposicao', ProdutoController.listarReposicao); // Rota específica (RF16)
router.get('/produtos/:codigo', ProdutoController.buscarPorCodigo);

export { router };