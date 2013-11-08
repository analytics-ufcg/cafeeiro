rm(list = ls())

library(ggplot2)

################################################################################
# FUNCTIONS
################################################################################


################################################################################
# MAIN
################################################################################
experiment.dir <- "data/experiments"
rf.exp <- read.csv(paste(experiment.dir, "/RF_10foldCV.csv", sep = ""))

theme_set(theme_bw())

output.dir <- "data/analysis"
dir.create(output.dir, showWarnings=F)

pdf(paste(output.dir, "/Avaliações_Por_Cenário_RF_10CV.pdf", sep = ""), width=10, height=7)
print(ggplot(rf.exp) +
        geom_boxplot(aes(x=scenario, y=accuracy)) +
        ylab("Acurácia") + xlab("Cenário") + 
        theme(axis.text.x = element_text(angle=45, hjust=1)))

print(ggplot(rf.exp) +
        geom_boxplot(aes(x=scenario, y=error)) +
        ylab("Erro") + xlab("Cenário") + 
        theme(axis.text.x = element_text(angle=45, hjust=1)))

print(ggplot(rf.exp) +
        geom_boxplot(aes(x=scenario, y=sensitivity)) +
        ylab("Sensitividade") + xlab("Cenário") + 
        theme(axis.text.x = element_text(angle=45, hjust=1)))

print(ggplot(rf.exp) +
        geom_boxplot(aes(x=scenario, y=specificity)) +
        ylab("Especificidade") + xlab("Cenário") + 
        theme(axis.text.x = element_text(angle=45, hjust=1)))

print(ggplot(rf.exp) +
        geom_boxplot(aes(x=scenario, y=auc)) +
        ylab("AUC") + xlab("Cenário") + 
        theme(axis.text.x = element_text(angle=45, hjust=1)))
dev.off()


pdf(paste(output.dir, "/Avaliações_Por_Cenário_RF_10CV.pdf", sep = ""), width=8, height=6)
print(ggplot(rf.exp) +
        geom_boxplot(aes(x=scenario, y=accuracy)) +
        ylab("Acurácia") + xlab("Cenário") + 
        theme(axis.text.x = element_text(angle=45, hjust=1)))

print(ggplot(rf.exp) +
        geom_boxplot(aes(x=scenario, y=error)) +
        ylab("Erro") + xlab("Cenário") + 
        theme(axis.text.x = element_text(angle=45, hjust=1)))

print(ggplot(rf.exp) +
        geom_boxplot(aes(x=scenario, y=sensitivity)) +
        ylab("Sensitividade") + xlab("Cenário") + 
        theme(axis.text.x = element_text(angle=45, hjust=1)))

print(ggplot(rf.exp) +
        geom_boxplot(aes(x=scenario, y=specificity)) +
        ylab("Especificidade") + xlab("Cenário") + 
        theme(axis.text.x = element_text(angle=45, hjust=1)))

print(ggplot(rf.exp) +
        geom_boxplot(aes(x=scenario, y=auc)) +
        ylab("AUC") + xlab("Cenário") + 
        theme(axis.text.x = element_text(angle=45, hjust=1)))
dev.off()

pdf(paste(output.dir, "/Avaliações_Por_Sel_Atributos_RF_10CV.pdf", sep = ""), width=10, height=8)
print(ggplot(rf.exp) +
        geom_boxplot(aes(x=attribute_method, y=accuracy)) +
        ylab("Acurácia") + xlab("Método de Seleção de Atributos") + 
        theme(axis.text.x = element_text(angle=45, hjust=1)))

print(ggplot(rf.exp) +
        geom_boxplot(aes(x=attribute_method, y=error)) +
        ylab("Erro") + xlab("Método de Seleção de Atributos") + 
        theme(axis.text.x = element_text(angle=45, hjust=1)))

print(ggplot(rf.exp) +
        geom_boxplot(aes(x=attribute_method, y=sensitivity)) +
        ylab("Sensitividade") + xlab("Método de Seleção de Atributos") + 
        theme(axis.text.x = element_text(angle=45, hjust=1)))

print(ggplot(rf.exp) +
        geom_boxplot(aes(x=attribute_method, y=specificity)) +
        ylab("Especificidade") + xlab("Método de Seleção de Atributos") + 
        theme(axis.text.x = element_text(angle=45, hjust=1)))

print(ggplot(rf.exp) +
        geom_boxplot(aes(x=attribute_method, y=auc)) +
        ylab("AUC") + xlab("Método de Seleção de Atributos") + 
        theme(axis.text.x = element_text(angle=45, hjust=1)))
dev.off()

# TODO: Create gráhic with IC 
# print(ggplot(rf.exp) +
#         geom_boxplot(aes(x=attribute_method, y=accuracy)) +
#         ylab("Acurácia") + xlab("Cenário") + facet_wrap(~scenario)+ 
#         theme(axis.text.x = element_text(angle=45, hjust=1)))
