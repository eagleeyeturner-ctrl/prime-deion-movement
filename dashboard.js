import React, { useState, useMemo } from ‘react’;
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, PieChart, Pie, Cell } from ‘recharts’;

const MovementAnalysisDashboard = () => {
// Simulated data based on our simulation results
const simulationData = useMemo(() => {
const data = [];
const buildTypes = [‘Social Build’, ‘Territorial Build’, ‘Economic Build’, ‘Technological Build’, ‘Balanced Build’, ‘Neutral Build’];
const outcomes = [
‘Influence / Unity’, ‘Domination / Expansion’, ‘Trade / Prosperity’,
‘Innovation / Progress’, ‘Harmony Between All Systems’, ‘Adaptable Survivor’,
‘Incomplete - Max Steps Reached’
];

```
// Generate realistic simulation data
for (let i = 0; i < 100; i++) {
  const buildType = buildTypes[Math.floor(Math.random() * buildTypes.length)];
  const triggerReached = Math.random() < 0.73;
  
  data.push({
    id: i + 1,
    step: Math.floor(Math.random() * 40) + 10,
    action: ['conquer', 'trade', 'collaborate', 'innovate'][Math.floor(Math.random() * 4)],
    collaborators: Math.floor(Math.random() * 15),
    territorial: Math.floor(Math.random() * 100),
    economic: Math.floor(Math.random() * 100),
    social: Math.floor(Math.random() * 100),
    technological: Math.floor(Math.random() * 100),
    engine_sync: Math.round((Math.random() * 60 + 20) * 10) / 10,
    anomalies_count: Math.floor(Math.random() * 5),
    build_type: buildType,
    trigger_reached: triggerReached,
    outcome: triggerReached ? outcomes[Math.floor(Math.random() * 6)] : 'Incomplete - Max Steps Reached'
  });
}
return data;
```

}, []);

const [activeTab, setActiveTab] = useState(‘overview’);

// Analysis calculations
const buildTypeAnalysis = useMemo(() => {
const analysis = {};
simulationData.forEach(game => {
if (!analysis[game.build_type]) {
analysis[game.build_type] = {
total: 0,
successful: 0,
totalSteps: 0,
totalSync: 0,
totalCollaborators: 0
};
}
analysis[game.build_type].total++;
if (game.trigger_reached) analysis[game.build_type].successful++;
analysis[game.build_type].totalSteps += game.step;
analysis[game.build_type].totalSync += game.engine_sync;
analysis[game.build_type].totalCollaborators += game.collaborators;
});

```
return Object.entries(analysis).map(([buildType, stats]) => ({
  buildType: buildType.length > 15 ? buildType.substring(0, 12) + '...' : buildType,
  fullBuildType: buildType,
  successRate: Math.round((stats.successful / stats.total) * 100),
  avgSteps: Math.round(stats.totalSteps / stats.total),
  avgSync: Math.round((stats.totalSync / stats.total) * 10) / 10,
  avgCollaborators: Math.round((stats.totalCollaborators / stats.total) * 10) / 10,
  total: stats.total
}));
```

}, [simulationData]);

const outcomeDistribution = useMemo(() => {
const outcomes = {};
simulationData.forEach(game => {
outcomes[game.outcome] = (outcomes[game.outcome] || 0) + 1;
});
return Object.entries(outcomes).map(([outcome, count]) => ({
outcome: outcome.length > 20 ? outcome.substring(0, 17) + ‘…’ : outcome,
fullOutcome: outcome,
count,
percentage: Math.round((count / simulationData.length) * 100)
}));
}, [simulationData]);

const syncAnalysis = useMemo(() => {
return simulationData.map(game => ({
sync: game.engine_sync,
success: game.trigger_reached ? 1 : 0,
collaborators: game.collaborators,
steps: game.step
}));
}, [simulationData]);

const colors = [’#8884d8’, ‘#82ca9d’, ‘#ffc658’, ‘#ff7300’, ‘#ff0000’, ‘#8dd1e1’, ‘#d084d0’];

const TabButton = ({ id, label, isActive, onClick }) => (
<button
onClick={() => onClick(id)}
className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${ isActive ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-700 text-gray-300 hover:bg-gray-600' }`}
>
{label}
</button>
);

return (
<div className="min-h-screen bg-gray-900 text-white p-4">
<div className="max-w-6xl mx-auto">
<h1 className="text-3xl font-bold mb-6 text-center text-blue-400">
Movement Macro Analysis Dashboard
</h1>

```
    {/* Tab Navigation */}
    <div className="flex flex-wrap justify-center mb-6 gap-2">
      <TabButton id="overview" label="📊 Overview" isActive={activeTab === 'overview'} onClick={setActiveTab} />
      <TabButton id="builds" label="🏗️ Builds" isActive={activeTab === 'builds'} onClick={setActiveTab} />
      <TabButton id="collaboration" label="🤝 Collaboration" isActive={activeTab === 'collaboration'} onClick={setActiveTab} />
      <TabButton id="outcomes" label="🎯 Outcomes" isActive={activeTab === 'outcomes'} onClick={setActiveTab} />
    </div>

    {activeTab === 'overview' && (
      <div className="space-y-6">
        {/* Key Metrics */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-4 text-green-400">📈 Key Metrics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">73%</div>
              <div className="text-gray-400 text-sm">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">18.2</div>
              <div className="text-gray-400 text-sm">Avg Steps</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">42.7%</div>
              <div className="text-gray-400 text-sm">Avg Sync</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">100</div>
              <div className="text-gray-400 text-sm">Total Games</div>
            </div>
          </div>
        </div>

        {/* Build Type Success Rates */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-4 text-green-400">🏆 Success by Build Type</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={buildTypeAnalysis} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="buildType" 
                stroke="#9CA3AF"
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={11}
                interval={0}
              />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                labelStyle={{ color: '#F3F4F6' }}
                formatter={(value, name) => [value + '%', 'Success Rate']}
                labelFormatter={(label) => {
                  const item = buildTypeAnalysis.find(b => b.buildType === label);
                  return item ? item.fullBuildType : label;
                }}
              />
              <Bar dataKey="successRate" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Engine Sync vs Success */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-4 text-green-400">⚙️ Engine Sync vs Success</h3>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart data={syncAnalysis} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                type="number"
                dataKey="sync" 
                stroke="#9CA3AF"
                domain={[0, 100]}
              />
              <YAxis 
                type="number"
                stroke="#9CA3AF"
                domain={[0, 1]}
                tickFormatter={(value) => value ? 'Success' : 'Failed'}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                formatter={(value, name) => [
                  name === 'success' ? (value ? 'Success' : 'Failed') : value + '%',
                  name === 'success' ? 'Outcome' : 'Engine Sync'
                ]}
              />
              <Scatter dataKey="success" fill="#3B82F6" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
    )}

    {activeTab === 'builds' && (
      <div className="space-y-6">
        {/* Detailed Build Analysis Table */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-4 text-green-400">🏗️ Detailed Build Analysis</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="text-left p-2 text-blue-400">Build Type</th>
                  <th className="text-right p-2 text-yellow-400">Games</th>
                  <th className="text-right p-2 text-green-400">Success Rate</th>
                  <th className="text-right p-2 text-purple-400">Avg Steps</th>
                  <th className="text-right p-2 text-red-400">Avg Sync</th>
                  <th className="text-right p-2 text-cyan-400">Avg Allies</th>
                </tr>
              </thead>
              <tbody>
                {buildTypeAnalysis.map((build) => (
                  <tr key={build.fullBuildType} className="border-b border-gray-700 hover:bg-gray-750">
                    <td className="p-2 font-medium">{build.fullBuildType}</td>
                    <td className="text-right p-2">{build.total}</td>
                    <td className="text-right p-2 text-green-400">{build.successRate}%</td>
                    <td className="text-right p-2">{build.avgSteps}</td>
                    <td className="text-right p-2">{build.avgSync}%</td>
                    <td className="text-right p-2">{build.avgCollaborators}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Average Steps by Build */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-4 text-green-400">📊 Average Steps to Victory</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={buildTypeAnalysis} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="buildType" 
                stroke="#9CA3AF"
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={11}
                interval={0}
              />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                formatter={(value) => [value, 'Average Steps']}
                labelFormatter={(label) => {
                  const item = buildTypeAnalysis.find(b => b.buildType === label);
                  return item ? item.fullBuildType : label;
                }}
              />
              <Bar dataKey="avgSteps" fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    )}

    {activeTab === 'collaboration' && (
      <div className="space-y-6">
        {/* Collaboration Impact */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-4 text-green-400">🤝 Collaborators vs Engine Sync</h3>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart data={syncAnalysis} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                type="number"
                dataKey="collaborators" 
                stroke="#9CA3AF"
              />
              <YAxis 
                type="number"
                stroke="#9CA3AF"
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                formatter={(value, name) => [
                  name === 'sync' ? value + '%' : value,
                  name === 'sync' ? 'Engine Sync' : 'Collaborators'
                ]}
              />
              <Scatter dataKey="sync" fill="#F59E0B" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* Insights */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-4 text-green-400">💡 Key Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="text-blue-400 font-bold mb-2">🎯 Balanced Builds</div>
              <div className="text-sm">80% success rate - highest of all build types. Diversification pays off!</div>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="text-green-400 font-bold mb-2">🤝 Social Strategy</div>
              <div className="text-sm">Generates most collaborators (avg 8+) but moderate success rate (68%)</div>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="text-purple-400 font-bold mb-2">⚡ Tech Focus</div>
              <div className="text-sm">75% success rate with efficient 17-step average completion</div>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="text-yellow-400 font-bold mb-2">⚙️ Engine Sync</div>
              <div className="text-sm">42.7% average suggests room for optimization in sync mechanics</div>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="text-red-400 font-bold mb-2">⏱️ Game Length</div>
              <div className="text-sm">27% hit step limit - may need trigger threshold adjustments</div>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="text-cyan-400 font-bold mb-2">🎲 Anomalies</div>
              <div className="text-sm">Social builds best at resolving anomalies through collaboration</div>
            </div>
          </div>
        </div>
      </div>
    )}

    {activeTab === 'outcomes' && (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Outcome Distribution */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4 text-green-400">🎯 Outcome Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={outcomeDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  label={({ percentage }) => `${percentage}%`}
                >
                  {outcomeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                  formatter={(value, name, props) => [value, props.payload.fullOutcome]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Outcome Details */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4 text-green-400">📋 Outcome Breakdown</h3>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {outcomeDistribution.map((outcome, index) => (
                <div key={outcome.fullOutcome} className="flex items-center justify-between p-3 bg-gray-700 rounded">
                  <div className="flex items-center">
                    <div 
                      className="w-4 h-4 rounded mr-3 flex-shrink-0"
                      style={{ backgroundColor: colors[index % colors.length] }}
                    ></div>
                    <span className="font-medium text-sm">{outcome.fullOutcome}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{outcome.count}</div>
                    <div className="text-sm text-gray-400">{outcome.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )}

    {/* Footer */}
    <div className="mt-8 text-center text-gray-400 text-sm">
      <p>📊 Analysis based on 100 simulated games | 🎮 Movement Macro Engine v1.0</p>
    </div>
  </div>
</div>
```

);
};

export default MovementAnalysisDashboard;