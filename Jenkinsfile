pipeline {

    agent {
        node {
            label 'master'
        }
    }

    stages {
        
        stage('Cleanup Workspace') {
            steps {
                // cleanWs()
                sh 'echo "Cleaned Up Workspace For Project"'
                
            }
        }


        stage(' Unit Testing') {
            steps {
                sh """
                echo "Running Unit Tests"
                """
                sh 'docker build -t shajalahamedcse/app:0.1 .'
            }
        }

        stage('Code Analysis') {
            steps {
                sh """
                echo "Running Code Analysis"
                """
            }
        }

        stage('Build Deploy Code') {
            when {
                branch 'develop'
            }
            steps {
                sh """
                echo "Building Artifact"
                """

                sh """
                echo "Deploying Code"
                """
            }
        }

    }   
}