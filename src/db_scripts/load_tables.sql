-- ==================== BULK LOAD DATA SCRIPT ====================

-- We consider that the data is completely under the "/home/augusto/git/cafeeiro/data/dados_cafeeiro_db.csv" directory

-- ================= LOAD the INCIDENCIA table =================
COPY incidencia
FROM LOCAL '/home/augusto/git/cafeeiro/data/dados_cafeeiro_db.csv'
DELIMITER ','    -- Column Delimiter
ENCLOSED BY '"'  -- String delimiter
NULL AS 'NA'     -- NULL values are defined as NA
SKIP 1;          -- Skip the header

-- ================= LOAD the EXPERIMENT table =================
COPY experiment
FROM LOCAL '/home/augusto/git/cafeeiro/data/experiments/*.csv'
DELIMITER ','    -- Column Delimiter
ENCLOSED BY '"'  -- String delimiter
NULL AS 'NA'     -- NULL values are defined as NA
SKIP 1;          -- Skip the header