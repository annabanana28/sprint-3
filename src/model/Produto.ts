import { DatabaseModel } from './DatabaseModel';

export class Produto {
  // 1. Listar todos os produtos
  static async listarTodos() {
    const pool = DatabaseModel.getPool();
    const result = await pool.query('SELECT * FROM produto;');
    return result.rows;
  }

  // 2. Buscar produto por código
  static async buscarPorCodigo(codigo: string) {
    const pool = DatabaseModel.getPool();
    const result = await pool.query('SELECT * FROM produto WHERE codigo_produto = $1;', [codigo]);
    return result.rows[0];
  }

  // 3. Listar produtos com estoque baixo (Reposição)
  static async listarReposicao() {
    const pool = DatabaseModel.getPool();
    const result = await pool.query('SELECT * FROM produto WHERE quantidade_disponivel <= quantidade_minima;');
    return result.rows;
  }

  // 4. Cadastrar novo produto
  static async cadastrar(dados: any) {
    const pool = DatabaseModel.getPool();
    const {
      codigo_produto,
      nome,
      descricao,
      categoria,
      preco_unitario,
      quantidade_disponivel,
      quantidade_minima,
      status
    } = dados;

    const query = `
      INSERT INTO produto 
        (codigo_produto, nome, descricao, categoria, preco_unitario, quantidade_disponivel, quantidade_minima, status)
      VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;

    const values = [
      codigo_produto,
      nome,
      descricao || null,
      categoria || null,
      preco_unitario,
      quantidade_disponivel || 0,
      quantidade_minima || 0,
      status || 'ATIVO'
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }
}