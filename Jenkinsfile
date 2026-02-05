pipeline {
    agent any

    environment {
        // 1. MUST BE YOUR 12-DIGIT ACCOUNT NUMBER (e.g., 123456789012)
        // DO NOT put your Access Key (AKIA...) here.
        AWS_ACCOUNT_ID = 'AKIAVJRDZX3VDDB5I3D7' 
        AWS_REGION     = 'ap-south-2' 
        IMAGE_REPO     = 'grilli-app'
        ECR_URL        = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Unit Test') {
            steps {
                sh 'test -f index.html && echo "HTML exists" || exit 1'
                sh 'grep -q "Grilli" index.html'
            }
        }

        stage('Build and Push to ECR') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'aws-creds', 
                                 usernameVariable: 'AWS_ACCESS_KEY_ID', 
                                 passwordVariable: 'AWS_SECRET_ACCESS_KEY')]) {
                    
                    script {
                        // NEW EDITED PART: Capturing password in a variable to avoid "400 Bad Request"
                        def ecrPassword = sh(script: "aws ecr get-login-password --region ${AWS_REGION}", returnStdout: true).trim()
                        
                        // Login using the cleaned variable
                        sh "echo ${ecrPassword} | docker login --username AWS --password-stdin ${ECR_URL}"
                        
                        // Build the image
                        sh "docker build -t ${IMAGE_REPO} ."
                        
                        // Tagging for ECR
                        sh "docker tag ${IMAGE_REPO}:latest ${ECR_URL}/${IMAGE_REPO}:${env.BUILD_NUMBER}"
                        sh "docker tag ${IMAGE_REPO}:latest ${ECR_URL}/${IMAGE_REPO}:latest"
                        
                        // Push to AWS
                        sh "docker push ${ECR_URL}/${IMAGE_REPO}:${env.BUILD_NUMBER}"
                        sh "docker push ${ECR_URL}/${IMAGE_REPO}:latest"
                    }
                }
            }
        }

        stage('Deploy') {
            steps {
                sh 'docker rm -f grilli-site || true' 
                // We use the local image name here for speed
                sh 'docker run -d --name grilli-site -p 80:80 ${IMAGE_REPO}:latest'
            }
        }
    }
    
    post {
        always {
            sh 'docker image prune -f'
        }
    }
}
