pipeline {
  agent any

  tools {
    nodejs '24'
  }

  options {
    ansiColor('xterm')
    timestamps()
    disableConcurrentBuilds()
    buildDiscarder(logRotator(
      daysToKeepStr: '14',
      numToKeepStr: '20',
      artifactDaysToKeepStr: '7',
      artifactNumToKeepStr: '5'
    ))
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Environment') {
      steps {
        sh '''
          set -euo pipefail
          node --version
          npm --version
        '''
      }
    }

    stage('Install') {
      steps {
        sh 'npm ci --ignore-scripts'
      }
    }

    stage('Validate') {
      steps {
        sh 'npm test'
      }
    }

    stage('Build') {
      steps {
        sh '''
          set -euo pipefail
          npm run build
          git diff --exit-code -- dist/
        '''
      }
    }
  }

  post {
    always {
      archiveArtifacts artifacts: 'dist/*.js,hacs.json,package.json', fingerprint: true
      deleteDir()
    }
  }
}
