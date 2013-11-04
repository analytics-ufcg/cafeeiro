rm(list = ls())

# Read the dataset
dataset <- read.csv2("data/dados_cafeeiro.csv", header = T)

# ------------------------------------------------------------------------------
# TRANSFORM "mes", "ano" IN "dia"
# ------------------------------------------------------------------------------
fixed.day <- 25

# From month abbreviation in portuguese to month name in english
MonthName = list("JAN" = "January", "FEV" = "February", "MAR" = "March", "ABR" = "April", 
                 "MAI" = "May", "JUN" = "June", "JUL" = "July", "AGO" = "August", 
                 "SET" = "September", "OUT" = "October", "NOV" = "November", "DEZ" = "December")

# Define a new column as: "fixed.day month.name year"
dataset$dia <- paste(fixed.day, MonthName[as.character(dataset$mes)], dataset$ano)

# Remove the mes and ano
dataset$mes <- NULL
dataset$ano <- NULL

# Reorganize the dataset
dataset <- dataset[,c(1, ncol(dataset), 2:(ncol(dataset)-1))]

# ------------------------------------------------------------------------------
# Replace the NA values from "thur95_pinf" with -1
# ------------------------------------------------------------------------------

# dataset$thur95_pinf <- as.numeric(as.character(dataset$thur95_pinf))
# 
# dataset[is.na(dataset[,"thur95_pinf"]), "thur95_pinf"] <- -1

# ------------------------------------------------------------------------------
# Write a new dataset: dados_cafeeiro_db.csv
# ------------------------------------------------------------------------------
write.csv(dataset, file="data/dados_cafeeiro_db.csv", row.names = F)

