rm(list = ls())

library(ggplot2)
library(plyr)
library(boot)

################################################################################
# FUNCTIONS
################################################################################

ExperimentBootCI.Mean <- function(data, var, conf.level=.95){
  
  meanFunc <- function(x, i){mean(x[i], na.rm=T)}
  
  data.boot <- boot(data[,var], statistic=meanFunc, R=1000)
  norm.ci <- boot.ci(data.boot, type="norm", conf=conf.level)$normal
  
  return(data.frame(mean_ci = norm.ci[2] + ((norm.ci[3] - norm.ci[2])/2), 
                    lower_ci=norm.ci[2], upper_ci=norm.ci[3]))
}

PlotMetricCI <- function(metric.ci, metric.name, output.dir){
  
  limits <- aes(ymin=lower_ci, ymax=upper_ci)
  
  png(paste(output.dir, "/IC-", metric.name, "_Por_Cenário_SelAtributos-RF_Dissertation-10FoldCV.png", sep = ""), width=700, height=500)
  print(ggplot(metric.ci, aes(x=attribute_method, y=mean_ci)) +
          geom_point() + geom_errorbar(limits) + 
          ylab(metric.name) + xlab("Método de Seleção de Atributos") + facet_wrap(~scenario)+ 
          theme(axis.text.x = element_text(angle=45, hjust=1)))  
  dev.off()
}

################################################################################
# MAIN
################################################################################
experiment.dir <- "data/experiments"
data <- read.csv(paste(experiment.dir, "/RF_Dissertation_10FoldCV.csv", sep = ""))

theme_set(theme_bw())

output.dir <- "data/experiment_analysis"
dir.create(output.dir, showWarnings=F)

#-------------------------------------------------------------------------------
# Calculating CIs per Metric
#-------------------------------------------------------------------------------
cat("Calculating the Accuracy CI per: scenario and attribute_method...\n")
acc.ci <- ddply(data, c("scenario", "attribute_method"), ExperimentBootCI.Mean, 
                var="accuracy", .progress="text")

cat("Calculating the Error CI per: scenario and attribute_method...\n")
err.ci <- ddply(data, c("scenario", "attribute_method"), ExperimentBootCI.Mean, 
                var="error", .progress="text")

cat("Calculating the Sensitivity CI per: scenario and attribute_method...\n")
sens.ci <- ddply(data, c("scenario", "attribute_method"), ExperimentBootCI.Mean, 
                var="sensitivity", .progress="text")

cat("Calculating the Specificity CI per: scenario and attribute_method...\n")
spec.ci <- ddply(data, c("scenario", "attribute_method"), ExperimentBootCI.Mean, 
                var="specificity", .progress="text")

cat("Calculating the FPRate CI per: scenario and attribute_method...\n")
fprate.ci <- ddply(data, c("scenario", "attribute_method"), ExperimentBootCI.Mean, 
                var="fprate", .progress="text")

cat("Calculating the TPRate CI per: scenario and attribute_method...\n")
tprate.ci <- ddply(data, c("scenario", "attribute_method"), ExperimentBootCI.Mean, 
                var="tprate", .progress="text")

cat("Calculating the AUC CI per: scenario and attribute_method...\n")
auc.ci <- ddply(data, c("scenario", "attribute_method"), ExperimentBootCI.Mean, 
                var="auc", .progress="text")

#-------------------------------------------------------------------------------
# Plotting the CI per Metric
#-------------------------------------------------------------------------------

cat("Plotting the Accuracy CIs...\n")
PlotMetricCI(acc.ci, "Acurácia", output.dir)

cat("Plotting the Error CIs...\n")
PlotMetricCI(err.ci, "Erro", output.dir)

cat("Plotting the Sensitivity CIs...\n")
PlotMetricCI(sens.ci, "Sensitividade", output.dir)

cat("Plotting the Specificity CIs...\n")
PlotMetricCI(spec.ci, "Especificidade", output.dir)

cat("Plotting the FP-Rate CIs...\n")
PlotMetricCI(fprate.ci, "FP-Rate", output.dir)

cat("Plotting the TP-Rate CIs...\n")
PlotMetricCI(tprate.ci, "TP-Rate", output.dir)

cat("Plotting the AUC CIs...\n")
PlotMetricCI(auc.ci, "AUC", output.dir)
