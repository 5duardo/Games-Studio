const fs = require('fs');
const path = require('path');
const os = require('os');

// Intentaremos modificar directamente los datos de la app
const appDataPath = path.join(os.homedir(), 'AppData', 'Roaming', 'iteec-quiz', 'iteec-quiz-data.json');

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

const qs = [
  { text: "¿Qué tipo de palabra es 'canción' según su sílaba tónica?", options: ["Aguda", "Grave", "Esdrújula", "Sobresdrújula"], correct: 0 },
  { text: "¿En qué sílaba llevan la tilde las palabras esdrújulas?", options: ["En la última", "En la penúltima", "En la antepenúltima", "No llevan tilde"], correct: 2 },
  { text: "Identifica la figura literaria en: 'Sus ojos son dos luceros'.", options: ["Símil", "Hipérbole", "Metáfora", "Personificación"], correct: 2 },
  { text: "¿Quién es el autor de 'Cien años de soledad'?", options: ["Julio Cortázar", "Gabriel García Márquez", "Mario Vargas Llosa", "Jorge Luis Borges"], correct: 1 },
  { text: "Selecciona el sinónimo de 'efímero'.", options: ["Duradero", "Pasajero", "Eterno", "Largo"], correct: 1 },
  { text: "Elige el antónimo de 'opaco'.", options: ["Oscuro", "Opalescente", "Transparente", "Sólido"], correct: 2 },
  { text: "¿Cuál de estas palabras es un sustantivo abstracto?", options: ["Mesa", "Amor", "Perro", "Río"], correct: 1 },
  { text: "En la oración 'El perro rojo corre', ¿cuál es el adjetivo?", options: ["El", "perro", "rojo", "corre"], correct: 2 },
  { text: "¿Qué es un diptongo?", options: ["Unión de dos vocales fuertes", "Unión de una vocal fuerte y una débil", "Separación de sílabas", "Tres vocales unidas"], correct: 1 },
  { text: "¿Cuál de estas palabras tiene hiato?", options: ["Ciudad", "Cueva", "Peón", "Ruido"], correct: 2 },
  { text: "¿Cuál de estas oraciones está en voz pasiva?", options: ["El niño come manzanas.", "Las manzanas son comidas por el niño.", "Nosotros comemos.", "Las manzanas rojas caen."], correct: 1 },
  { text: "¿Qué signo de puntuación se usa para separar elementos de una enumeración?", options: ["Punto", "Coma", "Punto y coma", "Dos puntos"], correct: 1 },
  { text: "Palabra escrita correctamente:", options: ["AtraveZar", "Atravesar", "Hatrastes", "Atrabesar"], correct: 1 },
  { text: "¿Cuál es el núcleo del predicado en una oración?", options: ["El sustantivo", "El adjetivo", "El verbo", "El artículo"], correct: 2 },
  { text: "Señala la preposición en la frase: 'Viajaremos por tren a Madrid'.", options: ["Viajaremos", "Por, a", "Tren, Madrid", "No hay preposición"], correct: 1 },
  { text: "¿Cuál es el gentilicio de la persona nacida en Buenos Aires?", options: ["Bonaerense o porteño", "Buenosairense", "Argentino", "Gaucho"], correct: 0 },
  { text: "¿Qué modo verbal expresa deseo o duda?", options: ["Indicativo", "Subjuntivo", "Imperativo", "Infinitivo"], correct: 1 },
  { text: "¿Cuál palabra está escrita con prefijo?", options: ["Caminante", "Panadería", "Deshacer", "Pecera"], correct: 2 },
  { text: "Parte de la oración que sirve para unir palabras o frases (y, e, ni, o, pero):", options: ["Preposición", "Adverbio", "Conjunción", "Sustantivo"], correct: 2 },
  { text: "¿Qué tipo de texto es una receta de cocina?", options: ["Narrativo", "Instructivo", "Descriptivo", "Argumentativo"], correct: 1 },
  { text: "Identifica el pronombre personal en: 'Nosotros iremos al cine mañana'.", options: ["Iremos", "Cine", "Mañana", "Nosotros"], correct: 3 },
  { text: "Ejemplo de palabra homófona:", options: ["Vaca / Baca", "Perro / Gato", "Blanco / Negro", "Caminar / Andar"], correct: 0 },
  { text: "¿Qué es una fábula?", options: ["Un poema épico", "Un cuento largo de ciencia ficción", "Un relato breve que deja una moraleja", "Una obra de teatro trágica"], correct: 2 },
  { text: "Elemento de la comunicación que recibe el mensaje:", options: ["Emisor", "Canal", "Contexto", "Receptor"], correct: 3 },
  { text: "Enunciado que afirma o niega algo:", options: ["Oración exclamativa", "Oración interrogativa", "Oración enunciativa", "Oración imperativa"], correct: 2 },
  { text: "¿A qué género pertenece la poesía?", options: ["Narrativo", "Lírico", "Dramático", "Didáctico"], correct: 1 },
  { text: "Forma no personal del verbo terminada en -ando, -iendo:", options: ["Infinitivo", "Participio", "Gerundio", "Condicional"], correct: 2 },
  { text: "¿Qué figura retórica se encuentra en 'El reloj cantó la hora'?", options: ["Metáfora", "Personificación", "Epíteto", "Aliteración"], correct: 1 },
  { text: "El uso de la b y la v: ¿cuál es correcta?", options: ["Bíbora", "Vívora", "Víbora", "Bívora"], correct: 2 },
  { text: "¿En qué siglo vivió Miguel de Cervantes Saavedra?", options: ["Siglo XV y XVI", "Siglo XVI y XVII", "Siglo XVII y XVIII", "Siglo XIX"], correct: 1 },
  { text: "¿Qué regla de acentuación siguen las palabras sobreesdrújulas?", options: ["Llevan tilde si terminan en n, s o vocal", "No llevan tilde", "Siempre llevan tilde", "Solo a veces"], correct: 2 },
  { text: "¿Cuál de estos es un sustantivo colectivo?", options: ["Árbol", "Lobo", "Manada", "Abeja"], correct: 2 },
  { text: "¿Qué significa el refrán 'A caballo regalado no se le mira los dientes'?", options: ["Hay que ser dentista", "Es mejor regalar caballos", "Acepta los regalos sin buscar defectos", "Cuidado con los caballos enfermos"], correct: 2 },
  { text: "¿Cuál palabra lleva h intercalada?", options: ["Búho", "Hielo", "Huérfano", "Hambre"], correct: 0 },
  { text: "¿Cuál de estos verbos está en tiempo pretérito perfecto simple (pasado)?", options: ["Cantaba", "Cantaré", "Cantó", "Cantaría"], correct: 2 },
  { text: "¿Qué es el sujeto tácito?", options: ["El que no realiza la acción", "El que se menciona en la oración", "El que se sobreentiende sin escribirse", "Un sujeto invertido"], correct: 2 },
  { text: "Antónimo de 'cobarde':", options: ["Miedoso", "Valiente", "Triste", "Lento"], correct: 1 },
  { text: "¿Cuál de los siguientes es un adverbio de lugar?", options: ["Allí", "Mañana", "Mucho", "Rápidamente"], correct: 0 },
  { text: "¿Cómo se llama el idioma español también?", options: ["Latín", "Castellano", "Galaico", "Íbero"], correct: 1 },
  { text: "¿Qué tipo de rima coinciden vocales y consonantes a partir de la última sílaba tónica?", options: ["Asonante", "Consonante", "Libre", "Blanca"], correct: 1 },
  { text: "¿Quién escribió la obra teatral 'Bodas de sangre'?", options: ["Lope de Vega", "Tirso de Molina", "Federico García Lorca", "Pedro Calderón de la Barca"], correct: 2 },
  { text: "Elige la palabra correctamente escrita con ll o y:", options: ["Lluvia", "Yuvia", "Llubia", "Yubia"], correct: 0 },
  { text: "Oración bimembre es aquella que:", options: ["No tiene verbo", "Se divide en sujeto y predicado", "Es solo una exclamación", "Tiene un solo miembro"], correct: 1 },
  { text: "¿Cuál de las siguientes es una obra épica medieval castellana?", options: ["La Ilíada", "Cantar de mio Cid", "La Araucana", "El Quijote"], correct: 1 },
  { text: "Sinónimo de 'pedagogía':", options: ["Medicina", "Enseñanza", "Filosofía", "Arquitectura"], correct: 1 },
  { text: "¿Qué pronombre es de segunda persona plural formal en España?", options: ["Ellos", "Vosotros / Ustedes", "Nosotros", "Tú"], correct: 1 },
  { text: "¿Cuál es el plural de 'cruz'?", options: ["Cruzes", "Cruces", "Crunches", "Cruzs"], correct: 1 },
  { text: "Palabra aguda sin tilde:", options: ["Café", "Pared", "León", "Salón"], correct: 1 },
  { text: "¿Qué movimiento literario fundó el poeta nicaragüense Rubén Darío?", options: ["Romanticismo", "Realismo", "Modernismo", "Vanguardismo"], correct: 2 },
  { text: "Parte del libro donde se enumeran los capítulos y su página:", options: ["Prólogo", "Índice", "Epílogo", "Glosario"], correct: 1 }
];

let data = {
  teams: [],
  settings: {
    timerEnabled: true,
    defaultTimeLimit: 30,
    showCorrectAnswer: true
  }
};

// Leer datos actuales de la app si existen
if (fs.existsSync(appDataPath)) {
  try {
    data = JSON.parse(fs.readFileSync(appDataPath, 'utf8'));
  } catch (err) {
    console.error("Error al leer datos actuales, creando nuevos...");
  }
}

// Crear el equipo Español
const newTeam = {
  id: generateId(),
  name: "Español",
  color: "#f43f5e",
  icon: "📚",
  questions: qs.map(q => ({
    id: generateId(),
    text: q.text,
    options: q.options,
    correct: q.correct,
    timeLimit: 30
  }))
};

// Remover equipo Español si ya existía para evitar duplicados
data.teams = data.teams.filter(t => t.name !== "Español");

// Agregar el nuevo equipo
data.teams.push(newTeam);

// Guardar archivo para importar manualmente por si acaso
fs.writeFileSync('preguntas_espanol_importar.json', JSON.stringify(data, null, 2));

// Guardar en la ruta de datos de la app
try {
  if (fs.existsSync(path.dirname(appDataPath))) {
    fs.writeFileSync(appDataPath, JSON.stringify(data, null, 2));
    console.log("Datos de la aplicación actualizados correctamente en:", appDataPath);
  }
} catch (e) {
  console.log("No se pudo escribir en AppData, pero se creó el archivo preguntas_espanol_importar.json en el escritorio.");
}

console.log("Completado.");
