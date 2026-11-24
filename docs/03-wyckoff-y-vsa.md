# Módulo 3 — Motor Wyckoff y VSA (Volumen, Rangos y Eventos)

> **Pregunta que responde este módulo:** *¿Qué está haciendo realmente el dinero profesional detrás de las velas? ¿Está absorbiendo oferta para acumular, distribuyendo en los máximos o respaldando una ruptura real?*

---

## 1. Fundamentos de la Metodología Wyckoff

Richard Wyckoff estudió a los grandes operadores institucionales (*Composite Man* o "Operador Compuesto") hace más de un siglo y descubrió que el mercado no se mueve al azar, sino a través de **4 fases cíclicas**:

1. **Acumulación:** Las instituciones compran discretamente dentro de un rango lateral tras una caída, absorbiendo toda la oferta del pánico minorista.
2. **Tendencia Alcista (Markup):** Una vez absorbida la oferta, empujan el precio al alza con facilidad.
3. **Distribución:** En los máximos, aprovechan la euforia compradora para vender progresivamente su inventario dentro de un nuevo rango lateral.
4. **Tendencia Bajista (Markdown):** Sin soporte institucional, el precio cae buscando nueva liquidez abajo.

### Las 3 Leyes de Wyckoff
1. **Ley de Oferta y Demanda:** Si la demanda supera a la oferta, el precio sube; si la oferta supera a la demanda, el precio baja.
2. **Ley de Causa y Efecto:** Cuanto más grande y prolongado es un rango lateral (**Causa** — acumulación o distribución), mayor tiende a ser el movimiento direccional posterior (**Efecto**).
3. **Ley de Esfuerzo vs. Resultado:** El **volumen** representa el *esfuerzo* y el **desplazamiento del precio** representa el *resultado*. Si ambos coinciden, hay armonía (el movimiento es sano). Si hay un esfuerzo gigante (volumen altísimo) con un resultado pobre (vela chica o mecha larga de rechazo), existe una **divergencia de absorción**: las manos fuertes están frenando el movimiento.

---

## 2. VSA — *Volume Spread Analysis* (Esfuerzo vs. Resultado en Números)

Para eliminar la subjetividad visual al leer barras de volumen, traducimos la *Ley de Esfuerzo vs. Resultado* en métricas normalizadas que funcionan en cualquier activo y temporalidad:

### A. Volumen Relativo (`RVOL`)
Mide cuántas veces más grande (o más chico) es el volumen actual comparado con el promedio de las últimas 20 velas:

$$\text{RVOL} = \frac{\text{volume}}{\text{SMA}(\text{volume}, 20)}$$

- `RVOL = 1.0` → volumen normal.
- `RVOL > 1.8` → actividad institucional muy elevada.
- `RVOL < 0.8` → sequía / ausencia de presión contraria (clave en retrocesos sanos).

### B. Spread Relativo
Mide el rango total de la vela (`high - low`) en relación con la volatilidad normal (`ATR(14)`):

$$\text{Spread Relativo} = \frac{\text{high} - \text{low}}{\text{ATR}(14)}$$

### C. Anomalía de Absorción (Esfuerzo sin Resultado)
Se detecta cuando confluyen dos hechos simultáneos:
1. **Esfuerzo extraordinario:** $\text{RVOL} > 1.8$
2. **Resultado frenado:**
   - Cuerpo comprimido: $\lvert \text{close} - \text{open} \rvert < 0.35 \times (\text{high} - \text{low})$, **O**
   - Mecha de rechazo dominante mayor al `50%` del rango total de la vela.

```text
Absorción Alcista (Frenado de caída)      Absorción Bajista (Frenado de subida)

         ┌─┐  Cierre en mitad superior            │   Mecha superior > 50%
         └┬┘                                      │   (Oferta institucional)
          │   Mecha inferior > 50%               ┌┴┐
          │   (Demanda absorbiendo ventas)       └─┘  Cierre en mitad inferior
     ═════════                                ═════════
     █████████  RVOL > 1.8x (Esfuerzo alto)   █████████  RVOL > 1.8x (Esfuerzo alto)
```

**Interpretación práctica:** Si el precio viene cayendo fuerte y aparece una vela con el doble de volumen normal pero que no logra avanzar (cuerpo chico o enorme mecha inferior), significa que **todo ese volumen vendedor chocó contra órdenes limitadas de compra institucional**.

---

## 3. Anatomía de un Trading Range (TR) de Wyckoff

Un **Trading Range** no es cualquier lateralización: comienza tras un clímax de volumen y atraviesa una secuencia ordenada de eventos que dejan ver quién está ganando la batalla entre oferta y demanda.

### Esquema de Acumulación (Compra Institucional)

```text
Precio
  ▲
  │ \                                                            ╱── Markup
  │  \             AR (Techo TR)                      SOS      ╱
  │   \            /\───────────────────────────┬─────/───────/──
  │    \          /  \      TR Acumulación      │    /  \  LPS (RVOL < 0.8)
  │     \        /    \            /\           │   /    \/
  │      \      /      \    /\    /  \          │  /
  │       \    /        \  /  \  /    \         │ /
  │        \  /          \/    \/      \        │/
  │─────────\/──────────ST──────────────\───────┴──── Piso TR (SC)
  │         SC       (RVOL < 0.9)        \  /
  │     (Clímax)                          \/
  │                                     SPRING (Trampa bajista + cierre dentro)
  └────────────────────────────────────────────────────────────────────► Tiempo
```

### Esquema de Distribución (Venta Institucional — Espejo Invertido)

```text
Precio
  ▲                                      UTAD (Trampa alcista + cierre dentro)
  │                                       /\
  │          BC       (RVOL < 0.9)       /  \
  │──────────/\───────────ST────────────/────\──────── Techo TR (BC)
  │         /  \         /\            /      \
  │        /    \       /  \    /\    /        \
  │       /      \     /    \  /  \  /          \     LPSY (RVOL < 0.8)
  │      /        \   /      \/    \/            \    /\
  │     /          \ /   TR Distribución          \  /  \
  │    /            \/─────────────────────────────\/────\───── Piso TR (AR)
  │   /             AR (Piso TR)                  SOW     \
  │  /                                                     \── Markdown
  └────────────────────────────────────────────────────────────────────► Tiempo
```

---

## 4. Explicación Detallada de Cada Evento Wyckoff

### 1. `SC` (*Selling Climax*) / `BC` (*Buying Climax*)
- **Qué ocurre:** Tras una tendencia extendida, el pánico (en caída) o la euforia (en subida) alcanza un pico extremo. El público entrega sus posiciones en masa y las instituciones absorben el flujo.
- **Regla algorítmica:**
  - Tendencia previa clara (Swing, Interna o EMA 50).
  - `RVOL > 2.2` **y** `Spread > 1.8 × ATR(14)`.
  - En **SC**: cierra en el tercio superior (`>= 66%` de la vela) **o** es seguida inmediatamente en la vela siguiente por una vela alcista de rechazo. **Define el Piso del TR.**
  - En **BC**: cierra en el tercio inferior (`<= 34%` de la vela) **o** es seguida por una vela bajista de rechazo. **Define el Techo del TR.**

### 2. `AR` (*Automatic Rally* / *Automatic Reaction*)
- **Qué ocurre:** Tras el agotamiento del clímax, la ausencia momentánea de presión contraria provoca un rebote automático fuerte.
- **Regla algorítmica:** El primer pivote relevante (Swing o Interno) que se forma después del `SC` (en Acumulación) o del `BC` (en Distribución), con una distancia mínima de `0.5 × ATR`.
- **Importancia:** Junto con el `SC`/`BC`, deja **oficialmente delimitados el techo y el piso del Trading Range**.

### 3. `ST` (*Secondary Test*)
- **Qué ocurre:** El precio regresa a probar la zona del clímax para comprobar si todavía queda presión vendedora (en Acumulación) o compradora (en Distribución).
- **Regla algorítmica:**
  - El precio vuelve al 25% extremo del TR (`SC` o `BC`).
  - **No cierra** fuera del límite del TR.
  - El volumen es **significativamente menor**: `RVOL < 0.9`.
- **Por qué importa:** Confirma que el clímax anterior realmente agotó al bando perdedor.

### 4. `SPRING` / `UTAD` (*Upthrust After Distribution*) — La Trampa Institucional
- **Qué ocurre:** Antes de iniciar la tendencia real, el *Composite Man* empuja el precio brevemente fuera del TR para barrer todos los stops de quienes estaban posicionados correctamente y atrapar a traders de ruptura en el lado equivocado.
- **Regla algorítmica:**
  - **SPRING:** El precio perfora el **piso del TR** (`low < tr.bottom`) y **cierra nuevamente dentro del TR** (`close > tr.bottom`) en la **misma vela o en las siguientes 1–2 velas**.
  - **UTAD:** El precio perfora el **techo del TR** (`high > tr.top`) y **cierra nuevamente dentro del TR** (`close < tr.top`) en la **misma vela o en las siguientes 1–2 velas**.
- **Confluencia directa con SMC:** Un `Spring` es esencialmente un **SSL Liquidity Sweep** a escala de rango institucional; un `UTAD` es un **BSL Liquidity Sweep**.

### 5. `SOS` (*Sign of Strength*) / `SOW` (*Sign of Weakness*)
- **Qué ocurre:** El mercado demuestra definitivamente quién ganó el rango rompiendo el límite opuesto con convicción, expansión y volumen.
- **Regla algorítmica:**
  - **SOS:** `close > tr.top` con `Spread > 1.3 × ATR` **y** `RVOL > 1.5`.
  - **SOW:** `close < tr.bottom` con `Spread > 1.3 × ATR` **y** `RVOL > 1.5`.
- **Confluencia directa con SMC:** Equivale a un **MSS / BOS con desplazamiento** que suele dejar detrás un `Order Block` y un `FVG` frescos.

### 6. `LPS` (*Last Point of Support*) / `LPSY` (*Last Point of Supply*)
- **Qué ocurre:** Después del `SOS`/`SOW`, muchos traders temen "haberse perdido el tren". Sin embargo, el precio suele ofrecer un retroceso ordenado con **muy poco volumen** hacia el borde roto del TR o hacia el `OB`/`FVG` creado durante la ruptura.
- **Regla algorítmica:**
  - Retroceso posterior al `SOS`/`SOW` hacia el borde del TR o dentro de un `OB`/`FVG` activo a favor de la ruptura.
  - Volumen decreciente: `RVOL < 0.8`.
- **Por qué es una de las mejores entradas del trading:** Confirma que ya no hay oposición contra la nueva tendencia y permite entrar con stop muy ajustado y riesgo/beneficio excelente.

---

## Errores Comunes al Aplicar Wyckoff y VSA

1. **Usarlo en activos sin datos de volumen:** Índices CFDs o símbolos con `volume = 0` impiden calcular `RVOL`; Wyckoff/VSA necesita activos con volumen real (Cripto, Futuros, Acciones) o volumen tick confiable (Forex de brokers líquidos como OANDA).
2. **Confundir una ruptura genuina con un Spring/UTAD:** Si el precio rompe el piso del TR y **no** logra recuperar y cerrar adentro en 1–2 velas, no es un Spring: es una invalidación bajista de la acumulación.
3. **Entrar en el primer `SC` a ciegas ("atrapar cuchillos cayendo"):** El `SC` solo anuncia el inicio potencial de un rango; la confirmación de alta probabilidad llega con el `Spring`/`SOS`/`LPS`.

---

**Siguiente módulo (Recap Integrador):** [Módulo 4 — Cómo se Integra Todo en Nuestro Indicador →](./04-confluencia-y-motor-aplicado.md)
