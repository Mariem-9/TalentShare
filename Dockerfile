FROM jenkins/jenkins:lts

USER root

RUN apt-get update && apt-get install -y wget tar

# Download and install JDK 21 (Temurin build recommended)
RUN wget https://github.com/adoptium/temurin21-binaries/releases/download/jdk-21.0.2%2B13/OpenJDK21U-jdk_x64_linux_hotspot_21.0.2_13.tar.gz -O /tmp/openjdk-21.tar.gz && \
    mkdir -p /usr/lib/jvm && \
    tar -xzf /tmp/openjdk-21.tar.gz -C /usr/lib/jvm/ && \
    rm /tmp/openjdk-21.tar.gz

ENV JAVA_HOME=/usr/lib/jvm/jdk-21.0.2+13
ENV PATH=$JAVA_HOME/bin:$PATH

USER jenkins