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
	// ========== BACKEND ==========
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
	stage('Jacoco Report') {
    		steps {
        		dir('backend') {
            			sh 'mvn verify'
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
			  -Dsonar.coverage.jacoco.xmlReportPaths=target/site/jacoco/jacoco.xml \
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
stage('Fix Docker Socket Permissions') {
    steps {
        sh '''
        chown root:docker /var/run/docker.sock || true
        chmod 660 /var/run/docker.sock || true
        '''
    }
}

        stage('Docker Build') {
            steps {
                sh 'docker build -t $IMAGE_NAME .'
            }
        }

         stage('Docker Run') {
    steps {
        sh '''
          docker rm -f backend || true
          docker run -d --network talentshare-net -p 8081:8080 \
            -e SPRING_PROFILES_ACTIVE=docker \
            --name backend $IMAGE_NAME
        '''
    }
}

   // ========== FRONTEND CI/CD ==========

        stage('Docker Build Frontend') {
            steps {
                dir('frontend') {
                    sh 'docker build -t talentshare-frontend .'
                }
            }
        }

        stage('Docker Run Frontend') {
            steps {
                sh '''
                  docker rm -f frontend || true
                  docker run -d --network talentshare-net -p 4200:80 --name frontend talentshare-frontend
                '''
            }
        }
    }
}
