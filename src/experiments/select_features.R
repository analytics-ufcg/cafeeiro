rm(list = ls())

################################################################################
# SOURCE() and LIBRARY()
################################################################################
library(RODBC)
library(plyr)
library(FSelector)

################################################################################
# FUNCTIONS
################################################################################

################################################################################
# MAIN
################################################################################

# ------------------------------------------------------------------------------
# Read the data
# ------------------------------------------------------------------------------
cat("Reading the data...\n")

# DATABASE CONNECTION
my.conn <- odbcConnect("CafeeiroDSN", readOnlyOptimize = T)

# DATASET retrieval
query <- "SELECT * FROM incidencia;"
data <- sqlQuery(my.conn, query)

# DATABASE close the channel connection
odbcClose(my.conn)

# Select the input variables only
input <- c("lavoura", "tmax_pinf", "tmin_pinf", "tmed_pinf", 
                "ur_pinf", "med_precip_pinf", "precip_pinf", "dchuv_pinf",
                "med_indpluvmax_pinf", "acdinf_pinf", "dmfi_pinf", "dfmfi_pinf",
                "ddi_pinf", "nhur95_pinf", "smt_nhur95_pinf", "thur95_pinf",
                "nhur95_pinf", "smt_nhnur95_pinf", "tmax_pi_pinf", "tmin_pi_pinf",
                "tmed_pi_pinf", "vvento_pinf", "smt_vvento_pinf",
                # New attributes added by us
                "incidencia_w1")
output <- c("taxa_inf_m5", "taxa_inf_m10")

# Cast the factors to numeric
data$lavoura <- as.numeric(data$lavoura)

# Select features with:
# CFS
cfs.subset <- cfs(taxa_inf_m5~., data[,c(input, output[1])])
print(cfs.subset)

# Consistency
consistence.subset <- consistency(taxa_inf_m5~., data[,c(input[-1], output[1])])
print(consistence.subset)

# TODO: Select more 2 and run!




