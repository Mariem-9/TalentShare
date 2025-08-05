FROM jenkins/jenkins:lts

USER root

# Install Docker CLI, wget, and set Jenkins user in Docker group
RUN apt-get update && \
    apt-get install -y docker.io wget && \
    usermod -aG docker jenkins

# Install JDK 21 manually
RUN wget https://github.com/adoptium/temurin21-binaries/releases/download/jdk-21.0.2%2B13/OpenJDK21U-jdk_x64_linux_hotspot_21.0.2_13.tar.gz -O /tmp/openjdk-21.tar.gz && \
    mkdir -p /usr/lib/jvm && \
    tar -xzf /tmp/openjdk-21.tar.gz -C /usr/lib/jvm/ && \
    rm /tmp/openjdk-21.tar.gz

# Set JAVA_HOME and update PATH
ENV JAVA_HOME=/usr/lib/jvm/jdk-21.0.2+13
ENV PATH="$JAVA_HOME/bin:$PATH"

USER jenkins
