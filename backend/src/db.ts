// back-end/src/db.ts
import { createPool } from 'mysql2/promise';

// O "pool" é a nossa conexão com o banco de dados
export const pool = createPool({
    host: '127.0.0.1', // Use 127.0.0.1 (não localhost)
    user: 'carehub_user',
    password: 'hubcare1234', // <<< COLOQUE SUA SENHA REAL DO BANCO
    database: 'carehub_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});