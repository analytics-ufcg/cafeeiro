install.packages("randomForest")
library(randomForest)
test  <- iris[ c(1:10, 51:60, 101:110), -5]
train <- iris[ c(11:50, 61:100, 111:150), ]
r <- randomForest(Species ~., data=train, importance=TRUE, do.trace=100)
predict(r, test)
