import { DatabaseModel } from './DatabaseModel';

export class Categoria {
  
  static async listarTodas() {
    const pool = DatabaseModel.getPool();
    const result = await pool.query('SELECT * FROM categoria;');
    return result.rows;
  }

  static async buscarPorNome(nome_categoria: string) {
    const pool = DatabaseModel.getPool();
    const result = await pool.query(
      'SELECT * FROM categoria WHERE nome_categoria = $1;',
      [nome_categoria]
    );
    return result.rows[0];
  }

  static async cadastrar(dados: { nome_categoria: string; descricao?: string }) {
    const pool = DatabaseModel.getPool();
    const { nome_categoria, descricao } = dados;

    const query = `
      INSERT INTO categoria (nome_categoria, descricao)
      VALUES ($1, $2)
      RETURNING *;
    `;

    const result = await pool.query(query, [nome_categoria, descricao || null]);
    return result.rows[0];
  }
}