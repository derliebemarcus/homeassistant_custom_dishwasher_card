# Deployment diagram

```mermaid
flowchart LR
    Source[GitHub source] --> Jenkins[Jenkins quality gates]
    Jenkins --> Release[Tagged GitHub release asset]
    Release --> HACS[HACS installation]
    Release --> Manual[Manual installation]
    HACS --> HA[Home Assistant web server]
    Manual --> HA
    HA --> Browser[User browser]
```
