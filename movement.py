“””
Prime Movement Controller System - Refactored

A high-performance, state-based movement system with specialized controllers
for managing entity movement through different states with comprehensive
statistical tracking and performance monitoring.
“””

from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from enum import Enum, auto
from typing import Dict, List, Optional, Tuple, Protocol
import logging

class MovementState(Enum):
“”“Enumeration of possible movement states with explicit values.”””
EXPLORING = auto()
TRANSITIONING = auto()
LOCKED = auto()
ANOMALOUS = auto()
SYNCHRONIZED = auto()

class Specialization(Enum):
“”“Enumeration of specialization types with performance characteristics.”””
TERRITORIAL = auto()
ECONOMIC = auto()
SOCIAL = auto()
TECHNOLOGICAL = auto()

@dataclass(frozen=True)
class MovementResult:
“”“Immutable result object representing the outcome of a movement operation.”””
success: bool = False
stat_changes: Dict[str, int] = field(default_factory=dict)
performance_impact: int = 0
world_modifications: List[str] = field(default_factory=list)
narrative_events: List[str] = field(default_factory=list)

```
def __post_init__(self):
    # Ensure immutable collections
    object.__setattr__(self, 'stat_changes', dict(self.stat_changes))
    object.__setattr__(self, 'world_modifications', list(self.world_modifications))
    object.__setattr__(self, 'narrative_events', list(self.narrative_events))
```

@dataclass(frozen=True)
class MovementOptions:
“”“Immutable data class representing available movement paths.”””
paths: List[str] = field(default_factory=list)

```
def __post_init__(self):
    object.__setattr__(self, 'paths', list(self.paths))
```

class StateTransitionError(Exception):
“”“Raised when an invalid state transition is attempted.”””
pass

class PerformanceCalculator:
“”“Handles performance calculations and thresholds.”””

```
# Class constants for better maintainability
ANOMALY_THRESHOLD = 5
SYNCHRONIZATION_THRESHOLD = 90

PERFORMANCE_INCREMENTS = {
    Specialization.TERRITORIAL: 5,
    Specialization.ECONOMIC: 3,
    Specialization.SOCIAL: 4,
    Specialization.TECHNOLOGICAL: 6
}

@classmethod
def get_performance_increment(cls, specialization: Specialization) -> int:
    """Get performance increment for a given specialization."""
    return cls.PERFORMANCE_INCREMENTS[specialization]

@classmethod
def should_transition_to_anomalous(cls, anomaly_count: int) -> bool:
    """Determine if system should transition to anomalous state."""
    return anomaly_count > cls.ANOMALY_THRESHOLD

@classmethod
def should_transition_to_synchronized(cls, performance: int) -> bool:
    """Determine if system should transition to synchronized state."""
    return performance > cls.SYNCHRONIZATION_THRESHOLD
```

class StateManager:
“”“Manages state transitions with validation.”””

```
# Valid state transitions mapping
VALID_TRANSITIONS = {
    MovementState.EXPLORING: {MovementState.TRANSITIONING, MovementState.LOCKED, 
                             MovementState.ANOMALOUS, MovementState.SYNCHRONIZED},
    MovementState.TRANSITIONING: {MovementState.EXPLORING, MovementState.LOCKED, 
                                MovementState.ANOMALOUS, MovementState.SYNCHRONIZED},
    MovementState.LOCKED: {MovementState.EXPLORING, MovementState.TRANSITIONING,
                          MovementState.ANOMALOUS},
    MovementState.ANOMALOUS: set(),  # Terminal state
    MovementState.SYNCHRONIZED: set()  # Terminal state
}

def __init__(self, initial_state: MovementState = MovementState.EXPLORING):
    self._current_state = initial_state
    self._state_history: List[MovementState] = [initial_state]

@property
def current_state(self) -> MovementState:
    """Get current state."""
    return self._current_state

@property
def state_history(self) -> List[MovementState]:
    """Get immutable copy of state history."""
    return self._state_history.copy()

def can_transition_to(self, new_state: MovementState) -> bool:
    """Check if transition to new state is valid."""
    return new_state in self.VALID_TRANSITIONS.get(self._current_state, set())

def transition_to(self, new_state: MovementState) -> None:
    """Transition to new state with validation."""
    if not self.can_transition_to(new_state):
        raise StateTransitionError(
            f"Invalid transition from {self._current_state} to {new_state}"
        )
    
    self._current_state = new_state
    self._state_history.append(new_state)

def reset(self) -> None:
    """Reset to initial state."""
    self._current_state = MovementState.EXPLORING
    self._state_history = [MovementState.EXPLORING]
```

class StatisticsTracker:
“”“Handles statistics tracking and reporting.”””

```
def __init__(self):
    self._stats = {spec.name.lower(): 0 for spec in Specialization}
    self._movement_count = 0
    self._success_count = 0
    self._failure_count = 0

@property
def stats(self) -> Dict[str, int]:
    """Get immutable copy of current statistics."""
    return self._stats.copy()

@property
def movement_count(self) -> int:
    return self._movement_count

@property
def success_rate(self) -> float:
    """Calculate success rate as percentage."""
    if self._movement_count == 0:
        return 0.0
    return (self._success_count / self._movement_count) * 100

def record_movement(self, specialization: Specialization, success: bool) -> None:
    """Record a movement with its outcome."""
    stat_key = specialization.name.lower()
    self._stats[stat_key] += 1
    self._movement_count += 1
    
    if success:
        self._success_count += 1
    else:
        self._failure_count += 1

def reset(self) -> None:
    """Reset all statistics."""
    self._stats = {spec.name.lower(): 0 for spec in Specialization}
    self._movement_count = 0
    self._success_count = 0
    self._failure_count = 0
```

class PathCalculator(ABC):
“”“Abstract base class for calculating movement paths.”””

```
@abstractmethod
def calculate_paths(self, current: str, target: str, 
                   specialization: Specialization) -> List[str]:
    """Calculate available paths between locations."""
    pass
```

class BasicPathCalculator(PathCalculator):
“”“Basic implementation of path calculation.”””

```
BASE_PATHS = ["Direct Path", "Alternate Path"]

SPECIALIZATION_PATHS = {
    Specialization.TERRITORIAL: ["Siege Path"],
    Specialization.ECONOMIC: ["Trade Route"],
    Specialization.SOCIAL: ["Diplomatic Path"],
    Specialization.TECHNOLOGICAL: ["Neural Network Path"]
}

def calculate_paths(self, current: str, target: str, 
                   specialization: Specialization) -> List[str]:
    """Calculate available movement paths."""
    paths = self.BASE_PATHS.copy()
    
    # Add specialization-specific paths
    spec_paths = self.SPECIALIZATION_PATHS.get(specialization, [])
    paths.extend(spec_paths)
    
    return paths
```

class PrimeMovementController:
“””
Enhanced movement controller with improved architecture and separation of concerns.

```
This refactored version provides:
- Better error handling and validation
- Immutable result objects
- Separated concerns (state management, statistics, performance)
- Enhanced logging and debugging capabilities
- More flexible path calculation system
"""

def __init__(self, specialization: Specialization, 
             path_calculator: Optional[PathCalculator] = None,
             logger: Optional[logging.Logger] = None):
    """Initialize controller with enhanced dependency injection."""
    self.specialization = specialization
    
    # Composition over inheritance - separate concerns
    self._state_manager = StateManager()
    self._stats_tracker = StatisticsTracker()
    self._performance_calc = PerformanceCalculator()
    self._path_calculator = path_calculator or BasicPathCalculator()
    self._logger = logger or logging.getLogger(__name__)
    
    # Core metrics
    self._engine_performance = 0
    self._anomalies = 0
    self._world_state: Dict = {}

@property
def state(self) -> MovementState:
    """Get current movement state."""
    return self._state_manager.current_state

@property
def stats(self) -> Dict[str, int]:
    """Get current statistics."""
    return self._stats_tracker.stats

@property
def engine_performance(self) -> int:
    """Get current engine performance."""
    return self._engine_performance

@property
def anomalies(self) -> int:
    """Get current anomaly count."""
    return self._anomalies

@property
def success_rate(self) -> float:
    """Get movement success rate."""
    return self._stats_tracker.success_rate

@property
def world_state(self) -> Dict:
    """Get immutable copy of world state."""
    return self._world_state.copy()

def execute_movement(self, direction: str, logic_status: str) -> MovementResult:
    """
    Execute a movement with enhanced error handling and validation.
    
    Args:
        direction: Cardinal direction of movement
        logic_status: Status of the movement logic ("success" or "failed")
        
    Returns:
        MovementResult object with comprehensive outcome details
        
    Raises:
        ValueError: If invalid parameters are provided
        StateTransitionError: If invalid state transition is attempted
    """
    if not direction or not isinstance(direction, str):
        raise ValueError("Direction must be a non-empty string")
    
    if logic_status not in ["success", "failed"]:
        raise ValueError("Logic status must be 'success' or 'failed'")
    
    self._logger.debug(f"Executing movement: {direction} with status: {logic_status}")
    
    # Record movement statistics
    is_success = logic_status == "success"
    self._stats_tracker.record_movement(self.specialization, is_success)
    
    # Update performance (always increases regardless of success/failure)
    performance_gain = self._performance_calc.get_performance_increment(self.specialization)
    self._engine_performance += performance_gain
    
    # Handle logic failures and anomalies
    if logic_status == "failed":
        self._anomalies += 1
        self._logger.warning(f"Movement failed. Anomaly count: {self._anomalies}")
    
    # Evaluate state transitions
    self._evaluate_state_transitions()
    
    # Create narrative events
    narrative_events = [f"Moved in direction: {direction}"]
    if logic_status == "failed":
        narrative_events.append(f"Movement encountered failure (anomaly #{self._anomalies})")
    
    if self.state == MovementState.SYNCHRONIZED:
        narrative_events.append("SYNCHRONIZED state achieved!")
    elif self.state == MovementState.ANOMALOUS:
        narrative_events.append("System entered ANOMALOUS state")
    
    return MovementResult(
        success=is_success,
        stat_changes=self.stats,
        performance_impact=self._engine_performance,
        world_modifications=[],  # Could be enhanced based on requirements
        narrative_events=narrative_events
    )

def _evaluate_state_transitions(self) -> None:
    """Evaluate and execute state transitions based on current metrics."""
    # Check for anomalous state first (higher priority)
    if self._performance_calc.should_transition_to_anomalous(self._anomalies):
        try:
            self._state_manager.transition_to(MovementState.ANOMALOUS)
            self._logger.info(f"Transitioned to ANOMALOUS state (anomalies: {self._anomalies})")
        except StateTransitionError as e:
            self._logger.warning(f"Failed to transition to ANOMALOUS: {e}")
    
    # Check for synchronized state (only if not anomalous)
    elif self._performance_calc.should_transition_to_synchronized(self._engine_performance):
        try:
            self._state_manager.transition_to(MovementState.SYNCHRONIZED)
            self._logger.info(f"Transitioned to SYNCHRONIZED state (performance: {self._engine_performance})")
        except StateTransitionError as e:
            self._logger.warning(f"Failed to transition to SYNCHRONIZED: {e}")

def calculate_available_movements(self, current: str, target: str) -> MovementOptions:
    """
    Calculate available movement paths using pluggable path calculator.
    
    Args:
        current: Current location identifier
        target: Target location identifier
        
    Returns:
        MovementOptions object with available paths
    """
    if not current or not target:
        raise ValueError("Current and target locations must be provided")
    
    paths = self._path_calculator.calculate_paths(current, target, self.specialization)
    
    self._logger.debug(f"Calculated {len(paths)} available paths from {current} to {target}")
    
    return MovementOptions(paths=paths)

def reset(self) -> None:
    """Reset the controller to initial state."""
    self._logger.info("Resetting controller to initial state")
    
    self._state_manager.reset()
    self._stats_tracker.reset()
    self._engine_performance = 0
    self._anomalies = 0
    self._world_state.clear()

def get_diagnostic_info(self) -> Dict:
    """Get comprehensive diagnostic information."""
    return {
        'current_state': self.state.name,
        'state_history': [s.name for s in self._state_manager.state_history],
        'specialization': self.specialization.name,
        'engine_performance': self._engine_performance,
        'anomalies': self._anomalies,
        'success_rate': self.success_rate,
        'movement_count': self._stats_tracker.movement_count,
        'stats': self.stats,
        'thresholds': {
            'anomaly_threshold': self._performance_calc.ANOMALY_THRESHOLD,
            'sync_threshold': self._performance_calc.SYNCHRONIZATION_THRESHOLD
        }
    }
```

class MovementSimulator:
“”“Enhanced simulator with better reporting and analysis capabilities.”””

```
def __init__(self, controller: PrimeMovementController):
    """Initialize with a movement controller."""
    if not isinstance(controller, PrimeMovementController):
        raise TypeError("Controller must be instance of PrimeMovementController")
    
    self.controller = controller
    self.history: List[Dict] = []
    self._logger = logging.getLogger(__name__)

def run_simulation(self, steps: List[Tuple[str, str]]) -> List[Dict]:
    """
    Run simulation with enhanced error handling and reporting.
    
    Args:
        steps: List of (direction, logic_status) tuples
        
    Returns:
        List of comprehensive result dictionaries for each step
    """
    if not steps:
        raise ValueError("Steps list cannot be empty")
    
    self._logger.info(f"Starting simulation with {len(steps)} steps")
    results = []
    
    for step_num, (direction, logic_status) in enumerate(steps, 1):
        try:
            # Execute movement
            result = self.controller.execute_movement(direction, logic_status)
            
            # Get available paths
            paths = self.controller.calculate_available_movements("Start", "End")
            
            # Create comprehensive record
            record = {
                'step': step_num,
                'direction': direction,
                'logic_status': logic_status,
                'specialization': self.controller.specialization.name,
                'stats': self.controller.stats,
                'engine_performance': self.controller.engine_performance,
                'anomalies': self.controller.anomalies,
                'movement_state': self.controller.state.name,
                'success_rate': round(self.controller.success_rate, 2),
                'available_paths': paths.paths,
                'narrative_events': result.narrative_events,
                'result_success': result.success
            }
            
            results.append(record)
            self.history.append(record)
            
            self._logger.debug(f"Step {step_num} completed: {self.controller.state.name}")
            
        except Exception as e:
            self._logger.error(f"Error in step {step_num}: {e}")
            raise
    
    self._logger.info(f"Simulation completed. Final state: {self.controller.state.name}")
    return results

def get_analysis(self) -> Dict:
    """Generate comprehensive analysis of simulation results."""
    if not self.history:
        return {"error": "No simulation data available"}
    
    final_record = self.history[-1]
    
    return {
        'summary': {
            'total_steps': len(self.history),
            'final_state': final_record['movement_state'],
            'final_performance': final_record['engine_performance'],
            'final_anomalies': final_record['anomalies'],
            'success_rate': final_record['success_rate']
        },
        'performance_trajectory': [r['engine_performance'] for r in self.history],
        'state_transitions': [r['movement_state'] for r in self.history],
        'controller_diagnostics': self.controller.get_diagnostic_info()
    }
```

# Example usage and demonstration

if **name** == “**main**”:
# Configure logging
logging.basicConfig(level=logging.INFO,
format=’%(asctime)s - %(name)s - %(levelname)s - %(message)s’)

```
# Create a controller with Technological specialization
controller = PrimeMovementController(Specialization.TECHNOLOGICAL)

# Create a simulator
simulator = MovementSimulator(controller)

# Define movement sequence
movements = [
    ("East", "success"),
    ("South", "failed"),
    ("North", "failed"),
    ("West", "success"),
    ("North", "success")
]

# Run simulation
try:
    results = simulator.run_simulation(movements)
    
    # Print results
    for result in results:
        print(f"Step {result['step']}: {result['direction']} "
              f"({result['logic_status']}) -> "
              f"Performance: {result['engine_performance']}, "
              f"State: {result['movement_state']}, "
              f"Success Rate: {result['success_rate']}%")
    
    # Print analysis
    analysis = simulator.get_analysis()
    print(f"\nFinal Analysis:")
    print(f"Total Steps: {analysis['summary']['total_steps']}")
    print(f"Final State: {analysis['summary']['final_state']}")
    print(f"Final Performance: {analysis['summary']['final_performance']}")
    print(f"Success Rate: {analysis['summary']['success_rate']}%")
    
except Exception as e:
    print(f"Simulation failed: {e}")
```