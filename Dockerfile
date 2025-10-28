# Этап сборки
FROM maven:3.8.6-openjdk-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Этап ранта# Используем официальный образ OpenJDK 17 Slim
FROM openjdk:17-jdk-slim

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app

# Копируем собранный jar файл в контейнер
COPY target/*.jar app.jar
# Используем официальный образ OpenJDK 17 Slim
FROM openjdk:17-jdk-slim

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app

# Копируем собранный jar файл в контейнер
COPY target/*.jar app.jar

# Открываем порт для доступа к приложению
EXPOSE 8080

# Команда для запуска приложения при старте контейнера
ENTRYPOINT ["java", "-jar", "app.jar"]

