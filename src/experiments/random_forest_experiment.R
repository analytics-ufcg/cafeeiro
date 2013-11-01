rm(list = ls())

################################################################################
# SOURCE() and LIBRARY()
################################################################################
# library(RODBC)
library(randomForest)
library(plyr)
library(ROCR)

################################################################################
# FUNCTIONS
################################################################################
TrainTestRandomForest <- function(train, test){
  # The train has the complete dataset: independent variable + dependent variable (or target.attribute)
  # The test has only the independent variables
  # Obs.: the target.attribute is always the last attribute of the train data
  
  # TODO: 
  # * Run Classification with Random Forest with the same parameters of the dissertation
  # * Do the predictions in the test set and reset this vector (this is a binary, 0 or 1 vector)
  predictions <- rep(0, nrow(test))
  
  # DICA:
  # * atributos aleatórios: 8 
  # * nível máximo por árvore: 8 
  # * nº de árvores: 100 
  # * FALTA pegar os outros parametros default do WEKA para checar se são o mesmo dos default do R
  
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
    
    # TODO: Uncomment this when finished!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    # predictions <- TrainTestRandomForest(train, test)
    
    # TODO: Comment this when finished!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    predictions <- sample(0:1, length(fold.rows), replace = T)
    
    # --------------------------------------------------------------------------
    # Evaluate the predictions    
    pred <- prediction(predictions, test.target)
    
    acc <- performance(pred, measure = "acc")@y.values[[1]][2]
    err <- performance(pred, measure = "err")@y.values[[1]][2]
    sens <- performance(pred, measure = "sens")@y.values[[1]][2]
    spec <- performance(pred, measure = "spec")@y.values[[1]][2]
    fprate <- performance(pred, measure = "fpr")@y.values[[1]][2]
    tprate <- performance(pred, measure = "tpr")@y.values[[1]][2]
    auc <- performance(pred, measure = "auc")@y.values[[1]][1]
    
    # Store thre result
    result <- rbind(result, data.frame(model = "Random Forest",
                                       fold = fold,
                                       accuracy = acc, error = err,
                                       sensitivity = sens, specificity = spec,
                                       fprate = fprate, tprate = tprate,
                                       auc = auc))

    # Remove the fold.rows from the rows vector (to not be selected in the next iteration)
    rows <- rows[-fold.rows]
  }
  
  return(result)
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
  
  # For each attribute subset do... and RETURN
  result <- ldply(attributes, RunByAttributeSubset, target.attribute, data.scenario, .progress = "text")
  colnames(result)[1] <- "attribute.method"
  
  return (result)
}

################################################################################
# MAIN
################################################################################

# ------------------------------------------------------------------------------
# Read the data
# ------------------------------------------------------------------------------
cat("Reading the data...\n")
# # Libs
# 
# # DATABASE CONNECTION
# my.conn <- odbcConnect("CafeeiroDSN")
# 
# # DATASET retrieval
# query <- "SELECT * FROM incidencia;"
# dataset <- sqlQuery(my.conn, query)

data <- read.csv("data/dados_cafeeiro_db.csv")

# ------------------------------------------------------------------------------
# Define the scenarios and attributes lists
# ------------------------------------------------------------------------------
cat("Defining the scenarios and attributes lists...\n")

# Create the scenarios list (based on the dissertation)
scenarios <- list("Varginha-alta-tx5" = list(cidades=c("Varginha-antigo", "Varginha"), carga = "alta", atributo.meta = "taxa_inf_m5"), 
                  "Varginha-baixa-tx5" = list(cidades=c("Varginha-antigo", "Varginha"), carga = "baixa", atributo.meta = "taxa_inf_m5"), 
                  "Varginha-alta-tx10" = list(cidades=c("Varginha-antigo", "Varginha"), carga = "alta", atributo.meta = "taxa_inf_m10"), 
                  "Varginha-Novo-alta-tx5" = list(cidades=c("Varginha"), carga = "alta", atributo.meta = "taxa_inf_m5"), 
                  "Varginha-Novo-baixa-tx5" = list(cidades=c("Varginha"), carga = "baixa", atributo.meta = "taxa_inf_m5"), 
                  "Varginha-Novo-alta-tx10" = list(cidades=c("Varginha"), carga = "alta", atributo.meta = "taxa_inf_m10"), 
                  "Tudo-alta-tx5" = list(cidades=unique(data$cidade), carga = "alta", atributo.meta = "taxa_inf_m5"), 
                  "Tudo-baixa-tx5" = list(cidades=unique(data$cidade), carga = "baixa", atributo.meta = "taxa_inf_m5"), 
                  "Tudo-alta-tx10" = list(cidades=unique(data$cidade), carga = "alta", atributo.meta = "taxa_inf_m10"), 
                  "Tudo-Novo-alta-tx5" = list(cidades=c("Varginha", "Carmo-de-minas", "Boa-esperanca"), carga = "alta", atributo.meta = "taxa_inf_m5"), 
                  "Tudo-Novo-baixa-tx5" = list(cidades=c("Varginha", "Carmo-de-minas", "Boa-esperanca"), carga = "baixa", atributo.meta = "taxa_inf_m5"), 
                  "Tudo-Novo-alta-tx10" = list(cidades=c("Varginha", "Carmo-de-minas", "Boa-esperanca"), carga = "alta", atributo.meta = "taxa_inf_m10"))

# Create the attributes list (based on the dissertation)
attributes <- c("lavoura", "tmax_pinf", "tmin_pinf", "tmed_pinf", 
                "ur_pinf", "med_precip_pinf", "precip_pinf", "dchuv_pinf",
                "med_indpluvmax_pinf", "acdinf_pinf", "dmfi_pinf", "dfmfi_pinf",
                "ddi_pinf", "nhur95_pinf", "smt_nhur95_pinf", "thur95_pinf",
                "nhur95_pinf", "smt_nhnur95_pinf", "tmax_pi_pinf", "tmin_pi_pinf",
                "tmed_pi_pinf", "vvento_pinf", "smt_vvento_pinf")

# PROBLEM: We did not added the Weka attribute selection methods: WRP, Chi2, CFS, IG and GR
attribute.subsets <- list("Subjetivo-Modelagem1" = attributes,
                          "Subjetivo-Modelagem2" = attributes[c(1:8, 14, 16:17, 19:21)],
                          "Subjetivo-Modelagem3" = attributes[c(1:8, 19:21)])

# ------------------------------------------------------------------------------
# RUN THE EXPERIMENT per Scenario
# ------------------------------------------------------------------------------
cat("Running the experiment per scenario...\n")
result <- ldply(scenarios, RunByScenario, attribute.subsets, data)
colnames(result)[1] <- "scenario"

# ------------------------------------------------------------------------------
# Persist the results
# ------------------------------------------------------------------------------
cat("Persisting the results...\n")
write.csv(result, file = "data/experiment_random_forest_10foldCV.csv", row.names = F)
