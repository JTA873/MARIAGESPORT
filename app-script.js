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
let currentWeek = 2;
let timerRunning = false;
let timerInterval = null;
let currentSeconds = 0;
let currentExerciseIndex = 0;

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
    }
};

// Weekly plan template
const weeklyPlans = {
    1: [
        { day: "Lundi", type: "hiit", completed: false },
        { day: "Mardi", type: "rest", completed: false },
        { day: "Mercredi", type: "strength", completed: false },
        { day: "Jeudi", type: "cardio", completed: false },
        { day: "Vendredi", type: "rest", completed: false },
        { day: "Samedi", type: "hiit", completed: false },
        { day: "Dimanche", type: "rest", completed: false }
    ],
    2: [
        { day: "Lundi", type: "hiit", completed: true },
        { day: "Mardi", type: "rest", completed: true },
        { day: "Mercredi", type: "strength", completed: true },
        { day: "Jeudi", type: "cardio", completed: false },
        { day: "Vendredi", type: "rest", completed: false },
        { day: "Samedi", type: "hiit", completed: false },
        { day: "Dimanche", type: "rest", completed: false }
    ],
    3: [
        { day: "Lundi", type: "hiit", completed: false },
        { day: "Mardi", type: "rest", completed: false },
        { day: "Mercredi", type: "strength", completed: false },
        { day: "Jeudi", type: "cardio", completed: false },
        { day: "Vendredi", type: "hiit", completed: false },
        { day: "Samedi", type: "rest", completed: false },
        { day: "Dimanche", type: "cardio", completed: false }
    ],
    4: [
        { day: "Lundi", type: "hiit", completed: false },
        { day: "Mardi", type: "strength", completed: false },
        { day: "Mercredi", type: "rest", completed: false },
        { day: "Jeudi", type: "hiit", completed: false },
        { day: "Vendredi", type: "cardio", completed: false },
        { day: "Samedi", type: "rest", completed: false },
        { day: "Dimanche", type: "strength", completed: false }
    ]
};

// Nutrition plans
const nutritionPlans = {
    jade: {
        targetCalories: 2200,
        protein: 190,
        carbs: 185,
        fat: 78,
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
                time: "16:00", 
                name: "Collation Post-Training", 
                emoji: "💪",
                description: "Shake Protéiné Banane-Beurre de Cacahuète", 
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
                time: "19:30", 
                name: "Dîner", 
                emoji: "🐟",
                description: "Saumon Rôti & Patate Douce au Four", 
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
                time: "21:00", 
                name: "Snack Nocturne", 
                emoji: "🥜",
                description: "Fromage Blanc Protéiné aux Amandes", 
                calories: 280, 
                protein: 25, 
                carbs: 15, 
                fat: 18,
                ingredients: [
                    "150g fromage blanc 0%",
                    "20g amandes concassées",
                    "1 c. à café miel (optionnel)",
                    "Cannelle"
                ],
                instructions: [
                    "Verser le fromage blanc dans un bol",
                    "Concasser grossièrement les amandes",
                    "Parsemer d'amandes et de cannelle",
                    "Ajouter le miel si désiré"
                ]
            }
        ]
    },
    elodie: {
        targetCalories: 1500,
        protein: 120,
        carbs: 130,
        fat: 55,
        meals: [
            { 
                time: "12:00", 
                name: "Déjeuner", 
                emoji: "🥗",
                description: "Buddha Bowl Poulet Quinoa", 
                calories: 480, 
                protein: 45, 
                carbs: 45, 
                fat: 10,
                ingredients: [
                    "150g blanc de poulet",
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
                ]
            },
            { 
                time: "16:00", 
                name: "Collation", 
                emoji: "🍓",
                description: "Yaourt Grec aux Fruits Rouges", 
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
            { 
                time: "19:30", 
                name: "Dîner", 
                emoji: "🍚",
                description: "Saumon Teriyaki & Légumes Asiatiques", 
                calories: 520, 
                protein: 40, 
                carbs: 45, 
                fat: 22,
                ingredients: [
                    "120g saumon",
                    "80g riz complet (poids cuit)",
                    "150g brocoli",
                    "50g edamame",
                    "1 c. à soupe sauce soja",
                    "Gingembre, ail"
                ],
                instructions: [
                    "Cuire le riz complet (20-25 min)",
                    "Mariner le saumon avec sauce soja, gingembre râpé et ail",
                    "Cuire le saumon à la poêle 4-5 min de chaque côté",
                    "Faire sauter brocoli et edamame 5-6 min",
                    "Servir le saumon sur le riz avec les légumes"
                ]
            },
            { 
                time: "21:00", 
                name: "Snack Léger", 
                emoji: "🥛",
                description: "Fromage Blanc Nature", 
                calories: 80, 
                protein: 15, 
                carbs: 5, 
                fat: 1,
                ingredients: [
                    "100g fromage blanc 0%",
                    "Cannelle ou vanille (optionnel)"
                ],
                instructions: [
                    "Servir le fromage blanc frais",
                    "Saupoudrer de cannelle si désiré"
                ]
            }
        ]
    }
};

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
    }
}

function saveToStorage() {
    localStorage.setItem('profiles', JSON.stringify(profiles));
    localStorage.setItem('currentProfile', currentProfile);
    localStorage.setItem('currentWeek', currentWeek.toString());
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

function updateDashboard() {
    // Update profile name
    document.getElementById('currentProfileName').textContent = profiles[currentProfile].name;
    
    // Update deadline
    const deadline = new Date(profiles[currentProfile].deadline);
    const today = new Date();
    const daysRemaining = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
    document.getElementById('daysRemaining').textContent = daysRemaining;
    
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
    
    const todayPlan = weeklyPlans[currentWeek][adjustedDay];
    
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
    `;
}

function updateNutrition() {
    const plan = nutritionPlans[currentProfile];
    document.getElementById('targetCalories').textContent = plan.targetCalories;
    document.getElementById('targetProtein').textContent = plan.protein;
    document.getElementById('targetCarbs').textContent = plan.carbs;
    document.getElementById('targetFat').textContent = plan.fat;
    
    // Fasting timer
    updateFastingTimer();
    
    // Meals
    const mealsHTML = plan.meals.map((meal, idx) => `
        <div class="meal-card" onclick="toggleMealDetails(${idx})">
            <div class="meal-header">
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
            </div>
        </div>
    `).join('');
    
    document.getElementById('mealsToday').innerHTML = mealsHTML;
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

function updateStats() {
    const completedThisWeek = weeklyPlans[currentWeek].filter(d => d.completed && d.type !== 'rest').length;
    const totalThisWeek = weeklyPlans[currentWeek].filter(d => d.type !== 'rest').length;
    
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
    
    updateDashboard();
    
    // Refresh current tab
    const activeTab = document.querySelector('.tab.active');
    if (activeTab) {
        const tabName = activeTab.textContent.includes('Aujourd\'hui') ? 'today' :
                       activeTab.textContent.includes('Planning') ? 'planning' :
                       activeTab.textContent.includes('Nutrition') ? 'nutrition' :
                       activeTab.textContent.includes('Courses') ? 'shopping' : 'progress';
        showTab(tabName);
    }
}

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
    document.querySelectorAll('.tab').forEach(btn => {
        if (btn.textContent.toLowerCase().includes(tabName === 'today' ? 'aujourd' : tabName)) {
            btn.classList.add('active');
        }
    });
    
    // Load tab-specific content
    if (tabName === 'planning') {
        loadWeeklyPlan();
    } else if (tabName === 'nutrition') {
        loadNutritionPlan();
    } else if (tabName === 'progress') {
        loadProgress();
    }
}

// ========================================
// PLANNING TAB
// ========================================

function loadWeeklyPlan() {
    const plan = weeklyPlans[currentWeek];
    const html = plan.map(day => {
        if (day.type === 'rest') {
            return `
                <div class="day-card rest ${day.completed ? 'completed' : ''}">
                    <h4>${day.day}</h4>
                    <p>🌴 Repos / Récupération active</p>
                </div>
            `;
        }
        
        const workout = workoutTemplates[day.type];
        return `
            <div class="day-card ${day.completed ? 'completed' : ''}">
                <h4>${day.day}</h4>
                <p><strong>${workout.title}</strong></p>
                <p>⏱ ${workout.duration} min • 🔥 ~${workout.calories} kcal</p>
                ${day.completed ? '<p style="color: #10b981;">✅ Complété</p>' : ''}
            </div>
        `;
    }).join('');
    
    document.getElementById('weeklyPlan').innerHTML = html;
}

function changeWeek(delta) {
    currentWeek += delta;
    if (currentWeek < 1) currentWeek = 1;
    if (currentWeek > 4) currentWeek = 4;
    saveToStorage();
    loadWeeklyPlan();
}

// ========================================
// NUTRITION TAB
// ========================================

function loadNutritionPlan() {
    const plan = nutritionPlans[currentProfile];
    const html = `
        <div class="card nutrition-header">
            <h3>🎯 Objectifs Journaliers</h3>
            <div class="macros-visual">
                <div class="macro-circle">
                    <div class="macro-value">${plan.targetCalories}</div>
                    <div class="macro-label">kcal</div>
                </div>
                <div class="macro-breakdown">
                    <div class="macro-bar">
                        <div class="macro-bar-label">Protéines</div>
                        <div class="macro-bar-fill protein-bar" style="width: ${(plan.protein * 4 / plan.targetCalories * 100)}%">
                            ${plan.protein}g
                        </div>
                    </div>
                    <div class="macro-bar">
                        <div class="macro-bar-label">Glucides</div>
                        <div class="macro-bar-fill carbs-bar" style="width: ${(plan.carbs * 4 / plan.targetCalories * 100)}%">
                            ${plan.carbs}g
                        </div>
                    </div>
                    <div class="macro-bar">
                        <div class="macro-bar-label">Lipides</div>
                        <div class="macro-bar-fill fat-bar" style="width: ${(plan.fat * 9 / plan.targetCalories * 100)}%">
                            ${plan.fat}g
                        </div>
                    </div>
                </div>
            </div>
            <p style="color: #6b7280; margin-top: 15px; text-align: center;">⏰ Jeûne intermittent 16/8 : Manger de 12h à 20h</p>
        </div>
        
        <div class="meals-container">
            ${plan.meals.map((meal, idx) => `
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
                        <span class="macro-badge calories">${meal.calories} kcal</span>
                        <span class="macro-badge protein">P: ${meal.protein}g</span>
                        <span class="macro-badge carbs">C: ${meal.carbs}g</span>
                        <span class="macro-badge fat">L: ${meal.fat}g</span>
                    </div>
                    <div class="meal-details" id="mealDetailsNutrition${idx}" style="display: none;">
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
            `).join('')}
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

function generateShoppingList() {
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
    const todayPlan = weeklyPlans[currentWeek][adjustedDay];
    
    if (todayPlan.type === 'rest') {
        alert('Aujourd\'hui est un jour de repos ! Profitez-en pour récupérer 💪');
        return;
    }
    
    currentWorkout = workoutTemplates[todayPlan.type];
    currentExerciseIndex = 0;
    currentSeconds = 0;
    
    document.getElementById('mainApp').classList.add('hidden');
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
    weeklyPlans[currentWeek][adjustedDay].completed = true;
    
    alert(`🎉 Félicitations ! Vous avez terminé votre séance !\n\n${currentWorkout.title}\n~${currentWorkout.calories} kcal brûlées`);
    
    exitWorkout();
}

function exitWorkout() {
    pauseTimer();
    document.getElementById('workoutSession').classList.add('hidden');
    document.getElementById('mainApp').classList.remove('hidden');
    updateDashboard();
}
