import { Router } from 'express';
import { ProdutoController } from './controller/ProdutoController';
import { CategoriaController } from './controller/CategoriaController';
import { MovimentacaoController } from './controller/MovimentacaoController';

const router = Router();

// Rotas da Entidade Produto
router.post('/produtos', ProdutoController.cadastrar);
router.get('/produtos', ProdutoController.listar);
router.get('/produtos/reposicao', ProdutoController.listarReposicao);
router.get('/produtos/:codigo', ProdutoController.buscarPorCodigo);

// Rotas da Entidade Categoria
router.post('/categorias', CategoriaController.cadastrar);
router.get('/categorias', CategoriaController.listar);
router.get('/categorias/:nome', CategoriaController.buscarPorNome);

// Rotas da Entidade Movimentacao
router.post('/movimentacoes', MovimentacaoController.cadastrar);
router.get('/movimentacoes', MovimentacaoController.listar);
router.get('/movimentacoes/produto/:codigoProduto', MovimentacaoController.buscarPorProduto);

export { router };