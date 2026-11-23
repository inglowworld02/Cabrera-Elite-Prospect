# SKILLS-INSTALL.md — Skills y herramientas para agentes de código (Codex / Claude Code)

Archivo aparte del `AGENTS.md`. Aquí van **qué instalar, cómo y cuándo usarlo**.
Estado de verificación: los repos y comandos marcados ✅ fueron revisados clonando el repo y leyendo su README (noviembre 2026). Lo marcado ⚠️ no se pudo verificar.

> Un agente en la nube no puede instalar skills en tu computadora. Ejecuta estos comandos tú, en la terminal de tu máquina (requiere Node.js), o pásaselos a Codex para que los corra en tu entorno.

---

## 0. Instrucciones para Codex (ejecutar en este orden)

1. Instala las skills de la sección 1 (CLI `npx skills add ...`) o copia la carpeta `.agents/skills/` del kit a `~/.agents/skills` (Codex) y `~/.claude/skills` (Claude Code).
2. Verifica: cada carpeta debe tener `SKILL.md`; reinicia el agente y lista las skills.
3. No ejecutes nada de la sección 4. No pegues claves de API en archivos `.html` de terceros.
4. No modifiques `AGENTS.md`; este archivo es independiente.
5. Aplica a un proyecto web estático solo lo que aporte: para Cabrera Elite basta `motion-design` y `design-dna`; GSAP y three.js solo si se añade una experiencia 3D/scroll compleja (hoy `fx.js` ya cubre las animaciones).

**Estado de instalación (2026-11-23, en el entorno de Claude Code en la nube):** copiadas 24 skills a `~/.claude/skills` y `~/.agents/skills` (content-critic, design-dna, motion-design, 8 gsap-*, 12 threejs-*). Verificadas como cargadas. La instalación en tu computadora la hace Codex con estos pasos.

## 1. Instalar (los que sirven)

### Opción rápida: CLI `skills` (funciona con Codex, Claude Code, Cursor y más)
```bash
# Animación en scroll, timelines, React
npx skills add https://github.com/greensock/gsap-skills

# 3D (three.js r186, React Three Fiber)
npx skills add cloudai-x/threejs-skills

# Lottie / SVG / keyframes
npx skills add LottieFiles/motion-design-skill

# Extraer "ADN" de diseño desde referencias (tokens, estilo, efectos)
npx skills add zanwei/design-dna

# Dirección creativa y animación de interfaces (usa la URL, no el repo)
npx skills add https://genjutsu.athevon.dev -g
```
Para instalar solo en un agente: añade `-a codex` o `-a claude-code`, y `-g` para instalación global (ver `npx skills add --help`). Revisa en pantalla qué agentes detecta antes de aceptar.

> **Genjutsu:** su README advierte que `npx skills add AThevon/genjutsu` instala las skills sin sus módulos. Usa la URL de arriba.

### Contenido para redes: Content Critic ✅
Skill de solo texto (un `SKILL.md`, sin scripts ni permisos de herramientas, MIT) que evalúa guiones, hooks, posts y Reels antes de publicar. Repo nuevo (3 commits, 0 estrellas): lee el `SKILL.md` antes de instalar, como con cualquier skill.
```bash
git clone https://github.com/Anghelo12344567/Content-Critic.git
mkdir -p ~/.agents/skills ~/.claude/skills
cp -r Content-Critic/content-critic ~/.agents/skills/   # Codex
cp -r Content-Critic/content-critic ~/.claude/skills/   # Claude Code
```
Nota: el README muestra `<tu-usuario>/content-critic` como placeholder; la URL real es la de arriba. En Claude web/escritorio se sube `content-critic.skill` en Configuración → Capacidades → Skills.

### Opción manual (sin CLI)
Carpetas donde cada agente carga skills:

| Agente | Global | Por proyecto |
|---|---|---|
| Codex CLI | `~/.agents/skills/` | `.agents/skills/` |
| Claude Code | `~/.claude/skills/` | `.claude/skills/` |

```bash
git clone https://github.com/CloudAI-X/threejs-skills.git
mkdir -p ~/.agents/skills ~/.claude/skills
cp -r threejs-skills/skills/* ~/.agents/skills/
cp -r threejs-skills/skills/* ~/.claude/skills/
```
Mismo patrón para `greensock/gsap-skills` y `lottiefiles/motion-design-skill` (la carpeta `skills/` de cada repo).

### Claude Code (plugins)
```
/plugin marketplace add greensock/gsap-skills
/plugin marketplace add AThevon/genjutsu
/plugin install genjutsu
```

Después de instalar, **reinicia el agente** y pide una tarea concreta (ej. "anima las tarjetas de precios al hacer hover") o escribe `/genjutsu`.

---

## 2. Qué trae cada skill y cuándo usarla

| Skill | Contenido verificado | Usar cuando |
|---|---|---|
| **gsap-skills** (8 skills: core, timeline, scrolltrigger, react, plugins, utils, performance, frameworks) | GSAP oficial. Todos los plugins (SplitText, MorphSVG…) son gratis, incluso uso comercial | Scroll animations, reveals de texto, timelines, React |
| **threejs-skills** (fundamentals, lighting, materials, shaders, loaders, postprocessing, performance, R3F…) | Apunta a three.js r186 y evita APIs obsoletas | Un hero 3D o partículas puntuales. Siempre con carga diferida y alternativa estática en móvil |
| **motion-design-skill** | Lottie, SVG animation, keyframes. Para exportar MP4/GIF/dotLottie necesita Creator MCP de LottieFiles | Microinteracciones, iconos animados, estados de botones |
| **design-dna** | Extrae tokens, estilo y efectos de capturas/URLs a un JSON y genera diseño desde él | Analizar **referencias como inspiración**. No copiar la identidad ni los textos de otra marca |
| **genjutsu** (`cast`, `paint`, `bunshin`) | `cast` anima una interfaz; `paint` diseña el look completo y crea un `MASTER.md`; `bunshin` construye un sitio entero con un equipo de agentes (declara su costo antes de empezar) | `cast` para mejoras puntuales; `paint`/`bunshin` solo en proyectos nuevos o rediseños aprobados |
| **content-critic** | Pide plataforma, nicho, objetivo y tamaño de cuenta; evalúa hook, retención, valor, emoción, encaje y CTA (Alto/Medio/Bajo); da hasta 3 reescrituras. No predice viralidad ni da notas 0-100; marca [Seguro]/[Probable]/[Suposición] y responde en español | Revisar Reels, posts y guiones antes de publicar en Instagram, TikTok, LinkedIn o X |

Regla de uso: instala solo las que vayas a usar. Cada skill añade contexto al agente; no hace falta tener las cinco en todos los proyectos.

---

## 3. Herramientas opcionales (repos verificados que existen; instalación según su README)
- `every-app/open-seo` — auditoría SEO, posiciones y backlinks (alternativa abierta a Semrush/Ahrefs; los datos de SEO se pagan por uso vía API de DataForSEO). Incluye plugin para Claude Code/Codex.
- `hugohe3/ppt-master` — genera PowerPoint editable desde un tema o documento.
- Alternativas open source a apps de pago (de los carruseles, sin verificar uno a uno ⚠️): AppFlowy (notas), cal.diy (agenda), OpenProject (tareas), OpenWhispr (dictado), Cap (grabación de pantalla), Chatwoot (bandeja de mensajes), OpenSEO. **Revisa la licencia antes de usar en un negocio:** AppFlowy, Cap y VoiceStudio son AGPL-3.0; OpenProject es GPL-3.0; cal.diy está pensado para uso personal.

## 4. No instalar / usar con mucho cuidado
- **Claude-BugHunter** (`elementalsouls/Claude-BugHunter`): existe, pero es un paquete de seguridad ofensiva (bug bounty / red team). No aporta a un proyecto web normal. Úsalo solo contra sistemas **propios o con autorización escrita** y dentro del alcance de un programa de bug bounty. Revisa `install.sh` antes de ejecutarlo.
- **Free LLM API** (video "Claude Code gratis"): instala con `curl … | bash`. No ejecutes scripts remotos sin leerlos antes. Además usa modelos gratuitos de otros proveedores, **no el modelo Claude**, con límites y términos propios de cada proveedor. Si lo pruebas, hazlo en un entorno aislado y sin claves de producción.
- **ai-website-cloner-template** y **Scrapling**: no clonar sitios de terceros; scraping solo de datos públicos respetando términos y robots.txt.
- **Instagram Agent Skill** (video): ⚠️ no pude confirmar el repositorio exacto. Verifica el autor y el código antes de instalar. Mantén la regla "nada se publica sin tu aprobación" y no automatices mensajes masivos a terceros (cumple las normas de Instagram y las leyes antispam).
- **VoiceStudio** (clonación de voz): clona solo tu propia voz o con consentimiento por escrito.

---

## 5. Ideas rescatadas de los videos y carruseles

**Motion graphics con Claude (flujo):** subir 1–2 videos de referencia (ej. de Pinterest) + un prompt con **historia, duración y resolución** (ej. 15 s, formato vertical) y pedir al final que genere una timeline editable. Un "skill file" de motion graphics se sube al proyecto de Claude como contexto.

**10 estilos de animación para prompts:** Glow Sketch, Comic Art, Lego Style, Pixel Art, Chalkboard Style, PS2 Style, Flat Vector, Minimal Line, CGI Motion, Explainer 3D. (Usa estilos genéricos; no pidas personajes ni marcas registradas.)

**Pack de 15 microinteracciones UI** (solo se vieron los nombres, los prompts no están publicados ⚠️): Word swap, Live order feed, Ghost cursor, Number roll, Logo marquee, Path draw, AI chat reply, Review deck, Glow-up slider, Spotlight cards, Bento snap, Price flip, Win table, Blur-in hero, Confetti click. Sirven como catálogo de patrones para pedirle a GSAP/Genjutsu.

**Stack para lanzar apps con IA (del primer video):** GitHub (control de versiones) → Claude (desarrollo) → Stripe (cobros) → PostHog (analítica) → Vercel (publicación). Reglas de seguridad de Stripe y de producción: ver `AGENTS.md`.

---

## 6. Verificación tras instalar
1. Reinicia el agente y pregunta: "¿qué skills tienes disponibles?".
2. Prueba una tarea pequeña con cada una (ej. un reveal con GSAP en una sección).
3. Revisa que no se agregaron archivos ni dependencias inesperadas (`git status`, `git diff`).
4. Mide rendimiento (Lighthouse) y respeta `prefers-reduced-motion` antes de publicar.

## 7. Revisado el 2026-11-23 (carrusel «stack» y alternativas open source)

Los repos existen (comprobado con `git ls-remote`); licencia y estrellas son lo que dicen los carruseles y no se pudieron confirmar desde aquí.

| Herramienta | Qué es | Veredicto para Cabrera |
|---|---|---|
| Resend | Correo transaccional por API | Útil si se reemplaza el envío por Gmail/Apps Script; requiere clave (solo en variables de entorno) |
| Stripe | Ya en uso | — |
| Excalidraw | Pizarra para diagramas | Útil para esquemas de arquitectura |
| Remotion | Videos con código (React) | Opcional, para reels del teaser |
| GitHub | Control de versiones | Ya en uso |
| Chatwoot (`chatwoot/chatwoot`) | Bandeja unificada de chat/mail/WhatsApp, autoalojada | Posible reemplazo futuro del chat; exige servidor propio y datos de menores: decidir con el dueño |
| cal.diy (`calcom/cal.diy`) | Agenda de reuniones autoalojada (uso personal) | Alternativa a Cal.com/Calendly para `bookingUrl` |
| OpenProject, AppFlowy | Gestión de tareas / notas | Fuera de alcance del sitio |
| OpenWhispr, Cap | Dictado local, grabación de pantalla | Herramientas personales, no del repo |
| OpenSEO (`every-app/open-seo`) | SEO con API de DataForSEO (de pago por uso) | Útil para seguimiento de posiciones locales; costo por uso |
| Apify, Ritmora, Telegram, Mercado Pago | Scraping, contenido, avisos, pagos en Argentina | No aplican (Mercado Pago no es para EE. UU.); scraping: cuidado con términos de uso |

**Videos:**
- *GODMODE* (`elder-plinius/GODMODE3`): un `index.html` que reúne 50+ modelos. NO instalar: pide claves de API en una página de un tercero y el autor es conocido por jailbreaks.
- *Higgsfield × Claude*: conector MCP de video con prueba gratis, promocional (pide comentar para recibir el enlace). Opcional; se agrega desde Configuración → Conectores; no hace falta para el sitio.
- *«Motion Graphics Skill File»* (getuninside.com): archivo promocional detrás de «comenta SKILL»; no verificable. Ya existe `motion-design` verificada.
