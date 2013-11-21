# rm(list = ls())

################################################################################
# SOURCE() and LIBRARY()
################################################################################
library(RODBC)
library(randomForest)
library(plyr)
library(ROCR)
library(DMwR)

################################################################################
# FUNCTIONS
################################################################################
TrainTestRandomForest <- function(train, test){
  # The train has the complete dataset: independent variable + dependent variable (or target.attribute)
  # The test has only the independent variables
  # Obs.: the target.attribute is always the last attribute of the train data
  
  # From dissertation:
  # * nº de árvores: 100 
  # * atributos aleatórios: 8 
  # * nível máximo por árvore: 8 
  
  # Replace the NA values from "thur95_pinf" with -1
  if ("thur95_pinf" %in% colnames(train)){
    train[is.na(train[, "thur95_pinf"]), "thur95_pinf"] <- -1
    test[is.na(test[, "thur95_pinf"]), "thur95_pinf"] <- -1
  }
  
  # Train the RandomForest
  x <- train[,-ncol(train)]
  y <- factor(train[,ncol(train)])
  
  # Test the RandomForest
  r.tree <- randomForest(x, y, xtest = test, ntree = 100, mtry = 8)
  predictions <- as.numeric(r.tree$test$predicted)
  
  return(predictions)
}

Run10FoldCrossValidation <- function(data.scenario.atts){
  
  result <- NULL
  rows <- 1:nrow(data.scenario.atts)
  folds <- 10
  fold.size <- ceiling(length(rows)/folds)
  
  for(fold in 1:folds){
    
    # Select the rows of the current fold
    if (length(rows) > fold.size){
      # PROBLEM: This sampling can get only positive or negative values (that means a unary classification!)
      fold.rows <- sample(rows, fold.size, replace=F)
    }else{
      fold.rows <- rows
    }
    
    # Select the train and test sets
    train <- data.scenario.atts[-fold.rows,]
    test <- data.scenario.atts[fold.rows,] 
    
    # Store the target values of the test set
    test.target <- test[,ncol(test)]
    
    # Remove the target.attribute from the test set
    test <- test[,-ncol(data.scenario.atts)]
    
    # --------------------------------------------------------------------------
    # Train and Predict the Test values with the RandomForest
    predictions <- TrainTestRandomForest(train, test)
    
    # --------------------------------------------------------------------------
    # Evaluate the predictions
    # TODO: 
    #   * Stocastic BUG: Sometimes the fold has a unique class, raising an erro in the ROCR function! 
    #   * Solution: Implement our evaluator.
    pred <- prediction(predictions, test.target)
    
    acc <- performance(pred, measure = "acc")@y.values[[1]][2]
    err <- performance(pred, measure = "err")@y.values[[1]][2]
    sens <- performance(pred, measure = "sens")@y.values[[1]][2]
    spec <- performance(pred, measure = "spec")@y.values[[1]][2]
    fprate <- performance(pred, measure = "fpr")@y.values[[1]][2]
    tprate <- performance(pred, measure = "tpr")@y.values[[1]][2]
    auc <- performance(pred, measure = "auc")@y.values[[1]][1]
    
    # Store thre result
    result <- rbind(result, data.frame(acc = acc, err = err,
                                       sens = sens, spec = spec,
                                       fprate = fprate, tprate = tprate,
                                       auc = auc))
    
    # Remove the fold.rows from the rows vector (to not be selected in the next iteration)
    rows <- rows[-which(rows %in% fold.rows)]
  }
  result <- colMeans(result)
  
  final.cv <- data.frame(model = "Random Forest - Dissertation",
                         accuracy = result["acc"], error = result["err"],
                         sensitivity = result["sens"], specificity = result["spec"],
                         fprate = result["fprate"], tprate = result["tprate"],
                         auc = result["auc"])
  
  return(final.cv)
}

RunByAttributeSubset <- function(attribute.subset, target.attribute, data.scenario){
  
  # Select data: attribute.subset + target.attribute
  data.scenario.atts <- data.scenario[,c(attribute.subset, target.attribute)]
    
  # Run 10-Fold Cross-Validation and return the result
  return(Run10FoldCrossValidation(data.scenario.atts))
  
}

RunByScenario <- function(scenario, attributes, data){
  
  # Select data: scenario
  data.scenario <- subset(data, cidade %in% scenario$cidades & carga == scenario$carga)
  target.attribute <- scenario$atributo.meta
  
  # ----------------------------------------------------------------------------
  # Rebalancing classes to the scenarios with the following characteristics:
  #   * Carga = alta and atributo.meta = taxa_inf_m10
  #   * Carga = baixa and atributo.meta = taxa_inf_m5
  # ----------------------------------------------------------------------------
  if ((scenario$carga == "alta" & scenario$atributo.meta == "taxa_inf_m10") 
      | (scenario$carga == "baixa" & scenario$atributo.meta == "taxa_inf_m5")){
    # Casting the target.attribute to factor
    data.scenario[,target.attribute] <- as.factor(data.scenario[,target.attribute])
    # Running the SMOTE balancing method
    data.scenario <- SMOTE(as.formula(paste(target.attribute, "~ .")), data.scenario, perc.over=250, perc.under=150)
    # Re-Casting the target.attribute to integer
    data.scenario[,target.attribute] <- as.integer(as.character(data.scenario[,target.attribute]))
  }
    
  # For each attribute subset do... and RETURN
  result <- ldply(attributes, RunByAttributeSubset, target.attribute, data.scenario, .progress = "text")
  colnames(result)[1] <- "attribute_method"
  
  return (result)
}

################################################################################
# MAIN
################################################################################

# ------------------------------------------------------------------------------
# Read the data
# ------------------------------------------------------------------------------
cat("Reading the data...\n")
 
# DATABASE CONNECTION
my.conn <- odbcConnect("CafeeiroDSN", )
 
# DATASET retrieval
query <- "SELECT * FROM incidencia;"
data <- sqlQuery(my.conn, query)

# DATABASE close the channel connection
odbcClose(my.conn)

# data <- read.csv("data/dados_cafeeiro_db.csv")

# ------------------------------------------------------------------------------
# Define the scenarios and attributes lists
# ------------------------------------------------------------------------------
cat("Defining the scenarios and attributes lists...\n")

# Create the scenarios list (based on the dissertation)
scenarios <- list(
  "Varginha-alta-tx5" = list(cidades=c("Varginha-antigo", "Varginha"), carga = "alta", atributo.meta = "taxa_inf_m5"), 
  "Tudo-alta-tx5" = list(cidades=unique(data$cidade), carga = "alta", atributo.meta = "taxa_inf_m5")
#   "Varginha-baixa-tx5" = list(cidades=c("Varginha-antigo", "Varginha"), carga = "baixa", atributo.meta = "taxa_inf_m5"), 
#   "Varginha-alta-tx10" = list(cidades=c("Varginha-antigo", "Varginha"), carga = "alta", atributo.meta = "taxa_inf_m10"), 
#   "Tudo-baixa-tx5" = list(cidades=unique(data$cidade), carga = "baixa", atributo.meta = "taxa_inf_m5"), 
#   "Tudo-alta-tx10" = list(cidades=unique(data$cidade), carga = "alta", atributo.meta = "taxa_inf_m10"),
#   "Varginha-Novo-alta-tx5" = list(cidades=c("Varginha"), carga = "alta", atributo.meta = "taxa_inf_m5"), 
#   "Varginha-Novo-baixa-tx5" = list(cidades=c("Varginha"), carga = "baixa", atributo.meta = "taxa_inf_m5"), 
#   "Varginha-Novo-alta-tx10" = list(cidades=c("Varginha"), carga = "alta", atributo.meta = "taxa_inf_m10"), 
#   "Tudo-Novo-alta-tx5" = list(cidades=c("Varginha", "Carmo-de-minas", "Boa-esperanca"), carga = "alta", atributo.meta = "taxa_inf_m5"), 
#   "Tudo-Novo-baixa-tx5" = list(cidades=c("Varginha", "Carmo-de-minas", "Boa-esperanca"), carga = "baixa", atributo.meta = "taxa_inf_m5"), 
#   "Tudo-Novo-alta-tx10" = list(cidades=c("Varginha", "Carmo-de-minas", "Boa-esperanca"), carga = "alta", atributo.meta = "taxa_inf_m10")
  )

# Create the attributes list (based on the dissertation)
attributes <- c("lavoura", "tmax_pinf", "tmin_pinf", "tmed_pinf", 
                "ur_pinf", "med_precip_pinf", "precip_pinf", "dchuv_pinf",
                "med_indpluvmax_pinf", "acdinf_pinf", "dmfi_pinf", "dfmfi_pinf",
                "ddi_pinf", "nhur95_pinf", "smt_nhur95_pinf", "thur95_pinf",
                "nhur95_pinf", "smt_nhnur95_pinf", "tmax_pi_pinf", "tmin_pi_pinf",
                "tmed_pi_pinf", "vvento_pinf", "smt_vvento_pinf",
                # New attributes added by us
                "incidencia_w1")

# PROBLEM: We did not added the Weka attribute selection methods: WRP, Chi2, CFS, IG and GR
attribute.subsets <- list("Subjetivo-M1" = attributes[1:23],
                          "Subjetivo-M2" = attributes[c(1:8, 14, 16:17, 19:21)],
                          "Subjetivo-M3" = attributes[c(1:8, 19:21)],
                          "Subjetivo-M1-IncW1" = attributes[1:24],
                          "Subjetivo-M2-IncW1" = attributes[c(1:8, 14, 16:17, 19:21, 24)],
                          "Subjetivo-M3-IncW1" = attributes[c(1:8, 19:21, 24)])

# ------------------------------------------------------------------------------
# RUN THE EXPERIMENT per Scenario
# ------------------------------------------------------------------------------
cat("Running the experiment per scenario...\n")
num.experiments <- 15
result <- adply(1:num.experiments, 1, function(df){
  result <- ldply(scenarios, RunByScenario, attribute.subsets, data)
}, .progress="text")
colnames(result)[1:2] <- c("run", "scenario")

# ------------------------------------------------------------------------------
# Persist the results
# ------------------------------------------------------------------------------
output.dir <- "data/experiments"
dir.create(output.dir, showWarnings=F)

cat("Persisting the results...\n")
write.csv(result, file = paste(output.dir, "/RF_Dissertation_10FoldCV.csv", sep = ""), row.names = F)
