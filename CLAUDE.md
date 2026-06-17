# FetalPhysio — Documento de Contexto para Continuación del Desarrollo

**Versión del documento:** Junio 2026  
**Autora del proyecto:** Emma (Mat. Emmanuel Andrades Rodríguez)  
**Institución:** Escuela de Obstetricia y Puericultura, Universidad de Talca, Chile  
**Archivo de trabajo actual:** `fetalphysio_v15.tsx` (archivo único, ~3.200 líneas)

---

## 1. DESCRIPCIÓN GENERAL

FetalPhysio es una **plataforma web interactiva de entrenamiento clínico en cardiotocografía (CTG)** orientada a estudiantes de obstetricia, matrones/as, internos, residentes y médicos obstetras.

### Propósito pedagógico central
La plataforma enseña interpretación de CTG **desde la fisiología**, no desde el reconocimiento de patrones morfológicos. La filosofía se opone explícitamente a los sistemas de clasificación categórica (NICHD, FIGO) y propone un enfoque fisiopatológico basado en:
- Mecanismos compensatorios fetales
- Reserva fetal dinámica
- Progresión hipóxica temporal
- Razonamiento clínico integrado

**Frase ancla del proyecto:** *"Interpreta al feto, no solo el trazado."*

### Audiencia
- Estudiantes de obstetricia (pregrado)
- Matronas/es en ejercicio
- Internos y residentes
- Médicos obstetras en actualización

---

## 2. STACK TECNOLÓGICO

| Tecnología | Uso |
|---|---|
| React 18 | Framework UI (JSX/TSX) |
| TypeScript | Tipado estático |
| Tailwind CSS | Estilos (via CDN en producción) |
| lucide-react | Iconografía |
| HTML5 Canvas | Motor de trazado CTG |
| esbuild | Compilación a bundle standalone |
| Vite (en migración) | Entorno de desarrollo local |
| Netlify | Hosting (Drop o GitHub CI) |

### Arquitectura
- **Archivo único `App.tsx`** — toda la app en un solo archivo TSX (~3.200 líneas)
- **Sin backend, sin base de datos, sin autenticación**
- **Sin localStorage** — el estado se reinicia al recargar (decisión explícita de la v1)
- **Imágenes embebidas como base64** — logos y foto de perfil dentro del TSX
- **Deliverable final:** un archivo `fetalphysio.html` standalone generado con esbuild

### Comando de compilación
```bash
npx esbuild entry.tsx --bundle --loader:.tsx=tsx --platform=browser --target=es2020 --minify --outfile=bundle_min.js
```
Luego se envuelve el bundle en un HTML con Tailwind CDN.

---

## 3. IDENTIDAD VISUAL Y BRANDING

### Nombre
**FetalPhysio** — wordmark: `Fetal<span cyan>Physio</span>`

### Subtítulo oficial
*"Advanced CTG Physiology Training"* (en inglés, funciona como nombre técnico de marca)

### Paleta de colores
| Rol | Color |
|---|---|
| Acento primario | `cyan-400` / `#22d3ee` |
| Acento secundario | `blue-400` / `#60a5fa` |
| Fondo oscuro principal | `#0B1120` |
| Fondo dark sections | `#0D1321` |
| Fondo monitor CTG | `#050816` |
| Texto principal | `white` / `slate-900` |
| Texto secundario | `slate-400` / `slate-500` |
| FCF en monitor hero | `#6EE7FF` |
| TOCO en monitor hero | `#F59E0B` |

### Estética
**"Dark Clinical / Premium Medical / Academic Technology"**  
Inspiración: AMBOSS, Osmosis, Philips Healthcare, GE Healthcare  
No gaming, no cyberpunk, no dashboards financieros.

### Logo
- Esfera con silueta fetal y banda de trazado CTG
- Embebida como base64 en el TSX: `LOGO_SPHERE` (para navbar y hero) y `LOGO_FULL`
- Foto de Emma también embebida como `FOTO_EMMANUEL`

---

## 4. ESTRUCTURA DE VISTAS

La app tiene 5 vistas principales controladas por el estado `currentView`:

### `inicio` — HomeView
- **Hero section:** fondo oscuro `#0B1120`, logo con glow cian, headline *"Interpreta al feto, no solo el trazado."*, subtexto en español con palabras clave en cian, badge animado con punto pulsante, CTA principal.
- **Sección "Beyond the Tracing":** panel oscuro entre hero y tarjetas. Contiene monitor CTG SVG animado en tiempo real con motor real (mismas funciones que los casos clínicos). Trazado FCF en `#6EE7FF` con glow, TOCO en `#F59E0B`. Grid obstétrico, indicadores clínicos flotantes (FCF 140 bpm, Variabilidad Moderada, Estado fetal Compensado). Scroll horizontal continuo de 40 segundos via `animateTransform` SVG.
- **Tarjetas informativas:** grid 3 columnas con descripción de funcionalidades.
- **Sección "Quiénes Somos":** foto de Emma, reseña biográfica, misión de la plataforma.

### `teoria` — TheoryView → TheoryDocsView
**Flujo de 3 niveles:**

**Nivel 1 — Mapa de Módulos (landing):**  
Fondo `#0B1120` con partículas flotantes ambientales (5 puntos en colores de módulos), halo radial cian, badge animado, headline "Cardiotocografía desde la fisiología", frase ancla con anillo de pulso, stats (6 módulos, 23 temas, 8 pasos, 13 errores), 6 tarjetas de módulos con glow y scan en hover, botón CTA.

**Nivel 2 — Docs View (índice lateral + contenido):**  
Layout tipo documentación técnica:
- Sidebar oscuro fijo izquierdo (272px): logo, título, nav por módulos expandibles con color propio por módulo, indicador de tema activo.
- Panel de contenido derecho: scrollable independiente, breadcrumb, header de tema, contenido, navegación anterior/siguiente.
- Al cambiar de tema: `scrollTop = 0` automático via `useEffect`.
- Al abrir desde el mapa: se abre directamente en el primer tema del módulo seleccionado.
- Error boundary (`TheoryErrorBoundary`) envuelve el contenido para mostrar errores en pantalla en lugar de pantalla blanca.

**6 Módulos con sus temas:**

| Módulo | Color | Temas |
|---|---|---|
| M1 Fundamentos | `#22d3ee` cyan | T1 Nueva mirada CTG, T2 Principios fisiológicos, T3 Mecanismos compensatorios |
| M2 Parámetros del Trazado | `#60a5fa` blue | T4 FCF Basal, T5 Variabilidad, T6 Aceleraciones, T7 Desaceleraciones, T8 Contracciones |
| M3 Estados Conductuales | `#34d399` emerald | T9 Quiescencia, T10 Sueño activo, T11 Vigilia, T12 Cycling |
| M4 Fisiopatología Hipoxia | `#fbbf24` amber | T13-T18 (oxigenación, hipoxia aguda/subaguda/lenta/crónica) |
| M5 Interpretación | `#818cf8` indigo | T19 Algoritmo 8 pasos |
| M6 Actuación Clínica | `#f87171` red | T20-T23 (actuación, reanimación, escalamiento, errores) |

**Contenido disponible (implementado):** M1 completo (T1-T3) y M2 completo (T4-T8). M3-M6 muestran placeholder "Próximamente".

**Componente MiniCTG:** versión compacta del motor CTG real para ilustrar cada parámetro teórico. Acepta `config`, `label`, `caption` y `duration` (default 10 min). Usa exactamente el mismo `CTGCanvas` que los casos clínicos.

**Configs de trazado del M2:**
```
CFG_NORMAL, CFG_TAQUICARD, CFG_BRADICARD (T4)
CFG_VAR_NORM, CFG_VAR_MIN, CFG_VAR_AUSENTE (T5)
CFG_ACCELS (T6)
CFG_VARIABLE, CFG_TARDIA, CFG_PROLONGADA (T7 — esta última usa duration=20)
CFG_TAQUISIS (T8)
```

**CRÍTICO — Orden de definición en el archivo:**  
`TOPIC_CONTENT` debe definirse DESPUÉS de todos los componentes T1Content–T8Content para evitar React error #130 (componente undefined). Este fue un bug recurrente.

### `entrenamiento` — TrainingView
Lista de casos clínicos agrupados por nivel (Introductorio, Intermedio, Avanzado). Tarjetas con contexto clínico, nivel de dificultad, botón para iniciar el caso.

### `simulador` — CaseSimulator
Vista de caso clínico activo. Layout en dos columnas:
- Izquierda: trazado CTG scrollable (`CTGCanvas`)
- Derecha: panel de evaluación con flujo de 3 pasos:
  1. **Formulario:** 8 preguntas con selectores
  2. **CaseResults:** panel de resultado con puntaje y feedback por dimensión
  3. **Análisis fisiopatológico:** feedback textual

### `quienes` — AboutView
Foto de Emma, reseña biográfica completa, misión de la plataforma.

---

## 5. MOTOR CTG (CTGCanvas) — NÚCLEO TÉCNICO

El componente más importante de la plataforma. Renderiza un trazado CTG fisiológico realista usando HTML5 Canvas.

### Escala
- **FHR:** 50–210 lpm mapeados a píxeles `[FHR_TOP=20, FHR_BOTTOM=260]`
- **TOCO:** 0–100 unidades mapeadas a `[TOCO_TOP=280, TOCO_BOTTOM=370]`
- **Velocidad:** 60 px/minuto (escala real de papel CTG)
- **Canvas total:** `duration * 60` px de ancho

### Función hash determinista
```javascript
const hash = (n) => { const s = Math.sin(n*12.9898)*43758.5453; return (s-Math.floor(s))-0.5; }
```
Elimina `Math.random()` para reproducibilidad del trazado.

### Variabilidad fisiológica
```javascript
const variabilityAt = (x, amp) => {
  const slow = Math.sin(x/17) + 0.6*Math.sin(x/6.3) + 0.4*Math.sin(x/2.7);
  const beat = hash(x) * 1.2;
  return ((slow/2.0) + beat*0.5) * (amp/2);
}
```
Suma de senoidales incomensurables + jitter latido a latido.

### Cycling fetal
```javascript
const cyclingFactor = (min) => {
  const phase = Math.sin((min/4) * Math.PI);
  return 0.35 + 0.65 * (0.5 + 0.5 * phase);
}
```
Alterna épocas activas/quietas cada ~4 minutos.

### Aceleraciones
Activadas con `config.accels: true`. Trigger basado en sumas de senoidales que superan umbral.

### Morfologías de desaceleración (decelType)
Estas son las morfologías implementadas con sus características actuales:

**`variable`** (barorreceptoras):
- Caída casi vertical lineal (~4 seg)
- Nadir plano con variabilidad interna irregular (6–21 seg, variable por contracción)
- Profundidad 35–70 lpm (variable por contracción via seed determinista)
- Hombros opcionales: previo ~72%, posterior ~58%, amplitud 8–18 lpm
- Recuperación abrupta simétrica (~4 seg)
- Todos los parámetros son deterministas pero varían entre contracciones via `hash(active*47.3)`

**`late`** (quimiorreceptoras):
- Forma de V estrecha con lag de 25–45 seg respecto al pico contráctil
- Profundidad 20–45 lpm (variable por contracción)
- Ancho total ~15–22 seg a cada lado del nadir
- Smoothstep para suavizar el nadir
- Variabilidad suprimida durante la desaceleración

**`shallow_late`** (tardías superficiales):
- Misma morfología V que `late` pero profundidad 10–18 lpm
- Característica del feto con hipoxia crónica sin reserva

**`prolonged`**:
- Desaceleración mantenida min 13–19 (nadir en 14–18 min)
- Las contracciones siguen ocurriendo cada 3 min durante TODO el trazado (incluido durante la desaceleración)
- Requiere `duration=20` para que sea visible

**`terminal_bradycardia`**:
- Trazado normal hasta min 12, caída súbita y mantenida desde min 13
- FCF ~62 lpm sin recuperación

**`sinusoidal`**:
- Ondas regulares 3.5 ciclos/min, amplitud 12 lpm, hasta min 20
- Bradicardia terminal desde min 21

### TOCO
Gaussianas por cada tiempo de contracción en `config.contractions`. Para `decelType:'prolonged'`, genera contracciones periódicas automáticas cada 3 min independientemente de las contracciones del config.

### Eje Y sticky
Overlay fijo con `position: absolute, left: 0` que muestra etiquetas 210/180/150/120/90/60 siempre visibles durante el scroll horizontal. Las etiquetas también se repiten cada 10 min en el canvas con fondo blanco semitransparente.

---

## 6. SISTEMA DE CASOS CLÍNICOS

### 8 casos implementados

| ID | Nivel | Paciente | Patrón |
|---|---|---|---|
| c1 | Introductorio | Clara V. 39 sem | Normal, cycling:true |
| c2 | Introductorio | Sofía M. 40 sem | Variables simples + cycling |
| c3 | Intermedio | Martina L. 41 sem | Prolongada (hipoxia subaguda, taquisistolia) |
| c4 | Intermedio | Valentina C. 38 sem | Tardías (RCIU, hipoxia crónica) |
| c5 | Avanzado | Lucía G. 36 sem | Shallow late (hipoxia crónica, preeclampsia) |
| c6 | Avanzado | Elena R. 39 sem | Terminal bradycardia (rotura uterina/TOLAC) |
| c7 | Avanzado | Camila T. 40 sem | Terminal bradycardia (prolapso de cordón) |
| c8 | Avanzado | Antonia F. 38 sem | Sinusoidal (vasa previa) |

### Estructura de un caso
```typescript
{
  id, level, title, context,
  correctAnswers: {
    baseline, variability, cycling, accels,
    decels, toco, hypoxia, management
  },
  evolution: [{ time, duration, config }],
  feedback: { interpretacion, fisiopatologia, clinica, errores }
}
```

### Flujo de evaluación (3 pasos)
1. **Formulario:** 8 selectores (FCF basal, variabilidad, cycling, aceleraciones, desaceleraciones, dinámica uterina, tipo de hipoxia, conducta clínica)
2. **CaseResults:** puntaje global 0–100%, 4 dimensiones con barra propia, detalle campo a campo (✅/❌), badge de nivel (Experto/Competente/En Desarrollo/Insuficiente), mensaje orientador según nivel
3. **Análisis fisiopatológico:** interpretación, fisiopatología, conducta clínica, error frecuente

### 4 dimensiones de evaluación
| Dimensión | Campos | Color |
|---|---|---|
| Línea Basal y Dinámica | baseline + toco | blue |
| Variabilidad y Reactividad | variability + cycling + accels | emerald |
| Desaceleraciones | decels | amber |
| Hipoxia y Conducta | hypoxia + management | red |

---

## 7. MÓDULO DE COMPRENSIÓN FISIOPATOLÓGICA INTEGRAL

Componente `ComprehensionModule` — subvista dentro de la sección Teoría (pestaña "Comprensión fisiopatológica integral").

Contiene: acordeones (`Accordion`), tablas comparativas (`VersusTable`, `DataTable`, `StageTable`), timelines (`Timeline`), highlights (`Highlight`), alertas clínicas (`ClinicalAlert`), diagrama de redistribución (`RedistributionDiagram`), dashboard de cierre.

**CRÍTICO — Tailwind dinámico:** No usar clases interpoladas (`bg-${color}-500`). Usar mapas de clases explícitos: `HEAD_BG`, `TABLE_HEAD`, `TL_LINE`, `TL_DOT`.

---

## 8. CONTENIDO ACADÉMICO GENERADO (Documento .md)

Se generó un documento completo de 6 módulos y 23 temas durante la sesión. Este contenido está **pendiente de incorporación** a la plataforma (M3-M6). El documento cubre:

### Módulo 1 — Fundamentos (implementado en T1-T3)
- Historia del CTG y limitaciones del enfoque por patrones
- Hipoxemia, hipoxia, acidemia, acidosis metabólica, reserva fetal
- Quimiorreceptores vs barorreceptores, redistribución circulatoria, brain-sparing

### Módulo 2 — Parámetros del Trazado (implementado en T4-T8)
- FCF basal (rangos, taquicardia compensatoria, bradicardia)
- Variabilidad (ausente/mínima/normal/marcada, quiescencia vs hipoxia)
- Aceleraciones (espontáneas vs provocadas, reactividad, valor predictivo negativo)
- Desaceleraciones (precoces, variables simples/complicadas, tardías, prolongadas)
- Contracciones (taquisistolia, hipertonía, limitaciones del tocodinamómetro externo)

### Módulo 3 — Estados Conductuales (pendiente de implementar)
- Quiescencia fetal (Estado 1F, 20–40 min, diagnóstico diferencial con hipoxia)
- Sueño activo (Estado 2F, REM fetal, 40–60 min)
- Vigilia fetal (Estados 3F/4F, máxima reactividad)
- Cycling fetal (**concepto más importante y subestimado**): alternancia estados conductuales, signo precoz de compromiso neurológico, evaluación en ventana de 60 min mínimo

### Módulo 4 — Fisiopatología de la Hipoxia (pendiente)
- Fisiología oxigenación fetal (cadena O₂, HbF, efecto Bohr doble)
- Hipoxia intraparto general (espectro fisiológica → lenta → subaguda → aguda)
- Hipoxia aguda (bradicardia terminal, regla 3-6-9-12-15 min, protocolo evento centinela)
- Hipoxia subaguda (taquisistolia, pH cae ~0.01 cada 2-3 min, tocólisis aguda)
- Hipoxia lentamente evolutiva (horas, tardías progresivas, pérdida cycling antes que variabilidad)
- Hipoxia crónica (RCIU, preeclampsia, shallow late, sin reserva al inicio del parto)

### Módulo 5 — Interpretación Clínica (pendiente)
**Algoritmo de 8 pasos:**
1. ¿Existe hipoxia crónica previa?
2. Evaluar línea basal
3. Evaluar variabilidad
4. Evaluar cycling
5. Evaluar desaceleraciones (mecanismo, no morfología)
6. Identificar tipo de hipoxia
7. Determinar reserva fetal actual
8. Definir conducta

### Módulo 6 — Actuación Clínica (pendiente)
- Escalones de reanimación intrauterina
- **IMPORTANTE:** Oxigenoterapia materna NO recomendada como medida de reanimación intrauterina (Chandraharan 2018/2024, ACOG). Solo indicada por bienestar materno. Esto debe corregirse en el contenido que mencione O₂ materno.
- Escalamiento clínico y comunicación SBAR
- 13 errores frecuentes con corrección fisiopatológica (lista sistematizada)

---

## 9. BIBLIOGRAFÍA Y FUENTES

El contenido de la plataforma debe basarse **exclusivamente** en estas fuentes:

1. **Ugwumadu, A. (2013).** "Understanding cardiotocographic patterns associated with intrapartum fetal hypoxia and neurological injury." *Best Practice & Research Clinical Obstetrics & Gynaecology*, 27(4), 509–521.

2. **Chandraharan, E. et al. (2018, rev. 2024).** *International Expert Consensus on the use of cardiotocography (CTG) — Physiological CTG Interpretation Guide.* Guía de interpretación fisiológica moderna del CTG.

3. **NICE Intrapartum Care Guidelines** (National Institute for Health and Care Excellence, Reino Unido). Versión vigente.

**Principios que deben guiar todo el contenido:**
- Nomenclatura fisiopatológica (NO clasificación NICHD/FIGO como criterio principal)
- "Barorreceptoras" y "quimiorreceptoras" en paralelo con "variables" y "tardías"
- Cycling como parámetro independiente de variabilidad (no son lo mismo)
- "Hipoxia progresiva" en lugar de términos anteriores
- Reserva fetal como concepto central (no clasificación categórica)

---

## 10. PENDIENTES Y PRÓXIMOS PASOS

### Pendientes técnicos
- [ ] **Migración a Vite/Claude Code** — en proceso. Emma tiene Windows, PowerShell requirió `Set-ExecutionPolicy RemoteSigned` para ejecutar npm. Carpeta `Desktop\FetalPhysio` creada. Pasos: `npm install`, `npm install lucide-react`, copiar v15.tsx a `src/App.tsx`.
- [ ] **Despliegue estable en Netlify** — actualmente via Netlify Drop (manual). Próximo paso: conectar con GitHub para CI/CD automático.
- [ ] **Mejora de morfología de tardías** — Emma mostró imágenes de referencia y la morfología actual (V estrecha) no corresponde completamente. Pendiente de nueva iteración.

### Pendientes de contenido
- [ ] **M3-M6 sin implementar** — el contenido académico está escrito (ver sección 8) pero no hay componentes React para esos módulos todavía.
- [ ] **Documento .md de respaldo académico** — el contenido completo de los 6 módulos debe exportarse como archivo `.md` para revisión editorial y validación por expertos.
- [ ] **Corrección de oxigenoterapia materna** — eliminar O₂ materno como medida de reanimación intrauterina en M6 Tema 20 y 21.

### Pendientes pedagógicos
- [ ] **Enlace casos clínicos → teoría** — al obtener resultado bajo en un caso, ofrecer botón "Revisar contenido relacionado" que lleva al tema del módulo correspondiente. (No al revés — Emma decidió esto explícitamente.)
- [ ] **Validación de contenido** — Emma tiene contactos expertos de otra universidad para validar los casos y el contenido teórico. Pendiente diseñar instrumento de validación por juicio de expertos.
- [ ] **Casos clínicos adicionales** — flujo establecido: generar trazados en CTGi iOS app → datasheet estructurado → validación experta → publicar. Meta: 15-20 casos cubriendo todo el espectro.

### Pendientes de funcionalidad
- [ ] **Tracking de progreso** (localStorage) — explícitamente diferido a post-v1
- [ ] **Backend/autenticación** — para rastrear estudiantes por curso. Requiere Supabase u otro servicio.
- [ ] **Animación en tiempo real del monitor CTG** — trazado que corre frame a frame en los casos clínicos.
- [ ] **Versión móvil nativa** — la plataforma es responsive pero no hay app iOS/Android.

---

## 11. DECISIONES DE DISEÑO IMPORTANTES

### Lo que NO se debe cambiar
- **Hero section:** estructura, textos, logo, CTA y jerarquía visual están cerrados. No modificar.
- **Filosofía pedagógica:** nunca enseñar por patrones, siempre por mecanismos.
- **Nomenclatura:** siempre usar términos fisiopatológicos primero (barorreceptoras, quimiorreceptoras) con la nomenclatura morfológica en paralelo como referencia.
- **Idioma UI:** español en todo. Inglés solo permitido en elementos de branding (subtítulo "Advanced CTG Physiology Training", "Beyond the Tracing").

### Restricciones técnicas críticas
- **Tailwind dinámico NO funciona** — `bg-${color}-500` no genera clases. Siempre usar mapas de clases explícitos.
- **Babel CDN en el navegador → pantalla blanca** — NUNCA usar `<script type="text/babel">`. Siempre pre-compilar con esbuild.
- **TOPIC_CONTENT debe definirse DESPUÉS de todos los componentes T1-T8** — si se define antes, React lanza error #130 (componente undefined). Este bug ocurrió múltiples veces.
- **React error #130** significa que un componente está siendo renderizado como `undefined` — revisar orden de definición.

### Sobre la oxigenoterapia materna
**NO incluirla como medida de reanimación intrauterina.** Según Chandraharan 2018 (revisado 2024) y ACOG, el O₂ materno suplementario en pacientes con saturación normal no está recomendado como RIU. Solo se indica cuando la madre lo necesita por su propia condición (asma, sepsis, trastornos cardiopulmonares).

---

## 12. ESTRUCTURA DE ARCHIVOS (versión actual)

```
fetalphysio_v15.tsx          ← archivo principal (ÚNICO)
├── THEORY_TOPICS[]           ← datos teóricos legacy (texto plano)
├── CLINICAL_CASES[]          ← 8 casos con correctAnswers y feedback
├── DIMENSIONS[]              ← 4 dimensiones de evaluación
├── EVALUATION_FIELDS[]       ← 8 campos del formulario de evaluación
├── CTGCanvas                 ← motor de trazado (canvas)
├── BeyondTheTracing          ← sección hero animada con SVG CTG
├── CaseResults               ← panel de resultado y puntuación
├── CaseSimulator             ← vista de caso clínico activo
├── ComprehensionModule       ← módulo fisiopatológico integral (acordeones)
├── MiniCTG                   ← wrapper compacto de CTGCanvas para teoría
├── TheoryErrorBoundary       ← error boundary para módulo teórico
├── THEORY_MODULES[]          ← estructura de 6 módulos y 23 temas
├── T1Content ... T8Content   ← componentes de contenido M1-M2
├── TOPIC_CONTENT{}           ← mapa tema→componente (definido DESPUÉS de T1-T8)
├── TheoryDocsView            ← layout docs (sidebar + contenido)
├── TheoryView                ← coordinador de vistas de teoría
├── TrainingView              ← lista de casos
├── HomeView                  ← página de inicio
├── AboutView                 ← quiénes somos
└── App                       ← componente raíz, navegación principal
```

---

## 13. VERSIONES GUARDADAS

| Versión | Descripción |
|---|---|
| fetalphysio_v1.tsx | Primer rebranding FetalPhysio completo |
| fetalphysio_v2.tsx | Eje Y sticky en CTGCanvas |
| fetalphysio_v3.tsx | Sistema de scoring CaseResults |
| fetalphysio_v4.tsx | Teoría mejorada (versión con error) |
| fetalphysio_v5.tsx | Beyond the Tracing section |
| fetalphysio_v6.tsx | Motor CTG real en Beyond the Tracing |
| fetalphysio_v7.tsx | Mapa de módulos (landing teoría) |
| fetalphysio_v8.tsx | Layout docs TheoryDocsView |
| fetalphysio_v9.tsx | Módulo 2 con MiniCTG (bug TOPIC_CONTENT) |
| fetalphysio_v10.tsx | Bug TOPIC_CONTENT corregido |
| fetalphysio_v11.tsx | Mejoras morfología desaceleraciones |
| fetalphysio_v12.tsx | Variables con nadir plano y hombros variables |
| fetalphysio_v13.tsx | Tardías asimétricas |
| fetalphysio_v14.tsx | Tardías en V con lag |
| **fetalphysio_v15.tsx** | **VERSIÓN ACTUAL** — bugs navegación corregidos |

---

## 14. CONTACTO Y CONTEXTO INSTITUCIONAL

- **Autora:** Emmanuel Andrades Rodríguez (Emma)
- **Rol:** Matrón, Magíster Gestión Sistemas de Salud, Profesor Instructor
- **Institución:** Universidad de Talca, Escuela de Obstetricia y Puericultura
- **Contexto institucional:** Emma busca apoyo de la Dirección de Innovación de la Universidad de Talca para validación, financiamiento y escalamiento. El proyecto tiene potencial de publicación en revistas de educación médica.
- **Validación:** Emma tiene contactos expertos de otra universidad para validar el contenido clínico. El proceso de validación será por juicio de expertos con instrumento estructurado (Google Forms con escala Likert).
