CREATE TABLE IF NOT EXISTS usuarios (
  usuario_id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(200) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  senha_hash VARCHAR(255) NOT NULL,
  tipo ENUM('familiar','cuidador') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pacientes (
  paciente_id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(200) NOT NULL,
  idade INT,
  genero VARCHAR(50),
  observacoes TEXT,
  fk_usuario_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tarefas (
  tarefa_id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  detalhes TEXT,
  data DATE,
  hora TIME,
  dias_repeticao VARCHAR(255),
  responsavel_id INT,
  paciente_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS medicamentos (
  medicamento_id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  dosagem VARCHAR(100),
  horarios TEXT,
  inicio DATE,
  duracao_days INT,
  uso_continuo TINYINT(1) DEFAULT 0,
  paciente_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS diario_registros (
  registro_id INT AUTO_INCREMENT PRIMARY KEY,
  data DATE,
  hora TIME,
  atividades TEXT,
  comentario TEXT,
  paciente_id INT,
  usuario_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);