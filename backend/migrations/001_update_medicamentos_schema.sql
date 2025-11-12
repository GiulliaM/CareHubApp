-- Migration: Adicionar campos para agendamento inteligente de medicamentos
-- Data: 2025-11-12

-- Adicionar novos campos
ALTER TABLE medicamentos
ADD COLUMN tipo_agendamento ENUM('manual', 'intervalo') DEFAULT 'manual' COMMENT 'Tipo de agendamento: manual ou por intervalo',
ADD COLUMN intervalo_horas INT NULL COMMENT 'Intervalo em horas (4, 6, 8, 12)',
ADD COLUMN data_fim DATE NULL COMMENT 'Data de término do medicamento (NULL se uso contínuo)',
ADD COLUMN dias_semana VARCHAR(50) NULL COMMENT 'Dias da semana para repetir (ex: "0,1,2,3,4,5,6")';

-- Modificar campo horarios para JSON (MySQL 5.7+)
-- Nota: Se usar MySQL < 5.7, manter como TEXT e validar no backend
ALTER TABLE medicamentos
MODIFY COLUMN horarios JSON COMMENT 'Array de horários em formato JSON: ["08:00", "16:00", "00:00"]';

-- Comentários explicativos:
-- tipo_agendamento: 
--   'manual' = usuário definiu horários manualmente
--   'intervalo' = horários gerados automaticamente por intervalo
-- 
-- intervalo_horas:
--   4 = de 4 em 4 horas (6 doses/dia)
--   6 = de 6 em 6 horas (4 doses/dia)
--   8 = de 8 em 8 horas (3 doses/dia)
--   12 = de 12 em 12 horas (2 doses/dia)
--
-- horarios (JSON):
--   Armazena array de horários: ["08:00", "16:00", "00:00"]
--   Permite edição individual de cada horário
--
-- uso_continuo:
--   1 = Uso contínuo (data_fim = NULL)
--   0 = Uso com data de término (data_fim preenchido)
--
-- Estratégia:
-- - Salvamos apenas o PADRÃO recorrente, não doses individuais
-- - A tela principal calcula dinamicamente as doses do dia
-- - Isso evita sobrecarga no banco com milhares de registros

-- Índices para melhor performance
CREATE INDEX idx_medicamentos_paciente_ativo ON medicamentos(paciente_id, inicio, data_fim);
CREATE INDEX idx_medicamentos_inicio ON medicamentos(inicio);
