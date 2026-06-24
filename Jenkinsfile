pipeline {
  agent any

  options {
    ansiColor('xterm')
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
