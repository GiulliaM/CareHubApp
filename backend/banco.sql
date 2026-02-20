-- ==========================================================
-- CareHub - Schema completo v2.0
-- Multi-paciente, Grupo de cuidado, Diário categorizado
-- ==========================================================

-- Usuários (familiar ou cuidador)
CREATE TABLE IF NOT EXISTS usuarios (
  usuario_id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(200) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  senha_hash VARCHAR(255) NOT NULL,
  tipo ENUM('familiar','cuidador') NOT NULL,
  telefone VARCHAR(20) NULL,
  foto_url VARCHAR(500) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pacientes (pessoa cuidada / ente querido)
CREATE TABLE IF NOT EXISTS pacientes (
  paciente_id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(200) NOT NULL,
  idade INT,
  genero VARCHAR(50),
  observacoes TEXT,
  foto_url VARCHAR(500) NULL,
  criado_por INT NULL COMMENT 'usuario que cadastrou o paciente',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (criado_por) REFERENCES usuarios(usuario_id) ON DELETE SET NULL
);

-- Grupo de cuidado: vincula usuarios a pacientes (substitui fk_usuario_id)
-- Um paciente pode ter ate 5 membros; um usuario pode cuidar de ate 3 pacientes
CREATE TABLE IF NOT EXISTS grupo_cuidado (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  paciente_id INT NOT NULL,
  papel ENUM('dono','familiar','cuidador') DEFAULT 'familiar',
  status ENUM('Ativo','Pendente','Encerrado') DEFAULT 'Ativo',
  data_vinculo TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_usuario_paciente (usuario_id, paciente_id),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(usuario_id) ON DELETE CASCADE,
  FOREIGN KEY (paciente_id) REFERENCES pacientes(paciente_id) ON DELETE CASCADE
);
CREATE INDEX idx_grupo_usuario ON grupo_cuidado (usuario_id);
CREATE INDEX idx_grupo_paciente ON grupo_cuidado (paciente_id);

-- Tarefas
CREATE TABLE IF NOT EXISTS tarefas (
  tarefa_id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  detalhes TEXT,
  data DATE,
  hora TIME,
  concluida TINYINT(1) DEFAULT 0,
  hora_conclusao DATETIME NULL,
  dias_repeticao VARCHAR(255),
  grupo_repeticao VARCHAR(36) NULL COMMENT 'UUID para agrupar tarefas repetidas',
  paciente_id INT,
  criado_por INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (paciente_id) REFERENCES pacientes(paciente_id) ON DELETE CASCADE,
  FOREIGN KEY (criado_por) REFERENCES usuarios(usuario_id) ON DELETE SET NULL
);
CREATE INDEX idx_tarefas_paciente ON tarefas (paciente_id);
CREATE INDEX idx_tarefas_data ON tarefas (data);
CREATE INDEX idx_tarefas_grupo ON tarefas (grupo_repeticao);

-- Responsaveis por tarefa (N:N)
CREATE TABLE IF NOT EXISTS tarefa_responsaveis (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tarefa_id INT NOT NULL,
  usuario_id INT NOT NULL,
  UNIQUE KEY uk_tarefa_usuario (tarefa_id, usuario_id),
  FOREIGN KEY (tarefa_id) REFERENCES tarefas(tarefa_id) ON DELETE CASCADE,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(usuario_id) ON DELETE CASCADE
);
CREATE INDEX idx_tarefa_resp_tarefa ON tarefa_responsaveis (tarefa_id);
CREATE INDEX idx_tarefa_resp_usuario ON tarefa_responsaveis (usuario_id);

-- Medicamentos
CREATE TABLE IF NOT EXISTS medicamentos (
  medicamento_id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  dosagem VARCHAR(100),
  mg DECIMAL(10,2) NULL COMMENT 'miligramas por comprimido',
  qtd_comprimidos INT NULL COMMENT 'quantos comprimidos tomar por dose',
  horarios TEXT,
  concluido TINYINT(1) DEFAULT 0,
  hora_conclusao DATETIME NULL,
  inicio DATE,
  duracao_days INT,
  uso_continuo TINYINT(1) DEFAULT 0,
  paciente_id INT,
  tipo_agendamento VARCHAR(20) DEFAULT 'manual',
  intervalo_horas INT NULL,
  data_fim DATE NULL,
  dias_semana VARCHAR(50) NULL,
  grupo_repeticao VARCHAR(36) NULL COMMENT 'UUID para agrupar medicamentos repetidos',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (paciente_id) REFERENCES pacientes(paciente_id) ON DELETE CASCADE
);
CREATE INDEX idx_medicamentos_paciente ON medicamentos (paciente_id);
CREATE INDEX idx_medicamentos_grupo ON medicamentos (grupo_repeticao);

-- Diario: registros (header por dia)
CREATE TABLE IF NOT EXISTS diario_registros (
  registro_id INT AUTO_INCREMENT PRIMARY KEY,
  data DATE,
  hora TIME,
  paciente_id INT,
  usuario_id INT,
  comentario TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (paciente_id) REFERENCES pacientes(paciente_id) ON DELETE CASCADE,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(usuario_id) ON DELETE SET NULL
);
CREATE INDEX idx_diario_paciente ON diario_registros (paciente_id);
CREATE INDEX idx_diario_usuario ON diario_registros (usuario_id);

-- Diario: itens categorizados (cada item selecionado pelo usuario)
CREATE TABLE IF NOT EXISTS diario_itens (
  item_id INT AUTO_INCREMENT PRIMARY KEY,
  registro_id INT NOT NULL,
  categoria ENUM('humor','ocorrencias','sintomas','digestao','atividade_fisica') NOT NULL,
  codigo VARCHAR(50) NOT NULL COMMENT 'identificador do item ex: feliz, dor_cabeca, nausea',
  valor TEXT NULL COMMENT 'campo extra: contagem, descricao, etc',
  FOREIGN KEY (registro_id) REFERENCES diario_registros(registro_id) ON DELETE CASCADE
);
CREATE INDEX idx_diario_itens_registro ON diario_itens (registro_id);
CREATE INDEX idx_diario_itens_categoria ON diario_itens (categoria);

-- Indices para consultas frequentes
CREATE INDEX idx_diario_registro_usuario ON diario_registros (registro_id, usuario_id);

-- Modulo A: Perfil do Cuidador
CREATE TABLE IF NOT EXISTS perfil_cuidadores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL UNIQUE,
  bio TEXT,
  especialidades JSON COMMENT 'Array de tags: ["Alzheimer", "Mobilidade Reduzida", etc.]',
  preco_hora DECIMAL(10,2) NULL,
  cidade VARCHAR(100) NULL,
  bairro VARCHAR(100) NULL,
  foto_url VARCHAR(500) NULL,
  telefone VARCHAR(20) NULL,
  disponivel_busca TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(usuario_id) ON DELETE CASCADE
);
CREATE INDEX idx_perfil_cuidadores_usuario ON perfil_cuidadores (usuario_id);
CREATE INDEX idx_perfil_cuidadores_disponivel ON perfil_cuidadores (disponivel_busca);
CREATE INDEX idx_perfil_cuidadores_cidade ON perfil_cuidadores (cidade);
CREATE INDEX idx_perfil_cuidadores_bairro ON perfil_cuidadores (bairro);

-- Historico medico (1 por paciente) + auditoria ultima alteracao
CREATE TABLE IF NOT EXISTS historico_medico (
  id INT AUTO_INCREMENT PRIMARY KEY,
  paciente_id INT NOT NULL UNIQUE,
  condicoes_cronicas TEXT,
  alergias TEXT,
  historico_cirurgico TEXT,
  tipo_sanguineo VARCHAR(10) NULL,
  plano_saude_nome VARCHAR(200) NULL,
  plano_saude_numero VARCHAR(100) NULL,
  contatos_emergencia TEXT NULL,
  medico_responsavel VARCHAR(200) NULL,
  telefone_medico VARCHAR(30) NULL,
  capacidade_funcional TEXT NULL,
  observacoes_gerais TEXT NULL,
  ultima_alteracao_por INT NULL,
  ultima_alteracao_em DATETIME NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (paciente_id) REFERENCES pacientes(paciente_id) ON DELETE CASCADE,
  FOREIGN KEY (ultima_alteracao_por) REFERENCES usuarios(usuario_id) ON DELETE SET NULL
);
CREATE INDEX idx_historico_medico_paciente ON historico_medico (paciente_id);

-- Convites de vinculo (codigo 6 digitos, valido 24h)
CREATE TABLE IF NOT EXISTS convites_vinculo (
  id INT AUTO_INCREMENT PRIMARY KEY,
  paciente_id INT NOT NULL,
  criado_por INT NOT NULL,
  codigo CHAR(6) NOT NULL,
  expira_em DATETIME NOT NULL,
  usado TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (paciente_id) REFERENCES pacientes(paciente_id) ON DELETE CASCADE,
  FOREIGN KEY (criado_por) REFERENCES usuarios(usuario_id) ON DELETE CASCADE
);
CREATE INDEX idx_convites_codigo ON convites_vinculo (codigo);
CREATE INDEX idx_convites_paciente ON convites_vinculo (paciente_id);

-- Manter tabela legada para compatibilidade durante migracao
CREATE TABLE IF NOT EXISTS vinculos_cuidador_paciente (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cuidador_id INT NOT NULL,
  paciente_id INT NOT NULL,
  data_vinculo TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('Ativo','Pendente','Encerrado') DEFAULT 'Ativo',
  UNIQUE KEY uk_cuidador_paciente (cuidador_id, paciente_id),
  FOREIGN KEY (cuidador_id) REFERENCES usuarios(usuario_id) ON DELETE CASCADE,
  FOREIGN KEY (paciente_id) REFERENCES pacientes(paciente_id) ON DELETE CASCADE
);
CREATE INDEX idx_vinculos_cuidador ON vinculos_cuidador_paciente (cuidador_id);
CREATE INDEX idx_vinculos_paciente ON vinculos_cuidador_paciente (paciente_id);
