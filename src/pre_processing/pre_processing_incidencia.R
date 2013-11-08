rm(list = ls())

# Read the dataset
data <- read.csv2("data/dados_cafeeiro.csv", header = T)

# ------------------------------------------------------------------------------
# TRANSFORM "mes", "ano" IN "dia"
# ------------------------------------------------------------------------------
fixed.day <- 25

# From month abbreviation in portuguese to month name in english
MonthName = list("JAN" = "January", "FEV" = "February", "MAR" = "March", "ABR" = "April", 
                 "MAI" = "May", "JUN" = "June", "JUL" = "July", "AGO" = "August", 
                 "SET" = "September", "OUT" = "October", "NOV" = "November", "DEZ" = "December")

# Define a new column as: "fixed.day month.name year"
data$dia <- paste(fixed.day, MonthName[as.character(data$mes)], data$ano)

# Remove the mes and ano
data$mes <- NULL
data$ano <- NULL

# Reorganize the data
data <- data[,c(1, ncol(data), 2:(ncol(data)-1))]


# ------------------------------------------------------------------------------
# Cast data to its correct classes
# ------------------------------------------------------------------------------
data.classes <- c("factor", "character", rep("factor", 2), rep("numeric", 2), 
                  rep("integer", 2), rep("numeric", 22))
for (col in 1:ncol(data)){
  data[,col] <- do.call(paste("as.", data.classes[col], sep = ""), list(data[,col]))
}

# ------------------------------------------------------------------------------
# Write a new data: dados_cafeeiro_db.csv
# ------------------------------------------------------------------------------
write.csv(data, file="data/dados_cafeeiro_db.csv", row.names = F)

