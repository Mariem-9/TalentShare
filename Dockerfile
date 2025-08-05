# Étape 1 : Choisir une image de base (Ubuntu ici)
FROM ubuntu:22.04

# Étape 2 : Installer wget et tar pour manipuler les fichiers
RUN apt-get update && apt-get install -y wget tar

# Étape 3 : Copier ton JDK 24 dans le conteneur
COPY openjdk-24.0.2_linux-x64_bin.tar.gz /tmp/

# Étape 4 : Décompresser le JDK dans /usr/lib/jvm et supprimer l'archive
RUN mkdir -p /usr/lib/jvm && \
    tar -xzf /tmp/openjdk-24.0.2_linux-x64_bin.tar.gz -C /usr/lib/jvm/ && \
    rm /tmp/openjdk-24.0.2_linux-x64_bin.tar.gz

# Étape 5 : Configurer les variables d'environnement JAVA_HOME et PATH
ENV JAVA_HOME=/usr/lib/jvm/jdk-24.0.2
ENV PATH="${JAVA_HOME}/bin:${PATH}"

# Étape 6 : Vérifier la version de java (optionnel)
RUN java -version

# Étape 7 : Créer un dossier de travail
WORKDIR /app

# Étape 8 : Copier ton jar compilé dans le conteneur
COPY backend/target/backend-0.0.1-SNAPSHOT.jar app.jar

# Étape 9 : Commande par défaut pour lancer ton application
CMD ["java", "-jar", "app.jar"]
