import type { GlossaryItem, LearningModule, QuizQuestion } from '../types/curriculum';

export const MODULES: LearningModule[] = [
  {
    id: 'smc',
    number: '01',
    shortTitle: 'Estructura SMC',
    title: 'Estructura de Mercado',
    question: '¿Hacia dónde se mueve realmente el precio, cuándo gira con dinero institucional y si está caro o barato?',
    intro:
      'El mercado nunca avanza en línea recta: se mueve en ondas que dejan pivotes confirmados. Leer dos capas simultáneas (Swing e Interna) y medir el desplazamiento con ATR y volumen separa los giros reales del ruido.',
    concepts: [
      {
        id: 'smc-pivots',
        tag: 'Anti-Repintado',
        title: 'Pivotes Causales y Fractalidad (Swing vs. Interna)',
        summary:
          'Los pivotes definen máximos (HH/LH) y mínimos (HL/LL). El motor rastrea simultáneamente la Estructura Swing (marea, 25 velas) y la Estructura Interna (olas, 5 velas).',
        whyItHappens:
          'Dentro de un impulso macro alcista existen retrocesos que forman micro-tendencias bajistas. Un giro interno (iMSS) anticipa cuándo termina ese retroceso antes de que rompa el Swing principal.',
        formula: 'ta.pivothigh(high, N, N) → confirmado N velas después (0 lookahead)',
        bullets: [
          'Swing (default 25 velas): define la dirección dominante y los bordes de Premium/Discount.',
          'Interna (default 5 velas): capta el flujo de órdenes temprano sin contaminar el sesgo macro.',
          'Evaluación estricta en barstate.isconfirmed: ningún pivote ni ruptura se borra en tiempo real.',
        ],
        mistake: 'Operar cada iCHoCH interno como si fuera un cambio de tendencia macro cuando solo es un retroceso a Discount.',
      },
      {
        id: 'smc-breaks',
        tag: 'BOS · CHoCH · MSS',
        title: 'Rupturas Estructurales y Desplazamiento',
        summary:
          'No todas las rupturas valen lo mismo: BOS continúa la tendencia, CHoCH advierte un posible giro y MSS lo confirma con expansión real de cuerpo y volumen.',
        whyItHappens:
          'Las rupturas con velas pequeñas suelen ser barridos o trampas. Cuando entra capital institucional verdadero, el cuerpo supera la volatilidad normal y el volumen excede su promedio.',
        formula: 'MSS = CHoCH  ∧  |close - open| > 1.5 × ATR(14)  ∧  volume > 1.2 × SMA(vol, 20)',
        bullets: [
          'Confirmación por Cierre (Close, default): exige cuerpo más allá del nivel para filtrar mechas falsas.',
          'BOS (Break of Structure): ruptura a favor de la tendencia vigente.',
          'CHoCH (Change of Character): primera ruptura en contra de la tendencia.',
          'MSS (Market Structure Shift): CHoCH acompañado de Desplazamiento (+25 pts en confluencia).',
        ],
        mistake: 'Confiar en un CHoCH débil sin desplazamiento ni volumen: suele fallar y continuar la tendencia previa.',
      },
      {
        id: 'smc-pd',
        tag: 'Valor Relativo',
        title: 'Zonas Premium, Equilibrium (50%) y Discount',
        summary:
          'Divide el rango entre el último Swing Low (0%) y Swing High (100%) en dos mitades objetivas para comprar barato y vender caro.',
        whyItHappens:
          'Las instituciones rara vez persiguen el precio en máximos extendidos: permiten retrocesos hacia Discount para acumular con mejor relación Riesgo/Beneficio.',
        formula: 'Equilibrium = (Swing High + Swing Low) / 2  |  Discount < 50%  |  Premium > 50%',
        bullets: [
          'Premium (50% – 100%): zona cara, óptima para buscar distribuciones y ventas (+20 pts Short).',
          'Equilibrium (50%): nivel de equilibrio del rango estructural actual.',
          'Discount (0% – 50%): zona barata, óptima para acumulaciones y compras (+20 pts Long).',
        ],
        mistake: 'Comprar en el 90% del rango (Premium) justo debajo de un Swing High con stop enorme y poco recorrido.',
      },
    ],
  },
  {
    id: 'liquidity',
    number: '02',
    shortTitle: 'Liquidez & POIs',
    title: 'Liquidez y Puntos de Interés',
    question: '¿Dónde están atrapados los Stop-Loss que financian el movimiento y en qué cajas exactas reacciona el precio?',
    intro:
      'Una institución no puede llenar cientos de millones sin contrapartida. Por eso el precio caza piscinas de liquidez (EQH/EQL y Swings) antes de desplazarse dejando Order Blocks y Fair Value Gaps (imbalances).',
    concepts: [
      {
        id: 'liq-pools',
        tag: 'BSL · SSL · $$$',
        title: 'Pools de Liquidez: Equal Highs / Equal Lows',
        summary:
          'Dobles techos o pisos muy limpios concentran miles de Stop-Loss y órdenes breakout justo por detrás, actuando como imanes institucionales.',
        whyItHappens:
          'Buy-Side Liquidity (BSL) descansa sobre máximos; Sell-Side Liquidity (SSL) bajo mínimos. Son el combustible necesario para absorber posiciones masivas sin deslizamiento.',
        formula: '|Precio₁ − Precio₂| ≤ 0.15 × ATR(14)  →  $$$ EQH / $$$ EQL',
        bullets: [
          'EQH (Equal Highs): máximos casi idénticos marcados con línea punteada $$$ EQH.',
          'EQL (Equal Lows): mínimos casi idénticos marcados con línea punteada $$$ EQL.',
          'Se detectan tanto en estructura Swing como Interna evitando duplicados cercanos.',
        ],
        mistake: 'Tratar un doble piso perfecto como un muro infranqueable en lugar de anticipar su barrido.',
      },
      {
        id: 'liq-sweeps',
        tag: 'Manipulación ×',
        title: 'Liquidity Sweeps (Barrido de Stops)',
        summary:
          'La mecha perfora un Swing previo o un EQH/EQL activando los stops acumulados, pero la vela cierra inmediatamente de vuelta dentro del rango.',
        whyItHappens:
          'En un SSL Sweep los minoristas venden en pánico al ver "roto" el soporte; el dinero institucional absorbe exactamente esa avalancha para llenar sus compras.',
        formula: 'SSL Sweep: low < nivel ∧ close > nivel  |  BSL Sweep: high > nivel ∧ close < nivel',
        bullets: [
          'En el gráfico minimalista se marca con una cruz limpia (×) junto a la mecha.',
          'Aporta +25 pts inmediatos en el pilar de Manipulación del Motor de Confluencia.',
          'Confluencia directa con Spring / UTAD del módulo Wyckoff.',
        ],
        mistake: 'Entrar a favor de la ruptura antes de que cierre la vela y quedar atrapado en el extremo de la mecha.',
      },
      {
        id: 'liq-ob',
        tag: 'OB+ · OB- · BB',
        title: 'Order Blocks y Breaker Blocks',
        summary:
          'El Order Block es la última vela contraria al impulso que precede a un movimiento con Desplazamiento y ruptura estructural. Si falla con cierre, muta a Breaker Block.',
        whyItHappens:
          'Parte de las órdenes institucionales de origen quedan sin ejecutarse o en cobertura; cuando el precio regresa a mitigar la zona, reaccionan con fuerza. Si el OB se rompe con cierre, los compradores atrapados convierten ese soporte en resistencia (Breaker).',
        formula: 'Mitigación configurable: Proximal | 50% Mean Threshold | Distal Invalidation',
        bullets: [
          'OB+ (alcista): última vela bajista antes de un impulso alcista con desplazamiento + BOS/MSS.',
          'OB- (bajista): última vela alcista antes de un impulso bajista con desplazamiento + BOS/MSS.',
          'Breaker Block (BB+/BB-): OB invalidado por cierre distal que invierte su polaridad con borde punteado.',
        ],
        mistake: 'Etiquetar cualquier vela contraria como OB aunque no haya producido desplazamiento ni ruptura.',
      },
      {
        id: 'liq-fvg',
        tag: 'Imbalances',
        title: 'Fair Value Gaps (Cajas Grises)',
        summary:
          'Hueco de ineficiencia de 3 velas creado por un impulso tan rápido que solo un bando participó, dejando un vacío que el precio tiende a rebalancear.',
        whyItHappens:
          'El mercado busca eficiencia de precios: regresar a rellenar el 50% o 100% del FVG permite a algoritmos equilibrar liquidez antes de reanudar la tendencia.',
        formula: 'FVG+: low > high[2]  |  FVG-: high < low[2]  |  Filtro: tamaño > 0.25 × ATR(14)',
        bullets: [
          'Filtro ATR (> 0.25×) elimina micro-gaps sin relevancia institucional.',
          'En modo 100% Fill la caja gris se recorta progresivamente a medida que el precio rellena el gap.',
          'Aporta +15 pts cuando está sin mitigar en el origen del impulso o cerca del precio.',
        ],
        mistake: 'Dejar FVGs ya mitigados dibujados en pantalla ensuciando la lectura de las zonas frescas.',
      },
    ],
  },
  {
    id: 'wyckoff',
    number: '03',
    shortTitle: 'Wyckoff & VSA',
    title: 'Motor Wyckoff y VSA',
    question: '¿Quién controla realmente el volumen detrás de las velas: acumulación profesional o distribución?',
    intro:
      'Richard Wyckoff demostró que los grandes operadores acumulan y distribuyen dentro de Trading Ranges ordenados en 5 fases (A–E). Al combinarlo con Volume Spread Analysis (VSA), eliminamos la subjetividad con métricas exactas.',
    concepts: [
      {
        id: 'wyck-vsa',
        tag: 'Esfuerzo vs. Resultado',
        title: 'VSA: RVOL, Spread Relativo y Absorción',
        summary:
          'Mide si el esfuerzo (volumen relativo) produce un resultado proporcional (avance del precio) o si está siendo absorbido por manos fuertes.',
        whyItHappens:
          'Cuando el volumen casi duplica el promedio pero la vela termina con cuerpo pequeño o mecha de rechazo > 50%, alguien con enorme capital frenó la presión contraria.',
        formula: 'RVOL = vol / SMA(vol, 20) > 1.8  ∧  (cuerpo < 0.35×rango  ∨  mecha > 0.50×rango)',
        bullets: [
          'Spread Relativo = (high - low) / ATR(14) normaliza el tamaño de vela en cualquier activo.',
          'Absorción Alcista/Bajista: se dibuja con un punto discreto sin consumir cuota de labels.',
          'Aporta +15 pts en el pilar de Confirmación de Volumen del motor.',
        ],
        mistake: 'Evaluar Wyckoff/VSA en símbolos sin datos de volumen (CFDs con volume = 0).',
      },
      {
        id: 'wyck-phase-ab',
        tag: 'Fases A & B',
        title: 'Parada de Tendencia (SC/BC + AR) y Construcción de Causa (ST)',
        summary:
          'Fase A detiene la tendencia previa con un clímax de volumen y rebote automático que delimitan el Trading Range. Fase B construye la causa testeando con bajo volumen.',
        whyItHappens:
          'En el Selling Climax (SC) el público vende en pánico y las instituciones absorben; el Automatic Rally (AR) fija el techo y el Secondary Test (ST) con RVOL < 0.9 confirma que la oferta se agotó.',
        formula: 'SC/BC: RVOL > 2.2 ∧ Spread > 1.8×ATR  |  ST: test extremo TR con RVOL < 0.9',
        bullets: [
          'SC / BC acepta cierre en el tercio de rechazo o confirmación inmediata en la vela siguiente.',
          'El primer pivote relevante tras el clímax confirma AR y dibuja la caja ACUMULACIÓN / DISTRIBUCIÓN.',
          'Separadores verticales punteados marcan automáticamente el paso de Fase A → Fase B.',
        ],
        mistake: 'Comprar a ciegas en el primer SC antes de ver el AR, el ST de bajo volumen o el Spring.',
      },
      {
        id: 'wyck-phase-c',
        tag: 'Fase C · Trampa',
        title: 'Spring (Acumulación) y UTAD (Distribución)',
        summary:
          'La maniobra final de engaño: el precio perfora el borde del rango para barrer stops y vuelve a cerrar dentro del Trading Range en la misma vela o en 1–2 velas.',
        whyItHappens:
          'Antes de iniciar la tendencia real, el Composite Man saca del juego a los participantes impacientes y llena el resto de su inventario a precios de liquidación.',
        formula: 'Spring: low < TR.bottom ∧ close > TR.bottom (0–2 velas)  |  UTAD: inverso en TR.top',
        bullets: [
          'Soporta recuperación en la misma vela o ventana de recuperación de 1–2 velas.',
          'Si tras 2 velas no recupera el interior del TR, el rango se invalida limpiamente.',
          'Confluencia directa con Liquidity Sweep (+25 pts + alerta dedicada Spring/UTAD).',
        ],
        mistake: 'Confundir un quiebre limpio sin recuperación con un Spring y promediar en contra.',
      },
      {
        id: 'wyck-phase-de',
        tag: 'Fases D & E',
        title: 'Ruptura con Fuerza (SOS/SOW) y Retest de Bajo Volumen (LPS/LPSY)',
        summary:
          'Fase D rompe el rango con expansión y volumen (SOS/SOW); Fase E ofrece un retroceso ordenado con sequía de volumen (LPS/LPSY) hacia el borde del TR o un OB/FVG.',
        whyItHappens:
          'El SOS demuestra dominio absoluto de la demanda. Cuando el precio vuelve a testear el techo roto con RVOL < 0.8, confirma que ya no hay vendedores dispuestos a frenar el Markup.',
        formula: 'SOS/SOW: cierre fuera TR ∧ Spread > 1.3×ATR ∧ RVOL > 1.5  |  LPS/LPSY: RVOL < 0.8',
        bullets: [
          'SOS / SOW equivale a un MSS/BOS institucional (+25 pts en Estructura).',
          'LPS / LPSY aporta +15 pts de confirmación de volumen en retest de alta precisión.',
          'Ley de Causa y Efecto: la altura del TR proyecta el objetivo medido en Modo Sombra.',
        ],
        mistake: 'Perseguir la vela gigante de SOS en lugar de esperar el retroceso ordenado LPS/OB.',
      },
    ],
  },
  {
    id: 'engine',
    number: '04',
    shortTitle: 'Recap & Motor',
    title: 'Motor de Confluencia y Modo Sombra',
    question: '¿Cómo une nuestro indicador SMC, Liquidez, Wyckoff y las últimas velas en señales A+ y proyección futura?',
    intro:
      'Aquí es donde todas las piezas trabajan juntas. El indicador recuerda eventos institucionales dentro de una ventana móvil de 25 velas, calcula un score 0–100 en vivo para LONG y SHORT, marca zonas direccionales y proyecta un Modo Sombra sin repintar.',
    concepts: [
      {
        id: 'eng-scoring',
        tag: '0–100 Puntos',
        title: 'Arquitectura del Scoring de Confluencia',
        summary:
          'Cinco pilares objetivos suman hasta 100 puntos. Las señales ▲ LONG / ▼ SHORT aparecen desde 50 pts en eventos confirmados, y las píldoras A+ LONG / A+ SHORT únicamente desde 75+ pts.',
        whyItHappens:
          'En mercados reales un Spring ocurre en la vela t, el MSS en t+4 y el toque al OB en Discount en t+8. La ventana de confluencia conecta la narrativa completa sin exigir que todo ocurra en una sola vela.',
        formula: 'Score = Manipulación(25) + Estructura(25) + P/D(20) + POI(15) + Volumen(15)',
        bullets: [
          'Exige 4 filtros para A+: Score ≥ 75, Trigger fresco en la vela cerrada, dominancia direccional y cooldown.',
          'Cada etiqueta incluye un tooltip interactivo con el desglose exacto de los 5 pilares.',
          'Alertas alertcondition globales garantizan paridad 100% entre historial y tiempo real.',
        ],
      },
      {
        id: 'eng-shadow',
        tag: 'Modo Sombra',
        title: 'Proyección Futura Estimada (Últimas Velas + Wyckoff + POIs)',
        summary:
          'Solo en barstate.islast hacia la derecha (0% repintado), dibuja una trayectoria punteada de 3 tramos envuelta en un cono gris translúcido basado en ATR.',
        whyItHappens:
          'Traduce el estado actual del motor en un escenario visual inmediato: si hay TR Wyckoff sigue la hoja de ruta de la Fase A–E; si hay tendencia combina presión de cuerpos/mechas × RVOL, pendiente de últimas N velas y pullback al OB/FVG más cercano.',
        formula: 'barImpulse = (0.65 × cuerpo/rango + 0.35 × (mechaInf − mechaSup)/rango) × min(RVOL, 3)',
        bullets: [
          'Con TR activo: proyecta el siguiente evento lógico (ej. Fase C Spring → SOS → objetivo +1× altura TR).',
          'Sin TR activo: si existe un OB/FVG fresco dentro de 3×ATR, proyecta pullback al POI antes del impulso.',
          'Cono de sombra creciente (±0.45 → ±0.78 → ±1.10 ATR) refleja honestamente la incertidumbre estadística.',
        ],
        mistake: 'Tomar el Modo Sombra como certeza absoluta en vez de un mapa de escenario probable para planificar.',
      },
      {
        id: 'eng-playbook',
        tag: 'Operativa',
        title: 'Playbook en 4 Pasos y Calibración',
        summary:
          'Usa el Dashboard minimalista para el contexto macro, alertas de pre-aviso (Spring / Entrada en OB) para prepararte y la señal A+ para validar ejecución y gestión de riesgo.',
        whyItHappens:
          'Incluso el mejor motor necesita disciplina de Stop-Loss estructural (detrás del Spring/Sweep u OB) y objetivos en liquidez contraria ($$$ EQH/EQL o Swing opuesto).',
        formula: 'Riesgo/Beneficio objetivo ≥ 1:2.5  |  Scalping 15–20 Swing  |  Intradía 25  |  Swing 30–40',
        bullets: [
          'Paso 1 (Dashboard): verificar Swing, Zona (Discount/Premium), Fase Wyckoff y RVOL.',
          'Paso 2 (Pre-alerta): Spring/UTAD o Precio entrando en OB activo.',
          'Paso 3 (Confirmación): A+ LONG / A+ SHORT al cierre + revisión del tooltip de desglose.',
          'Paso 4 (Gestión): Stop detrás de manipulación/OB y parciales en 50% EQ y liquidez opuesta.',
        ],
      },
    ],
  },
];

export const GLOSSARY: GlossaryItem[] = [
  { term: 'A+ LONG / SHORT', fullName: 'Señal Institucional de Alta Confluencia', category: 'Motor', definition: 'Etiqueta principal emitida al cierre cuando el scoring alcanza ≥ 75/100 junto a un disparador válido y cooldown cumplido.' },
  { term: 'Absorción VSA', fullName: 'Esfuerzo sin Resultado', category: 'Wyckoff & VSA', definition: 'Volumen relativo elevado que no logra avanzar el precio por frenado institucional.', formula: 'RVOL > 1.8 ∧ (cuerpo < 35% ∨ mecha > 50%)' },
  { term: 'AR', fullName: 'Automatic Rally / Automatic Reaction', category: 'Wyckoff & VSA', definition: 'Rebote automático tras SC o caída tras BC que delimita el borde opuesto del Trading Range (Fase A).' },
  { term: 'ATR(14)', fullName: 'Average True Range (14)', category: 'Motor', definition: 'Medida normalizada de volatilidad usada para filtrar desplazamiento, ruido de FVG, tolerancia EQH/EQL y cono del Modo Sombra.' },
  { term: 'barstate.isconfirmed', fullName: 'Confirmación de Cierre Pine v6', category: 'Motor', definition: 'Condición nativa que garantiza cero repintado: los eventos se evalúan únicamente cuando la vela cerró de forma definitiva.' },
  { term: 'BB+ / BB-', fullName: 'Breaker Block', category: 'Liquidez & POIs', definition: 'Order Block válido que fue invalidado con cierre más allá de su extremo distal e invierte su polaridad (soporte ↔ resistencia).' },
  { term: 'BC', fullName: 'Buying Climax', category: 'Wyckoff & VSA', definition: 'Clímax comprador en máximos que inaugura una potencial Distribución y fija el techo del Trading Range.', formula: 'RVOL > 2.2 ∧ Spread > 1.8×ATR' },
  { term: 'BOS', fullName: 'Break of Structure', category: 'SMC', definition: 'Ruptura de estructura a favor de la tendencia vigente confirmando continuación direccional.' },
  { term: 'BSL / SSL', fullName: 'Buy-Side / Sell-Side Liquidity', category: 'Liquidez & POIs', definition: 'Liquidez de stops acumulada sobre máximos (BSL) o debajo de mínimos (SSL).' },
  { term: 'CHoCH', fullName: 'Change of Character', category: 'SMC', definition: 'Primera ruptura estructural en contra de la tendencia vigente; señal temprana de posible cambio de carácter.' },
  { term: 'Desplazamiento', fullName: 'Displacement', category: 'SMC', definition: 'Impulso institucional violento que valida un MSS y habilita la creación de Order Blocks.', formula: '|close - open| > 1.5×ATR ∧ vol > 1.2×SMA20' },
  { term: 'Discount / Premium', fullName: 'Zonas de Valor 0–50% / 50–100%', category: 'SMC', definition: 'Mitades inferior (barata, compras) y superior (cara, ventas) respecto al rango entre Swing Low y Swing High confirmados.' },
  { term: 'EQH / EQL', fullName: 'Equal Highs / Equal Lows ($$$)', category: 'Liquidez & POIs', definition: 'Dos o más pivotes a casi el mismo precio concentrando liquidez institucional.', formula: '|P₁ − P₂| ≤ 0.15 × ATR(14)' },
  { term: 'FVG', fullName: 'Fair Value Gap (Imbalance)', category: 'Liquidez & POIs', definition: 'Ineficiencia de 3 velas dibujada en caja gris limpia que se recorta dinámicamente al rellenarse.', formula: 'low > high[2] (alc.) ∧ gap > 0.25×ATR' },
  { term: 'Liquidity Sweep', fullName: 'Barrido de Liquidez (×)', category: 'Liquidez & POIs', definition: 'La mecha supera un Swing o EQH/EQL y la vela cierra nuevamente dentro del rango.' },
  { term: 'LPS / LPSY', fullName: 'Last Point of Support / Supply', category: 'Wyckoff & VSA', definition: 'Retroceso de bajo volumen posterior a SOS/SOW hacia el borde del TR o un OB/FVG (Fase E).', formula: 'RVOL < 0.8' },
  { term: 'Modo Sombra', fullName: 'Proyección Futura Estimada', category: 'Motor', definition: 'Trayectoria punteada + cono ATR proyectada hacia el futuro en barstate.islast combinando últimas velas, Wyckoff y POIs.' },
  { term: 'MSS', fullName: 'Market Structure Shift', category: 'SMC', definition: 'Un CHoCH validado adicionalmente por Desplazamiento de cuerpo y volumen.' },
  { term: 'OB+ / OB-', fullName: 'Order Block', category: 'Liquidez & POIs', definition: 'Última vela contraria al impulso antes de un desplazamiento que rompe estructura.' },
  { term: 'RVOL', fullName: 'Relative Volume', category: 'Wyckoff & VSA', definition: 'Razón entre el volumen actual y el promedio de las últimas 20 velas.', formula: 'volume / ta.sma(volume, 20)' },
  { term: 'SC', fullName: 'Selling Climax', category: 'Wyckoff & VSA', definition: 'Clímax vendedor tras caída que inaugura una potencial Acumulación y fija el piso del TR.', formula: 'RVOL > 2.2 ∧ Spread > 1.8×ATR' },
  { term: 'SOS / SOW', fullName: 'Sign of Strength / Weakness', category: 'Wyckoff & VSA', definition: 'Ruptura decidida fuera del Trading Range (Fase D) con expansión de spread y volumen.', formula: 'Spread > 1.3×ATR ∧ RVOL > 1.5' },
  { term: 'Spring / UTAD', fullName: 'Trampa Institucional (Fase C)', category: 'Wyckoff & VSA', definition: 'Perforación del borde del TR con cierre de regreso al interior en la misma vela o en 1–2 velas.' },
  { term: 'ST', fullName: 'Secondary Test', category: 'Wyckoff & VSA', definition: 'Retesteo del extremo SC/BC en Fase B sin cerrar fuera y con volumen reducido.', formula: 'RVOL < 0.9' },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    module: 'Módulo 01 · SMC Core',
    prompt: '¿Qué diferencia exactamente un MSS (Market Structure Shift) de un CHoCH común en nuestro indicador?',
    options: [
      'El MSS solo ocurre en la estructura interna y el CHoCH solo en la Swing.',
      'El MSS es un CHoCH que además cumple Desplazamiento: cuerpo > 1.5×ATR(14) y volumen > 1.2×SMA(20).',
      'El MSS se confirma con mecha y el CHoCH siempre con cierre.',
      'No hay diferencia técnica, solo cambia el color de la línea.',
    ],
    correctIndex: 1,
    explanation:
      'Exacto: un CHoCH avisa el primer quiebre contra tendencia, pero el MSS exige Desplazamiento institucional real (expansión de cuerpo y volumen superior al promedio), lo que otorga +25 pts en el motor.',
  },
  {
    id: 'q2',
    module: 'Módulo 02 · Liquidez',
    prompt: 'El precio supera con la mecha un nivel $$$ EQH pero la vela cierra debajo del nivel. ¿Cómo lo clasifica el motor?',
    options: [
      'Como un BOS alcista confirmado.',
      'Como un BSL Liquidity Sweep bajista (marca × y +25 pts Short en Manipulación).',
      'Como un Fair Value Gap alcista.',
      'Se ignora porque no hubo cierre por encima.',
    ],
    correctIndex: 1,
    explanation:
      'Correcto: perforar con mecha sobre liquidez superior (high > nivel) y cerrar debajo (close < nivel) es un BSL Sweep clásico que suma +25 pts en el pilar de Manipulación bajista.',
  },
  {
    id: 'q3',
    module: 'Módulo 02 · POIs',
    prompt: '¿Qué sucede si un Order Block Alcista (OB+) es atravesado con un cierre de vela por debajo de su mínimo (extremo distal) con Breaker Blocks activados?',
    options: [
      'Permanece intacto como soporte alcista hasta el siguiente día.',
      'Se convierte en un Breaker Block Bajista (BB-) invirtiendo su polaridad a resistencia.',
      'Se transforma automáticamente en un Trading Range de Wyckoff.',
      'Se multiplica su puntaje de confluencia por dos.',
    ],
    correctIndex: 1,
    explanation:
      'Así es: los compradores atrapados en ese OB roto cierran en breakeven cuando el precio regresa, convirtiendo el antiguo soporte en resistencia (Breaker Block con borde punteado).',
  },
  {
    id: 'q4',
    module: 'Módulo 03 · Wyckoff & VSA',
    prompt: 'Aparece una vela bajista con RVOL = 2.4x pero su cuerpo ocupa solo el 20% del rango y deja una mecha inferior del 65%. ¿Qué detecta el motor VSA?',
    options: [
      'Falta de interés institucional (Secondary Test).',
      'Anomalía de Absorción Alcista (Esfuerzo alto sin resultado bajista → frenado institucional).',
      'Una ruptura SOW confirmada.',
      'Un Fair Value Gap sin filtro ATR.',
    ],
    correctIndex: 1,
    explanation:
      'Ley de Esfuerzo vs. Resultado: enorme volumen (RVOL > 1.8) que no logra desplazar el cierre hacia abajo delata absorción por órdenes limitadas de compra institucional (+15 pts en Volumen).',
  },
  {
    id: 'q5',
    module: 'Módulo 03 · Fases Wyckoff',
    prompt: 'En un esquema de Acumulación, el precio rompe el piso del TR y vuelve a cerrar adentro 2 velas después. ¿En qué fase y evento entra el motor?',
    options: [
      'Fase A · Selling Climax (SC)',
      'Fase B · Secondary Test (ST)',
      'Fase C · SPRING (manipulación y +25 pts Long)',
      'Fase E · Last Point of Support (LPS)',
    ],
    correctIndex: 2,
    explanation:
      'Correcto: nuestro motor soporta recuperación de Spring/UTAD tanto en la misma vela como en las 1–2 velas siguientes, activando la Fase C y alimentando los +25 pts de manipulación.',
  },
  {
    id: 'q6',
    module: 'Módulo 04 · Motor & Sombra',
    prompt: '¿Por qué el Modo Sombra NO viola la regla anti-repintado del indicador?',
    options: [
      'Porque solo dibuja líneas grises y no usa colores.',
      'Porque se calcula y proyecta únicamente hacia el futuro (bar_index + k) en barstate.islast, sin alterar ninguna señal ni dato histórico.',
      'Porque utiliza pivotes futuros de 50 velas.',
      'Porque desactiva las alertas alertcondition.',
    ],
    correctIndex: 1,
    explanation:
      'Exacto: todas las señales históricas y alertas corren exclusivamente en barstate.isconfirmed (0 lookahead), mientras que el Modo Sombra proyecta únicamente un escenario estimado hacia la derecha de la vela actual.',
  },
];
