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
        STG_SERVER = '10.10.1.182'
        PROD_SERVER = ''
        PROD_IMAGE_NAME = ''
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
                // sh 'ifconfig'
            }
        }

        stage('Deploy it into stagging server') {
            when {
                branch 'main'
            }
            steps{
            script 
                {
                    sh """ssh ubuntu@${STG_SERVER} << EOF 
                    aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $ECR_REPO
                    docker-compose -f docker-compose-stg.yml down
                    docker-compose -f docker-compose-stg.yml rm -f
                    docker-compose -f docker-compose-stg.yml pull app
                    docker-compose -f docker-compose-stg.yml up -d
                    exit
                    EOF"""
                }
            }
        }

        stage('Build Deploy Code') {
            when {
                branch 'develop'
            }
            steps {

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