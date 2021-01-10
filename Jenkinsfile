pipeline {

    agent {
        node {
            label 'master'
        }
    }


    stages {
        
        stage('Cleanup Workspace') {
            steps {
                cleanWs()
                sh """
                echo "Cleaned Up Workspace For Project"
                """
            }
        }

        stage('Code Checkout') {
            // steps {
            //     checkout([
            //         $class: 'GitSCM', 
            //         branches: [[name: '*/main']], 
            //         userRemoteConfigs: [[url: 'https://github.com/spring-projects/spring-petclinic.git']]
            //     ])
            // }
        }

        stage(' Unit Testing') {
            when {
                branch 'main'
            }
            steps {
                sh """
                echo "Running Unit Tests"
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