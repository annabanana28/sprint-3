import { DatabaseModel } from './DatabaseModel';

export class Movimentacao {
  static async listarTodas() {
    const pool = DatabaseModel.getPool();
    const result = await pool.query('SELECT * FROM movimentacao ORDER BY data DESC;');
    return result.rows;
  }

  static async buscarPorProduto(codigo_produto: string) {
    const pool = DatabaseModel.getPool();
    const result = await pool.query(
      'SELECT * FROM movimentacao WHERE produto = $1 ORDER BY data DESC;',
      [codigo_produto]
    );
    return result.rows;
  }

  static async cadastrar(dados: any) {
    const pool = DatabaseModel.getPool();
    const {
      produto,
      tipo,
      quantidade,
      observacao,
      motivo_retirada,
      preco_unitario,
      valor_total,
      movimentacao_origem,
    } = dados;

    const query = `
      INSERT INTO movimentacao 
        (produto, tipo, quantidade, observacao, motivo_retirada, preco_unitario, valor_total, movimentacao_origem)
      VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;

    const values = [
      produto,
      tipo,
      quantidade,
      observacao || null,
      motivo_retirada || null,
      preco_unitario || null,
      valor_total || null,
      movimentacao_origem || null,
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }
}