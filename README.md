# 📊 Simulador de Microeconomía - Master Suite

¡Hola! 👋 Primero que nada, una aclaración importante: **no soy profesor de economía**. Soy simplemente un estudiante como vos, que armó esta herramienta con el objetivo de ayudarnos mutuamente a entender mejor los conceptos de la materia. 

A veces la teoría en los libros es medio abstracta, así que cree este simulador interactivo para que podamos visualizar qué pasa realmente cuando movemos las variables económicas.

## 🚀 ¿Qué es esto?

Es una aplicación interactiva (Single Page Application) donde podés jugar y experimentar con los modelos fundamentales de la microeconomía. 

El simulador está dividido en 4 unidades principales:

1. **Mercado e Incidencia Fiscal**: 
   - Modificá la oferta y la demanda para encontrar el precio de equilibrio.
   - Aplicá impuestos o subsidios y observá **quién paga realmente** el impuesto (Incidencia Fiscal) dependiendo de las elasticidades.
   - Visualizá la Pérdida Irrecuperable de Eficiencia (PIE).

2. **Frontera de Posibilidades de Producción (FPP)**:
   - Evaluá el costo de oportunidad.
   - Diferenciá entre estados de producción ineficientes, eficientes e inalcanzables.
   - Simulá crecimiento económico alterando la capacidad tecnológica.

3. **Teoría de la Empresa (Costos)**:
   - "La Regla de Oro": P = CMg.
   - Encontrá visualmente el Punto de Cierre (Mínimo CVM) y el Punto de Nivelación (Mínimo CTM).
   - Simulá escenarios de crisis bajando el precio de mercado para ver si la empresa tiene ganancias, pérdidas o debe cerrar.

4. **Monopolios**:
   - Comprendé la maximización de beneficios de un monopolio tradicional donde IMg = CMg.
   - Analizá el dilema de la regulación en un **Monopolio Natural** (regulador estatal vs. monopolista privado).

## 💻 ¿Cómo utilizarlo en tu computadora?

Si querés descargar el código fuente y correrlo localmente en tu compu, seguí estos pasos:

### Prerrequisitos
Asegurate de tener instalado [Node.js](https://nodejs.org/es/).

### Pasos de Instalación
1. Cloná este repositorio:
   ```bash
   git clone https://github.com/Pinini777/Simulador-Microeconomia.git
   ```
2. Entrá a la carpeta del proyecto:
   ```bash
   cd Simulador-Microeconomia
   ```
3. Instalá las dependencias necesarias:
   ```bash
   npm install
   ```
4. Levantá el servidor local:
   ```bash
   npm run dev
   ```
¡Listo! Vas a poder acceder desde tu navegador en `http://localhost:5173`.

## 🛠️ Arquitectura Técnica

Si sos del palo de sistemas y te interesa el código, este proyecto está construido con:
- **Vite + React**: Para un entorno rápido y modular.
- **Clean Architecture**: La lógica matemática y económica se encuentra totalmente abstraída y aislada en la carpeta `src/domain/`, completamente agnóstica a React.
- **TailwindCSS**: Para el diseño Neo-Brutalista.

---
¡Espero que te sirva para estudiar y aprobar la materia! Si encontrás algún error matemático o conceptual, sentite libre de levantar un *Issue* o hacer un *Pull Request*. ¡Éxitos! 🎓
