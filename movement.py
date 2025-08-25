“””
Nusantara Maritime Movement Simulation

Core principles:

- Islands as autonomous agents with distinct capabilities
- Movement success determined by monsoon patterns and inter-island relationships
- Network effects emerge from accumulated successful connections
- Cultural and economic synchronization through repeated interactions
  “””

import random
from dataclasses import dataclass
from enum import Enum
from typing import Dict, List, Tuple, Set
import math

class Monsoon(Enum):
NORTHEAST = “northeast”
SOUTHWEST = “southwest”
CALM = “calm”

class IslandType(Enum):
PORT_CITY = “port_city”          # High navigation capability
AGRICULTURAL = “agricultural”    # Resource production
CULTURAL_CENTER = “cultural”     # Knowledge/religion hub
TRADING_POST = “trading”         # Commercial specialization

@dataclass
class Island:
name: str
island_type: IslandType
navigation_skill: float  # 0.0 to 1.0
trade_capacity: int
cultural_influence: float
connections: Set[str]  # Set of connected island names

```
def __post_init__(self):
    # Type-based capabilities
    if self.island_type == IslandType.PORT_CITY:
        self.navigation_skill = max(0.7, self.navigation_skill)
    elif self.island_type == IslandType.TRADING_POST:
        self.trade_capacity = max(100, self.trade_capacity)
    elif self.island_type == IslandType.CULTURAL_CENTER:
        self.cultural_influence = max(0.6, self.cultural_influence)
```

@dataclass
class Voyage:
origin: str
destination: str
success: bool
monsoon_phase: Monsoon
trade_goods: int
cultural_exchange: bool

class NusantaraSimulation:
“””
Simulates movement patterns in the Nusantara archipelago based on:
- Seasonal monsoon cycles affecting navigation success
- Island specializations creating trade incentives  
- Network effects from successful route establishment
- Cultural synchronization through repeated contact
“””

```
def __init__(self):
    # Initialize archipelago with historically-inspired islands
    self.islands = {
        "malacca": Island("malacca", IslandType.PORT_CITY, 0.9, 150, 0.8, set()),
        "jakarta": Island("jakarta", IslandType.TRADING_POST, 0.7, 200, 0.6, set()),
        "surabaya": Island("surabaya", IslandType.PORT_CITY, 0.8, 120, 0.5, set()),
        "palembang": Island("palembang", IslandType.CULTURAL_CENTER, 0.6, 80, 0.9, set()),
        "banjarmasin": Island("banjarmasin", IslandType.TRADING_POST, 0.7, 100, 0.4, set()),
        "makassar": Island("makassar", IslandType.PORT_CITY, 0.8, 90, 0.7, set()),
        "ternate": Island("ternate", IslandType.AGRICULTURAL, 0.5, 60, 0.8, set()),
        "brunei": Island("brunei", IslandType.TRADING_POST, 0.6, 110, 0.5, set()),
        "cebu": Island("cebu", IslandType.PORT_CITY, 0.7, 85, 0.6, set()),
        "manila": Island("manila", IslandType.CULTURAL_CENTER, 0.6, 95, 0.8, set())
    }
    
    self.current_monsoon = Monsoon.NORTHEAST
    self.monsoon_cycle = 0
    self.voyage_history: List[Voyage] = []
    
    # Track network development
    self.established_routes: Set[Tuple[str, str]] = set()
    self.total_trade_volume = 0
    self.cultural_exchanges = 0

def get_distance_factor(self, origin: str, destination: str) -> float:
    """Simplified distance calculation based on geographical knowledge"""
    # Closer islands have higher success rates
    distance_matrix = {
        ("malacca", "jakarta"): 0.8,
        ("malacca", "palembang"): 0.9,
        ("jakarta", "surabaya"): 0.9,
        ("surabaya", "makassar"): 0.7,
        ("makassar", "ternate"): 0.6,
        ("brunei", "manila"): 0.7,
        ("manila", "cebu"): 0.9,
        ("jakarta", "banjarmasin"): 0.8,
    }
    
    # Check both directions
    pair = (origin, destination)
    reverse_pair = (destination, origin)
    
    return distance_matrix.get(pair, distance_matrix.get(reverse_pair, 0.4))

def get_monsoon_factor(self, origin: str, destination: str) -> float:
    """Calculate monsoon favorability for specific routes"""
    if self.current_monsoon == Monsoon.CALM:
        return 0.6  # Neutral conditions
    
    # Northeast monsoon favors certain directions
    if self.current_monsoon == Monsoon.NORTHEAST:
        northeast_favorable = {
            ("jakarta", "surabaya"), ("surabaya", "makassar"),
            ("malacca", "jakarta"), ("palembang", "jakarta"),
            ("brunei", "manila"), ("manila", "cebu")
        }
        if (origin, destination) in northeast_favorable:
            return 0.9
        elif (destination, origin) in northeast_favorable:
            return 0.3  # Against monsoon
    
    # Southwest monsoon favors opposite directions
    elif self.current_monsoon == Monsoon.SOUTHWEST:
        southwest_favorable = {
            ("surabaya", "jakarta"), ("makassar", "surabaya"),
            ("jakarta", "malacca"), ("jakarta", "palembang"),
            ("cebu", "manila"), ("manila", "brunei")
        }
        if (origin, destination) in southwest_favorable:
            return 0.9
        elif (destination, origin) in southwest_favorable:
            return 0.3
    
    return 0.5  # Neutral

def calculate_voyage_success(self, origin: str, destination: str) -> float:
    """Calculate probability of successful voyage"""
    origin_island = self.islands[origin]
    dest_island = self.islands[destination]
    
    # Base factors
    navigation_factor = origin_island.navigation_skill
    distance_factor = self.get_distance_factor(origin, destination)
    monsoon_factor = self.get_monsoon_factor(origin, destination)
    
    # Network effect - established routes are easier
    route = (origin, destination)
    reverse_route = (destination, origin)
    network_bonus = 0.2 if route in self.established_routes or reverse_route in self.established_routes else 0.0
    
    # Calculate final probability
    success_prob = (navigation_factor * 0.4 + 
                   distance_factor * 0.3 + 
                   monsoon_factor * 0.3 + 
                   network_bonus)
    
    return min(0.95, max(0.05, success_prob))

def attempt_voyage(self, origin: str, destination: str) -> Voyage:
    """Attempt a voyage between two islands"""
    success_prob = self.calculate_voyage_success(origin, destination)
    success = random.random() < success_prob
    
    trade_goods = 0
    cultural_exchange = False
    
    if success:
        # Add route to established routes
        route = (origin, destination)
        self.established_routes.add(route)
        
        # Connect islands
        self.islands[origin].connections.add(destination)
        self.islands[destination].connections.add(origin)
        
        # Generate trade based on island capabilities
        origin_island = self.islands[origin]
        dest_island = self.islands[destination]
        
        trade_goods = min(origin_island.trade_capacity, 
                        random.randint(20, 100))
        self.total_trade_volume += trade_goods
        
        # Cultural exchange based on cultural influence
        cultural_threshold = (origin_island.cultural_influence + 
                            dest_island.cultural_influence) / 2
        cultural_exchange = random.random() < cultural_threshold
        
        if cultural_exchange:
            self.cultural_exchanges += 1
    
    voyage = Voyage(origin, destination, success, self.current_monsoon, 
                   trade_goods, cultural_exchange)
    self.voyage_history.append(voyage)
    
    return voyage

def advance_monsoon(self):
    """Advance to next monsoon phase"""
    self.monsoon_cycle += 1
    
    if self.monsoon_cycle % 6 == 0:
        self.current_monsoon = Monsoon.NORTHEAST
    elif self.monsoon_cycle % 6 == 3:
        self.current_monsoon = Monsoon.SOUTHWEST
    elif self.monsoon_cycle % 6 in [2, 5]:
        self.current_monsoon = Monsoon.CALM
    # Other cycles stay in current monsoon

def get_network_connectivity(self) -> float:
    """Calculate overall network connectivity"""
    total_possible_connections = len(self.islands) * (len(self.islands) - 1) / 2
    actual_connections = len(self.established_routes)
    
    return actual_connections / total_possible_connections if total_possible_connections > 0 else 0

def get_island_centrality(self, island_name: str) -> float:
    """Calculate how central an island is to the network"""
    island = self.islands[island_name]
    total_islands = len(self.islands)
    
    return len(island.connections) / (total_islands - 1) if total_islands > 1 else 0

def simulate_trading_season(self, num_voyages: int = 20) -> Dict:
    """Simulate a trading season with multiple voyages"""
    season_voyages = []
    island_names = list(self.islands.keys())
    
    for _ in range(num_voyages):
        # Generate voyage based on realistic patterns
        origin = random.choice(island_names)
        
        # Bias towards islands with trade capacity for origins
        if random.random() < 0.7:  # 70% chance to pick trading-focused origin
            trading_islands = [name for name, island in self.islands.items() 
                             if island.island_type in [IslandType.PORT_CITY, IslandType.TRADING_POST]]
            if trading_islands:
                origin = random.choice(trading_islands)
        
        # Select destination (avoid same island)
        possible_destinations = [name for name in island_names if name != origin]
        destination = random.choice(possible_destinations)
        
        voyage = self.attempt_voyage(origin, destination)
        season_voyages.append(voyage)
    
    # Advance monsoon
    self.advance_monsoon()
    
    # Calculate season statistics
    successful_voyages = [v for v in season_voyages if v.success]
    season_trade = sum(v.trade_goods for v in successful_voyages)
    season_cultural = sum(1 for v in successful_voyages if v.cultural_exchange)
    
    return {
        "monsoon": self.current_monsoon.value,
        "cycle": self.monsoon_cycle,
        "total_voyages": len(season_voyages),
        "successful_voyages": len(successful_voyages),
        "success_rate": len(successful_voyages) / len(season_voyages) if season_voyages else 0,
        "trade_volume": season_trade,
        "cultural_exchanges": season_cultural,
        "network_connectivity": self.get_network_connectivity(),
        "established_routes": len(self.established_routes)
    }

def run_multi_season_simulation(self, seasons: int = 8) -> List[Dict]:
    """Run simulation for multiple trading seasons"""
    results = []
    
    for season in range(seasons):
        season_result = self.simulate_trading_season()
        season_result["season"] = season + 1
        results.append(season_result)
        
        print(f"Season {season + 1} ({season_result['monsoon']}): "
              f"{season_result['successful_voyages']}/{season_result['total_voyages']} successful, "
              f"Trade: {season_result['trade_volume']}, "
              f"Connectivity: {season_result['network_connectivity']:.2f}")
    
    return results

def get_final_network_status(self) -> Dict:
    """Get comprehensive network status"""
    island_stats = {}
    for name, island in self.islands.items():
        island_stats[name] = {
            "type": island.island_type.value,
            "connections": len(island.connections),
            "centrality": self.get_island_centrality(name),
            "connected_to": list(island.connections)
        }
    
    return {
        "total_voyages": len(self.voyage_history),
        "successful_voyages": sum(1 for v in self.voyage_history if v.success),
        "overall_success_rate": sum(1 for v in self.voyage_history if v.success) / len(self.voyage_history) if self.voyage_history else 0,
        "total_trade_volume": self.total_trade_volume,
        "total_cultural_exchanges": self.cultural_exchanges,
        "network_connectivity": self.get_network_connectivity(),
        "established_routes": len(self.established_routes),
        "islands": island_stats,
        "final_monsoon": self.current_monsoon.value
    }
```

# Run simulation

if **name** == “**main**”:
print(”=== Nusantara Maritime Movement Simulation ===\n”)

```
sim = NusantaraSimulation()

# Show initial state
print("Initial Network:")
for name, island in sim.islands.items():
    print(f"  {name}: {island.island_type.value} (nav: {island.navigation_skill:.1f})")
print(f"\nStarting monsoon: {sim.current_monsoon.value}")
print(f"Network connectivity: {sim.get_network_connectivity():.2f}\n")

# Run multi-season simulation
print("=== Trading Season Results ===")
season_results = sim.run_multi_season_simulation(8)

# Final analysis
print("\n=== Final Network Analysis ===")
final_status = sim.get_final_network_status()

print(f"Total voyages attempted: {final_status['total_voyages']}")
print(f"Overall success rate: {final_status['overall_success_rate']:.1%}")
print(f"Total trade volume: {final_status['total_trade_volume']}")
print(f"Cultural exchanges: {final_status['total_cultural_exchanges']}")
print(f"Final network connectivity: {final_status['network_connectivity']:.2f}")

print(f"\nMost connected islands:")
island_centralities = [(name, stats['centrality']) for name, stats in final_status['islands'].items()]
island_centralities.sort(key=lambda x: x[1], reverse=True)

for name, centrality in island_centralities[:5]:
    connections = len(final_status['islands'][name]['connected_to'])
    print(f"  {name}: {connections} connections (centrality: {centrality:.2f})")
```