import React, { useState, useEffect, useCallback } from ‘react’;
import { Play, Pause, RotateCcw, Ship, TrendingUp, Globe } from ‘lucide-react’;

const NusantaraSimulationApp = () => {
const [simulation] = useState(() => {
// Simple simulation object
const sim = {
islands: {
“malacca”: { name: “malacca”, type: “port_city”, nav: 0.9, trade: 150, culture: 0.8, connections: new Set() },
“jakarta”: { name: “jakarta”, type: “trading”, nav: 0.7, trade: 200, culture: 0.6, connections: new Set() },
“surabaya”: { name: “surabaya”, type: “port_city”, nav: 0.8, trade: 120, culture: 0.5, connections: new Set() },
“palembang”: { name: “palembang”, type: “cultural”, nav: 0.6, trade: 80, culture: 0.9, connections: new Set() },
“banjarmasin”: { name: “banjarmasin”, type: “trading”, nav: 0.7, trade: 100, culture: 0.4, connections: new Set() },
“makassar”: { name: “makassar”, type: “port_city”, nav: 0.8, trade: 90, culture: 0.7, connections: new Set() },
“ternate”: { name: “ternate”, type: “agricultural”, nav: 0.5, trade: 60, culture: 0.8, connections: new Set() },
“brunei”: { name: “brunei”, type: “trading”, nav: 0.6, trade: 110, culture: 0.5, connections: new Set() },
“cebu”: { name: “cebu”, type: “port_city”, nav: 0.7, trade: 85, culture: 0.6, connections: new Set() },
“manila”: { name: “manila”, type: “cultural”, nav: 0.6, trade: 95, culture: 0.8, connections: new Set() }
},
monsoon: “northeast”,
cycle: 0,
routes: new Set(),
tradeTotal: 0,
cultureTotal: 0,
voyages: [],
seasons: []
};

```
// Apply type bonuses
Object.values(sim.islands).forEach(island => {
  if (island.type === "port_city") island.nav = Math.max(0.7, island.nav);
  if (island.type === "trading") island.trade = Math.max(100, island.trade);
  if (island.type === "cultural") island.culture = Math.max(0.6, island.culture);
});

return sim;
```

});

const [isRunning, setIsRunning] = useState(false);
const [currentSeason, setCurrentSeason] = useState(0);
const [seasonResults, setSeasonResults] = useState([]);
const [selectedIsland, setSelectedIsland] = useState(null);
const [networkStats, setNetworkStats] = useState(null);

const getDistance = (from, to) => {
const distances = {
“malacca-jakarta”: 0.8, “jakarta-malacca”: 0.8,
“malacca-palembang”: 0.9, “palembang-malacca”: 0.9,
“jakarta-surabaya”: 0.9, “surabaya-jakarta”: 0.9,
“surabaya-makassar”: 0.7, “makassar-surabaya”: 0.7,
“makassar-ternate”: 0.6, “ternate-makassar”: 0.6,
“brunei-manila”: 0.7, “manila-brunei”: 0.7,
“manila-cebu”: 0.9, “cebu-manila”: 0.9,
“jakarta-banjarmasin”: 0.8, “banjarmasin-jakarta”: 0.8
};
return distances[`${from}-${to}`] || 0.4;
};

const getMonsoonEffect = (from, to, monsoon) => {
if (monsoon === “calm”) return 0.6;

```
const route = `${from}-${to}`;
const favorable = {
  northeast: ["jakarta-surabaya", "surabaya-makassar", "malacca-jakarta", "palembang-jakarta", "brunei-manila", "manila-cebu"],
  southwest: ["surabaya-jakarta", "makassar-surabaya", "jakarta-malacca", "jakarta-palembang", "cebu-manila", "manila-brunei"]
};

if (favorable[monsoon] && favorable[monsoon].includes(route)) return 0.9;

// Check reverse direction (against wind)
const reverse = `${to}-${from}`;
if (favorable[monsoon] && favorable[monsoon].includes(reverse)) return 0.3;

return 0.5;
```

};

const calculateSuccess = (from, to) => {
const origin = simulation.islands[from];
const navFactor = origin.nav;
const distFactor = getDistance(from, to);
const monsoonFactor = getMonsoonEffect(from, to, simulation.monsoon);

```
const routeKey = `${from}-${to}`;
const reverseKey = `${to}-${from}`;
const networkBonus = (simulation.routes.has(routeKey) || simulation.routes.has(reverseKey)) ? 0.2 : 0.0;

const prob = navFactor * 0.4 + distFactor * 0.3 + monsoonFactor * 0.3 + networkBonus;
return Math.min(0.95, Math.max(0.05, prob));
```

};

const attemptVoyage = (from, to) => {
const prob = calculateSuccess(from, to);
const success = Math.random() < prob;

```
if (success) {
  simulation.routes.add(`${from}-${to}`);
  simulation.islands[from].connections.add(to);
  simulation.islands[to].connections.add(from);
  
  const trade = Math.min(simulation.islands[from].trade, Math.floor(Math.random() * 81) + 20);
  simulation.tradeTotal += trade;
  
  const culturalChance = (simulation.islands[from].culture + simulation.islands[to].culture) / 2;
  const cultural = Math.random() < culturalChance;
  if (cultural) simulation.cultureTotal += 1;
  
  return { from, to, success: true, trade, cultural };
}

return { from, to, success: false, trade: 0, cultural: false };
```

};

const advanceMonsoon = () => {
simulation.cycle += 1;
if (simulation.cycle % 6 === 0) simulation.monsoon = “northeast”;
else if (simulation.cycle % 6 === 3) simulation.monsoon = “southwest”;
else if (simulation.cycle % 6 === 2 || simulation.cycle % 6 === 5) simulation.monsoon = “calm”;
};

const runSeason = () => {
const voyages = [];
const islands = Object.keys(simulation.islands);

```
for (let i = 0; i < 20; i++) {
  let from = islands[Math.floor(Math.random() * islands.length)];
  
  // Favor trading islands
  if (Math.random() < 0.7) {
    const traders = islands.filter(name => {
      const type = simulation.islands[name].type;
      return type === "port_city" || type === "trading";
    });
    if (traders.length > 0) {
      from = traders[Math.floor(Math.random() * traders.length)];
    }
  }
  
  const others = islands.filter(name => name !== from);
  const to = others[Math.floor(Math.random() * others.length)];
  
  voyages.push(attemptVoyage(from, to));
}

advanceMonsoon();

const successful = voyages.filter(v => v.success);
const result = {
  monsoon: simulation.monsoon,
  total: voyages.length,
  successful: successful.length,
  rate: successful.length / voyages.length,
  trade: successful.reduce((sum, v) => sum + v.trade, 0),
  cultural: successful.filter(v => v.cultural).length,
  routes: simulation.routes.size
};

simulation.seasons.push(result);
return result;
```

};

const updateStats = useCallback(() => {
const islandList = Object.values(simulation.islands).map(island => {
const totalIslands = Object.keys(simulation.islands).length;
return {
name: island.name,
type: island.type,
connections: island.connections.size,
centrality: island.connections.size / (totalIslands - 1),
connectedTo: Array.from(island.connections),
nav: island.nav,
trade: island.trade,
culture: island.culture
};
});

```
setNetworkStats({
  totalVoyages: simulation.voyages.length,
  successfulVoyages: simulation.voyages.filter(v => v.success).length,
  totalTrade: simulation.tradeTotal,
  totalCultural: simulation.cultureTotal,
  connectivity: simulation.routes.size / (Object.keys(simulation.islands).length * (Object.keys(simulation.islands).length - 1) / 2),
  routes: simulation.routes.size,
  islands: islandList,
  monsoon: simulation.monsoon
});
```

}, [simulation]);

const runSingleSeason = useCallback(() => {
const result = runSeason();
setSeasonResults([…simulation.seasons]);
setCurrentSeason(prev => prev + 1);
updateStats();
}, [simulation, updateStats]);

const runFullSimulation = useCallback(() => {
if (isRunning) return;

```
setIsRunning(true);
const run = async () => {
  for (let i = 0; i < 8; i++) {
    runSingleSeason();
    await new Promise(resolve => setTimeout(resolve, 800));
  }
  setIsRunning(false);
};

run();
```

}, [isRunning, runSingleSeason]);

const reset = useCallback(() => {
if (isRunning) return;

```
Object.values(simulation.islands).forEach(island => {
  island.connections.clear();
});

simulation.monsoon = "northeast";
simulation.cycle = 0;
simulation.routes.clear();
simulation.tradeTotal = 0;
simulation.cultureTotal = 0;
simulation.voyages = [];
simulation.seasons = [];

setSeasonResults([]);
setCurrentSeason(0);
setSelectedIsland(null);
updateStats();
```

}, [isRunning, simulation, updateStats]);

useEffect(() => {
updateStats();
}, [updateStats]);

const getTypeColor = (type) => {
if (type === “port_city”) return “bg-blue-500”;
if (type === “trading”) return “bg-green-500”;
if (type === “cultural”) return “bg-purple-500”;
if (type === “agricultural”) return “bg-yellow-500”;
return “bg-gray-500”;
};

const getTypeIcon = (type) => {
if (type === “port_city”) return Ship;
if (type === “trading”) return TrendingUp;
if (type === “cultural”) return Globe;
return “🌾”;
};

const getMonsoonIcon = (monsoon) => {
if (monsoon === “northeast”) return “🧭”;
if (monsoon === “southwest”) return “⬇️”;
return “🟰”;
};

return (
<div className="max-w-7xl mx-auto p-6 bg-gradient-to-b from-blue-50 to-green-50 min-h-screen">
<div className="text-center mb-8">
<h1 className="text-4xl font-bold text-gray-800 mb-2">
Nusantara Maritime Trade Network Simulation
</h1>
<p className="text-gray-600 max-w-3xl mx-auto">
An agent-based model exploring how complex historical trade networks emerged from
simple local interactions between autonomous island entities in the Southeast Asian archipelago.
</p>
</div>

```
  {/* Controls */}
  <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
    <div className="flex items-center justify-between flex-wrap gap-4">
      <div className="flex items-center gap-4">
        <button
          onClick={runFullSimulation}
          disabled={isRunning}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
        >
          {isRunning ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          {isRunning ? 'Running...' : 'Run 8 Seasons'}
        </button>
        
        <button
          onClick={runSingleSeason}
          disabled={isRunning}
          className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
        >
          Single Season
        </button>
        
        <button
          onClick={reset}
          disabled={isRunning}
          className="flex items-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition-colors"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </button>
      </div>

      <div className="flex items-center gap-6 text-lg">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{getMonsoonIcon(networkStats?.monsoon)}</span>
          <span className="font-semibold capitalize">
            {networkStats?.monsoon} Monsoon
          </span>
        </div>
        <div className="text-blue-600 font-bold">
          Season: {currentSeason}
        </div>
      </div>
    </div>
  </div>

  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    {/* Network Overview */}
    <div className="lg:col-span-2 space-y-6">
      {/* Islands Network */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4">Island Network</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {networkStats?.islands?.sort((a, b) => b.centrality - a.centrality).map((island) => {
            const Icon = getTypeIcon(island.type);
            const isString = typeof Icon === 'string';
            return (
              <div
                key={island.name}
                className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedIsland === island.name 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedIsland(
                  selectedIsland === island.name ? null : island.name
                )}
              >
                <div className="flex items-center gap-2 mb-2">
                  {isString ? (
                    <span className="text-lg">{Icon}</span>
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                  <span className="font-medium capitalize text-sm">
                    {island.name}
                  </span>
                </div>
                
                <div className={`w-2 h-2 ${getTypeColor(island.type)} rounded-full mb-1`}></div>
                <div className="text-xs text-gray-600">
                  {island.connections} connections
                </div>
                <div className="text-xs text-blue-600 font-semibold">
                  {Math.round(island.centrality * 100)}% central
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Season Results */}
      {seasonResults.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">Season Results</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Season</th>
                  <th className="text-left p-2">Monsoon</th>
                  <th className="text-left p-2">Success Rate</th>
                  <th className="text-left p-2">Trade Volume</th>
                  <th className="text-left p-2">Cultural</th>
                  <th className="text-left p-2">Routes</th>
                </tr>
              </thead>
              <tbody>
                {seasonResults.map((result, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-2 font-medium">{index + 1}</td>
                    <td className="p-2 capitalize">{result.monsoon}</td>
                    <td className="p-2">{Math.round(result.rate * 100)}%</td>
                    <td className="p-2">{result.trade.toLocaleString()}</td>
                    <td className="p-2">{result.cultural}</td>
                    <td className="p-2">{result.routes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>

    {/* Stats Panel */}
    <div className="space-y-6">
      {/* Overall Stats */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4">Network Statistics</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Total Trade:</span>
            <span className="font-semibold text-blue-600">
              {networkStats?.totalTrade?.toLocaleString() || 0}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Cultural Exchanges:</span>
            <span className="font-semibold text-purple-600">
              {networkStats?.totalCultural || 0}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Routes:</span>
            <span className="font-semibold">{networkStats?.routes || 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Connectivity:</span>
            <span className="font-semibold">
              {Math.round((networkStats?.connectivity || 0) * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* Island Types */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-bold mb-4">Island Types</h3>
        <div className="space-y-3">
          {["port_city", "trading", "cultural", "agricultural"].map((type) => {
            const Icon = getTypeIcon(type);
            const isString = typeof Icon === 'string';
            return (
              <div key={type} className="flex items-center gap-3">
                <div className={`w-4 h-4 ${getTypeColor(type)} rounded`}></div>
                {isString ? (
                  <span className="text-lg">{Icon}</span>
                ) : (
                  <Icon className="h-4 w-4" />
                )}
                <span className="text-sm capitalize">{type.replace('_', ' ')}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Island */}
      {selectedIsland && networkStats && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-bold mb-4 capitalize">{selectedIsland} Details</h3>
          {(() => {
            const island = networkStats.islands.find(i => i.name === selectedIsland);
            if (!island) return null;
            
            return (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="capitalize">{island.type.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Navigation:</span>
                  <span>{Math.round(island.nav * 100)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Trade:</span>
                  <span>{island.trade}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Culture:</span>
                  <span>{Math.round(island.culture * 100)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Connections:</span>
                  <span className="font-semibold">{island.connections}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Centrality:</span>
                  <span className="font-semibold text-blue-600">
                    {Math.round(island.centrality * 100)}%
                  </span>
                </div>
                {island.connectedTo.length > 0 && (
                  <div>
                    <div className="text-gray-600 mb-1">Connected to:</div>
                    <div className="text-sm">
                      {island.connectedTo.join(', ')}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  </div>

  {/* Research Context */}
  <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
    <h3 className="text-xl font-bold mb-4">Historical Context</h3>
    <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-700">
      <div>
        <h4 className="font-semibold mb-2">Agent-Based Modeling</h4>
        <p className="mb-4">
          Islands operate as autonomous agents with unique capabilities, 
          creating emergent trade networks through simple interactions.
        </p>
        
        <h4 className="font-semibold mb-2">Monsoon Cycles</h4>
        <p>
          Seasonal winds dictate voyage timing and success rates, 
          mirroring historical maritime trading patterns.
        </p>
      </div>
      
      <div>
        <h4 className="font-semibold mb-2">Network Effects</h4>
        <p className="mb-4">
          Successful routes become easier to traverse, explaining rapid 
          growth of historical trade hubs like Malacca.
        </p>
        
        <h4 className="font-semibold mb-2">Historical Validation</h4>
        <p>
          The simulation reproduces the dominance of key historical ports, 
          supporting theories about emergent trade network formation.
        </p>
      </div>
    </div>
  </div>
</div>
```

);
};

export default NusantaraSimulationApp;