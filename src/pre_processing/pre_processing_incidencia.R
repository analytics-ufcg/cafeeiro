rm(list = ls())

library(plyr)

# Read the dataset
data <- read.csv2("data/dados_cafeeiro.csv", header = T)

# ------------------------------------------------------------------------------
# TRANSFORM "mes", "ano" IN "dia"
# ------------------------------------------------------------------------------
fixed.day <- 28

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
# Add the incidencia with the last window
# ------------------------------------------------------------------------------
data <- ddply(data, .(cidade, lavoura, carga), function(df){
  # ATTENTION: We consider that the data is ordered by date.
  
  # Shift the incidencia and add the first value as -1
  df$incidencia_w1 <- c(-1, df$incidencia[-length(df$incidencia)])
  
  # Organize the data.frame (incidencia and incidencia_w1 side by side)
  df <- df[,c(1:5, 31, 6:30)]
  
}, .progress = "text")


# ------------------------------------------------------------------------------
# Write a new data: dados_cafeeiro_db.csv
# ------------------------------------------------------------------------------
write.csv(data, file="data/dados_cafeeiro_db.csv", row.names = F)

