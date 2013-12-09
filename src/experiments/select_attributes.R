rm(list = ls())

################################################################################
# SOURCE() and LIBRARY()
################################################################################
library(RODBC)
library(plyr)
library(randomForest)

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

# data <- read.csv("data/dados_cafeeiro_db.csv")

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

# Select features with Random Forest Importance
r.tree <- randomForest(data[,input], as.factor(data[,output[1]]), ntree = 100, mtry = 8)

importance.data <- r.tree$importance
importance.data <- as.data.frame(importance.data[order(importance.data[,"MeanDecreaseGini"], decreasing=T),])

importance.data$attribute <- rownames(importance.data)
colnames(importance.data)[1] <- "MeanDecreaseGini"
importance.data <- importance.data[,c(2,1)]
rownames(importance.data) <- NULL

cat("Atributte importance by the RandomForest:\n")
print(importance.data)

