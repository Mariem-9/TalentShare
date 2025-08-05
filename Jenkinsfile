pipeline {
   agent any

    tools {
        jdk 'jdk-21'         
        maven 'Maven 3.9.6'
    }

    environment {
        IMAGE_NAME = 'talentshare-backend-java24'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/Mariem-9/TalentShare.git'
            }
        }

        stage('Build') {
            steps {
                dir('backend') {
                    sh 'mvn clean install'
                }
            }
        }

        stage('Test') {
            steps {
                dir('backend') {
                    sh 'mvn test'
                }
            }
        }

        stage('Sonar Analysis') {
            steps {
                dir('backend') {
                    withCredentials([string(credentialsId: 'SONAR_TOKEN', variable: 'SONAR_TOKEN')]) {
                        sh '''
                          mvn sonar:sonar \
                          -Dsonar.projectKey=Mariem-9_TalentShare \
                          -Dsonar.organization=mariem-9 \
                          -Dsonar.host.url=https://sonarcloud.io \
                          -Dsonar.login=$SONAR_TOKEN
                        '''
                    }
                }
            }
        }

        stage('Package') {
            steps {
                dir('backend') {
                    sh 'mvn package'
                }
            }
        }
	stage('Check Docker Version') {
            steps {
                sh 'docker --version'
            }
        }

        stage('Docker Build') {
            steps {
                sh 'docker build -t $IMAGE_NAME .'
            }
        }

        stage('Docker Run') {
            steps {
                sh 'docker run -d --network talentshare-net -p 8081:8080 --name backend $IMAGE_NAME'
            }
        }
    }
}
