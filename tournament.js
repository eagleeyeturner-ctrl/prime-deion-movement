import React, { useState, useMemo } from ‘react’;
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from ‘recharts’;

const TournamentBracketGenerator = () => {
const [tournamentConfig, setTournamentConfig] = useState({
players: 8,
format: ‘single_elimination’,
scenario: ‘standard’,
rounds: 3
});

const [activeTab, setActiveTab] = useState(‘bracket’);
const [currentRound, setCurrentRound] = useState(1);
const [simulationResults, setSimulationResults] = useState(null);

// Tournament scenarios
const scenarios = {
standard: { name: “Standard Rules”, description: “Balanced gameplay” },
collaborative: { name: “Collaboration Focus”, description: “Social mechanics enhanced” },
competitive: { name: “Competitive Mode”, description: “Individual excellence” },
chaotic: { name: “Chaotic Reality”, description: “High anomaly rate” },
harmony: { name: “Perfect Harmony”, description: “Balance rewarded” }
};

// Player archetypes with different strategy preferences
const playerArchetypes = [
{ name: “The Diplomat”, strategy: “social”, color: “#10B981”, winRate: 0.72 },
{ name: “The Conqueror”, strategy: “territorial”, color: “#EF4444”, winRate: 0.68 },
{ name: “The Merchant”, strategy: “economic”, color: “#F59E0B”, winRate: 0.70 },
{ name: “The Innovator”, strategy: “technological”, color: “#8B5CF6”, winRate: 0.75 },
{ name: “The Strategist”, strategy: “balanced”, color: “#3B82F6”, winRate: 0.80 },
{ name: “The Survivor”, strategy: “adaptive”, color: “#6B7280”, winRate: 0.65 },
{ name: “The Wildcard”, strategy: “chaotic”, color: “#EC4899”, winRate: 0.60 },
{ name: “The Perfectionist”, strategy: “sync_focused”, color: “#14B8A6”, winRate: 0.73 }
];

// Generate initial bracket
const generateBracket = useMemo(() => {
const numPlayers = parseInt(tournamentConfig.players);
const players = [];

```
// Create players with random archetypes
for (let i = 0; i < numPlayers; i++) {
  const archetype = playerArchetypes[i % playerArchetypes.length];
  players.push({
    id: i + 1,
    name: `Player ${i + 1}`,
    archetype: archetype.name,
    strategy: archetype.strategy,
    color: archetype.color,
    winRate: archetype.winRate + (Math.random() - 0.5) * 0.2, // Add some variation
    eliminated: false,
    wins: 0,
    totalGames: 0
  });
}

// Generate bracket structure
const rounds = Math.ceil(Math.log2(numPlayers));
const bracket = [];

for (let round = 1; round <= rounds; round++) {
  const matchesInRound = Math.pow(2, rounds - round);
  const roundMatches = [];
  
  if (round === 1) {
    // First round - pair up all players
    for (let i = 0; i < numPlayers; i += 2) {
      if (i + 1 < numPlayers) {
        roundMatches.push({
          id: `R${round}M${Math.floor(i/2) + 1}`,
          player1: players[i],
          player2: players[i + 1],
          winner: null,
          completed: false,
          score: { p1: 0, p2: 0 }
        });
      }
    }
  } else {
    // Subsequent rounds - winners advance
    for (let i = 0; i < matchesInRound; i++) {
      roundMatches.push({
        id: `R${round}M${i + 1}`,
        player1: null,
        player2: null,
        winner: null,
        completed: false,
        score: { p1: 0, p2: 0 }
      });
    }
  }
  
  bracket.push({
    round,
    name: round === rounds ? "Final" : round === rounds - 1 ? "Semifinal" : `Round ${round}`,
    matches: roundMatches
  });
}

return { players, bracket, rounds };
```

}, [tournamentConfig.players]);

// Simulate a match between two players
const simulateMatch = (player1, player2, scenario) => {
if (!player1 || !player2) return null;

```
// Base win probability from player stats
let p1WinChance = player1.winRate;
let p2WinChance = player2.winRate;

// Scenario modifiers
const scenarioModifiers = {
  collaborative: { social: 0.15, territorial: -0.1, economic: 0, technological: 0, balanced: 0.1 },
  competitive: { social: -0.1, territorial: 0.15, economic: 0.1, technological: 0.1, balanced: -0.05 },
  chaotic: { adaptive: 0.2, chaotic: 0.25, sync_focused: -0.15 },
  harmony: { balanced: 0.2, sync_focused: 0.15 }
};

if (scenarioModifiers[scenario]) {
  const mods = scenarioModifiers[scenario];
  p1WinChance += mods[player1.strategy] || 0;
  p2WinChance += mods[player2.strategy] || 0;
}

// Normalize probabilities
const total = p1WinChance + p2WinChance;
p1WinChance /= total;
p2WinChance /= total;

// Simulate match with some randomness
const random = Math.random();
const winner = random < p1WinChance ? player1 : player2;
const loser = winner === player1 ? player2 : player1;

// Generate match details
const winMargin = Math.random() * 0.3 + 0.1; // 10-40% margin
const steps = Math.floor(Math.random() * 30) + 15; // 15-45 steps
const sync = Math.round((Math.random() * 40 + 30) * 10) / 10; // 30-70% sync

return {
  winner,
  loser,
  winMargin,
  steps,
  sync,
  narrative: generateMatchNarrative(winner, loser, scenario)
};
```

};

const generateMatchNarrative = (winner, loser, scenario) => {
const narratives = {
social: [
`${winner.name} built a coalition that ${loser.name} couldn't counter`,
`Through careful diplomacy, ${winner.name} isolated ${loser.name}'s power base`,
`${winner.name}'s collaborative network proved too strong`
],
territorial: [
`${winner.name} overwhelmed ${loser.name} with rapid expansion`,
`Strategic positioning gave ${winner.name} the decisive advantage`,
`${winner.name}'s territorial dominance was unstoppable`
],
economic: [
`${winner.name}'s economic engine outpaced ${loser.name}'s development`,
`Trade routes established by ${winner.name} strangled ${loser.name}'s growth`,
`${winner.name} achieved prosperity while ${loser.name} struggled`
],
technological: [
`${winner.name}'s innovations made ${loser.name}'s strategy obsolete`,
`Technological superiority gave ${winner.name} the edge`,
`${winner.name}'s breakthrough left ${loser.name} behind`
],
balanced: [
`${winner.name}'s well-rounded approach countered ${loser.name}'s specialization`,
`Perfect balance allowed ${winner.name} to adapt faster than ${loser.name}`,
`${winner.name} harmonized all systems for victory`
]
};

```
const strategyNarratives = narratives[winner.strategy] || [
  `${winner.name} outmaneuvered ${loser.name} in a close match`
];

return strategyNarratives[Math.floor(Math.random() * strategyNarratives.length)];
```

};

// Run full tournament simulation
const simulateTournament = () => {
const { bracket } = generateBracket;
const results = JSON.parse(JSON.stringify(bracket)); // Deep copy

```
// Simulate each round
for (let roundIndex = 0; roundIndex < results.length; roundIndex++) {
  const round = results[roundIndex];
  
  for (let matchIndex = 0; matchIndex < round.matches.length; matchIndex++) {
    const match = round.matches[matchIndex];
    
    if (roundIndex === 0) {
      // First round - players already assigned
      if (match.player1 && match.player2) {
        const result = simulateMatch(match.player1, match.player2, tournamentConfig.scenario);
        match.winner = result.winner;
        match.completed = true;
        match.result = result;
        match.score = result.winMargin > 0.25 ? { p1: result.winner === match.player1 ? 3 : 0, p2: result.winner === match.player2 ? 3 : 0 } :
                     { p1: result.winner === match.player1 ? 2 : 1, p2: result.winner === match.player2 ? 2 : 1 };
      }
    } else {
      // Later rounds - get winners from previous round
      const prevRound = results[roundIndex - 1];
      if (matchIndex * 2 < prevRound.matches.length && matchIndex * 2 + 1 < prevRound.matches.length) {
        match.player1 = prevRound.matches[matchIndex * 2].winner;
        match.player2 = prevRound.matches[matchIndex * 2 + 1].winner;
        
        if (match.player1 && match.player2) {
          const result = simulateMatch(match.player1, match.player2, tournamentConfig.scenario);
          match.winner = result.winner;
          match.completed = true;
          match.result = result;
          match.score = result.winMargin > 0.25 ? { p1: result.winner === match.player1 ? 3 : 0, p2: result.winner === match.player2 ? 3 : 0 } :
                       { p1: result.winner === match.player1 ? 2 : 1, p2: result.winner === match.player2 ? 2 : 1 };
        }
      }
    }
  }
}

// Calculate statistics
const strategyStats = {};
const allMatches = results.flatMap(round => round.matches.filter(m => m.completed));

allMatches.forEach(match => {
  if (match.winner) {
    const strategy = match.winner.strategy;
    if (!strategyStats[strategy]) {
      strategyStats[strategy] = { wins: 0, total: 0 };
    }
    strategyStats[strategy].wins++;
  }
  
  [match.player1, match.player2].forEach(player => {
    if (player) {
      const strategy = player.strategy;
      if (!strategyStats[strategy]) {
        strategyStats[strategy] = { wins: 0, total: 0 };
      }
      strategyStats[strategy].total++;
    }
  });
});

const strategyPerformance = Object.entries(strategyStats).map(([strategy, stats]) => ({
  strategy: strategy.charAt(0).toUpperCase() + strategy.slice(1).replace('_', ' '),
  winRate: Math.round((stats.wins / stats.total) * 100),
  wins: stats.wins,
  total: stats.total
}));

setSimulationResults({
  bracket: results,
  champion: results[results.length - 1].matches[0].winner,
  strategyPerformance,
  totalMatches: allMatches.length
});
```

};

const TabButton = ({ id, label, isActive, onClick }) => (
<button
onClick={() => onClick(id)}
className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${ isActive ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-700 text-gray-300 hover:bg-gray-600' }`}
>
{label}
</button>
);

const MatchCard = ({ match, roundName }) => (
<div className="bg-gray-700 p-4 rounded-lg mb-4">
<h4 className="font-semibold text-blue-400 mb-2">{match.id}</h4>
<div className="space-y-2">
<div className="flex justify-between items-center">
<div className="flex items-center">
<div
className=“w-3 h-3 rounded-full mr-2”
style={{ backgroundColor: match.player1?.color }}
></div>
<span className={match.winner === match.player1 ? ‘font-bold text-green-400’ : ‘’}>
{match.player1?.name || ‘TBD’}
</span>
<span className="text-xs text-gray-400 ml-2">
({match.player1?.archetype})
</span>
</div>
<span className="font-mono">{match.completed ? match.score.p1 : ‘-’}</span>
</div>
<div className="flex justify-between items-center">
<div className="flex items-center">
<div
className=“w-3 h-3 rounded-full mr-2”
style={{ backgroundColor: match.player2?.color }}
></div>
<span className={match.winner === match.player2 ? ‘font-bold text-green-400’ : ‘’}>
{match.player2?.name || ‘TBD’}
</span>
<span className="text-xs text-gray-400 ml-2">
({match.player2?.archetype})
</span>
</div>
<span className="font-mono">{match.completed ? match.score.p2 : ‘-’}</span>
</div>
{match.completed && match.result && (
<div className="mt-2 p-2 bg-gray-800 rounded text-xs">
<div className="text-yellow-400 font-medium">Match Summary:</div>
<div>• {match.result.narrative}</div>
<div>• Duration: {match.result.steps} steps</div>
<div>• Engine Sync: {match.result.sync}%</div>
</div>
)}
</div>
</div>
);

const colors = [’#8884d8’, ‘#82ca9d’, ‘#ffc658’, ‘#ff7300’, ‘#ff0000’, ‘#8dd1e1’, ‘#d084d0’, ‘#ffb347’];

return (
<div className="min-h-screen bg-gray-900 text-white p-4">
<div className="max-w-7xl mx-auto">
<h1 className="text-3xl font-bold mb-6 text-center text-blue-400">
🏆 Movement Macro Tournament System
</h1>

```
    {/* Tournament Configuration */}
    <div className="bg-gray-800 p-6 rounded-lg mb-6">
      <h3 className="text-xl font-bold mb-4 text-green-400">⚙️ Tournament Setup</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Players</label>
          <select 
            value={tournamentConfig.players}
            onChange={(e) => setTournamentConfig(prev => ({ ...prev, players: parseInt(e.target.value) }))}
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
          >
            <option value={4}>4 Players</option>
            <option value={8}>8 Players</option>
            <option value={16}>16 Players</option>
            <option value={32}>32 Players</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Format</label>
          <select 
            value={tournamentConfig.format}
            onChange={(e) => setTournamentConfig(prev => ({ ...prev, format: e.target.value }))}
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
          >
            <option value="single_elimination">Single Elimination</option>
            <option value="double_elimination">Double Elimination</option>
            <option value="round_robin">Round Robin</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Scenario</label>
          <select 
            value={tournamentConfig.scenario}
            onChange={(e) => setTournamentConfig(prev => ({ ...prev, scenario: e.target.value }))}
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
          >
            {Object.entries(scenarios).map(([key, scenario]) => (
              <option key={key} value={key}>{scenario.name}</option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <button
            onClick={simulateTournament}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            🎲 Simulate Tournament
          </button>
        </div>
      </div>
    </div>

    {/* Tab Navigation */}
    <div className="flex flex-wrap justify-center mb-6 gap-2">
      <TabButton id="bracket" label="🏆 Bracket" isActive={activeTab === 'bracket'} onClick={setActiveTab} />
      <TabButton id="players" label="👥 Players" isActive={activeTab === 'players'} onClick={setActiveTab} />
      <TabButton id="results" label="📊 Results" isActive={activeTab === 'results'} onClick={setActiveTab} />
      <TabButton id="analysis" label="📈 Analysis" isActive={activeTab === 'analysis'} onClick={setActiveTab} />
    </div>

    {activeTab === 'bracket' && simulationResults && (
      <div className="space-y-6">
        {/* Champion Display */}
        {simulationResults.champion && (
          <div className="bg-gradient-to-r from-yellow-600 to-yellow-800 p-6 rounded-lg text-center">
            <h2 className="text-3xl font-bold mb-2">🏆 Tournament Champion</h2>
            <div className="text-xl">
              <span className="font-bold">{simulationResults.champion.name}</span>
              <span className="text-yellow-200 ml-2">({simulationResults.champion.archetype})</span>
            </div>
            <div className="text-sm mt-2 text-yellow-200">
              Strategy: {simulationResults.champion.strategy.charAt(0).toUpperCase() + simulationResults.champion.strategy.slice(1).replace('_', ' ')}
            </div>
          </div>
        )}

        {/* Bracket Rounds */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {simulationResults.bracket.map(round => (
            <div key={round.round} className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4 text-green-400">{round.name}</h3>
              {round.matches.map(match => (
                <MatchCard key={match.id} match={match} roundName={round.name} />
              ))}
            </div>
          ))}
        </div>
      </div>
    )}

    {activeTab === 'players' && (
      <div className="space-y-6">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-4 text-green-400">👥 Player Archetypes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {playerArchetypes.map(archetype => (
              <div key={archetype.name} className="bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <div 
                    className="w-4 h-4 rounded-full mr-2"
                    style={{ backgroundColor: archetype.color }}
                  ></div>
                  <h4 className="font-semibold">{archetype.name}</h4>
                </div>
                <div className="text-sm space-y-1">
                  <div>Strategy: <span className="text-blue-400">{archetype.strategy.replace('_', ' ')}</span></div>
                  <div>Base Win Rate: <span className="text-green-400">{Math.round(archetype.winRate * 100)}%</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-4 text-green-400">🎯 Strategy Matchups</h3>
          <div className="text-sm space-y-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-blue-400 mb-2">Strong Against:</h4>
                <ul className="space-y-1">
                  <li>• Balanced builds counter specialists</li>
                  <li>• Social builds excel in collaborative scenarios</li>
                  <li>• Tech builds dominate in harmony scenarios</li>
                  <li>• Territorial builds thrive in competitive mode</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-red-400 mb-2">Vulnerable To:</h4>
                <ul className="space-y-1">
                  <li>• Specialists struggle against balanced builds</li>
                  <li>• Chaotic builds suffer in harmony scenarios</li>
                  <li>• Social builds lose in competitive mode</li>
                  <li>• Sync-focused builds fail in chaotic scenarios</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    )}

    {activeTab === 'results' && simulationResults && (
      <div className="space-y-6">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-4 text-green-400">📊 Strategy Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={simulationResults.strategyPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="strategy" stroke="#9CA3AF" fontSize={11} />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                formatter={(value, name) => [value + '%', 'Win Rate']}
              />
              <Bar dataKey="winRate" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4 text-green-400">🏆 Tournament Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Total Matches:</span>
                <span className="font-bold">{simulationResults.totalMatches}</span>
              </div>
              <div className="flex justify-between">
                <span>Champion Strategy:</span>
                <span className="font-bold text-blue-400">
                  {simulationResults.champion.strategy.charAt(0).toUpperCase() + simulationResults.champion.strategy.slice(1).replace('_', ' ')}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Scenario:</span>
                <span className="font-bold text-purple-400">{scenarios[tournamentConfig.scenario].name}</span>
              </div>
              <div className="flex justify-between">
                <span>Players:</span>
                <span className="font-bold">{tournamentConfig.players}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4 text-green-400">🎯 Key Insights</h3>
            <div className="text-sm space-y-2">
              {simulationResults.strategyPerformance.map((strategy, index) => (
                <div key={strategy.strategy} className="flex justify-between">
                  <span>{strategy.strategy}:</span>
                  <span className={strategy.winRate > 60 ? 'text-green-400' : strategy.winRate < 40 ? 'text-red-400' : 'text-yellow-400'}>
                    {strategy.wins}/{strategy.total} ({strategy.winRate}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )}

    {activeTab === 'analysis' && simulationResults && (
      <div className="space-y-6">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-4 text-green-400">📈 Tournament Analysis</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-blue-400 mb-3">Strategy Distribution</h4>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={simulationResults.strategyPerformance}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="total"
                    label={({ strategy, total }) => `${strategy}: ${total}`}
                  >
                    {simulationResults.strategyPerformance.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                    formatter={(value, name) => [value, 'Players']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div>
              <h4 className="font-semibold text-blue-400 mb-3">Balance Assessment</h4>
              <div className="space-y-3">
                {simulationResults.strategyPerformance.map(strategy => {
                  const winRate = strategy.winRate;
                  const balance = winRate >= 40 && winRate <= 70 ? 'Balanced' : 
                                 winRate > 70 ? 'Overpowered' : 'Underpowered';
                  const color = balance === 'Balanced' ? 'text-green-400' : 
                               balance === 'Overpowered' ? 'text-red-400' : 'text-yellow-400';
                  
                  return (
                    <div key={strategy.strategy} className="flex justify-between items-center p-2 bg-gray-700 rounded">
                      <span className="font-medium">{strategy.strategy}</span>
                      <span className={color}>{balance}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-4 text-green-400">🛠️ Balancing Recommendations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-blue-400 mb-2">Suggested Adjustments</h4>
              <div className="text-sm space-y-2">
                {simulationResults.strategyPerformance.map(strategy => {
                  if (strategy.winRate > 70) {
                    return (
                      <div key={strategy.strategy} className="p-2 bg-red-900 rounded">
                        <strong>{strategy.strategy}:</strong> Reduce trigger bonuses or increase thresholds
                      </div>
                    );
                  } else if (strategy.winRate < 40) {
                    return (
                      <div key={strategy.strategy} className="p-2 bg-yellow-900 rounded">
                        <strong>{strategy.strategy}:</strong> Lower victory thresholds or add scenario bonuses
                      </div>
                    );
                  }
                  return null;
                }).filter(Boolean)}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-blue-400 mb-2">Scenario Impact</h4>
              <div className="text-sm">
                <div className="p-3 bg-gray-700 rounded">
                  <strong>Current Scenario:</strong> {scenarios[tournamentConfig.scenario].name}
                  <br />
                  <span className="text-gray-300">{scenarios[tournamentConfig.scenario].description}</span>
                </div>
                <div className="mt-3 p-3 bg-gray-700 rounded">
                  <strong>Insight:</strong> Based on the selected scenario, certain strategies gain advantages.
                  Adjust archetype bonuses accordingly for better balance.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
</div>
);
};

export default TournamentBracketGenerator;
```