# SPEC TÉCNICO: Indicador SMC + Wyckoff Institutional Engine (Pine Script v6)

## 1. Arquitectura y Restricciones Técnicas

- **Lenguaje**: Pine Script v6 (`//@version=6`).
- **Declaración**: `indicator("SMC + Wyckoff Institutional Engine", overlay=true, max_boxes_count=500, max_lines_count=500, max_labels_count=500)`.
- **Regla Anti-Repintado (Crítica)**:
  - Ninguna señal de confirmación ni alerta puede usar datos futuros.
  - Los pivotes (`ta.pivothigh` / `ta.pivotlow`) se marcan en la vela histórica correspondiente, pero los eventos dependientes (BOS, CHoCH, MSS, Sweeps, Spring/UTAD, SOS/SOW, A+) solo se evalúan y disparan al cierre de la vela actual (`barstate.isconfirmed`).
- **Gestión de Memoria y Rendimiento**:
  - Usar User Defined Types (`type`) para estructurar objetos (`OrderBlock`, `FVG`, `TradingRange`, `SwingPoint`).
  - Usar `array` con límite dinámico (eliminar los elementos más antiguos cuando se supere el máximo configurado por el usuario) para evitar errores de límite de dibujo en TradingView.

---

## 2. Módulo 1: Estructura de Mercado (SMC Core)

- **Dos capas de estructura simultáneas**:
  - Estructura Interna (lookback corto, ej. 5 velas).
  - Estructura Swing (lookback largo, ej. 20–50 velas).
- **Confirmación de Ruptura (Input configurable)**: Ruptura por **Cierre de vela** (default, más estricto) o por **Mecha**.
- **BOS (Break of Structure)**: Ruptura a favor de la tendencia vigente (rompe el último Swing High en tendencia alcista o Swing Low en bajista).
- **CHoCH (Change of Character)**: Primera ruptura en contra de la tendencia vigente.
- **MSS (Market Structure Shift)**: Un CHoCH que además cumple con **Desplazamiento**:
  - Cuerpo de la vela de ruptura `> 1.5 * ta.atr(14)`.
  - Volumen `> 1.2 * ta.sma(volume, 20)`.
- **Zonas Premium / Discount / Equilibrium**:
  - Calculadas dinámicamente entre el último Swing High y Swing Low confirmados:
    - **Premium**: `50% – 100%` (zona de ventas).
    - **Equilibrium**: Línea del `50%`.
    - **Discount**: `0% – 50%` (zona de compras).

---

## 3. Módulo 2: Liquidez y Puntos de Interés (POIs)

- **Equal Highs / Equal Lows (EQH / EQL)**:
  - Detectar dos o más pivotes cuyos precios difieran en menos de `0.15 * ta.atr(14)`.
  - Dibujar línea punteada etiquetada como `$$$` o `EQH`/`EQL`.
- **Liquidity Sweep (Barrido de Liquidez)**:
  - Una vela supera un Swing High/Low previo o un EQH/EQL con la mecha, pero cierra nuevamente dentro del rango.
- **Order Blocks (OB)**:
  - **Validez**: Última vela contraria al impulso que precede a un movimiento con Desplazamiento y genera un BOS o CHoCH/MSS.
  - **Mitigación**: Permanece activo y extendido hacia la derecha hasta que el precio toca su zona (configurable: extremo proximal, 50% Mean Threshold, o invalidación por cierre más allá del extremo distal).
  - **Breaker Block**: Si un OB válido es invalidado con fuerza (cierre fuera del rango), marcarlo opcionalmente como Breaker (invierte polaridad soporte ↔ resistencia).
- **Fair Value Gaps (FVG)**:
  - **Alcista**: `low > high[2]` (vela actual vs. 2 velas atrás).
  - **Bajista**: `high < low[2]`.
  - **Filtro de ruido**: Solo dibujar si el tamaño del gap es mayor a `0.25 * ta.atr(14)`. Recortar o eliminar el box una vez que el precio rellena el 100% (o 50% si el usuario lo configura).

---

## 4. Módulo 3: Motor Wyckoff (Volumen, Rangos y Eventos)

### A. Ley de Esfuerzo vs. Resultado (VSA)
- **Volumen Relativo (RVOL)**: `volume / ta.sma(volume, 20)`.
- **Spread Relativo**: `(high - low) / ta.atr(14)`.
- **Anomalía de Absorción (Esfuerzo sin Resultado)**: `RVOL > 1.8` combinado con un cuerpo pequeño (`math.abs(close - open) < 0.35 * (high - low)`) o mecha de rechazo mayor al `50%` de la vela.

### B. Detección del Trading Range (TR) y Eventos Clave

| Evento Wyckoff | Regla Algorítmica (Acumulación — invertir para Distribución) |
|---|---|
| **SC / BC** (Selling / Buying Climax) | Tras tendencia bajista, vela con `RVOL > 2.2` y `Spread > 1.8 * ATR` que cierra en el tercio superior o es seguida inmediatamente por rechazo alcista. Define el Límite Inferior del TR. |
| **AR** (Automatic Rally / Reaction) | Rebote posterior al SC que forma un Swing High relevante. Define el Límite Superior del TR. |
| **ST** (Secondary Test) | El precio vuelve a testear la zona del SC con volumen significativamente menor (`RVOL < 0.9`), sin romper el mínimo con cierre. |
| **Spring / UTAD** | El precio rompe el límite inferior del TR (Spring) o superior (UTAD) y cierra de vuelta dentro del TR en la misma vela o en las siguientes 1–2 velas. |
| **SOS / SOW** | Ruptura decidida del límite superior del TR (SOS) o inferior (SOW) con cierre fuera del rango, `Spread > 1.3 * ATR` y `RVOL > 1.5`. |
| **LPS / LPSY** | Retroceso posterior al SOS/SOW con volumen decreciente (`RVOL < 0.8`) hacia el borde del TR o hacia un OB/FVG creado durante el SOS/SOW. |

---

## 5. Módulo 4: Motor de Confluencia (SMC + Wyckoff)

### Sistema de Scoring (0 a 100 pts)
- **+25 pts**: Evento de manipulación detectado (`Spring`/`UTAD` o `Liquidity Sweep`).
- **+25 pts**: Confirmación estructural con fuerza (`MSS` o `SOS`/`SOW`).
- **+20 pts**: Precio reaccionando en zona `Discount` (compras) o `Premium` (ventas).
- **+15 pts**: Presencia de `Order Block` o `FVG` sin mitigar en el origen del impulso / zona activa.
- **+15 pts**: Confirmación de volumen (`VSA Absorción` en el giro o volumen decreciente en el test/`LPS`/`LPSY`).

### Etiquetas de Setup
- Mostrar etiqueta `A+ LONG` / `A+ SHORT` únicamente cuando el puntaje sea mayor o igual a `75` (configurable).

---

## 6. Interfaz de Usuario (Inputs, Dashboard y Alertas)

- **Inputs agrupados por sección (`group`)**:
  1. Estructura SMC.
  2. Liquidez y POIs.
  3. Motor Wyckoff & VSA.
  4. Confluencia, Dashboard y Alertas.
- **Dashboard (Tabla en esquina superior derecha)**:
  - Tendencia Swing (Alcista / Bajista).
  - Tendencia Interna (Alcista / Bajista).
  - Zona actual (Premium / Discount / Equilibrium).
  - Estado Wyckoff actual (Tendencia / En Rango / Spring / SOS / etc.).
  - Último puntaje de confluencia.
- **Alertas (`alertcondition`)**:
  - Nueva señal `A+ LONG` / `A+ SHORT`.
  - Detección de `Spring` / `UTAD`.
  - Detección de `MSS` (cambio de estructura con desplazamiento).
  - Precio entrando en un `Order Block` activo.
