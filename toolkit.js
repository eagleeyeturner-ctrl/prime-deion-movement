import React, { useState, useMemo } from ‘react’;
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from ‘recharts’;

const MovementMacroToolkit = () => {
// Game configuration state
const [gameConfig, setGameConfig] = useState({
territorialTrigger: 90,
economicTrigger: 90,
socialTrigger: 80,
techTrigger: 90,
balancedTrigger: 70,
maxSteps: 50,
anomalyChance: 0.15,
collaborationBonus: 5,
socialActionBonus: 15,
engineSyncWeight: 1.0
});

const [selectedScenario, setSelectedScenario] = useState(‘standard’);
const [activeTab, setActiveTab] = useState(‘balancer’);

// Pre-defined scenarios
const scenarios = {
standard: {
name: “Standard Game”,
description: “Default balanced gameplay”,
config: gameConfig
},
collaborative: {
name: “Collaboration Focus”,
description: “Enhanced social mechanics”,
config: {
…gameConfig,
socialTrigger: 70,
collaborationBonus: 10,
socialActionBonus: 20,
anomalyChance: 0.20
}
},
competitive: {
name: “Competitive Mode”,
description: “Individual excellence rewarded”,
config: {
…gameConfig,
territorialTrigger: 85,
economicTrigger: 85,
techTrigger: 85,
collaborationBonus: 2,
socialActionBonus: 8
}
},
chaotic: {
name: “Chaotic Reality”,
description: “High anomaly, unpredictable outcomes”,
config: {
…gameConfig,
anomalyChance: 0.30,
maxSteps: 30,
engineSyncWeight: 0.7
}
},
harmony: {
name: “Perfect Harmony”,
description: “Balance and sync focused”,
config: {
…gameConfig,
balancedTrigger: 60,
engineSyncWeight: 1.5,
anomalyChance: 0.05
}
}
};

// Calculate predicted outcomes based on config
const predictedOutcomes = useMemo(() => {
const config = scenarios[selectedScenario].config;

```
// Simple prediction model based on trigger thresholds
const difficulty = {
  territorial: (100 - config.territorialTrigger) / 100,
  economic: (100 - config.economicTrigger) / 100,
  social: (100 - config.socialTrigger) / 100,
  technological: (100 - config.techTrigger) / 100,
  balanced: (100 - config.balancedTrigger) / 100
};

const successRates = Object.entries(difficulty).map(([build, rate]) => ({
  buildType: build.charAt(0).toUpperCase() + build.slice(1),
  predictedSuccess: Math.round(rate * 100),
  currentSuccess: Math.round(rate * 100 * (1 + config.collaborationBonus / 20)),
  gameLength: Math.round(config.maxSteps * (1 - rate * 0.5))
}));

return successRates;
```

}, [selectedScenario]);

// Build comparison data
const buildComparison = useMemo(() => {
return [
{
build: ‘Territorial’,
power: 85,
speed: 70,
collaboration: 30,
adaptability: 60,
synergy: 50
},
{
build: ‘Economic’,
power: 70,
speed: 80,
collaboration: 50,
adaptability: 75,
synergy: 65
},
{
build: ‘Social’,
power: 60,
speed: 50,
collaboration: 95,
adaptability: 80,
synergy: 85
},
{
build: ‘Technological’,
power: 90,
speed: 85,
collaboration: 40,
adaptability: 70,
synergy: 75
},
{
build: ‘Balanced’,
power: 75,
speed: 70,
collaboration: 70,
adaptability: 85,
synergy: 90
}
];
}, []);

const handleConfigChange = (key, value) => {
setGameConfig(prev => ({
…prev,
[key]: parseFloat(value) || parseInt(value) || 0
}));
};

const TabButton = ({ id, label, isActive, onClick }) => (
<button
onClick={() => onClick(id)}
className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${ isActive ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-700 text-gray-300 hover:bg-gray-600' }`}
>
{label}
</button>
);

const ConfigSlider = ({ label, value, min, max, step, unit, onChange, description }) => (
<div className="mb-4">
<div className="flex justify-between items-center mb-2">
<label className="text-sm font-medium text-gray-300">{label}</label>
<span className="text-blue-400 font-mono">{value}{unit}</span>
</div>
<input
type=“range”
min={min}
max={max}
step={step}
value={value}
onChange={(e) => onChange(e.target.value)}
className=“w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider”
/>
{description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
</div>
);

return (
<div className="min-h-screen bg-gray-900 text-white p-4">
<div className="max-w-7xl mx-auto">
<h1 className="text-3xl font-bold mb-6 text-center text-blue-400">
🛠️ Movement Macro Development Toolkit
</h1>

```
    {/* Tab Navigation */}
    <div className="flex flex-wrap justify-center mb-6 gap-2">
      <TabButton id="balancer" label="⚖️ Game Balancer" isActive={activeTab === 'balancer'} onClick={setActiveTab} />
      <TabButton id="scenarios" label="🎭 Scenarios" isActive={activeTab === 'scenarios'} onClick={setActiveTab} />
      <TabButton id="builds" label="🏗️ Build Comparison" isActive={activeTab === 'builds'} onClick={setActiveTab} />
      <TabButton id="generator" label="🎲 Content Generator" isActive={activeTab === 'generator'} onClick={setActiveTab} />
    </div>

    {activeTab === 'balancer' && (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration Panel */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-4 text-green-400">⚙️ Game Configuration</h3>
          
          <div className="space-y-4">
            <h4 className="font-semibold text-blue-400 border-b border-gray-600 pb-2">Victory Triggers</h4>
            <ConfigSlider
              label="Territorial Trigger"
              value={gameConfig.territorialTrigger}
              min={70}
              max={100}
              step={5}
              unit=""
              onChange={(val) => handleConfigChange('territorialTrigger', val)}
              description="Stat threshold for territorial victory"
            />
            <ConfigSlider
              label="Economic Trigger"
              value={gameConfig.economicTrigger}
              min={70}
              max={100}
              step={5}
              unit=""
              onChange={(val) => handleConfigChange('economicTrigger', val)}
            />
            <ConfigSlider
              label="Social Trigger"
              value={gameConfig.socialTrigger}
              min={60}
              max={90}
              step={5}
              unit=""
              onChange={(val) => handleConfigChange('socialTrigger', val)}
              description="Lower threshold encourages collaboration"
            />
            <ConfigSlider
              label="Tech Trigger"
              value={gameConfig.techTrigger}
              min={70}
              max={100}
              step={5}
              unit=""
              onChange={(val) => handleConfigChange('techTrigger', val)}
            />
            
            <h4 className="font-semibold text-blue-400 border-b border-gray-600 pb-2 mt-6">Game Mechanics</h4>
            <ConfigSlider
              label="Max Game Steps"
              value={gameConfig.maxSteps}
              min={20}
              max={100}
              step={5}
              unit=""
              onChange={(val) => handleConfigChange('maxSteps', val)}
            />
            <ConfigSlider
              label="Anomaly Chance"
              value={gameConfig.anomalyChance}
              min={0.05}
              max={0.50}
              step={0.05}
              unit=""
              onChange={(val) => handleConfigChange('anomalyChance', val)}
              description="Probability of anomaly per turn"
            />
            <ConfigSlider
              label="Collaboration Bonus"
              value={gameConfig.collaborationBonus}
              min={1}
              max={15}
              step={1}
              unit=""
              onChange={(val) => handleConfigChange('collaborationBonus', val)}
            />
          </div>
        </div>

        {/* Predicted Outcomes */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-4 text-green-400">📊 Predicted Impact</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={predictedOutcomes} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="buildType" stroke="#9CA3AF" fontSize={12} />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                formatter={(value, name) => [value + '%', name === 'predictedSuccess' ? 'Success Rate' : 'Game Length']}
              />
              <Bar dataKey="predictedSuccess" fill="#10B981" name="Predicted Success" />
            </BarChart>
          </ResponsiveContainer>
          
          <div className="mt-4 p-4 bg-gray-700 rounded">
            <h4 className="font-semibold text-yellow-400 mb-2">⚠️ Balance Warnings</h4>
            <ul className="text-sm space-y-1">
              {gameConfig.socialTrigger < 70 && (
                <li className="text-green-400">✓ Social builds highly favored - good for collaboration</li>
              )}
              {gameConfig.anomalyChance > 0.25 && (
                <li className="text-red-400">⚠ High anomaly rate may frustrate players</li>
              )}
              {Math.max(gameConfig.territorialTrigger, gameConfig.economicTrigger, gameConfig.techTrigger) - gameConfig.socialTrigger > 20 && (
                <li className="text-yellow-400">⚠ Large trigger gaps may create imbalance</li>
              )}
              {gameConfig.maxSteps < 30 && (
                <li className="text-orange-400">⚠ Short games may not allow full strategy development</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    )}

    {activeTab === 'scenarios' && (
      <div className="space-y-6">
        {/* Scenario Selector */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-4 text-green-400">🎭 Predefined Scenarios</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(scenarios).map(([key, scenario]) => (
              <div 
                key={key}
                className={`p-4 rounded-lg cursor-pointer transition-all ${
                  selectedScenario === key 
                    ? 'bg-blue-600 ring-2 ring-blue-400' 
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
                onClick={() => setSelectedScenario(key)}
              >
                <h4 className="font-bold text-lg mb-2">{scenario.name}</h4>
                <p className="text-sm text-gray-300 mb-3">{scenario.description}</p>
                <div className="text-xs space-y-1">
                  <div>Social Trigger: {scenario.config.socialTrigger}</div>
                  <div>Anomaly Rate: {Math.round(scenario.config.anomalyChance * 100)}%</div>
                  <div>Max Steps: {scenario.config.maxSteps}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scenario Analysis */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-4 text-green-400">
            📈 Analysis: {scenarios[selectedScenario].name}
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-blue-400 mb-3">Expected Success Rates</h4>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={predictedOutcomes}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="buildType" stroke="#9CA3AF" fontSize={11} />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                    formatter={(value) => [value + '%', 'Success Rate']}
                  />
                  <Bar dataKey="predictedSuccess" fill="#8B5CF6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-blue-400">Scenario Characteristics</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Game Pace:</span>
                  <span className={scenarios[selectedScenario].config.maxSteps < 40 ? 'text-red-400' : 'text-green-400'}>
                    {scenarios[selectedScenario].config.maxSteps < 40 ? 'Fast' : 'Standard'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Collaboration Focus:</span>
                  <span className={scenarios[selectedScenario].config.collaborationBonus > 7 ? 'text-green-400' : 'text-yellow-400'}>
                    {scenarios[selectedScenario].config.collaborationBonus > 7 ? 'High' : 'Medium'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Unpredictability:</span>
                  <span className={scenarios[selectedScenario].config.anomalyChance > 0.2 ? 'text-red-400' : 'text-green-400'}>
                    {scenarios[selectedScenario].config.anomalyChance > 0.2 ? 'High' : 'Low'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Balance Preference:</span>
                  <span className={scenarios[selectedScenario].config.balancedTrigger < 70 ? 'text-blue-400' : 'text-yellow-400'}>
                    {scenarios[selectedScenario].config.balancedTrigger < 70 ? 'Favored' : 'Standard'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )}

    {activeTab === 'builds' && (
      <div className="space-y-6">
        {/* Build Radar Comparison */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-4 text-green-400">🏗️ Build Strategy Comparison</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={buildComparison}>
                  <PolarGrid stroke="#374151" />
                  <PolarAngleAxis dataKey="build" stroke="#9CA3AF" fontSize={12} />
                  <PolarRadiusAxis 
                    angle={0} 
                    domain={[0, 100]} 
                    tick={false}
                    stroke="#6B7280"
                  />
                  <Radar dataKey="power" stroke="#EF4444" fill="#EF4444" fillOpacity={0.1} name="Power" />
                  <Radar dataKey="speed" stroke="#10B981" fill="#10B981" fillOpacity={0.1} name="Speed" />
                  <Radar dataKey="collaboration" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.1} name="Collaboration" />
                  <Radar dataKey="adaptability" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.1} name="Adaptability" />
                  <Radar dataKey="synergy" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.1} name="Synergy" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-blue-400">Build Archetypes</h4>
              {buildComparison.map((build, index) => (
                <div key={build.build} className="p-3 bg-gray-700 rounded">
                  <h5 className="font-medium text-white mb-2">{build.build} Build</h5>
                  <div className="text-xs space-y-1">
                    <div className="flex justify-between">
                      <span>Strengths:</span>
                      <span className="text-green-400">
                        {build.power > 80 && 'Power '}
                        {build.speed > 80 && 'Speed '}
                        {build.collaboration > 80 && 'Collaboration '}
                        {build.adaptability > 80 && 'Adaptability '}
                        {build.synergy > 80 && 'Synergy'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Overall Rating:</span>
                      <span className="text-blue-400">
                        {Math.round((build.power + build.speed + build.collaboration + build.adaptability + build.synergy) / 5)}/100
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )}

    {activeTab === 'generator' && (
      <div className="space-y-6">
        {/* Content Generator */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-4 text-green-400">🎲 Procedural Content Generator</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-blue-400 mb-3">Random Events</h4>
              <div className="space-y-2 text-sm">
                <div className="p-3 bg-gray-700 rounded">
                  <strong>Territorial Crisis:</strong> Border tensions force immediate expansion or diplomacy.
                  <div className="text-blue-400 mt-1">Effect: +15 Territorial or +10 Social</div>
                </div>
                <div className="p-3 bg-gray-700 rounded">
                  <strong>Economic Boom:</strong> Market conditions favor rapid growth.
                  <div className="text-green-400 mt-1">Effect: +20 Economic, -5 Social</div>
                </div>
                <div className="p-3 bg-gray-700 rounded">
                  <strong>Tech Breakthrough:</strong> Innovation unlocks new possibilities.
                  <div className="text-purple-400 mt-1">Effect: +25 Tech, +10 Engine Sync</div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-blue-400 mb-3">Victory Narratives</h4>
              <div className="space-y-2 text-sm">
                <div className="p-3 bg-gray-700 rounded">
                  <strong>Unity Through Diversity:</strong> Your collaborative approach has created an unprecedented alliance of worlds, each contributing their unique strengths to a greater whole.
                </div>
                <div className="p-3 bg-gray-700 rounded">
                  <strong>The Quiet Revolution:</strong> While others fought for territory, you built networks. Your influence now spans galaxies through trust, not force.
                </div>
                <div className="p-3 bg-gray-700 rounded">
                  <strong>Harmonic Convergence:</strong> Perfect balance achieved. All systems in sync. Reality itself bends to your unified vision.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Export Configuration */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-4 text-green-400">💾 Export Game Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-blue-400 mb-2">Current Configuration</h4>
              <pre className="bg-gray-900 p-3 rounded text-xs overflow-x-auto">
```

{JSON.stringify(scenarios[selectedScenario].config, null, 2)}
</pre>
</div>
<div>
<h4 className="font-semibold text-blue-400 mb-2">Implementation Notes</h4>
<div className="text-sm space-y-2">
<div>✅ Trigger thresholds set for balanced gameplay</div>
<div>✅ Collaboration mechanics tuned for social engagement</div>
<div>✅ Anomaly system provides controlled chaos</div>
<div>✅ Engine sync promotes strategic thinking</div>
<div className="mt-3 p-3 bg-blue-900 rounded">
<strong>Recommended:</strong> Test with small groups before implementing major changes. Monitor completion rates and player feedback.
</div>
</div>
</div>
</div>
</div>
</div>
)}

```
    {/* Footer */}
    <div className="mt-8 text-center text-gray-400 text-sm">
      <p>🛠️ Movement Macro Development Toolkit | Balance, Test, and Iterate</p>
    </div>
  </div>
</div>
```

);
};

export default MovementMacroToolkit;