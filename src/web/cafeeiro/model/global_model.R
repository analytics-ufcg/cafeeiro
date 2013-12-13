################################################################################
# LIBRARY() and SOURCE()
################################################################################
library(RODBC)
library(reshape)
library(plyr)
library(boot)
library(df2json)

################################################################################
# FUNCTIONS
################################################################################
BootCI.Mean <- function(data, var, conf.level=.95){
  
  meanFunc <- function(x, i){mean(x[i], na.rm=T)}
  
  data.boot <- boot(data[,var], statistic=meanFunc, R=1000)
  norm.ci <- boot.ci(data.boot, type="norm", conf=conf.level)$normal
  
  return(data.frame(mean_ci = norm.ci[2] + ((norm.ci[3] - norm.ci[2])/2), 
                    lower_ci=norm.ci[2], upper_ci=norm.ci[3]))
}

################################################################################
# GLOBAL VARIABLES
################################################################################
dsn <- "CafeeiroDSN"

metrics.to.english <- c("Acurácia" = "accuracy", "Erro" = "Error", 
                        "Sensitividade" = "Sensitivity", 
                        "Especificidade" = "Specificity", "FP-Rate" = "fprate",
                        "TP-Rate" = "tprate", "AUC" = "AUC")

query.map <- c("get_experiment_by_parameter" = 
                 "SELECT run, attribute_method, model, [METRICS] 
                  FROM experiment 
                  WHERE ([ATT_METHODS]) AND scenario = '[SCENARIO]';")
