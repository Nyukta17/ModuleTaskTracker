# Используем официальный облегчённый образ OpenJDK 21
FROM openjdk:21-jdk-slim

# Задаём рабочую директорию внутри контейнера
WORKDIR /app

# Копируем jar-файл вашего приложения (убедитесь, что имя файла совпадает)
COPY target/ModuleTaskMenadger-0.0.1-SNAPSHOT.jar app.jar

# Открываем порт 8080
EXPOSE 8080

# Команда запуска приложения
ENTRYPOINT ["java", "-jar", "app.jar"]
