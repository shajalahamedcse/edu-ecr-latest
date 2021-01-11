pipeline {

    agent {
        node {
            label 'master'
        }
        
    }

    environment {
        REGION = 'ap-southeast-1'
        ECR_REPO    = '107082111359.dkr.ecr.ap-southeast-1.amazonaws.com'
        STG_IMG_NAME = 'qukka-stage'
        STG_SERVER = '54.169.172.4'
        PROD_SERVER = ''
    }

    stages {



        stage('Docker Build & Push Into Stagging ECR') {
            steps {
                sh """
                echo ""
                """
                sh 'aws ecr get-login-password --region ${REGION} | docker login --username AWS --password-stdin ${ECR_REPO}'
                sh 'docker build -t ${STG_IMG_NAME} .'
                sh 'docker tag ${STG_IMG_NAME}:latest ${ECR_REPO}/${STG_IMG_NAME}:latest'
                sh 'docker push ${ECR_REPO}/${STG_IMG_NAME}:latest'
                sh 'docker-compose pull app'
                sh 'docker-compose down'
                sh 'docker-compose rm -f'
                sh 'docker-compose up -d'
            }
        }

        stage('Deploy it into stagging server') {
            when {
                branch 'main'
            }
            steps {


                // sh """#!/bin/bash
                //     ssh ubuntu@54.169.172.4 << ENDSSH
                //     aws ecr get-login-password --region ap-southeast-1 | docker login --username AWS --password-stdin 107082111359.dkr.ecr.ap-southeast-1.amazonaws.com
                //     docker-compose down
                //     docker-compose rm -f
                //     docker-compose up -d
                //     ENDSSH
                // """
                sh 'ssh ubuntu@{STG_SERVER}'
                sh 'aws ecr get-login-password --region ${REGION} | docker login --username AWS --password-stdin ${ECR_REPO}'
                sh 'docker-compose pull app'
                sh 'docker-compose down'
                sh 'docker-compose rm -f'
                sh 'docker-compose up -d'
                sh 'exit'
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