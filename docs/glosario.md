# Glosario Rápido A–Z

Referencia concisa de todos los términos, siglas y fórmulas utilizados en el **SMC + Wyckoff Institutional Engine**.

---

### A
- **A+ LONG / A+ SHORT:** Señal final de alta confluencia emitida al cierre de la vela cuando el sistema de scoring alcanza o supera el umbral mínimo configurado (default `75/100`) junto a un disparador válido.
- **Absorción (VSA):** Anomalía de *Esfuerzo sin Resultado*: `RVOL > 1.8` combinado con cuerpo pequeño (`< 35%` del rango) o mecha de rechazo (`> 50%` del rango). Indica intervención institucional frenando el movimiento.
- **AR (*Automatic Rally* / *Automatic Reaction*):** Rebote automático posterior a un `SC` (en acumulación) o caída posterior a un `BC` (en distribución). Define el límite opuesto del `Trading Range`.
- **ATR (*Average True Range*):** Indicador de volatilidad promedio (`ta.atr(14)`). Usado como unidad normalizada para filtrar desplazamiento, ruido de FVG, tolerancia de EQH/EQL y spreads de Wyckoff.

### B
- **barstate.isconfirmed:** Variable nativa de Pine Script que es `true` únicamente cuando la vela cerró de forma definitiva. Base de nuestra garantía **anti-repintado**.
- **BB+ / BB- (*Breaker Block*):** Order Block previamente válido que fue invalidado con fuerza (cierre más allá de su extremo distal) e invierte su polaridad (soporte ↔ resistencia).
- **BC (*Buying Climax*):** Clímax comprador tras una tendencia alcista (`RVOL > 2.2`, `Spread > 1.8*ATR`, cierre débil o rechazo inmediato). Define el techo de un rango de distribución.
- **BOS (*Break of Structure*):** Ruptura de estructura a favor de la tendencia vigente (continuación).
- **BSL (*Buy-Side Liquidity*):** Liquidez acumulada sobre máximos previos (stops de vendedores en corto y órdenes de ruptura alcista).

### C
- **CHoCH (*Change of Character*):** Primera ruptura estructural en contra de la tendencia vigente (alerta temprana de posible giro).
- **Composite Man:** Concepto de Richard Wyckoff que modela a las grandes instituciones como un único operador estratégico que acumula, marca tendencia, distribuye y provoca barridos de liquidez.

### D
- **Desplazamiento (*Displacement*):** Movimiento impulsivo institucional validado por cuerpo `> 1.5 * ATR(14)` y volumen `> 1.2 * SMA(volume, 20)`.
- **Discount (0% – 50%):** Mitad inferior del rango entre el último Swing Low y Swing High confirmados. Zona óptima de valor para compras.

### E
- **EQH / EQL (*Equal Highs / Equal Lows*):** Dos o más pivotes cuyos precios difieren en menos de `0.15 * ATR(14)`. Marcados como `$$$` por concentrar alta liquidez.
- **Equilibrium (50%):** Punto medio exacto entre el último Swing High y Swing Low confirmados.

### F
- **FVG (*Fair Value Gap* / Imbalance):** Ineficiencia de precio de 3 velas (`low > high[2]` alcista; `high < low[2]` bajista) filtrada por tamaño mínimo `> 0.25 * ATR(14)`.

### L
- **Liquidity Sweep (`×`):** Barrido de liquidez donde la mecha supera un Swing o `EQH`/`EQL` pero la vela cierra de vuelta dentro del rango.
- **LPS (*Last Point of Support*):** Retroceso de bajo volumen (`RVOL < 0.8`) posterior a un `SOS`, testeando el techo del TR o un `OB`/`FVG` alcista.
- **LPSY (*Last Point of Supply*):** Retroceso de bajo volumen (`RVOL < 0.8`) posterior a un `SOW`, testeando el piso del TR o un `OB`/`FVG` bajista.

### M
- **Mean Threshold (50% del OB):** Punto medio exacto de un Order Block; nivel estándar de mitigación equilibrada.
- **MSS (*Market Structure Shift*):** Un `CHoCH` validado además con **Desplazamiento** (cuerpo expansivo + volumen superior al promedio).

### O
- **OB+ / OB- (*Order Block*):** Última vela contraria al impulso que precede a un movimiento con Desplazamiento capaz de generar un `BOS`, `CHoCH` o `MSS`.

### P
- **POI (*Point of Interest*):** Zona de precio con alta probabilidad de reacción institucional (`Order Block`, `Breaker Block` o `Fair Value Gap`).
- **Premium (50% – 100%):** Mitad superior del rango entre el último Swing Low y Swing High confirmados. Zona óptima de valor para ventas.

### R
- **RVOL (*Relative Volume*):** Volumen actual dividido entre su media móvil de 20 períodos (`volume / ta.sma(volume, 20)`).

### S
- **SC (*Selling Climax*):** Clímax vendedor tras tendencia bajista (`RVOL > 2.2`, `Spread > 1.8*ATR`, cierre fuerte o rechazo alcista inmediato). Define el piso de un rango de acumulación.
- **SMC (*Smart Money Concepts*):** Metodología basada en estructura fractal, liquidez y huellas de órdenes institucionales.
- **SOS (*Sign of Strength*):** Ruptura alcista decidida por encima del techo del TR (`close > top`, `Spread > 1.3*ATR`, `RVOL > 1.5`).
- **SOW (*Sign of Weakness*):** Ruptura bajista decidida por debajo del piso del TR (`close < bottom`, `Spread > 1.3*ATR`, `RVOL > 1.5`).
- **Spring:** Trampa bajista en acumulación: el precio rompe el piso del TR y cierra nuevamente adentro en la misma vela o en 1–2 velas.
- **SSL (*Sell-Side Liquidity*):** Liquidez acumulada debajo de mínimos previos (stops de compradores y órdenes de ruptura bajista).
- **ST (*Secondary Test*):** Retesteo de la zona de `SC`/`BC` con volumen notablemente reducido (`RVOL < 0.9`) sin cerrar fuera del rango.

### T
- **TR (*Trading Range*):** Rango lateral institucional delimitado por `SC`/`BC` y `AR` donde ocurre acumulación o distribución.

### U
- **UDT (*User Defined Type*):** Estructura de datos personalizada (`type`) de Pine Script v6 utilizada para gestionar con eficiencia de memoria objetos como `OrderBlock`, `FVG`, `SwingPoint` y `TradingRange`.
- **UTAD (*Upthrust After Distribution*):** Trampa alcista en distribución: el precio rompe el techo del TR y cierra nuevamente adentro en la misma vela o en 1–2 velas.

### V
- **VSA (*Volume Spread Analysis*):** Análisis cuantitativo de la relación entre volumen (`RVOL`), rango de la vela (`Spread`) y posición de cierre para detectar acumulación, distribución y absorción profesional.
