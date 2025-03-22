import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, Label, ResponsiveContainer } from 'recharts';
import './DiagramaMollier.css';

const DiagramaMollier = () => {
  // Estado para controlar las pestañas
  const [tabActiva, setTabActiva] = useState('datos');

  // Datos del equipo
  const datosEquipo = {
    evaporador: {
      presion: 35.5,
      tempSaturacion: 40.5,
      tempSalidaAgua: 43.7,
      tempRetornoAgua: 47.8
    },
    condensador: {
      presion: 100.1,
      tempSaturacion: 87.7,
      subenfriamiento: 13.7,
      tempSalidaAgua: 85.5,
      tempRetornoAgua: 77
    },
    compresor: {
      tempDescarga: 110,
      eficiencia: 85
    }
  };

  // Puntos del ciclo real
  const puntosReales = [
    { punto: 1, h: 190, p: datosEquipo.evaporador.presion, descripcion: "Salida del evaporador" },
    { punto: 2, h: 210, p: datosEquipo.condensador.presion, descripcion: "Descarga del compresor" },
    { punto: 3, h: 115, p: datosEquipo.condensador.presion, descripcion: "Salida del condensador" },
    { punto: 4, h: 115, p: datosEquipo.evaporador.presion, descripcion: "Entrada al evaporador" }
  ];

  // Ciclo real completo (conectando los puntos)
  const cicloReal = [
    puntosReales[0],
    puntosReales[1],
    puntosReales[2],
    puntosReales[3],
    puntosReales[0]
  ];

  // Puntos del ciclo ideal
  const puntosIdeales = [
    { punto: 1, h: 190, p: datosEquipo.evaporador.presion, descripcion: "Salida del evaporador (ideal)" },
    { punto: 2, h: 205, p: datosEquipo.condensador.presion, descripcion: "Descarga del compresor (ideal)" },
    { punto: 3, h: 110, p: datosEquipo.condensador.presion, descripcion: "Salida del condensador (ideal)" },
    { punto: 4, h: 110, p: datosEquipo.evaporador.presion, descripcion: "Entrada al evaporador (ideal)" }
  ];

  // Ciclo ideal completo (conectando los puntos)
  const cicloIdeal = [
    puntosIdeales[0],
    puntosIdeales[1],
    puntosIdeales[2],
    puntosIdeales[3],
    puntosIdeales[0]
  ];

  // Isotermas (líneas de temperatura constante)
  const isotermas = [
    { nombre: "40°F", temp: 40, puntos: [{ h: 40, p: 35 }, { h: 220, p: 35 }] },
    { nombre: "60°F", temp: 60, puntos: [{ h: 40, p: 50 }, { h: 220, p: 50 }] },
    { nombre: "80°F", temp: 80, puntos: [{ h: 40, p: 70 }, { h: 220, p: 70 }] },
    { nombre: "100°F", temp: 100, puntos: [{ h: 40, p: 95 }, { h: 220, p: 95 }] }
  ];

  // Curvas de saturación más precisas para R-134a
  const curvaLiquido = [
    { h: 40, p: 20 },
    { h: 60, p: 30 },
    { h: 70, p: datosEquipo.evaporador.presion },
    { h: 85, p: 45 },
    { h: 95, p: 60 },
    { h: 105, p: 80 },
    { h: 115, p: datosEquipo.condensador.presion }
  ];

  const curvaVaporR134a = [
    { h: 190, p: datosEquipo.evaporador.presion },
    { h: 195, p: 50 },
    { h: 200, p: 70 },
    { h: 205, p: 90 },
    { h: 210, p: datosEquipo.condensador.presion }
  ];

  // Cálculos de rendimiento
  // Trabajo del compresor = h2 - h1
  const trabajoCompresorReal = puntosReales[1].h - puntosReales[0].h;
  const trabajoCompresorIdeal = puntosIdeales[1].h - puntosIdeales[0].h;

  // Efecto refrigerante = h1 - h4
  const efectoRefrigeranteReal = puntosReales[0].h - puntosReales[3].h;
  const efectoRefrigeranteIdeal = puntosIdeales[0].h - puntosIdeales[3].h;

  // COP = Efecto refrigerante / Trabajo del compresor
  const COPReal = efectoRefrigeranteReal / trabajoCompresorReal;
  const COPIdeal = efectoRefrigeranteIdeal / trabajoCompresorIdeal;

  // Eficiencia relativa
  const eficienciaRelativa = (COPReal / COPIdeal * 100).toFixed(1);

  return (
    <div className="diagrama-container">
      
      <div className="tabs-container">
        <div 
          className={`tab ${tabActiva === 'datos' ? 'active' : ''}`} 
          onClick={() => setTabActiva('datos')}
        >
          Datos Actuales
        </div>
        <div 
          className={`tab ${tabActiva === 'comparacion' ? 'active' : ''}`} 
          onClick={() => setTabActiva('comparacion')}
        >
          Comparación Real vs Ideal
        </div>
        <div 
          className={`tab ${tabActiva === 'analisis' ? 'active' : ''}`} 
          onClick={() => setTabActiva('analisis')}
        >
          Análisis de Deficiencias
        </div>
      </div>

      <div className="tab-content">
        <h3 style={{textAlign: 'center', marginTop: 0}}>Diagrama de Mollier (p-h) - R-134a</h3>
        
        {tabActiva === 'datos' && (
          <>
            <div className="datos-sistema">
              <h3>Datos del Sistema:</h3>
              <div className="datos-container">
                <div className="datos-seccion">
                  <h4>Evaporador:</h4>
                  <ul className="datos-lista">
                    <li>Presión: {datosEquipo.evaporador.presion} PSIG</li>
                    <li>Temperatura de saturación: {datosEquipo.evaporador.tempSaturacion} °F</li>
                    <li>Agua: {datosEquipo.evaporador.tempSalidaAgua}°F / {datosEquipo.evaporador.tempRetornoAgua}°F</li>
                  </ul>
                </div>
                <div className="datos-seccion">
                  <h4>Condensador:</h4>
                  <ul className="datos-lista">
                    <li>Presión: {datosEquipo.condensador.presion} PSIG</li>
                    <li>Temperatura de saturación: {datosEquipo.condensador.tempSaturacion} °F</li>
                    <li>Subenfriamiento: {datosEquipo.condensador.subenfriamiento} °F</li>
                    <li>Agua: {datosEquipo.condensador.tempSalidaAgua}°F / {datosEquipo.condensador.tempRetornoAgua}°F</li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}
        
        {tabActiva === 'comparacion' && (
          <>
            <div className="comparacion-contenido">
              <h3>Comparación de Rendimiento:</h3>
              <div className="comparacion-datos">
                <div className="comparacion-seccion">
                  <h4>Ciclo Real:</h4>
                  <ul className="comparacion-lista">
                    <li>Trabajo compresor: {trabajoCompresorReal.toFixed(2)} kJ/kg</li>
                    <li>Efecto refrigerante: {efectoRefrigeranteReal.toFixed(2)} kJ/kg</li>
                    <li>COP: {COPReal.toFixed(2)}</li>
                  </ul>
                </div>
                <div className="comparacion-seccion">
                  <h4>Ciclo Ideal R-134a:</h4>
                  <ul className="comparacion-lista">
                    <li>Trabajo compresor: {trabajoCompresorIdeal.toFixed(2)} kJ/kg</li>
                    <li>Efecto refrigerante: {efectoRefrigeranteIdeal.toFixed(2)} kJ/kg</li>
                    <li>COP: {COPIdeal.toFixed(2)}</li>
                  </ul>
                </div>
              </div>
              <p className="comparacion-eficiencia">Eficiencia relativa: {eficienciaRelativa}% del ciclo ideal</p>
            </div>
          </>
        )}
        
        {tabActiva === 'analisis' && (
          <>
            <div className="analisis-contenido">
              <h3>Análisis de Deficiencias:</h3>
              <ul className="analisis-lista">
                <li><strong>Pérdida en la transferencia de calor:</strong> La diferencia entre el ciclo real y el ideal muestra pérdidas en la transferencia de calor, particularmente en el evaporador.</li>
                <li><strong>Problemas de subenfriamiento:</strong> La advertencia "PÉRDIDA DE SELLO SUBENFRIADOR LÍQUIDO" se refleja en un subenfriamiento menor al ideal, reduciendo la capacidad de refrigeración.</li>
                <li><strong>Ineficiencia de compresión:</strong> La temperatura de descarga más alta en el ciclo real indica una compresión menos eficiente, aumentando el trabajo requerido.</li>
                <li><strong>Control de nivel de refrigerante:</strong> La advertencia "PUNTO DE AJUSTE DE NIVEL DE LÍQUIDO NO SE CONSIGUE" afecta la operación óptima del ciclo, especialmente en la expansión.</li>
              </ul>
              <p className="analisis-recomendacion">Recomendación: Revisar el subenfriador de líquido y el sistema de control de nivel de refrigerante para mejorar el rendimiento del sistema y aproximarse más al ciclo ideal del R-134a.</p>
            </div>
          </>
        )}
        
        <div className="grafico-container">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
              <XAxis 
                type="number" 
                dataKey="h" 
                domain={[40, 220]} 
                label={{ value: 'Entalpía (kJ/kg)', position: 'insideBottom', offset: -5 }} 
                allowDataOverflow
                stroke="#666"
              />
              <YAxis 
                type="number" 
                domain={[0, 120]} 
                label={{ value: 'Presión (PSIG)', angle: -90, position: 'insideLeft' }} 
                allowDataOverflow
                stroke="#666"
              />
              <Tooltip formatter={(value, name) => {
                const nameStr = String(name);
                if (nameStr === 'Ciclo Real' || nameStr === 'Ciclo Ideal' || nameStr.includes('Curva')) {
                  return [value, nameStr];
                } else if (nameStr.includes('Isoterma')) {
                  return [value, nameStr];
                }
                return [`${nameStr}: P=${value} PSIG`, 'Punto del ciclo'];
              }} />
              <Legend />
              
              {/* Curvas de saturación R-134a */}
              <Line type="monotone" dataKey="p" data={curvaLiquido} name="Curva Líquido R-134a" stroke="#1E88E5" dot={false} />
              <Line type="monotone" dataKey="p" data={curvaVaporR134a} name="Curva Vapor R-134a" stroke="#1E88E5" dot={false} strokeDasharray="5 5" />
              
              {/* Isotermas seleccionadas */}
              {isotermas.map((isoterma, index) => (
                <Line 
                  key={`isoterma-${index}`}
                  type="monotone"
                  dataKey="p"
                  data={isoterma.puntos}
                  name={`Isoterma ${isoterma.nombre}`}
                  stroke="#FF9800"
                  strokeWidth={1}
                  strokeOpacity={0.5}
                  dot={false}
                />
              ))}
              
              {/* Ciclo real - solo mostrar en las pestañas relevantes */}
              {(tabActiva === 'comparacion' || tabActiva === 'analisis') && (
                <Line type="linear" dataKey="p" data={cicloReal} name="Ciclo Real" stroke="#D81B60" strokeWidth={2} />
              )}
              
              {/* Ciclo ideal - solo mostrar en las pestañas relevantes */}
              {(tabActiva === 'comparacion' || tabActiva === 'analisis') && (
                <Line type="linear" dataKey="p" data={cicloIdeal} name="Ciclo Ideal" stroke="#2E7D32" strokeWidth={2} strokeDasharray="4 2" />
              )}
              
              {/* Puntos del ciclo real - solo mostrar en las pestañas relevantes */}
              {(tabActiva === 'comparacion' || tabActiva === 'analisis') && puntosReales.map((punto, index) => (
                <Line 
                  key={`real-${index}`}
                  type="monotone"
                  dataKey="p"
                  data={[punto]}
                  name={`R${punto.punto}`}
                  stroke="#D81B60"
                  strokeWidth={0}
                  dot={{ r: 6, fill: "#D81B60" }}
                />
              ))}
              
              {/* Puntos del ciclo ideal - solo mostrar en la pestaña de comparación */}
              {tabActiva === 'comparacion' && puntosIdeales.map((punto, index) => (
                <Line 
                  key={`ideal-${index}`}
                  type="monotone"
                  dataKey="p"
                  data={[punto]}
                  name={`I${punto.punto}`}
                  stroke="#2E7D32"
                  strokeWidth={0}
                  dot={{ r: 6, fill: "#2E7D32" }}
                />
              ))}
              
              {/* Líneas de referencia */}
              <ReferenceLine y={datosEquipo.evaporador.presion} stroke="#FF9800" strokeDasharray="3 3">
                <Label value="Presión Evaporador" position="insideRight" />
              </ReferenceLine>
              <ReferenceLine y={datosEquipo.condensador.presion} stroke="#FF9800" strokeDasharray="3 3">
                <Label value="Presión Condensador" position="insideRight" />
              </ReferenceLine>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DiagramaMollier;
