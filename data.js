/* ═══════════════════════════════════════════════════════════
   TERRA VÉLO — Serious game SGN · Première STMG
   Contenu pédagogique (chapitres 1, 2, 3)
   Horizon PME — Sara Guirlinger
   ═══════════════════════════════════════════════════════════ */

const PEOPLE = {
  nadia:  { name: 'Nadia Ferrand',  role: 'Fondatrice et directrice générale', service: 'Direction', ini: 'NF', col: '#1A1A1A',
            bio: 'A créé Terra Vélo en 2014 dans un garage. Très présente au début, elle consacre aujourd’hui l’essentiel de son temps au projet d’Albi.' },
  sophie: { name: 'Sophie Lambert', role: 'Assistante administrative et RH', service: 'Direction', ini: 'SL', col: '#6B6B68',
            bio: 'Première salariée de Terra Vélo. Gère la paie, les plannings de congés et l’accueil des nouveaux.' },
  marc:   { name: 'Marc Delpech',   role: 'Comptable', service: 'Direction', ini: 'MD', col: '#8A8A84',
            bio: 'Arrivé en 2019. Suit la trésorerie et le dossier de financement d’Albi.' },
  ines:   { name: 'Inès Moreau',    role: 'Responsable commerciale', service: 'Boutique', ini: 'IM', col: '#C8643B',
            bio: 'Recrutée il y a 14 mois après huit ans dans une enseigne de la grande distribution. Chargée de structurer les ventes.' },
  hugo:   { name: 'Hugo Martin',    role: 'Vendeur', service: 'Boutique', ini: 'HM', col: '#D98A66',
            bio: 'Arrivé il y a 4 mois. Habite Albi.' },
  julien: { name: 'Julien Castex',  role: 'Responsable atelier', service: 'Atelier', ini: 'JC', col: '#4A7A52',
            bio: '15 ans chez Terra Vélo. Encadre les 11 personnes de l’atelier.' },
  karim:  { name: 'Karim Benali',   role: 'Technicien senior', service: 'Atelier', ini: 'KB', col: '#7A9E7E',
            bio: 'Spécialiste des vélos électriques. Chez Terra Vélo depuis 2016.' },
  lea:    { name: 'Léa Vidal',      role: 'Apprentie mécanicienne cycles', service: 'Atelier', ini: 'LV', col: '#9DBFA0',
            bio: '19 ans, en alternance (CAP puis BP). Deuxième année chez Terra Vélo.' },
  thomas: { name: 'Thomas Roux',    role: 'Responsable logistique', service: 'Logistique', ini: 'TR', col: '#5C6F8A',
            bio: 'Gère les réceptions, les livraisons et le stock de vélos à reconditionner.' }
};

/* Organigramme formel : parent → enfants */
const ORG = {
  root: 'nadia',
  staff: ['sophie', 'marc'],
  branches: [
    { head: 'ines',   label: 'Boutique · 6 pers.',   team: ['hugo'],          more: '+ 4 vendeurs' },
    { head: 'julien', label: 'Atelier · 11 pers.',   team: ['karim', 'lea'],  more: '+ 8 techniciens' },
    { head: 'thomas', label: 'Logistique · 4 pers.', team: [],                more: '+ 3 préparateurs' }
  ]
};

const DOSSIER_HTML = `
<div class="doc-card">
  <div class="doc-head"><span>Fiche entreprise</span><span>Terra Vélo SAS</span></div>
  <div class="doc-body">
    <p><strong>Terra Vélo</strong> reconditionne et revend des vélos d’occasion (dont 60 % à assistance électrique), répare toutes marques et loue des vélos aux particuliers et aux entreprises.</p>
    <p>Siège et atelier : zone de Mas de Rest, Gaillac (Tarn). Création : 2014. Effectif : 24 salariés. Projet en cours : ouverture d’une boutique à Albi.</p>
    <p>Slogan : « Chaque vélo mérite une deuxième vie. »</p>
  </div>
</div>`;

const MISSIONS = [
  { id: 'm1', num: 1, title: 'Comprendre l’organisation', ch: 1, badge: 'Organisation comprise',
    intro: `<p>Lundi, 8 h 45. Nadia Ferrand vous accueille dans son bureau, au-dessus de l’atelier. Par la vitre, on voit une vingtaine de vélos suspendus.</p>
            <p class="quote">« Bienvenue. Dans six mois, on ouvre une boutique à Albi. Avant, je veux que quelqu’un d’extérieur me dise ce qui se passe vraiment dans cette entreprise. Commence par comprendre qui on est et avec qui on travaille. »</p>
            <p>Sophie vous remet le carnet d’adresses de l’entreprise et quelques documents.</p>` },
  { id: 'm2', num: 2, title: 'Comprendre les individus', ch: 2, badge: 'Individus analysés',
    intro: `<p>Deuxième semaine. Vous passez vos journées entre l’atelier et la boutique. Vous prenez des notes sur les personnes que vous croisez.</p>
            <p class="quote">« Ici, les gens comptent plus que les machines, dit Nadia. Mais je ne les comprends plus toujours. »</p>` },
  { id: 'm3', num: 3, title: 'Une équipe sous tension', ch: 3, badge: 'Conflit résolu',
    intro: `<p>Troisième semaine. L’ambiance change. Les portes claquent, les mails se multiplient, et un client important vient de repartir furieux.</p>
            <p class="quote">« Je suis prise par Albi, souffle Nadia. Aide-moi à comprendre ce qui coince entre l’atelier et la boutique. »</p>` },
  { id: 'm4', num: 4, title: 'Diagnostic final', ch: 0, badge: 'Diagnostic remis',
    intro: `<p>Trois mois plus tard. La boutique d’Albi ouvre dans six semaines.</p>
            <p class="quote">« Il me faut ta note de diagnostic pour vendredi. Et je dois choisir qui dirigera Albi. Je t’écoute. »</p>
            <p>Cette dernière mission mélange tout ce que vous avez observé. C’est la plus exigeante.</p>` }
];

const EXTRA_BADGE = { after: 'a33', label: 'Réseaux identifiés' };

/* ═══════════════════ ACTIVITÉS ═══════════════════ */
const ACTIVITIES = [

/* ─────────────── MISSION 1 ─────────────── */
{
  id: 'a11', mission: 'm1', ch: 1, title: 'Le carnet d’adresses',
  notions: ['Distinguer entreprise, organisation publique et association'],
  remediation: 'Pour classer une organisation, l’activité ne suffit pas : une association peut vendre, une collectivité peut faire payer un service. Le critère décisif est la finalité (lucrative ou non) et qui décide / à qui profitent les excédents.',
  intro: 'Sophie vous tend le carnet d’adresses de Terra Vélo. Nadia veut savoir avec quels types d’organisations l’entreprise travaille.',
  parts: [{
    type: 'sort', pts: 1,
    q: 'Classez chaque organisation dans la bonne catégorie. Lisez bien chaque fiche : plusieurs sont piégeuses.',
    cats: [ { id: 'E', label: 'Entreprise' }, { id: 'P', label: 'Organisation publique' }, { id: 'A', label: 'Association' } ],
    items: [
      { id: 'i1', cat: 'E', text: '<b>Cycles d’Oc</b> — Grossiste en pièces détachées à Toulouse. SARL de deux associés qui se partagent les bénéfices. 14 salariés.' },
      { id: 'i2', cat: 'A', text: '<b>Roue Libre Gaillac</b> — Atelier participatif où les adhérents apprennent à réparer leur vélo. Vend aussi des vélos réparés. 3 salariés, bureau élu en assemblée générale, excédents réinvestis dans le projet.',
        why: 'Roue Libre vend des vélos et emploie des salariés, mais elle est dirigée par un bureau élu par les adhérents et ne partage pas ses excédents : c’est une association.' },
      { id: 'i3', cat: 'P', text: '<b>Agglomération Gaillac-Graulhet</b> — Construit les pistes cyclables, organise le transport scolaire. Dirigée par des élus, financée surtout par les impôts locaux et des dotations de l’État.' },
      { id: 'i4', cat: 'P', text: '<b>VéloCité</b> — Service de location de vélos de la ville de Gaillac. 2 € l’heure. Géré directement par la mairie avec deux agents municipaux.',
        why: 'VéloCité fait payer ses locations, mais c’est un service de la mairie, géré par des agents publics, au service de l’intérêt général : organisation publique.' },
      { id: 'i5', cat: 'E', text: '<b>La Fabrique à Rayons</b> — Café-atelier vélo créé en SCOP : les 6 salariés sont aussi les associés et se partagent une partie des bénéfices.',
        why: 'Une SCOP est une société : elle cherche à dégager des bénéfices, même si ceux-ci sont partagés entre les salariés-associés. C’est une entreprise (de l’économie sociale et solidaire).' },
      { id: 'i6', cat: 'A', text: '<b>Les Pédales Tarnaises</b> — Club de cyclisme, 140 licenciés, entraîneurs bénévoles. Ressources : cotisations, subvention municipale, buvette lors des courses.',
        why: 'La subvention municipale et la buvette ne font pas du club une organisation publique ou une entreprise : il est géré par ses membres, sans but lucratif.' }
    ],
    hint: 'Ne vous fiez pas à ce que l’organisation vend ou non. Posez-vous deux questions : qui la dirige ? que devient l’argent qu’elle gagne ?',
    hint2: 'Notion à mobiliser : la <b>finalité</b>. Une entreprise poursuit un but lucratif ; une association poursuit un but non lucratif au service d’un projet ou de ses membres ; une organisation publique est dirigée par des élus ou l’État et sert l’intérêt général.',
    explain: 'Faire payer un service ou avoir des salariés ne suffit pas à définir une organisation. Ce qui compte : la finalité, la gouvernance et l’affectation des excédents.'
  }]
},
{
  id: 'a12', mission: 'm1', ch: 1, title: 'Qu’est-ce qui les distingue ?',
  notions: ['Critères de distinction des organisations'],
  remediation: 'Les critères qui distinguent les organisations sont la finalité, le statut juridique, la gouvernance (qui décide) et l’affectation des excédents. L’activité ou la présence de salariés ne permettent pas de trancher.',
  intro: 'Hugo, le vendeur, s’étonne : « Roue Libre vend des vélos réparés, comme nous. Franchement, c’est quoi la différence ? »',
  parts: [{
    type: 'multi', pts: 0.75,
    q: 'Quels critères permettent <u>réellement</u> de distinguer Terra Vélo de Roue Libre ? Plusieurs réponses possibles.',
    options: [
      { id: 'o1', ok: true,  text: 'Leur finalité : l’une cherche à réaliser des bénéfices, l’autre non.' },
      { id: 'o2', ok: true,  text: 'Ce que devient l’argent gagné : distribué aux associés ou réinvesti dans le projet.' },
      { id: 'o3', ok: true,  text: 'Qui prend les décisions : des associés propriétaires ou un bureau élu par les adhérents.' },
      { id: 'o4', ok: true,  text: 'Leur statut juridique : société d’un côté, association loi 1901 de l’autre.' },
      { id: 'o5', ok: false, text: 'La nature de l’activité : l’une répare et vend des vélos, l’autre aussi.',
        why: 'Justement, les deux ont la même activité : ce critère ne permet pas de les distinguer.' },
      { id: 'o6', ok: false, text: 'La présence de salariés rémunérés dans l’organisation.',
        why: 'Les associations peuvent employer des salariés (Roue Libre en a 3). Ce n’est pas un critère distinctif.' },
      { id: 'o7', ok: false, text: 'Le fait que les clients paient pour obtenir le vélo.',
        why: 'Une association peut vendre des biens ou des services. Le paiement ne dit rien de la finalité.' },
      { id: 'o8', ok: false, text: 'Le nombre de vélos vendus chaque année.',
        why: 'La taille ou le volume d’activité ne change pas la nature de l’organisation.' }
    ],
    hint: 'Éliminez d’abord ce que les deux organisations ont en commun : cela ne peut pas servir à les distinguer.',
    hint2: 'Notion à mobiliser : les <b>caractéristiques</b> d’une organisation (finalité, statut juridique, gouvernance, affectation des résultats).',
    explain: 'Même activité, même clientèle, salariés des deux côtés : ce qui les sépare, c’est la finalité et tout ce qui en découle (statut, gouvernance, affectation des excédents).'
  }]
},
{
  id: 'a13', mission: 'm1', ch: 1, title: 'La fiche d’identité',
  notions: ['Caractériser une organisation (finalité, activité, taille, ressources)'],
  remediation: 'Caractériser une organisation, c’est préciser son type, sa finalité, la nature de son activité (marchande ou non), sa taille et l’origine de ses ressources. Des valeurs écologiques ne rendent pas une entreprise non lucrative.',
  intro: 'Nadia veut une fiche d’identité claire de Terra Vélo pour le dossier de la banque.',
  doc: `<div class="doc-card"><div class="doc-head"><span>Document 1</span><span>Terra Vélo en bref</span></div><div class="doc-body">
    <p><b>Terra Vélo SAS</b> — Capital détenu par Nadia Ferrand (70 %) et deux associés. Fondée en 2014 à Gaillac.</p>
    <p>Activités : reconditionnement et vente de vélos d’occasion, réparation toutes marques, location aux particuliers et aux entreprises.</p>
    <p>24 salariés. Chiffre d’affaires 2025 : 2,1 M€ (ventes 71 %, réparations 22 %, location 7 %). Résultat : 96 000 €, dont une partie versée aux associés.</p>
    <p>90 % des clients habitent ou travaillent dans le Tarn. Slogan : « Chaque vélo mérite une deuxième vie. » Terra Vélo est partenaire de la Semaine de la mobilité durable.</p>
  </div></div>`,
  parts: [{
    type: 'fields', pts: 1,
    q: 'Complétez la fiche d’identité à partir du document.',
    rows: [
      { label: 'Type d’organisation', options: ['Entreprise privée', 'Organisation publique', 'Association', 'Entreprise publique'], answer: 0 },
      { label: 'Finalité', options: ['Lucrative : réaliser et partager des bénéfices', 'Non lucrative : servir l’intérêt général', 'Non lucrative : protéger l’environnement'], answer: 0,
        why: 'Les valeurs écologiques de Terra Vélo n’en font pas une organisation non lucrative : elle réalise un bénéfice et en verse une partie aux associés.' },
      { label: 'Nature de l’activité', options: ['Production de biens et de services marchands', 'Production de services non marchands', 'Production de biens uniquement'], answer: 0,
        why: 'Réparation et location sont des services, vendus à un prix qui couvre au moins leur coût : services marchands.' },
      { label: 'Taille', options: ['Microentreprise (moins de 10 salariés)', 'PME (10 à 249 salariés)', 'ETI (250 à 4 999 salariés)'], answer: 1 },
      { label: 'Principale ressource financière', options: ['Le chiffre d’affaires issu de ses ventes', 'Les subventions publiques', 'Les apports réguliers des associés'], answer: 0 }
    ],
    hint: 'Appuyez-vous uniquement sur le document. Le slogan et le partenariat sont-ils des informations sur la finalité, ou sur les valeurs ?',
    hint2: 'Notion à mobiliser : la <b>finalité</b> se lit dans ce que l’organisation fait de son résultat, pas dans son discours. Une activité est <b>marchande</b> quand elle est vendue à un prix économiquement significatif.',
    explain: 'Terra Vélo est une entreprise privée (SAS), à finalité lucrative, qui produit des biens et services marchands. Avec 24 salariés, c’est une PME, financée d’abord par son chiffre d’affaires.'
  }]
},
{
  id: 'a14', mission: 'm1', ch: 1, title: 'Les ressources',
  notions: ['Identifier les ressources d’une organisation'],
  remediation: 'On distingue quatre grands types de ressources : humaines (les personnes), matérielles (locaux, machines, stocks), financières (capitaux, emprunts, subventions) et immatérielles (marque, fichier clients, brevets, savoir-faire formalisé).',
  intro: 'Pour le dossier d’Albi, Marc, le comptable, liste ce dont Terra Vélo dispose.',
  parts: [{
    type: 'sort', pts: 0.75,
    q: 'Classez chaque élément selon le type de ressource qu’il représente.',
    cats: [ { id: 'H', label: 'Humaines' }, { id: 'M', label: 'Matérielles' }, { id: 'F', label: 'Financières' }, { id: 'I', label: 'Immatérielles' } ],
    items: [
      { id: 'r1', cat: 'H', text: '11 techniciens, dont un spécialiste des moteurs électriques' },
      { id: 'r2', cat: 'M', text: 'Un atelier de 600 m² et deux bancs de diagnostic' },
      { id: 'r3', cat: 'F', text: 'Un prêt bancaire de 180 000 € pour la boutique d’Albi' },
      { id: 'r4', cat: 'I', text: 'La marque « Terra Vélo », déposée en 2016', why: 'Une marque ne se touche pas mais elle a de la valeur : ressource immatérielle.' },
      { id: 'r5', cat: 'M', text: 'Un stock de 350 vélos à reconditionner', why: 'Le stock est un bien physique : ressource matérielle, même s’il a une valeur en euros.' },
      { id: 'r6', cat: 'F', text: 'Les apports en capital des trois associés' },
      { id: 'r7', cat: 'I', text: 'Un fichier de 3 200 clients fidèles', why: 'Le fichier clients est une information : ressource immatérielle.' },
      { id: 'r8', cat: 'H', text: 'L’apprentie formée en alternance' }
    ],
    hint: 'Pour chaque élément, demandez-vous : est-ce une personne, un objet que l’on peut toucher, de l’argent, ou quelque chose qui a de la valeur sans être matériel ?',
    hint2: 'Notion à mobiliser : les <b>ressources</b>. Attention aux pièges : un stock a une valeur en euros mais reste un bien physique ; une marque ou un fichier ne se touchent pas.',
    explain: 'Humaines : les personnes. Matérielles : locaux, équipements, stocks. Financières : prêts, capital. Immatérielles : marque, fichier clients.'
  }]
},
{
  id: 'a15', mission: 'm1', ch: 1, title: 'Les parties prenantes',
  notions: ['Parties prenantes internes et externes', 'Attentes divergentes des parties prenantes'],
  remediation: 'Les parties prenantes sont tous les acteurs concernés par l’activité de l’organisation. Internes : dirigeants, salariés, associés. Externes : clients, fournisseurs, banques, collectivités, partenaires. Leurs attentes peuvent entrer en contradiction : l’organisation doit les concilier.',
  intro: 'Nadia prépare une réunion avec tous ceux qui sont concernés par le projet d’Albi.',
  parts: [
    {
      type: 'sort', pts: 0.5,
      q: 'Classez ces acteurs en parties prenantes internes ou externes.',
      cats: [ { id: 'IN', label: 'Internes' }, { id: 'EX', label: 'Externes' } ],
      items: [
        { id: 'p1', cat: 'IN', text: 'Les techniciens de l’atelier' },
        { id: 'p2', cat: 'IN', text: 'Les deux associés de Nadia', why: 'Les associés sont propriétaires de l’entreprise : partie prenante interne.' },
        { id: 'p3', cat: 'EX', text: 'La banque qui prête 180 000 €' },
        { id: 'p4', cat: 'EX', text: 'Les clients professionnels' },
        { id: 'p5', cat: 'EX', text: 'L’Agglomération Gaillac-Graulhet' },
        { id: 'p6', cat: 'EX', text: 'Le grossiste Cycles d’Oc' },
        { id: 'p7', cat: 'EX', text: 'L’association Roue Libre, partenaire', why: 'Un partenaire reste extérieur à l’organisation : partie prenante externe.' }
      ],
      hint: 'Est-ce que l’acteur fait partie de l’entreprise (y travaille ou la possède), ou est-il en relation avec elle depuis l’extérieur ?',
      hint2: 'Notion à mobiliser : <b>parties prenantes internes</b> (salariés, dirigeants, propriétaires) et <b>externes</b> (clients, fournisseurs, financeurs, pouvoirs publics, partenaires).',
      explain: 'Internes : salariés et associés. Externes : banque, clients, collectivité, fournisseur, partenaire associatif.'
    },
    {
      type: 'fields', pts: 0.5,
      q: 'Associez à chaque partie prenante son attente principale vis-à-vis de Terra Vélo.',
      shared: ['Que l’entreprise dégage des bénéfices et prenne de la valeur', 'De bonnes conditions de travail et la reconnaissance de leur savoir-faire', 'Le remboursement du prêt dans les délais prévus', 'Un vélo fiable, prêt dans le délai annoncé, à un prix correct', 'Des emplois locaux et plus de déplacements à vélo sur le territoire', 'Des commandes régulières, payées à l’heure'],
      rows: [
        { label: 'Les associés', answer: 0 },
        { label: 'Les salariés', answer: 1 },
        { label: 'La banque', answer: 2 },
        { label: 'Les clients', answer: 3 },
        { label: 'L’Agglomération', answer: 4 },
        { label: 'Cycles d’Oc', answer: 5 }
      ],
      hint: 'Mettez-vous à la place de chaque acteur : qu’est-ce qu’il gagne ou risque dans sa relation avec Terra Vélo ?',
      hint2: 'Notion à mobiliser : chaque partie prenante a des <b>attentes</b> liées à sa position (propriétaire, prêteur, client, fournisseur, collectivité).',
      explain: 'Associés : rentabilité. Salariés : conditions de travail et reconnaissance. Banque : remboursement. Clients : qualité, délai, prix. Collectivité : emploi et intérêt général. Fournisseur : commandes et paiement.'
    },
    {
      type: 'choice', pts: 0.5,
      reveal: '<b>Nouvelle information.</b> L’Agglomération accorde 25 000 € à Terra Vélo, à condition d’embaucher deux jeunes du territoire. En réunion, Julien, le responsable atelier, réagit : « On est déjà débordés, on n’a pas le temps de former deux débutants. »',
      q: 'Quelle analyse de cette situation est la plus juste ?',
      options: [
        { id: 'c1', ok: true,  text: 'Les attentes de deux parties prenantes, la collectivité et les salariés de l’atelier, entrent en contradiction : Nadia devra les concilier.' },
        { id: 'c2', ok: false, text: 'En acceptant cette subvention, Terra Vélo deviendrait une organisation publique, ce qui explique l’inquiétude de Julien.',
          why: 'Recevoir une subvention ne change ni le statut ni la finalité d’une entreprise.' },
        { id: 'c3', ok: false, text: 'Julien est un salarié, pas une partie prenante : sa réaction ne concerne pas le choix de Nadia.',
          why: 'Les salariés sont des parties prenantes internes. Leur réaction compte dans la décision.' },
        { id: 'c4', ok: false, text: 'L’Agglomération devient une partie prenante interne puisqu’elle finance désormais une partie du projet.',
          why: 'Financer un projet ne fait pas entrer un acteur dans l’organisation : l’Agglomération reste externe.' }
      ],
      hint: 'Qui sont les acteurs concernés par cette décision, et veulent-ils la même chose ?',
      hint2: 'Notion à mobiliser : les parties prenantes ont des <b>attentes parfois divergentes</b>. Une subvention ne modifie pas la nature de l’organisation.',
      explain: 'La collectivité attend des emplois locaux, l’atelier attend des conditions de travail tenables : deux attentes légitimes qui s’opposent.'
    }
  ]
},

/* ─────────────── MISSION 2 ─────────────── */
{
  id: 'a21', mission: 'm2', ch: 2, title: 'Premières observations',
  notions: ['Personnalité et traits de personnalité'],
  remediation: 'La personnalité se repère à partir de comportements observés de façon répétée (extraversion ou introversion, rigueur, ouverture au changement, coopération, sensibilité au stress…). On ne doit pas attribuer un trait qui n’est pas appuyé par des faits.',
  intro: 'Vous avez noté vos premières observations sur trois personnes.',
  doc: `<div class="notes">
    <div class="note"><div class="note-who"><i style="background:#4A7A52">JC</i><span>Julien Castex · Responsable atelier</span></div>
      <p>Tient à jour un classeur de toutes les réparations depuis 2011. Vérifie lui-même chaque vélo avant sa sortie. En réunion, parle peu et prend le temps de réfléchir avant de répondre. Quand Nadia a changé de fournisseur de pneus, il a demandé à en garder un stock de l’ancien « au cas où ».</p></div>
    <div class="note"><div class="note-who"><i style="background:#C8643B">IM</i><span>Inès Moreau · Responsable commerciale</span></div>
      <p>A lancé trois nouveautés en un an : vente en ligne, carte de fidélité, délai garanti. Connaît le prénom de la plupart des clients réguliers et anime volontiers les salons. Supporte mal d’attendre une décision.</p></div>
    <div class="note"><div class="note-who"><i style="background:#9DBFA0">LV</i><span>Léa Vidal · Apprentie</span></div>
      <p>Accepte toujours d’aider un collègue, même en fin de journée. La veille de son entretien d’évaluation, elle n’a pas dormi et a failli ne pas venir.</p></div>
  </div>`,
  parts: [{
    type: 'sort', pts: 1,
    q: 'Attribuez chaque trait à la personne chez qui vous l’avez observé. Si un trait n’est pas appuyé par les observations, placez-le dans « Non observable ».',
    cats: [ { id: 'J', label: 'Julien' }, { id: 'I', label: 'Inès' }, { id: 'L', label: 'Léa' }, { id: 'N', label: 'Non observable' } ],
    items: [
      { id: 't1', cat: 'J', text: 'Rigueur, conscience professionnelle' },
      { id: 't2', cat: 'J', text: 'Introversion' },
      { id: 't3', cat: 'J', text: 'Attachement aux habitudes' },
      { id: 't4', cat: 'I', text: 'Extraversion' },
      { id: 't5', cat: 'I', text: 'Ouverture au changement' },
      { id: 't6', cat: 'L', text: 'Esprit de coopération' },
      { id: 't7', cat: 'L', text: 'Sensibilité au stress' },
      { id: 't8', cat: 'N', text: 'Désintérêt pour la qualité du travail', why: 'Rien dans les notes ne montre qu’Inès se moque de la qualité. Ce serait un jugement, pas une observation.' },
      { id: 't9', cat: 'N', text: 'Manque de compétences techniques', why: 'Les notes parlent du stress de Léa, pas de ses compétences. Ne pas confondre émotion et compétence.' }
    ],
    hint: 'Pour chaque trait, retrouvez la phrase précise des notes qui le justifie. Pas de phrase, pas de trait.',
    hint2: 'Notion à mobiliser : la <b>personnalité</b> se déduit de comportements observés. Un préjugé ou une impression ne suffit pas.',
    explain: 'Julien : rigueur (classeur, vérifications), introversion (parle peu, réfléchit), attachement aux habitudes (garde l’ancien fournisseur). Inès : extraversion (salons, prénoms des clients), ouverture (trois nouveautés). Léa : coopération (aide ses collègues), sensibilité au stress (nuit blanche avant l’évaluation).'
  }]
},
{
  id: 'a22', mission: 'm2', ch: 2, title: 'La réunion du lundi',
  notions: ['Émotions au travail et leurs manifestations', 'Conséquences des émotions sur le comportement'],
  remediation: 'Une émotion se repère à des indices verbaux (ton, formules) et non verbaux (gestes, posture, départ). Il ne faut pas confondre une émotion avec un argument rationnel. Les émotions ont des conséquences : implication, résistance au changement, climat de l’équipe.',
  intro: 'Vous assistez à la réunion hebdomadaire. Voici le compte rendu que vous avez pris.',
  parts: [
    {
      type: 'highlight', pts: 0.5,
      q: 'Sélectionnez <u>uniquement</u> les indices qui révèlent l’état émotionnel de Julien. Touchez une ligne pour la sélectionner.',
      head: 'Compte rendu · Réunion atelier-boutique · lundi 8 h 30',
      segments: [
        { t: 'Inès présente le nouveau « délai garanti 48 h » pour toutes les réparations simples.', ok: false },
        { t: 'Pendant la présentation, Julien croise les bras et cesse de regarder Inès.', ok: true },
        { t: 'Julien : « Combien de réparations simples avons-nous eues le mois dernier ? »', ok: false, why: 'C’est une question factuelle, posée calmement : elle ne révèle pas d’émotion particulière.' },
        { t: 'Julien, d’une voix plus forte : « Donc on va bâcler le travail pour faire joli sur une affiche. »', ok: true },
        { t: 'Karim : « Ça va, on n’est pas à l’usine non plus ! » Quelques rires dans la salle.', ok: false, why: 'Cette réaction est celle de Karim, pas de Julien.' },
        { t: 'Léa regarde Julien, puis baisse les yeux vers son carnet.', ok: false, why: 'Indice sur Léa, pas sur Julien.' },
        { t: 'Julien propose de tester la mesure pendant un mois avant de la généraliser.', ok: false, why: 'C’est une proposition constructive et argumentée : Julien n’est pas seulement dans l’émotion.' },
        { t: 'En fin de réunion, Julien sort le premier, sans un mot, et la porte claque derrière lui.', ok: true }
      ],
      hint: 'Distinguez ce que Julien <i>pense</i> (arguments, questions, propositions) de ce qu’il <i>ressent</i> et qui se voit dans son corps ou sa voix.',
      hint2: 'Notion à mobiliser : les <b>manifestations des émotions</b> sont verbales (ton, ironie) et non verbales (posture, gestes, départ). Une question ou une proposition calme n’est pas un indice émotionnel.',
      explain: 'Trois indices : bras croisés et regard détourné, voix qui monte et ironie, sortie brusque. La question sur les chiffres et la proposition de test sont des comportements rationnels.'
    },
    {
      type: 'choice', pts: 0.5,
      q: 'Quelle interprétation de la réaction de Julien est la mieux appuyée par les faits ?',
      options: [
        { id: 'e1', ok: false, text: 'Julien éprouve de l’antipathie pour Inès : c’est un problème de personnes, qui disparaîtrait si quelqu’un d’autre présentait la mesure.',
          why: 'Aucun fait n’indique une antipathie personnelle. C’est la mesure qui déclenche la réaction, pas la personne.' },
        { id: 'e2', ok: true,  text: 'Julien ressent de l’inquiétude face à une mesure qui menace la qualité à laquelle il s’identifie ; elle s’exprime par de l’irritation et risque de le pousser à résister.' },
        { id: 'e3', ok: false, text: 'Julien n’exprime pas d’émotion : il défend un argument technique de façon rationnelle, comme le montre sa proposition de test d’un mois.',
          why: 'Sa proposition est rationnelle, mais ses gestes et sa voix montrent aussi une émotion forte. Les deux coexistent.' },
        { id: 'e4', ok: false, text: 'Julien ressent surtout de la tristesse, car il comprend que Nadia ne lui fait plus confiance pour organiser l’atelier.',
          why: 'Nadia n’est pas présente et rien ne parle de confiance. Cette interprétation va au-delà des faits.' }
      ],
      hint: 'Qu’est-ce qui, dans la mesure présentée, touche à ce qui compte le plus pour Julien depuis 15 ans ?',
      hint2: 'Notion à mobiliser : une émotion a une <b>cause</b> (ici, une menace sur ses valeurs professionnelles) et des <b>conséquences</b> possibles sur le comportement (irritation, résistance au changement, baisse d’implication).',
      explain: 'La mesure touche à la qualité, cœur de l’identité professionnelle de Julien. Son inquiétude se traduit en irritation ; sans écoute, elle peut devenir résistance au changement et dégrader le climat de l’atelier.'
    }
  ]
},
{
  id: 'a23', mission: 'm2', ch: 2, title: 'Le message de Léa',
  notions: ['Représentation de soi (image, estime, confiance en soi)', 'Influence du regard des autres sur le comportement'],
  remediation: 'La représentation de soi (image de soi, estime de soi, confiance en soi) se construit en grande partie à travers le regard et les retours des autres, notamment des responsables. Elle influence directement le comportement : prise d’initiative ou repli.',
  intro: 'Sophie vous montre un message reçu ce matin sur la messagerie interne et vous demande conseil.',
  doc: `<div class="chat">
    <div class="chat-head"><span class="av" style="background:#9DBFA0">LV</span><div><b>Léa Vidal</b><small>à Sophie Lambert · 7 h 52</small></div></div>
    <div class="bubble">Salut Sophie, tu aurais 5 minutes aujourd’hui ? Je crois que je ne suis pas faite pour ce métier. Julien repasse derrière moi sur chaque vélo, même quand je suis sûre de moi. Du coup je n’ose plus rien finir seule, je demande tout. Karim dit que je me débrouille bien mais je pense qu’il dit ça pour être gentil. Je pensais peut-être arrêter l’apprentissage en juin.</div>
  </div>`,
  parts: [
    {
      type: 'choice', pts: 0.5,
      q: 'Quelle action aurait le plus d’effet positif sur la représentation que Léa a d’elle-même ?',
      options: [
        { id: 'l1', ok: false, text: 'Lui proposer une formation complémentaire au CFA pour combler ses lacunes et la rassurer sur ses capacités techniques.',
          why: 'Rien n’indique de lacunes. Proposer une formation risque au contraire de confirmer à Léa qu’elle n’est « pas au niveau ».' },
        { id: 'l2', ok: true,  text: 'Demander à Julien de lui confier une réparation complète en autonomie, puis de lui faire un retour précis sur ce qu’elle a réussi.' },
        { id: 'l3', ok: false, text: 'La rassurer en lui disant que toute l’équipe l’apprécie et qu’elle a toute sa place chez Terra Vélo, quoi qu’il arrive.',
          why: 'Être appréciée ne répond pas à son doute sur ses compétences. Léa écarte déjà les compliments de Karim.' },
        { id: 'l4', ok: false, text: 'La faire travailler avec un autre technicien que Julien pendant quelques semaines, pour qu’elle retrouve un peu de calme.',
          why: 'Éviter Julien ne change pas l’image que Léa a d’elle : le problème vient du manque de reconnaissance de ses réussites.' }
      ],
      hint: 'D’où vient le doute de Léa ? Pourquoi les compliments de Karim ne suffisent-ils pas à la rassurer ?',
      hint2: 'Notion à mobiliser : la <b>représentation de soi</b> se construit par l’expérience de la réussite et par les retours des autres, surtout ceux de la personne qui évalue le travail.',
      explain: 'Léa doute parce que son responsable vérifie tout, ce qu’elle interprète comme un manque de confiance. Une mise en situation de réussite, reconnue par Julien lui-même, agit sur sa confiance en soi.'
    },
    {
      type: 'fields', pts: 0.5,
      reveal: '<b>Deux semaines plus tard.</b> Léa a réussi seule la réparation d’un moteur électrique réputé difficile. Karim l’a félicitée devant tout le monde au « vélo du vendredi ». Julien n’a rien dit. Depuis, Léa propose ses idées en réunion.',
      q: 'Vrai ou faux ?',
      shared: ['Vrai', 'Faux'],
      rows: [
        { label: 'La représentation que Léa a d’elle-même dépend uniquement de ses compétences réelles.', answer: 1,
          why: 'Ses compétences n’ont pas changé en deux semaines ; c’est la reconnaissance qui a changé.' },
        { label: 'Le regard des collègues peut modifier la confiance en soi d’un salarié.', answer: 0 },
        { label: 'Une meilleure estime de soi peut transformer le comportement de Léa au travail.', answer: 0 },
        { label: 'Le silence de Julien n’a aucun effet puisqu’il n’a rien dit de négatif.', answer: 1,
          why: 'L’absence de reconnaissance du responsable est aussi un message, que Léa peut interpréter.' }
      ],
      hint: 'Qu’est-ce qui a changé en deux semaines : les compétences de Léa, ou autre chose ?',
      hint2: 'Notion à mobiliser : la représentation de soi dépend des <b>interactions</b> ; une absence de retour est aussi un message.',
      explain: 'La reconnaissance publique a renforcé l’estime de soi de Léa, qui ose désormais proposer ses idées. Le silence de Julien reste un point de vigilance.'
    }
  ]
},
{
  id: 'a24', mission: 'm2', ch: 2, title: 'Les compétences observées',
  notions: ['Compétences comportementales', 'Compétences relationnelles'],
  remediation: 'Les compétences comportementales concernent la façon dont on se conduit soi-même (rigueur, gestion du stress, autonomie, adaptabilité). Les compétences relationnelles concernent la relation aux autres (écoute, coopération, négociation, communication). Les compétences techniques sont des savoir-faire propres au métier.',
  intro: 'Nadia veut valoriser les compétences de chacun dans les entretiens annuels. Vous avez relevé plusieurs situations.',
  parts: [{
    type: 'sort', pts: 1,
    q: 'Classez chaque situation selon la compétence principalement mobilisée.',
    cats: [ { id: 'C', label: 'Comportementale' }, { id: 'R', label: 'Relationnelle' }, { id: 'T', label: 'Technique (métier)' } ],
    items: [
      { id: 'k1', cat: 'R', text: 'Karim reformule la demande d’un client énervé pour vérifier qu’il l’a bien comprise.' },
      { id: 'k2', cat: 'C', text: 'Julien vérifie trois fois le serrage des freins avant chaque livraison.' },
      { id: 'k3', cat: 'C', text: 'Inès garde son calme quand un fournisseur annonce trois semaines de retard, et réorganise aussitôt le planning.',
        why: 'Garder son calme et s’adapter concerne la maîtrise de soi : compétence comportementale.' },
      { id: 'k4', cat: 'T', text: 'Thomas diagnostique une batterie défectueuse en cinq minutes.', why: 'Diagnostiquer une batterie est un savoir-faire du métier : compétence technique.' },
      { id: 'k5', cat: 'R', text: 'Léa propose à un collègue débordé de prendre une partie de ses réparations.' },
      { id: 'k6', cat: 'T', text: 'Hugo maîtrise toutes les fonctions du logiciel de caisse.' },
      { id: 'k7', cat: 'R', text: 'Sophie trouve un terrain d’entente entre deux salariés qui voulaient les mêmes congés.' },
      { id: 'k8', cat: 'C', text: 'Léa se forme seule, le soir, aux nouveaux moteurs électriques.', why: 'Se former seul relève de l’autonomie et de la curiosité : compétence comportementale.' }
    ],
    hint: 'Posez la question : cette personne agit-elle sur elle-même, sur sa relation avec quelqu’un, ou applique-t-elle un savoir-faire du métier ?',
    hint2: 'Notion à mobiliser : <b>compétences comportementales</b> (savoir-être personnel) ≠ <b>compétences relationnelles</b> (relation aux autres) ≠ compétences techniques.',
    explain: 'Relationnelles : écoute (Karim), coopération (Léa), négociation (Sophie). Comportementales : rigueur (Julien), gestion du stress et adaptabilité (Inès), autonomie (Léa). Techniques : diagnostic (Thomas), logiciel (Hugo).'
  }]
},
{
  id: 'a25', mission: 'm2', ch: 2, title: 'Le nouveau logiciel',
  notions: ['Influence de la personnalité sur le comportement'],
  remediation: 'La personnalité influence le comportement : face à un même changement, chacun réagit différemment. Mais le comportement dépend aussi de la situation, des émotions du moment et du groupe : la personnalité ne permet pas de tout prévoir.',
  intro: 'Nadia annonce que, dans quinze jours, le tableau blanc de l’atelier sera remplacé par un logiciel de planning sur tablette.',
  parts: [
    {
      type: 'fields', pts: 0.75,
      q: 'À partir de ce que vous savez de chacun, associez à chaque personne la réaction la plus probable.',
      shared: [
        'Demande une période d’essai et souhaite garder le tableau blanc en parallèle « au cas où ».',
        'Propose aussitôt de former les collègues et fixe un calendrier de déploiement.',
        'N’utilise pas la tablette les premiers jours et observe comment font les autres.',
        'En plaisante à la pause café et rassure les techniciens inquiets.',
        'Refuse le logiciel et menace de quitter l’entreprise.'
      ],
      rows: [
        { label: 'Julien', answer: 0 },
        { label: 'Inès', answer: 1 },
        { label: 'Léa (avant sa réussite)', answer: 2 },
        { label: 'Karim', answer: 3 }
      ],
      hint: 'Reprenez les traits identifiés plus tôt : attachement aux habitudes, ouverture, manque de confiance, rôle de Karim auprès des collègues.',
      hint2: 'Notion à mobiliser : la <b>personnalité influence les comportements</b>. Aucune observation n’annonce une réaction extrême.',
      explain: 'Julien, attaché aux habitudes, sécurise ; Inès, ouverte et extravertie, prend les devants ; Léa, en manque de confiance, attend ; Karim, sociable, rassure le groupe.'
    },
    {
      type: 'choice', pts: 0.5,
      q: 'Hugo conclut : « Donc, si on connaît la personnalité de quelqu’un, on sait exactement comment il va réagir. » Que lui répondez-vous ?',
      options: [
        { id: 'h1', ok: false, text: 'Oui : la personnalité est stable dans le temps, donc le comportement est entièrement prévisible.', why: 'La personnalité est relativement stable, mais le comportement dépend aussi de la situation.' },
        { id: 'h2', ok: false, text: 'Non : la personnalité change chaque jour selon l’humeur, donc on ne peut rien en déduire.', why: 'C’est l’humeur ou l’émotion qui varie ; la personnalité, elle, est relativement stable.' },
        { id: 'h3', ok: true,  text: 'Non : la personnalité influence le comportement, mais celui-ci dépend aussi de la situation, des émotions et du groupe.' },
        { id: 'h4', ok: false, text: 'Oui, à condition de faire passer un test de personnalité complet à chaque salarié.', why: 'Même un test ne permet pas de prévoir un comportement avec certitude.' }
      ],
      hint: 'Léa a-t-elle toujours réagi de la même façon, avant et après sa réussite ?',
      hint2: 'Notion à mobiliser : <b>comportement = personnalité × situation</b>. La personnalité est une tendance, pas une fatalité.',
      explain: 'La personnalité est une tendance relativement stable ; le comportement résulte de sa rencontre avec une situation, des émotions et un groupe. L’évolution de Léa le montre.'
    }
  ]
},

/* ─────────────── MISSION 3 ─────────────── */
{
  id: 'a31', mission: 'm3', ch: 3, obj: 1, title: 'Les signes de la culture',
  notions: ['Composantes de la culture d’organisation'],
  remediation: 'La culture d’organisation se repère à ses composantes : valeurs, rites, symboles, mythes (histoire fondatrice), langage propre et héros. Elle donne des repères communs et influence la façon dont les salariés interagissent.',
  intro: 'Le livret d’accueil et vos propres observations en disent long sur Terra Vélo.',
  parts: [{
    type: 'sort', pts: 1,
    q: 'Associez chaque élément à la composante de la culture qu’il illustre.',
    cats: [ { id: 'V', label: 'Valeur' }, { id: 'R', label: 'Rite' }, { id: 'S', label: 'Symbole' }, { id: 'M', label: 'Mythe fondateur' }, { id: 'L', label: 'Langage' }, { id: 'H', label: 'Héros' } ],
    items: [
      { id: 'u1', cat: 'V', text: '« Réparer plutôt que jeter, même quand c’est moins rentable. »' },
      { id: 'u2', cat: 'R', text: 'Chaque vendredi à 16 h, toute l’équipe essaie ensemble le vélo le plus difficile réparé dans la semaine.' },
      { id: 'u3', cat: 'S', text: 'La première roue réparée par Nadia est accrochée au-dessus de l’entrée.' },
      { id: 'u4', cat: 'M', text: 'On raconte à chaque nouveau que Nadia a commencé dans un garage avec trois vélos récupérés à la déchetterie.' },
      { id: 'u5', cat: 'L', text: 'À l’atelier, une réparation très difficile s’appelle « une résurrection ».' },
      { id: 'u6', cat: 'H', text: 'Karim est « celui qui a ressuscité le millième vélo ».' },
      { id: 'u7', cat: 'R', text: 'Chaque nouveau salarié passe sa première journée à démonter un vieux vélo avec Karim.',
        why: 'C’est une pratique répétée, qui marque l’entrée dans le groupe : un rite d’intégration.' }
    ],
    hint: 'Un rite se répète, un symbole est un objet, un mythe se raconte, un héros est une personne admirée.',
    hint2: 'Notion à mobiliser : les <b>composantes de la culture</b> : valeurs (ce qui est important), rites (pratiques répétées), symboles (objets, signes), mythes (histoires), langage (mots propres), héros (modèles).',
    explain: 'Valeur : réparer plutôt que jeter. Rites : le vélo du vendredi, la journée d’intégration. Symbole : la première roue. Mythe : le garage et la déchetterie. Langage : « résurrection ». Héros : Karim.'
  }]
},
{
  id: 'a32', mission: 'm3', ch: 3, obj: 1, title: 'La fin du vélo du vendredi',
  notions: ['Impact de la culture sur les interactions', 'Sous-cultures au sein d’une organisation'],
  remediation: 'La culture structure les interactions : supprimer un rite peut être vécu comme une remise en cause des valeurs et dégrader les relations. Une organisation peut contenir plusieurs sous-cultures (ici, l’atelier historique et la boutique récente) qui ne partagent pas les mêmes repères.',
  intro: 'Pour « gagner du temps », Inès a remplacé le vélo du vendredi par un point de 15 minutes sur les chiffres de vente, le vendredi à 16 h.',
  parts: [
    {
      type: 'choice', pts: 0.5,
      q: 'Quel effet cette décision risque-t-elle d’avoir sur les interactions dans l’entreprise ?',
      options: [
        { id: 'v1', ok: false, text: 'Aucun effet notable : un point chiffré est plus utile, et la culture n’a pas de lien réel avec le travail quotidien.',
          why: 'La culture influence directement la façon dont les salariés coopèrent et se sentent reconnus.' },
        { id: 'v2', ok: true,  text: 'Un rite fédérateur disparaît : l’atelier peut y voir une remise en cause de ses valeurs et se replier, ce qui tendra les relations avec la boutique.' },
        { id: 'v3', ok: false, text: 'Un effet positif sur la cohésion, puisque tous les salariés reçoivent désormais la même information au même moment.',
          why: 'Partager une information ne crée pas la même cohésion qu’un rite collectif auquel les salariés sont attachés.' },
        { id: 'v4', ok: false, text: 'Un effet limité à l’organisation du planning : il suffirait de déplacer le point chiffré au lundi pour éviter toute difficulté.',
          why: 'Le problème n’est pas l’horaire mais la disparition d’un rite porteur de sens.' }
      ],
      hint: 'Que représente le vélo du vendredi pour les techniciens, au-delà du simple essai d’un vélo ?',
      hint2: 'Notion à mobiliser : la <b>culture d’organisation</b> donne du sens et des repères communs ; toucher à un rite, c’est toucher à ce sens.',
      explain: 'Le vélo du vendredi valorise le savoir-faire de l’atelier. Le supprimer sans concertation envoie le message que les chiffres comptent plus que la réparation : risque de repli et de tension.'
    },
    {
      type: 'choice', pts: 0.5,
      reveal: '<b>Nouvelle information.</b> Les quatre vendeurs, tous arrivés depuis moins d’un an, trouvent le nouveau point très utile. Ils n’avaient jamais participé au vélo du vendredi : « On ne savait pas qu’on pouvait y aller. »',
      q: 'Que révèle cette information ?',
      options: [
        { id: 'w1', ok: false, text: 'Les vendeurs n’ont pas de culture d’entreprise, contrairement aux techniciens.', why: 'Les vendeurs ont aussi des repères et des valeurs, simplement différents.' },
        { id: 'w2', ok: false, text: 'La culture de Terra Vélo a disparu depuis l’arrivée d’Inès.', why: 'La culture existe toujours à l’atelier ; elle n’est simplement pas partagée par tous.' },
        { id: 'w3', ok: true,  text: 'Deux sous-cultures coexistent : celle de l’atelier historique et celle de la boutique récente, qui n’a jamais été intégrée aux rites.' },
        { id: 'w4', ok: false, text: 'Les vendeurs ont tort : ils devraient adopter les habitudes de l’atelier, qui est le cœur du métier.', why: 'C’est un jugement de valeur, pas une analyse de la situation.' }
      ],
      hint: 'La culture est-elle forcément partagée de la même façon par tous les salariés d’une organisation ?',
      hint2: 'Notion à mobiliser : une organisation peut abriter plusieurs <b>sous-cultures</b>, notamment quand de nouvelles équipes arrivent sans être intégrées.',
      explain: 'Le vélo du vendredi était un rite de l’atelier, jamais transmis aux nouveaux vendeurs. Deux sous-cultures coexistent : c’est une des sources des tensions entre services.'
    }
  ]
},
{
  id: 'a33', mission: 'm3', ch: 3, obj: 3, title: 'Réseaux formels et informels',
  notions: ['Réseau formel et réseau informel', 'Leader informel', 'Avantages et risques du réseau informel'],
  remediation: 'Le réseau formel est défini par l’organigramme (liens hiérarchiques). Le réseau informel repose sur les affinités et les échanges spontanés. Il accélère la circulation de l’information et l’entraide, mais peut contourner la hiérarchie, déformer l’information et exclure certains salariés.',
  intro: 'Vous comparez l’organigramme officiel à ce que vous avez observé pendant une semaine.',
  doc: `<div class="doc-card"><div class="doc-head"><span>Carnet d’observation</span><span>Semaine du 13 octobre</span></div><div class="doc-body"><ul class="obs">
    <li>Chaque matin à 8 h, café au distributeur de l’atelier : Karim, cinq techniciens, Thomas, parfois Léa. Julien arrive à 8 h 30 et va directement à son bureau.</li>
    <li>Karim a créé le groupe de messagerie « Les clés de 12 » : dix personnes de l’atelier et Thomas. Julien n’y est pas, les vendeurs non plus.</li>
    <li>Quand un technicien a un problème, il va d’abord voir Karim, puis Julien si Karim ne sait pas.</li>
    <li>Thomas habite Albi et fait le trajet chaque jour en covoiturage avec Hugo, le vendeur.</li>
    <li>Sophie déjeune avec Nadia tous les mardis depuis dix ans.</li>
    <li>Jeudi, Julien a appris par hasard que les techniciens avaient décidé, entre eux, de ne plus appliquer le délai de 48 h aux vélos électriques.</li>
  </ul></div></div>`,
  parts: [
    {
      type: 'org', pts: 0.5,
      q: 'Dans l’organigramme, touchez la personne qui occupe la position centrale du réseau informel de l’atelier.',
      answer: 'karim',
      wrongWhy: { julien: 'Julien est le responsable <b>formel</b> de l’atelier, mais les observations montrent qu’il est en marge des échanges informels.', nadia: 'Nadia est au sommet de l’organigramme formel, pas au centre des échanges de l’atelier.' },
      hint: 'Ne regardez pas les liens de l’organigramme : relisez le carnet. Vers qui les techniciens se tournent-ils spontanément ?',
      hint2: 'Notion à mobiliser : le <b>réseau informel</b> repose sur les affinités et la confiance, pas sur la position hiérarchique. Celui qui y est au centre est un <b>leader informel</b>.',
      explain: 'Karim anime le café du matin, a créé le groupe de messagerie et est sollicité avant Julien : c’est le leader informel de l’atelier.'
    },
    {
      type: 'org', pts: 0.25,
      q: 'Qui fait circuler, de manière informelle, l’information entre l’atelier et la boutique ?',
      answer: 'thomas',
      wrongWhy: { hugo: 'Hugo reçoit l’information, mais il n’est pas en contact avec l’atelier. Qui fait le lien ?', sophie: 'Sophie fait le lien avec la direction, pas entre l’atelier et la boutique.', karim: 'Karim est au cœur de l’atelier, mais n’a pas de lien direct avec la boutique.' },
      hint: 'Cherchez une personne présente à la fois dans les échanges de l’atelier et en contact quotidien avec un vendeur.',
      hint2: 'Notion à mobiliser : dans un réseau, certaines personnes jouent un rôle de <b>passerelle</b> entre des groupes qui ne se parlent pas directement.',
      explain: 'Thomas est au café et dans « Les clés de 12 », et fait chaque jour le trajet avec Hugo : il relie informellement l’atelier et la boutique.'
    },
    {
      type: 'sort', pts: 0.5,
      q: 'Pour Terra Vélo, classez chaque effet du réseau informel : avantage ou risque ?',
      cats: [ { id: 'AV', label: 'Avantage' }, { id: 'RI', label: 'Risque' } ],
      items: [
        { id: 'n1', cat: 'AV', text: 'Un technicien bloqué obtient de l’aide en quelques minutes.' },
        { id: 'n2', cat: 'RI', text: 'Julien découvre après coup une décision prise dans son propre service.', why: 'Le réseau informel a contourné la hiérarchie : Julien perd la maîtrise de son service.' },
        { id: 'n3', cat: 'RI', text: 'Les vendeurs, absents des échanges, se sentent tenus à l’écart.' },
        { id: 'n4', cat: 'AV', text: 'Les nouvelles circulent très vite au sein de l’atelier.' },
        { id: 'n5', cat: 'RI', text: 'Une rumeur sur la fermeture de l’atelier après l’ouverture d’Albi se propage.', why: 'Sans contrôle, l’information peut être déformée : c’est un risque.' },
        { id: 'n6', cat: 'AV', text: 'Les techniciens sont très soudés et se couvrent les uns les autres en cas de surcharge.' }
      ],
      hint: 'Un même réseau peut produire le meilleur et le pire. Pour chaque effet, demandez-vous : qui y gagne, qui y perd ?',
      hint2: 'Notion à mobiliser : le réseau informel apporte <b>rapidité, entraide, cohésion</b>, mais comporte des <b>risques</b> : contournement de la hiérarchie, rumeurs, exclusion.',
      explain: 'Avantages : entraide, rapidité, solidarité. Risques : hiérarchie contournée, exclusion des vendeurs, rumeurs.'
    }
  ]
},
{
  id: 'a34', mission: 'm3', ch: 3, obj: 2, title: 'Le fil de mails',
  notions: ['Interactions au sein des équipes', 'Communication et escalade d’un désaccord'],
  remediation: 'Les interactions dans une équipe dépendent du canal (l’écrit favorise les malentendus), des formulations (généralisations, jugements, menaces) et des destinataires (mettre des équipes entières en copie transforme un désaccord entre deux personnes en affrontement entre groupes).',
  intro: 'Mardi, Nadia vous transfère un échange de mails : « Tu peux regarder ? Je n’ai pas le temps. »',
  parts: [
    {
      type: 'highlight', pts: 0.5,
      q: 'Sélectionnez les passages qui transforment un désaccord d’organisation en affrontement entre personnes ou entre services.',
      head: 'Objet : Délai 48 h — encore 4 retards cette semaine',
      segments: [
        { t: '<span class="mail-meta">9 h 12 · Inès → Julien · copie : Nadia</span>', ok: false, meta: true },
        { t: 'Julien, 4 vélos sur 11 n’ont pas été prêts dans les 48 h cette semaine.', ok: false, why: 'C’est un constat chiffré : il peut être discuté, mais il n’attaque personne.' },
        { t: 'Les clients m’appellent moi, pas l’atelier. Merci de faire le nécessaire.', ok: false },
        { t: '<span class="mail-meta">11 h 47 · Julien → Inès</span>', ok: false, meta: true },
        { t: 'Copie : Nadia, <b>toute l’équipe atelier</b>', ok: true },
        { t: 'Les 4 vélos avaient des pannes électriques impossibles à diagnostiquer au comptoir.', ok: false, why: 'C’est une explication factuelle, utile pour comprendre le problème.' },
        { t: 'Vous promettez des délais sans savoir ce qu’on répare.', ok: true },
        { t: 'Comme d’habitude.', ok: true },
        { t: '<span class="mail-meta">12 h 05 · Inès → Julien</span>', ok: false, meta: true },
        { t: 'Copie : Nadia, <b>toute l’équipe boutique</b>', ok: true },
        { t: 'Je ne fais qu’appliquer ce qui a été décidé.', ok: false },
        { t: 'Si l’atelier n’est pas capable de s’organiser, il faudra en tirer les conséquences.', ok: true }
      ],
      hint: 'Repérez trois mécanismes : une généralisation, une menace, et le choix des personnes mises en copie.',
      hint2: 'Notion à mobiliser : la <b>communication</b> se dégrade quand on passe des faits aux jugements (« comme d’habitude », « pas capable ») et quand on élargit le conflit au groupe (copies).',
      explain: 'Les généralisations, l’accusation et la menace attaquent les personnes ; les copies à chaque équipe transforment un désaccord entre deux responsables en affrontement atelier contre boutique.'
    },
    {
      type: 'choice', pts: 0.25,
      q: 'Quel diagnostic de ces échanges est le plus juste ?',
      options: [
        { id: 'f1', ok: true,  text: 'Par écrit et avec des copies élargies, chaque responsable devient le porte-parole de son équipe : le désaccord se transforme en affrontement entre deux groupes, que personne n’arbitre.' },
        { id: 'f2', ok: false, text: 'Le problème vient uniquement du canal utilisé : si Inès et Julien s’étaient téléphoné, leur désaccord sur le délai de 48 heures aurait disparu.',
          why: 'Le canal aggrave, mais le désaccord de fond (délai promis sans diagnostic) resterait entier.' },
        { id: 'f3', ok: false, text: 'Julien a raison sur le fond puisque les pannes étaient électriques : la dégradation des échanges est donc entièrement de la responsabilité d’Inès.',
          why: 'Les deux responsables utilisent des formulations qui aggravent le conflit ; chercher un coupable n’est pas un diagnostic.' },
        { id: 'f4', ok: false, text: 'Les échanges restent professionnels puisque les deux responsables se vouvoient et utilisent la messagerie officielle de l’entreprise.',
          why: 'La politesse formelle n’empêche pas les jugements, les menaces et l’escalade.' }
      ],
      hint: 'Regardez comment la liste des destinataires évolue d’un mail à l’autre, et qui ne répond pas.',
      hint2: 'Notion à mobiliser : les <b>interactions d’équipe</b> dépendent du canal, des formulations et de l’appartenance au groupe ; sans régulation, un désaccord s’étend.',
      explain: 'L’écrit, les copies et les jugements font glisser un problème d’organisation vers un affrontement entre groupes, et la direction n’arbitre pas.'
    }
  ]
},
{
  id: 'a35', mission: 'm3', ch: 3, obj: 4, title: 'L’incident Garcia',
  notions: ['Causes d’un conflit', 'Nature d’un conflit (interpersonnel, intergroupe)', 'Styles de leadership', 'Modes de résolution des conflits'],
  remediation: 'Analyser un conflit, c’est distinguer ses causes profondes (objectifs divergents, organisation, communication) de l’élément déclencheur, identifier les acteurs et les groupes, puis évaluer le leadership : un leadership laisser-faire ou autoritaire ne traite pas les causes. La médiation ou la recherche d’une solution commune, en associant les leaders informels, est plus durable.',
  intro: `Jeudi, 17 h. M. Garcia, gérant de l’entreprise de livraison « Vite Livré » (12 vélos loués chez Terra Vélo), vient chercher un vélo promis en 48 h. Il n’est pas prêt.
           Devant lui et devant Julien, Inès déclare : « Désolée, l’atelier a encore pris du retard. » Julien répond sèchement. Le ton monte, dans la boutique, devant d’autres clients. M. Garcia repart en menaçant de résilier son contrat.`,
  parts: [
    {
      type: 'sort', pts: 0.5,
      q: 'Classez chaque élément : cause profonde du conflit, élément déclencheur, ou affirmation non établie par les faits ?',
      cats: [ { id: 'P', label: 'Cause profonde' }, { id: 'D', label: 'Élément déclencheur' }, { id: 'N', label: 'Non établi' } ],
      items: [
        { id: 'g1', cat: 'P', text: 'Le délai de 48 h a été promis aux clients sans que l’atelier soit consulté.' },
        { id: 'g2', cat: 'D', text: 'La phrase d’Inès devant M. Garcia : « l’atelier a encore pris du retard ».',
          why: 'Cette phrase fait éclater le conflit ce jour-là, mais elle n’en est pas la cause : le désaccord existait avant.' },
        { id: 'g3', cat: 'P', text: 'La boutique cherche à vendre vite, l’atelier à réparer parfaitement.' },
        { id: 'g4', cat: 'P', text: 'Il n’existe aucun moment de travail commun entre l’atelier et la boutique.' },
        { id: 'g5', cat: 'N', text: 'Julien n’aime pas les commerciaux.', why: 'Aucun fait ne le montre : c’est une supposition sur sa personnalité.' },
        { id: 'g6', cat: 'N', text: 'Inès cherche à prendre la place de Julien.', why: 'Rien ne permet de l’affirmer. Attention aux interprétations sur les intentions.' }
      ],
      hint: 'Si l’élément avait été évité ce jour-là, le conflit aurait-il disparu pour de bon ?',
      hint2: 'Notion à mobiliser : les <b>causes profondes</b> (objectifs divergents, organisation, communication) se distinguent de l’<b>élément déclencheur</b>. Les suppositions sur les intentions ne sont pas des causes établies.',
      explain: 'Causes profondes : délai décidé sans l’atelier, objectifs divergents, absence de coordination. Déclencheur : la phrase devant le client. Le reste relève de la supposition.'
    },
    {
      type: 'choice', pts: 0.25,
      q: 'Comment qualifier ce conflit ?',
      options: [
        { id: 'q1', ok: false, text: 'Un conflit interpersonnel entre Inès et Julien, dû à une incompatibilité de caractères.', why: 'Il oppose deux responsables, mais derrière eux ce sont deux services aux objectifs différents.' },
        { id: 'q2', ok: true,  text: 'Un conflit entre deux services aux objectifs divergents, incarné par leurs deux responsables.' },
        { id: 'q3', ok: false, text: 'Un conflit hiérarchique entre les salariés et leur directrice, qui ne s’occupe plus d’eux.', why: 'Nadia n’est pas partie au conflit, même si son absence de régulation l’aggrave.' },
        { id: 'q4', ok: false, text: 'Un simple malentendu ponctuel, qui ne constitue pas vraiment un conflit.', why: 'Opposition durable, émotions fortes, équipes impliquées : c’est bien un conflit.' }
      ],
      hint: 'Relisez le fil de mails : qui a été mis en copie par Julien et par Inès ?',
      hint2: 'Notion à mobiliser : un conflit peut être <b>interpersonnel</b> ou <b>intergroupe</b>. Ici, chaque responsable défend son service.',
      explain: 'Le conflit semble opposer deux personnes, mais il oppose en réalité deux groupes (atelier et boutique) aux objectifs divergents.'
    },
    {
      type: 'fields', pts: 0.5,
      q: 'Associez chaque comportement au style de leadership qu’il illustre.',
      shared: ['Autoritaire (directif)', 'Participatif (démocratique)', 'Laisser-faire', 'Paternaliste', 'Leadership informel'],
      rows: [
        { label: 'En 2014, Nadia décidait des achats en réunion avec toute l’équipe, après avoir recueilli l’avis de chacun.', answer: 1 },
        { label: 'Jeudi soir, Nadia : « Débrouillez-vous, je ne veux plus en entendre parler. »', answer: 2,
          why: 'Laisser les responsables régler seuls le conflit, sans cadre ni suivi, c’est du laisser-faire, pas de la participation.' },
        { label: 'Vendredi, Nadia impose par note : délai de 72 h, toute prise en charge validée par Julien. Inès n’a pas été consultée.', answer: 0 },
        { label: 'Karim réunit les techniciens au café : « On se calme, on fait nos vélos, ça va se tasser. »', answer: 4,
          why: 'Karim n’a aucune autorité hiérarchique : il influence le groupe grâce à la confiance qu’on lui accorde.' }
      ],
      hint: 'Pour chaque situation : qui décide, et les personnes concernées ont-elles été consultées ?',
      hint2: 'Notion à mobiliser : les <b>styles de leadership</b> se distinguent par la place laissée aux autres dans la décision. Le leadership peut aussi être exercé sans position hiérarchique.',
      explain: 'Nadia est passée d’un style participatif à une alternance laisser-faire puis autoritaire. Karim exerce un leadership informel.'
    },
    {
      type: 'choice', pts: 0.5,
      q: 'Nadia vous demande conseil. Quel mode de résolution a le plus de chances de régler durablement le conflit ?',
      options: [
        { id: 's1', ok: false, text: 'Maintenir la note de vendredi : l’autorité de la direction a tranché, et chacun sait désormais ce qu’il doit faire.',
          why: 'L’arbitrage autoritaire fait un gagnant et un perdant, sans traiter les causes. Inès, non consultée, risque de le contester.' },
        { id: 's2', ok: true,  text: 'Réunir Inès et Julien avec un tiers neutre, faire exprimer les contraintes de chaque service et construire ensemble une règle de délai.' },
        { id: 's3', ok: false, text: 'Fixer le délai à 60 h pour couper la poire en deux, afin que chacun des deux responsables fasse un pas vers l’autre.',
          why: 'Le compromis traite le symptôme (le chiffre) mais pas la cause : des délais promis sans diagnostic.' },
        { id: 's4', ok: false, text: 'Séparer davantage la boutique et l’atelier pour réduire au maximum les occasions de contact entre les deux équipes.',
          why: 'L’évitement supprime les contacts mais aussi la coordination indispensable entre vente et réparation.' }
      ],
      hint: 'Quelle solution s’attaque aux causes profondes identifiées plus haut, et non au seul chiffre du délai ?',
      hint2: 'Notion à mobiliser : les <b>modes de résolution</b> (évitement, arbitrage, compromis, médiation, coopération) n’ont pas la même efficacité selon les causes du conflit.',
      explain: 'La médiation permet de traiter les causes : objectifs divergents et absence de coordination. La règle construite ensemble a plus de chances d’être appliquée.'
    },
    {
      type: 'choice', pts: 0.25,
      reveal: '<b>Nouvelle information.</b> La réunion a lieu. Julien propose un diagnostic de 20 minutes à chaque prise en charge ; Inès annoncera le délai au client après ce diagnostic. Accord conclu. Une semaine plus tard, les techniciens ne font pas les diagnostics : « On n’a pas été consultés. » Karim n’avait pas été invité à la réunion.',
      q: 'Que conseillez-vous maintenant à Nadia ?',
      options: [
        { id: 'z1', ok: false, text: 'Rappeler par écrit à chaque technicien que la nouvelle procédure est obligatoire à compter de lundi.', why: 'Revenir à l’autorité formelle ignore la raison du blocage : le réseau informel n’adhère pas.' },
        { id: 'z2', ok: true,  text: 'Associer Karim à la présentation et à l’ajustement de la procédure, pour qu’il la relaie auprès de l’atelier.' },
        { id: 'z3', ok: false, text: 'Demander à Julien de sanctionner les techniciens qui n’appliquent pas la procédure.', why: 'La sanction risque de souder l’atelier contre Julien et de relancer le conflit.' },
        { id: 'z4', ok: false, text: 'Abandonner la procédure, puisque l’atelier ne la soutient pas.', why: 'La procédure traite une vraie cause du conflit ; le problème est l’adhésion, pas la solution.' }
      ],
      hint: 'Qui, à l’atelier, a le plus d’influence sur les techniciens, sans être leur chef ?',
      hint2: 'Notion à mobiliser : un <b>leader informel</b> peut bloquer ou faciliter un changement. L’associer renforce l’adhésion.',
      explain: 'La solution est bonne, mais le leader informel a été oublié. En associant Karim, Nadia s’appuie sur le réseau informel au lieu de s’y heurter.'
    }
  ]
},

/* ─────────────── MISSION FINALE ─────────────── */
{
  id: 'a41', mission: 'm4', ch: [1, 2, 3], title: 'Trier les constats',
  notions: ['Mobiliser les trois chapitres pour structurer un diagnostic'],
  remediation: 'Un diagnostic se structure : ce qui relève de l’organisation (nature, ressources, parties prenantes), ce qui relève des individus (personnalité, émotions, représentation de soi, compétences) et ce qui relève des relations (culture, réseaux, leadership, conflits).',
  intro: 'Vous rassemblez les éléments collectés depuis trois mois.',
  doc: `<div class="doc-card"><div class="doc-head"><span>Baromètre interne</span><span>Septembre</span></div><div class="doc-body">
    <table class="mini"><thead><tr><th></th><th>Atelier</th><th>Boutique</th></tr></thead><tbody>
      <tr><td>« Je me sens écouté par la direction »</td><td>38 %</td><td>71 %</td></tr>
      <tr><td>« Je comprends les objectifs de l’entreprise »</td><td>55 %</td><td>90 %</td></tr>
      <tr><td>Départs sur 12 mois</td><td>0</td><td>3</td></tr>
    </tbody></table>
    <p style="margin-top:10px">Financement d’Albi : prêt bancaire 180 000 € · apport des associés 40 000 € · subvention Agglo 25 000 € (conditionnée à deux embauches).</p>
  </div></div>`,
  parts: [{
    type: 'sort', pts: 0.75,
    q: 'Classez chaque constat dans la partie de la note de diagnostic à laquelle il se rattache.',
    cats: [ { id: 'O', label: 'L’organisation' }, { id: 'I', label: 'Les individus' }, { id: 'R', label: 'Les relations' } ],
    items: [
      { id: 'd1', cat: 'O', text: 'Le projet d’Albi est financé aux trois quarts par un emprunt bancaire.' },
      { id: 'd2', cat: 'O', text: 'L’Agglomération conditionne sa subvention à deux embauches locales.' },
      { id: 'd3', cat: 'I', text: 'Léa forme désormais les nouveaux techniciens et propose des idées.' },
      { id: 'd4', cat: 'I', text: 'Inès se décrit comme « la seule ici à penser business ».', why: 'C’est l’image qu’Inès a d’elle-même : représentation de soi.' },
      { id: 'd5', cat: 'R', text: 'Seuls 38 % des techniciens se sentent écoutés par la direction.', why: 'Le sentiment d’écoute renvoie au leadership de la direction : c’est une question de relations.' },
      { id: 'd6', cat: 'R', text: 'Les informations importantes arrivent d’abord à la pause café de l’atelier.' },
      { id: 'd7', cat: 'I', text: 'Julien redoute de ne plus pouvoir contrôler la qualité de chaque vélo.', why: 'Il s’agit d’une émotion (la peur) propre à un individu.' },
      { id: 'd8', cat: 'R', text: 'Les vendeurs recrutés récemment ne connaissent pas les rites de l’entreprise.', why: 'La transmission de la culture relève du fonctionnement collectif.' }
    ],
    hint: 'Le constat concerne-t-il l’entreprise et ses partenaires, une personne en particulier, ou la façon dont les gens fonctionnent ensemble ?',
    hint2: 'Notions à mobiliser : ch. 1 (ressources, parties prenantes), ch. 2 (émotions, représentation de soi, compétences), ch. 3 (culture, réseaux, leadership).',
    explain: 'Organisation : financement et parties prenantes. Individus : Léa, Inès, Julien. Relations : leadership, réseau informel, culture.'
  }]
},
{
  id: 'a42', mission: 'm4', ch: 1, title: 'Le partenariat',
  notions: ['Caractéristiques des associations et des organisations publiques', 'Parties prenantes'],
  remediation: 'Une association peut vendre des biens et des services, mais ne partage pas ses excédents entre ses membres. Une organisation publique agit dans une logique d’intérêt général. Une entreprise reste une entreprise même si elle poursuit aussi des objectifs sociaux.',
  intro: 'L’Agglomération propose que Terra Vélo et l’association Roue Libre ouvrent ensemble, à Albi, un atelier qui emploierait des jeunes en insertion. Nadia hésite et vous pose plusieurs questions.',
  parts: [{
    type: 'fields', pts: 0.75,
    q: 'Vrai ou faux ?',
    shared: ['Vrai', 'Faux'],
    rows: [
      { label: 'Roue Libre ne peut pas facturer ses réparations, puisque c’est une association.', answer: 1, why: 'Une association peut vendre des biens et des services.' },
      { label: 'Si Roue Libre dégage un excédent, elle ne peut pas le distribuer à ses adhérents.', answer: 0 },
      { label: 'En proposant ce partenariat, l’Agglomération agit dans une logique d’intérêt général.', answer: 0 },
      { label: 'Terra Vélo deviendrait une association si elle employait des jeunes en insertion.', answer: 1, why: 'Poursuivre un objectif social ne change ni le statut ni la finalité lucrative de l’entreprise.' },
      { label: 'Ce partenariat ferait de Roue Libre une partie prenante externe de Terra Vélo.', answer: 0 }
    ],
    hint: 'Pour chaque affirmation, revenez aux critères de distinction : finalité, affectation des excédents, statut.',
    hint2: 'Notion à mobiliser : une association peut avoir une activité marchande ; ce qui la définit, c’est la <b>non-lucrativité</b>.',
    explain: 'Une association peut facturer, mais ne distribue pas d’excédents. L’Agglomération sert l’intérêt général. Terra Vélo reste une entreprise. Roue Libre deviendrait une partie prenante externe.'
  }]
},
{
  id: 'a43', mission: 'm4', ch: [2, 3], title: 'Qui pour diriger Albi ?',
  notions: ['Leader formel et leader informel', 'Représentation de soi et rôle dans l’équipe'],
  remediation: 'Un leader informel tire sa légitimité de la confiance du groupe ; il n’obtient pas automatiquement la même légitimité en devenant chef, ni auprès d’autres équipes. Changer les rôles modifie l’équilibre du réseau informel et peut créer de nouvelles tensions si les rôles ne sont pas définis clairement.',
  intro: 'Nadia hésite entre Inès, Julien et Karim pour diriger Albi. Elle penche pour Karim.',
  parts: [
    {
      type: 'multi', pts: 1,
      q: 'Sélectionnez <u>tous</u> les arguments pertinents, pour ou contre la nomination de Karim.',
      options: [
        { id: 'b1', ok: true,  text: 'Karim est reconnu par l’atelier : son autorité repose sur la confiance de ses collègues, pas sur l’organigramme.' },
        { id: 'b2', ok: true,  text: 'Il incarne la culture de Terra Vélo, ce qui peut aider à la transmettre à une équipe nouvelle.' },
        { id: 'b3', ok: true,  text: 'Son départ priverait l’atelier de Gaillac de son principal relais informel, au moment où la procédure de diagnostic se met en place.' },
        { id: 'b4', ok: true,  text: 'Être un leader informel apprécié ne garantit pas de savoir exercer une autorité formelle : il faudra l’accompagner.' },
        { id: 'b5', ok: false, text: 'Karim a déjà montré qu’il savait arbitrer entre l’atelier et la boutique lors de l’incident Garcia.',
          why: 'Lors de l’incident, Karim a apaisé l’atelier, pas arbitré entre les deux services.' },
        { id: 'b6', ok: false, text: 'Une fois nommé, un leader informel obtient automatiquement la même légitimité auprès de toutes les équipes.',
          why: 'La légitimité informelle est liée à un groupe précis : elle ne se transfère pas automatiquement.' },
        { id: 'b7', ok: false, text: 'Karim est le meilleur choix puisque c’est le salarié le plus ancien de l’entreprise.',
          why: 'Julien et Sophie sont plus anciens ; et l’ancienneté ne fait pas le leadership.' },
        { id: 'b8', ok: false, text: 'Le choix d’un responsable doit reposer uniquement sur les compétences techniques, les relations comptant peu.',
          why: 'Diriger une équipe mobilise surtout des compétences relationnelles et du leadership.' }
      ],
      hint: 'Il y a des arguments pour et des arguments contre. Écartez ceux qui ne sont pas appuyés par les faits ou qui généralisent.',
      hint2: 'Notions à mobiliser : <b>leader informel / leader formel</b>, <b>culture</b>, rôle du <b>réseau informel</b>, compétences relationnelles.',
      explain: 'Pour : légitimité informelle, incarnation de la culture. Contre : départ du pivot du réseau de Gaillac, passage délicat du leadership informel à l’autorité formelle.'
    },
    {
      type: 'choice', pts: 0.5,
      reveal: '<b>Nouvelle information.</b> Karim accepte, à une condition : que Léa devienne « référente technique » de l’atelier de Gaillac. Nadia est d’accord. Julien n’a pas été consulté.',
      q: 'Quel est le principal risque, et que faut-il faire ?',
      options: [
        { id: 'x1', ok: false, text: 'Aucun risque réel : la nouvelle confiance de Léa suffit à garantir sa légitimité auprès de toute l’équipe de l’atelier.', why: 'La confiance en soi de Léa ne lui donne pas automatiquement de légitimité auprès des autres, ni l’accord de son responsable.' },
        { id: 'x2', ok: true,  text: 'Un risque de tension avec Julien, responsable officiel, contourné une fois de plus : il faut définir ce rôle clairement et l’associer à la décision.' },
        { id: 'x3', ok: false, text: 'Un risque que Léa soit débordée par ce rôle : il vaut mieux le lui refuser pour préserver la confiance qu’elle vient d’acquérir.', why: 'Refuser le rôle nierait les progrès de Léa. Le problème porte sur la façon de décider, pas sur Léa.' },
        { id: 'x4', ok: false, text: 'Un risque de conflit avec Inès : il faudrait que la référente technique soit rattachée à la boutique plutôt qu’à l’atelier.', why: 'Rien n’oppose Léa à Inès. Le risque se situe au sein de l’atelier.' }
      ],
      hint: 'Qui est le responsable officiel de Léa, et comment a-t-il été traité jusqu’ici dans les décisions de l’atelier ?',
      hint2: 'Notions à mobiliser : <b>réseau formel</b> contourné, <b>représentation de soi</b>, prévention des conflits par des rôles clairs.',
      explain: 'Julien a déjà été contourné plusieurs fois. Nommer Léa sans lui risque de rouvrir un conflit ; définir le rôle et associer Julien le prévient.'
    }
  ]
},
{
  id: 'a44', mission: 'm4', ch: [1, 2, 3], title: 'La note de diagnostic',
  notions: ['Rédiger un diagnostic avec le vocabulaire juste'],
  remediation: 'Un diagnostic rigoureux emploie les notions à bon escient : ne pas confondre subvention et statut public, laisser-faire et participation, cause individuelle et cause organisationnelle.',
  intro: 'Il reste à rédiger la note. Pour chaque partie, choisissez la formulation la plus juste.',
  parts: [
    {
      type: 'choice', pts: 0.25, ch: 1,
      q: 'Partie 1 — L’organisation',
      options: [
        { id: 'y1', ok: false, text: 'Terra Vélo est devenue une organisation publique, puisqu’elle reçoit une subvention de l’Agglomération et contribue à l’intérêt général.', why: 'Une subvention ne change pas la nature d’une entreprise privée.' },
        { id: 'y2', ok: true,  text: 'Terra Vélo est une entreprise privée à but lucratif ; le projet d’Albi la rend plus dépendante de parties prenantes externes, dont les attentes devront être conciliées.' },
        { id: 'y3', ok: false, text: 'Terra Vélo est une entreprise à but non lucratif, car ses valeurs écologiques passent avant la recherche de bénéfices.', why: 'Les valeurs ne définissent pas la finalité : Terra Vélo réalise et distribue des bénéfices.' }
      ],
      hint: 'Vérifiez chaque mot : statut, finalité, parties prenantes.',
      hint2: 'Notion à mobiliser : ni une subvention ni des valeurs ne modifient la <b>finalité</b> d’une entreprise.',
      explain: 'Entreprise privée lucrative, dont le développement accroît la dépendance envers la banque et la collectivité.'
    },
    {
      type: 'choice', pts: 0.25, ch: 2,
      q: 'Partie 2 — Les individus',
      options: [
        { id: 'y4', ok: false, text: 'Les tensions s’expliquent avant tout par le caractère colérique de Julien : changer de responsable d’atelier suffirait à régler la situation.', why: 'Réduire la situation à la personnalité d’un seul salarié ignore les causes organisationnelles.' },
        { id: 'y5', ok: false, text: 'Les comportements observés viennent surtout des émotions du moment ; les personnalités et les compétences n’y jouent pratiquement aucun rôle.', why: 'Les émotions comptent, mais la personnalité et la représentation de soi aussi.' },
        { id: 'y6', ok: true,  text: 'Les comportements de Julien, Inès et Léa résultent de la rencontre entre leur personnalité, leurs émotions face au changement et l’image qu’ils ont d’eux-mêmes.' }
      ],
      hint: 'Méfiez-vous des explications qui reposent sur une seule cause.',
      hint2: 'Notion à mobiliser : le comportement résulte de plusieurs facteurs individuels et de la situation.',
      explain: 'Personnalité, émotions et représentation de soi se combinent pour expliquer les comportements.'
    },
    {
      type: 'choice', pts: 0.25, ch: 3,
      q: 'Partie 3 — Les relations',
      options: [
        { id: 'y7', ok: false, text: 'Nadia exerce un leadership participatif, puisqu’elle laisse ses responsables régler eux-mêmes leurs désaccords.', why: 'Laisser régler seuls, sans cadre, c’est du laisser-faire. Le participatif associe les autres à une décision que le leader porte.' },
        { id: 'y8', ok: true,  text: 'Deux sous-cultures, un réseau informel qui contourne la hiérarchie et un leadership irrégulier de la direction expliquent la durée du conflit.' },
        { id: 'y9', ok: false, text: 'Le réseau informel est la cause principale du conflit : il faudrait interdire les groupes de messagerie entre les salariés.', why: 'Le réseau informel a aussi des avantages ; l’interdire est irréaliste et ne traite pas les causes.' }
      ],
      hint: 'Une seule proposition utilise correctement le vocabulaire du chapitre 3.',
      hint2: 'Notion à mobiliser : ne pas confondre <b>laisser-faire</b> et <b>participatif</b> ; le réseau informel n’est ni bon ni mauvais en soi.',
      explain: 'Culture divisée, réseau informel non intégré et leadership irrégulier : trois facteurs qui entretiennent le conflit.'
    }
  ]
}
];

const CH_LABELS = {
  1: 'Chapitre 1 — Les types d’organisations',
  2: 'Chapitre 2 — L’individu au sein de l’organisation',
  3: 'Chapitre 3 — Interactions et phénomènes relationnels'
};
