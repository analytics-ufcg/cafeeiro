################################################################################
# LIBRARY() and SOURCE()
################################################################################
source("global_model.R")

################################################################################
# MAIN
################################################################################

# Read the parameters from the arguments 
args <- commandArgs(trailingOnly=TRUE)

# args <- c('Varginha-alta-tx5', 'Subjetivo - M1,Subjetivo - M2', 'Acurácia,AUC');

# ------------------------------------------------------------------------------
# Prepare the parameters and the query
# ------------------------------------------------------------------------------
scenario <- args[1]
att.methods <- strsplit(gsub(" ", "", args[2]), ",")[[1]]
metrics <- strsplit(args[3], ",")[[1]]

metrics.in.query <- paste(metrics.to.english[metrics], collapse=", ")
att.methods.in.query <- paste("attribute_method = '", att.methods, "'", sep = "", collapse=" OR ")

query <- gsub("[METRICS]", metrics.in.query, fixed = T,
              gsub("[ATT_METHODS]", att.methods.in.query, fixed = T,
              		gsub("[SCENARIO]", scenario, fixed=T,
              			query.map["get_experiment_by_parameter"])))

# ------------------------------------------------------------------------------
# Run the Query
# ------------------------------------------------------------------------------

conn <- odbcConnect(dsn)
exp.data <- sqlQuery(conn, query)
odbcClose(conn)

# exp.data <- data.frame(run = 1:10, 
#                        attribute_method = c(rep("Subjetivo - M1", 5), rep("Subjetivo - M2", 5)),
#                        model = rep("RF - Dissertation", 10),
#                        accuracy = runif(10, 0, 1),
#                        auc = runif(10, 0.5, 1))

# ------------------------------------------------------------------------------
# Generate the IC data
# ------------------------------------------------------------------------------
# Rename the metrics columns to portuguese
colnames(exp.data)[4:ncol(exp.data)] <- metrics

# Reshape the experiment data to put all metrics in the same column
exp.data <- melt.data.frame(exp.data, 
                            id.vars = c("run", "attribute_method", "model"),
                            variable_name = "metric")

# Get the Confidence Interval with the Bootstrapping method
ci.data <- ddply(exp.data, .(attribute_method, model, metric), function(df) BootCI.Mean(df, var="value", .95))
ci.data$model_and_att_method <- do.call(paste, c(ci.data[ , c("model", "attribute_method")], list(sep = ' / ')))

# ------------------------------------------------------------------------------
# Generate the Plot output
# ------------------------------------------------------------------------------
# Create the GGPLOT Confidence Interval
# theme_set(theme_bw(base_size = 20))
# limits <- aes(ymin=lower_ci, ymax=upper_ci)
# pd <- position_dodge(.3 * length(att.methods), 1)

# ic.plot <- ggplot(ci.data, aes_string(x="model", y="mean_ci", col="attribute_method")) +
#   geom_point(position=pd, size=4) + 
#   geom_errorbar(limits, size=2, width=.2, position=pd) + # Move the ICs .05 to the left/right
#   facet_wrap(~metric, scales="free_y", ncol=2) +
#   labs(list(x = "Modelo", y = "", colour = "Atributos", title = "")) +
#   theme(strip.text.x = element_text(size = 15))

# # Persist the PLOT
# plot.dir <- "../img/plots"
# dir.create(plot.dir, showWarnings=T)

# plot.width = length(unique(ci.data$model)) * length(metrics) * 450 + 100
# plot.height = 500 * ceiling(length(metrics)/2) + 50

# png(paste(plot.dir, "/prediction-model_comparison-experiment.png", sep =""), width = plot.width, height = plot.height)
# print(ic.plot)
# graphics.off()

# ------------------------------------------------------------------------------
# Send the CI Data as a JSON
# ------------------------------------------------------------------------------
cat(df2json(ci.data))

