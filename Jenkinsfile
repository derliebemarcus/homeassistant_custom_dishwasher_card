pipeline {
  agent any

  tools {
    nodejs '24'
  }

  options {
    disableConcurrentBuilds()
  }

  stages {
    stage('Environment') {
      steps {
        sh '''
          set -euo pipefail
          node --version
          npm --version
          sonar-scanner --version
        '''
      }
    }

    stage('Install') {
      steps {
        sh '''
          set -euo pipefail
          mkdir -p .ci coverage reports/junit reports/mutation
          npm ci --ignore-scripts
        '''
      }
    }

    stage('Validate and Package') {
      steps {
        script {
          int exitCode = sh(
            returnStatus: true,
            script: '''
              set -o pipefail
              npm run check &&
              node tests/validate.mjs &&
              npm run build &&
              git diff --exit-code -- dist/
            '''
          )

          writeFile file: '.ci/validate.exit', text: "${exitCode}\n"

          if (exitCode != 0) {
            catchError(
              buildResult: 'SUCCESS',
              stageResult: 'UNSTABLE',
              message: 'Validation or package verification failed'
            ) {
              error('Validation or package verification failed')
            }
          }
        }
      }
    }

    stage('Unit Tests and Coverage') {
      steps {
        script {
          int exitCode = sh(
            returnStatus: true,
            script: 'npm run test:coverage'
          )

          writeFile file: '.ci/unit-tests.exit', text: "${exitCode}\n"

          if (exitCode != 0) {
            catchError(
              buildResult: 'SUCCESS',
              stageResult: 'UNSTABLE',
              message: 'Unit tests or coverage generation failed'
            ) {
              error('Unit tests or coverage generation failed')
            }
          }
        }
      }
      post {
        always {
          junit(
            testResults: 'reports/junit/*.xml',
            allowEmptyResults: true,
            skipMarkingBuildUnstable: true,
            skipPublishingChecks: true
          )
          archiveArtifacts(
            artifacts: 'coverage/**,reports/junit/**',
            allowEmptyArchive: true
          )
        }
      }
    }

    stage('Mutation Tests') {
      steps {
        script {
          int exitCode = sh(
            returnStatus: true,
            script: 'npm run test:mutation'
          )

          writeFile file: '.ci/mutation.exit', text: "${exitCode}\n"

          if (exitCode != 0) {
            catchError(
              buildResult: 'SUCCESS',
              stageResult: 'UNSTABLE',
              message: 'Mutation threshold not reached'
            ) {
              error('Mutation threshold not reached')
            }
          }
        }
      }
      post {
        always {
          archiveArtifacts(
            artifacts: 'reports/mutation/**',
            allowEmptyArchive: true
          )
        }
      }
    }

    stage('SonarQube') {
      steps {
        script {
          int exitCode

          withSonarQubeEnv('SonarQube') {
            exitCode = sh(
              returnStatus: true,
              script: 'sonar-scanner'
            )
          }

          writeFile file: '.ci/sonarqube.exit', text: "${exitCode}\n"

          if (exitCode != 0) {
            catchError(
              buildResult: 'SUCCESS',
              stageResult: 'UNSTABLE',
              message: 'SonarQube analysis submission failed'
            ) {
              error('SonarQube analysis submission failed')
            }
          }
        }
      }
    }

    stage('Quality Gate') {
      steps {
        timeout(time: 10, unit: 'MINUTES') {
          script {
            List<String> failures = []

            int validateExit = readFile('.ci/validate.exit').trim() as int
            int unitExit = readFile('.ci/unit-tests.exit').trim() as int
            int mutationExit = readFile('.ci/mutation.exit').trim() as int
            int sonarExit = readFile('.ci/sonarqube.exit').trim() as int

            if (validateExit != 0) {
              failures << 'Validation/package verification'
            }
            if (unitExit != 0) {
              failures << 'Unit tests/coverage'
            }
            if (mutationExit != 0) {
              failures << 'Mutation threshold'
            }

            if (sonarExit != 0) {
              failures << 'SonarQube analysis submission'
            } else {
              def qualityGate = waitForQualityGate abortPipeline: false
              if (qualityGate.status != 'OK') {
                failures << "SonarQube Quality Gate: ${qualityGate.status}"
              }
            }

            if (!failures.isEmpty()) {
              error('Quality Gate failed:\n- ' + failures.join('\n- '))
            }
          }
        }
      }
    }
  }

  post {
    always {
      script {
        String result = currentBuild.currentResult
        String conclusion

        switch (result) {
          case 'SUCCESS':
            conclusion = 'SUCCESS'
            break
          case 'ABORTED':
            conclusion = 'CANCELED'
            break
          case 'NOT_BUILT':
            conclusion = 'SKIPPED'
            break
          default:
            conclusion = 'FAILURE'
        }

        publishChecks(
          name: 'Jenkins / Card Quality Gate',
          title: "Card Quality Gate: ${result}",
          summary: "Jenkins build [#${env.BUILD_NUMBER}](${env.BUILD_URL}) completed with **${result}**.",
          detailsURL: env.BUILD_URL,
          status: 'COMPLETED',
          conclusion: conclusion
        )
      }

      archiveArtifacts(
        artifacts: '.ci/**,coverage/**,reports/**,dist/*.js,hacs.json,package.json,sonar-project.properties',
        allowEmptyArchive: true,
        fingerprint: true
      )
      deleteDir()
    }
  }
}
