“””
Nusantara Maritime Movement System

A distributed archipelagic movement system based on maritime Southeast Asian
navigation patterns, monsoon cycles, and inter-island synchronization networks.
“””

from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from enum import Enum, auto
from typing import Dict, List, Set, Optional, Tuple, Union
import math
import random
from datetime import datetime, timedelta

class MonsoonPhase(Enum):
“”“Monsoon cycle phases affecting inter-island movement.”””
NORTHEAST_MONSOON = “northeast”  # Oct-Mar
SOUTHWEST_MONSOON = “southwest”  # Apr-Sep
TRANSITION_PERIOD = “transition”  # Brief periods between monsoons

class IslandSpecialization(Enum):
“”“Island specialization types in the Nusantara network.”””
MARITIME_HUB = “maritime_hub”      # Strategic ports, navigation centers
SPICE_PRODUCER = “spice_producer”  # Agricultural/resource islands
CULTURAL_NODE = “cultural_node”    # Religious, educational centers
TECH_ENTREPOT = “tech_entrepot”    # Trade technology, innovation hubs

class NetworkState(Enum):
“”“Network-wide synchronization states.”””
FRAGMENTED = auto()    # Islands operating independently
CONNECTING = auto()    # Establishing inter-island links
SYNCHRONIZED = auto()  # Full network coherence
DISRUPTED = auto()     # External interference/natural disasters
TRANSCENDENT = auto()  # Beyond normal operational parameters

@dataclass(frozen=True)
class NavigationResult:
“”“Result of inter-island navigation attempt.”””
success: bool
origin_island: str
destination_island: str
route_taken: str
monsoon_favorable: bool
cultural_exchange: Dict[str, int] = field(default_factory=dict)
trade_volume: int = 0
knowledge_transferred: List[str] = field(default_factory=list)
network_effects: List[str] = field(default_factory=list)

@dataclass(frozen=True)
class IslandState:
“”“Current state of an individual island node.”””
name: str
specialization: IslandSpecialization
autonomy_level: float  # 0.0 to 1.0
network_connectivity: float  # 0.0 to 1.0
cultural_resonance: Dict[str, float] = field(default_factory=dict)
resource_capacity: int = 100
innovation_index: float = 0.0

class MonsoonCalculator:
“”“Handles monsoon cycle calculations and navigation favorability.”””

```
def __init__(self, current_phase: MonsoonPhase = MonsoonPhase.NORTHEAST_MONSOON):
    self.current_phase = current_phase
    self._phase_duration = 180  # days per phase
    self._day_counter = 0

def advance_cycle(self, days: int = 1) -> None:
    """Advance the monsoon cycle."""
    self._day_counter += days
    if self._day_counter >= self._phase_duration:
        self._day_counter = 0
        self._transition_phase()

def _transition_phase(self) -> None:
    """Transition to next monsoon phase."""
    transitions = {
        MonsoonPhase.NORTHEAST_MONSOON: MonsoonPhase.TRANSITION_PERIOD,
        MonsoonPhase.TRANSITION_PERIOD: MonsoonPhase.SOUTHWEST_MONSOON,
        MonsoonPhase.SOUTHWEST_MONSOON: MonsoonPhase.TRANSITION_PERIOD,
    }
    self.current_phase = transitions.get(self.current_phase, MonsoonPhase.NORTHEAST_MONSOON)

def is_navigation_favorable(self, origin: str, destination: str) -> Tuple[bool, float]:
    """Determine if current monsoon favors navigation between islands."""
    # Simplified model: certain routes favored by certain monsoons
    route_favorability = {
        MonsoonPhase.NORTHEAST_MONSOON: {
            ("java", "sumatra"): 0.8,
            ("borneo", "sulawesi"): 0.9,
            ("mindanao", "visayas"): 0.7,
        },
        MonsoonPhase.SOUTHWEST_MONSOON: {
            ("sumatra", "java"): 0.8,
            ("sulawesi", "borneo"): 0.9,
            ("visayas", "mindanao"): 0.7,
        },
        MonsoonPhase.TRANSITION_PERIOD: {}  # No particular favorability
    }
    
    route_key = (origin.lower(), destination.lower())
    reverse_key = (destination.lower(), origin.lower())
    
    favorability = route_favorability.get(self.current_phase, {})
    factor = favorability.get(route_key, favorability.get(reverse_key, 0.5))
    
    return factor > 0.6, factor
```

class NetworkSyncCalculator:
“”“Calculates network-wide synchronization metrics.”””

```
SYNC_THRESHOLD = 0.75
DISRUPTION_THRESHOLD = 0.3
TRANSCENDENCE_THRESHOLD = 0.95

@classmethod
def calculate_network_coherence(cls, islands: Dict[str, IslandState]) -> float:
    """Calculate overall network coherence based on island connectivity."""
    if not islands:
        return 0.0
    
    total_connectivity = sum(island.network_connectivity for island in islands.values())
    avg_connectivity = total_connectivity / len(islands)
    
    # Factor in cultural resonance alignment
    cultural_alignment = cls._calculate_cultural_alignment(islands)
    
    return (avg_connectivity + cultural_alignment) / 2.0

@classmethod
def _calculate_cultural_alignment(cls, islands: Dict[str, IslandState]) -> float:
    """Calculate cultural alignment across the network."""
    if len(islands) < 2:
        return 1.0
    
    # Simplified: measure variance in cultural resonance patterns
    all_resonances = []
    for island in islands.values():
        if island.cultural_resonance:
            avg_resonance = sum(island.cultural_resonance.values()) / len(island.cultural_resonance)
            all_resonances.append(avg_resonance)
    
    if not all_resonances:
        return 0.5
    
    # Lower variance = higher alignment
    mean_resonance = sum(all_resonances) / len(all_resonances)
    variance = sum((x - mean_resonance) ** 2 for x in all_resonances) / len(all_resonances)
    
    # Convert variance to alignment score (inverse relationship)
    alignment = max(0.0, 1.0 - variance)
    return alignment
```

class NusantaraMovementController:
“””
Maritime archipelagic movement controller based on Nusantara principles.

```
Unlike linear terrestrial movement, this system operates on:
- Monsoon-dependent navigation cycles
- Inter-island network effects
- Cultural and economic synchronization
- Distributed autonomous island nodes
"""

def __init__(self, island_network: Dict[str, IslandSpecialization]):
    """Initialize with a network of islands and their specializations."""
    self.islands = {
        name: IslandState(
            name=name,
            specialization=spec,
            autonomy_level=0.8,  # Start with high autonomy
            network_connectivity=0.4,  # Start partially connected
            cultural_resonance={"shared_heritage": 0.6, "trade_language": 0.5}
        )
        for name, spec in island_network.items()
    }
    
    self.monsoon_calc = MonsoonCalculator()
    self.sync_calc = NetworkSyncCalculator()
    self.network_state = NetworkState.FRAGMENTED
    
    # Network-wide metrics
    self._total_voyages = 0
    self._successful_voyages = 0
    self._cultural_exchanges = 0
    self._innovation_transfers = 0
    self._disruption_events = 0
    
    # Route history for pattern learning
    self._route_history: List[Tuple[str, str, bool]] = []

@property
def current_monsoon(self) -> MonsoonPhase:
    """Get current monsoon phase."""
    return self.monsoon_calc.current_phase

@property
def network_coherence(self) -> float:
    """Calculate current network coherence."""
    return self.sync_calc.calculate_network_coherence(self.islands)

@property
def voyage_success_rate(self) -> float:
    """Calculate success rate of inter-island voyages."""
    if self._total_voyages == 0:
        return 0.0
    return self._successful_voyages / self._total_voyages

def navigate_between_islands(self, origin: str, destination: str, 
                            intent: str = "trade") -> NavigationResult:
    """
    Attempt navigation between two islands in the network.
    
    Args:
        origin: Starting island name
        destination: Target island name  
        intent: Purpose of voyage (trade, cultural, knowledge, diplomatic)
    """
    if origin not in self.islands or destination not in self.islands:
        raise ValueError(f"Unknown islands: {origin} or {destination}")
    
    self._total_voyages += 1
    
    # Check monsoon favorability
    is_favorable, monsoon_factor = self.monsoon_calc.is_navigation_favorable(origin, destination)
    
    # Calculate base success probability
    origin_island = self.islands[origin]
    dest_island = self.islands[destination]
    
    base_success = (origin_island.network_connectivity + dest_island.network_connectivity) / 2.0
    monsoon_bonus = 0.3 if is_favorable else -0.2
    
    # Specialization synergy bonus
    synergy_bonus = self._calculate_specialization_synergy(origin_island, dest_island)
    
    final_success_prob = min(0.95, max(0.05, base_success + monsoon_bonus + synergy_bonus))
    
    # Determine success
    navigation_success = random.random() < final_success_prob
    
    if navigation_success:
        self._successful_voyages += 1
        result = self._execute_successful_voyage(origin_island, dest_island, intent)
    else:
        result = self._handle_navigation_failure(origin, destination)
    
    # Update network state based on voyage patterns
    self._update_network_state()
    
    # Advance monsoon cycle
    self.monsoon_calc.advance_cycle()
    
    return result

def _calculate_specialization_synergy(self, origin: IslandState, dest: IslandState) -> float:
    """Calculate synergy bonus based on island specializations."""
    synergies = {
        (IslandSpecialization.MARITIME_HUB, IslandSpecialization.SPICE_PRODUCER): 0.2,
        (IslandSpecialization.TECH_ENTREPOT, IslandSpecialization.CULTURAL_NODE): 0.25,
        (IslandSpecialization.CULTURAL_NODE, IslandSpecialization.SPICE_PRODUCER): 0.15,
        (IslandSpecialization.MARITIME_HUB, IslandSpecialization.TECH_ENTREPOT): 0.3,
    }
    
    pair = (origin.specialization, dest.specialization)
    reverse_pair = (dest.specialization, origin.specialization)
    
    return synergies.get(pair, synergies.get(reverse_pair, 0.0))

def _execute_successful_voyage(self, origin: IslandState, dest: IslandState, 
                              intent: str) -> NavigationResult:
    """Execute a successful voyage with appropriate effects."""
    self._cultural_exchanges += 1
    
    # Update island connectivity
    connectivity_boost = 0.1
    self.islands[origin.name] = self._update_island_connectivity(origin, connectivity_boost)
    self.islands[dest.name] = self._update_island_connectivity(dest, connectivity_boost)
    
    # Generate cultural exchange
    cultural_exchange = {
        "navigation_knowledge": random.randint(1, 5),
        "trade_practices": random.randint(1, 3),
        "cultural_artifacts": random.randint(0, 2)
    }
    
    # Knowledge transfer based on specializations
    knowledge_transferred = self._generate_knowledge_transfer(origin, dest)
    
    network_effects = [
        f"Strengthened {origin.name}-{dest.name} trade route",
        f"Enhanced cultural resonance between islands"
    ]
    
    return NavigationResult(
        success=True,
        origin_island=origin.name,
        destination_island=dest.name,
        route_taken=f"{origin.name} → {dest.name} via monsoon currents",
        monsoon_favorable=True,  # Must be true for successful voyage
        cultural_exchange=cultural_exchange,
        trade_volume=random.randint(50, 200),
        knowledge_transferred=knowledge_transferred,
        network_effects=network_effects
    )

def _handle_navigation_failure(self, origin: str, destination: str) -> NavigationResult:
    """Handle failed navigation attempt."""
    self._disruption_events += 1
    
    # Reduce connectivity slightly on failure
    if origin in self.islands:
        origin_island = self.islands[origin]
        self.islands[origin] = self._update_island_connectivity(origin_island, -0.05)
    
    return NavigationResult(
        success=False,
        origin_island=origin,
        destination_island=destination,
        route_taken="Navigation failed",
        monsoon_favorable=False,
        network_effects=[f"Route disruption between {origin} and {destination}"]
    )

def _update_island_connectivity(self, island: IslandState, change: float) -> IslandState:
    """Create updated island state with modified connectivity."""
    new_connectivity = max(0.0, min(1.0, island.network_connectivity + change))
    
    return IslandState(
        name=island.name,
        specialization=island.specialization,
        autonomy_level=island.autonomy_level,
        network_connectivity=new_connectivity,
        cultural_resonance=island.cultural_resonance,
        resource_capacity=island.resource_capacity,
        innovation_index=island.innovation_index
    )

def _generate_knowledge_transfer(self, origin: IslandState, dest: IslandState) -> List[str]:
    """Generate knowledge transfer based on specializations."""
    transfer_patterns = {
        IslandSpecialization.MARITIME_HUB: ["navigation_techniques", "port_management", "weather_prediction"],
        IslandSpecialization.SPICE_PRODUCER: ["agricultural_methods", "preservation_techniques", "trade_goods"],
        IslandSpecialization.CULTURAL_NODE: ["religious_practices", "artistic_techniques", "philosophical_concepts"],
        IslandSpecialization.TECH_ENTREPOT: ["manufacturing_processes", "technological_innovations", "trade_networks"]
    }
    
    origin_knowledge = transfer_patterns.get(origin.specialization, [])
    dest_knowledge = transfer_patterns.get(dest.specialization, [])
    
    # Random selection of 1-3 knowledge items
    all_knowledge = origin_knowledge + dest_knowledge
    num_transfers = random.randint(1, min(3, len(all_knowledge)))
    
    return random.sample(all_knowledge, num_transfers) if all_knowledge else []

def _update_network_state(self) -> None:
    """Update network state based on current coherence."""
    coherence = self.network_coherence
    
    if coherence >= self.sync_calc.TRANSCENDENCE_THRESHOLD:
        self.network_state = NetworkState.TRANSCENDENT
    elif coherence >= self.sync_calc.SYNC_THRESHOLD:
        self.network_state = NetworkState.SYNCHRONIZED
    elif coherence <= self.sync_calc.DISRUPTION_THRESHOLD:
        self.network_state = NetworkState.DISRUPTED
    elif self._total_voyages > 0 and self.voyage_success_rate > 0.5:
        self.network_state = NetworkState.CONNECTING
    else:
        self.network_state = NetworkState.FRAGMENTED

def get_network_status(self) -> Dict:
    """Get comprehensive network status."""
    return {
        "network_state": self.network_state.name,
        "network_coherence": round(self.network_coherence, 3),
        "monsoon_phase": self.current_monsoon.value,
        "total_voyages": self._total_voyages,
        "success_rate": round(self.voyage_success_rate, 3),
        "cultural_exchanges": self._cultural_exchanges,
        "disruption_events": self._disruption_events,
        "island_count": len(self.islands),
        "islands": {
            name: {
                "specialization": island.specialization.value,
                "connectivity": round(island.network_connectivity, 3),
                "autonomy": round(island.autonomy_level, 3)
            }
            for name, island in self.islands.items()
        }
    }

def simulate_monsoon_cycle(self, cycles: int = 2) -> List[Dict]:
    """Simulate multiple monsoon cycles with random inter-island movements."""
    results = []
    
    island_names = list(self.islands.keys())
    
    for cycle in range(cycles):
        cycle_results = []
        
        # Generate random voyages during this cycle
        voyages_per_cycle = random.randint(5, 15)
        
        for _ in range(voyages_per_cycle):
            origin, destination = random.sample(island_names, 2)
            intent = random.choice(["trade", "cultural", "knowledge", "diplomatic"])
            
            result = self.navigate_between_islands(origin, destination, intent)
            cycle_results.append(result)
        
        # Record cycle summary
        cycle_summary = {
            "cycle": cycle + 1,
            "monsoon_phase": self.current_monsoon.value,
            "voyages": len(cycle_results),
            "successful_voyages": sum(1 for r in cycle_results if r.success),
            "network_coherence": self.network_coherence,
            "network_state": self.network_state.name
        }
        
        results.append(cycle_summary)
    
    return results
```

# Example usage demonstrating the Nusantara system

if **name** == “**main**”:
# Create archipelagic network
nusantara_network = {
“java”: IslandSpecialization.CULTURAL_NODE,
“sumatra”: IslandSpecialization.SPICE_PRODUCER,
“borneo”: IslandSpecialization.MARITIME_HUB,
“sulawesi”: IslandSpecialization.TECH_ENTREPOT,
“mindanao”: IslandSpecialization.SPICE_PRODUCER,
“visayas”: IslandSpecialization.MARITIME_HUB,
“singapore”: IslandSpecialization.TECH_ENTREPOT
}

```
# Initialize controller
controller = NusantaraMovementController(nusantara_network)

print("=== Nusantara Maritime Network Initialized ===")
print(f"Network State: {controller.network_state.name}")
print(f"Current Monsoon: {controller.current_monsoon.value}")
print(f"Network Coherence: {controller.network_coherence:.3f}")
print()

# Execute some navigation attempts
test_voyages = [
    ("java", "sumatra", "trade"),
    ("singapore", "borneo", "knowledge"),
    ("mindanao", "visayas", "cultural"),
    ("sulawesi", "java", "diplomatic")
]

print("=== Navigation Results ===")
for origin, dest, intent in test_voyages:
    result = controller.navigate_between_islands(origin, dest, intent)
    status = "SUCCESS" if result.success else "FAILED"
    print(f"{origin} → {dest} ({intent}): {status}")
    if result.success:
        print(f"  Trade Volume: {result.trade_volume}")
        print(f"  Knowledge: {', '.join(result.knowledge_transferred[:2])}")
    print()

# Run monsoon cycle simulation
print("=== Monsoon Cycle Simulation ===")
cycle_results = controller.simulate_monsoon_cycle(cycles=2)

for cycle_data in cycle_results:
    print(f"Cycle {cycle_data['cycle']} ({cycle_data['monsoon_phase']}):")
    print(f"  Voyages: {cycle_data['voyages']} (Success: {cycle_data['successful_voyages']})")
    print(f"  Network State: {cycle_data['network_state']}")
    print(f"  Coherence: {cycle_data['network_coherence']:.3f}")
    print()

# Final status
print("=== Final Network Status ===")
status = controller.get_network_status()
print(f"Network State: {status['network_state']}")
print(f"Total Voyages: {status['total_voyages']}")
print(f"Success Rate: {status['success_rate']:.1%}")
print(f"Cultural Exchanges: {status['cultural_exchanges']}")
print(f"Final Coherence: {status['network_coherence']:.3f}")
```