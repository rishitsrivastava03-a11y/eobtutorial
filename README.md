# Ant Colony Optimization Antivirus Scanner

A React-based interactive visualization of Ant Colony Optimization (ACO) algorithms applied to malware detection. Watch autonomous agents use pheromone trails and collective intelligence to efficiently detect threats across a file system.

## Features

- **Self-organizing Swarm Behavior**: Autonomous agents navigate and adapt to their environment
- **Dynamic Pheromone Trail Formation**: Visual representation of agent communication pathways
- **Emergent Threat Clustering Detection**: Collective detection of malware through multi-agent cooperation
- **Adaptive Resource Allocation**: Agents intelligently allocate effort based on threat levels
- **Real-time Visualization**: Canvas-based rendering with interactive controls
- **Shortest Path Algorithm**: Calculates optimal route through detected threats

## Project Structure

```
aco-antivirus-scanner/
├── src/
│   ├── components/
│   │   └── ACOAntivirusScanner.jsx    # Main simulation component
│   ├── App.jsx                        # Routing and page layouts
│   └── index.jsx                      # React entry point
├── index.html                         # HTML template
├── vite.config.js                     # Vite configuration
├── package.json                       # Dependencies and scripts
└── README.md                          # This file
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/aco-antivirus-scanner.git
cd aco-antivirus-scanner
```

2. Install dependencies:
```bash
npm install
```

## Development

Start the development server:
```bash
npm run dev
```

The application will open in your browser at `http://localhost:3000`

## Build

Create a production build:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## How It Works

### Simulation Components

- **Files**: Grid cells representing the file system (8x8 grid)
- **Ants**: Autonomous agents that search for malware
- **Pheromone Trails**: Chemical markers left by agents to communicate
- **Threats**: Malicious files that agents detect through scanning

### Algorithm Behavior

1. Ants randomly select unscanned files based on threat probability
2. As ants move, they leave pheromone trails
3. When a threat is detected, ants emit intense pheromone bursts
4. Other agents respond to pheromone markers, focusing on high-threat areas
5. The system displays statistics on scanned files and threats detected

### Controls

- **Start/Pause**: Control simulation execution
- **Reset**: Reinitialize the file system and agents
- **Fast Forward**: Rapidly complete the simulation
- **Shortest Path**: Calculate the optimal route through detected threats

## Technologies Used

- **React 18**: UI framework with hooks
- **Vite**: Fast build tool and dev server
- **Canvas API**: Real-time visualization
- **Lucide React**: Icon components

## Statistics

The simulation tracks:
- **Iterations**: Number of simulation steps completed
- **Files Scanned**: Total files inspected by agents
- **Threats Found**: Number of detected malware instances
- **Efficiency**: Detection rate as a percentage

## License

MIT

## Author

Created as an educational project demonstrating swarm intelligence and optimization algorithms.
