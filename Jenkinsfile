pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                // Pulls your code from GitHub
                checkout scm
            }
        }
        stage('Docker Build') {
            steps {
                // Builds your web app into a Docker image
                sh 'docker build -t grilli-app .'
            }
        }
        stage('Deploy') {
            steps {
                // Stops any old container and starts the new one
                sh 'docker stop grilli-site || true'
                sh 'docker rm grilli-site || true'
                sh 'docker run -d --name grilli-site -p 80:80 grilli-app'
            }
        }
        stage('Unit Test') {
            steps {
                // This simple test checks if index.html exists before building
                sh 'test -f index.html && echo "HTML exists" || exit 1'
                // You can also check for specific keywords like "Grilli"
                sh 'grep -q "Grilli" index.html'
            }
        }
    }
}
