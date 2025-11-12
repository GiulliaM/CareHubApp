-- Migration: Adicionar campos para agendamento inteligente de medicamentos (MySQL < 5.7)
-- Data: 2025-11-12
-- USAR APENAS SE O JSON NÃO FOR SUPORTADO

-- Adicionar novos campos
ALTER TABLE medicamentos
ADD COLUMN tipo_agendamento ENUM('manual', 'intervalo') DEFAULT 'manual' COMMENT 'Tipo de agendamento: manual ou por intervalo',
ADD COLUMN intervalo_horas INT NULL COMMENT 'Intervalo em horas (4, 6, 8, 12)',
ADD COLUMN data_fim DATE NULL COMMENT 'Data de término do medicamento (NULL se uso contínuo)',
ADD COLUMN dias_semana VARCHAR(50) NULL COMMENT 'Dias da semana para repetir (ex: "0,1,2,3,4,5,6")';

-- Manter horarios como TEXT (para MySQL antigo)
-- Formato: "08:00,16:00,00:00" (separado por vírgula)

-- Índices para melhor performance
CREATE INDEX idx_medicamentos_paciente_ativo ON medicamentos(paciente_id, inicio, data_fim);
CREATE INDEX idx_medicamentos_inicio ON medicamentos(inicio);
