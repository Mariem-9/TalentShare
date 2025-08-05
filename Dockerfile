FROM jenkins/jenkins:lts

USER root

# Installer wget et tar
RUN apt-get update && apt-get install -y wget tar

# Copier le JDK dans l'image
COPY openjdk-24.0.2_linux-x64_bin.tar.gz /tmp/

# Décompresser le JDK dans /usr/lib/jvm
RUN mkdir -p /usr/lib/jvm && \
    tar -xzf /tmp/openjdk-24.0.2_linux-x64_bin.tar.gz -C /usr/lib/jvm/ && \
    rm /tmp/openjdk-24.0.2_linux-x64_bin.tar.gz

# Définir JAVA_HOME
ENV JAVA_HOME=/usr/lib/jvm/jdk-24.0.2
ENV PATH=$JAVA_HOME/bin:$PATH

USER jenkins
