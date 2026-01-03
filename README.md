# 🏋️ Générateur Sport & Meal Prep Intelligent

Application web complète pour générer des programmes d'entraînement et des plans de repas personnalisés avec suivi intelligent.

## ✨ Fonctionnalités principales

### 📅 Génération flexible de programmes
- **Journée** : Génère un programme pour une date spécifique
- **Semaine** : Génère automatiquement 7 jours d'entraînements et repas
- **Mois** : Génère un programme complet pour le mois en cours
- **Période personnalisée** : Choisissez vos dates de début et de fin

### 🧠 Intelligence artificielle anti-répétition
- Le système se souvient des **7 derniers jours** d'entraînements et repas
- **Évite automatiquement** de proposer des exercices ou recettes récemment utilisés
- Garantit une **variété maximale** dans vos programmes

### ✅ Système de suivi complet
- **Cochez les entraînements** effectués pour suivre votre progression
- **Cochez les repas** consommés pour garder une trace
- Les éléments complétés apparaissent avec un style visuel différent
- Historique complet de toutes vos activités

### ⚖️ Suivi du poids quotidien
- Enregistrez votre poids chaque jour pour Jade et Élodie
- **Graphiques interactifs** avec Chart.js montrant l'évolution
- **Statistiques automatiques** : poids actuel, évolution totale, objectif restant
- Les données sont **sauvegardées localement** dans votre navigateur

### 📊 Historique détaillé
- Onglet **Entraînements** : visualisez les 10 derniers workouts de chaque profil
- Onglet **Repas** : consultez l'historique des repas avec calories
- Indicateurs visuels : ✅ pour complété, ⏳ pour en attente

### 🛒 Liste de courses intelligente
- Génération automatique de tous les ingrédients nécessaires
- Organisée par catégories (protéines, glucides, légumes, etc.)
- Quantités précises pour une semaine complète

## 👥 Deux profils personnalisés

### 💪 Jade - Programme Intense
- **Objectif** : Perte de poids et performance (95kg → 85kg)
- **Intensité** : Élevée à très élevée
- **Types d'entraînement** :
  - Rameur HIIT (18 variations)
  - Rameur Endurance (17 variations)
  - Circuits Renforcement (18 variations)
  - HIIT Corde à sauter (16 variations)
  - Full Body Challenge (17 variations)
- **Nutrition** : 2200 kcal/jour
- **Recettes** : 115 recettes variées

### 🌸 Élodie - Programme Post-natal Modéré
- **Objectif** : Remise en forme post-natale (87kg → 75kg)
- **Intensité** : Légère à modérée
- **Types d'entraînement** :
  - Rameur Doux (15 variations)
  - Renforcement Post-natal (15 variations)
  - Cardio Modéré (14 variations)
  - Circuits Complets (15 variations)
- **Nutrition** : 1650 kcal/jour
- **Recettes** : 110 recettes adaptées

## 💾 Stockage des données

Toutes les données sont **sauvegardées localement** dans votre navigateur (LocalStorage) :
- ✅ Programmes d'entraînement générés avec dates
- ✅ Plans de repas avec calories
- ✅ États de complétion (fait/non fait)
- ✅ Historique complet des poids
- ✅ Pas besoin de compte ou de connexion internet après le premier chargement

## 🚀 Comment utiliser

### 1. Générer un programme

**Option A - Période prédéfinie :**
- Cliquez sur **"Générer aujourd'hui"** pour une journée
- Cliquez sur **"Générer la semaine"** pour 7 jours
- Cliquez sur **"Générer le mois"** pour le mois complet

**Option B - Période personnalisée :**
- Sélectionnez une **date de début**
- Sélectionnez une **date de fin**
- Cliquez sur **"Générer période"**

### 2. Suivre votre progression

**Entraînements :**
- Cochez la case ☑️ en haut à gauche de chaque carte d'entraînement
- L'entraînement devient grisé et marqué comme complété
- Visible dans l'historique avec ✅

**Repas :**
- Cochez la case ☑️ en haut à gauche de chaque journée de repas
- La journée devient grisée et marquée comme complétée
- Visible dans l'historique avec le nombre de calories

### 3. Enregistrer votre poids

**Pour Jade :**
- Entrez le poids dans le champ "Poids de Jade"
- Cliquez sur **"Sauvegarder"**
- Le graphique se met à jour automatiquement

**Pour Élodie :**
- Entrez le poids dans le champ "Poids d'Élodie"
- Cliquez sur **"Sauvegarder"**
- Le graphique affiche l'évolution

### 4. Consulter l'historique

- Cliquez sur l'onglet **"Entraînements"** pour voir l'historique des workouts
- Cliquez sur l'onglet **"Repas"** pour voir l'historique alimentaire
- Les 10 dernières entrées sont affichées pour chaque profil

### 5. Générer la liste de courses

- Cliquez sur **"Générer liste de courses"**
- Une liste complète s'affiche avec toutes les catégories
- Utilisez le bouton **"Imprimer"** pour une version papier

## 📈 Statistiques en temps réel

Le système calcule automatiquement pour chaque profil :
- **Poids actuel** : dernière pesée enregistrée
- **Évolution** : différence depuis la première pesée (en rouge si prise, en vert si perte)
- **Objectif** : poids cible (85kg pour Jade, 75kg pour Élodie)
- **Restant** : kilos à perdre pour atteindre l'objectif

## 🎨 Interface moderne

- Design responsive adapté à tous les écrans
- Animations fluides et feedback visuel
- Dégradés de couleurs pour chaque profil (bleu pour Jade, rose pour Élodie)
- Mode impression optimisé
- Graphiques interactifs avec Chart.js

## 🔒 Confidentialité

- **100% local** : aucune donnée n'est envoyée sur internet
- **Pas de compte** : pas besoin de créer un compte
- **Vos données vous appartiennent** : tout est stocké dans votre navigateur
- Pour **réinitialiser** : videz le cache de votre navigateur

## 🛠️ Technologies utilisées

- **HTML5** : structure sémantique
- **CSS3** : design moderne avec variables CSS, gradients, animations
- **JavaScript ES6+** : logique applicative pure (vanilla JS)
- **Chart.js 4.4.0** : graphiques de poids interactifs
- **LocalStorage API** : persistance des données

## 📊 Base de données

### Entraînements
- **145+ variations** d'exercices uniques
- Rotation intelligente pour éviter la monotonie
- Progressions adaptées à chaque profil

### Recettes
- **225 recettes** au total
- 4 catégories : petits-déjeuners, déjeuners, collations, dîners
- Macro-nutriments équilibrés
- Calories calculées automatiquement

### Variété
Avec la génération aléatoire et l'anti-répétition, vous pouvez utiliser ce générateur pendant **des mois** sans jamais avoir exactement le même programme !

## 🎯 Objectifs de santé

### Jade
- Poids de départ : **95 kg**
- Objectif : **85 kg** (-10 kg)
- Taille : **1m75**
- Programme : **Intense** avec focus cardio et HIIT

### Élodie
- Poids de départ : **87 kg**
- Objectif : **75 kg** (-12 kg)
- Taille : **1m70**
- Programme : **Modéré** avec focus post-natal et reconstruction

## 💡 Conseils d'utilisation

1. **Pesez-vous régulièrement** : idéalement chaque matin à jeun pour un suivi précis
2. **Cochez vos activités** : cela vous motive et vous permet de visualiser votre assiduité
3. **Générez à l'avance** : créez votre semaine le dimanche pour être organisé(e)
4. **Variez les périodes** : alternez entre générations hebdomadaires et mensuelles
5. **Consultez l'historique** : c'est motivant de voir tout le chemin parcouru !

## 🐛 Résolution de problèmes

**Les données ne se sauvegardent pas :**
- Vérifiez que votre navigateur autorise les cookies et le localStorage
- N'utilisez pas le mode navigation privée

**Le graphique ne s'affiche pas :**
- Vérifiez votre connexion internet (Chart.js se charge depuis un CDN)
- Rechargez la page

**Je veux tout recommencer à zéro :**
- Ouvrez les outils de développement (F12)
- Onglet "Application" ou "Storage"
- Cliquez sur "Local Storage" puis supprimez toutes les entrées

## 📝 Notes importantes

- Les programmes sont générés de manière **pseudo-aléatoire** mais évitent les répétitions récentes
- Les jours de **repos** (samedi actif, dimanche repos) sont automatiquement insérés
- Les **calories** varient légèrement chaque jour pour un effet plus naturel
- La liste de courses est une **estimation** pour une semaine standard

## 🎉 Bon entraînement et bon appétit !

Créé avec ❤️ pour Jade et Élodie

---

**Version** : 2.0 avec Suivi Intelligent  
**Dernière mise à jour** : Janvier 2026  
**Licence** : Usage personnel
