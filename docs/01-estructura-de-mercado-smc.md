# Módulo 1 — Estructura de Mercado (SMC Core)

> **Pregunta que responde este módulo:** *¿En qué dirección se está moviendo realmente el mercado, cuándo cambia de tendencia con intención institucional y si el precio actual está caro o barato?*

---

## 1. ¿Qué es la Estructura de Mercado?

El precio nunca se mueve en línea recta. Incluso en la tendencia alcista más fuerte, el mercado avanza en impulsos y retrocesos (ondas). A los puntos donde el precio gira formando techos y pisos locales se los llama **pivotes** (*Swing Highs* y *Swing Lows*).

La **estructura de mercado** es simplemente el mapa que dibujan esos máximos y mínimos consecutivos:

- **Tendencia Alcista (Bullish)**: el precio crea máximos cada vez más altos (**HH** — *Higher High*) y mínimos cada vez más altos (**HL** — *Higher Low*).
- **Tendencia Bajista (Bearish)**: el precio crea mínimos cada vez más bajos (**LL** — *Lower Low*) y máximos cada vez más bajos (**LH** — *Lower High*).
- **Rango / Lateralización**: el precio oscila entre un techo y un piso sin romper ninguno con convicción.

```text
Tendencia Alcista (HH / HL)            Tendencia Bajista (LH / LL)

           HH                               HL / Máx
          /\                                /\
     HH  /  \                              /  \   LH
    /\  /    \                            /    \  /\
   /  \/      \ HL                       /      \/  \
  /    HL                               /        LL  \
 /                                                    \  LL
                                                       \/
```

### ¿Cómo se detecta un pivote sin hacer trampa (Anti-Repintado)?
Un error clásico de muchos indicadores es marcar un techo o piso mirando velas futuras (repintado). En programación seria, un **pivote de longitud `N`** se confirma únicamente cuando:
- Para un **Pivot High**: su `high` es el más alto de las `N` velas a su izquierda **y** las `N` velas a su derecha.
- Para un **Pivot Low**: su `low` es el más bajo de las `N` velas a su izquierda **y** las `N` velas a su derecha.

Eso significa que recién al cerrarse la vela `N` posterior al giro sabemos con 100% de certeza que ese punto fue un pivote real. Nunca desaparece ni se mueve después.

---

## 2. Fractalidad: Estructura Swing vs. Estructura Interna

Los mercados son **fractales**: dentro de un gran impulso alcista existen pequeños retrocesos bajistas que, vistos de cerca, son micro-tendencias bajistas completas.

Por eso se analizan **dos capas estructurales simultáneas**:

| Capa | Lookback típico | Qué representa | Para qué sirve |
|---|---|---|---|
| **Estructura Swing** | Largo (`20–50` velas, default `25`) | Los puntos de giro principales de la tendencia macro del gráfico actual. | Define el **sesgo direccional principal** y los bordes del rango Premium/Discount. |
| **Estructura Interna** | Corto (`3–10` velas, default `5`) | Los micro-impulsos y retrocesos dentro del rango Swing. | Detecta **cambios tempranos de flujo de órdenes** antes de que rompa un gran Swing. |

```text
           Swing High (HH)
                /\
               /  \     <-- Retroceso con estructura INTERNA bajista (iBOS)
              /    \/\
             /        \  <-- Giro temprano interno (iCHoCH / iMSS)
            /          \/\
           /              \--> Impulso que rompe el Swing High (BOS)
  Swing Low (HL)
```

> **Analogía útil:** La Estructura Swing es la **marea** del océano; la Estructura Interna son las **olas**. Operar una ola que acaba de girar a favor de la marea es mucho más efectivo que nadar contra la marea.

---

## 3. Confirmación de Ruptura: Cierre (`Close`) vs. Mecha (`Wick`)

Cuando el precio supera un máximo o mínimo previo, existen dos formas de validar si hubo una ruptura real:

1. **Por Cierre de vela (`Close`) — Recomendado / Default**:
   - El **cuerpo** de la vela debe cerrar más allá del nivel (`close > Swing High` o `close < Swing Low`).
   - **Por qué es más estricto:** Filtra falsas rupturas donde el precio solo sacó liquidez con una mecha larga y volvió adentro (que en realidad es un *Liquidity Sweep*, no una ruptura).
2. **Por Mecha (`Wick`)**:
   - Basta con que `high > Swing High` o `low < Swing Low`.
   - Más rápido, pero produce más señales falsas en mercados con mucha manipulación de mechas.

---

## 4. BOS, CHoCH y MSS: Las 3 Rupturas Clave

Entender la diferencia exacta entre estos tres eventos es el corazón de SMC:

### A. BOS — *Break of Structure* (Ruptura de Estructura)
- **Definición:** Ruptura **a favor** de la tendencia vigente.
  - En tendencia alcista: el precio rompe el último Swing High → confirma continuación alcista.
  - En tendencia bajista: el precio rompe el último Swing Low → confirma continuación bajista.
- **Significado institucional:** Los participantes dominantes siguen defendiendo su dirección y tienen suficiente capital para empujar el precio a nuevos extremos.

### B. CHoCH — *Change of Character* (Cambio de Carácter)
- **Definición:** La **primera ruptura en contra** de la tendencia vigente.
  - En tendencia alcista: el precio rompe hacia abajo el último mínimo relevante.
  - En tendencia bajista: el precio rompe hacia arriba el último máximo relevante.
- **Significado institucional:** Es la primera señal de advertencia de que el bando contrario comenzó a tomar el control. Sin embargo, un CHoCH débil (con velas chicas y poco volumen) puede ser solo una trampa o un retroceso profundo.

### C. MSS — *Market Structure Shift* (Cambio de Estructura con Desplazamiento)
- **Definición:** Es un **CHoCH de alta calidad** que además ocurre con **Desplazamiento institucional** (*Displacement*).
- **Condición matemática exacta de Desplazamiento:**
  1. **Cuerpo expansivo:** $\lvert \text{close} - \text{open} \rvert > 1.5 \times \text{ATR}(14)$
  2. **Volumen superior al promedio:** $\text{volume} > 1.2 \times \text{SMA}(\text{volume}, 20)$
- **¿Por qué exige ambos filtros?**
  - **ATR (Average True Range)** mide la volatilidad normal del activo. Un cuerpo mayor a `1.5 × ATR` demuestra urgencia real (no una ruptura tibia).
  - **Volumen > `1.2 × SMA(20)`** confirma que detrás de esa vela expansiva hubo participación real de órdenes grandes, no falta de liquidez pasajera.

```text
Tendencia Bajista previa:
        LH
        /\
       /  \         <-- Vela grande + Alto Volumen (Desplazamiento)
      /    \       ||
     /      \      ||  ======= MSS ======= (Ruptura violenta del LH)
    /        \    /||
   /          \  /
               \/
               LL
```

> **Resumen rápido:**
> - `BOS` = seguimos en la misma dirección.
> - `CHoCH` = alerta, podría estar girando.
> - `MSS` = giro **confirmado con fuerza y dinero real**.

---

## 5. Zonas Premium, Discount y Equilibrium (50%)

Una regla básica del comercio (en cualquier mercado financiero o físico) es **comprar barato y vender caro**. Pero en trading, ¿qué significa "barato" o "caro" de forma objetiva?

Se toma el rango actual entre el último **Swing Low (`0%`)** y el último **Swing High (`100%`)** confirmados y se divide exactamente por la mitad:

$$\text{Equilibrium (50\%)} = \frac{\text{Swing High} + \text{Swing Low}}{2}$$

```text
100% ───────────────────────── Swing High
      ░░░░░░░░░░░░░░░░░░░░░░░
      ░░░  ZONA PREMIUM   ░░░  ← Caro (50% – 100%): buscar VENTAS
      ░░░░░░░░░░░░░░░░░░░░░░░
 50% ························· Equilibrium (Valor Justo)
      ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
      ▒▒▒  ZONA DISCOUNT  ▒▒▒  ← Barato (0% – 50%): buscar COMPRAS
      ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
  0% ───────────────────────── Swing Low
```

### Por qué es clave para la gestión de riesgo
- Comprar en **Premium** (cerca del `85–95%` del rango) implica un stop-loss enorme y muy poco recorrido antes de chocar contra el máximo.
- Comprar en **Discount** (por debajo del `50%`) permite ubicar stops ajustados y capturar el impulso completo con relaciones Riesgo/Beneficio de `1:3` o superiores.
- Las instituciones casi siempre dejan retroceder el precio hacia **Discount** antes de continuar comprando (o hacia **Premium** antes de continuar vendiendo).

---

## Errores Comunes al Aplicar Estructura SMC

1. **Perseguir cada CHoCH interno como si fuera un giro macro:** Un `iCHoCH` bajista dentro de un impulso Swing alcista suele ser simplemente el inicio del retroceso hacia Discount para volver a subir.
2. **Ignorar el volumen y el tamaño de vela en un giro:** Un cambio de estructura sin desplazamiento (`CHoCH` débil) falla mucho más seguido que un `MSS`.
3. **Comprar justo debajo de un Swing High (en Premium):** Aunque la tendencia sea alcista, el precio está extendido y vulnerable a un retroceso o barrido de liquidez.

---

**Siguiente módulo:** [Módulo 2 — Liquidez y Puntos de Interés (POIs) →](./02-liquidez-y-pois.md)
