-- ==================== CREATE TABLES SCRIPT ====================

-- =========== TABLE: INCIDENCIA (with incidencia and all predictor variables) =========== 

CREATE TABLE IF NOT EXISTS incidencia (
    id_incidencia          AUTO_INCREMENT,
    cidade                 VARCHAR(50),
    -- mes                    VARCHAR(15),
    -- ano                    INTEGER(4),
    dia                    TIMESTAMP,
    lavoura                VARCHAR(15),
    carga                  VARCHAR(10),
    incidencia             NUMERIC,
    taxa_inf               NUMERIC,
    taxa_inf_m5            BOOLEAN,
    taxa_inf_m10           BOOLEAN,
    tmax_pinf              NUMERIC,
    tmin_pinf              NUMERIC,
    tmed_pinf              NUMERIC,
    ur_pinf                NUMERIC,
    med_precip_pinf        NUMERIC,
    precip_pinf            NUMERIC,
    dchuv_pinf             NUMERIC,
    med_indpluvmax_pinf    NUMERIC,
    acdinf_pinf            NUMERIC,
    dmfi_pinf              NUMERIC,
    ddi_pinf               NUMERIC,
    nhur95_pinf            NUMERIC,
    smt_nhur95_pinf        NUMERIC,
    thur95_pinf            NUMERIC,
    nhnur95_pinf           NUMERIC,
    smt_nhnur95_pinf       NUMERIC,
    tmax_pi_pinf           NUMERIC,
    tmin_pi_pinf           NUMERIC,
    tmed_pi_pinf           NUMERIC,
    vvento_pinf            NUMERIC,
    smt_vvento_pinf        NUMERIC,
    dfmfi_pinf             NUMERIC,

    PRIMARY KEY            (id_incidencia)
);