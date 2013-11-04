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

pdf(paste(output.dir, "/Avaliações_Por_Cenário_RF_10CV.pdf", sep = ""), width=12, height=9)
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


pdf(paste(output.dir, "/Avaliações_Por_Cenário_RF_10CV.pdf", sep = ""), width=12, height=9)
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
        geom_boxplot(aes(x=attribute.method, y=accuracy)) +
        ylab("Acurácia") + xlab("Método de Seleção de Atributos") + 
        theme(axis.text.x = element_text(angle=45, hjust=1)))

print(ggplot(rf.exp) +
        geom_boxplot(aes(x=attribute.method, y=error)) +
        ylab("Erro") + xlab("Método de Seleção de Atributos") + 
        theme(axis.text.x = element_text(angle=45, hjust=1)))

print(ggplot(rf.exp) +
        geom_boxplot(aes(x=attribute.method, y=sensitivity)) +
        ylab("Sensitividade") + xlab("Método de Seleção de Atributos") + 
        theme(axis.text.x = element_text(angle=45, hjust=1)))

print(ggplot(rf.exp) +
        geom_boxplot(aes(x=attribute.method, y=specificity)) +
        ylab("Especificidade") + xlab("Método de Seleção de Atributos") + 
        theme(axis.text.x = element_text(angle=45, hjust=1)))

print(ggplot(rf.exp) +
        geom_boxplot(aes(x=attribute.method, y=auc)) +
        ylab("AUC") + xlab("Método de Seleção de Atributos") + 
        theme(axis.text.x = element_text(angle=45, hjust=1)))
dev.off()

