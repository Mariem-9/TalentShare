# 🌟 TalentShare — Plateforme Collaborative Interne

TalentShare est une plateforme web full-stack destinée à valoriser les talents internes, à fluidifier les échanges et à renforcer la collaboration au sein de l’entreprise.  
Elle permet de connecter les collaborateurs autour de groupes thématiques, d’un chat temps réel, de sondages interactifs et d’un espace multimédia, le tout géré via une interface administrateur complète.

---

## 🚀 Fonctionnalités principales

### 👥 Groupes thématiques
- Création, modification, suppression de groupes
- Validation par un administrateur
- Rôles granulaires : Créateur, Modérateur, Membre, Admin
- Gestion des membres et permissions

### 💬 Messagerie temps réel
- Chat en WebSocket + STOMP
- Diffusion instantanée des messages
- Persistance en base de données
- Authentification WebSocket via JWT Handshake Interceptor

### 👤 Profils enrichis
- Talents, compétences et centres d’intérêt
- Avatars personnalisés
- Informations détaillées sur chaque collaborateur

### 🗂️ Stockage des fichiers
- Upload sécurisé via MinIO (compatible S3)
- Génération d’URL signées
- Gestion des avatars et médias de groupe

### 🗳️ Sondages interactifs
- Types : opinion, décision, évaluation
- Résultats en temps réel

### 🔐 Audit & Administration
- Dashboard administrateur
- Journalisation complète des actions
- Modération des contenus

---

## 🏗️ Architecture technique

### **Frontend**
- Angular  
- PrimeNG  
- Tailwind CSS  

### **Backend**
- Spring Boot  
- Spring Security + JWT  
- WebSocket STOMP  

### **Base de données**
- PostgreSQL  

### **Stockage**
- MinIO (S3-compatible)

### **Outils DevOps**
- Docker 
- Jenkins Pipeline (CI/CD)  
- SonarQube  
- JaCoCo  

---

## ⚙️ Installation & Exécution

### 1️⃣ Cloner le projet
```bash
git clone https://github.com/votreusername/talentshare.git
cd talentshare
```
### 2️⃣ Créer le réseau Docker
```bash
docker network create talentshare-net
```
### 3️⃣ Lancer la base de données PostgreSQL
```bash
docker run --name my-postgres --network talentshare-net \
  -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=admin \
  -e POSTGRES_DB=talentshare -p 5432:5432 -d postgres
```
### 4️⃣ Builder et lancer le Backend Spring Boot
```bash
cd backend
docker build -t talentshare-backend-java24 .
docker run --name backend --network talentshare-net \
  -e SPRING_PROFILES_ACTIVE=docker -p 8080:8080 \
  talentshare-backend-java24:latest
```
### 5️⃣ Builder et lancer le Frontend Angular
```bash
cd frontend
docker build -t talentshare-frontend .
docker run -d -p 4200:80 --network=talentshare-net \
  --name frontend talentshare-frontend
```
### 6️⃣ Accéder à l'application
Frontend : http://localhost:4200
Backend API : http://localhost:8080
MinIO Console : http://localhost:9001
---
### 🧪 Qualité & Tests
- Couverture de code via JaCoCo
- Analyse qualité via SonarQube
- Tests unitaires backend & frontend automatisés via Jenkins
---
### 🔧 Pipeline CI/CD
- Le déploiement est entièrement automatisé via Jenkins grâce à un Jenkinsfile composé de 5 étapes :
  1. Vérification des dépendances
  2. Exécution des tests + rapports JaCoCo
  3. Analyse qualité SonarQube
  4. Dockerisation du backend et du frontend
  5. Déploiement automatique via Docker Compose

- Le pipeline garantit :
  - absence d’erreurs humaines
  - builds reproductibles
  - montée en production fiable
  - Qualité de code maintenue
---
### 📚 Structure du projet
talentshare/
 ├── backend/
 │   ├── src/
 │   ├── Dockerfile
 │   └── pom.xml
 ├── frontend/
 │   ├── src/
 │   ├── Dockerfile
 │   └── package.json
 ├── Jenkinsfile
 └── README.md
---
### 🛡️ Sécurité
- JWT Access Token + Refresh Token
- Sécurisation WebSocket (Handshake + Interceptor)
- Permissions granulaires par rôle
- Audit complet de toutes les actions
- Stockage sécurisé des fichiers via URL signées MinIO
- Validation des données côté serveur
---
### 📈 Perspectives d’évolution
- Application mobile (Flutter / React Native)
- Orchestration Kubernetes
- Notifications push en temps réel
- Système de recommandation de talents
- Analyse intelligente des compétences internes
- Single Sign-On (SSO) enterprise
---
### 👩‍💻 Auteure
Mariem Ben Amor
Développeuse Full-Stack & DevOps
École Nationale des Sciences de l'Informatique
