rm(list = ls())

# Libs
library(RODBC)


# DATABASE CONNECTION
my.conn <- odbcConnect("CafeeiroDSN")

# DATASET retrieval
query <- "SELECT * FROM incidencia;"
dataset <- sqlQuery(my.conn, query)

