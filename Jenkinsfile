pipeline {
    agent any

    environment {
        // 1. CHANGE THESE VALUES
        AWS_ACCOUNT_ID = 'AKIAVJRDZX3VDDB5I3D7' 
        AWS_REGION     = 'ap-south-2' // Based on your previous logs
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
                // This uses the 'aws-creds' you created in Jenkins
                withCredentials([usernamePassword(credentialsId: 'aws-creds', 
                                 usernameVariable: 'AWS_ACCESS_KEY_ID', 
                                 passwordVariable: 'AWS_SECRET_ACCESS_KEY')]) {
                    
                    script {
                        // Login to ECR
                        sh "aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_URL}"
                        
                        // Build the image
                        sh "docker build -t ${IMAGE_REPO} ."
                        
                        // Tag for ECR (both with build number and 'latest')
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
                // Deploying locally on your EC2 using the image we just built
                sh 'docker rm -f grilli-site || true' 
                sh 'docker run -d --name grilli-site -p 80:80 ${IMAGE_REPO}:latest'
            }
        }
    }
    
    post {
        always {
            // Housekeeping: Remove dangling images to save EC2 space
            sh 'docker image prune -f'
        }
    }
}
