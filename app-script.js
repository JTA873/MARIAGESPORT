// ========================================
// DATA STRUCTURES & STORAGE
// ========================================

// Profiles
let profiles = {
    jade: {
        name: 'Jade',
        sex: 'male',
        height: 175,
        weight: 95,
        targetWeight: 82,
        deadline: '2026-08-08',
        intensity: 'intense',
        postpartum: false
    },
    elodie: {
        name: 'Élodie',
        sex: 'female',
        height: 170,
        weight: 87,
        targetWeight: 72,
        deadline: '2026-08-08',
        intensity: 'intense',
        postpartum: true
    }
};

let currentProfile = 'jade';
let currentWeek = 1; // Commence à la semaine 1 de la phase agressive
let currentPhase = 1; // Phase 1 = agressive (semaines 1-4), Phase 2 = normale (5+)
let currentViewDate = new Date(); // Date actuellement affichée sur l'écran "Aujourd'hui"
let timerRunning = false;
let timerInterval = null;
let currentSeconds = 0;
let currentExerciseIndex = 0;
let todayMeals = []; // Tracking des repas consommés aujourd'hui
let consumedMeals = {}; // {date: {profile: {mealIndex: true}}}
let selectedWorkoutForModal = null;
let selectedRecipeForModal = null;

// Programme de sèche - Date de début: 03/01/2026
const PROGRAM_START_DATE = new Date('2026-01-03');
const WEDDING_DATE = new Date('2026-08-08');

// Calcul de la semaine du programme (1-31)
function getProgramWeekNumber() {
    const today = new Date();
    const diffTime = Math.abs(today - PROGRAM_START_DATE);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.ceil(diffDays / 7);
}

// Détermination de la phase (1 = agressive, 2 = normale)
function getCurrentPhase() {
    const week = getProgramWeekNumber();
    return week <= 4 ? 1 : 2;
}

function getPhaseInfo() {
    const phase = getCurrentPhase();
    const week = getProgramWeekNumber();
    const weeksRemaining = Math.ceil((WEDDING_DATE - new Date()) / (1000 * 60 * 60 * 24 * 7));
    
    if (phase === 1) {
        return {
            phase: 1,
            name: "PHASE AGRESSIVE",
            week: week,
            description: "Sèche agressive - Perte de gras rapide",
            color: "#dc2626",
            icon: "🔥",
            rules: [
                "🚫 ZÉRO sucre ajouté",
                "⏰ Jeûne 16/8 (12h-20h)",
                "🍚 Féculents MIDI uniquement",
                "💧 3L d'eau minimum/jour",
                "💪 Entraînement haute intensité"
            ]
        };
    } else {
        return {
            phase: 2,
            name: "PHASE NORMALE",
            week: week,
            description: "Sèche normale - Maintien et définition",
            color: "#2563eb",
            icon: "⚡",
            rules: [
                "🍎 Fruits autorisés avec modération",
                "⏰ Jeûne 16/8 maintenu",
                "🍚 Féculents matin et midi",
                "💧 2.5L d'eau minimum/jour",
                "💪 Entraînement modéré à intense",
                `📅 ${weeksRemaining} semaines jusqu'au mariage`
            ]
        };
    }
}

// Date de référence : 01/01/2026 = début semaine 1
const REFERENCE_DATE = new Date('2026-01-01');

function getCurrentWeekNumber() {
    const today = new Date();
    const diffTime = Math.abs(today - REFERENCE_DATE);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const weekNumber = Math.ceil(diffDays / 7);
    return ((weekNumber - 1) % 4) + 1; // Cycle de 4 semaines
}

function isWeekOne() {
    return getCurrentWeekNumber() === 1;
}

function getZeroSugarMessage() {
    return isWeekOne() ? '🚫 SEMAINE 1 : 0 SUCRES AJOUTÉS' : '';
}

// Workout templates
const workoutTemplates = {
    hiit: {
        title: "HIIT Intense - Rameur + Corde",
        duration: 60,
        intensity: "Intense",
        calories: 650,
        description: "Circuit haute intensité pour brûler un maximum de calories et travailler le cardio",
        exercises: [
            { 
                name: "Échauffement Rameur", 
                duration: 300, 
                detail: "500m allure modérée", 
                calories: 40,
                instructions: "Position: Dos droit, épaules détendues. Poussez avec les jambes d'abord, puis tirez avec les bras. Respiration: Inspirez sur la remontée, expirez sur la traction.",
                tips: "Gardez un rythme régulier autour de 22-24 coups/min",
                muscles: "Jambes, dos, bras, cardio"
            },
            { 
                name: "Rameur 500m Sprint", 
                duration: 120, 
                detail: "Effort 8/10 - Explosif", 
                calories: 80,
                instructions: "Position: Penchez-vous légèrement en avant. Explosion: Poussée violente des jambes, traction rapide des bras. Gardez le dos gainé tout au long.",
                tips: "Cadence élevée 28-32 coups/min. Objectif: terminer en moins de 2 min",
                muscles: "Quadriceps, ischio-jambiers, dorsaux, bras"
            },
            { 
                name: "Récupération Active", 
                duration: 60, 
                detail: "Marche sur place", 
                calories: 5,
                instructions: "Marchez sur place en levant bien les genoux. Respirez profondément pour récupérer.",
                tips: "Secouez les bras, hydratez-vous",
                muscles: "Récupération cardio"
            },
            { 
                name: "Corde à Sauter Intensive", 
                duration: 120, 
                detail: "Rythme soutenu - Double unders si possible", 
                calories: 90,
                instructions: "Position: Pieds joints, genoux légèrement fléchis. Sautez en gardant les pieds proches du sol. Rotation du poignet seulement, pas de tout le bras.",
                tips: "Alternez: 40 sec rapide / 20 sec modéré. Essayez des double unders (2 passages de corde par saut)",
                muscles: "Mollets, quadriceps, épaules, cardio"
            },
            { 
                name: "Récupération Active", 
                duration: 60, 
                detail: "Marche + Étirements bras", 
                calories: 5,
                instructions: "Marchez en effectuant des rotations d'épaules et en étirant les mollets.",
                tips: "Respirez calmement, préparez-vous pour le prochain effort",
                muscles: "Récupération"
            },
            { 
                name: "Rameur 500m Sprint #2", 
                duration: 120, 
                detail: "Effort 8/10 - Maintenez l'intensité", 
                calories: 80,
                instructions: "Même technique que le premier sprint. Concentrez-vous sur la puissance de poussée des jambes.",
                tips: "Essayez de faire le même temps que le sprint 1. Comptez les coups pour rester concentré",
                muscles: "Jambes, dos, cardio"
            },
            { 
                name: "Récupération Active", 
                duration: 60, 
                detail: "Respiration profonde", 
                calories: 5,
                instructions: "Inspirez profondément par le nez (4 sec), expirez longuement par la bouche (6 sec)",
                tips: "Abaissez votre fréquence cardiaque progressivement",
                muscles: "Récupération cardio"
            },
            { 
                name: "Corde à Sauter Finale", 
                duration: 120, 
                detail: "All-out - Donnez tout", 
                calories: 90,
                instructions: "Dernier effort! Alternez pieds joints et course sur place. Accélérez progressivement jusqu'au maximum.",
                tips: "Les 30 dernières secondes: vitesse maximale!",
                muscles: "Mollets, cardio, coordination"
            },
            { 
                name: "Rameur 1000m Endurance", 
                duration: 240, 
                detail: "Effort 7/10 - Rythme constant", 
                calories: 150,
                instructions: "Trouvez un rythme soutenable autour de 24-26 coups/min. Concentrez-vous sur la technique: jambes, puis buste, puis bras.",
                tips: "Divisez mentalement en 4x250m. Restez relâché au niveau des épaules",
                muscles: "Endurance cardio, full body"
            },
            { 
                name: "Retour au Calme - Étirements", 
                duration: 300, 
                detail: "Étirements complets", 
                calories: 20,
                instructions: "Ischio-jambiers: 30 sec chaque jambe. Quadriceps: 30 sec chaque. Dos et épaules: 30 sec. Mollets: 30 sec chaque.",
                tips: "Respirez profondément. Ne forcez jamais, allez jusqu'à une légère tension",
                muscles: "Flexibilité, récupération"
            }
        ]
    },
    strength: {
        title: "Force - Circuit Full Body",
        duration: 45,
        intensity: "Modéré",
        calories: 380,
        description: "Renforcement musculaire complet au poids de corps et avec équipement minimal",
        exercises: [
            { 
                name: "Échauffement Dynamique", 
                duration: 300, 
                detail: "Mobilité articulaire complète", 
                calories: 20,
                instructions: "Rotations: cou (10), épaules (10), coudes (10), poignets (10), hanches (10), genoux (10), chevilles (10). Puis 20 jumping jacks.",
                tips: "Échauffez chaque articulation dans tous les axes",
                muscles: "Préparation articulaire"
            },
            { 
                name: "Pompes Standards", 
                duration: 180, 
                detail: "4 séries x 12 reps | Repos: 45 sec", 
                calories: 50,
                instructions: "Position: Mains largeur épaules, corps aligné tête-pieds. Descente: Coudes à 45° du corps jusqu'à frôler le sol. Montée: Poussée explosive en gardant les abdos gainés.",
                tips: "Variantes si difficile: pompes sur genoux. Si trop facile: pieds surélevés ou tempo lent (3 sec descente)",
                muscles: "Pectoraux, triceps, épaules, core"
            },
            { 
                name: "Squats au Poids de Corps", 
                duration: 180, 
                detail: "4 séries x 15 reps | Repos: 45 sec", 
                calories: 60,
                instructions: "Position: Pieds largeur hanches, pointes légèrement ouvertes. Descente: Fesses en arrière comme pour s'asseoir, genoux alignés avec les pieds, descendez jusqu'à cuisses parallèles au sol. Montée: Poussez sur les talons.",
                tips: "Gardez le poids sur les talons, torse droit, regard devant. Bras tendus devant pour l'équilibre",
                muscles: "Quadriceps, fessiers, ischio-jambiers, core"
            },
            { 
                name: "Rowing avec Poignées/Corde", 
                duration: 180, 
                detail: "4 séries x 12 reps | Repos: 45 sec", 
                calories: 45,
                instructions: "Setup: Attachez une corde/poignées à un point fixe à hauteur de taille. Position: Corps incliné, bras tendus, talons au sol. Mouvement: Tirez les poignées vers la poitrine en serrant les omoplates.",
                tips: "Plus vous êtes horizontal, plus c'est difficile. Contrôlez la descente (2 sec)",
                muscles: "Dorsaux, trapèzes, biceps, avant-bras"
            },
            { 
                name: "Fentes Alternées", 
                duration: 180, 
                detail: "4 séries x 10 reps/jambe | Repos: 45 sec", 
                calories: 55,
                instructions: "Position: Debout, pas en avant. Descente: Genou arrière frôle le sol, genou avant à 90°. Gardez le torse droit. Poussez sur le talon avant pour remonter. Alternez les jambes.",
                tips: "Si équilibre difficile: faites toutes les reps d'une jambe puis changez. Avec haltères pour plus de difficulté",
                muscles: "Quadriceps, fessiers, stabilisateurs"
            },
            { 
                name: "Planche Statique", 
                duration: 120, 
                detail: "4 séries x 45 sec | Repos: 30 sec", 
                calories: 30,
                instructions: "Position: Avant-bras au sol, coudes sous épaules, corps aligné tête-pieds. Contractez abdos et fessiers. Regard vers le sol, nuque neutre.",
                tips: "Si trop difficile: genoux au sol. Si trop facile: levez une jambe alternativement (10 sec chaque)",
                muscles: "Core (abdos profonds), épaules, fessiers"
            },
            { 
                name: "Mountain Climbers", 
                duration: 120, 
                detail: "4 séries x 30 sec | Repos: 30 sec", 
                calories: 40,
                instructions: "Position: Planche haute (bras tendus). Mouvement: Amenez un genou vers la poitrine, puis alternez rapidement comme si vous couriez. Gardez les hanches basses.",
                tips: "Lent = contrôle et force. Rapide = cardio. Trouvez votre rythme",
                muscles: "Core, épaules, cardio, coordination"
            },
            { 
                name: "Étirements Complets", 
                duration: 300, 
                detail: "Retour au calme et souplesse", 
                calories: 20,
                instructions: "Étirement chat-vache (dos): 30 sec. Pigeon (hanches): 30 sec/côté. Chien tête en bas (ischio, mollets): 30 sec. Étirement pectoraux: 30 sec. Rotation buste: 30 sec.",
                tips: "Respirez profondément dans chaque étirement. Relâchez les tensions",
                muscles: "Flexibilité générale, récupération"
            }
        ]
    },
    cardio: {
        title: "Cardio Endurance",
        duration: 40,
        intensity: "Modéré",
        calories: 420,
        description: "Séance d'endurance pour améliorer le système cardiovasculaire et la capacité aérobie",
        exercises: [
            { 
                name: "Échauffement Progressif Rameur", 
                duration: 300, 
                detail: "800m allure douce - Montée progressive", 
                calories: 50,
                instructions: "Commencez très doucement les 200 premiers mètres. Augmentez progressivement l'intensité tous les 200m. Terminez à allure modérée.",
                tips: "Cadence: 20-22 coups/min. Concentrez-vous sur la technique avant l'intensité",
                muscles: "Échauffement full body, cardio"
            },
            { 
                name: "Rameur 2000m - Zone Aérobie", 
                duration: 480, 
                detail: "Rythme constant - Effort 6-7/10", 
                calories: 200,
                instructions: "Trouvez un rythme soutenable de 24-26 coups/min. Technique: Jambes 60%, buste 20%, bras 20%. Gardez les épaules basses et détendues.",
                tips: "Divisez mentalement: 4x500m. Vous devez pouvoir tenir une conversation (difficilement). Objectif: 8-9 min",
                muscles: "Endurance cardio, jambes, dos, bras"
            },
            { 
                name: "Corde à Sauter Modérée", 
                duration: 300, 
                detail: "Rythme régulier et contrôlé", 
                calories: 120,
                instructions: "Sautez à un rythme confortable de 120 tours/min. Technique: Petits sauts, poignets souples, respiration régulière. Alternez: 1 min pieds joints, 1 min course sur place, répétez.",
                tips: "Si vous trébuchez, reprenez immédiatement. Concentrez-vous sur la fluidité",
                muscles: "Mollets, cardio, coordination"
            },
            { 
                name: "Rameur 1000m - Tempo Élevé", 
                duration: 240, 
                detail: "Effort 6/10 - Finissez fort", 
                calories: 100,
                instructions: "Gardez 26-28 coups/min. Les 250 derniers mètres: augmentez progressivement jusqu'à 8/10. Technique prioritaire même en fatigue.",
                tips: "Visualisez la ligne d'arrivée. Serrez les abdos pour maintenir la puissance",
                muscles: "Endurance cardio, force-endurance"
            },
            { 
                name: "Retour au Calme Complet", 
                duration: 300, 
                detail: "Récupération active + Étirements", 
                calories: 20,
                instructions: "2 min: Marche sur place en ralentissant progressivement le rythme cardiaque. 3 min: Étirements légers (ischio, quadriceps, mollets, dos, épaules) 20 sec chacun.",
                tips: "Hydratez-vous. Respirez calmement. Notez vos performances pour suivre votre progression",
                muscles: "Récupération, flexibilité"
            }
        ]
    },
    abs: {
        title: "Abdos Killer",
        duration: 30,
        intensity: "Intense",
        calories: 280,
        description: "Séance ciblée abdominaux pour définir la sangle abdominale",
        exercises: [
            { 
                name: "Échauffement Core", 
                duration: 180, 
                detail: "Rotations buste + genoux hauts", 
                calories: 20,
                instructions: "10 rotations buste chaque côté, 30 sec genoux hauts, 20 rotations hanches",
                tips: "Échauffez bien la zone lombaire",
                muscles: "Core, obliques"
            },
            { 
                name: "Crunch Classiques", 
                duration: 180, 
                detail: "4 séries x 20 reps", 
                calories: 40,
                instructions: "Allongé dos au sol, mains derrière la tête. Contractez les abdos pour soulever les épaules. Expiration en montée.",
                tips: "Ne tirez pas sur la nuque. Le mouvement vient des abdos",
                muscles: "Grand droit"
            },
            { 
                name: "Russian Twists", 
                duration: 180, 
                detail: "4 séries x 30 reps (15/côté)", 
                calories: 50,
                instructions: "Assis, pieds levés, buste incliné 45°. Rotation du buste de gauche à droite avec les mains.",
                tips: "Gardez les pieds en l'air pour plus d'intensité",
                muscles: "Obliques, transverse"
            },
            { 
                name: "Planche Latérale", 
                duration: 120, 
                detail: "4 séries x 30 sec/côté", 
                calories: 35,
                instructions: "Sur le côté, appui avant-bras, corps aligné. Contractez obliques et fessiers.",
                tips: "Hanches hautes, ne laissez pas tomber le bassin",
                muscles: "Obliques, stabilisateurs"
            },
            { 
                name: "Bicycle Crunch", 
                duration: 180, 
                detail: "4 séries x 40 reps", 
                calories: 55,
                instructions: "Allongé, mains derrière tête. Amenez coude droit vers genou gauche et inversement en pédalant.",
                tips: "Mouvement contrôlé, rotation complète du buste",
                muscles: "Grand droit, obliques"
            },
            { 
                name: "Leg Raises", 
                duration: 180, 
                detail: "4 séries x 15 reps", 
                calories: 45,
                instructions: "Allongé, mains sous fessiers. Levez jambes tendues jusqu'à 90°, redescendez lentement.",
                tips: "Gardez bas du dos plaqué au sol. Si trop dur : genoux pliés",
                muscles: "Bas des abdos"
            },
            { 
                name: "Mountain Climbers Abdos", 
                duration: 120, 
                detail: "3 séries x 40 sec", 
                calories: 55,
                instructions: "Position planche. Amenez genoux vers coudes opposés en alternance rapide.",
                tips: "Gardez les hanches basses, explosivité",
                muscles: "Core complet, cardio"
            },
            { 
                name: "Étirements Abdos", 
                duration: 180, 
                detail: "Relaxation", 
                calories: 10,
                instructions: "Cobra (dos): 30 sec. Étirement latéral: 20 sec/côté. Torsion allongée: 30 sec/côté.",
                tips: "Respirez profondément dans chaque étirement",
                muscles: "Souplesse core"
            }
        ]
    },
    mobility: {
        title: "Mobilité & Stretching",
        duration: 35,
        intensity: "Léger",
        calories: 180,
        description: "Séance de mobilité et étirements pour récupération et souplesse",
        exercises: [
            { 
                name: "Réveil Articulaire", 
                duration: 300, 
                detail: "Mobilisation complète", 
                calories: 30,
                instructions: "Rotations: nuque (10), épaules (15), coudes (10), poignets (15), hanches (20), genoux (15), chevilles (20)",
                tips: "Mouvements lents et contrôlés dans toutes les amplitudes",
                muscles: "Articulations complètes"
            },
            { 
                name: "Cat-Cow (Chat-Vache)", 
                duration: 180, 
                detail: "15 répétitions lentes", 
                calories: 20,
                instructions: "À quatre pattes. Inspirez en creusant le dos (vache), expirez en arrondissant (chat).",
                tips: "Synchronisez avec la respiration, amplitude maximale",
                muscles: "Colonne vertébrale, dos"
            },
            { 
                name: "Fentes Dynamiques avec Rotation", 
                duration: 240, 
                detail: "10 reps par jambe", 
                calories: 40,
                instructions: "Fente avant, rotation du buste vers la jambe avant. Alternez.",
                tips: "Excellent pour hanches et mobilité thoracique",
                muscles: "Hanches, thorax, jambes"
            },
            { 
                name: "Chien Tête en Bas", 
                duration: 180, 
                detail: "3 x 30 secondes", 
                calories: 25,
                instructions: "Position V inversé, mains et pieds au sol. Poussez fessiers vers le ciel, talons vers le sol.",
                tips: "Pédalez avec les pieds pour étirer les mollets",
                muscles: "Ischio-jambiers, mollets, épaules"
            },
            { 
                name: "Pigeon (Hanches)", 
                duration: 240, 
                detail: "2 min par côté", 
                calories: 20,
                instructions: "Jambe avant pliée, jambe arrière tendue. Descendez le buste vers l'avant.",
                tips: "Excellent pour ouverture des hanches. Respirez profondément",
                muscles: "Hanches, fessiers, piriformis"
            },
            { 
                name: "Étirement Quadriceps Debout", 
                duration: 120, 
                detail: "30 sec par jambe x 2", 
                calories: 15,
                instructions: "Debout, attrapez cheville derrière vous, amenez talon vers fessier.",
                tips: "Gardez genoux serrés, poussez hanches vers l'avant",
                muscles: "Quadriceps, psoas"
            },
            { 
                name: "Torsion Allongée", 
                duration: 180, 
                detail: "1 min par côté", 
                calories: 15,
                instructions: "Allongé sur le dos, amenez un genou vers le côté opposé. Bras en croix.",
                tips: "Gardez épaules au sol, respirez dans la torsion",
                muscles: "Colonne, obliques, hanches"
            },
            { 
                name: "Relaxation Finale", 
                duration: 180, 
                detail: "Savasana", 
                calories: 15,
                instructions: "Allongé sur le dos, bras le long du corps, paumes vers le ciel. Respirez profondément.",
                tips: "Relâchez toutes les tensions, scannez mentalement chaque partie du corps",
                muscles: "Récupération mentale et physique"
            }
        ]
    },
    tabata: {
        title: "Tabata Full Body",
        duration: 25,
        intensity: "Extrême",
        calories: 350,
        description: "Format Tabata : 20 sec effort max / 10 sec repos, 8 rounds par exercice",
        exercises: [
            { 
                name: "Échauffement Dynamique", 
                duration: 180, 
                detail: "Préparation haute intensité", 
                calories: 30,
                instructions: "Jumping jacks 30 sec, high knees 30 sec, butt kicks 30 sec, arm circles 30 sec, squats 30 sec, shadow boxing 30 sec",
                tips: "Montez progressivement l'intensité",
                muscles: "Full body"
            },
            { 
                name: "Burpees Tabata", 
                duration: 240, 
                detail: "8 rounds : 20 sec max / 10 sec repos", 
                calories: 80,
                instructions: "Descente planche, pompe, saut explosif vers le ciel. Répétez max en 20 sec.",
                tips: "Donnez tout pendant 20 sec, récupérez 10 sec. 8 fois!",
                muscles: "Full body explosif"
            },
            { 
                name: "Mountain Climbers Tabata", 
                duration: 240, 
                detail: "8 rounds : 20 sec max / 10 sec repos", 
                calories: 70,
                instructions: "Position planche, amenez genoux vers poitrine en alternance ultra rapide.",
                tips: "Vitesse maximale! Hanches basses",
                muscles: "Core, cardio, épaules"
            },
            { 
                name: "Jump Squats Tabata", 
                duration: 240, 
                detail: "8 rounds : 20 sec max / 10 sec repos", 
                calories: 75,
                instructions: "Squat profond puis saut explosif. Réception en squat.",
                tips: "Explosivité maximale, réception contrôlée",
                muscles: "Jambes, fessiers, explosivité"
            },
            { 
                name: "High Knees Tabata", 
                duration: 240, 
                detail: "8 rounds : 20 sec max / 10 sec repos", 
                calories: 65,
                instructions: "Course sur place en levant genoux le plus haut possible, fréquence maximale.",
                tips: "Vitesse! Levez genoux jusqu'à la taille",
                muscles: "Cardio intense, jambes"
            },
            { 
                name: "Retour au Calme", 
                duration: 180, 
                detail: "Récupération progressive", 
                calories: 30,
                instructions: "Marche sur place 1 min en ralentissant. Étirements légers quadriceps, ischio, épaules.",
                tips: "Respirez profondément, hydratez-vous",
                muscles: "Récupération"
            }
        ]
    },
    yoga: {
        title: "Yoga Flow Débutant",
        duration: 40,
        intensity: "Léger",
        calories: 200,
        description: "Flow yoga doux pour force, souplesse et relaxation",
        exercises: [
            { 
                name: "Respiration & Centrage", 
                duration: 240, 
                detail: "Pranayama", 
                calories: 15,
                instructions: "Assis en tailleur, dos droit. Respiration 4-4-4-4 : inspire 4 sec, retention 4 sec, expire 4 sec, pause 4 sec.",
                tips: "Fermez les yeux, concentrez-vous sur le souffle",
                muscles: "Mental, système nerveux"
            },
            { 
                name: "Salutation au Soleil A", 
                duration: 360, 
                detail: "5 cycles complets", 
                calories: 50,
                instructions: "Montagne > Bras levés > Pince avant > Planche > Chaturanga > Chien tête haut > Chien tête bas > Pince avant > Bras levés > Montagne",
                tips: "Synchronisez chaque mouvement avec la respiration",
                muscles: "Full body, flow"
            },
            { 
                name: "Guerrier I & II", 
                duration: 360, 
                detail: "3 cycles, 30 sec par pose", 
                calories: 45,
                instructions: "Guerrier I: fente avant, bras vers ciel. Guerrier II: même fente, bras en ligne, regard avant.",
                tips: "Ancrage fort des pieds, ouverture des hanches",
                muscles: "Jambes, équilibre, concentration"
            },
            { 
                name: "Triangle & Angle Latéral", 
                duration: 300, 
                detail: "2 cycles, 30 sec par côté", 
                calories: 30,
                instructions: "Triangle: jambes écartées, main vers cheville, bras vers ciel. Angle latéral: fente, avant-bras sur cuisse.",
                tips: "Étirement latéral profond",
                muscles: "Obliques, hanches, jambes"
            },
            { 
                name: "Équilibre Arbre", 
                duration: 180, 
                detail: "3 x 30 sec par jambe", 
                calories: 20,
                instructions: "Debout, pied contre mollet ou cuisse (pas genou!), mains en prière ou vers ciel.",
                tips: "Fixez un point devant vous, respirez calmement",
                muscles: "Équilibre, concentration, chevilles"
            },
            { 
                name: "Torsions Assises", 
                duration: 240, 
                detail: "1 min par côté", 
                calories: 15,
                instructions: "Assis jambes croisées, rotation du buste, main opposée sur genou.",
                tips: "Inspirez pour grandir, expirez pour tourner plus loin",
                muscles: "Colonne, digestion"
            },
            { 
                name: "Posture du Cadavre (Savasana)", 
                duration: 420, 
                detail: "Relaxation finale", 
                calories: 25,
                instructions: "Allongé sur le dos, jambes écartées, bras le long du corps, paumes vers ciel. Relâchez tout.",
                tips: "C'est la posture la plus importante. Restez immobile, observez votre respiration",
                muscles: "Récupération complète"
            }
        ]
    },
    homestrength: {
        title: "Force Maison - Équipement Minimal",
        duration: 40,
        intensity: "Modéré",
        calories: 320,
        description: "Renforcement musculaire à la maison avec très peu d'équipement",
        exercises: [
            { 
                name: "Échauffement Dynamique Maison", 
                duration: 240, 
                detail: "Mobilisation sans matériel", 
                calories: 25,
                instructions: "Jumping jacks 30 sec, talons-fesses 30 sec, genoux hauts 30 sec, rotations bras 30 sec, squats air 30 sec, fentes alternées 30 sec, rotations hanches 30 sec, étirements dynamiques 30 sec.",
                tips: "Commencez doucement et augmentez l'amplitude progressivement",
                muscles: "Full body, échauffement"
            },
            { 
                name: "Pompes Progressives", 
                duration: 300, 
                detail: "5 séries adaptées à votre niveau", 
                calories: 60,
                instructions: "Débutant: pompes sur genoux 3x8. Intermédiaire: pompes classiques 3x10. Avancé: pompes diamant + déclinées 3x8. Repos 45 sec entre séries.",
                tips: "Maintenez le corps aligné, contrôlez la descente sur 2 secondes",
                muscles: "Pectoraux, triceps, épaules, core"
            },
            { 
                name: "Squats Combinés", 
                duration: 300, 
                detail: "Mélange de variantes", 
                calories: 70,
                instructions: "Série 1: Squats classiques x15. Série 2: Squats sautés x10. Série 3: Squats sumo x12. Série 4: Squats pistol assistés x5/jambe. Repos 45 sec.",
                tips: "Gardez poids sur talons, genoux alignés avec pieds",
                muscles: "Quadriceps, fessiers, mollets"
            },
            { 
                name: "Gainage Maison", 
                duration: 360, 
                detail: "Circuit core complet", 
                calories: 45,
                instructions: "Planche 45 sec, planche latérale droite 30 sec, planche latérale gauche 30 sec, mountain climbers 30 sec, dead bug 30 sec, bird dog 30 sec. Repos 60 sec et répéter.",
                tips: "Respirez régulièrement, maintenez alignement parfait",
                muscles: "Core complet, stabilisateurs"
            },
            { 
                name: "Fentes et Variations", 
                duration: 300, 
                detail: "4 séries de fentes variées", 
                calories: 55,
                instructions: "Fentes avant x10/jambe, fentes latérales x8/jambe, fentes arrière x8/jambe, fentes sautées x6/jambe. Repos 45 sec entre exercices.",
                tips: "Genou avant ne dépasse pas la cheville, garde torse droit",
                muscles: "Jambes complètes, équilibre"
            },
            { 
                name: "Bras Sans Matériel", 
                duration: 240, 
                detail: "Circuit haut du corps", 
                calories: 40,
                instructions: "Pompes triceps x8, dips chaise x10, pompes pike x8, hold planche 30 sec. 3 tours avec 45 sec repos.",
                tips: "Utilisez une chaise solide pour les dips, contrôlez le mouvement",
                muscles: "Triceps, épaules, chest"
            },
            { 
                name: "Cardio Express Maison", 
                duration: 180, 
                detail: "Boost cardio final", 
                calories: 65,
                instructions: "30 sec burpees, 30 sec high knees, 30 sec jumping jacks, 30 sec mountain climbers, 30 sec squat jumps, 30 sec rest. Répéter.",
                tips: "Donnez le maximum pendant 30 sec, récupérez bien",
                muscles: "Cardio intense, full body"
            },
            { 
                name: "Retour Calme & Souplesse", 
                duration: 300, 
                detail: "Étirements complets", 
                calories: 20,
                instructions: "Chien tête en bas 30 sec, étirement quadriceps 30 sec/jambe, étirement ischio 30 sec/jambe, torsion au sol 30 sec/côté, étirement pectoraux 30 sec, relaxation 60 sec.",
                tips: "Respirez profondément, ne forcez jamais",
                muscles: "Souplesse générale"
            }
        ]
    },
    homecardio: {
        title: "Cardio Maison - Sans Équipement",
        duration: 35,
        intensity: "Intense",
        calories: 400,
        description: "Cardio intense à la maison sans aucun équipement",
        exercises: [
            { 
                name: "Échauffement Cardio", 
                duration: 180, 
                detail: "Montée progressive", 
                calories: 30,
                instructions: "Marche sur place 30 sec, genoux hauts légers 30 sec, talons-fesses 30 sec, jumping jacks doux 30 sec, squats lents 30 sec, rotations bras 30 sec.",
                tips: "Préparez votre coeur progressivement",
                muscles: "Échauffement cardio"
            },
            { 
                name: "HIIT Maison Round 1", 
                duration: 480, 
                detail: "8 rounds de 30/15 sec", 
                calories: 120,
                instructions: "30 sec MAX effort, 15 sec repos. Exercices: Burpees, Mountain climbers, Jump squats, High knees, Plank jacks, Tuck jumps, Speed skaters, Push-up to T.",
                tips: "Donnez vraiment tout pendant 30 sec, le repos est court!",
                muscles: "Cardio intense, full body"
            },
            { 
                name: "Récupération Active", 
                duration: 120, 
                detail: "Baissez le rythme cardiaque", 
                calories: 15,
                instructions: "Marche sur place 60 sec avec bras qui bougent, respirations profondes, étirements légers mollets et épaules.",
                tips: "Continuez à bouger mais calmement",
                muscles: "Récupération"
            },
            { 
                name: "HIIT Maison Round 2", 
                duration: 480, 
                detail: "8 rounds de 30/15 sec", 
                calories: 110,
                instructions: "Mêmes règles. Exercices: Star jumps, Lunge jumps, Bear crawl, Squat thrust, Lateral bounds, Cross climbers, Burpee broad jump, Sprint en place.",
                tips: "Vous êtes déjà fatigué, mais gardez l'intensité haute!",
                muscles: "Cardio, resistance, agilité"
            },
            { 
                name: "Finisher Cardio", 
                duration: 300, 
                detail: "Tout donner les 5 dernières minutes", 
                calories: 90,
                instructions: "1 min jumping jacks, 1 min burpees, 1 min high knees, 1 min mountain climbers, 1 min celebration dance (sérieusement!).",
                tips: "C'est le moment de tout donner, plus que 5 minutes!",
                muscles: "Cardio maximal"
            },
            { 
                name: "Cool Down Complet", 
                duration: 300, 
                detail: "Retour au calme obligatoire", 
                calories: 35,
                instructions: "Marche sur place 2 min en ralentissant, étirements debout: mollets, quadriceps, ischio, épaules. Respirations profondes.",
                tips: "Ne sautez jamais cette partie! Votre coeur a besoin de redescendre",
                muscles: "Récupération cardio"
            }
        ]
    },
    pilates: {
        title: "Pilates Core & Posture",
        duration: 30,
        intensity: "Modéré",
        calories: 220,
        description: "Séance Pilates pour renforcer le centre et améliorer la posture",
        exercises: [
            { 
                name: "Centrage & Respiration", 
                duration: 180, 
                detail: "Connexion corps-esprit", 
                calories: 15,
                instructions: "Allongez-vous sur le dos, genoux pliés. Respirez profondément en gonflant les côtes latéralement. À l'expir, rentrez nombril vers colonne.",
                tips: "Sentez vos abdos profonds se connecter",
                muscles: "Transverse, diaphragme"
            },
            { 
                name: "Hundred (Cent)", 
                duration: 300, 
                detail: "Classique Pilates", 
                calories: 40,
                instructions: "Tête soulevée, jambes en table, bras tendus. Battements de bras rapides, respir 5 temps in/5 temps out. 100 battements total.",
                tips: "Gardez bas du dos au sol, épaules loin des oreilles",
                muscles: "Abdos, circulation"
            },
            { 
                name: "Single Leg Circles", 
                duration: 240, 
                detail: "Mobilité hanches", 
                calories: 25,
                instructions: "Une jambe au plafond, l'autre au sol. Dessinez 5 cercles dans chaque sens avec jambe levée. Changez de jambe.",
                tips: "Hanches stables, seule la jambe bouge",
                muscles: "Hip flexors, stabilisation"
            },
            { 
                name: "Rolling Like a Ball", 
                duration: 180, 
                detail: "Massage colonne", 
                calories: 30,
                instructions: "En boule, mains sur tibias. Roulez en arrière jusqu'aux épaules puis revenez en équilibre. 10 fois.",
                tips: "Gardez la forme ronde, contrôlez avec les abdos",
                muscles: "Abdos, mobilité rachis"
            },
            { 
                name: "Teaser Progression", 
                duration: 240, 
                detail: "Défi équilibre", 
                calories: 45,
                instructions: "Progression: début avec genoux pliés, puis jambes tendues. Montée en V, bras parallèles aux jambes. Redescente contrôlée.",
                tips: "Qualité avant quantité, utilisez vos abdos",
                muscles: "Core complet, équilibre"
            },
            { 
                name: "Swan Dive", 
                duration: 180, 
                detail: "Ouverture dos", 
                calories: 25,
                instructions: "Sur le ventre, mains au sol. Soulevez poitrine et jambes, bascule douce d'avant en arrière comme un bascule.",
                tips: "Gardez long cou, utilisez dos et fessiers",
                muscles: "Dorsaux, fessiers, posture"
            },
            { 
                name: "Side Kick Series", 
                duration: 360, 
                detail: "Force latérale", 
                calories: 50,
                instructions: "Sur le côté, jambe du dessus: kicks avant/arrière 10x, cercles 5x, up/down 10x. Changer de côté.",
                tips: "Bassin stable, mouvements contrôlés",
                muscles: "Hanches, obliques, jambes"
            },
            { 
                name: "Seal & Relaxation", 
                duration: 240, 
                detail: "Finir en douceur", 
                calories: 15,
                instructions: "Comme Rolling Ball mais en applaudissant des pieds 3 fois. Puis relaxation finale, étirements doux.",
                tips: "Amusez-vous avec les applaudissements!",
                muscles: "Détente, souplesse"
            }
        ]
    },
    stretching: {
        title: "Stretching Profond",
        duration: 25,
        intensity: "Léger",
        calories: 120,
        description: "Séance d'étirements profonds pour souplesse et détente",
        exercises: [
            { 
                name: "Réveil Articulaire Doux", 
                duration: 180, 
                detail: "Mobilisation en douceur", 
                calories: 15,
                instructions: "Rotations lentes: cou, épaules, bras, poignets, hanches, genoux, chevilles. 5 fois chaque sens.",
                tips: "Très lentement, écoutez votre corps",
                muscles: "Articulations"
            },
            { 
                name: "Étirements Chaîne Postérieure", 
                duration: 300, 
                detail: "Dos, ischio, mollets", 
                calories: 20,
                instructions: "Chien tête en bas 60 sec, pince avant debout 60 sec, étirement mollet au mur 30 sec chaque, toucher orteils assis 60 sec.",
                tips: "Respirez dans l'étirement, ne forcez jamais",
                muscles: "Ischio-jambiers, dos, mollets"
            },
            { 
                name: "Étirements Hanches & Bassin", 
                duration: 360, 
                detail: "Ouverture hanches", 
                calories: 25,
                instructions: "Pigeon 90 sec/côté, papillon 60 sec, fente basse 45 sec/côté, étirement psoas debout 30 sec/côté.",
                tips: "Les hanches stockent le stress, soyez patient",
                muscles: "Hip flexors, fessiers, piriformis"
            },
            { 
                name: "Étirements Haut du Corps", 
                duration: 300, 
                detail: "Pectoraux, épaules, cou", 
                calories: 20,
                instructions: "Étirement pectoraux mur 45 sec, aigle (bras) 30 sec chaque, étirement triceps 30 sec chaque, rotations épaules, étirement cou latéral 30 sec chaque.",
                tips: "Contrez les postures de bureau et smartphone",
                muscles: "Pectoraux, épaules, cou"
            },
            { 
                name: "Torsions Rachidiennes", 
                duration: 240, 
                detail: "Mobilité colonne", 
                calories: 20,
                instructions: "Torsion assise 60 sec/côté, torsion allongée 60 sec/côté, cat-cow 8 fois lentement.",
                tips: "Allongez la colonne avant de tourner",
                muscles: "Colonne vertébrale, obliques"
            },
            { 
                name: "Relaxation Intégrative", 
                duration: 300, 
                detail: "Détente profonde", 
                calories: 20,
                instructions: "Savasana: allongé sur le dos, relâchez chaque partie du corps. Respiration 4-6-8 (inspire 4, retention 6, expire 8).",
                tips: "Laissez votre poids s'enfoncer dans le sol",
                muscles: "Détente système nerveux"
            }
        ]
    }
};

// Weekly plan template - PHASE 1 AGGRESSIVE (Semaines 1-4)
const aggressiveWeeklyPlans = {
    1: [
        { day: "Lundi", type: "hiit", completed: false, note: "Premier jour - Donnez tout !" },
        { day: "Mardi", type: "strength", completed: false, note: "Force et résistance" },
        { day: "Mercredi", type: "tabata", completed: false, note: "Cardio explosif" },
        { day: "Jeudi", type: "abs", completed: false, note: "Core et gainage" },
        { day: "Vendredi", type: "hiit", completed: false, note: "HIIT intense" },
        { day: "Samedi", type: "cardio", completed: false, note: "Endurance longue" },
        { day: "Dimanche", type: "mobility", completed: false, note: "Récupération active" }
    ],
    2: [
        { day: "Lundi", type: "strength", completed: false, note: "Force maximale" },
        { day: "Mardi", type: "hiit", completed: false, note: "Cardio HIIT" },
        { day: "Mercredi", type: "abs", completed: false, note: "Abdos + Core" },
        { day: "Jeudi", type: "tabata", completed: false, note: "Tabata explosif" },
        { day: "Vendredi", type: "cardio", completed: false, note: "Cardio modéré" },
        { day: "Samedi", type: "hiit", completed: false, note: "HIIT puissant" },
        { day: "Dimanche", type: "yoga", completed: false, note: "Récupération et souplesse" }
    ],
    3: [
        { day: "Lundi", type: "tabata", completed: false, note: "Semaine intense - Explosivité" },
        { day: "Mardi", type: "strength", completed: false, note: "Renforcement musculaire" },
        { day: "Mercredi", type: "hiit", completed: false, note: "HIIT brûle graisse" },
        { day: "Jeudi", type: "abs", completed: false, note: "Sangle abdominale" },
        { day: "Vendredi", type: "cardio", completed: false, note: "Cardio longue durée" },
        { day: "Samedi", type: "tabata", completed: false, note: "Tabata final" },
        { day: "Dimanche", type: "mobility", completed: false, note: "Étirements profonds" }
    ],
    4: [
        { day: "Lundi", type: "hiit", completed: false, note: "Dernière semaine agressive !" },
        { day: "Mardi", type: "strength", completed: false, note: "Force et puissance" },
        { day: "Mercredi", type: "tabata", completed: false, note: "Tabata intense" },
        { day: "Jeudi", type: "abs", completed: false, note: "Abdos sculptés" },
        { day: "Vendredi", type: "hiit", completed: false, note: "HIIT maximum" },
        { day: "Samedi", type: "cardio", completed: false, note: "Endurance finale" },
        { day: "Dimanche", type: "yoga", completed: false, note: "Récupération avant Phase 2" }
    ]
};

// Weekly plan template - PHASE 2 NORMALE (Semaines 5+)
const normalWeeklyPlans = {
    1: [
        { day: "Lundi", type: "hiit", completed: false, note: "Maintien cardio" },
        { day: "Mardi", type: "mobility", completed: false, note: "Souplesse" },
        { day: "Mercredi", type: "strength", completed: false, note: "Renforcement" },
        { day: "Jeudi", type: "abs", completed: false, note: "Core" },
        { day: "Vendredi", type: "rest", completed: false, note: "Repos actif" },
        { day: "Samedi", type: "cardio", completed: false, note: "Cardio modéré" },
        { day: "Dimanche", type: "yoga", completed: false, note: "Récupération" }
    ],
    2: [
        { day: "Lundi", type: "strength", completed: false, note: "Force" },
        { day: "Mardi", type: "rest", completed: false, note: "Repos" },
        { day: "Mercredi", type: "hiit", completed: false, note: "HIIT" },
        { day: "Jeudi", type: "cardio", completed: false, note: "Endurance" },
        { day: "Vendredi", type: "abs", completed: false, note: "Abdos" },
        { day: "Samedi", type: "tabata", completed: false, note: "Tabata" },
        { day: "Dimanche", type: "mobility", completed: false, note: "Mobilité" }
    ],
    3: [
        { day: "Lundi", type: "hiit", completed: false, note: "HIIT" },
        { day: "Mardi", type: "yoga", completed: false, note: "Yoga" },
        { day: "Mercredi", type: "strength", completed: false, note: "Force" },
        { day: "Jeudi", type: "abs", completed: false, note: "Core" },
        { day: "Vendredi", type: "cardio", completed: false, note: "Cardio" },
        { day: "Samedi", type: "rest", completed: false, note: "Repos" },
        { day: "Dimanche", type: "mobility", completed: false, note: "Récupération" }
    ],
    4: [
        { day: "Lundi", type: "tabata", completed: false, note: "Tabata" },
        { day: "Mardi", type: "mobility", completed: false, note: "Mobilité" },
        { day: "Mercredi", type: "strength", completed: false, note: "Force" },
        { day: "Jeudi", type: "hiit", completed: false, note: "HIIT" },
        { day: "Vendredi", type: "abs", completed: false, note: "Abdos" },
        { day: "Samedi", type: "cardio", completed: false, note: "Cardio" },
        { day: "Dimanche", type: "yoga", completed: false, note: "Récupération" }
    ]
};

// Fonction pour obtenir le bon plan selon la phase
function getWeeklyPlans() {
    return getCurrentPhase() === 1 ? aggressiveWeeklyPlans : normalWeeklyPlans;
}

// Plans nutritionnels PHASE 1 AGRESSIVE - JADE
const aggressiveNutritionJade = {
    targetCalories: 1900,  // Déficit agressif
    protein: 200,  // 2.1g/kg
    carbs: 120,    // Réduits, midi uniquement
    fat: 63,       // 30% calories
    rules: [
        "🚫 ZÉRO sucre ajouté",
        "⏰ Jeûne 16/8 strict (12h-20h)",
        "🍚 Féculents MIDI UNIQUEMENT",
        "💧 Minimum 3L d'eau/jour",
        "🥩 Priorité protéines"
    ],
    meals: [
        { 
            time: "12:00", 
            name: "Déjeuner Power", 
            emoji: "🥩",
            description: "Bœuf maigre, riz, légumes", 
            calories: 750, 
            protein: 80, 
            carbs: 70, 
            fat: 18,
            phase: 1,
            ingredients: [
                "220g bœuf maigre (5% MG)",
                "120g riz basmati cuit",
                "200g brocoli vapeur",
                "100g haricots verts",
                "Épices: ail, poivre, herbes"
            ],
            instructions: [
                "Cuire le riz à l'eau (préparation meal prep possible)",
                "Griller le bœuf à la poêle 3-4 min/côté",
                "Cuire légumes à la vapeur 7-8 min",
                "Assaisonner généreusement (pas de sel excessif)",
                "Servir chaud, manger lentement"
            ],
            mealPrep: "✅ Préparation anticipée: Cuire riz et viande pour 3 jours"
        },
        { 
            time: "16:00", 
            name: "Collation Protéinée", 
            emoji: "💪",
            description: "Blanc de poulet + légumes", 
            calories: 280, 
            protein: 50, 
            carbs: 12, 
            fat: 6,
            phase: 1,
            ingredients: [
                "150g blanc de poulet cuit",
                "100g concombre",
                "100g tomates cerises",
                "Sel, poivre, citron"
            ],
            instructions: [
                "Utiliser poulet précuit (meal prep)",
                "Couper concombre et tomates",
                "Arroser de jus de citron",
                "Manger froid ou réchauffer le poulet"
            ],
            mealPrep: "✅ Cuire 5-6 blancs de poulet le dimanche"
        },
        { 
            time: "19:30", 
            name: "Dîner Léger", 
            emoji: "🐟",
            description: "Poisson + légumes vapeur SANS féculents", 
            calories: 520, 
            protein: 70, 
            carbs: 18, 
            fat: 22,
            phase: 1,
            ingredients: [
                "200g saumon ou cabillaud",
                "250g courgettes",
                "150g épinards frais",
                "1 c. à soupe huile d'olive",
                "Citron, aneth"
            ],
            instructions: [
                "Cuire le poisson: air fryer 12 min à 180°C OU poêle 4 min/côté",
                "Faire revenir courgettes et épinards à l'huile d'olive",
                "Assaisonner poisson avec citron et aneth",
                "IMPORTANT: PAS de féculents le soir en phase agressive"
            ],
            mealPrep: "🔄 Varier les poissons: saumon, cabillaud, colin, dorade"
        },
        { 
            time: "20:00", 
            name: "Fin jeûne", 
            emoji: "🥛",
            description: "Optionnel: Caséine si faim", 
            calories: 120, 
            protein: 24, 
            carbs: 4, 
            fat: 2,
            phase: 1,
            ingredients: [
                "30g caséine micellaire OU",
                "150g fromage blanc 0%"
            ],
            instructions: [
                "Uniquement si vraiment affamé",
                "Privilégier caséine (digestion lente)",
                "Sinon: RIEN jusqu'au lendemain 12h"
            ],
            mealPrep: "💡 Optionnel - Supprimer si pas de faim"
        }
    ]
};

// Plans nutritionnels PHASE 1 AGRESSIVE - ÉLODIE
const aggressiveNutritionElodie = {
    targetCalories: 1600,  // Déficit adapté femme post-partum
    protein: 150,  // 1.7g/kg
    carbs: 100,    // Réduits, midi uniquement
    fat: 53,       // 30% calories
    rules: [
        "🚫 ZÉRO sucre ajouté",
        "⏰ Jeûne 16/8 strict (12h-20h)",
        "🍚 Féculents MIDI UNIQUEMENT",
        "💧 Minimum 2.5L d'eau/jour",
        "👶 Post-partum: Progressif et sécuritaire"
    ],
    meals: [
        { 
            time: "12:00", 
            name: "Déjeuner Équilibré", 
            emoji: "🍗",
            description: "Poulet, quinoa, légumes", 
            calories: 620, 
            protein: 58, 
            carbs: 58, 
            fat: 16,
            phase: 1,
            ingredients: [
                "180g blanc de poulet",
                "100g quinoa cuit",
                "150g brocoli",
                "100g carottes",
                "1 c. à café huile d'olive"
            ],
            instructions: [
                "Cuire quinoa 15 min (meal prep OK)",
                "Griller poulet assaisonné",
                "Cuire légumes vapeur",
                "Mélanger avec un filet d'huile d'olive"
            ],
            mealPrep: "✅ Batch cooking: 3 portions en 1 fois"
        },
        { 
            time: "16:00", 
            name: "Collation Post-Entraînement", 
            emoji: "🥚",
            description: "Œufs + légumes", 
            calories: 240, 
            protein: 28, 
            carbs: 8, 
            fat: 12,
            phase: 1,
            ingredients: [
                "3 œufs durs",
                "100g concombre",
                "Tomates cerises",
                "Sel, poivre"
            ],
            instructions: [
                "Cuire œufs durs (10 min)",
                "Préparer légumes frais",
                "Consommer dans l'heure post-workout"
            ],
            mealPrep: "✅ Cuire 12 œufs durs le dimanche (conservation 5 jours)"
        },
        { 
            time: "19:30", 
            name: "Dîner Léger", 
            emoji: "🦐",
            description: "Poisson ou fruits de mer + légumes SANS féculents", 
            calories: 440, 
            protein: 55, 
            carbs: 15, 
            fat: 18,
            phase: 1,
            ingredients: [
                "180g poisson blanc ou crevettes",
                "200g courgettes",
                "150g épinards",
                "1 c. à soupe huile d'olive",
                "Ail, citron"
            ],
            instructions: [
                "Cuire poisson: air fryer 10-12 min OU poêle",
                "Faire sauter légumes à l'ail",
                "Arroser de citron",
                "PAS de féculents le soir"
            ],
            mealPrep: "🐟 Varier: colin, cabillaud, crevettes, moules"
        },
        { 
            time: "20:00", 
            name: "Fin jeûne", 
            emoji: "🍵",
            description: "Tisane ou fromage blanc si faim", 
            calories: 80, 
            protein: 15, 
            carbs: 5, 
            fat: 1,
            phase: 1,
            ingredients: [
                "100g fromage blanc 0% OU",
                "Tisane sans sucre"
            ],
            instructions: [
                "Privilégier tisane (verveine, camomille)",
                "Fromage blanc uniquement si faim importante",
                "Puis STOP jusqu'à 12h lendemain"
            ],
            mealPrep: "💡 Optionnel"
        }
    ]
};

// Plans nutritionnels PHASE 2 NORMALE - JADE
const normalNutritionJade = {
    targetCalories: 2100,
    protein: 180,
    carbs: 180,
    fat: 70,
    rules: [
        "🍎 Fruits autorisés (2-3/jour)",
        "⏰ Jeûne 16/8 (12h-20h)",
        "🍚 Féculents matin et midi",
        "💧 2.5L d'eau/jour",
        "💪 Maintien masse musculaire"
    ],
    meals: [
        { 
            time: "12:00", 
            name: "Déjeuner", 
            emoji: "🍗",
            description: "Bowl Poulet Grillé Méditerranéen", 
            calories: 650, 
            protein: 65, 
            carbs: 70, 
            fat: 12,
            phase: 2,
            ingredients: [
                "200g blanc de poulet",
                "150g riz basmati (poids cuit)",
                "100g courgettes",
                "80g poivrons rouges",
                "1 c. à soupe huile d'olive",
                "Épices: paprika, ail, herbes de Provence"
            ],
            instructions: [
                "Faire cuire le riz basmati selon les instructions",
                "Couper le poulet en lanières, assaisonner avec paprika et ail",
                "Griller le poulet à la poêle 5-6 min de chaque côté",
                "Faire sauter les légumes coupés avec l'huile d'olive",
                "Assembler dans un bol: riz, légumes, poulet grillé"
            ],
            mealPrep: "✅ Préparation meal prep possible"
        },
        { 
            time: "16:00", 
            name: "Collation Post-Training", 
            emoji: "💪",
            description: "Shake Protéiné Banane", 
            calories: 350, 
            protein: 35, 
            carbs: 40, 
            fat: 8,
            phase: 2,
            ingredients: [
                "1 dose whey vanille (30g)",
                "1 banane moyenne",
                "1 c. à soupe beurre de cacahuète",
                "250ml lait d'amande",
                "3-4 glaçons"
            ],
            instructions: [
                "Mixer tous les ingrédients ensemble",
                "Ajuster la consistance avec plus de lait si nécessaire",
                "Consommer dans les 30 min après l'entraînement"
            ],
            mealPrep: "⚡ Post-workout"
        },
        { 
            time: "19:30", 
            name: "Dîner", 
            emoji: "🐟",
            description: "Saumon & légumes", 
            calories: 650, 
            protein: 55, 
            carbs: 45, 
            fat: 32,
            phase: 2,
            ingredients: [
                "180g pavé de saumon",
                "150g patate douce",
                "150g salade verte mixte",
                "10g huile d'olive",
                "1/2 citron",
                "Aneth, sel, poivre"
            ],
            instructions: [
                "Cuire la patate douce au four 25-30 min",
                "Assaisonner le saumon avec citron, aneth",
                "Cuire le saumon à la poêle 4-5 min de chaque côté",
                "Servir avec la salade fraîche"
            ],
            mealPrep: "🐟 Varier les poissons"
        }
    ]
};

// Plans nutritionnels PHASE 2 NORMALE - ÉLODIE
const normalNutritionElodie = {
    targetCalories: 1700,
    protein: 130,
    carbs: 150,
    fat: 60,
    rules: [
        "🍎 Fruits autorisés (2/jour)",
        "⏰ Jeûne 16/8 (12h-20h)",
        "🍚 Féculents matin et midi",
        "💧 2.5L d'eau/jour",
        "👶 Progressif et sécuritaire"
    ],
    meals: [
        { 
            time: "12:00", 
            name: "Déjeuner", 
            emoji: "🥗",
            description: "Buddha Bowl Poulet Quinoa", 
            calories: 550, 
            protein: 48, 
            carbs: 55, 
            fat: 15,
            phase: 2,
            ingredients: [
                "160g blanc de poulet",
                "100g quinoa (poids cuit)",
                "100g brocoli vapeur",
                "50g carottes râpées",
                "30g avocat",
                "Jus de citron, coriandre"
            ],
            instructions: [
                "Cuire le quinoa selon les instructions (env. 15 min)",
                "Griller le poulet assaisonné à la poêle",
                "Cuire le brocoli à la vapeur 5-6 min",
                "Disposer tous les ingrédients dans un bol",
                "Arroser de jus de citron, parsemer de coriandre"
            ],
            mealPrep: "✅ Batch cooking recommandé"
        },
        { 
            time: "16:00", 
            name: "Collation", 
            emoji: "🍓",
            description: "Yaourt Grec aux Fruits Rouges", 
            calories: 250, 
            protein: 22, 
            carbs: 28, 
            fat: 8,
            phase: 2,
            ingredients: [
                "150g yaourt grec 0%",
                "100g fruits rouges",
                "5g graines de chia",
                "1 c. à café miel"
            ],
            instructions: [
                "Laver les fruits rouges frais",
                "Mélanger le yaourt grec avec le miel",
                "Ajouter les fruits rouges",
                "Parsemer de graines de chia"
            ],
            mealPrep: "🍓 Fruits frais ou surgelés"
        },
        { 
            time: "19:30", 
            name: "Dîner", 
            emoji: "🦐",
            description: "Poisson & légumes", 
            calories: 480, 
            protein: 50, 
            carbs: 35, 
            fat: 18,
            phase: 2,
            ingredients: [
                "170g poisson blanc",
                "120g patate douce",
                "150g légumes vapeur",
                "1 c. à soupe huile d'olive",
                "Citron"
            ],
            instructions: [
                "Cuire patate douce",
                "Cuire poisson air fryer ou poêle",
                "Légumes vapeur",
                "Arroser de citron"
            ],
            mealPrep: "🐟 Simple et rapide"
        }
    ]
};

// Fonction pour obtenir le bon plan nutritionnel
function getNutritionPlans() {
    const phase = getCurrentPhase();
    if (phase === 1) {
        return {
            jade: aggressiveNutritionJade,
            elodie: aggressiveNutritionElodie
        };
    } else {
        return {
            jade: normalNutritionJade,
            elodie: normalNutritionElodie
        };
    }
}

// Fonction pour obtenir le numéro du jour dans le programme (1-217)
function getProgramDayNumber(date = new Date()) {
    const diffTime = Math.abs(date - PROGRAM_START_DATE);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1; // Jour 1 = premier jour
}

// Fonction pour sélectionner des recettes qui tournent automatiquement chaque jour
function getDailyMeals(profile, phase, date = currentViewDate) {
    const dayNumber = getProgramDayNumber(date);
    const plans = getNutritionPlans();
    const basePlan = plans[profile];
    
    // Obtenir les alternatives pour chaque type de repas
    const mealsWithAlternatives = basePlan.meals.map((meal, idx) => {
        let mealType = '';
        if (phase === 1) {
            // Phase 1: 3 repas (lunch, snack, dinner)
            if (idx === 0) mealType = 'lunch';
            else if (idx === 1) mealType = 'snack';
            else if (idx === 2) mealType = 'dinner';
        } else {
            // Phase 2: 4 repas (breakfast, lunch, snack, dinner)
            if (idx === 0) mealType = 'breakfast';
            else if (idx === 1) mealType = 'lunch';
            else if (idx === 2) mealType = 'snack';
            else if (idx === 3) mealType = 'dinner';
        }
        
        if (mealType) {
            const alternatives = getMealAlternatives(profile, phase, mealType);
            if (alternatives && alternatives.length > 0) {
                // Utiliser le numéro du jour pour sélectionner une recette
                // Cela fait tourner automatiquement les recettes
                const recipeIndex = (dayNumber - 1) % alternatives.length;
                const selectedRecipe = alternatives[recipeIndex];
                
                // Fusionner la recette sélectionnée avec les infos du repas de base
                return {
                    ...meal,
                    ...selectedRecipe,
                    time: meal.time, // Garder l'heure du repas de base
                    description: selectedRecipe.name // Utiliser le nom de la recette
                };
            }
        }
        
        return meal; // Retourner le repas de base si pas d'alternatives
    });
    
    return mealsWithAlternatives;
}

// Anciens plans pour compatibilité (ne seront plus utilisés)
const nutritionPlans = {
    jade: normalNutritionJade,
    elodie: normalNutritionElodie
};

// ========================================
// BIBLIOTHÈQUE DE RECETTES ALTERNATIVES
// ========================================

// Alternatives DÉJEUNER - Phase Agressive - Jade (750 kcal, 80g P, 70g C, 18g L)
const lunchAlternativesAggressiveJade = [
    {
        id: "lunch_jade_agg_1",
        name: "Bœuf maigre, riz, légumes",
        emoji: "🥩",
        calories: 750, protein: 80, carbs: 70, fat: 18,
        phase: 1,
        ingredients: ["220g bœuf maigre 5%", "120g riz basmati cuit", "200g brocoli", "100g haricots verts"],
        instructions: ["Griller le bœuf 3-4 min/côté", "Cuire riz", "Légumes vapeur 7 min"],
        mealPrep: "✅ Batch cooking 3 jours"
    },
    {
        id: "lunch_jade_agg_2",
        name: "Poulet grillé, quinoa, légumes",
        emoji: "🍗",
        calories: 745, protein: 82, carbs: 68, fat: 16,
        ingredients: ["240g blanc de poulet", "110g quinoa cuit", "150g courgettes", "150g poivrons"],
        instructions: ["Griller poulet 5 min/côté", "Cuire quinoa 15 min", "Légumes sautés à la poêle"],
        mealPrep: "✅ Poulet grillé en avance"
    },
    {
        id: "lunch_jade_agg_3",
        name: "Dinde, patate douce, légumes",
        emoji: "🦃",
        calories: 755, protein: 78, carbs: 72, fat: 17,
        ingredients: ["230g escalope de dinde", "180g patate douce", "200g haricots verts", "100g carottes"],
        instructions: ["Cuire patate douce 25 min four", "Griller dinde 4 min/côté", "Légumes vapeur"],
        mealPrep: "✅ Patates douces au four dimanche"
    },
    {
        id: "lunch_jade_agg_4",
        name: "Thon frais, riz complet, légumes",
        emoji: "🐟",
        calories: 740, protein: 79, carbs: 69, fat: 19,
        ingredients: ["210g pavé de thon", "115g riz complet cuit", "200g brocoli", "100g tomates"],
        instructions: ["Saisir thon 2 min/côté (mi-cuit)", "Riz complet 25 min", "Légumes vapeur"],
        mealPrep: "✅ Riz complet pour plusieurs jours"
    },
    {
        id: "lunch_jade_agg_5",
        name: "Bœuf haché maigre, riz basmati, ratatouille",
        emoji: "🍛",
        calories: 748, protein: 81, carbs: 71, fat: 18,
        ingredients: ["220g bœuf haché 5%", "120g riz basmati", "200g ratatouille (courgette, aubergine, tomate)"],
        instructions: ["Faire revenir bœuf haché", "Cuire riz", "Ratatouille maison ou précuite"],
        mealPrep: "✅ Ratatouille 5 jours au frigo"
    },
    {
        id: "lunch_jade_agg_6",
        name: "Saumon, riz thaï, légumes asiatiques",
        emoji: "🍱",
        calories: 752, protein: 77, carbs: 70, fat: 20,
        ingredients: ["200g saumon", "115g riz jasmin", "150g pak choi", "100g champignons"],
        instructions: ["Saumon poêle 4 min/côté", "Riz 12 min", "Légumes wok 3 min"],
        mealPrep: "🔥 Cuisson rapide"
    },
    {
        id: "lunch_jade_agg_7",
        name: "Filet de porc, semoule, légumes grillés",
        emoji: "🥘",
        calories: 747, protein: 80, carbs: 69, fat: 18,
        ingredients: ["230g filet de porc", "110g semoule", "150g aubergine", "100g poivrons"],
        instructions: ["Porc poêle 5 min/côté", "Semoule 5 min", "Légumes four 15 min"],
        mealPrep: "✅ Légumes au four pratique"
    },
    {
        id: "lunch_jade_agg_8",
        name: "Crevettes jumbo, riz basmati, brocoli",
        emoji: "🦐",
        calories: 743, protein: 79, carbs: 71, fat: 17,
        ingredients: ["280g crevettes", "115g riz basmati", "250g brocoli", "Ail, citron"],
        instructions: ["Crevettes poêle 3 min", "Riz 12 min", "Brocoli vapeur 7 min"],
        mealPrep: "⚡ Très rapide"
    },
    {
        id: "lunch_jade_agg_9",
        name: "Steak de bison, quinoa rouge, épinards",
        emoji: "🥩",
        calories: 751, protein: 81, carbs: 68, fat: 19,
        ingredients: ["220g steak de bison", "110g quinoa rouge", "200g épinards", "Champignons"],
        instructions: ["Bison grillé 3 min/côté", "Quinoa 15 min", "Épinards sautés 2 min"],
        mealPrep: "🔄 Viande rouge maigre"
    },
    {
        id: "lunch_jade_agg_10",
        name: "Merlu, riz complet, courgettes",
        emoji: "🐠",
        calories: 746, protein: 78, carbs: 72, fat: 17,
        ingredients: ["230g merlu", "120g riz complet", "200g courgettes", "100g tomates cerises"],
        instructions: ["Merlu four 12 min", "Riz 25 min", "Courgettes poêle"],
        mealPrep: "✅ Poisson blanc économique"
    },
    {
        id: "lunch_jade_agg_11",
        name: "Veau, pâtes complètes, légumes méditerranéens",
        emoji: "🍝",
        calories: 754, protein: 79, carbs: 70, fat: 19,
        ingredients: ["220g escalope de veau", "90g pâtes complètes crues", "150g aubergine", "100g tomates"],
        instructions: ["Veau poêle 4 min/côté", "Pâtes al dente", "Légumes grillés"],
        mealPrep: "🔥 Pâtes meal prep OK"
    },
    {
        id: "lunch_jade_agg_12",
        name: "Cabillaud, pomme de terre vapeur, haricots",
        emoji: "🥔",
        calories: 749, protein: 80, carbs: 71, fat: 17,
        ingredients: ["240g cabillaud", "200g pommes de terre", "200g haricots verts", "Persil"],
        instructions: ["Cabillaud vapeur 10 min", "Pommes vapeur 20 min", "Haricots vapeur"],
        mealPrep: "✅ Tout vapeur simple"
    },
    {
        id: "lunch_jade_agg_13",
        name: "Dinde hachée, couscous, légumes du soleil",
        emoji: "🌾",
        calories: 753, protein: 81, carbs: 69, fat: 18,
        ingredients: ["230g dinde hachée", "100g couscous", "150g courgettes", "100g poivrons", "Épices"],
        instructions: ["Dinde revenue aux épices", "Couscous 5 min", "Légumes poêle"],
        mealPrep: "⚡ Très rapide"
    },
    {
        id: "lunch_jade_agg_14",
        name: "Dos de lieu, riz sauvage, asperges",
        emoji: "🐟",
        calories: 748, protein: 79, carbs: 70, fat: 18,
        ingredients: ["230g lieu", "115g riz sauvage", "200g asperges vertes", "Citron"],
        instructions: ["Lieu four 12 min", "Riz sauvage 30 min", "Asperges vapeur 8 min"],
        mealPrep: "✅ Riz sauvage change"
    },
    {
        id: "lunch_jade_agg_15",
        name: "Bœuf bourguignon light, purée patate douce",
        emoji: "🍲",
        calories: 750, protein: 80, carbs: 68, fat: 19,
        ingredients: ["230g bœuf en morceaux", "180g patate douce", "Carottes, oignons", "Bouillon dégraissé"],
        instructions: ["Mijoter bœuf 1h30", "Purée patate douce", "Carottes fondantes"],
        mealPrep: "✅ Batch cooking 4 jours"
    },
    { 
        id: "lunch_jade_agg_16", 
        name: "Poulet tandoori + riz sauvage", 
        emoji: "🌶️", 
        calories: 752, 
        protein: 81, 
        carbs: 71, 
        fat: 17,
        ingredients: ["220g poulet mariné tandoori", "140g riz sauvage cuit", "100g épinards", "Yaourt 0%", "Épices tandoori"],
        instructions: ["Mariner poulet 30min dans yaourt + épices", "Griller au four 25min à 200°C", "Riz sauvage 40min", "Épinards sautés"],
        mealPrep: "✅ Marinade la veille, cuisson facile"
    },
    { 
        id: "lunch_jade_agg_17", 
        name: "Saumon gravlax + riz basmati + fenouil", 
        emoji: "🐟", 
        calories: 748, 
        protein: 79, 
        carbs: 69, 
        fat: 18,
        ingredients: ["200g saumon gravlax fait maison", "150g riz basmati", "120g fenouil", "Aneth", "Citron"],
        instructions: ["Gravlax: saumon + sel + sucre + aneth 48h frigo", "Riz basmati classique", "Fenouil émincé finement", "Jus de citron"],
        mealPrep: "✅ Gravlax 5 jours frigo"
    },
    { 
        id: "lunch_jade_agg_18", 
        name: "Bœuf teriyaki + nouilles soba", 
        emoji: "🍜", 
        calories: 755, 
        protein: 82, 
        carbs: 72, 
        fat: 17,
        ingredients: ["210g bœuf maigre émincé", "100g nouilles soba", "Sauce soja", "Gingembre", "Brocoli", "Graines sésame"],
        instructions: ["Faire sauter bœuf avec gingembre", "Ajouter sauce soja (peu)", "Nouilles soba 5min", "Brocoli vapeur", "Sésame grillé"],
        mealPrep: "✅ Bœuf mariné en avance"
    },
    { 
        id: "lunch_jade_agg_19", 
        name: "Crevettes cajun + riz rouge + poivrons", 
        emoji: "🦐", 
        calories: 750, 
        protein: 80, 
        carbs: 70, 
        fat: 18,
        ingredients: ["250g crevettes", "130g riz rouge", "150g poivrons tricolores", "Épices cajun", "Ail"],
        instructions: ["Riz rouge 35min", "Crevettes + épices cajun", "Poêler 3min", "Poivrons grillés", "Ail émincé"],
        mealPrep: "✅ Riz rouge batch cooking"
    },
    { 
        id: "lunch_jade_agg_20", 
        name: "Poulet yakitori + riz jasmin", 
        emoji: "🍢", 
        calories: 747, 
        protein: 79, 
        carbs: 69, 
        fat: 17,
        ingredients: ["230g poulet en cubes", "150g riz jasmin", "Sauce yakitori", "Oignons verts", "Graines sésame"],
        instructions: ["Poulet en brochettes", "Badigeonner sauce yakitori", "Grill 15min", "Riz jasmin", "Oignons verts hachés"],
        mealPrep: "✅ Brochettes préparées veille"
    },
    { 
        id: "lunch_jade_agg_21", 
        name: "Cabillaud pané air fryer + quinoa", 
        emoji: "🐟", 
        calories: 753, 
        protein: 81, 
        carbs: 71, 
        fat: 17,
        ingredients: ["230g cabillaud", "Chapelure panko", "140g quinoa", "100g courgettes", "Citron"],
        instructions: ["Cabillaud pané chapelure panko", "Air fryer 12min 190°C", "Quinoa 15min", "Courgettes grillées"],
        mealPrep: "✅ Panure en avance"
    },
    { 
        id: "lunch_jade_agg_22", 
        name: "Bœuf bourguignon light + purée céleri", 
        emoji: "🍷", 
        calories: 751, 
        protein: 80, 
        carbs: 70, 
        fat: 18,
        ingredients: ["220g bœuf maigre", "200g céleri rave", "Carottes", "Oignons", "Vin rouge (cuisson)", "Bouillon"],
        instructions: ["Mijoter bœuf 2h avec légumes", "Purée céleri rave", "Dégraisser sauce"],
        mealPrep: "✅✅✅ Excellent batch 5 jours"
    },
    { 
        id: "lunch_jade_agg_23", 
        name: "Saumon poké bowl maison", 
        emoji: "🥗", 
        calories: 749, 
        protein: 79, 
        carbs: 69, 
        fat: 18,
        ingredients: ["180g saumon cru qualité sashimi", "150g riz sushi", "Edamame", "Concombre", "Algues nori", "Sauce soja"],
        instructions: ["Saumon en cubes", "Mariner sauce soja 10min", "Riz sushi vinaigré", "Edamame décortiqués", "Concombre julienne"],
        mealPrep: "🔄 Saumon très frais jour même"
    },
    { 
        id: "lunch_jade_agg_24", 
        name: "Dinde sauce champignons + boulgour", 
        emoji: "🍄", 
        calories: 754, 
        protein: 82, 
        carbs: 71, 
        fat: 17,
        ingredients: ["230g escalope dinde", "140g boulgour", "200g champignons", "Crème 0%", "Persil"],
        instructions: ["Dinde poêlée", "Champignons sautés", "Sauce crème 0%", "Boulgour 10min", "Persil frais"],
        mealPrep: "✅ Sauce champignons en grande quantité"
    },
    { 
        id: "lunch_jade_agg_25", 
        name: "Crevettes à la plancha + riz complet + ratatouille", 
        emoji: "🦐", 
        calories: 752, 
        protein: 80, 
        carbs: 70, 
        fat: 18,
        ingredients: ["260g crevettes", "140g riz complet", "Courgette", "Aubergine", "Tomate", "Herbes de Provence"],
        instructions: ["Ratatouille mijotée 30min", "Riz complet 35min", "Crevettes plancha 4min", "Citron pressé"],
        mealPrep: "✅ Ratatouille 1 semaine"
    }
];

// Alternatives COLLATION - Phase Agressive - Jade (280 kcal, 50g P, 12g C, 6g L)
const snackAlternativesAggressiveJade = [
    { id: "snack_jade_agg_1", name: "Blanc de poulet + légumes", emoji: "💪", calories: 280, protein: 50, carbs: 12, fat: 6, ingredients: ["150g poulet cuit", "100g concombre", "100g tomates cerises"], instructions: ["Poulet précuit", "Légumes frais coupés"], mealPrep: "✅ Poulet grillé dimanche" },
    { id: "snack_jade_agg_2", name: "Thon nature + œuf dur + légumes", emoji: "🥫", calories: 275, protein: 49, carbs: 10, fat: 7, ingredients: ["120g thon au naturel", "2 œufs durs", "Concombre, radis"], instructions: ["Égoutter thon", "Œufs durs 10 min", "Légumes crus"], mealPrep: "✅ Œufs durs 5 jours" },
    { id: "snack_jade_agg_3", name: "Dinde froide + fromage blanc 0%", emoji: "🦃", calories: 282, protein: 51, carbs: 11, fat: 6, ingredients: ["130g dinde cuite", "100g fromage blanc 0%", "Crudités"], instructions: ["Dinde précuite froide", "Fromage blanc nature"], mealPrep: "✅ Dinde rôtie en avance" },
    { id: "snack_jade_agg_4", name: "Crevettes + avocat + légumes", emoji: "🦐", calories: 278, protein: 48, carbs: 13, fat: 8, ingredients: ["180g crevettes cuites", "30g avocat", "Salade verte"], instructions: ["Crevettes précuites", "Avocat en lamelles", "Citron"], mealPrep: "🔄 Crevettes surgelées pratiques" },
    { id: "snack_jade_agg_5", name: "Skyr nature + protéine whey", emoji: "🥛", calories: 277, protein: 52, carbs: 11, fat: 5, ingredients: ["150g skyr 0%", "25g whey neutre", "Cannelle"], instructions: ["Mélanger skyr et whey", "Cannelle"], mealPrep: "⚡ Instantané" },
    { id: "snack_jade_agg_6", name: "Saumon fumé + œuf + légumes", emoji: "🐟", calories: 283, protein: 49, carbs: 10, fat: 8, ingredients: ["80g saumon fumé", "2 œufs durs", "Concombre"], instructions: ["Œufs précuits", "Tranches saumon"], mealPrep: "✅ Pratique" },
    { id: "snack_jade_agg_7", name: "Cottage cheese + légumes croquants", emoji: "🧀", calories: 279, protein: 50, carbs: 12, fat: 6, ingredients: ["200g cottage cheese 0%", "Céleri", "Poivrons"], instructions: ["Cottage nature", "Légumes dips"], mealPrep: "⚡ Simple" },
    { id: "snack_jade_agg_8", name: "Blanc de dinde + yaourt grec", emoji: "🦃", calories: 281, protein: 51, carbs: 11, fat: 7, ingredients: ["120g blanc de dinde", "100g yaourt grec 0%"], instructions: ["Dinde tranchée", "Yaourt grec"], mealPrep: "✅ Tranche industrielle OK" },
    { id: "snack_jade_agg_9", name: "Œufs brouillés + jambon dégraissé", emoji: "🍳", calories: 276, protein: 48, carbs: 10, fat: 7, ingredients: ["3 œufs", "60g jambon blanc 0%", "Tomates"], instructions: ["Œufs brouillés sans beurre", "Jambon chauffé"], mealPrep: "⚡ 5 minutes" },
    { id: "snack_jade_agg_10", name: "Poulet tikka + concombre raita", emoji: "🌶️", calories: 280, protein: 50, carbs: 12, fat: 6, ingredients: ["150g poulet tikka", "100g yaourt 0%", "Concombre rapé"], instructions: ["Poulet réchauffé", "Raita fraîche"], mealPrep: "✅ Épicé changement" },
    { id: "snack_jade_agg_11", name: "Surimi + fromage blanc + crudités", emoji: "🦀", calories: 278, protein: 49, carbs: 13, fat: 6, ingredients: ["200g surimi", "80g fromage blanc 0%", "Crudités"], instructions: ["Surimi effiloché", "Sauce fromage blanc"], mealPrep: "⚡ Zéro cuisson" },
    { id: "snack_jade_agg_12", name: "Rôti de bœuf froid + légumes", emoji: "🥩", calories: 282, protein: 51, carbs: 11, fat: 7, ingredients: ["140g rôti de bœuf", "Salade", "Tomates", "Cornichons"], instructions: ["Tranches fines", "Assaisonnement léger"], mealPrep: "✅ Rôti dimanche" },
    { id: "snack_jade_agg_13", name: "Shake protéiné maison", emoji: "🥤", calories: 278, protein: 50, carbs: 12, fat: 6, ingredients: ["40g whey vanille", "250ml lait d'amande non sucré", "Cannelle", "Glaçons"], instructions: ["Mixer tous ingrédients", "Bien froid"], mealPrep: "⚡ 2 minutes chrono" },
    { id: "snack_jade_agg_14", name: "Carpaccio de bœuf + parmesan", emoji: "🥩", calories: 280, protein: 49, carbs: 11, fat: 8, ingredients: ["130g bœuf très fin", "15g parmesan", "Roquette", "Citron", "Huile d'olive (vaporisateur)"], instructions: ["Bœuf tranché finement", "Copeaux parmesan", "Citron + huile"], mealPrep: "🔄 Frais du jour" },
    { id: "snack_jade_agg_15", name: "Sardines au naturel + légumes", emoji: "🐟", calories: 279, protein: 51, carbs: 10, fat: 7, ingredients: ["120g sardines au naturel", "Concombre", "Tomates", "Citron"], instructions: ["Égoutter sardines", "Légumes frais"], mealPrep: "✅ Conserve pratique" },
    { id: "snack_jade_agg_16", name: "Omelette blanche protéinée", emoji: "🥚", calories: 277, protein: 50, carbs: 11, fat: 6, ingredients: ["200ml blancs d'œufs liquides", "50g fromage blanc", "Fines herbes", "Tomates cerises"], instructions: ["Battre blancs + fromage blanc", "Cuire poêle antiadhésive", "Herbes fraîches"], mealPrep: "⚡ 5 minutes" },
    { id: "snack_jade_agg_17", name: "Poulet froid pesto light", emoji: "🌿", calories: 281, protein: 52, carbs: 12, fat: 6, ingredients: ["150g poulet cuit", "1 c. à soupe pesto light", "Roquette", "Tomates"], instructions: ["Poulet + pesto mélangés", "Servir froid"], mealPrep: "✅ Pesto maison basilic + yaourt" },
    { id: "snack_jade_agg_18", name: "Crevettes cocktail light", emoji: "🍤", calories: 280, protein: 50, carbs: 13, fat: 6, ingredients: ["190g crevettes", "Sauce cocktail light (yaourt 0% + ketchup 0 sucre)", "Salade iceberg"], instructions: ["Sauce cocktail maison", "Mélanger crevettes"], mealPrep: "✅ Pratique" },
    { id: "snack_jade_agg_19", name: "Tartare de saumon + concombre", emoji: "🐟", calories: 282, protein: 49, carbs: 11, fat: 8, ingredients: ["140g saumon frais", "Concombre", "Ciboulette", "Citron", "Moutarde"], instructions: ["Saumon haché finement", "Assaisonnement light", "Concombre dés"], mealPrep: "🔄 Saumon très frais" },
    { id: "snack_jade_agg_20", name: "Blanc de poulet mariné citron herbes", emoji: "🍋", calories: 279, protein: 51, carbs: 12, fat: 6, ingredients: ["155g poulet", "Jus citron", "Thym", "Romarin", "Légumes verts"], instructions: ["Mariner poulet 2h", "Griller", "Servir froid"], mealPrep: "✅ Marinade veille" }
];

// Alternatives DÎNER - Phase Agressive - Jade (520 kcal, 70g P, 18g C, 22g L)
const dinnerAlternativesAggressiveJade = [
    { id: "dinner_jade_agg_1", name: "Saumon, légumes vapeur", emoji: "🐟", calories: 520, protein: 70, carbs: 18, fat: 22, phase: 1, ingredients: ["200g saumon", "250g courgettes", "150g épinards", "1 cs huile olive"], instructions: ["Air fryer 12 min 180°C", "Légumes sautés à l'huile"], mealPrep: "🔄 Varier poissons gras" },
    { id: "dinner_jade_agg_2", name: "Poulet rôti, légumes grillés", emoji: "🍗", calories: 515, protein: 72, carbs: 16, fat: 21, ingredients: ["220g cuisse de poulet sans peau", "200g brocoli", "150g poivrons", "Épices"], instructions: ["Four 200°C 30 min", "Légumes grillés même plaque"], mealPrep: "✅ Sheet pan meal prep" },
    { id: "dinner_jade_agg_3", name: "Cabillaud, fondue de poireaux", emoji: "🐠", calories: 518, protein: 69, carbs: 19, fat: 23, ingredients: ["220g cabillaud", "300g poireaux", "100g champignons", "1 cs huile olive"], instructions: ["Poêle poisson 4 min/côté", "Poireaux fondus 10 min"], mealPrep: "🔄 Poisson blanc au choix" },
    { id: "dinner_jade_agg_4", name: "Bœuf persillé, légumes asiatiques", emoji: "🥩", calories: 525, protein: 71, carbs: 17, fat: 23, ingredients: ["200g bœuf persillé", "200g pak choi", "100g champignons shiitake", "Sauce soja"], instructions: ["Wok haute température 3 min", "Légumes sautés rapidement"], mealPrep: "⚡ Cuisson rapide" },
    { id: "dinner_jade_agg_5", name: "Crevettes sautées, légumes croquants", emoji: "🦐", calories: 522, protein: 68, carbs: 20, fat: 22, ingredients: ["250g grosses crevettes", "200g courgettes", "100g poivrons", "Ail, gingembre"], instructions: ["Poêle crevettes 3-4 min", "Légumes al dente"], mealPrep: "⚡ Très rapide" },
    { id: "dinner_jade_agg_6", name: "Dorade entière, légumes méditerranéens", emoji: "🐟", calories: 517, protein: 70, carbs: 18, fat: 23, ingredients: ["250g dorade", "200g aubergine", "150g tomates", "Herbes de Provence"], instructions: ["Four papillote 20 min", "Légumes grillés"], mealPrep: "🔥 Cuisson four simple" },
    { id: "dinner_jade_agg_7", name: "Flétan grillé, asperges", emoji: "🐠", calories: 519, protein: 71, carbs: 17, fat: 22, ingredients: ["220g flétan", "300g asperges vertes", "Citron", "Huile olive"], instructions: ["Flétan poêle 5 min/côté", "Asperges vapeur 8 min"], mealPrep: "🔥 Poisson noble" },
    { id: "dinner_jade_agg_8", name: "Magret de canard, champignons", emoji: "🦆", calories: 523, protein: 69, carbs: 18, fat: 24, ingredients: ["180g magret sans peau", "250g champignons variés", "Épinards"], instructions: ["Magret poêle sans gras", "Champignons sautés"], mealPrep: "🔥 Saveur intense" },
    { id: "dinner_jade_agg_9", name: "Thon mi-cuit, salade tiède", emoji: "🐟", calories: 521, protein: 70, carbs: 19, fat: 23, ingredients: ["220g thon rouge", "200g haricots verts", "100g tomates", "Olives"], instructions: ["Thon saisir 1 min/côté", "Légumes tièdes"], mealPrep: "⚡ Cuisson minute" },
    { id: "dinner_jade_agg_10", name: "Poulet tandoori, légumes grillés", emoji: "🌶️", calories: 518, protein: 72, carbs: 17, fat: 21, ingredients: ["230g poulet mariné tandoori", "200g aubergine", "150g poivrons"], instructions: ["Four 200°C 25 min", "Légumes grillés"], mealPrep: "✅ Marinade la veille" },
    { id: "dinner_jade_agg_11", name: "Bar grillé, fenouil braisé", emoji: "🐠", calories: 516, protein: 70, carbs: 18, fat: 22, ingredients: ["230g bar", "250g fenouil", "Tomates cerises", "Pastis"], instructions: ["Bar grillé 8 min", "Fenouil braisé 15 min"], mealPrep: "🔥 Raffiné" },
    { id: "dinner_jade_agg_12", name: "Coquilles St-Jacques, épinards", emoji: "🦪", calories: 520, protein: 68, carbs: 20, fat: 23, ingredients: ["200g noix St-Jacques", "300g épinards frais", "Ail", "Huile olive"], instructions: ["St-Jacques poêle 2 min/côté", "Épinards sautés"], mealPrep: "⚡ 5 minutes chrono" },
    { id: "dinner_jade_agg_13", name: "Lotte à l'armoricaine", emoji: "🦞", calories: 522, protein: 71, carbs: 18, fat: 22, ingredients: ["230g lotte", "200g tomates", "Échalotes", "Cognac"], instructions: ["Lotte pochée 10 min", "Sauce tomate cognac"], mealPrep: "🔥 Gastronomique" },
    { id: "dinner_jade_agg_14", name: "Steak de thon, ratatouille", emoji: "🐟", calories: 519, protein: 70, carbs: 19, fat: 22, ingredients: ["220g thon albacore", "250g ratatouille maison"], instructions: ["Thon saisir 3 min", "Ratatouille réchauffée"], mealPrep: "✅ Ratatouille 5 jours" },
    { id: "dinner_jade_agg_15", name: "Turbot vapeur, légumes verts", emoji: "🐠", calories: 517, protein: 71, carbs: 17, fat: 23, ingredients: ["230g turbot", "200g haricots verts", "150g courgettes", "Beurre noisette"], instructions: ["Turbot vapeur 12 min", "Légumes al dente"], mealPrep: "🔥 Poisson d'exception" },
    { id: "dinner_jade_agg_16", name: "Homard grillé, légumes", emoji: "🦞", calories: 524, protein: 69, carbs: 18, fat: 24, ingredients: ["250g queue homard", "200g asperges", "Beurre citronné"], instructions: ["Homard gril 8 min", "Asperges vapeur"], mealPrep: "🔥 Festif" },
    { id: "dinner_jade_agg_17", name: "Espadon grillé, légumes du soleil", emoji: "🐟", calories: 521, protein: 70, carbs: 19, fat: 22, ingredients: ["220g espadon", "200g aubergine", "100g tomates", "Basilic"], instructions: ["Espadon plancha 4 min/côté", "Légumes grillés"], mealPrep: "🔥 Saveur méditerranéenne" },
    { id: "dinner_jade_agg_18", name: "Rouget barbet, tapenade, légumes", emoji: "🐠", calories: 518, protein: 68, carbs: 20, fat: 23, ingredients: ["240g rougets", "1 cs tapenade", "250g légumes grillés"], instructions: ["Rougets four 10 min", "Tapenade sur le dessus"], mealPrep: "🔥 Provençal" },
    { id: "dinner_jade_agg_19", name: "Langouste grillée", emoji: "🦞", calories: 523, protein: 70, carbs: 18, fat: 23, ingredients: ["280g langouste", "200g fenouil", "Agrumes"], instructions: ["Langouste gril 10 min", "Fenouil cru mariné"], mealPrep: "🔥 Luxe simple" },
    { id: "dinner_jade_agg_20", name: "Loup de mer, légumes vapeur", emoji: "🐟", calories: 516, protein: 71, carbs: 17, fat: 22, ingredients: ["240g loup", "250g courgettes", "150g épinards"], instructions: ["Loup sel/four 15 min", "Légumes vapeur"], mealPrep: "✅ Four simple" },
    { id: "dinner_jade_agg_21", name: "Bœuf tataki, légumes asiatiques", emoji: "🥩", calories: 520, protein: 70, carbs: 18, fat: 23, ingredients: ["210g bœuf filet", "200g bok choy", "100g champignons enoki", "Sauce soja", "Sésame"], instructions: ["Bœuf saisir 30 sec chaque côté", "Légumes wok 2 min", "Sésame grillé"], mealPrep: "⚡ Ultra rapide" },
    { id: "dinner_jade_agg_22", name: "Saumon gravlax maison, salade nordique", emoji: "🐟", calories: 519, protein: 69, carbs: 19, fat: 22, ingredients: ["190g saumon gravlax", "200g concombre", "100g radis", "Aneth", "Crème 0%"], instructions: ["Gravlax préparé 48h avant", "Salade croquante", "Sauce aneth"], mealPrep: "✅ Gravlax 1 semaine" },
    { id: "dinner_jade_agg_23", name: "Poulet sauce moutarde, légumes verts", emoji: "🍗", calories: 522, protein: 71, carbs: 18, fat: 22, ingredients: ["230g blanc poulet", "2 cs moutarde", "100ml crème 0%", "250g haricots verts", "100g épinards"], instructions: ["Poulet poêlé", "Sauce moutarde-crème", "Légumes vapeur"], mealPrep: "✅ Simple et rapide" },
    { id: "dinner_jade_agg_24", name: "Cabillaud au curry light, chou-fleur", emoji: "🐠", calories: 518, protein: 70, carbs: 19, fat: 21, ingredients: ["230g cabillaud", "250g chou-fleur", "Lait de coco light", "Curry", "Épinards"], instructions: ["Cabillaud cuit curry 10 min", "Chou-fleur riz", "Sauce coco"], mealPrep: "🔥 Exotique" },
    { id: "dinner_jade_agg_25", name: "Tartare de bœuf assaisonné", emoji: "🥩", calories: 521, protein: 69, carbs: 18, fat: 23, ingredients: ["200g bœuf haché très frais", "Cornichons", "Câpres", "Oignons", "Jaune d'œuf", "Salade"], instructions: ["Mélanger tous ingrédients", "Assaisonner", "Servir frais"], mealPrep: "🔄 Bœuf jour même" },
    { id: "dinner_jade_agg_26", name: "Poulet basquaise light", emoji: "🌶️", calories: 524, protein: 72, carbs: 18, fat: 22, ingredients: ["230g poulet", "200g poivrons rouges", "100g tomates", "Piment d'Espelette", "Oignons"], instructions: ["Poulet mijoté 20 min", "Sauce tomate-poivrons"], mealPrep: "✅ Batch cooking 4 jours" },
    { id: "dinner_jade_agg_27", name: "Gambas à l'ail, légumes grillés", emoji: "🦐", calories: 517, protein: 68, carbs: 20, fat: 22, ingredients: ["260g gambas", "4 gousses ail", "200g courgettes", "150g aubergine", "Persil"], instructions: ["Gambas poêlées 3 min", "Ail émincé", "Légumes grillés"], mealPrep: "⚡ 10 minutes" },
    { id: "dinner_jade_agg_28", name: "Filet mignon porc, purée chou-fleur", emoji: "🥩", calories: 520, protein: 70, carbs: 17, fat: 23, ingredients: ["200g filet mignon porc", "300g chou-fleur", "Fromage blanc", "Muscade"], instructions: ["Filet mignon four 15 min", "Purée chou-fleur onctueuse"], mealPrep: "✅ Purée batch" },
    { id: "dinner_jade_agg_29", name: "Sole meunière light, épinards", emoji: "🐠", calories: 519, protein: 71, carbs: 18, fat: 22, ingredients: ["250g sole", "Citron", "Persil", "300g épinards frais"], instructions: ["Sole poêle 3 min/côté", "Jus citron", "Épinards sautés ail"], mealPrep: "⚡ Rapide et léger" },
    { id: "dinner_jade_agg_30", name: "Bœuf stroganoff light, légumes", emoji: "🥩", calories: 523, protein: 69, carbs: 19, fat: 23, ingredients: ["200g bœuf émincé", "200g champignons", "Crème 0%", "Moutarde", "Légumes verts"], instructions: ["Bœuf sauté 2 min", "Champignons", "Sauce crème-moutarde"], mealPrep: "✅ Sauce en avance" }
];

// Alternatives DÉJEUNER - Phase Agressive - Élodie (620 kcal, 58g P, 58g C, 16g L)
const lunchAlternativesAggressiveElodie = [
    { id: "lunch_elodie_agg_1", name: "Poulet, quinoa, légumes", emoji: "🍗", calories: 620, protein: 58, carbs: 58, fat: 16, ingredients: ["180g poulet", "100g quinoa cuit", "150g brocoli", "100g carottes"], instructions: ["Griller poulet", "Quinoa 15 min", "Légumes vapeur"], mealPrep: "✅ Batch cooking 3 portions" },
    { id: "lunch_elodie_agg_2", name: "Dinde, riz basmati, légumes", emoji: "🦃", calories: 615, protein: 59, carbs: 57, fat: 15, ingredients: ["170g dinde", "100g riz basmati", "200g courgettes", "80g poivrons"], instructions: ["Dinde grillée 4 min/côté", "Riz 12 min", "Légumes poêle"], mealPrep: "✅ Dinde et riz en avance" },
    { id: "lunch_elodie_agg_3", name: "Saumon, patate douce, légumes", emoji: "🐟", calories: 618, protein: 57, carbs: 59, fat: 17, ingredients: ["150g saumon", "140g patate douce", "150g haricots verts", "80g tomates"], instructions: ["Saumon poêle 4 min/côté", "Patate four 25 min", "Légumes vapeur"], mealPrep: "✅ Patates douces cuites" },
    { id: "lunch_elodie_agg_4", name: "Bœuf maigre, riz complet, légumes", emoji: "🥩", calories: 622, protein: 60, carbs: 56, fat: 16, ingredients: ["170g bœuf haché 5%", "95g riz complet", "200g brocoli", "100g carottes"], instructions: ["Bœuf haché revenu", "Riz complet 25 min", "Légumes vapeur"], mealPrep: "✅ Riz complet pour la semaine" },
    { id: "lunch_elodie_agg_5", name: "Thon frais, quinoa, ratatouille", emoji: "🐟", calories: 617, protein: 58, carbs: 58, fat: 16, ingredients: ["160g thon", "100g quinoa", "200g ratatouille"], instructions: ["Thon saisir 2 min/côté", "Quinoa 15 min"], mealPrep: "✅ Ratatouille 5 jours" },
    { id: "lunch_elodie_agg_6", name: "Crevettes, riz thaï, légumes", emoji: "🦐", calories: 619, protein: 57, carbs: 59, fat: 16, ingredients: ["200g crevettes", "105g riz jasmin", "200g pak choi"], instructions: ["Crevettes wok 3 min", "Riz 12 min"], mealPrep: "⚡ Rapide" },
    { id: "lunch_elodie_agg_7", name: "Blanc de poulet, pâtes complètes", emoji: "🍝", calories: 621, protein: 59, carbs: 57, fat: 16, ingredients: ["185g poulet", "75g pâtes crues", "150g tomates", "Basilic"], instructions: ["Poulet grillé", "Pâtes al dente"], mealPrep: "✅ Classique efficace" },
    { id: "lunch_elodie_agg_8", name: "Cabillaud, pomme de terre, légumes", emoji: "🐠", calories: 618, protein: 58, carbs: 58, fat: 15, ingredients: ["180g cabillaud", "160g pommes de terre", "180g haricots verts"], instructions: ["Cabillaud vapeur", "Pommes vapeur"], mealPrep: "✅ Tout vapeur" },
    { id: "lunch_elodie_agg_9", name: "Dinde hachée, semoule, légumes", emoji: "🌾", calories: 616, protein: 60, carbs: 56, fat: 15, ingredients: ["175g dinde hachée", "95g semoule", "200g légumes"], instructions: ["Dinde aux épices", "Semoule 5 min"], mealPrep: "⚡ 10 minutes" },
    { id: "lunch_elodie_agg_10", name: "Merlu, riz complet, courgettes", emoji: "🐟", calories: 620, protein: 57, carbs: 59, fat: 16, ingredients: ["175g merlu", "100g riz complet", "200g courgettes"], instructions: ["Merlu four 12 min", "Riz 25 min"], mealPrep: "✅ Simple" },
    { id: "lunch_elodie_agg_11", name: "Poulet curry, riz basmati", emoji: "🌶️", calories: 619, protein: 58, carbs: 58, fat: 16, ingredients: ["180g poulet", "100g riz", "Lait coco léger", "Curry"], instructions: ["Poulet curry 15 min", "Riz 12 min"], mealPrep: "✅ Batch 3 jours" },
    { id: "lunch_elodie_agg_12", name: "Saumon fumé, quinoa bowl", emoji: "🥗", calories: 617, protein: 57, carbs: 59, fat: 17, ingredients: ["120g saumon fumé", "100g quinoa", "Avocat 30g", "Légumes"], instructions: ["Bowl froid assemblé"], mealPrep: "⚡ Zéro cuisson" },
    { id: "lunch_elodie_agg_13", name: "Poulet tandoori, riz basmati", emoji: "🌶️", calories: 618, protein: 59, carbs: 57, fat: 16, ingredients: ["180g poulet mariné tandoori", "100g riz basmati", "Yaourt 0%", "Épinards"], instructions: ["Mariner 30min", "Four 25min", "Riz"], mealPrep: "✅ Marinade veille" },
    { id: "lunch_elodie_agg_14", name: "Thon albacore, pâtes complètes", emoji: "🐟", calories: 620, protein: 58, carbs: 58, fat: 16, ingredients: ["165g thon albacore", "75g pâtes complètes", "200g tomates cerises", "Basilic"], instructions: ["Thon saisir 2min/côté", "Pâtes al dente", "Tomates rôties"], mealPrep: "⚡ Rapide" },
    { id: "lunch_elodie_agg_15", name: "Dinde sauce champignons, boulgour", emoji: "🦃", calories: 619, protein: 60, carbs: 56, fat: 15, ingredients: ["180g escalope dinde", "95g boulgour", "150g champignons", "Crème 0%"], instructions: ["Dinde poêlée", "Sauce champignons", "Boulgour 10min"], mealPrep: "✅ Sauce batch" },
    { id: "lunch_elodie_agg_16", name: "Bar grillé, riz sauvage, légumes", emoji: "🐠", calories: 621, protein: 57, carbs: 59, fat: 16, ingredients: ["170g bar", "85g riz sauvage", "200g légumes"], instructions: ["Bar gril 8min/côté", "Riz sauvage 40min"], mealPrep: "✅ Riz batch semaine" },
    { id: "lunch_elodie_agg_17", name: "Bœuf stroganoff light, quinoa", emoji: "🥩", calories: 622, protein: 59, carbs: 58, fat: 16, ingredients: ["165g bœuf émincé", "100g quinoa", "Champignons", "Crème 0%", "Moutarde"], instructions: ["Bœuf sauté 2min", "Sauce crème-moutarde", "Quinoa"], mealPrep: "✅ Simple" },
    { id: "lunch_elodie_agg_18", name: "Poulet citron, riz jasmin, brocoli", emoji: "🍋", calories: 617, protein: 58, carbs: 57, fat: 16, ingredients: ["180g poulet", "100g riz jasmin", "200g brocoli", "Citron", "Thym"], instructions: ["Poulet mariné citron", "Riz", "Brocoli vapeur"], mealPrep: "✅ Marinade 1h" },
    { id: "lunch_elodie_agg_19", name: "Gambas, riz complet, légumes", emoji: "🦐", calories: 618, protein: 57, carbs: 59, fat: 16, ingredients: ["210g gambas", "95g riz complet", "200g courgettes", "Ail"], instructions: ["Gambas poêlées 3min", "Riz 25min", "Courgettes"], mealPrep: "⚡ 10min cuisson gambas" },
    { id: "lunch_elodie_agg_20", name: "Veau, polenta, ratatouille", emoji: "🥘", calories: 620, protein: 58, carbs: 58, fat: 16, ingredients: ["175g veau", "85g polenta", "200g ratatouille"], instructions: ["Veau poêle 4min/côté", "Polenta crémeuse", "Ratatouille"], mealPrep: "✅ Ratatouille + polenta batch" },
    { id: "lunch_elodie_agg_21", name: "Cabillaud au curry, chou-fleur riz", emoji: "🐠", calories: 619, protein: 59, carbs: 57, fat: 15, ingredients: ["185g cabillaud", "200g chou-fleur", "Lait coco light", "Curry"], instructions: ["Cabillaud curry 10min", "Chou-fleur riz"], mealPrep: "🔥 Exotique" },
    { id: "lunch_elodie_agg_22", name: "Poulet basquaise, semoule", emoji: "🌶️", calories: 621, protein: 60, carbs: 56, fat: 16, ingredients: ["180g poulet", "95g semoule", "200g poivrons", "Tomates"], instructions: ["Poulet mijoté 20min", "Semoule 5min"], mealPrep: "✅ Batch 4 jours" },
    { id: "lunch_elodie_agg_23", name: "Saumon teriyaki, nouilles soba", emoji: "🍜", calories: 618, protein: 57, carbs: 58, fat: 17, ingredients: ["160g saumon", "90g nouilles soba", "Sauce teriyaki light", "Edamame"], instructions: ["Saumon mariné", "Air fryer 12min", "Nouilles 5min"], mealPrep: "✅ Marinade veille" },
    { id: "lunch_elodie_agg_24", name: "Dinde hachée bolognaise, pâtes", emoji: "🍝", calories: 620, protein: 59, carbs: 57, fat: 16, ingredients: ["180g dinde hachée", "75g pâtes", "200g sauce tomate", "Herbes"], instructions: ["Bolognaise 15min", "Pâtes al dente"], mealPrep: "✅ Bolognaise 5 jours" },
    { id: "lunch_elodie_agg_25", name: "Lotte à l'armoricaine, riz", emoji: "🦞", calories: 619, protein: 58, carbs: 58, fat: 16, ingredients: ["180g lotte", "100g riz basmati", "Tomates", "Cognac", "Échalotes"], instructions: ["Lotte pochée 10min", "Sauce tomate"], mealPrep: "🔥 Gastronomique" }
];

// Alternatives COLLATION - Phase Agressive - Élodie (240 kcal, 28g P, 8g C, 12g L)
const snackAlternativesAggressiveElodie = [
    { id: "snack_elodie_agg_1", name: "Œufs durs + légumes", emoji: "🥚", calories: 240, protein: 28, carbs: 8, fat: 12, ingredients: ["3 œufs durs", "100g concombre", "Tomates cerises"], instructions: ["Œufs 10 min", "Légumes crus"], mealPrep: "✅ 12 œufs durs dimanche" },
    { id: "snack_elodie_agg_2", name: "Fromage blanc 0% + amandes", emoji: "🥛", calories: 238, protein: 29, carbs: 9, fat: 11, ingredients: ["150g fromage blanc 0%", "15g amandes", "Cannelle"], instructions: ["Mélanger", "Parsemer amandes"], mealPrep: "⚡ Très rapide" },
    { id: "snack_elodie_agg_3", name: "Thon + avocat + crudités", emoji: "🥫", calories: 242, protein: 27, carbs: 7, fat: 13, ingredients: ["100g thon naturel", "40g avocat", "Concombre, radis"], instructions: ["Égoutter thon", "Avocat écrasé", "Crudités"], mealPrep: "⚡ Rapide" },
    { id: "snack_elodie_agg_4", name: "Poulet + yaourt grec 0%", emoji: "🍗", calories: 244, protein: 30, carbs: 8, fat: 11, ingredients: ["100g poulet cuit", "100g yaourt grec 0%", "Légumes"], instructions: ["Poulet précuit", "Yaourt grec"], mealPrep: "✅ Poulet meal prep" },
    { id: "snack_elodie_agg_5", name: "Saumon fumé + cottage cheese", emoji: "🐟", calories: 239, protein: 29, carbs: 8, fat: 12, ingredients: ["60g saumon fumé", "100g cottage 0%", "Concombre"], instructions: ["Assemblage simple"], mealPrep: "⚡ Zéro cuisson" },
    { id: "snack_elodie_agg_6", name: "Dinde + noix", emoji: "🦃", calories: 241, protein: 28, carbs: 7, fat: 13, ingredients: ["100g dinde", "12g noix", "Crudités"], instructions: ["Dinde froide", "Noix concassées"], mealPrep: "✅ Simple" },
    { id: "snack_elodie_agg_7", name: "Crevettes + guacamole light", emoji: "🦐", calories: 243, protein: 27, carbs: 9, fat: 12, ingredients: ["140g crevettes", "40g avocat", "Citron"], instructions: ["Guacamole maison", "Crevettes"], mealPrep: "⚡ 5 min" },
    { id: "snack_elodie_agg_8", name: "Skyr + graines", emoji: "🥛", calories: 240, protein: 30, carbs: 8, fat: 11, ingredients: ["150g skyr 0%", "12g graines courge"], instructions: ["Mélanger"], mealPrep: "⚡ Instantané" },
    { id: "snack_elodie_agg_9", name: "Blanc de poulet + concombre", emoji: "🥒", calories: 242, protein: 29, carbs: 8, fat: 12, ingredients: ["110g poulet cuit", "150g concombre", "Fromage blanc 50g"], instructions: ["Poulet froid", "Sauce fromage blanc"], mealPrep: "✅ Poulet précuit" },
    { id: "snack_elodie_agg_10", name: "Œufs brouillés + jambon", emoji: "🍳", calories: 239, protein: 28, carbs: 7, fat: 12, ingredients: ["2 œufs", "50g jambon 0%", "Tomates cerises"], instructions: ["Œufs brouillés sans beurre", "Jambon"], mealPrep: "⚡ 5 minutes" },
    { id: "snack_elodie_agg_11", name: "Carpaccio de bœuf + parmesan", emoji: "🥩", calories: 241, protein: 27, carbs: 8, fat: 13, ingredients: ["100g bœuf tranché fin", "12g parmesan", "Roquette", "Citron"], instructions: ["Bœuf très fin", "Copeaux parmesan"], mealPrep: "🔄 Frais du jour" },
    { id: "snack_elodie_agg_12", name: "Surimi + guacamole", emoji: "🦀", calories: 243, protein: 28, carbs: 9, fat: 12, ingredients: ["150g surimi", "40g avocat", "Citron", "Coriandre"], instructions: ["Surimi effiloché", "Guacamole maison"], mealPrep: "⚡ 3 minutes" },
    { id: "snack_elodie_agg_13", name: "Shake protéiné vanille", emoji: "🥤", calories: 240, protein: 30, carbs: 8, fat: 11, ingredients: ["35g whey vanille", "200ml lait d'amande", "5g amandes", "Cannelle"], instructions: ["Mixer tous ingrédients"], mealPrep: "⚡ 1 minute" },
    { id: "snack_elodie_agg_14", name: "Rôti de dinde + crudités", emoji: "🦃", calories: 238, protein: 29, carbs: 7, fat: 12, ingredients: ["110g rôti dinde", "Radis", "Céleri", "Concombre"], instructions: ["Dinde tranchée fine", "Crudités"], mealPrep: "✅ Rôti dimanche" },
    { id: "snack_elodie_agg_15", name: "Sardines + légumes", emoji: "🐟", calories: 241, protein: 28, carbs: 8, fat: 13, ingredients: ["90g sardines au naturel", "Tomates", "Concombre", "Citron"], instructions: ["Égoutter sardines", "Légumes frais"], mealPrep: "✅ Conserve pratique" },
    { id: "snack_elodie_agg_16", name: "Omelette blanche aux herbes", emoji: "🥚", calories: 239, protein: 27, carbs: 9, fat: 12, ingredients: ["150ml blancs d'œufs", "40g fromage blanc", "Fines herbes", "Tomates"], instructions: ["Omelette poêle antiadhésive"], mealPrep: "⚡ 5 minutes" },
    { id: "snack_elodie_agg_17", name: "Poulet pesto light", emoji: "🌿", calories: 242, protein: 29, carbs: 8, fat: 12, ingredients: ["110g poulet", "1 cs pesto light", "Salade verte"], instructions: ["Poulet + pesto mélangés"], mealPrep: "✅ Pesto maison" },
    { id: "snack_elodie_agg_18", name: "Crevettes cocktail", emoji: "🍤", calories: 240, protein: 28, carbs: 9, fat: 11, ingredients: ["140g crevettes", "Sauce cocktail light", "Salade"], instructions: ["Sauce yaourt + ketchup 0 sucre"], mealPrep: "✅ Pratique" },
    { id: "snack_elodie_agg_19", name: "Tartare de saumon", emoji: "🐟", calories: 243, protein: 27, carbs: 8, fat: 13, ingredients: ["100g saumon frais", "Concombre", "Ciboulette", "Citron"], instructions: ["Saumon haché finement", "Assaisonnement"], mealPrep: "🔄 Saumon très frais" },
    { id: "snack_elodie_agg_20", name: "Poulet mariné citron herbes", emoji: "🍋", calories: 241, protein: 28, carbs: 8, fat: 12, ingredients: ["115g poulet", "Citron", "Thym", "Romarin"], instructions: ["Mariner 2h", "Griller", "Froid"], mealPrep: "✅ Marinade veille" }
];

// Alternatives DÎNER - Phase Agressive - Élodie (440 kcal, 55g P, 15g C, 18g L)
const dinnerAlternativesAggressiveElodie = [,
    { id: "dinner_elodie_agg_13", name: "Sole meunière, épinards", emoji: "🐠", calories: 442, protein: 54, carbs: 16, fat: 19, ingredients: ["190g sole", "250g épinards", "Citron", "Persil"], instructions: ["Sole poêle 3min/côté", "Épinards sautés ail"], mealPrep: "⚡ Rapide léger" },
    { id: "dinner_elodie_agg_14", name: "Bœuf tataki, légumes asiatiques", emoji: "🥩", calories: 441, protein: 55, carbs: 15, fat: 19, ingredients: ["155g bœuf filet", "200g bok choy", "Champignons", "Sauce soja"], instructions: ["Bœuf saisir 30 sec/côté", "Légumes wok"], mealPrep: "⚡ Ultra rapide" },
    { id: "dinner_elodie_agg_15", name: "Saumon gravlax, salade nordique", emoji: "🐟", calories: 439, protein: 54, carbs: 16, fat: 18, ingredients: ["140g saumon gravlax", "Concombre", "Aneth", "Crème 0%"], instructions: ["Gravlax préparé 48h avant"], mealPrep: "✅ Gravlax 1 semaine" },
    { id: "dinner_elodie_agg_16", name: "Poulet sauce moutarde, haricots", emoji: "🍗", calories: 443, protein: 55, carbs: 15, fat: 19, ingredients: ["170g poulet", "Moutarde", "Crème 0%", "250g haricots verts"], instructions: ["Poulet poêlé", "Sauce moutarde"], mealPrep: "✅ Simple rapide" },
    { id: "dinner_elodie_agg_17", name: "Gambas à l'ail, légumes", emoji: "🦐", calories: 440, protein: 54, carbs: 16, fat: 18, ingredients: ["195g gambas", "Ail", "200g courgettes", "Aubergine"], instructions: ["Gambas poêlées 3min", "Légumes grillés"], mealPrep: "⚡ 10 minutes" },
    { id: "dinner_elodie_agg_18", name: "Filet mignon porc, purée chou-fleur", emoji: "🥩", calories: 442, protein: 55, carbs: 15, fat: 19, ingredients: ["150g filet mignon", "250g chou-fleur", "Fromage blanc"], instructions: ["Filet four 15min", "Purée onctueuse"], mealPrep: "✅ Purée batch" },
    { id: "dinner_elodie_agg_19", name: "Loup de mer sel, légumes", emoji: "🐟", calories: 441, protein: 54, carbs: 16, fat: 19, ingredients: ["180g loup", "250g légumes vapeur", "Sel", "Citron"], instructions: ["Loup en croûte sel four 15min"], mealPrep: "✅ Four simple" },
    { id: "dinner_elodie_agg_20", name: "Blanc de dinde grillé, ratatouille", emoji: "🦃", calories: 439, protein: 55, carbs: 15, fat: 18, ingredients: ["175g dinde", "250g ratatouille maison"], instructions: ["Dinde grillée herbes", "Ratatouille"], mealPrep: "✅ Ratatouille semaine" },
    { id: "dinner_elodie_agg_21", name: "Turbot vapeur, asperges", emoji: "🐠", calories: 443, protein: 54, carbs: 16, fat: 20, ingredients: ["170g turbot", "250g asperges", "Beurre noisette light"], instructions: ["Turbot vapeur 12min", "Asperges"], mealPrep: "🔥 Poisson noble" },
    { id: "dinner_elodie_agg_22", name: "Poulet basquaise light", emoji: "🌶️", calories: 440, protein: 55, carbs: 15, fat: 18, ingredients: ["175g poulet", "200g poivrons", "Tomates", "Piment Espelette"], instructions: ["Poulet mijoté 20min"], mealPrep: "✅ Batch 4 jours" },
    { id: "dinner_elodie_agg_23", name: "Rouget barbet, tapenade", emoji: "🐠", calories: 442, protein: 54, carbs: 16, fat: 19, ingredients: ["180g rougets", "1 cs tapenade", "200g légumes"], instructions: ["Rougets four 10min"], mealPrep: "🔥 Provençal" },
    { id: "dinner_elodie_agg_24", name: "Coquilles St-Jacques poêlées", emoji: "🦪", calories: 441, protein: 55, carbs: 15, fat: 19, ingredients: ["150g St-Jacques", "250g épinards", "Ail"], instructions: ["St-Jacques 2min/côté"], mealPrep: "⚡ 5 minutes" },
    { id: "dinner_elodie_agg_25", name: "Cabillaud au curry, légumes", emoji: "🐠", calories: 439, protein: 54, carbs: 16, fat: 18, ingredients: ["180g cabillaud", "Curry", "Lait coco light", "200g légumes"], instructions: ["Cabillaud curry 10min"], mealPrep: "🔥 Exotique" }
];

// ========================================
// RECETTES PHASE 2 (NORMALE) - SEMAINES 5-31
// ========================================

// JADE PHASE 2: 2100 kcal (180g P, 180g C, 70g L)
// Petit-déj: 550 kcal | Déjeuner: 800 kcal | Collation: 300 kcal | Dîner: 450 kcal

// Alternatives PETIT-DÉJEUNER - Phase Normale - Jade (550 kcal, 45g P, 60g C, 18g L)
const breakfastAlternativesNormalJade = [
    { id: "breakfast_jade_norm_1", name: "Pancakes protéinés, fruits, miel", emoji: "🥞", calories: 550, protein: 45, carbs: 60, fat: 18, ingredients: ["80g flocons avoine", "3 blancs œuf + 1 œuf", "150g fruits rouges", "1 cs miel", "20g whey"], instructions: ["Mixer avoine/œufs/whey", "Cuire pancakes", "Fruits frais + miel"], mealPrep: "⚡ 10 minutes" },
    { id: "breakfast_jade_norm_2", name: "Yaourt grec, granola, banane", emoji: "🥣", calories: 548, protein: 46, carbs: 58, fat: 19, ingredients: ["200g yaourt grec 0%", "60g granola", "1 banane", "25g whey"], instructions: ["Mélanger yaourt + whey", "Ajouter granola + banane"], mealPrep: "⚡ 2 minutes" },
    { id: "breakfast_jade_norm_3", name: "Omelette, pain complet, fruits", emoji: "🍳", calories: 552, protein: 44, carbs: 61, fat: 18, ingredients: ["3 œufs", "80g pain complet", "150g pomme", "10g beurre cacahuète"], instructions: ["Omelette légère", "Pain toasté + beurre cacahuète", "Pomme"], mealPrep: "⚡ 8 minutes" },
    { id: "breakfast_jade_norm_4", name: "Porridge protéiné, fruits secs", emoji: "🥣", calories: 549, protein: 45, carbs: 59, fat: 19, ingredients: ["80g flocons avoine", "25g whey", "200ml lait écrémé", "30g raisins secs", "15g amandes"], instructions: ["Cuire avoine + lait", "Ajouter whey hors feu", "Raisins + amandes"], mealPrep: "⚡ 5 minutes" },
    { id: "breakfast_jade_norm_5", name: "Smoothie bowl protéiné", emoji: "🍌", calories: 551, protein: 46, carbs: 60, fat: 18, ingredients: ["1 banane", "150g fruits rouges", "30g whey", "200ml lait écrémé", "40g granola", "10g graines chia"], instructions: ["Mixer banane + fruits + whey + lait", "Topping granola + chia"], mealPrep: "⚡ 5 minutes" },
    { id: "breakfast_jade_norm_6", name: "Toast avocat, œufs, fruits", emoji: "🥑", calories: 550, protein: 44, carbs: 59, fat: 19, ingredients: ["80g pain complet", "60g avocat", "2 œufs", "1 orange"], instructions: ["Pain toasté", "Avocat écrasé", "Œufs pochés", "Orange"], mealPrep: "⚡ 10 minutes" }
];

// Alternatives DÉJEUNER - Phase Normale - Jade (800 kcal, 60g P, 85g C, 20g L)
const lunchAlternativesNormalJade = [
    { id: "lunch_jade_norm_1", name: "Poulet, riz, légumes, fruits", emoji: "🍗", calories: 800, protein: 60, carbs: 85, fat: 20, ingredients: ["200g poulet", "150g riz basmati", "200g légumes", "1 pomme"], instructions: ["Poulet grillé", "Riz", "Légumes vapeur", "Pomme dessert"], mealPrep: "✅ Batch 3 jours" },
    { id: "lunch_jade_norm_2", name: "Saumon, quinoa, légumes, mangue", emoji: "🐟", calories: 798, protein: 59, carbs: 86, fat: 21, ingredients: ["180g saumon", "140g quinoa", "200g brocoli", "150g mangue"], instructions: ["Saumon poêle", "Quinoa", "Brocoli vapeur", "Mangue fraîche"], mealPrep: "✅ Pratique" },
    { id: "lunch_jade_norm_3", name: "Bœuf, patates douces, salade, fruits", emoji: "🥩", calories: 802, protein: 61, carbs: 84, fat: 20, ingredients: ["200g bœuf maigre", "250g patate douce", "Salade", "150g raisin"], instructions: ["Bœuf grillé", "Patate four", "Salade verte", "Raisin"], mealPrep: "✅ Patates au four" },
    { id: "lunch_jade_norm_4", name: "Dinde, pâtes complètes, légumes, kiwi", emoji: "🍝", calories: 799, protein: 60, carbs: 85, fat: 19, ingredients: ["200g dinde", "120g pâtes crues", "200g tomates", "2 kiwis"], instructions: ["Dinde poêle", "Pâtes al dente", "Sauce tomate", "Kiwis"], mealPrep: "✅ Simple" },
    { id: "lunch_jade_norm_5", name: "Thon frais, riz complet, légumes, ananas", emoji: "🐟", calories: 801, protein: 59, carbs: 86, fat: 20, ingredients: ["190g thon", "145g riz complet", "200g légumes", "120g ananas"], instructions: ["Thon mi-cuit", "Riz complet", "Légumes sautés", "Ananas frais"], mealPrep: "✅ Riz pour plusieurs jours" },
    { id: "lunch_jade_norm_6", name: "Poulet curry, riz basmati, salade fruits", emoji: "🌶️", calories: 803, protein: 60, carbs: 84, fat: 21, ingredients: ["200g poulet", "140g riz", "Curry, lait coco léger", "Salade fruits 150g"], instructions: ["Poulet curry 15 min", "Riz basmati", "Salade fruits variés"], mealPrep: "✅ Batch 3 jours" },
    { id: "lunch_jade_norm_7", name: "Crevettes, nouilles soba, légumes, litchis", emoji: "🦐", calories: 797, protein: 61, carbs: 85, fat: 19, ingredients: ["250g crevettes", "120g nouilles soba", "200g légumes wok", "100g litchis"], instructions: ["Crevettes wok 3 min", "Nouilles soba", "Légumes croquants", "Litchis dessert"], mealPrep: "⚡ Rapide" },
    { id: "lunch_jade_norm_8", name: "Veau, couscous, légumes, dattes", emoji: "🥘", calories: 800, protein: 60, carbs: 86, fat: 20, ingredients: ["200g veau", "130g couscous", "200g légumes", "40g dattes"], instructions: ["Veau poêle", "Couscous 5 min", "Légumes grillés", "Dattes"], mealPrep: "⚡ Très rapide" },
    { id: "lunch_jade_norm_9", name: "Poulet teriyaki, riz, edamame, mandarine", emoji: "🍱", calories: 802, protein: 61, carbs: 84, fat: 21, ingredients: ["200g poulet", "140g riz", "100g edamame", "Sauce teriyaki légère", "2 mandarines"], instructions: ["Poulet mariné teriyaki", "Griller 8 min/côté", "Riz", "Edamame vapeur", "Mandarines"], mealPrep: "✅ Marinade veille" },
    { id: "lunch_jade_norm_10", name: "Saumon, pâtes complètes, asperges, fraises", emoji: "🍝", calories: 799, protein: 60, carbs: 85, fat: 20, ingredients: ["180g saumon", "110g pâtes complètes", "200g asperges", "150g fraises"], instructions: ["Saumon poêle", "Pâtes al dente", "Asperges vapeur", "Fraises fraîches"], mealPrep: "✅ Simple" },
    { id: "lunch_jade_norm_11", name: "Bœuf sauté, nouilles udon, légumes, poire", emoji: "🍜", calories: 801, protein: 59, carbs: 86, fat: 20, ingredients: ["200g bœuf", "130g nouilles udon", "200g légumes wok", "1 poire"], instructions: ["Bœuf émincé sauté 3 min", "Nouilles udon", "Wok légumes", "Poire"], mealPrep: "⚡ Rapide" },
    { id: "lunch_jade_norm_12", name: "Dinde, boulgour, légumes grillés, abricots", emoji: "🦃", calories: 798, protein: 60, carbs: 84, fat: 19, ingredients: ["200g dinde", "120g boulgour", "200g légumes", "4 abricots frais"], instructions: ["Dinde grillée", "Boulgour 10 min", "Légumes four", "Abricots"], mealPrep: "✅ Boulgour batch" },
    { id: "lunch_jade_norm_13", name: "Thon, riz jasmin, salade asiatique, papaye", emoji: "🐟", calories: 803, protein: 61, carbs: 85, fat: 21, ingredients: ["190g thon", "145g riz jasmin", "Salade chou + carotte", "150g papaye"], instructions: ["Thon saisir 2 min/côté", "Riz jasmin", "Salade asiatique", "Papaye fraîche"], mealPrep: "✅ Salade 3 jours" },
    { id: "lunch_jade_norm_14", name: "Poulet tandoori, naan complet, salade, grenade", emoji: "🌶️", calories: 797, protein: 60, carbs: 86, fat: 19, ingredients: ["200g poulet tandoori", "1 naan complet", "Salade verte", "100g grenade"], instructions: ["Poulet four 25 min", "Naan réchauffé", "Salade", "Grenade"], mealPrep: "✅ Marinade 2h min" },
    { id: "lunch_jade_norm_15", name: "Crevettes, risotto léger, légumes, clémentines", emoji: "🦐", calories: 800, protein: 59, carbs: 85, fat: 20, ingredients: ["240g crevettes", "120g riz arborio", "Bouillon", "200g légumes", "2 clémentines"], instructions: ["Risotto crémeux bouillon", "Crevettes poêlées fin", "Légumes vapeur", "Clémentines"], mealPrep: "⚡ Risotto 20 min" },
    { id: "lunch_jade_norm_16", name: "Veau, polenta, ratatouille, pêche", emoji: "🥘", calories: 802, protein: 60, carbs: 84, fat: 21, ingredients: ["200g veau", "120g polenta", "200g ratatouille", "1 pêche"], instructions: ["Veau poêle 4 min/côté", "Polenta crémeuse", "Ratatouille", "Pêche"], mealPrep: "✅ Ratatouille + polenta batch" },
    { id: "lunch_jade_norm_17", name: "Saumon, quinoa rouge, brocoli, fruits rouges", emoji: "🐟", calories: 799, protein: 61, carbs: 85, fat: 20, ingredients: ["180g saumon", "130g quinoa rouge", "200g brocoli", "120g fruits rouges"], instructions: ["Saumon air fryer 12 min", "Quinoa rouge 15 min", "Brocoli vapeur", "Fruits rouges"], mealPrep: "✅ Quinoa batch" },
    { id: "lunch_jade_norm_18", name: "Poulet, riz sauvage, légumes, melon", emoji: "🍗", calories: 801, protein: 60, carbs: 86, fat: 19, ingredients: ["200g poulet", "130g riz sauvage", "200g légumes", "200g melon"], instructions: ["Poulet rôti épices", "Riz sauvage 40 min", "Légumes vapeur", "Melon frais"], mealPrep: "✅ Riz sauvage gros batch" },
    { id: "lunch_jade_norm_19", name: "Bœuf, semoule complète, courgettes, figues", emoji: "🥩", calories: 798, protein: 59, carbs: 85, fat: 20, ingredients: ["200g bœuf haché 5%", "120g semoule complète", "200g courgettes", "2 figues fraîches"], instructions: ["Bœuf haché assaisonné", "Semoule 5 min", "Courgettes poêle", "Figues"], mealPrep: "⚡ Super rapide" },
    { id: "lunch_jade_norm_20", name: "Dinde, farro, légumes grillés, cerises", emoji: "🦃", calories: 803, protein: 61, carbs: 84, fat: 21, ingredients: ["200g dinde", "110g farro", "200g légumes", "100g cerises"], instructions: ["Dinde grillée herbes", "Farro 30 min", "Légumes four", "Cerises"], mealPrep: "✅ Farro batch semaine" }
];

// Alternatives COLLATION - Phase Normale - Jade (300 kcal, 30g P, 25g C, 8g L)
const snackAlternativesNormalJade = [
    { id: "snack_jade_norm_1", name: "Fromage blanc, fruits, miel", emoji: "🥛", calories: 300, protein: 30, carbs: 25, fat: 8, ingredients: ["200g fromage blanc 0%", "150g fruits rouges", "1 cc miel", "20g amandes"], instructions: ["Fromage blanc", "Fruits frais", "Miel", "Amandes"], mealPrep: "⚡ 2 minutes" },
    { id: "snack_jade_norm_2", name: "Shake protéiné, banane, beurre cacahuète", emoji: "🥤", calories: 298, protein: 31, carbs: 26, fat: 7, ingredients: ["30g whey", "1 banane", "10g beurre cacahuète", "250ml lait écrémé"], instructions: ["Mixer tous ingrédients"], mealPrep: "⚡ 1 minute" },
    { id: "snack_jade_norm_3", name: "Yaourt grec, granola, fruits", emoji: "🥣", calories: 302, protein: 29, carbs: 24, fat: 9, ingredients: ["150g yaourt grec 0%", "30g granola", "100g myrtilles"], instructions: ["Yaourt + granola + fruits"], mealPrep: "⚡ 2 minutes" },
    { id: "snack_jade_norm_4", name: "Blanc de poulet, galette riz, pomme", emoji: "🍗", calories: 299, protein: 30, carbs: 25, fat: 8, ingredients: ["100g poulet", "2 galettes riz", "1 petite pomme"], instructions: ["Poulet froid", "Galettes riz", "Pomme"], mealPrep: "✅ Poulet précuit" },
    { id: "snack_jade_norm_5", name: "Cottage cheese, fruits secs, noix", emoji: "🧀", calories: 301, protein: 31, carbs: 24, fat: 8, ingredients: ["180g cottage 0%", "30g raisins secs", "15g noix"], instructions: ["Cottage + raisins + noix"], mealPrep: "⚡ 1 minute" },
    { id: "snack_jade_norm_6", name: "Skyr, miel, banane, amandes", emoji: "🍯", calories: 299, protein: 30, carbs: 26, fat: 7, ingredients: ["150g skyr 0%", "1 cc miel", "1 petite banane", "12g amandes"], instructions: ["Skyr + miel", "Banane rondelles", "Amandes concassées"], mealPrep: "⚡ 2 minutes" },
    { id: "snack_jade_norm_7", name: "Smoothie protéiné fruits rouges", emoji: "🥤", calories: 302, protein: 29, carbs: 25, fat: 9, ingredients: ["25g whey vanille", "200ml lait écrémé", "150g fruits rouges congelés", "10g graines chia"], instructions: ["Mixer tous ingrédients", "Bien froid"], mealPrep: "⚡ 2 minutes" },
    { id: "snack_jade_norm_8", name: "Œufs durs, pain complet, fruits", emoji: "🥚", calories: 298, protein: 31, carbs: 24, fat: 8, ingredients: ["2 œufs durs", "30g pain complet", "1 kiwi", "1 clémentine"], instructions: ["Œufs durs précuits", "Pain", "Fruits"], mealPrep: "✅ Œufs 5 jours" },
    { id: "snack_jade_norm_9", name: "Fromage blanc, compote, noisettes", emoji: "🥛", calories: 300, protein: 30, carbs: 26, fat: 7, ingredients: ["200g fromage blanc", "100g compote pomme sans sucre", "15g noisettes"], instructions: ["Fromage blanc + compote", "Noisettes concassées"], mealPrep: "⚡ 1 minute" },
    { id: "snack_jade_norm_10", name: "Dinde, crackers complets, raisin", emoji: "🦃", calories: 301, protein: 29, carbs: 25, fat: 8, ingredients: ["90g tranches dinde", "30g crackers complets", "100g raisin"], instructions: ["Dinde + crackers", "Raisin"], mealPrep: "✅ Simple" },
    { id: "snack_jade_norm_11", name: "Yaourt protéiné, flocons avoine, miel", emoji: "🥣", calories: 299, protein: 31, carbs: 24, fat: 8, ingredients: ["150g yaourt protéiné", "25g flocons avoine", "1 cc miel", "Cannelle"], instructions: ["Yaourt + flocons crus", "Miel + cannelle"], mealPrep: "⚡ 1 minute" },
    { id: "snack_jade_norm_12", name: "Smoothie bowl protéiné", emoji: "🍌", calories: 303, protein: 30, carbs: 26, fat: 9, ingredients: ["25g whey", "1 banane congelée", "100ml lait écrémé", "20g granola", "Fruits frais"], instructions: ["Mixer banane + whey + lait", "Verser bowl", "Topping granola + fruits"], mealPrep: "⚡ 5 minutes" },
    { id: "snack_jade_norm_13", name: "Thon, galettes riz, fruits", emoji: "🐟", calories: 298, protein: 30, carbs: 25, fat: 7, ingredients: ["80g thon naturel", "2 galettes riz", "1 pomme", "Tomates cerises"], instructions: ["Thon sur galettes", "Pomme", "Tomates"], mealPrep: "⚡ 2 minutes" },
    { id: "snack_jade_norm_14", name: "Fromage blanc, müesli, fruits", emoji: "🥛", calories: 302, protein: 29, carbs: 26, fat: 8, ingredients: ["200g fromage blanc", "30g müesli", "1 kiwi", "80g myrtilles"], instructions: ["Fromage blanc + müesli", "Fruits frais"], mealPrep: "⚡ 2 minutes" },
    { id: "snack_jade_norm_15", name: "Shake protéiné fraise-banane", emoji: "🍓", calories: 300, protein: 31, carbs: 25, fat: 8, ingredients: ["30g whey fraise", "1/2 banane", "100g fraises", "200ml lait écrémé", "5g graines lin"], instructions: ["Mixer tous ingrédients", "Bien glacé"], mealPrep: "⚡ 2 minutes" }
];

// Alternatives DÎNER - Phase Normale - Jade (450 kcal, 45g P, 10g C, 24g L)
const dinnerAlternativesNormalJade = [
    { id: "dinner_jade_norm_1", name: "Saumon, légumes, avocat", emoji: "🐟", calories: 450, protein: 45, carbs: 10, fat: 24, ingredients: ["180g saumon", "200g légumes", "50g avocat"], instructions: ["Saumon poêle", "Légumes vapeur", "Avocat"], mealPrep: "⚡ Simple" },
    { id: "dinner_jade_norm_2", name: "Poulet rôti, légumes grillés", emoji: "🍗", calories: 448, protein: 46, carbs: 11, fat: 23, ingredients: ["200g poulet", "250g légumes variés", "1 cs huile olive"], instructions: ["Poulet four", "Légumes grillés"], mealPrep: "✅ Sheet pan" },
    { id: "dinner_jade_norm_3", name: "Dorade, ratatouille", emoji: "🐠", calories: 452, protein: 44, carbs: 12, fat: 24, ingredients: ["200g dorade", "250g ratatouille"], instructions: ["Dorade four", "Ratatouille"], mealPrep: "✅ Ratatouille 5 jours" },
    { id: "dinner_jade_norm_4", name: "Bœuf, légumes, noix", emoji: "🥩", calories: 449, protein: 45, carbs: 10, fat: 25, ingredients: ["180g bœuf", "200g légumes verts", "20g noix"], instructions: ["Bœuf grillé", "Légumes", "Noix"], mealPrep: "⚡ Rapide" },
    { id: "dinner_jade_norm_5", name: "Crevettes, légumes, olives", emoji: "🦐", calories: 451, protein: 46, carbs: 11, fat: 24, ingredients: ["220g crevettes", "200g légumes", "30g olives"], instructions: ["Crevettes sautées", "Légumes", "Olives"], mealPrep: "⚡ 5 minutes" }
];

// ÉLODIE PHASE 2: 1700 kcal (130g P, 150g C, 60g L)
// Petit-déj: 450 kcal | Déjeuner: 650 kcal | Collation: 250 kcal | Dîner: 350 kcal

// Alternatives PETIT-DÉJEUNER - Phase Normale - Élodie (450 kcal, 35g P, 50g C, 15g L)
const breakfastAlternativesNormalElodie = [
    { id: "breakfast_elodie_norm_1", name: "Pancakes protéinés, fruits", emoji: "🥞", calories: 450, protein: 35, carbs: 50, fat: 15, ingredients: ["60g flocons avoine", "2 blancs + 1 œuf", "120g fruits rouges", "20g whey", "1 cc miel"], instructions: ["Pancakes protéinés", "Fruits frais + miel"], mealPrep: "⚡ 8 minutes" },
    { id: "breakfast_elodie_norm_2", name: "Yaourt grec, granola, banane", emoji: "🥣", calories: 448, protein: 36, carbs: 49, fat: 16, ingredients: ["150g yaourt grec 0%", "45g granola", "1 petite banane", "20g whey"], instructions: ["Yaourt + whey", "Granola + banane"], mealPrep: "⚡ 2 minutes" },
    { id: "breakfast_elodie_norm_3", name: "Omelette, pain, fruits", emoji: "🍳", calories: 452, protein: 34, carbs: 51, fat: 15, ingredients: ["2 œufs", "60g pain complet", "120g pomme", "10g amandes"], instructions: ["Omelette", "Pain toasté", "Pomme + amandes"], mealPrep: "⚡ 8 minutes" },
    { id: "breakfast_elodie_norm_4", name: "Porridge protéiné, fruits", emoji: "🥣", calories: 449, protein: 35, carbs: 50, fat: 16, ingredients: ["60g avoine", "20g whey", "150ml lait écrémé", "80g fruits", "12g amandes"], instructions: ["Porridge", "Whey hors feu", "Fruits + amandes"], mealPrep: "⚡ 5 minutes" },
    { id: "breakfast_elodie_norm_5", name: "Smoothie bowl protéiné", emoji: "🍌", calories: 451, protein: 34, carbs: 51, fat: 15, ingredients: ["20g whey", "1 banane congelée", "100ml lait", "60g fruits rouges", "20g granola"], instructions: ["Mixer banane+whey+lait", "Topping granola+fruits"], mealPrep: "⚡ 5 minutes" },
    { id: "breakfast_elodie_norm_6", name: "Œufs brouillés, pain, fruits", emoji: "🍳", calories: 448, protein: 35, carbs: 49, fat: 16, ingredients: ["3 blancs+1 œuf", "60g pain complet", "100g fraises", "10g beurre cacahuète"], instructions: ["Œufs brouillés", "Pain toasté", "Fruits"], mealPrep: "⚡ 7 minutes" },
    { id: "breakfast_elodie_norm_7", name: "Fromage blanc, müesli, miel", emoji: "🥛", calories: 450, protein: 36, carbs: 50, fat: 15, ingredients: ["180g fromage blanc 0%", "50g müesli", "1 cc miel", "80g myrtilles"], instructions: ["Fromage blanc+müesli", "Miel+fruits"], mealPrep: "⚡ 2 minutes" },
    { id: "breakfast_elodie_norm_8", name: "Toast avocat, œuf, fruits", emoji: "🥑", calories: 452, protein: 34, carbs: 51, fat: 16, ingredients: ["2 tranches pain complet", "40g avocat", "2 œufs", "100g clémentines"], instructions: ["Toast avocat écrasé", "Œufs pochés", "Fruits"], mealPrep: "⚡ 8 minutes" },
    { id: "breakfast_elodie_norm_9", name: "Crêpes protéinées, compote", emoji: "🥞", calories: 449, protein: 35, carbs: 50, fat: 15, ingredients: ["50g farine complète", "2 blancs+1 œuf", "20g whey", "100g compote", "12g amandes"], instructions: ["Crêpes fines", "Compote sans sucre", "Amandes"], mealPrep: "⚡ 10 minutes" },
    { id: "breakfast_elodie_norm_10", name: "Skyr, flocons, banane, noix", emoji: "🥣", calories: 451, protein: 36, carbs: 49, fat: 16, ingredients: ["150g skyr 0%", "40g flocons avoine crus", "1 petite banane", "15g noix"], instructions: ["Skyr+flocons", "Banane+noix"], mealPrep: "⚡ 2 minutes" },
    { id: "breakfast_elodie_norm_11", name: "Omelette sucrée, fruits rouges", emoji: "🍳", calories: 448, protein: 34, carbs: 51, fat: 15, ingredients: ["2 œufs+2 blancs", "1 cc miel", "Cannelle", "150g fruits rouges", "30g pain complet"], instructions: ["Omelette sucrée cannelle", "Fruits frais", "Pain"], mealPrep: "⚡ 7 minutes" },
    { id: "breakfast_elodie_norm_12", name: "Yaourt protéiné, fruits, graines", emoji: "🥛", calories: 450, protein: 35, carbs: 50, fat: 16, ingredients: ["150g yaourt protéiné", "100g fruits variés", "1 cc miel", "40g flocons", "10g graines"], instructions: ["Yaourt+flocons", "Fruits+graines+miel"], mealPrep: "⚡ 2 minutes" },
    { id: "breakfast_elodie_norm_13", name: "Pain perdu protéiné, sirop", emoji: "🍞", calories: 452, protein: 34, carbs: 51, fat: 15, ingredients: ["2 tranches pain complet", "2 œufs", "50ml lait", "Cannelle", "1 cc sirop érable", "80g fruits"], instructions: ["Pain perdu", "Cuire poêle", "Sirop+fruits"], mealPrep: "⚡ 10 minutes" },
    { id: "breakfast_elodie_norm_14", name: "Cottage cheese, miel, fruits secs", emoji: "🧀", calories: 449, protein: 35, carbs: 50, fat: 16, ingredients: ["180g cottage 0%", "30g raisins secs", "1 cc miel", "15g amandes", "40g flocons"], instructions: ["Cottage+flocons", "Raisins+amandes+miel"], mealPrep: "⚡ 2 minutes" }
];

// Alternatives DÉJEUNER - Phase Normale - Élodie (650 kcal, 48g P, 70g C, 16g L)
const lunchAlternativesNormalElodie = [
    { id: "lunch_elodie_norm_1", name: "Poulet, riz, légumes, fruits", emoji: "🍗", calories: 650, protein: 48, carbs: 70, fat: 16, ingredients: ["160g poulet", "120g riz", "180g légumes", "120g fruits"], instructions: ["Poulet grillé", "Riz", "Légumes", "Fruits"], mealPrep: "✅ Batch 3 jours" },
    { id: "lunch_elodie_norm_2", name: "Saumon, quinoa, légumes, mangue", emoji: "🐟", calories: 648, protein: 47, carbs: 71, fat: 17, ingredients: ["140g saumon", "110g quinoa", "180g légumes", "100g mangue"], instructions: ["Saumon", "Quinoa", "Légumes", "Mangue"], mealPrep: "✅ Simple" },
    { id: "lunch_elodie_norm_3", name: "Dinde, patate douce, salade, fruits", emoji: "🦃", calories: 652, protein: 49, carbs: 69, fat: 16, ingredients: ["160g dinde", "200g patate douce", "Salade", "100g raisin"], instructions: ["Dinde", "Patate four", "Salade", "Raisin"], mealPrep: "✅ Patates cuites" },
    { id: "lunch_elodie_norm_4", name: "Thon, pâtes, légumes, kiwi", emoji: "🐟", calories: 649, protein: 48, carbs: 70, fat: 16, ingredients: ["150g thon", "95g pâtes crues", "180g tomates", "2 kiwis"], instructions: ["Thon", "Pâtes", "Sauce tomate", "Kiwis"], mealPrep: "✅ Rapide" },
    { id: "lunch_elodie_norm_5", name: "Crevettes, riz thaï, légumes, ananas", emoji: "🦐", calories: 651, protein: 47, carbs: 71, fat: 17, ingredients: ["180g crevettes", "115g riz jasmin", "180g légumes", "100g ananas"], instructions: ["Crevettes wok", "Riz", "Légumes", "Ananas"], mealPrep: "⚡ Rapide" },
    { id: "lunch_elodie_norm_6", name: "Poulet teriyaki, riz, edamame, orange", emoji: "🍱", calories: 648, protein: 48, carbs: 70, fat: 16, ingredients: ["160g poulet", "115g riz", "80g edamame", "Sauce teriyaki light", "1 orange"], instructions: ["Poulet mariné", "Griller", "Riz", "Edamame", "Orange"], mealPrep: "✅ Marinade veille" },
    { id: "lunch_elodie_norm_7", name: "Saumon, pâtes complètes, asperges, poire", emoji: "🍝", calories: 652, protein: 47, carbs: 71, fat: 17, ingredients: ["140g saumon", "90g pâtes complètes", "180g asperges", "1 petite poire"], instructions: ["Saumon poêle", "Pâtes", "Asperges vapeur", "Poire"], mealPrep: "✅ Simple" },
    { id: "lunch_elodie_norm_8", name: "Bœuf sauté, nouilles udon, légumes, kiwi", emoji: "🍜", calories: 649, protein: 48, carbs: 70, fat: 16, ingredients: ["155g bœuf", "100g nouilles udon", "180g légumes wok", "2 kiwis"], instructions: ["Bœuf sauté", "Nouilles", "Wok légumes", "Kiwis"], mealPrep: "⚡ Rapide" },
    { id: "lunch_elodie_norm_9", name: "Dinde, boulgour, légumes, abricots", emoji: "🦃", calories: 650, protein: 49, carbs: 69, fat: 16, ingredients: ["160g dinde", "100g boulgour", "180g légumes", "3 abricots"], instructions: ["Dinde grillée", "Boulgour 10min", "Légumes", "Abricots"], mealPrep: "✅ Boulgour batch" },
    { id: "lunch_elodie_norm_10", name: "Thon, riz jasmin, salade, papaye", emoji: "🐟", calories: 651, protein: 47, carbs: 71, fat: 17, ingredients: ["150g thon", "115g riz jasmin", "Salade asiatique", "100g papaye"], instructions: ["Thon saisir", "Riz", "Salade", "Papaye"], mealPrep: "✅ Salade 3 jours" },
    { id: "lunch_elodie_norm_11", name: "Poulet tandoori, naan, salade, grenade", emoji: "🌶️", calories: 648, protein: 48, carbs: 70, fat: 16, ingredients: ["160g poulet tandoori", "1/2 naan complet", "Salade", "80g grenade"], instructions: ["Poulet four 25min", "Naan", "Salade", "Grenade"], mealPrep: "✅ Marinade 2h" },
    { id: "lunch_elodie_norm_12", name: "Gambas, risotto léger, légumes, clémentines", emoji: "🦐", calories: 652, protein: 47, carbs: 71, fat: 17, ingredients: ["180g gambas", "95g riz arborio", "Bouillon", "180g légumes", "2 clémentines"], instructions: ["Risotto crémeux", "Gambas fin", "Légumes", "Clémentines"], mealPrep: "⚡ Risotto 20min" },
    { id: "lunch_elodie_norm_13", name: "Veau, polenta, ratatouille, pêche", emoji: "🥘", calories: 649, protein: 48, carbs: 70, fat: 16, ingredients: ["155g veau", "95g polenta", "180g ratatouille", "1 pêche"], instructions: ["Veau poêle", "Polenta", "Ratatouille", "Pêche"], mealPrep: "✅ Ratatouille+polenta batch" },
    { id: "lunch_elodie_norm_14", name: "Saumon, quinoa rouge, brocoli, fruits rouges", emoji: "🐟", calories: 651, protein: 47, carbs: 71, fat: 17, ingredients: ["140g saumon", "105g quinoa rouge", "180g brocoli", "100g fruits rouges"], instructions: ["Saumon air fryer", "Quinoa", "Brocoli", "Fruits"], mealPrep: "✅ Quinoa batch" },
    { id: "lunch_elodie_norm_15", name: "Poulet, riz sauvage, légumes, melon", emoji: "🍗", calories: 650, protein: 48, carbs: 70, fat: 16, ingredients: ["160g poulet", "100g riz sauvage", "180g légumes", "150g melon"], instructions: ["Poulet rôti", "Riz sauvage 40min", "Légumes", "Melon"], mealPrep: "✅ Riz batch" },
    { id: "lunch_elodie_norm_16", name: "Bœuf, semoule, courgettes, figues", emoji: "🥩", calories: 648, protein: 47, carbs: 71, fat: 16, ingredients: ["155g bœuf haché 5%", "95g semoule", "180g courgettes", "2 figues fraîches"], instructions: ["Bœuf assaisonné", "Semoule 5min", "Courgettes", "Figues"], mealPrep: "⚡ Super rapide" },
    { id: "lunch_elodie_norm_17", name: "Dinde, farro, légumes, cerises", emoji: "🦃", calories: 652, protein: 49, carbs: 69, fat: 17, ingredients: ["160g dinde", "85g farro", "180g légumes", "80g cerises"], instructions: ["Dinde grillée", "Farro 30min", "Légumes four", "Cerises"], mealPrep: "✅ Farro batch" },
    { id: "lunch_elodie_norm_18", name: "Cabillaud, couscous, légumes, dattes", emoji: "🐠", calories: 649, protein: 48, carbs: 70, fat: 16, ingredients: ["160g cabillaud", "100g couscous", "180g légumes", "3 dattes"], instructions: ["Cabillaud vapeur", "Couscous 5min", "Légumes", "Dattes"], mealPrep: "⚡ Très rapide" },
    { id: "lunch_elodie_norm_19", name: "Poulet curry, riz basmati, salade fruits", emoji: "🌶️", calories: 651, protein: 47, carbs: 71, fat: 17, ingredients: ["160g poulet", "115g riz", "Curry", "Lait coco light", "120g salade fruits"], instructions: ["Poulet curry", "Riz", "Salade fruits"], mealPrep: "✅ Batch 3 jours" },
    { id: "lunch_elodie_norm_20", name: "Saumon fumé, bagel complet, légumes, fruits", emoji: "🥯", calories: 650, protein: 48, carbs: 70, fat: 16, ingredients: ["100g saumon fumé", "1 bagel complet", "Fromage frais 0%", "Salade", "100g fruits"], instructions: ["Bagel+fromage+saumon", "Salade", "Fruits"], mealPrep: "⚡ Zéro cuisson" }
];

// Alternatives COLLATION - Phase Normale - Élodie (250 kcal, 22g P, 20g C, 8g L)
const snackAlternativesNormalElodie = [
    { id: "snack_elodie_norm_1", name: "Fromage blanc, fruits, miel", emoji: "🥛", calories: 250, protein: 22, carbs: 20, fat: 8, ingredients: ["150g fromage blanc 0%", "100g fruits", "1 cc miel", "15g amandes"], instructions: ["Fromage blanc + fruits + miel + amandes"], mealPrep: "⚡ 2 minutes" },
    { id: "snack_elodie_norm_2", name: "Shake protéiné, banane", emoji: "🥤", calories: 248, protein: 23, carbs: 21, fat: 7, ingredients: ["25g whey", "1 petite banane", "200ml lait écrémé"], instructions: ["Mixer"], mealPrep: "⚡ 1 minute" },
    { id: "snack_elodie_norm_3", name: "Yaourt grec, granola", emoji: "🥣", calories: 252, protein: 21, carbs: 19, fat: 9, ingredients: ["120g yaourt grec 0%", "25g granola", "60g myrtilles"], instructions: ["Yaourt + granola + fruits"], mealPrep: "⚡ 2 minutes" },
    { id: "snack_elodie_norm_4", name: "Cottage cheese, fruits secs", emoji: "🧀", calories: 249, protein: 22, carbs: 21, fat: 7, ingredients: ["140g cottage 0%", "25g raisins secs", "12g noix"], instructions: ["Cottage+raisins+noix"], mealPrep: "⚡ 1 minute" },
    { id: "snack_elodie_norm_5", name: "Skyr, miel, banane", emoji: "🍯", calories: 251, protein: 23, carbs: 20, fat: 8, ingredients: ["120g skyr 0%", "1 cc miel", "1/2 banane", "10g amandes"], instructions: ["Skyr+miel", "Banane+amandes"], mealPrep: "⚡ 2 minutes" },
    { id: "snack_elodie_norm_6", name: "Smoothie protéiné fruits rouges", emoji: "🥤", calories: 248, protein: 22, carbs: 21, fat: 7, ingredients: ["20g whey", "150ml lait écrémé", "120g fruits rouges", "5g graines chia"], instructions: ["Mixer bien froid"], mealPrep: "⚡ 2 minutes" },
    { id: "snack_elodie_norm_7", name: "Œufs durs, pain, fruits", emoji: "🥚", calories: 250, protein: 21, carbs: 20, fat: 9, ingredients: ["2 œufs durs", "25g pain complet", "1 kiwi"], instructions: ["Œufs précuits", "Pain", "Fruits"], mealPrep: "✅ Œufs 5 jours" },
    { id: "snack_elodie_norm_8", name: "Fromage blanc, compote, noisettes", emoji: "🥛", calories: 252, protein: 22, carbs: 21, fat: 8, ingredients: ["150g fromage blanc", "80g compote sans sucre", "12g noisettes"], instructions: ["Fromage+compote", "Noisettes"], mealPrep: "⚡ 1 minute" },
    { id: "snack_elodie_norm_9", name: "Dinde, crackers, raisin", emoji: "🦃", calories: 249, protein: 21, carbs: 20, fat: 8, ingredients: ["70g tranches dinde", "25g crackers complets", "80g raisin"], instructions: ["Dinde+crackers", "Raisin"], mealPrep: "✅ Simple" },
    { id: "snack_elodie_norm_10", name: "Yaourt protéiné, flocons, miel", emoji: "🥣", calories: 251, protein: 23, carbs: 19, fat: 9, ingredients: ["120g yaourt protéiné", "20g flocons avoine", "1 cc miel"], instructions: ["Yaourt+flocons+miel"], mealPrep: "⚡ 1 minute" },
    { id: "snack_elodie_norm_11", name: "Smoothie bowl mini", emoji: "🍌", calories: 248, protein: 22, carbs: 21, fat: 7, ingredients: ["20g whey", "1/2 banane congelée", "80ml lait", "15g granola", "Fruits"], instructions: ["Mixer", "Topping granola+fruits"], mealPrep: "⚡ 5 minutes" },
    { id: "snack_elodie_norm_12", name: "Thon, galettes riz, pomme", emoji: "🐟", calories: 250, protein: 21, carbs: 20, fat: 8, ingredients: ["60g thon naturel", "2 galettes riz", "1 petite pomme"], instructions: ["Thon sur galettes", "Pomme"], mealPrep: "⚡ 2 minutes" },
    { id: "snack_elodie_norm_13", name: "Fromage blanc, müesli, fruits", emoji: "🥛", calories: 252, protein: 22, carbs: 21, fat: 8, ingredients: ["150g fromage blanc", "25g müesli", "1 kiwi", "60g myrtilles"], instructions: ["Fromage+müesli+fruits"], mealPrep: "⚡ 2 minutes" },
    { id: "snack_elodie_norm_14", name: "Shake fraise-banane", emoji: "🍓", calories: 249, protein: 23, carbs: 20, fat: 7, ingredients: ["25g whey fraise", "1/2 banane", "80g fraises", "150ml lait écrémé"], instructions: ["Mixer bien glacé"], mealPrep: "⚡ 2 minutes" },
    { id: "snack_elodie_norm_15", name: "Cottage, flocons, miel, fruits", emoji: "🧀", calories: 251, protein: 21, carbs: 21, fat: 8, ingredients: ["130g cottage 0%", "20g flocons avoine", "1 cc miel", "80g fruits"], instructions: ["Cottage+flocons", "Miel+fruits"], mealPrep: "⚡ 2 minutes" }
];

// Alternatives DÎNER - Phase Normale - Élodie (350 kcal, 35g P, 10g C, 21g L)
const dinnerAlternativesNormalElodie = [
    { id: "dinner_elodie_norm_1", name: "Saumon, légumes, avocat", emoji: "🐟", calories: 350, protein: 35, carbs: 10, fat: 21, ingredients: ["130g saumon", "180g légumes", "40g avocat"], instructions: ["Saumon poêle", "Légumes", "Avocat"], mealPrep: "⚡ Simple" },
    { id: "dinner_elodie_norm_2", name: "Poulet, légumes grillés", emoji: "🍗", calories: 348, protein: 36, carbs: 11, fat: 20, ingredients: ["150g poulet", "220g légumes", "1 cs huile olive"], instructions: ["Poulet grillé", "Légumes four"], mealPrep: "✅ Sheet pan" },
    { id: "dinner_elodie_norm_3", name: "Dorade, ratatouille", emoji: "🐠", calories: 352, protein: 34, carbs: 12, fat: 21, ingredients: ["150g dorade", "200g ratatouille"], instructions: ["Dorade four", "Ratatouille"], mealPrep: "✅ Ratatouille 5 jours" },
    { id: "dinner_elodie_norm_4", name: "Crevettes, légumes, olives", emoji: "🦐", calories: 349, protein: 35, carbs: 10, fat: 22, ingredients: ["170g crevettes", "180g légumes", "25g olives"], instructions: ["Crevettes sautées", "Légumes", "Olives"], mealPrep: "⚡ 5 minutes" },
    { id: "dinner_elodie_norm_5", name: "Cabillaud, épinards, avocat", emoji: "🐠", calories: 351, protein: 34, carbs: 11, fat: 21, ingredients: ["140g cabillaud", "200g épinards", "40g avocat"], instructions: ["Cabillaud vapeur", "Épinards sautés", "Avocat"], mealPrep: "⚡ Simple" },
    { id: "dinner_elodie_norm_6", name: "Bar grillé, légumes, olives", emoji: "🐟", calories: 348, protein: 35, carbs: 10, fat: 21, ingredients: ["140g bar", "200g légumes grillés", "20g olives"], instructions: ["Bar grillé", "Légumes four"], mealPrep: "✅ Sheet pan" },
    { id: "dinner_elodie_norm_7", name: "Poulet, ratatouille, parmesan", emoji: "🍗", calories: 352, protein: 36, carbs: 11, fat: 22, ingredients: ["145g poulet", "200g ratatouille", "12g parmesan"], instructions: ["Poulet grillé", "Ratatouille", "Parmesan"], mealPrep: "✅ Ratatouille batch" },
    { id: "dinner_elodie_norm_8", name: "Thon mi-cuit, salade, avocat", emoji: "🐟", calories: 350, protein: 34, carbs: 12, fat: 21, ingredients: ["130g thon", "Salade verte", "40g avocat", "Tomates"], instructions: ["Thon saisir 1min/côté", "Salade"], mealPrep: "⚡ Cuisson minute" },
    { id: "dinner_elodie_norm_9", name: "Dinde, légumes méditerranéens, feta", emoji: "🦃", calories: 349, protein: 35, carbs: 10, fat: 22, ingredients: ["140g dinde", "180g légumes", "25g feta"], instructions: ["Dinde poêle", "Légumes grillés", "Feta"], mealPrep: "✅ Simple" },
    { id: "dinner_elodie_norm_10", name: "Merlu, fondue poireaux", emoji: "🐠", calories: 351, protein: 36, carbs: 11, fat: 21, ingredients: ["150g merlu", "250g poireaux", "1 cs crème 0%"], instructions: ["Merlu poêle", "Poireaux fondus"], mealPrep: "✅ Léger" },
    { id: "dinner_elodie_norm_11", name: "Gambas, légumes grillés, huile olive", emoji: "🦐", calories: 348, protein: 35, carbs: 10, fat: 22, ingredients: ["165g gambas", "200g légumes", "1 cs huile olive", "Ail"], instructions: ["Gambas poêlées 3min", "Légumes"], mealPrep: "⚡ 10 minutes" },
    { id: "dinner_elodie_norm_12", name: "Sole, asperges, beurre citron", emoji: "🐠", calories: 352, protein: 34, carbs: 12, fat: 21, ingredients: ["150g sole", "220g asperges", "Beurre noisette light", "Citron"], instructions: ["Sole meunière", "Asperges vapeur"], mealPrep: "⚡ Rapide" },
    { id: "dinner_elodie_norm_13", name: "Poulet sauce champignons, légumes", emoji: "🍄", calories: 350, protein: 35, carbs: 11, fat: 21, ingredients: ["145g poulet", "150g champignons", "Crème 0%", "180g légumes"], instructions: ["Poulet poêlé", "Sauce champignons"], mealPrep: "✅ Sauce batch" },
    { id: "dinner_elodie_norm_14", name: "Saumon fumé, salade, avocat", emoji: "🐟", calories: 349, protein: 34, carbs: 10, fat: 22, ingredients: ["100g saumon fumé", "Salade verte", "45g avocat", "Concombre"], instructions: ["Assemblage froid"], mealPrep: "⚡ Zéro cuisson" },
    { id: "dinner_elodie_norm_15", name: "Dorade, fenouil braisé, olives", emoji: "🐠", calories: 351, protein: 35, carbs: 11, fat: 21, ingredients: ["145g dorade", "220g fenouil", "20g olives noires"], instructions: ["Dorade four", "Fenouil braisé"], mealPrep: "✅ Four simple" }
];

// Fonction pour trouver des alternatives avec macros similaires
function findAlternativeMeals(currentMeal, alternatives, tolerance = 50) {
    return alternatives.filter(alt => {
        const calDiff = Math.abs(alt.calories - currentMeal.calories);
        const protDiff = Math.abs(alt.protein - currentMeal.protein);
        const carbDiff = Math.abs(alt.carbs - currentMeal.carbs);
        const fatDiff = Math.abs(alt.fat - currentMeal.fat);
        
        return calDiff <= tolerance && 
               protDiff <= 5 && 
               carbDiff <= 10 && 
               fatDiff <= 5;
    });
}

// Fonction pour obtenir toutes les alternatives selon profil et phase
function getMealAlternatives(profile, phase, mealType) {
    if (phase === 1) {
        if (profile === 'jade') {
            switch(mealType) {
                case 'lunch': return lunchAlternativesAggressiveJade;
                case 'snack': return snackAlternativesAggressiveJade;
                case 'dinner': return dinnerAlternativesAggressiveJade;
            }
        } else if (profile === 'elodie') {
            switch(mealType) {
                case 'lunch': return lunchAlternativesAggressiveElodie;
                case 'snack': return snackAlternativesAggressiveElodie;
                case 'dinner': return dinnerAlternativesAggressiveElodie;
            }
        }
    } else if (phase === 2) {
        if (profile === 'jade') {
            switch(mealType) {
                case 'breakfast': return breakfastAlternativesNormalJade;
                case 'lunch': return lunchAlternativesNormalJade;
                case 'snack': return snackAlternativesNormalJade;
                case 'dinner': return dinnerAlternativesNormalJade;
            }
        } else if (profile === 'elodie') {
            switch(mealType) {
                case 'breakfast': return breakfastAlternativesNormalElodie;
                case 'lunch': return lunchAlternativesNormalElodie;
                case 'snack': return snackAlternativesNormalElodie;
                case 'dinner': return dinnerAlternativesNormalElodie;
            }
        }
    }
    return [];
}

// Fonction pour remplacer un repas
function swapMeal(mealIndex, newMealData) {
    const plans = getNutritionPlans();
    const plan = plans[currentProfile];
    
    // Créer une copie du repas avec les nouvelles données
    plan.meals[mealIndex] = {
        ...plan.meals[mealIndex],
        name: newMealData.name,
        emoji: newMealData.emoji,
        description: newMealData.name,
        calories: newMealData.calories,
        protein: newMealData.protein,
        carbs: newMealData.carbs,
        fat: newMealData.fat,
        ingredients: newMealData.ingredients,
        instructions: newMealData.instructions,
        mealPrep: newMealData.mealPrep || ""
    };
    
    // Sauvegarder et rafraîchir
    saveToStorage();
    updateNutrition();
}

// Shopping list template
const shoppingTemplate = {
    "Protéines": [
        { name: "Blancs de poulet", quantity: "2.6 kg", checked: false },
        { name: "Pavés de saumon", quantity: "750 g", checked: false },
        { name: "Œufs", quantity: "24", checked: false },
        { name: "Protéine whey", quantity: "1 pot", checked: false }
    ],
    "Glucides": [
        { name: "Riz basmati", quantity: "2 kg", checked: false },
        { name: "Patates douces", quantity: "1.5 kg", checked: false },
        { name: "Flocons d'avoine", quantity: "1 kg", checked: false },
        { name: "Pain complet", quantity: "2 pains", checked: false }
    ],
    "Légumes": [
        { name: "Brocoli", quantity: "1 kg", checked: false },
        { name: "Haricots verts", quantity: "800 g", checked: false },
        { name: "Salade verte", quantity: "3 sachets", checked: false },
        { name: "Tomates", quantity: "1 kg", checked: false },
        { name: "Concombre", quantity: "3", checked: false }
    ],
    "Produits laitiers": [
        { name: "Fromage blanc 0%", quantity: "6 pots", checked: false },
        { name: "Yaourt grec", quantity: "8 pots", checked: false }
    ],
    "Fruits": [
        { name: "Bananes", quantity: "12", checked: false },
        { name: "Pommes", quantity: "8", checked: false },
        { name: "Fruits rouges surgelés", quantity: "1 kg", checked: false }
    ],
    "Autres": [
        { name: "Amandes", quantity: "500 g", checked: false },
        { name: "Huile d'olive", quantity: "1 bouteille", checked: false },
        { name: "Épices variées", quantity: "selon besoins", checked: false }
    ]
};

// ========================================
// INITIALIZATION
// ========================================

window.addEventListener('DOMContentLoaded', () => {
    loadFromStorage();
    
    setTimeout(() => {
        document.getElementById('loading').classList.add('hidden');
        
        if (localStorage.getItem('onboardingComplete') === 'true') {
            showMainApp();
        } else {
            document.getElementById('onboarding').classList.remove('hidden');
        }
    }, 1000);
    
    // Set today's date for weight logger
    const today = new Date().toISOString().split('T')[0];
    if (document.getElementById('weightDate')) {
        document.getElementById('weightDate').value = today;
    }
});

function loadFromStorage() {
    const savedProfiles = localStorage.getItem('profiles');
    if (savedProfiles) {
        profiles = JSON.parse(savedProfiles);
    }
    
    const savedCurrentProfile = localStorage.getItem('currentProfile');
    if (savedCurrentProfile) {
        currentProfile = savedCurrentProfile;
    }
    
    const savedWeek = localStorage.getItem('currentWeek');
    if (savedWeek) {
        currentWeek = parseInt(savedWeek);
    } else {
        // Calculer la semaine actuelle automatiquement
        currentWeek = getProgramWeekNumber();
    }
    
    // Mettre à jour la phase en fonction de la semaine
    currentPhase = getCurrentPhase();
    
    const savedTodayMeals = localStorage.getItem('todayMeals');
    if (savedTodayMeals) {
        todayMeals = JSON.parse(savedTodayMeals);
    }
    
    // Charger les repas consommés
    loadConsumedMeals();
    
    // Initialiser currentViewDate à aujourd'hui
    currentViewDate = new Date();
    
    // Charger les plans complétés depuis le storage
    const savedAggressivePlans = localStorage.getItem('aggressiveWeeklyPlans');
    if (savedAggressivePlans) {
        const loaded = JSON.parse(savedAggressivePlans);
        Object.keys(loaded).forEach(week => {
            aggressiveWeeklyPlans[week] = loaded[week];
        });
    }
    
    const savedNormalPlans = localStorage.getItem('normalWeeklyPlans');
    if (savedNormalPlans) {
        const loaded = JSON.parse(savedNormalPlans);
        Object.keys(loaded).forEach(week => {
            normalWeeklyPlans[week] = loaded[week];
        });
    }
}

function saveToStorage() {
    localStorage.setItem('profiles', JSON.stringify(profiles));
    localStorage.setItem('currentProfile', currentProfile);
    localStorage.setItem('currentWeek', currentWeek.toString());
    localStorage.setItem('currentPhase', currentPhase.toString());
    localStorage.setItem('todayMeals', JSON.stringify(todayMeals));
    localStorage.setItem('aggressiveWeeklyPlans', JSON.stringify(aggressiveWeeklyPlans));
    localStorage.setItem('normalWeeklyPlans', JSON.stringify(normalWeeklyPlans));
}

// ========================================
// ONBOARDING
// ========================================

function nextStep(stepNumber) {
    document.querySelectorAll('.onboarding-step').forEach(step => {
        step.classList.add('hidden');
    });
    document.getElementById('step' + stepNumber).classList.remove('hidden');
}

function saveProfile(profileKey) {
    const profile = profiles[profileKey];
    profile.name = document.getElementById('name' + capitalizeFirst(profileKey)).value;
    profile.sex = document.getElementById('sex' + capitalizeFirst(profileKey)).value;
    profile.height = parseInt(document.getElementById('height' + capitalizeFirst(profileKey)).value);
    profile.weight = parseFloat(document.getElementById('weight' + capitalizeFirst(profileKey)).value);
    profile.targetWeight = parseFloat(document.getElementById('targetWeight' + capitalizeFirst(profileKey)).value);
    profile.deadline = document.getElementById('deadline' + capitalizeFirst(profileKey)).value;
    profile.intensity = document.getElementById('intensity' + capitalizeFirst(profileKey)).value;
    
    if (profileKey === 'elodie') {
        profile.postpartum = document.getElementById('postpartumElodie').checked;
    }
    
    saveToStorage();
}

function finishOnboarding() {
    saveProfile('elodie');
    localStorage.setItem('onboardingComplete', 'true');
    document.getElementById('onboarding').classList.add('hidden');
    showMainApp();
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// ========================================
// MAIN APP
// ========================================

function showMainApp() {
    document.getElementById('mainApp').classList.remove('hidden');
    updateDashboard();
}

// ========================================
// NAVIGATION PAR JOUR
// ========================================

function navigateDay(direction) {
    // direction: -1 pour précédent, +1 pour suivant
    currentViewDate = new Date(currentViewDate);
    currentViewDate.setDate(currentViewDate.getDate() + direction);
    
    // Mise à jour de l'affichage
    updateCurrentDayDisplay();
    updateTodayWorkout();
    updateNutrition();
}

function updateCurrentDayDisplay() {
    const options = { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' };
    const dateStr = currentViewDate.toLocaleDateString('fr-FR', options);
    const capitalizedDate = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
    
    // Calculer le jour du programme
    const diffTime = currentViewDate - PROGRAM_START_DATE;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    const weekNum = Math.ceil(diffDays / 7);
    const dayInWeek = ((diffDays - 1) % 7) + 1;
    
    document.getElementById('currentDayDisplay').textContent = capitalizedDate;
    document.getElementById('currentDayInfo').textContent = `Jour ${diffDays} - Semaine ${weekNum} - Jour ${dayInWeek}/7`;
}

// ========================================
// VALIDATION DES REPAS
// ========================================

function loadConsumedMeals() {
    const saved = localStorage.getItem('consumedMeals');
    if (saved) {
        consumedMeals = JSON.parse(saved);
    }
}

function saveConsumedMeals() {
    localStorage.setItem('consumedMeals', JSON.stringify(consumedMeals));
}

function getDateKey(date) {
    return date.toISOString().split('T')[0];
}

function toggleMealConsumed(mealIndex) {
    const dateKey = getDateKey(currentViewDate);
    
    if (!consumedMeals[dateKey]) {
        consumedMeals[dateKey] = {};
    }
    if (!consumedMeals[dateKey][currentProfile]) {
        consumedMeals[dateKey][currentProfile] = {};
    }
    
    // Toggle
    const isConsumed = consumedMeals[dateKey][currentProfile][mealIndex];
    consumedMeals[dateKey][currentProfile][mealIndex] = !isConsumed;
    
    saveConsumedMeals();
    updateNutrition(); // Refresh pour afficher la coche
    updateConsumedMacros(); // Mettre à jour les macros consommées
}

function isMealConsumed(mealIndex) {
    const dateKey = getDateKey(currentViewDate);
    return consumedMeals[dateKey]?.[currentProfile]?.[mealIndex] || false;
}

function updateConsumedMacros() {
    const dateKey = getDateKey(currentViewDate);
    const plans = getNutritionPlans();
    const plan = plans[currentProfile];
    
    let totalCal = 0, totalProt = 0, totalCarbs = 0, totalFat = 0;
    
    plan.meals.forEach((meal, idx) => {
        if (isMealConsumed(idx)) {
            totalCal += meal.calories;
            totalProt += meal.protein;
            totalCarbs += meal.carbs;
            totalFat += meal.fat;
        }
    });
    
    document.getElementById('consumedCalories').textContent = totalCal;
    document.getElementById('consumedProtein').textContent = totalProt;
    document.getElementById('consumedCarbs').textContent = totalCarbs;
    document.getElementById('consumedFat').textContent = totalFat;
}

// ========================================
// DASHBOARD
// ========================================

function updateDashboard() {
    // Update profile name
    document.getElementById('currentProfileName').textContent = profiles[currentProfile].name;
    
    // Update current day display
    updateCurrentDayDisplay();
    
    // Update deadline
    const deadline = new Date(profiles[currentProfile].deadline);
    const today = new Date();
    const daysRemaining = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
    document.getElementById('daysRemaining').textContent = daysRemaining;
    
    // Update phase info banner
    const phaseInfo = getPhaseInfo();
    const phaseColor = phaseInfo.phase === 1 ? 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)' : 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)';
    document.getElementById('phaseInfoBanner').style.background = phaseColor;
    document.getElementById('phaseInfoBanner').innerHTML = `
        <h3 style="margin: 0 0 10px 0; font-size: 1.5rem;">${phaseInfo.icon} ${phaseInfo.name}</h3>
        <p style="margin: 0 0 15px 0; font-size: 1rem;">${phaseInfo.description} - Semaine ${phaseInfo.week}</p>
        <div style="background: rgba(255,255,255,0.15); padding: 15px; border-radius: 8px; text-align: left; max-width: 600px; margin: 0 auto;">
            <strong style="display: block; margin-bottom: 10px; font-size: 1.1rem;">📋 Règles de la phase :</strong>
            <ul style="margin: 0; padding-left: 25px;">
                ${phaseInfo.rules.map(rule => `<li style="margin: 5px 0;">${rule}</li>`).join('')}
            </ul>
        </div>
    `;
    
    // Update today's workout
    updateTodayWorkout();
    
    // Update nutrition
    updateNutrition();
    
    // Update stats
    updateStats();
}

function updateTodayWorkout() {
    // Get current day of week (0 = Sunday, 1 = Monday, etc.)
    const today = new Date().getDay();
    const adjustedDay = today === 0 ? 6 : today - 1; // Convert to 0 = Monday
    
    const weeklyPlans = getWeeklyPlans();
    const weekInCycle = ((currentWeek - 1) % 4) + 1;
    const todayPlan = weeklyPlans[weekInCycle][adjustedDay];
    
    if (todayPlan.type === 'rest') {
        document.getElementById('todayWorkout').innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <h3>🌴 Jour de repos</h3>
                <p style="color: #6b7280;">Récupération active : marche, étirements légers</p>
            </div>
        `;
        return;
    }
    
    const workout = workoutTemplates[todayPlan.type];
    document.getElementById('workoutTitle').textContent = workout.title;
    document.getElementById('workoutDuration').textContent = workout.duration;
    document.getElementById('workoutIntensity').textContent = workout.intensity;
    document.getElementById('workoutCalories').textContent = workout.calories;
    
    const exercisesList = workout.exercises.slice(0, 5).map(ex => 
        `<li>
            <strong>${ex.name}</strong> - ${ex.detail}<br>
            <span style="font-size: 0.85rem; color: #6b7280;">💪 ${ex.muscles}</span>
        </li>`
    ).join('');
    
    document.getElementById('workoutExercises').innerHTML = `
        <p style="margin-bottom: 10px; color: #6b7280; font-style: italic;">${workout.description}</p>
        <ul>${exercisesList}</ul>
        <p style="margin-top: 10px; font-size: 0.9rem; color: #6b7280;">+ ${workout.exercises.length - 5} exercices supplémentaires</p>
        <div class="workout-change-select" style="margin-top: 15px;">
            <label for="workoutTypeSelect" style="display: block; font-size: 0.9rem; font-weight: 600; color: var(--primary); margin-bottom: 8px;">🔄 Changer d'entraînement :</label>
            <select id="workoutTypeSelect" onchange="changeWorkoutFromSelect(this.value)" style="width: 100%; padding: 10px; border: 2px solid var(--light-gray); border-radius: 8px; font-size: 0.95rem; cursor: pointer;">
                <option value="">-- Choisir un type --</option>
                <option value="hiit">💥 HIIT Intense - Rameur + Corde (650 kcal)</option>
                <option value="strength">💪 Force - Circuit Full Body (380 kcal)</option>
                <option value="cardio">🏃 Cardio Endurance (420 kcal)</option>
                <option value="abs">🔥 Abdos Killer (280 kcal)</option>
                <option value="mobility">🧘 Mobilité & Stretching (180 kcal)</option>
                <option value="tabata">⚡ Tabata Full Body (350 kcal)</option>
                <option value="yoga">🕉️ Yoga Flow Débutant (200 kcal)</option>
            </select>
        </div>
    `;
}

function updateNutrition() {
    const plans = getNutritionPlans();
    const plan = plans[currentProfile];
    document.getElementById('targetCalories').textContent = plan.targetCalories;
    document.getElementById('targetProtein').textContent = plan.protein;
    document.getElementById('targetCarbs').textContent = plan.carbs;
    document.getElementById('targetFat').textContent = plan.fat;
    
    // Fasting timer
    updateFastingTimer();
    
    // Obtenir les repas du jour avec rotation automatique des recettes
    const dailyMeals = getDailyMeals(currentProfile, currentPhase, currentViewDate);
    
    // Meals
    const mealsHTML = dailyMeals.map((meal, idx) => {
        // Déterminer le type de repas pour les alternatives
        let mealType = '';
        if (currentPhase === 1) {
            // Phase 1: pas de petit-déj (jeûne)
            if (idx === 0) mealType = 'lunch';
            else if (idx === 1) mealType = 'snack';
            else if (idx === 2) mealType = 'dinner';
        } else {
            // Phase 2: avec petit-déj
            if (idx === 0) mealType = 'breakfast';
            else if (idx === 1) mealType = 'lunch';
            else if (idx === 2) mealType = 'snack';
            else if (idx === 3) mealType = 'dinner';
        }
        
        const hasAlternatives = mealType; // Toujours avoir des alternatives
        const isConsumed = isMealConsumed(idx);
        
        return `
        <div class="meal-card ${isConsumed ? 'meal-consumed' : ''}">
            <div class="meal-validation">
                <label class="meal-checkbox">
                    <input type="checkbox" ${isConsumed ? 'checked' : ''} onchange="toggleMealConsumed(${idx})">
                    <span class="checkmark">✓</span>
                    <span class="check-label">${isConsumed ? 'Consommé' : 'Valider'}</span>
                </label>
            </div>
            <div class="meal-header" onclick="toggleMealDetails(${idx})">
                <div>
                    <span class="meal-emoji">${meal.emoji}</span>
                    <div class="meal-info">
                        <strong>${meal.time} - ${meal.name}</strong><br>
                        <span class="meal-description">${meal.description}</span>
                    </div>
                </div>
                <button class="btn-expand" id="expand${idx}">▼</button>
            </div>
            <div class="meal-macros">
                <span class="macro-badge calories">${meal.calories} kcal</span>
                <span class="macro-badge protein">P: ${meal.protein}g</span>
                <span class="macro-badge carbs">C: ${meal.carbs}g</span>
                <span class="macro-badge fat">L: ${meal.fat}g</span>
            </div>
            ${hasAlternatives ? `
                <div class="meal-alternatives-select">
                    <label for="altSelect${idx}">🔄 Changer de recette :</label>
                    <select id="altSelect${idx}" onchange="selectAlternativeFromDropdown(${idx}, this.value, '${mealType}')" onclick="event.stopPropagation()">
                        <option value="">-- Choisir une alternative --</option>
                    </select>
                </div>
            ` : ''}
            <div class="meal-details" id="mealDetails${idx}" style="display: none;">
                <div class="ingredients-section">
                    <h4>📋 Ingrédients</h4>
                    <ul>
                        ${meal.ingredients.map(ing => `<li>${ing}</li>`).join('')}
                    </ul>
                </div>
                <div class="instructions-section">
                    <h4>👨‍🍳 Préparation</h4>
                    <ol>
                        ${meal.instructions.map(inst => `<li>${inst}</li>`).join('')}
                    </ol>
                </div>
                ${meal.mealPrep ? `<div class="meal-prep-note"><strong>Meal Prep:</strong> ${meal.mealPrep}</div>` : ''}
            </div>
        </div>
        `;
    }).join('');
    
    document.getElementById('mealsToday').innerHTML = mealsHTML;
    
    // Peupler les selects d'alternatives
    dailyMeals.forEach((meal, idx) => {
        let mealType = '';
        if (currentPhase === 1) {
            if (idx === 0) mealType = 'lunch';
            else if (idx === 1) mealType = 'snack';
            else if (idx === 2) mealType = 'dinner';
        } else {
            if (idx === 0) mealType = 'breakfast';
            else if (idx === 1) mealType = 'lunch';
            else if (idx === 2) mealType = 'snack';
            else if (idx === 3) mealType = 'dinner';
        }
        if (mealType) populateAlternativesSelect(idx, mealType);
    });
    
    updateConsumedMacros(); // Mettre à jour les macros consommées
}

function toggleMealDetails(index) {
    const details = document.getElementById('mealDetails' + index);
    const expandBtn = document.getElementById('expand' + index);
    
    if (details.style.display === 'none') {
        details.style.display = 'block';
        expandBtn.textContent = '▲';
        expandBtn.style.transform = 'rotate(180deg)';
    } else {
        details.style.display = 'none';
        expandBtn.textContent = '▼';
        expandBtn.style.transform = 'rotate(0deg)';
    }
}

// Afficher les alternatives de repas
function populateAlternativesSelect(mealIndex, mealType) {
    const alternatives = getMealAlternatives(currentProfile, currentPhase, mealType);
    const selectElement = document.getElementById(`altSelect${mealIndex}`);
    
    if (!selectElement || alternatives.length === 0) return;
    
    // Peupler le select avec les alternatives
    const optionsHTML = alternatives.map(alt => 
        `<option value="${alt.id}">${alt.emoji} ${alt.name} (${alt.calories} kcal)</option>`
    ).join('');
    
    selectElement.innerHTML = `
        <option value="">-- Choisir une alternative --</option>
        ${optionsHTML}
    `;
}

function selectAlternativeFromDropdown(mealIndex, altId, mealType) {
    if (!altId) return; // Si aucune sélection
    
    const alternatives = getMealAlternatives(currentProfile, currentPhase, mealType);
    const selectedAlt = alternatives.find(alt => alt.id === altId);
    
    if (selectedAlt) {
        swapMeal(mealIndex, selectedAlt);
        // Réinitialiser le select après le changement
        setTimeout(() => {
            const selectElement = document.getElementById(`altSelect${mealIndex}`);
            if (selectElement) selectElement.value = '';
        }, 100);
    }
}

function changeWorkoutFromSelect(newType) {
    if (!newType) return;
    
    // Trouver le jour actuel dans le plan
    const weekPlans = currentPhase === 1 ? aggressiveWeeklyPlans : normalWeeklyPlans;
    const weekNumber = ((currentWeek - 1) % 4) + 1;
    const weekPlan = weekPlans[weekNumber];
    const today = new Date().getDay();
    const dayIndex = today === 0 ? 6 : today - 1;
    
    // Mettre à jour le plan du jour
    weekPlan[dayIndex].type = newType;
    saveToStorage();
    
    // Recharger l'affichage
    updateDashboard();
    
    // Réinitialiser le select
    setTimeout(() => {
        const select = document.getElementById('workoutTypeSelect');
        if (select) select.value = '';
    }, 100);
}

function updateFastingTimer() {
    const now = new Date();
    const hours = now.getHours();
    
    if (hours >= 12 && hours < 20) {
        document.getElementById('fastingTimer').textContent = "✅ Fenêtre ouverte";
        document.getElementById('fastingTimer').style.color = "#10b981";
    } else if (hours < 12) {
        const hoursLeft = 12 - hours;
        const minutesLeft = 60 - now.getMinutes();
        document.getElementById('fastingTimer').textContent = `Ouverture dans ${hoursLeft}h${minutesLeft}m`;
    } else {
        document.getElementById('fastingTimer').textContent = "🔒 Fenêtre fermée";
        document.getElementById('fastingTimer').style.color = "#ef4444";
    }
}

// Fonction pour changer le type d'entraînement du jour
function changeWorkout(currentType) {
    const allTypes = ['hiit', 'strength', 'cardio', 'abs', 'mobility', 'tabata', 'yoga'];
    const otherTypes = allTypes.filter(type => type !== currentType);
    
    const workoutsHTML = otherTypes.map(type => {
        const workout = workoutTemplates[type];
        return `
            <div class="alternative-card" onclick="selectWorkout('${type}')">
                <div class="alt-header">
                    <span class="meal-emoji">💪</span>
                    <strong>${workout.title}</strong>
                </div>
                <div class="alt-macros">
                    <span class="macro-badge calories">⏱ ${workout.duration} min</span>
                    <span class="macro-badge protein">🔥 ${workout.intensity}</span>
                    <span class="macro-badge carbs">~${workout.calories} kcal</span>
                </div>
                <div class="alt-details">
                    <p>${workout.description}</p>
                    <p style="font-size: 0.9rem; color: #6b7280; margin-top: 5px;">${workout.exercises.length} exercices</p>
                </div>
            </div>
        `;
    }).join('');
    
    const modalHTML = `
        <div class="modal-overlay" id="workoutChangeModal" onclick="closeWorkoutChangeModal(event)">
            <div class="modal-content alternatives-modal" onclick="event.stopPropagation()">
                <div class="modal-header">
                    <h3>🔄 Choisir un autre entraînement</h3>
                    <button class="modal-close" onclick="closeWorkoutChangeModal(event)">✕</button>
                </div>
                <div class="modal-body">
                    <p class="modal-hint">Sélectionnez le type d'entraînement que vous voulez faire aujourd'hui</p>
                    ${workoutsHTML}
                </div>
            </div>
        </div>
    `;
    
    const existingModal = document.getElementById('workoutChangeModal');
    if (existingModal) existingModal.remove();
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function selectWorkout(newType) {
    // Mettre à jour l'affichage avec le nouveau workout
    const today = new Date().getDay();
    const adjustedDay = today === 0 ? 6 : today - 1;
    
    const weeklyPlans = getWeeklyPlans();
    const weekInCycle = ((currentWeek - 1) % 4) + 1;
    weeklyPlans[weekInCycle][adjustedDay].type = newType; // Modifier temporairement
    
    // Rafraîchir l'affichage
    updateTodayWorkout();
    closeWorkoutChangeModal();
    
    // Notification
    const workout = workoutTemplates[newType];
    alert(`✅ Entraînement changé !\n\n${workout.title}\n${workout.duration} min - ${workout.intensity}`);
}

function closeWorkoutChangeModal(event) {
    if (event) event.stopPropagation();
    const modal = document.getElementById('workoutChangeModal');
    if (modal) modal.remove();
}

function updateStats() {
    const weeklyPlans = getWeeklyPlans();
    const weekInCycle = ((currentWeek - 1) % 4) + 1;
    const plan = weeklyPlans[weekInCycle];
    const completedThisWeek = plan.filter(d => d.completed && d.type !== 'rest').length;
    const totalThisWeek = plan.filter(d => d.type !== 'rest').length;
    
    document.getElementById('weekWorkouts').textContent = `${completedThisWeek}/${totalThisWeek}`;
    
    const caloriesBurned = completedThisWeek * 450; // Average
    document.getElementById('weekCalories').textContent = caloriesBurned;
    
    const currentWeight = profiles[currentProfile].weight;
    document.getElementById('currentWeight').textContent = currentWeight.toFixed(1) + ' kg';
}

// ========================================
// PROFILE SWITCHING
// ========================================

function switchProfile(profileKey) {
    currentProfile = profileKey;
    saveToStorage();
    
    document.querySelectorAll('.profile-switch button').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById('btn' + capitalizeFirst(profileKey)).classList.add('active');
    
    document.getElementById('currentProfileName').textContent = capitalizeFirst(profileKey);
    
    updateDashboard();
    
    // Refresh current tab
    const activeTab = document.querySelector('.tab.active');
    if (activeTab) {
        const tabName = activeTab.textContent.includes('Aujourd\'hui') ? 'today' :
                       activeTab.textContent.includes('Planning') ? 'planning' :
                       activeTab.textContent.includes('Exercices') ? 'workouts' :
                       activeTab.textContent.includes('Recettes') ? 'recipes' :
                       activeTab.textContent.includes('Courses') ? 'shopping' : 
                       activeTab.textContent.includes('Stats') ? 'progress' : 'today';
        showTab(tabName);
    }
}

// ========================================
// RECIPE LIBRARY - Bibliothèque complète
// ========================================

// Fonction pour compiler TOUTES les recettes depuis les alternatives
function getAllRecipes() {
    const allRecipes = [];
    
    // Seuils stricts pour classification des phases basés sur les calories
    const phaseThresholds = {
        breakfast: { phase1Max: 0, phase2Max: 600 },      // Phase 1 = jeûne, Phase 2 = petit-déj
        lunch: { phase1Max: 650, phase2Max: 900 },         // Phase 1 = max 650 kcal, Phase 2 = max 900 kcal
        snack: { phase1Max: 250, phase2Max: 350 },         // Phase 1 = max 250 kcal, Phase 2 = max 350 kcal
        dinner: { phase1Max: 450, phase2Max: 650 }         // Phase 1 = max 450 kcal, Phase 2 = max 650 kcal
    };
    
    function assignPhaseByCalories(recipe, category) {
        const thresholds = phaseThresholds[category];
        if (!thresholds) return 2; // Par défaut phase 2
        
        if (recipe.calories <= thresholds.phase1Max) {
            return 1; // Phase agressive - très basses calories
        } else {
            return 2; // Phase normale - sèche modérée
        }
    }
    
    // Phase 1 - Jade (originellement "agressive" mais on reclassifie par calories)
    lunchAlternativesAggressiveJade.forEach(r => {
        allRecipes.push({
            ...r,
            category: 'lunch',
            phase: assignPhaseByCalories(r, 'lunch'),
            profile: 'jade',
            weekOneSafe: true
        });
    });
    
    snackAlternativesAggressiveJade.forEach(r => {
        allRecipes.push({
            ...r,
            category: 'snack',
            phase: assignPhaseByCalories(r, 'snack'),
            profile: 'jade',
            weekOneSafe: true
        });
    });
    
    dinnerAlternativesAggressiveJade.forEach(r => {
        allRecipes.push({
            ...r,
            category: 'dinner',
            phase: assignPhaseByCalories(r, 'dinner'),
            profile: 'jade',
            weekOneSafe: true
        });
    });
    
    // Phase 1 - Élodie (originellement "agressive" mais on reclassifie par calories)
    lunchAlternativesAggressiveElodie.forEach(r => {
        allRecipes.push({
            ...r,
            category: 'lunch',
            phase: assignPhaseByCalories(r, 'lunch'),
            profile: 'elodie',
            weekOneSafe: true
        });
    });
    
    snackAlternativesAggressiveElodie.forEach(r => {
        allRecipes.push({
            ...r,
            category: 'snack',
            phase: assignPhaseByCalories(r, 'snack'),
            profile: 'elodie',
            weekOneSafe: true
        });
    });
    
    dinnerAlternativesAggressiveElodie.forEach(r => {
        allRecipes.push({
            ...r,
            category: 'dinner',
            phase: assignPhaseByCalories(r, 'dinner'),
            profile: 'elodie',
            weekOneSafe: true
        });
    });
    
    // Phase 2 - Jade (originellement "normale" mais on reclassifie par calories)
    breakfastAlternativesNormalJade.forEach(r => {
        allRecipes.push({
            ...r,
            category: 'breakfast',
            phase: assignPhaseByCalories(r, 'breakfast'),
            profile: 'jade',
            weekOneSafe: false
        });
    });
    
    lunchAlternativesNormalJade.forEach(r => {
        allRecipes.push({
            ...r,
            category: 'lunch',
            phase: assignPhaseByCalories(r, 'lunch'),
            profile: 'jade',
            weekOneSafe: false
        });
    });
    
    snackAlternativesNormalJade.forEach(r => {
        allRecipes.push({
            ...r,
            category: 'snack',
            phase: assignPhaseByCalories(r, 'snack'),
            profile: 'jade',
            weekOneSafe: false
        });
    });
    
    dinnerAlternativesNormalJade.forEach(r => {
        allRecipes.push({
            ...r,
            category: 'dinner',
            phase: assignPhaseByCalories(r, 'dinner'),
            profile: 'jade',
            weekOneSafe: false
        });
    });
    
    // Phase 2 - Élodie (originellement "normale" mais on reclassifie par calories)
    breakfastAlternativesNormalElodie.forEach(r => {
        allRecipes.push({
            ...r,
            category: 'breakfast',
            phase: assignPhaseByCalories(r, 'breakfast'),
            profile: 'elodie',
            weekOneSafe: false
        });
    });
    
    lunchAlternativesNormalElodie.forEach(r => {
        allRecipes.push({
            ...r,
            category: 'lunch',
            phase: assignPhaseByCalories(r, 'lunch'),
            profile: 'elodie',
            weekOneSafe: false
        });
    });
    
    snackAlternativesNormalElodie.forEach(r => {
        allRecipes.push({
            ...r,
            category: 'snack',
            phase: assignPhaseByCalories(r, 'snack'),
            profile: 'elodie',
            weekOneSafe: false
        });
    });
    
    dinnerAlternativesNormalElodie.forEach(r => {
        allRecipes.push({
            ...r,
            category: 'dinner',
            phase: assignPhaseByCalories(r, 'dinner'),
            profile: 'elodie',
            weekOneSafe: false
        });
    });
    
    // Ajouter les recettes mixed avec classification stricte par calories
    const mixedAndTorchRecipes = [
        {
            id: 'mixed1',
            category: 'lunch',
            name: "Poke Bowl Complet",
            emoji: "🥙",
            cookingMethod: "mixed",
            calories: 620,
            protein: 54,
            carbs: 68,
            fat: 16,
            addedSugar: 0,
            weekOneSafe: true,
            ingredients: ["150g thon ou saumon cru", "120g riz sushi", "80g edamame", "50g avocat", "50g concombre", "Algues wakame", "Sauce soja, sésame"],
            instructions: ["Cuire le riz et laisser refroidir", "Couper le poisson en cubes", "Mariner avec sauce soja 10 min", "Disposer tous les ingrédients dans un bol", "Parsemer de sésame et algues"]
        },
        {
            id: 'mixed2',
            category: 'dinner',
            name: "Chili Con Carne Protéiné",
            emoji: "🌶️",
            cookingMethod: "stovetop",
            calories: 580,
            protein: 58,
            carbs: 55,
            fat: 14,
            addedSugar: 0,
            weekOneSafe: true,
            ingredients: ["200g bœuf haché 5%", "150g haricots rouges", "100g riz complet cuit", "80g tomates concassées", "50g oignons", "Chili, cumin, paprika", "Ail"],
            instructions: ["Faire revenir oignons et ail", "Ajouter le bœuf, faire dorer", "Ajouter tomates, haricots, épices", "Laisser mijoter 20-25 min", "Servir sur le riz complet", "Garnir de coriandre fraîche"]
        },
        {
            id: 'mixed3',
            category: 'breakfast',
            name: "Bowl Açai Protéiné",
            emoji: "🫐",
            cookingMethod: "mixed",
            calories: 450,
            protein: 32,
            carbs: 58,
            fat: 12,
            addedSugar: 8,
            weekOneSafe: false,
            ingredients: ["1 sachet açai (100g)", "1 banane congelée", "30g whey vanille", "100ml lait d'amande", "Toppings: granola, fruits, coco"],
            instructions: ["Mixer açai, banane, whey, lait", "Verser dans un bol", "Garnir de granola, fruits frais", "Ajouter copeaux de coco", "Consommer immédiatement"]
        }
    ];
    
    mixedAndTorchRecipes.forEach(recipe => {
        allRecipes.push({
            ...recipe,
            phase: assignPhaseByCalories(recipe, recipe.category),
            profile: 'mixed',
            weekOneSafe: recipe.weekOneSafe
        });
    });
    
    return allRecipes;
}

// Ancien tableau statique - à supprimer après migration
const oldAllRecipes = [
    // Petit-déjeuners
    {
        id: 'breakfast1',
        category: 'breakfast',
        name: "Porridge Protéiné aux Fruits",
        emoji: "🥣",
        calories: 420,
        protein: 28,
        carbs: 52,
        fat: 12,
        ingredients: [
            "80g flocons d'avoine",
            "30g protéine whey vanille",
            "250ml lait d'amande",
            "1 banane",
            "100g fruits rouges",
            "10g amandes effilées",
            "1 c. à café miel"
        ],
        instructions: [
            "Faire cuire les flocons d'avoine dans le lait d'amande 5 min",
            "Laisser tiédir, incorporer la whey",
            "Couper la banane en rondelles",
            "Garnir avec fruits rouges, banane, amandes",
            "Arroser de miel"
        ]
    },
    {
        id: 'breakfast2',
        category: 'breakfast',
        name: "Omelette Complète Protéinée",
        emoji: "🍳",
        calories: 380,
        protein: 32,
        carbs: 28,
        fat: 16,
        ingredients: [
            "3 œufs entiers",
            "100g blancs d'œufs liquides",
            "50g fromage frais 0%",
            "100g champignons",
            "50g épinards frais",
            "2 tranches pain complet",
            "Sel, poivre, fines herbes"
        ],
        instructions: [
            "Faire revenir champignons et épinards à la poêle",
            "Battre les œufs avec le fromage frais",
            "Verser dans la poêle, cuire à feu doux",
            "Plier l'omelette en deux",
            "Servir avec le pain complet toasté"
        ]
    },
    // Déjeuners
    {
        id: 'lunch1',
        category: 'lunch',
        name: "Bowl Poulet Grillé Méditerranéen",
        emoji: "🍗",
        calories: 650,
        protein: 65,
        carbs: 70,
        fat: 12,
        ingredients: [
            "200g blanc de poulet",
            "150g riz basmati (poids cuit)",
            "100g courgettes",
            "80g poivrons rouges",
            "1 c. à soupe huile d'olive",
            "Épices: paprika, ail, herbes de Provence"
        ],
        instructions: [
            "Faire cuire le riz basmati selon les instructions",
            "Couper le poulet en lanières, assaisonner avec paprika et ail",
            "Griller le poulet à la poêle 5-6 min de chaque côté",
            "Faire sauter les légumes coupés avec l'huile d'olive",
            "Assembler dans un bol: riz, légumes, poulet grillé"
        ]
    },
    {
        id: 'lunch2',
        category: 'lunch',
        name: "Buddha Bowl Quinoa Saumon",
        emoji: "🥗",
        calories: 580,
        protein: 48,
        carbs: 55,
        fat: 18,
        ingredients: [
            "150g saumon frais",
            "100g quinoa cuit",
            "100g edamame",
            "80g avocat",
            "100g chou rouge râpé",
            "Sauce: sauce soja, gingembre, sésame"
        ],
        instructions: [
            "Cuire le quinoa selon les instructions",
            "Griller le saumon à la poêle 4-5 min/côté",
            "Cuire les edamame à la vapeur 5 min",
            "Disposer tous les ingrédients dans un bol",
            "Préparer la sauce et arroser"
        ]
    },
    // Collations
    {
        id: 'snack1',
        category: 'snack',
        name: "Shake Protéiné Banane-Beurre de Cacahuète",
        emoji: "💪",
        calories: 350,
        protein: 35,
        carbs: 40,
        fat: 8,
        ingredients: [
            "1 dose whey vanille (30g)",
            "1 banane moyenne",
            "1 c. à soupe beurre de cacahuète",
            "250ml lait d'amande",
            "3-4 glaçons"
        ],
        instructions: [
            "Mixer tous les ingrédients ensemble",
            "Ajuster la consistance avec plus de lait si nécessaire",
            "Consommer dans les 30 min après l'entraînement"
        ]
    },
    {
        id: 'snack2',
        category: 'snack',
        name: "Yaourt Grec aux Fruits Rouges",
        emoji: "🍓",
        calories: 220,
        protein: 20,
        carbs: 25,
        fat: 8,
        ingredients: [
            "150g yaourt grec 0%",
            "100g fruits rouges (fraises, myrtilles, framboises)",
            "5g graines de chia",
            "1 c. à café miel"
        ],
        instructions: [
            "Laver les fruits rouges frais (ou décongeler)",
            "Mélanger le yaourt grec avec le miel",
            "Ajouter les fruits rouges",
            "Parsemer de graines de chia",
            "Laisser reposer 5 min pour que les graines gonflent"
        ]
    },
    // Dîners
    {
        id: 'dinner1',
        category: 'dinner',
        name: "Saumon Rôti & Patate Douce au Four",
        emoji: "🐟",
        calories: 720,
        protein: 55,
        carbs: 50,
        fat: 38,
        ingredients: [
            "180g pavé de saumon",
            "200g patate douce",
            "150g salade verte mixte",
            "10g huile d'olive",
            "1/2 citron",
            "Aneth, sel, poivre"
        ],
        instructions: [
            "Préchauffer le four à 200°C",
            "Couper la patate douce en cubes, arroser d'huile d'olive",
            "Enfourner les patates 25-30 min",
            "Assaisonner le saumon avec citron, aneth, sel et poivre",
            "Cuire le saumon à la poêle 4-5 min de chaque côté",
            "Servir avec la salade fraîche assaisonnée"
        ]
    },
    {
        id: 'dinner2',
        category: 'dinner',
        name: "Bœuf Sauté Asiatique & Légumes",
        emoji: "🥩",
        calories: 620,
        protein: 58,
        carbs: 48,
        fat: 20,
        ingredients: [
            "180g bœuf maigre en lanières",
            "150g riz thaï cuit",
            "100g brocoli",
            "80g poivrons",
            "50g oignons",
            "Sauce: sauce soja, ail, gingembre"
        ],
        instructions: [
            "Faire mariner le bœuf 15 min dans la sauce",
            "Faire sauter le bœuf à feu vif 3-4 min",
            "Réserver le bœuf, faire sauter les légumes",
            "Remettre le bœuf, mélanger",
            "Servir sur le riz"
        ]
    },
    // Recettes Air Fryer
    {
        id: 'airfryer1',
        category: 'lunch',
        name: "Poulet Croustillant Air Fryer",
        emoji: "🍗",
        cookingMethod: "air-fryer",
        calories: 480,
        protein: 62,
        carbs: 35,
        fat: 12,
        addedSugar: 0,
        weekOneSafe: true,
        ingredients: [
            "200g blanc de poulet",
            "30g chapelure panko",
            "1 œuf battu",
            "150g patate douce en cubes",
            "100g haricots verts",
            "Paprika, ail en poudre, sel, poivre",
            "Spray huile d'olive"
        ],
        instructions: [
            "Préchauffer l'air fryer à 200°C",
            "Assaisonner le poulet avec paprika, ail, sel, poivre",
            "Passer dans l'œuf battu puis dans la chapelure",
            "Placer dans l'air fryer avec les cubes de patate douce",
            "Cuire 18-20 min en retournant à mi-cuisson",
            "Cuire les haricots verts séparément à la vapeur 5 min",
            "Servir chaud avec un filet de citron"
        ]
    },
    {
        id: 'airfryer2',
        category: 'lunch',
        name: "Saumon Teriyaki Air Fryer",
        emoji: "🐟",
        cookingMethod: "air-fryer",
        calories: 520,
        protein: 48,
        carbs: 42,
        fat: 18,
        addedSugar: 6,
        weekOneSafe: false,
        ingredients: [
            "180g pavé de saumon",
            "2 c. à soupe sauce teriyaki",
            "120g riz basmati cuit",
            "100g brocoli",
            "50g edamame",
            "Graines de sésame"
        ],
        instructions: [
            "Mariner le saumon dans la sauce teriyaki 15 min",
            "Préchauffer l'air fryer à 180°C",
            "Placer le saumon dans l'air fryer",
            "Cuire 10-12 min selon l'épaisseur",
            "Cuire le brocoli et edamame à la vapeur",
            "Servir sur le riz avec les légumes",
            "Parsemer de graines de sésame"
        ]
    },
    {
        id: 'airfryer3',
        category: 'snack',
        name: "Frites de Légumes Air Fryer",
        emoji: "🥕",
        cookingMethod: "air-fryer",
        calories: 180,
        protein: 4,
        carbs: 32,
        fat: 5,
        addedSugar: 0,
        weekOneSafe: true,
        ingredients: [
            "150g patate douce",
            "100g courgette",
            "80g carottes",
            "1 c. à soupe huile d'olive",
            "Paprika, cumin, sel"
        ],
        instructions: [
            "Couper tous les légumes en bâtonnets",
            "Mélanger avec l'huile et les épices",
            "Préchauffer l'air fryer à 200°C",
            "Disposer en une seule couche",
            "Cuire 15 min en secouant à mi-cuisson",
            "Servir avec yaourt grec nature"
        ]
    },
    {
        id: 'airfryer4',
        category: 'dinner',
        name: "Crevettes Cajun Air Fryer",
        emoji: "🦐",
        cookingMethod: "air-fryer",
        calories: 380,
        protein: 52,
        carbs: 28,
        fat: 8,
        addedSugar: 0,
        weekOneSafe: true,
        ingredients: [
            "250g grosses crevettes décortiquées",
            "2 c. à café épices cajun",
            "100g riz complet cuit",
            "100g poivrons mélangés",
            "80g oignons",
            "1 c. à soupe huile d'olive",
            "Citron vert"
        ],
        instructions: [
            "Enrober les crevettes d'épices cajun",
            "Mélanger légumes avec huile",
            "Préchauffer l'air fryer à 200°C",
            "Cuire les légumes 8 min",
            "Ajouter les crevettes, cuire 5-6 min",
            "Servir sur le riz avec quartiers de citron vert"
        ]
    },
    // Recettes Four
    {
        id: 'oven1',
        category: 'lunch',
        name: "Sheet Pan Poulet Méditerranéen",
        emoji: "🍗",
        cookingMethod: "oven",
        calories: 620,
        protein: 68,
        carbs: 52,
        fat: 15,
        addedSugar: 0,
        weekOneSafe: true,
        ingredients: [
            "200g blanc de poulet en morceaux",
            "200g patate douce en cubes",
            "150g courgette",
            "100g tomates cerises",
            "80g oignons rouges",
            "2 c. à soupe huile d'olive",
            "Herbes de Provence, ail, sel, poivre"
        ],
        instructions: [
            "Préchauffer le four à 220°C",
            "Disposer tous les ingrédients sur une plaque",
            "Arroser d'huile d'olive et assaisonner",
            "Mélanger pour bien enrober",
            "Enfourner 25-30 min en remuant à mi-cuisson",
            "Servir chaud avec un quartier de citron"
        ]
    },
    {
        id: 'oven2',
        category: 'dinner',
        name: "Saumon en Papillote au Four",
        emoji: "🐟",
        cookingMethod: "oven",
        calories: 550,
        protein: 52,
        carbs: 38,
        fat: 22,
        addedSugar: 0,
        weekOneSafe: true,
        ingredients: [
            "180g pavé de saumon",
            "150g asperges vertes",
            "100g tomates cerises",
            "1/2 citron en tranches",
            "Aneth frais, ail, sel, poivre",
            "1 c. à soupe huile d'olive",
            "120g quinoa cuit"
        ],
        instructions: [
            "Préchauffer le four à 200°C",
            "Placer le saumon sur papier sulfurisé",
            "Disposer asperges et tomates autour",
            "Ajouter citron, aneth, ail, huile",
            "Fermer la papillote hermétiquement",
            "Enfourner 15-18 min",
            "Servir avec le quinoa"
        ]
    },
    {
        id: 'oven3',
        category: 'lunch',
        name: "Gratin de Légumes Protéiné",
        emoji: "🥘",
        cookingMethod: "oven",
        calories: 480,
        protein: 38,
        carbs: 45,
        fat: 16,
        addedSugar: 0,
        weekOneSafe: true,
        ingredients: [
            "150g blanc de poulet cuit haché",
            "200g brocoli",
            "150g chou-fleur",
            "100g fromage blanc 0%",
            "30g fromage râpé light",
            "1 œuf",
            "Muscade, sel, poivre"
        ],
        instructions: [
            "Préchauffer le four à 180°C",
            "Cuire brocoli et chou-fleur à la vapeur 5 min",
            "Mélanger fromage blanc, œuf, muscade",
            "Disposer légumes et poulet dans un plat",
            "Verser le mélange fromage blanc",
            "Parsemer de fromage râpé",
            "Enfourner 25-30 min jusqu'à doré"
        ]
    },
    {
        id: 'oven4',
        category: 'dinner',
        name: "Poulet Rôti Entier aux Herbes",
        emoji: "🍗",
        cookingMethod: "oven",
        calories: 680,
        protein: 72,
        carbs: 48,
        fat: 20,
        addedSugar: 0,
        weekOneSafe: true,
        ingredients: [
            "250g cuisse de poulet avec peau",
            "200g pommes de terre grenaille",
            "150g carottes",
            "100g oignons",
            "Romarin, thym, ail entier",
            "2 c. à soupe huile d'olive",
            "Sel, poivre"
        ],
        instructions: [
            "Préchauffer le four à 200°C",
            "Assaisonner le poulet avec herbes, sel, poivre",
            "Disposer dans un plat avec légumes",
            "Arroser d'huile d'olive",
            "Enfourner 45-50 min",
            "Arroser régulièrement du jus de cuisson",
            "Laisser reposer 5 min avant de servir"
        ]
    },
    // Recettes Plaques (Stovetop)
    {
        id: 'stovetop1',
        category: 'lunch',
        name: "Sauté de Bœuf aux Légumes",
        emoji: "🥩",
        cookingMethod: "stovetop",
        calories: 580,
        protein: 58,
        carbs: 52,
        fat: 16,
        addedSugar: 0,
        weekOneSafe: true,
        ingredients: [
            "180g bœuf maigre en lanières",
            "150g riz basmati cuit",
            "100g poivrons",
            "80g brocoli",
            "50g oignons",
            "2 gousses d'ail",
            "Sauce soja, gingembre frais"
        ],
        instructions: [
            "Faire mariner le bœuf avec soja et gingembre 15 min",
            "Chauffer un wok à feu vif",
            "Saisir le bœuf 2-3 min, réserver",
            "Faire sauter l'ail et les légumes 5 min",
            "Remettre le bœuf, mélanger 2 min",
            "Servir immédiatement sur le riz"
        ]
    },
    {
        id: 'stovetop2',
        category: 'breakfast',
        name: "Pancakes Protéinés à la Poêle",
        emoji: "🥞",
        cookingMethod: "stovetop",
        calories: 420,
        protein: 35,
        carbs: 48,
        fat: 10,
        addedSugar: 2,
        weekOneSafe: false,
        ingredients: [
            "80g flocons d'avoine mixés",
            "30g whey vanille",
            "2 œufs",
            "100ml lait d'amande",
            "1/2 c. à café levure",
            "100g fruits rouges",
            "1 c. à café sirop d'érable"
        ],
        instructions: [
            "Mixer tous les ingrédients sauf les fruits",
            "Laisser reposer la pâte 5 min",
            "Chauffer une poêle antiadhésive",
            "Verser des petites louches de pâte",
            "Cuire 2-3 min de chaque côté",
            "Servir avec fruits rouges et sirop"
        ]
    },
    {
        id: 'stovetop3',
        category: 'dinner',
        name: "Poêlée de Crevettes à l'Ail",
        emoji: "🦐",
        cookingMethod: "stovetop",
        calories: 420,
        protein: 55,
        carbs: 32,
        fat: 10,
        addedSugar: 0,
        weekOneSafe: true,
        ingredients: [
            "250g crevettes",
            "4 gousses d'ail émincées",
            "100g courgettes en tagliatelles",
            "80g tomates cerises",
            "Persil frais",
            "1 c. à soupe huile d'olive",
            "Citron, piment"
        ],
        instructions: [
            "Chauffer l'huile dans une poêle",
            "Faire revenir l'ail 1 min",
            "Ajouter les crevettes, cuire 3-4 min",
            "Ajouter courgettes et tomates, 3 min",
            "Assaisonner avec persil, citron, piment",
            "Servir immédiatement"
        ]
    },
    {
        id: 'stovetop4',
        category: 'lunch',
        name: "Omelette Fitness Complète",
        emoji: "🍳",
        cookingMethod: "stovetop",
        calories: 450,
        protein: 42,
        carbs: 35,
        fat: 16,
        addedSugar: 0,
        weekOneSafe: true,
        ingredients: [
            "3 œufs entiers",
            "100g blancs d'œufs",
            "80g champignons",
            "50g épinards",
            "30g fromage light",
            "2 tranches pain complet",
            "Tomates cerises"
        ],
        instructions: [
            "Faire sauter champignons et épinards",
            "Battre les œufs ensemble",
            "Verser dans la poêle sur les légumes",
            "Cuire à feu doux 4-5 min",
            "Ajouter le fromage, plier en deux",
            "Servir avec pain complet toasté"
        ]
    },
    // Recettes Chalumeau (Torch)
    {
        id: 'torch1',
        category: 'dinner',
        name: "Thon Mi-Cuit au Chalumeau",
        emoji: "🐟",
        cookingMethod: "torch",
        calories: 520,
        protein: 62,
        carbs: 42,
        fat: 12,
        addedSugar: 0,
        weekOneSafe: true,
        ingredients: [
            "200g pavé de thon frais",
            "120g riz sushi cuit",
            "80g edamame",
            "50g avocat",
            "Sauce soja, wasabi",
            "Graines de sésame",
            "Gingembre mariné"
        ],
        instructions: [
            "Assaisonner le thon avec sel et poivre",
            "Saisir rapidement à la poêle 30 sec/côté",
            "Utiliser le chalumeau pour caraméliser la surface 15-20 sec",
            "Trancher finement",
            "Dresser sur le riz avec edamame et avocat",
            "Parsemer de sésame, servir avec sauce soja"
        ]
    },
    {
        id: 'torch2',
        category: 'lunch',
        name: "Saumon Brûlé Sauce Teriyaki",
        emoji: "🔥",
        cookingMethod: "torch",
        calories: 580,
        protein: 52,
        carbs: 48,
        fat: 18,
        addedSugar: 5,
        weekOneSafe: false,
        ingredients: [
            "180g pavé de saumon",
            "2 c. à soupe sauce teriyaki",
            "120g riz thaï cuit",
            "100g pak choi",
            "50g carottes râpées",
            "Oignons verts, sésame"
        ],
        instructions: [
            "Cuire le saumon à la poêle 3 min/côté",
            "Badigeonner de sauce teriyaki",
            "Utiliser le chalumeau pour caraméliser 20-30 sec",
            "Faire sauter le pak choi 2 min",
            "Dresser sur le riz avec légumes",
            "Garnir d'oignons verts et sésame"
        ]
    },
    {
        id: 'torch3',
        category: 'snack',
        name: "Yaourt Grec Brûlé Protéiné",
        emoji: "🍮",
        cookingMethod: "torch",
        calories: 280,
        protein: 28,
        carbs: 32,
        fat: 5,
        addedSugar: 8,
        weekOneSafe: false,
        ingredients: [
            "150g yaourt grec 0%",
            "15g protéine whey vanille",
            "2 c. à café cassonade",
            "100g fruits rouges",
            "Amandes effilées"
        ],
        instructions: [
            "Mélanger yaourt et whey",
            "Verser dans un ramequin",
            "Saupoudrer uniformément de cassonade",
            "Passer le chalumeau jusqu'à caramélisation",
            "Laisser refroidir 2 min",
            "Garnir de fruits rouges et amandes"
        ]
    },
    {
        id: 'torch4',
        category: 'dinner',
        name: "Poulet Laqué au Chalumeau",
        emoji: "🍗",
        cookingMethod: "torch",
        calories: 560,
        protein: 64,
        carbs: 52,
        fat: 10,
        addedSugar: 4,
        weekOneSafe: false,
        ingredients: [
            "200g blanc de poulet",
            "2 c. à soupe sauce soja",
            "1 c. à soupe miel",
            "150g riz complet cuit",
            "100g brocoli",
            "Ail, gingembre"
        ],
        instructions: [
            "Mélanger soja, miel, ail, gingembre",
            "Cuire le poulet à la poêle 5 min/côté",
            "Badigeonner de sauce",
            "Caraméliser au chalumeau 30 sec",
            "Cuire le brocoli à la vapeur",
            "Servir sur le riz"
        ]
    },
    // Autres recettes variées
    {
        id: 'mixed1',
        category: 'lunch',
        name: "Poke Bowl Complet",
        emoji: "🥙",
        cookingMethod: "mixed",
        calories: 620,
        protein: 54,
        carbs: 68,
        fat: 16,
        addedSugar: 0,
        weekOneSafe: true,
        ingredients: [
            "150g thon ou saumon cru",
            "120g riz sushi",
            "80g edamame",
            "50g avocat",
            "50g concombre",
            "Algues wakame",
            "Sauce soja, sésame"
        ],
        instructions: [
            "Cuire le riz et laisser refroidir",
            "Couper le poisson en cubes",
            "Mariner avec sauce soja 10 min",
            "Disposer tous les ingrédients dans un bol",
            "Parsemer de sésame et algues"
        ]
    },
    {
        id: 'mixed2',
        category: 'dinner',
        name: "Chili Con Carne Protéiné",
        emoji: "🌶️",
        cookingMethod: "stovetop",
        calories: 580,
        protein: 58,
        carbs: 55,
        fat: 14,
        addedSugar: 0,
        weekOneSafe: true,
        ingredients: [
            "200g bœuf haché 5%",
            "150g haricots rouges",
            "100g riz complet cuit",
            "80g tomates concassées",
            "50g oignons",
            "Chili, cumin, paprika",
            "Ail"
        ],
        instructions: [
            "Faire revenir oignons et ail",
            "Ajouter le bœuf, faire dorer",
            "Ajouter tomates, haricots, épices",
            "Laisser mijoter 20-25 min",
            "Servir sur le riz complet",
            "Garnir de coriandre fraîche"
        ]
    },
    {
        id: 'mixed3',
        category: 'breakfast',
        name: "Bowl Açai Protéiné",
        emoji: "🫐",
        cookingMethod: "mixed",
        calories: 450,
        protein: 32,
        carbs: 58,
        fat: 12,
        addedSugar: 8,
        weekOneSafe: false,
        ingredients: [
            "1 sachet açai (100g)",
            "1 banane congelée",
            "30g whey vanille",
            "100ml lait d'amande",
            "Toppings: granola, fruits, coco"
        ],
        instructions: [
            "Mixer açai, banane, whey, lait",
            "Verser dans un bol",
            "Garnir de granola, fruits frais",
            "Ajouter copeaux de coco",
            "Consommer immédiatement"
        ]
    }
];

// ========================================
// TAB NAVIGATION
// ========================================

function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.add('hidden');
    });
    
    // Remove active from all tab buttons
    document.querySelectorAll('.tab').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById('tab-' + tabName).classList.remove('hidden');
    
    // Add active to button
    const tabTexts = {
        'today': 'Aujourd',
        'planning': 'Planning',
        'workouts': 'Exercices',
        'recipes': 'Recettes',
        'shopping': 'Courses',
        'progress': 'Stats'
    };
    
    document.querySelectorAll('.tab').forEach(btn => {
        if (btn.textContent.toLowerCase().includes(tabTexts[tabName].toLowerCase())) {
            btn.classList.add('active');
        }
    });
    
    // Load tab-specific content
    if (tabName === 'planning') {
        loadWeeklyPlan();
    } else if (tabName === 'workouts') {
        loadWorkoutsLibrary();
    } else if (tabName === 'recipes') {
        loadRecipesLibrary();
    } else if (tabName === 'progress') {
        loadProgress();
    } else if (tabName === 'shopping') {
        if (!document.getElementById('shoppingList').innerHTML.trim()) {
            generateShoppingList();
        }
    } else if (tabName === 'today') {
        updateDashboard();
    }
}

function showTabFromSession() {
    // Show navigation menu from session screen
    const menu = confirm('Retourner au menu principal?\n\nVotre progression sera sauvegardée.');
    if (menu) {
        exitWorkout();
    }
}

// ========================================
// PLANNING TAB
// ========================================

function loadWeeklyPlan() {
    const phaseFilter = document.getElementById('planningPhaseFilter')?.value || 'current';
    let targetPhase, weeklyPlans, weekInCycle;
    
    if (phaseFilter === 'current') {
        targetPhase = getCurrentPhase();
        weeklyPlans = getWeeklyPlans();
        weekInCycle = ((currentWeek - 1) % 4) + 1;
    } else {
        targetPhase = parseInt(phaseFilter);
        weeklyPlans = targetPhase === 1 ? aggressiveWeeklyPlans : normalWeeklyPlans;
        weekInCycle = ((currentWeek - 1) % 4) + 1;
    }
    
    const phaseInfo = getPhaseInfo();
    const currentWeekInCycle = weekInCycle;
    const totalWeeksInPhase = targetPhase === 1 ? 4 : 4; // Les deux phases ont 4 semaines
    
    document.getElementById('weekNumber').textContent = `S${currentWeekInCycle} - ${targetPhase === 1 ? 'AGRESSIVE' : 'NORMALE'}`;
    document.getElementById('weekNumberDisplay').textContent = `${currentWeekInCycle}`;
    document.getElementById('totalWeeksInPhase').textContent = `${totalWeeksInPhase}`;
    
    const plan = weeklyPlans[weekInCycle];
    const html = plan.map((day, dayIndex) => {
        if (day.type === 'rest') {
            return `
                <div class="day-card rest ${day.completed ? 'completed' : ''}" onclick="viewDayDetail(${dayIndex})">
                    <h4>${day.day}</h4>
                    <p>🌴 Repos / Récupération active</p>
                    ${day.completed ? '<p style="color: #10b981;">✅ Complété</p>' : ''}
                </div>
            `;
        }
        
        const workout = workoutTemplates[day.type];
        return `
            <div class="day-card ${day.completed ? 'completed' : ''}" onclick="viewDayDetail(${dayIndex})">
                <h4>${day.day}</h4>
                <p><strong>${workout.title}</strong></p>
                <p>⏱ ${workout.duration} min • 🔥 ~${workout.calories} kcal</p>
                ${day.completed ? '<p style="color: #10b981;">✅ Complété</p>' : '<button class="btn btn-primary btn-small" onclick="event.stopPropagation(); startSpecificWorkout(\''+day.type+'\')">Commencer</button>'}
            </div>
        `;
    }).join('');
    
    document.getElementById('weeklyPlan').innerHTML = html;
}

function viewDayDetail(dayIndex) {
    const weeklyPlans = getWeeklyPlans();
    const weekInCycle = ((currentWeek - 1) % 4) + 1;
    const day = weeklyPlans[weekInCycle][dayIndex];
    const dayName = day.day;
    
    document.getElementById('dayDetailTitle').textContent = `${dayName} - Semaine ${currentWeek}`;
    
    // Get week 1 status
    const weekOne = isWeekOne();
    const weekOneMessage = weekOne ? `<div style="background: #fee2e2; border: 2px solid #ef4444; padding: 12px; border-radius: 8px; margin-bottom: 20px;">
        <strong style="color: #dc2626;">⚠️ SEMAINE 1 : 0 SUCRES AJOUTÉS</strong>
    </div>` : '';
    
    let content = weekOneMessage;
    
    // Workout section
    if (day.type === 'rest') {
        content += `
            <div style="background: #f0fdf4; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                <h3 style="color: #16a34a;">🌴 Jour de Repos</h3>
                <p style="color: #6b7280;">Récupération active recommandée :</p>
                <ul style="color: #374151;">
                    <li>Marche légère 20-30 min</li>
                    <li>Étirements doux 10-15 min</li>
                    <li>Hydratation importante</li>
                    <li>Sommeil de qualité</li>
                </ul>
            </div>
        `;
    } else {
        const workout = workoutTemplates[day.type];
        content += `
            <div style="background: #eff6ff; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                <h3 style="color: #2563eb;">💪 Entraînement: ${workout.title}</h3>
                <p style="font-style: italic; color: #6b7280;">${workout.description}</p>
                <div style="display: flex; gap: 10px; margin: 15px 0; flex-wrap: wrap;">
                    <span class="macro-badge calories">⏱ ${workout.duration} min</span>
                    <span class="intensity-badge ${workout.intensity.toLowerCase()}">${workout.intensity}</span>
                    <span class="macro-badge calories">🔥 ${workout.calories} kcal</span>
                </div>
                
                <h4 style="margin-top: 20px;">Exercices :</h4>
                <div style="display: grid; gap: 12px;">
                    ${workout.exercises.map((ex, idx) => `
                        <div style="background: white; padding: 12px; border-radius: 8px; border-left: 4px solid #3b82f6;">
                            <strong>${idx + 1}. ${ex.name}</strong> - ${ex.detail}
                            <div style="font-size: 0.9rem; color: #6b7280; margin-top: 5px;">
                                💪 ${ex.muscles} • 🔥 ~${ex.calories} kcal
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <button class="btn btn-primary" style="margin-top: 15px;" onclick="closeDayDetailModal(); startSpecificWorkout('${day.type}')">
                    Commencer l'entraînement
                </button>
            </div>
        `;
    }
    
    // Nutrition section
    const plans = getNutritionPlans();
    const plan = plans[currentProfile];
    const dayAdjustment = weeklyNutritionVariations[dayIndex];
    const adjustedCalories = Math.round(plan.targetCalories * dayAdjustment.multiplier);
    
    content += `
        <div style="background: #fef3c7; border-radius: 12px; padding: 20px;">
            <h3 style="color: #d97706;">🥗 Nutrition du Jour</h3>
            <p style="color: #6b7280; margin-bottom: 10px;">${dayAdjustment.description}</p>
            
            <div style="display: flex; gap: 10px; margin: 15px 0; flex-wrap: wrap;">
                <span class="macro-badge calories">${adjustedCalories} kcal</span>
                <span class="macro-badge protein">P: ${plan.protein}g</span>
                <span class="macro-badge carbs">G: ${plan.carbs}g</span>
                <span class="macro-badge fat">L: ${plan.fat}g</span>
            </div>
            
            <h4 style="margin-top: 20px;">Repas prévus :</h4>
            <div style="display: grid; gap: 10px;">
                ${plan.meals.map(meal => `
                    <div style="background: white; padding: 12px; border-radius: 8px;">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <span style="font-size: 1.5rem;">${meal.emoji}</span>
                            <div style="flex: 1;">
                                <strong>${meal.time} - ${meal.name}</strong><br>
                                <span style="font-size: 0.9rem; color: #6b7280;">${meal.description}</span>
                            </div>
                        </div>
                        <div style="display: flex; gap: 8px; margin-top: 8px; flex-wrap: wrap;">
                            <span class="macro-badge calories" style="font-size: 0.85rem;">${meal.calories} kcal</span>
                            <span class="macro-badge protein" style="font-size: 0.85rem;">P: ${meal.protein}g</span>
                            <span class="macro-badge carbs" style="font-size: 0.85rem;">C: ${meal.carbs}g</span>
                            <span class="macro-badge fat" style="font-size: 0.85rem;">L: ${meal.fat}g</span>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <button class="btn btn-secondary" style="margin-top: 15px;" onclick="closeDayDetailModal(); showTab('recipes')">
                Voir toutes les recettes
            </button>
        </div>
    `;
    
    document.getElementById('dayDetailContent').innerHTML = content;
    document.getElementById('dayDetailModal').classList.remove('hidden');
}

function closeDayDetailModal() {
    document.getElementById('dayDetailModal').classList.add('hidden');
}

function changeWeek(delta) {
    currentWeek += delta;
    const maxWeeks = Math.ceil((WEDDING_DATE - PROGRAM_START_DATE) / (1000 * 60 * 60 * 24 * 7));
    if (currentWeek < 1) currentWeek = 1;
    if (currentWeek > maxWeeks) currentWeek = maxWeeks;
    
    // Met à jour la phase si on change de semaine
    currentPhase = getCurrentPhase();
    
    saveToStorage();
    loadWeeklyPlan();
    updateDashboard(); // Rafraîchir pour mettre à jour la bannière de phase
}

// ========================================
// WORKOUTS LIBRARY
// ========================================

function loadWorkoutsLibrary() {
    filterWorkouts(); // Initial load with no filter
}

function filterWorkouts() {
    const filter = document.getElementById('workoutFilter').value;
    const search = document.getElementById('workoutSearch').value.toLowerCase();
    
    let workouts = Object.entries(workoutTemplates);
    
    if (filter !== 'all') {
        workouts = workouts.filter(([key, _]) => key === filter);
    }
    
    if (search) {
        workouts = workouts.filter(([_, workout]) => 
            workout.title.toLowerCase().includes(search) ||
            workout.description.toLowerCase().includes(search) ||
            workout.exercises.some(ex => ex.name.toLowerCase().includes(search))
        );
    }
    
    const html = workouts.map(([key, workout]) => `
        <div class="workout-item" onclick="viewWorkoutDetail('${key}')">
            <div class="workout-item-header">
                <h3>${workout.title}</h3>
                <span class="intensity-badge ${workout.intensity.toLowerCase()}">${workout.intensity}</span>
            </div>
            <p class="workout-description">${workout.description}</p>
            <div class="workout-item-meta">
                <span>⏱ ${workout.duration} min</span>
                <span>🔥 ${workout.calories} kcal</span>
                <span>💪 ${workout.exercises.length} exercices</span>
            </div>
            <button class="btn btn-primary btn-small" onclick="event.stopPropagation(); startSpecificWorkout('${key}')">▶ Commencer</button>
        </div>
    `).join('');
    
    document.getElementById('workoutsList').innerHTML = html || '<p style="text-align: center; padding: 40px; color: #6b7280;">Aucun entraînement trouvé</p>';
}

function viewWorkoutDetail(workoutKey) {
    selectedWorkoutForModal = workoutKey;
    const workout = workoutTemplates[workoutKey];
    
    document.getElementById('modalExerciseName').textContent = workout.title;
    
    const content = `
        <div class="modal-workout-details">
            <div class="modal-meta">
                <span class="intensity-badge ${workout.intensity.toLowerCase()}">${workout.intensity}</span>
                <span>⏱ ${workout.duration} min</span>
                <span>🔥 ${workout.calories} kcal</span>
            </div>
            <p class="modal-description">${workout.description}</p>
            
            <h3>Exercices (${workout.exercises.length})</h3>
            <div class="exercise-list">
                ${workout.exercises.map(ex => `
                    <div class="exercise-item-modal">
                        <strong>${ex.name}</strong>
                        <p>${ex.detail}</p>
                        <p style="font-size: 0.85rem; color: #6b7280;">💪 ${ex.muscles}</p>
                        ${ex.instructions ? `<p style="font-size: 0.9rem; margin-top: 5px;"><strong>Technique:</strong> ${ex.instructions}</p>` : ''}
                        ${ex.tips ? `<p style="font-size: 0.9rem; color: #059669; margin-top: 5px;"><strong>💡:</strong> ${ex.tips}</p>` : ''}
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    document.getElementById('modalExerciseContent').innerHTML = content;
    document.getElementById('exerciseModal').classList.remove('hidden');
}

function closeExerciseModal() {
    document.getElementById('exerciseModal').classList.add('hidden');
    selectedWorkoutForModal = null;
}

function startWorkoutFromModal() {
    if (selectedWorkoutForModal) {
        closeExerciseModal();
        startSpecificWorkout(selectedWorkoutForModal);
    }
}

function startSpecificWorkout(workoutKey) {
    currentWorkout = workoutTemplates[workoutKey];
    currentExerciseIndex = 0;
    currentSeconds = 0;
    
    document.getElementById('workoutSession').classList.remove('hidden');
    document.getElementById('sessionTitle').textContent = currentWorkout.title;
    
    loadExercise();
}

// ========================================
// RECIPES LIBRARY
// ========================================

function loadRecipesLibrary() {
    filterRecipes(); // Initial load
}

function filterRecipes() {
    const phaseFilter = document.getElementById('recipePhaseFilter').value;
    const weekFilter = document.getElementById('recipeWeekFilter').value;
    const filter = document.getElementById('recipeFilter').value;
    const search = document.getElementById('recipeSearch').value.toLowerCase();
    
    let recipes = getAllRecipes(); // Utiliser la fonction pour obtenir TOUTES les 119 recettes
    
    // Filter by phase
    if (phaseFilter !== 'all') {
        const targetPhase = parseInt(phaseFilter);
        recipes = recipes.filter(recipe => recipe.phase === targetPhase);
    }
    
    // Filter by week 1 safe only if "current" is selected
    const weekOne = isWeekOne();
    if (weekFilter === 'current' && weekOne) {
        recipes = recipes.filter(recipe => recipe.weekOneSafe === true);
    }
    
    if (filter !== 'all') {
        recipes = recipes.filter(recipe => recipe.category === filter);
    }
    
    if (search) {
        recipes = recipes.filter(recipe => 
            recipe.name.toLowerCase().includes(search) ||
            recipe.ingredients.some(ing => ing.toLowerCase().includes(search))
        );
    }
    
    const weekOneWarning = (weekOne && weekFilter === 'current') ? `
        <div style="background: #fee2e2; border: 2px solid #ef4444; padding: 12px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
            <strong style="color: #dc2626;">⚠️ SEMAINE 1 : Seules les recettes 0 sucres ajoutés sont affichées</strong><br>
            <span style="font-size: 0.9rem; color: #991b1b;">Changez le filtre en "Toutes les recettes" pour voir toutes les options</span>
        </div>
    ` : '';
    
    const getCookingMethodIcon = (method) => {
        switch(method) {
            case 'air-fryer': return '🍟';
            case 'oven': return '🔥';
            case 'stovetop': return '🍳';
            case 'torch': return '🔦';
            case 'mixed': return '👨‍🍳';
            default: return '🍽️';
        }
    };
    
    const html = recipes.map(recipe => {
        // Déterminer le type de repas basé sur l'ID de la recette
        let mealType = 'other';
        if (recipe.id.includes('breakfast')) mealType = 'breakfast';
        else if (recipe.id.includes('lunch')) mealType = 'lunch';
        else if (recipe.id.includes('snack')) mealType = 'snack';
        else if (recipe.id.includes('dinner')) mealType = 'dinner';
        
        return `
        <div class="recipe-item" data-meal-type="${mealType}" onclick="viewRecipeDetail('${recipe.id}')">
            <div class="recipe-emoji">${recipe.emoji}</div>
            <div style="flex: 1;">
                <h3>${recipe.name}</h3>
                ${recipe.cookingMethod ? `<p style="font-size: 0.8rem; color: #6b7280; margin: 2px 0 0 0;">${getCookingMethodIcon(recipe.cookingMethod)} ${recipe.cookingMethod === 'air-fryer' ? 'Air Fryer' : recipe.cookingMethod === 'oven' ? 'Four' : recipe.cookingMethod === 'stovetop' ? 'Plaques' : recipe.cookingMethod === 'torch' ? 'Chalumeau' : 'Mixte'}</p>` : ''}
            </div>
            <div class="recipe-macros-small">
                <span>${recipe.calories} kcal</span>
                <span>P: ${recipe.protein}g</span>
                <span>C: ${recipe.carbs}g</span>
                <span>L: ${recipe.fat}g</span>
            </div>
            ${recipe.weekOneSafe ? '<span style="background: #dcfce7; color: #16a34a; padding: 4px 8px; border-radius: 12px; font-size: 0.7rem; font-weight: bold; white-space: nowrap;">✓ S1</span>' : ''}
        </div>
    `}).join('');
    
    document.getElementById('recipesList').innerHTML = weekOneWarning + (html || '<p style="text-align: center; padding: 40px; color: #6b7280;">Aucune recette trouvée</p>');
}

function viewRecipeDetail(recipeId) {
    const allRecipesArray = getAllRecipes(); // Utiliser la fonction pour obtenir toutes les recettes
    const recipe = allRecipesArray.find(r => r.id === recipeId);
    if (!recipe) return;
    
    selectedRecipeForModal = recipeId;
    
    document.getElementById('modalRecipeName').textContent = `${recipe.emoji} ${recipe.name}`;
    
    const getCookingMethodName = (method) => {
        switch(method) {
            case 'air-fryer': return '🍟 Air Fryer';
            case 'oven': return '🔥 Four';
            case 'stovetop': return '🍳 Plaques / Poêle';
            case 'torch': return '🔦 Chalumeau';
            case 'mixed': return '👨‍🍳 Préparation mixte';
            default: return '';
        }
    };
    
    const content = `
        <div class="modal-recipe-details">
            ${recipe.cookingMethod ? `<p style="background: #dbeafe; padding: 8px 12px; border-radius: 8px; margin-bottom: 15px; text-align: center; font-weight: 500;">${getCookingMethodName(recipe.cookingMethod)}</p>` : ''}
            ${recipe.weekOneSafe ? '<p style="background: #dcfce7; color: #16a34a; padding: 8px 12px; border-radius: 8px; margin-bottom: 15px; text-align: center; font-weight: bold;">✓ Compatible Semaine 1 (0 sucres ajoutés)</p>' : '<p style="background: #fef3c7; color: #d97706; padding: 8px 12px; border-radius: 8px; margin-bottom: 15px; text-align: center;">⚠️ Contient des sucres ajoutés - Éviter en semaine 1</p>'}
            
            <div class="modal-recipe-macros">
                <div class="macro-item">
                    <span class="macro-value">${recipe.calories}</span>
                    <span class="macro-label">kcal</span>
                </div>
                <div class="macro-item">
                    <span class="macro-value">${recipe.protein}g</span>
                    <span class="macro-label">Protéines</span>
                </div>
                <div class="macro-item">
                    <span class="macro-value">${recipe.carbs}g</span>
                    <span class="macro-label">Glucides</span>
                </div>
                <div class="macro-item">
                    <span class="macro-value">${recipe.fat}g</span>
                    <span class="macro-label">Lipides</span>
                </div>
            </div>
            
            <div class="modal-recipe-content">
                <h3>📋 Ingrédients</h3>
                <ul>
                    ${recipe.ingredients.map(ing => `<li>${ing}</li>`).join('')}
                </ul>
                
                <h3>👨‍🍳 Préparation</h3>
                <ol>
                    ${recipe.instructions.map(inst => `<li>${inst}</li>`).join('')}
                </ol>
            </div>
        </div>
    `;
    
    document.getElementById('modalRecipeContent').innerHTML = content;
    document.getElementById('recipeModal').classList.remove('hidden');
}

function closeRecipeModal() {
    document.getElementById('recipeModal').classList.add('hidden');
    selectedRecipeForModal = null;
}

function quickAddRecipe(recipeId) {
    const recipe = allRecipes.find(r => r.id === recipeId);
    if (!recipe) return;
    
    todayMeals.push({
        id: recipeId,
        time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        ...recipe
    });
    
    saveToStorage();
    alert(`✅ "${recipe.name}" ajouté à aujourd'hui!`);
    updateDashboard();
}

function addRecipeToToday() {
    if (selectedRecipeForModal) {
        quickAddRecipe(selectedRecipeForModal);
        closeRecipeModal();
    }
}

function showAddMealDialog() {
    document.getElementById('addMealDialog').classList.remove('hidden');
}

function closeAddMealDialog() {
    document.getElementById('addMealDialog').classList.add('hidden');
}

// ========================================
// NUTRITION TAB WITH DAY SELECTOR
// ========================================

// Plans nutritionnels par jour de la semaine
const weeklyNutritionVariations = {
    0: { // Lundi - Jour lourd
        jadeVariation: 1.0,
        elodieVariation: 1.0,
        focus: "Entraînement intense"
    },
    1: { // Mardi - Repos
        jadeVariation: 0.9,
        elodieVariation: 0.9,
        focus: "Repos - Maintenance"
    },
    2: { // Mercredi - Force
        jadeVariation: 1.0,
        elodieVariation: 1.0,
        focus: "Entraînement force"
    },
    3: { // Jeudi - Cardio
        jadeVariation: 0.95,
        elodieVariation: 0.95,
        focus: "Cardio modéré"
    },
    4: { // Vendredi - Repos
        jadeVariation: 0.9,
        elodieVariation: 0.9,
        focus: "Repos - Maintenance"
    },
    5: { // Samedi - HIIT
        jadeVariation: 1.05,
        elodieVariation: 1.0,
        focus: "HIIT intense"
    },
    6: { // Dimanche - Repos
        jadeVariation: 0.9,
        elodieVariation: 0.9,
        focus: "Repos - Récupération"
    }
};

function loadNutritionDay() {
    const dayIndex = parseInt(document.getElementById('nutritionDay').value);
    const dayNames = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
    const dayInfo = weeklyNutritionVariations[dayIndex];
    
    loadNutritionPlan(dayIndex, dayNames[dayIndex], dayInfo);
}

// ========================================
// NUTRITION TAB
// ========================================

function loadNutritionPlan(dayIndex = 0, dayName = 'Lundi', dayInfo = null) {
    if (!dayInfo) {
        dayInfo = weeklyNutritionVariations[dayIndex];
    }
    
    const plans = getNutritionPlans();
    const plan = plans[currentProfile];
    const variation = currentProfile === 'jade' ? dayInfo.jadeVariation : dayInfo.elodieVariation;
    const adjustedCalories = Math.round(plan.targetCalories * variation);
    const adjustedProtein = Math.round(plan.protein * variation);
    const adjustedCarbs = Math.round(plan.carbs * variation);
    const adjustedFat = Math.round(plan.fat * variation);
    
    const weekOne = isWeekOne();
    const weekOneWarning = weekOne ? `
        <div style="background: #fee2e2; border: 2px solid #ef4444; padding: 15px; border-radius: 12px; margin-bottom: 20px; text-align: center;">
            <strong style="color: #dc2626; font-size: 1.1rem;">⚠️ SEMAINE 1 : 0 SUCRES AJOUTÉS</strong>
            <p style="color: #991b1b; margin: 8px 0 0 0; font-size: 0.95rem;">
                Évitez tous les sucres ajoutés (miel, sirop, desserts sucrés).<br>
                Les fruits naturels sont autorisés avec modération.
            </p>
        </div>
    ` : '';
    
    const html = weekOneWarning + `
        <div class="card nutrition-header">
            <h3>🎯 Objectifs - ${dayName}</h3>
            <p style="text-align: center; color: rgba(255,255,255,0.9); margin-bottom: 15px; font-style: italic;">
                ${dayInfo.focus}
            </p>
            <div class="macros-visual">
                <div class="macro-circle">
                    <div class="macro-value">${adjustedCalories}</div>
                    <div class="macro-label">kcal</div>
                </div>
                <div class="macro-breakdown">
                    <div class="macro-bar">
                        <div class="macro-bar-label">Protéines</div>
                        <div class="macro-bar-fill protein-bar" style="width: ${(adjustedProtein * 4 / adjustedCalories * 100)}%">
                            ${adjustedProtein}g
                        </div>
                    </div>
                    <div class="macro-bar">
                        <div class="macro-bar-label">Glucides</div>
                        <div class="macro-bar-fill carbs-bar" style="width: ${(adjustedCarbs * 4 / adjustedCalories * 100)}%">
                            ${adjustedCarbs}g
                        </div>
                    </div>
                    <div class="macro-bar">
                        <div class="macro-bar-label">Lipides</div>
                        <div class="macro-bar-fill fat-bar" style="width: ${(adjustedFat * 9 / adjustedCalories * 100)}%">
                            ${adjustedFat}g
                        </div>
                    </div>
                </div>
            </div>
            <p style="color: rgba(255,255,255,0.9); margin-top: 15px; text-align: center;">⏰ Jeûne intermittent 16/8 : Manger de 12h à 20h</p>
            ${variation !== 1.0 ? `<p style="color: #fbbf24; text-align: center; margin-top: 10px; font-weight: 600;">
                ${variation < 1.0 ? '📉 Calories réduites pour jour de repos' : '📈 Calories augmentées pour jour intense'}
            </p>` : ''}
        </div>
        
        <div class="meals-container">
            ${plan.meals.map((meal, idx) => {
                const adjustedMealCalories = Math.round(meal.calories * variation);
                const adjustedMealProtein = Math.round(meal.protein * variation);
                const adjustedMealCarbs = Math.round(meal.carbs * variation);
                const adjustedMealFat = Math.round(meal.fat * variation);
                
                return `
                <div class="meal-card" onclick="toggleMealDetailsNutrition(${idx})">
                    <div class="meal-header">
                        <div>
                            <span class="meal-emoji">${meal.emoji}</span>
                            <div class="meal-info">
                                <strong>${meal.time} - ${meal.name}</strong><br>
                                <span class="meal-description">${meal.description}</span>
                            </div>
                        </div>
                        <button class="btn-expand" id="expandNutrition${idx}">▼</button>
                    </div>
                    <div class="meal-macros">
                        <span class="macro-badge calories">${adjustedMealCalories} kcal</span>
                        <span class="macro-badge protein">P: ${adjustedMealProtein}g</span>
                        <span class="macro-badge carbs">C: ${adjustedMealCarbs}g</span>
                        <span class="macro-badge fat">L: ${adjustedMealFat}g</span>
                    </div>
                    <div class="meal-details" id="mealDetailsNutrition${idx}" style="display: none;">
                        ${variation !== 1.0 ? `<div class="adjustment-note">
                            <p><strong>⚠️ Portions ajustées:</strong> ${variation < 1.0 ? 'Réduisez' : 'Augmentez'} les quantités de ${Math.round(Math.abs(1 - variation) * 100)}%</p>
                        </div>` : ''}
                        <div class="ingredients-section">
                            <h4>📋 Ingrédients</h4>
                            <ul>
                                ${meal.ingredients.map(ing => `<li>${ing}</li>`).join('')}
                            </ul>
                        </div>
                        <div class="instructions-section">
                            <h4>👨‍🍳 Préparation</h4>
                            <ol>
                                ${meal.instructions.map(inst => `<li>${inst}</li>`).join('')}
                            </ol>
                        </div>
                    </div>
                </div>
            `}).join('')}
        </div>
    `;
    
    document.getElementById('nutritionPlan').innerHTML = html;
}

function toggleMealDetailsNutrition(index) {
    const details = document.getElementById('mealDetailsNutrition' + index);
    const expandBtn = document.getElementById('expandNutrition' + index);
    
    if (details.style.display === 'none') {
        details.style.display = 'block';
        expandBtn.textContent = '▲';
        expandBtn.style.transform = 'rotate(180deg)';
    } else {
        details.style.display = 'none';
        expandBtn.textContent = '▼';
        expandBtn.style.transform = 'rotate(0deg)';
    }
}

// ========================================
// SHOPPING TAB
// ========================================

function generateShoppingFromMealPlan(weeksCount) {
    const ingredientsList = {};
    const today = new Date(currentViewDate);
    
    // Parcourir les prochaines semaines
    for (let week = 0; week < weeksCount; week++) {
        for (let day = 0; day < 7; day++) {
            const currentDate = new Date(today);
            currentDate.setDate(today.getDate() + (week * 7) + day);
            
            // Obtenir les repas pour ce jour
            const dailyMeals = getDailyMeals(currentProfile, currentPhase, currentDate);
            
            // Extraire les ingrédients de chaque repas
            dailyMeals.forEach(meal => {
                if (meal.ingredients && Array.isArray(meal.ingredients)) {
                    meal.ingredients.forEach(ingredient => {
                        const parsed = parseIngredient(ingredient);
                        if (parsed) {
                            const category = categorizeIngredient(parsed.name);
                            if (!ingredientsList[category]) {
                                ingredientsList[category] = {};
                            }
                            
                            const key = parsed.name.toLowerCase();
                            if (ingredientsList[category][key]) {
                                ingredientsList[category][key].quantity += parsed.quantity;
                            } else {
                                ingredientsList[category][key] = {
                                    name: parsed.name,
                                    quantity: parsed.quantity,
                                    unit: parsed.unit,
                                    checked: false
                                };
                            }
                        }
                    });
                }
            });
        }
    }
    
    // Convertir en format d'affichage
    const finalList = {};
    for (const [category, items] of Object.entries(ingredientsList)) {
        finalList[category] = Object.values(items).map(item => ({
            name: item.name,
            quantity: formatQuantity(item.quantity, item.unit),
            checked: item.checked
        }));
    }
    
    return finalList;
}

function parseIngredient(ingredientStr) {
    // Patterns pour extraire quantité, unité et nom
    const patterns = [
        /^(\d+(?:\.\d+)?)\s*(g|kg|ml|l|cl)\s+(.+)$/i,  // "200g poulet"
        /^(\d+(?:\.\d+)?)\s+c\. à (?:soupe|café)\s+(.+)$/i,  // "1 c. à soupe huile"
        /^(\d+)\s+(.+)$/i,  // "2 œufs"
        /^(.+?)\s*\((\d+(?:\.\d+)?)\s*(g|kg|ml|l|%)\)$/i,  // "Bœuf maigre (220g)"
    ];
    
    for (const pattern of patterns) {
        const match = ingredientStr.match(pattern);
        if (match) {
            if (pattern === patterns[3]) { // Format "Nom (quantité unité)"
                return {
                    name: match[1].trim(),
                    quantity: parseFloat(match[2]),
                    unit: match[3] === '%' ? '' : match[3]
                };
            } else if (pattern === patterns[1]) { // c. à soupe
                return {
                    name: match[2].trim(),
                    quantity: parseFloat(match[1]),
                    unit: 'c. à soupe'
                };
            } else {
                return {
                    name: match[3] || match[2],
                    quantity: parseFloat(match[1]),
                    unit: match[2] && !match[3] ? 'unité' : match[2]
                };
            }
        }
    }
    
    // Si aucun pattern ne correspond, retourner le nom seul
    return {
        name: ingredientStr.trim(),
        quantity: 1,
        unit: 'selon besoins'
    };
}

function categorizeIngredient(name) {
    const lowerName = name.toLowerCase();
    
    if (lowerName.includes('poulet') || lowerName.includes('bœuf') || lowerName.includes('porc') || 
        lowerName.includes('agneau') || lowerName.includes('viande') || lowerName.includes('escalope') ||
        lowerName.includes('pavé') || lowerName.includes('filet')) {
        return 'Viandes';
    }
    
    if (lowerName.includes('saumon') || lowerName.includes('thon') || lowerName.includes('poisson') ||
        lowerName.includes('crevette') || lowerName.includes('cabillaud') || lowerName.includes('sole')) {
        return 'Poissons & Fruits de mer';
    }
    
    if (lowerName.includes('œuf') || lowerName.includes('oeuf')) {
        return 'Œufs & Produits laitiers';
    }
    
    if (lowerName.includes('fromage') || lowerName.includes('yaourt') || lowerName.includes('lait') ||
        lowerName.includes('crème') || lowerName.includes('blanc') && lowerName.includes('0%')) {
        return 'Œufs & Produits laitiers';
    }
    
    if (lowerName.includes('riz') || lowerName.includes('quinoa') || lowerName.includes('avoine') ||
        lowerName.includes('pâtes') || lowerName.includes('pain') || lowerName.includes('semoule') ||
        lowerName.includes('patate') || lowerName.includes('pomme de terre')) {
        return 'Féculents';
    }
    
    if (lowerName.includes('brocoli') || lowerName.includes('courgette') || lowerName.includes('haricot') ||
        lowerName.includes('épinard') || lowerName.includes('salade') || lowerName.includes('tomate') ||
        lowerName.includes('concombre') || lowerName.includes('poivron') || lowerName.includes('légume') ||
        lowerName.includes('champignon') || lowerName.includes('aubergine') || lowerName.includes('carotte')) {
        return 'Légumes';
    }
    
    if (lowerName.includes('banane') || lowerName.includes('pomme') || lowerName.includes('fruit') ||
        lowerName.includes('baie') || lowerName.includes('orange') || lowerName.includes('kiwi')) {
        return 'Fruits';
    }
    
    if (lowerName.includes('huile') || lowerName.includes('beurre') || lowerName.includes('amande') ||
        lowerName.includes('noix') || lowerName.includes('avocat')) {
        return 'Matières grasses';
    }
    
    if (lowerName.includes('épice') || lowerName.includes('sel') || lowerName.includes('poivre') ||
        lowerName.includes('ail') || lowerName.includes('herbe') || lowerName.includes('citron') ||
        lowerName.includes('persil') || lowerName.includes('basilic')) {
        return 'Assaisonnements';
    }
    
    return 'Autres';
}

function formatQuantity(quantity, unit) {
    if (unit === 'unité' && quantity > 1) {
        return `${Math.ceil(quantity)}`;
    }
    
    if (unit === 'g' && quantity >= 1000) {
        return `${(quantity / 1000).toFixed(1).replace('.0', '')} kg`;
    }
    
    if (unit === 'ml' && quantity >= 1000) {
        return `${(quantity / 1000).toFixed(1).replace('.0', '')} L`;
    }
    
    const rounded = quantity >= 10 ? Math.ceil(quantity) : Math.ceil(quantity * 10) / 10;
    return `${rounded.toString().replace('.0', '')} ${unit}`;
}

function generateShoppingList() {
    const weeksCount = parseInt(document.getElementById('shoppingWeeksSelect')?.value || 1);
    
    // Générer la liste basée sur les repas planifiés
    const shoppingList = generateShoppingFromMealPlan(weeksCount);
    
    let html = '';
    for (const [category, items] of Object.entries(shoppingList)) {
        if (items.length > 0) {
            html += `
                <div class="shopping-category">
                    <h3>${category}</h3>
                    <div class="shopping-items">
                        ${items.map((item, idx) => `
                            <div class="shopping-item" id="shop-${category}-${idx}">
                                <input type="checkbox" onchange="toggleShoppingItem('${category}', ${idx})">
                                <span>${item.name}</span>
                                <span style="margin-left: auto; font-weight: 600;">${item.quantity}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
    }
    
    document.getElementById('shoppingList').innerHTML = html || '<p>Aucun ingrédient trouvé pour cette période.</p>';
}

function multiplyQuantity(quantity, multiplier) {
    if (multiplier === 1) return quantity;
    
    // Extraire le nombre et l'unité
    const match = quantity.match(/(\d+(?:\.\d+)?)\s*(.*)/);
    if (match) {
        const value = parseFloat(match[1]) * multiplier;
        const unit = match[2];
        // Arrondir pour éviter les décimales bizarres
        const roundedValue = Math.round(value * 10) / 10;
        return `${roundedValue} ${unit}`;
    }
    return `${quantity} x${multiplier}`;
}

function oldGenerateShoppingList() {
    let html = '';
    
    for (const [category, items] of Object.entries(shoppingTemplate)) {
        html += `
            <div class="shopping-category">
                <h3>${category}</h3>
                <div class="shopping-items">
                    ${items.map((item, idx) => `
                        <div class="shopping-item" id="shop-${category}-${idx}">
                            <input type="checkbox" onchange="toggleShoppingItem('${category}', ${idx})">
                            <span>${item.name}</span>
                            <span style="margin-left: auto; font-weight: 600;">${item.quantity}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    document.getElementById('shoppingList').innerHTML = html;
}

function toggleShoppingItem(category, index) {
    const element = document.getElementById(`shop-${category}-${index}`);
    element.classList.toggle('checked');
}

function exportShoppingPDF() {
    alert('Fonctionnalité PDF : Pour l\'exporter, utilisez Ctrl+P (ou Cmd+P) et sélectionnez "Enregistrer en PDF". La liste sera bien formatée pour l\'impression !');
    window.print();
}

// ========================================
// PROGRESS TAB
// ========================================

function loadProgress() {
    // Jade stats
    const jadeCompleted = 2;
    const jadeTotal = 4;
    document.getElementById('jadeWorkouts').textContent = `${jadeCompleted}/${jadeTotal}`;
    document.getElementById('jadeCalories').textContent = '1250';
    document.getElementById('jadeWeight').textContent = '94.2';
    document.getElementById('jadeChange').textContent = '-0.8';
    document.getElementById('jadeProgress').style.width = `${(jadeCompleted / jadeTotal) * 100}%`;
    
    // Élodie stats
    const elodieCompleted = 3;
    const elodieTotal = 4;
    document.getElementById('elodieWorkouts').textContent = `${elodieCompleted}/${elodieTotal}`;
    document.getElementById('elodieCalories').textContent = '890';
    document.getElementById('elodieWeight').textContent = '86.1';
    document.getElementById('elodieChange').textContent = '-0.9';
    document.getElementById('elodieProgress').style.width = `${(elodieCompleted / elodieTotal) * 100}%`;
}

function logWeight() {
    const weight = parseFloat(document.getElementById('newWeight').value);
    const date = document.getElementById('weightDate').value;
    
    if (!weight || !date) {
        alert('Veuillez remplir le poids et la date');
        return;
    }
    
    profiles[currentProfile].weight = weight;
    saveToStorage();
    
    alert(`✅ Poids enregistré : ${weight} kg le ${date}`);
    
    document.getElementById('newWeight').value = '';
    updateDashboard();
    loadProgress();
}

// ========================================
// WORKOUT SESSION
// ========================================

let currentWorkout = null;

function startWorkout() {
    const today = new Date().getDay();
    const adjustedDay = today === 0 ? 6 : today - 1;
    const weeklyPlans = getWeeklyPlans();
    const weekInCycle = ((currentWeek - 1) % 4) + 1;
    const todayPlan = weeklyPlans[weekInCycle][adjustedDay];
    
    if (todayPlan.type === 'rest') {
        alert('Aujourd\'hui est un jour de repos ! Profitez-en pour récupérer 💪');
        return;
    }
    
    currentWorkout = workoutTemplates[todayPlan.type];
    currentExerciseIndex = 0;
    currentSeconds = 0;
    
    document.getElementById('workoutSession').classList.remove('hidden');
    document.getElementById('sessionTitle').textContent = currentWorkout.title;
    
    loadExercise();
}

function loadExercise() {
    if (currentExerciseIndex >= currentWorkout.exercises.length) {
        completeWorkout();
        return;
    }
    
    const exercise = currentWorkout.exercises[currentExerciseIndex];
    currentSeconds = exercise.duration;
    
    document.getElementById('currentExercise').textContent = exercise.name;
    
    // Create detailed exercise info
    const detailsHTML = `
        <div style="text-align: center; max-width: 500px; margin: 0 auto;">
            <p style="font-size: 1rem; color: #6b7280; margin: 10px 0;">${exercise.detail}</p>
            <div style="background: rgba(37, 99, 235, 0.1); padding: 15px; border-radius: 8px; margin: 15px 0;">
                <p style="margin: 8px 0;"><strong>💪 Muscles:</strong> ${exercise.muscles}</p>
                ${exercise.instructions ? `<p style="margin: 8px 0; font-size: 0.9rem;"><strong>📋 Technique:</strong> ${exercise.instructions}</p>` : ''}
                ${exercise.tips ? `<p style="margin: 8px 0; font-size: 0.9rem; color: #059669;"><strong>💡 Astuce:</strong> ${exercise.tips}</p>` : ''}
            </div>
        </div>
    `;
    
    document.getElementById('exerciseDetail').innerHTML = detailsHTML;
    document.getElementById('exerciseIndex').textContent = currentExerciseIndex + 1;
    document.getElementById('totalExercises').textContent = currentWorkout.exercises.length;
    
    updateTimerDisplay();
}

function toggleTimer() {
    if (timerRunning) {
        pauseTimer();
    } else {
        startTimer();
    }
}

function startTimer() {
    timerRunning = true;
    document.getElementById('timerBtn').textContent = '⏸ PAUSE';
    document.getElementById('timerBtn').classList.remove('btn-primary');
    document.getElementById('timerBtn').classList.add('btn-secondary');
    
    timerInterval = setInterval(() => {
        currentSeconds--;
        updateTimerDisplay();
        
        if (currentSeconds <= 0) {
            pauseTimer();
            // Auto-advance to next exercise
            setTimeout(() => {
                skipExercise();
            }, 1000);
        }
    }, 1000);
}

function pauseTimer() {
    timerRunning = false;
    clearInterval(timerInterval);
    document.getElementById('timerBtn').textContent = '▶ REPRENDRE';
    document.getElementById('timerBtn').classList.add('btn-primary');
    document.getElementById('timerBtn').classList.remove('btn-secondary');
}

function updateTimerDisplay() {
    const minutes = Math.floor(currentSeconds / 60);
    const seconds = currentSeconds % 60;
    document.getElementById('timerDisplay').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Update calories burned (estimate)
    const totalExercises = currentWorkout.exercises.length;
    const completedExercises = currentExerciseIndex;
    const caloriesBurned = Math.floor((completedExercises / totalExercises) * currentWorkout.calories);
    document.getElementById('sessionCalories').textContent = caloriesBurned;
}

function skipExercise() {
    pauseTimer();
    currentExerciseIndex++;
    loadExercise();
}

function completeWorkout() {
    pauseTimer();
    
    const today = new Date().getDay();
    const adjustedDay = today === 0 ? 6 : today - 1;
    const weeklyPlans = getWeeklyPlans();
    const weekInCycle = ((currentWeek - 1) % 4) + 1;
    weeklyPlans[weekInCycle][adjustedDay].completed = true;
    
    alert(`🎉 Félicitations ! Vous avez terminé votre séance !\n\n${currentWorkout.title}\n~${currentWorkout.calories} kcal brûlées`);
    
    exitWorkout();
}

function exitWorkout() {
    pauseTimer();
    document.getElementById('workoutSession').classList.add('hidden');
    updateDashboard();
}

function changeWorkoutFromSelect() {
    const select = document.getElementById('workoutSelect');
    const selectedType = select.value;
    
    if (selectedType && workoutTemplates[selectedType]) {
        currentWorkout = workoutTemplates[selectedType];
        updateTodayDisplay();
        showMessage(`Entraînement changé vers : ${currentWorkout.title}`, 'success');
    }
}

function multiplyQuantity(quantity, multiplier) {
    // Extrait le nombre et l'unité de la quantité
    const match = quantity.match(/^(\d+(?:\.\d+)?)\s*(.*)$/);
    if (match) {
        const number = parseFloat(match[1]);
        const unit = match[2];
        return (number * multiplier).toFixed(1).replace('.0', '') + ' ' + unit;
    }
    return quantity; // Si on ne peut pas parser, retourne l'original
}
