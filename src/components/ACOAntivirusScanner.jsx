import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Activity, FastForward, Route } from 'lucide-react';

// ==================== SIMULATION COMPONENT ====================
const ACOAntivirusScanner = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [iteration, setIteration] = useState(0);
  const [detectedThreats, setDetectedThreats] = useState([]);
  const [stats, setStats] = useState({ scanned: 0, threats: 0, efficiency: 0 });
  const [files, setFiles] = useState([]);
  const [ants, setAnts] = useState([]);
  const [pheromoneTrails, setPheromoneTrails] = useState([]);
  const [shortestPath, setShortestPath] = useState([]);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    initializeFileSystem();
  }, []);

  const initializeFileSystem = () => {
    const newFiles = [];
    const gridSize = 8;
    
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const isThreat = Math.random() < 0.15;
        const recentlyModified = Math.random() < 0.3;
        newFiles.push({
          id: `file_${i}_${j}`,
          x: i,
          y: j,
          isThreat,
          scanned: false,
          scanCount: 0,
          type: isThreat ? 'malware' : 'normal',
          recentlyModified,
          detected: false,
          threatLevel: recentlyModified ? 0.3 : 0.1
        });
      }
    }
    
    setFiles(newFiles);
    setPheromoneTrails([]);
    setShortestPath([]);
    const newAnts = [];
    for (let i = 0; i < 12; i++) {
      newAnts.push({
        id: i,
        x: Math.random() * gridSize,
        y: Math.random() * gridSize,
        targetFile: null,
        scanning: false,
        path: []
      });
    }
    setAnts(newAnts);
    setDetectedThreats([]);
    setStats({ scanned: 0, threats: 0, efficiency: 0 });
    setIteration(0);
  };

  useEffect(() => {
    if (isRunning) {
      animationRef.current = setInterval(() => {
        updateSimulation();
      }, 100);
    } else {
      if (animationRef.current) clearInterval(animationRef.current);
    }
    return () => {
      if (animationRef.current) clearInterval(animationRef.current);
    };
  }, [isRunning, files, ants, iteration]);

  const updateSimulation = () => {
    setIteration(prev => prev + 1);
    setPheromoneTrails(prev => prev.map(trail => ({...trail, intensity: trail.intensity - (trail.isThreatMarker ? 0.00625 : 0.05)})).filter(trail => trail.intensity > 0));

    setAnts(prevAnts => {
      return prevAnts.map(ant => {
        if (!ant.targetFile || Math.random() < 0.5) {
          const unscannedFiles = files.filter(f => !f.detected);
          if (unscannedFiles.length === 0) return ant;
          
          const detectedFiles = files.filter(f => f.detected);
          let antsNearThreats = 0;
          detectedFiles.forEach(threat => {
            prevAnts.forEach(otherAnt => {
              const dist = Math.sqrt(Math.pow(otherAnt.x - threat.x, 2) + Math.pow(otherAnt.y - threat.y, 2));
              if (dist < 2) antsNearThreats++;
            });
          });
          
          const forcedExploration = antsNearThreats > 4;
          const explorationMode = forcedExploration || Math.random() < 0.5;
          
          if (explorationMode) {
            const farFiles = unscannedFiles.filter(f => {
              const nearThreat = detectedFiles.some(threat => {
                const dist = Math.sqrt(Math.pow(f.x - threat.x, 2) + Math.pow(f.y - threat.y, 2));
                return dist < 3;
              });
              return !nearThreat;
            });
            const targetPool = farFiles.length > 0 ? farFiles : unscannedFiles;
            const randomFile = targetPool[Math.floor(Math.random() * targetPool.length)];
            return { ...ant, targetFile: randomFile.id, path: [] };
          }
          
          const totalThreat = unscannedFiles.reduce((sum, f) => {
            const distance = Math.sqrt(Math.pow(f.x - ant.x, 2) + Math.pow(f.y - ant.y, 2));
            const distancePenalty = 1 / (distance * distance + 1);
            return sum + (f.threatLevel * distancePenalty);
          }, 0);
          
          let random = Math.random() * totalThreat;
          let selectedFile = unscannedFiles[0];
          for (const file of unscannedFiles) {
            const distance = Math.sqrt(Math.pow(file.x - ant.x, 2) + Math.pow(file.y - ant.y, 2));
            const distancePenalty = 1 / (distance * distance + 1);
            const probability = file.threatLevel * distancePenalty;
            random -= probability;
            if (random <= 0) {
              selectedFile = file;
              break;
            }
          }
          return { ...ant, targetFile: selectedFile.id, path: [] };
        }
        
        const targetFile = files.find(f => f.id === ant.targetFile);
        if (targetFile) {
          const dx = targetFile.x - ant.x;
          const dy = targetFile.y - ant.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 0.2) {
            scanFile(targetFile);
            return { ...ant, x: targetFile.x, y: targetFile.y, targetFile: null, path: [] };
          } else {
            const speed = 0.15;
            const newX = ant.x + (dx / distance) * speed;
            const newY = ant.y + (dy / distance) * speed;
            setPheromoneTrails(prev => [...prev, {id: Math.random(), x: ant.x, y: ant.y, intensity: 1.0, timestamp: Date.now(), isThreatMarker: false}]);
            return {...ant, x: newX, y: newY, path: [...ant.path.slice(-20), { x: ant.x, y: ant.y }]};
          }
        }
        return ant;
      });
    });
  };

  const scanFile = (file) => {
    setFiles(prevFiles => {
      return prevFiles.map(f => {
        if (f.id === file.id) {
          const newFile = { ...f, scanned: true, scanCount: f.scanCount + 1 };
          if (f.isThreat && !f.detected && iteration > 30) {
            newFile.detected = true;
            setDetectedThreats(prev => [...prev, f.id]);
            setStats(prev => ({scanned: prev.scanned + 1, threats: prev.threats + 1, efficiency: ((prev.threats + 1) / (prev.scanned + 1) * 100).toFixed(1)}));
            setPheromoneTrails(prev => {
              const burst = [];
              for (let i = 0; i < 20; i++) {
                burst.push({id: Math.random(), x: f.x + (Math.random() - 0.5) * 0.5, y: f.y + (Math.random() - 0.5) * 0.5, intensity: 2.0, timestamp: Date.now(), isThreatMarker: true});
              }
              return [...prev, ...burst];
            });
            setTimeout(() => {
              setFiles(files => files.map(neighbor => {
                const dist = Math.sqrt(Math.pow(neighbor.x - f.x, 2) + Math.pow(neighbor.y - f.y, 2));
                if (dist < 2.5 && dist > 0 && !neighbor.detected) {
                  const increase = (2.5 - dist) / 2.5 * 0.6;
                  return { ...neighbor, threatLevel: Math.min(neighbor.threatLevel + increase, 1) };
                }
                return neighbor;
              }));
            }, 0);
          } else if (!f.isThreat) {
            setStats(prev => ({scanned: prev.scanned + 1, threats: prev.threats, efficiency: prev.scanned > 0 ? (prev.threats / (prev.scanned + 1) * 100).toFixed(1) : 0}));
          }
          return newFile;
        }
        return f;
      });
    });
  };

  const fastForwardSimulation = () => {
    const tempFiles = files.map(f => {
      if (f.isThreat && !f.detected) return { ...f, detected: true, scanned: true, scanCount: f.scanCount + 1 };
      if (!f.scanned) return { ...f, scanned: true, scanCount: f.scanCount + 1 };
      return f;
    });
    const malwareCount = tempFiles.filter(f => f.isThreat).length;
    const scannedCount = tempFiles.length;
    setFiles(tempFiles);
    setStats({scanned: scannedCount, threats: malwareCount, efficiency: ((malwareCount / scannedCount) * 100).toFixed(1)});
    setDetectedThreats(tempFiles.filter(f => f.detected).map(f => f.id));
    setIteration(prev => prev + 100);
  };

  const showShortestPath = () => {
    const malwareFiles = files.filter(f => f.detected);
    if (malwareFiles.length === 0) {
      alert('No malware detected yet!');
      return;
    }
    const path = [];
    let remaining = [...malwareFiles];
    let current = remaining.shift();
    path.push(current);
    while (remaining.length > 0) {
      let nearestIndex = 0;
      let nearestDist = Infinity;
      remaining.forEach((f, idx) => {
        const dist = Math.sqrt(Math.pow(f.x - current.x, 2) + Math.pow(f.y - current.y, 2));
        if (dist < nearestDist) {
          nearestDist = dist;
          nearestIndex = idx;
        }
      });
      current = remaining.splice(nearestIndex, 1)[0];
      path.push(current);
    }
    setShortestPath(path);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const cellSize = 60;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    files.forEach(file => {
      ctx.strokeStyle = 'rgba(71, 85, 105, 0.3)';
      ctx.lineWidth = 1;
      ctx.strokeRect(file.x * cellSize, file.y * cellSize, cellSize, cellSize);
    });
    
    if (shortestPath.length > 1) {
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 3;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(shortestPath[0].x * cellSize + cellSize / 2, shortestPath[0].y * cellSize + cellSize / 2);
      for (let i = 1; i < shortestPath.length; i++) {
        ctx.lineTo(shortestPath[i].x * cellSize + cellSize / 2, shortestPath[i].y * cellSize + cellSize / 2);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }
    
    pheromoneTrails.forEach(trail => {
      const x = trail.x * cellSize + cellSize / 2;
      const y = trail.y * cellSize + cellSize / 2;
      const radius = 12 * trail.intensity;
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, `rgba(59, 130, 246, ${trail.intensity * 0.8})`);
      gradient.addColorStop(0.5, `rgba(59, 130, 246, ${trail.intensity * 0.4})`);
      gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    });
    
    files.forEach(file => {
      const x = file.x * cellSize + cellSize / 2;
      const y = file.y * cellSize + cellSize / 2;
      const iconWidth = 28;
      const iconHeight = 24;
      const tabWidth = 12;
      const tabHeight = 6;
      let folderColor, tabColor;
      if (file.detected) {
        folderColor = '#ef4444';
        tabColor = '#dc2626';
      } else if (file.scanned) {
        folderColor = '#22c55e';
        tabColor = '#16a34a';
      } else {
        folderColor = '#fbbf24';
        tabColor = '#f59e0b';
      }
      ctx.fillStyle = tabColor;
      ctx.beginPath();
      ctx.roundRect(x - iconWidth/2, y - iconHeight/2 - 2, tabWidth, tabHeight, [2, 2, 0, 0]);
      ctx.fill();
      ctx.fillStyle = folderColor;
      ctx.beginPath();
      ctx.roundRect(x - iconWidth/2, y - iconHeight/2 + 4, iconWidth, iconHeight - 4, [0, 2, 2, 2]);
      ctx.fill();
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(x - iconWidth/2, y - iconHeight/2 + 4, iconWidth, iconHeight - 4, [0, 2, 2, 2]);
      ctx.stroke();
      if (file.scanCount > 0) {
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(file.scanCount, x, y + 3);
      }
      if (file.detected) {
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(x, y, 18, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 16px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('!', x + 12, y - 8);
      }
    });
    
    ants.forEach(ant => {
      const x = ant.x * cellSize + cellSize / 2;
      const y = ant.y * cellSize + cellSize / 2;
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
      if (ant.targetFile) {
        const target = files.find(f => f.id === ant.targetFile);
        if (target) {
          ctx.strokeStyle = 'rgba(245, 158, 11, 0.3)';
          ctx.lineWidth = 1;
          ctx.setLineDash([3, 3]);
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(target.x * cellSize + cellSize / 2, target.y * cellSize + cellSize / 2);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }
    });
  }, [files, ants, pheromoneTrails, shortestPath]);

  return (
    <div style={{width: '100%'}}>
      <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px'}}>
        <button onClick={() => setIsRunning(!isRunning)} style={{padding: '10px 16px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'}}>
          {isRunning ? <Pause size={20} /> : <Play size={20} />}
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button onClick={initializeFileSystem} style={{padding: '10px 16px', background: '#475569', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'}}>
          <RotateCcw size={20} />
          Reset
        </button>
        <button onClick={fastForwardSimulation} style={{padding: '10px 16px', background: '#22c55e', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'}}>
          <FastForward size={20} />
          Fast Forward
        </button>
        <button onClick={showShortestPath} style={{padding: '10px 16px', background: '#a855f7', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'}}>
          <Route size={20} />
          Shortest Path
        </button>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px'}}>
        <div style={{background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#60a5fa'}}>
            <Activity size={20} />
            <span style={{fontSize: '14px', color: '#94a3b8'}}>Iterations</span>
          </div>
          <div style={{fontSize: '28px', fontWeight: 'bold'}}>{iteration}</div>
        </div>
        <div style={{background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)'}}>
          <div style={{fontSize: '14px', color: '#94a3b8', marginBottom: '8px'}}>Files Scanned</div>
          <div style={{fontSize: '28px', fontWeight: 'bold'}}>{stats.scanned}</div>
        </div>
        <div style={{background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)'}}>
          <div style={{fontSize: '14px', color: '#94a3b8', marginBottom: '8px'}}>Threats Found</div>
          <div style={{fontSize: '28px', fontWeight: 'bold', color: '#ef4444'}}>{stats.threats}</div>
          <div style={{fontSize: '12px', color: '#64748b', marginTop: '4px'}}>Efficiency: {stats.efficiency}%</div>
        </div>
      </div>

      <div style={{background: 'rgba(255,255,255,0.05)', padding: '24px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)'}}>
        <canvas ref={canvasRef} width={480} height={480} style={{display: 'block', margin: '0 auto'}} />
      </div>
    </div>
  );
};

export default ACOAntivirusScanner;
