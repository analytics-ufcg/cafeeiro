-- ==================== CREATE TABLES SCRIPT ====================

-- =========== TABLE: INCIDENCIA (with incidencia and all predictor variables) =========== 

CREATE TABLE IF NOT EXISTS incidencia (
    id_incidencia          AUTO_INCREMENT,
    lavoura                VARCHAR(50),
    -- TODO
    PRIMARY KEY            (id_incidencia)
);