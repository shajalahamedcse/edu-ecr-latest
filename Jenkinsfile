pipeline {

    agent {
        node {
            label 'master'
            def remote = [:]
            remote.name = 'stage'
            remote.host = '54.169.172.4'
            remote.user = 'ubuntu'
            remote.allowAnyHosts = true
        
    }

    stages {



        stage(' Unit Testing') {
            steps {
                sh """
                echo "Running Unit Tests"
                """
                sh 'aws ecr get-login-password --region ap-southeast-1 | docker login --username AWS --password-stdin 107082111359.dkr.ecr.ap-southeast-1.amazonaws.com'
                sh 'docker build -t qukka-stage .'
                sh 'docker tag qukka-stage:latest 107082111359.dkr.ecr.ap-southeast-1.amazonaws.com/qukka-stage:latest'
                sh 'docker push 107082111359.dkr.ecr.ap-southeast-1.amazonaws.com/qukka-stage:latest'
                sh 'docker-compose down'
                sh 'docker-compose rm -f'
                sh 'docker-compose up -d'
            }
        }

        stage('Code Analysis') {
            steps {


                sh """
                ssh ubuntu@54.169.172.4 cd composer
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

                
        stage('Cleanup Workspace') {
            steps {
                cleanWs()
                sh 'echo "Cleaned Up Workspace For Project"'
                
            }
        }

    }   
}