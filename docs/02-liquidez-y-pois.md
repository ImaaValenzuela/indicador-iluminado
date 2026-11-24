# Módulo 2 — Liquidez y Puntos de Interés (POIs)

> **Pregunta que responde este módulo:** *¿Dónde está escondido el combustible (liquidez) que buscan las instituciones y en qué zonas exactas del precio dejan sus órdenes pendientes?*

---

## 1. ¿Qué es la Liquidez en los Mercados Financieros?

Para que un banco, fondo de cobertura o creador de mercado (*Smart Money*) pueda comprar **500 millones de dólares** de un activo sin disparar el precio en su propia contra (*slippage*), necesita que alguien del otro lado le **venda** 500 millones de dólares al mismo precio.

¿Dónde hay miles de órdenes concentradas esperando ejecutarse al mismo nivel? **En los Stop-Loss y órdenes de ruptura (Breakout Orders) de los traders minoristas.**

- **Buy-Side Liquidity (BSL — Liquidez de Compra):** Se acumula **por encima** de máximos previos (`Swing Highs`, resistencias obvias, dobles techos). Allí descansan:
  1. Los *Stop-Loss* de quienes están en corto (que al activarse ejecutan compras a mercado).
  2. Las órdenes *Buy Stop* de quienes compran "rupturas de resistencia".
- **Sell-Side Liquidity (SSL — Liquidez de Venta):** Se acumula **por debajo** de mínimos previos (`Swing Lows`, soportes obvios, dobles pisos). Allí descansan:
  1. Los *Stop-Loss* de quienes están comprados (que al activarse ejecutan ventas a mercado).
  2. Las órdenes *Sell Stop* de quienes venden "rupturas de soporte".

> **Regla de oro institucional:** El mercado se mueve **de liquidez en liquidez**. Sin contrapartida no hay volumen; sin barrido de liquidez, las instituciones no pueden llenar posiciones grandes a buen precio.

---

## 2. Equal Highs (EQH) y Equal Lows (EQL) — Los Pools `$$$`

Cuando el precio rebota dos o más veces casi al mismo nivel formando un "doble techo" o "doble piso" muy limpio, el análisis técnico tradicional enseña que es un "soporte o resistencia muy fuerte".

El resultado psicológico es predecible: miles de participantes colocan sus stops **justo unos ticks por encima del doble techo (EQH)** o **justo unos ticks por debajo del doble piso (EQL)**. Para un algoritmo institucional, esos niveles no son muros infranqueables: son **imanes de dinero (`$$$`)**.

```text
           $$$ EQH (Stop-Loss de vendedores acumulados aquí)
     ······/\······/\······   <-- Diferencia entre máximos < 0.15 * ATR(14)
          /  \    /  \
         /    \  /    \
        /      \/      \
```

### Definición Algorítmica
Dos pivotes (dos máximos o dos mínimos) se consideran iguales cuando la distancia entre sus precios es menor que una pequeña fracción de la volatilidad normal:

$$\lvert \text{Precio}_1 - \text{Precio}_2 \rvert \le 0.15 \times \text{ATR}(14)$$

---

## 3. Liquidity Sweep (Barrido de Liquidez / Toma de Stops)

Un **Liquidity Sweep** ocurre cuando el precio perfora un nivel obvio de liquidez (`Swing High/Low` o `EQH`/`EQL`) con la **mecha**, activa todas las órdenes acumuladas allí, y **cierra inmediatamente de vuelta dentro del rango**.

```text
  BSL Sweep (Bajista)                     SSL Sweep (Alcista)

        |   <-- Mecha barre stops               \
   ─────┼────── Swing High / EQH                 \   /
       ┌┴┐  <-- Cierre DEBAJO del nivel           \ /
       │ │      (Trampa completada)         ───────┼─────── Swing Low / EQL
       └─┘                                        └┬┘ <-- Cierre ENCIMA
                                                   |  <-- Mecha barre stops
```

### Condición Exacta
- **BSL Sweep (Bajista):** `high > nivel` **y** `close < nivel`.
- **SSL Sweep (Alcista):** `low < nivel` **y** `close > nivel`.

### ¿Qué pasó realmente en esa vela?
En un SSL Sweep, los minoristas entraron en pánico al ver "roto el soporte" y vendieron (o saltaron sus stops). Las instituciones usaron exactamente esa avalancha de ventas para **absorber y llenar sus órdenes de compra masivas**, haciendo que la vela cerrara de nuevo arriba.

---

## 4. Order Blocks (OB) — La Huella Institucional

### ¿Qué es un Order Block?
Cuando una institución acumula una posición enorme antes de un movimiento violento, suele ejecutar primero una última maniobra en sentido contrario (para generar liquidez o terminar de llenar su orden) justo antes de soltar el impulso.

Visualmente, esa huella queda registrada como la **última vela contraria al impulso** que precede a un movimiento con **Desplazamiento** y logra romper estructura (`BOS`, `CHoCH` o `MSS`).

```text
Order Block Alcista (OB+)

                        /   <-- Ruptura de estructura (BOS/MSS)
              ─────────/──
                      /
                     /  <-- Impulso con Desplazamiento (cuerpo grande + volumen)
           ┌───┐    /
           │OB+│───/────────── Zona del OB extendida a la derecha
           └───┘  ▲
             ▲    └── Precio suele volver a mitigar aquí y rebotar
             └── Última vela BAJISTA antes del impulso alcista
```

### ¿Por qué el precio vuelve al Order Block? (Mitigación)
Muchas veces, al disparar el precio con tanta fuerza, una parte de las órdenes institucionales queda **sin llenarse** o con posiciones de cobertura temporales en pérdida justo en esa vela de origen. Cuando el precio regresa al Order Block, las instituciones cierran sus coberturas en *breakeven* y ejecutan el resto de su capital, provocando una reacción fuerte desde esa zona.

### Modos de Mitigación (cuándo deja de estar "fresco" un OB)
Un Order Block es más fuerte en su **primer toque** (cuando está "virgen" o sin mitigar). Según cuán estricto quieras ser, existen 3 criterios para darlo por mitigado:

1. **Proximal:** apenas el precio toca el borde más cercano del OB (`low <= ob.top` en OB alcista).
2. **50% Mean Threshold *(Recomendado / Default)*:** cuando el precio penetra hasta la mitad exacta del bloque (`(ob.top + ob.bottom) / 2`). Es el punto de equilibrio del bloque donde suele concentrarse la mayor reacción.
3. **Distal Invalidation:** el OB sigue vigente mientras el precio no cierre completamente más allá del extremo opuesto.

---

## 5. Breaker Blocks (BB) — Cuando un OB Falla con Fuerza

¿Qué ocurre si un Order Block alcista que debería actuar como soporte es **destrozado con un cierre por debajo de su mínimo**?

Significa que los compradores que estaban defendiendo esa zona quedaron **atrapados en pérdida** y la fuerza dominante pasó a ser bajista. Cuando el precio retrocede nuevamente a esa misma caja rota, los compradores atrapados cierran en *breakeven* (vendiendo) y los nuevos vendedores institucionales refuerzan la presión.

- **OB Alcista invalidado con cierre abajo** → se transforma en **Breaker Block Bajista (`BB-`)**, ahora actúa como **resistencia**.
- **OB Bajista invalidado con cierre arriba** → se transforma en **Breaker Block Alcista (`BB+`)**, ahora actúa como **soporte**.

```text
         ┌───┐
         │OB+│··· ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐  Ahora es BB- (Resistencia)
         └───┘               /\     │
            \               /  \    │ <-- Precio retestea y cae
             \  (Cierre    /    \
              \  debajo)  /      ▼
               \─────────/
```

---

## 6. Fair Value Gaps (FVG / Imbalances)

### ¿Qué es un Imbalance o Fair Value Gap?
En un mercado equilibrado, compradores y vendedores intercambian contratos a cada nivel de precio. Pero cuando entra una oleada institucional muy agresiva, el precio salta tan rápido que en **una vela de impulso** solo hubo un bando participando (solo compras o solo ventas), dejando un **"hueco" de ineficiencia** entre las mechas de la vela anterior y la vela siguiente.

```text
FVG Alcista (3 velas)                   FVG Bajista (3 velas)

                   ┌──┐  Vela actual    ┌──┐  Vela [2]
                   │  │  (low)          │  │  (low[2])
             ┄┄┄┄┄┄┴──┴┄┄┄              └──┘
             ░░░░░░░░░░░░  ← FVG+       ┄┄┄┄┄┄┄┄┄┄┄┄┄┄
             ░░░░░░░░░░░░  (low >       ░░░░░░░░░░░░░░  ← FVG-
             ┄┄┄┄┄┄┬──┬┄┄   high[2])    ░░░░░░░░░░░░░░  (high <
         ┌──┐      │  │                 ┄┄┄┄┄┄┬──┬┄┄┄┄   low[2])
         │  │ Vela │  │ Vela                  │  │ Vela actual
         └──┘ [2]  └──┘ [1]                   └──┘ (high)
        (high[2])
```

### Reglas Matemáticas
- **FVG Alcista:** $\text{low}_t > \text{high}_{t-2}$
- **FVG Bajista:** $\text{high}_t < \text{low}_{t-2}$
- **Filtro de Ruido (crítico):** En mercados reales aparecen micro-gaps diminutos sin valor. Solo consideramos válidos los FVGs cuyo tamaño supere el **25% del ATR**:
  $$\text{Tamaño FVG} > 0.25 \times \text{ATR}(14)$$

### Comportamiento del Precio ante un FVG
Los mercados tienden a **rebalancear** sus ineficiencias: el precio suele regresar a rellenar parcial (`50%`, llamado *Consequent Encroachment*) o totalmente (`100%`) la caja del FVG antes de continuar en dirección del impulso original. Cuando un **FVG** coincide espacialmente junto a un **Order Block**, forman una zona de altísima probabilidad.

---

## Errores Comunes con Liquidez y POIs

1. **Marcar cualquier vela contraria como Order Block:** Si la vela no generó **Desplazamiento** ni rompió estructura (`BOS`/`CHoCH`/`MSS`), es ruido, no un OB institucional.
2. **Operar un OB en medio de la nada (sin liquidez previa):** Los mejores OBs y FVGs están precedidos por un **Liquidity Sweep** o un **Spring/UTAD** que ya limpió a los traders débiles.
3. **Dejar FVGs ya rellenados en el gráfico:** Una vez que el imbalance se mitigó al 100% (o 50% en modo estricto), perdió su ineficiencia; mantenerlo dibujado solo ensucia la lectura.

---

**Siguiente módulo:** [Módulo 3 — Motor Wyckoff y VSA (Volumen, Rangos y Eventos) →](./03-wyckoff-y-vsa.md)
