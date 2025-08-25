import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
from enum import Enum

# Define the enums and classes from Pure.txt
class MovementState(Enum):
    EXPLORING = "Exploring"
    TRANSITIONING = "Transitioning"
    LOCKED = "Locked"
    ANOMALOUS = "Anomalous"
    SYNCHRONIZED = "Synchronized"

class Specialization(Enum):
    TERRITORIAL = "Territorial"
    ECONOMIC = "Economic"
    SOCIAL = "Social"
    TECHNOLOGICAL = "Technological"

class MovementResult:
    def __init__(self, success=False, stat_changes=None, performance_impact=0, world_modifications=None, narrative_events=None):
        self.success = success
        self.stat_changes = stat_changes or {}
        self.performance_impact = performance_impact
        self.world_modifications = world_modifications or []
        self.narrative_events = narrative_events or []

class MovementOptions:
    def __init__(self, paths=None):
        self.paths = paths or []

class PrimeMovementController:
    def __init__(self, specialization):
        self.state = MovementState.EXPLORING
        self.specialization = specialization
        self.stats = {'territorial': 0, 'economic': 0, 'social': 0, 'technological': 0}
        self.engine_performance = 0
        self.anomalies = 0
        self.world_state = {}  # Simplified persistent state

    def execute_movement(self, direction, logic_status):
        # Simplified movement logic
        if self.specialization == Specialization.TERRITORIAL:
            self.stats['territorial'] += 1
            self.engine_performance += 5
        elif self.specialization == Specialization.ECONOMIC:
            self.stats['economic'] += 1
            self.engine_performance += 3
        elif self.specialization == Specialization.SOCIAL:
            self.stats['social'] += 1
            self.engine_performance += 4
        elif self.specialization == Specialization.TECHNOLOGICAL:
            self.stats['technological'] += 1
            self.engine_performance += 6

        if logic_status == "failed":
            self.anomalies += 1
            if self.anomalies > 5:
                self.state = MovementState.ANOMALOUS
        else:
            if self.engine_performance > 90:
                self.state = MovementState.SYNCHRONIZED

        return MovementResult(
            success=True,
            stat_changes=self.stats,
            performance_impact=self.engine_performance,
            narrative_events=["Moved in direction: " + direction]
        )

    def calculate_available_movements(self, current, target):
        # Simplified path calculation
        paths = ["Direct Path", "Alternate Path"]
        if self.specialization == Specialization.TERRITORIAL:
            paths.append("Siege Path")
        return MovementOptions(paths=paths)

# Create a simulation based on the CSV data
def run_simulation():
    controller = PrimeMovementController(Specialization.TERRITORIAL)
    simulation_data = []
    
    # Directions and logic status from the CSV
    movements = [
        ("East", "success"), ("South", "failed"), ("North", "failed"), ("West", "success"),
        ("West", "success"), ("West", "success"), ("South", "failed"), ("South", "failed"),
        ("South", "success"), ("East", "failed"), ("West", "success"), ("North", "success"),
        ("West", "success"), ("North", "success"), ("North", "failed"), ("North", "success"),
        ("North", "success"), ("West", "success"), ("South", "success"), ("East", "success")
    ]
    
    for step, (direction, logic_status) in enumerate(movements, 1):
        result = controller.execute_movement(direction, logic_status)
        options = controller.calculate_available_movements("Start", "End")
        
        simulation_data.append({
            "Step": step,
            "Direction": direction,
            "Logic Status": logic_status,
            "Specialization": controller.specialization.value,
            "Territorial": controller.stats['territorial'],
            "Economic": controller.stats['economic'],
            "Social": controller.stats['social'],
            "Technological": controller.stats['technological'],
            "Engine Performance": controller.engine_performance,
            "Movement State": controller.state.value,
            "Available Paths": " | ".join(options.paths),
            "Narrative Events": result.narrative_events[0]
        })
    
    return pd.DataFrame(simulation_data)

# Run the simulation
simulation_df = run_simulation()

# Create visualizations
fig, axes = plt.subplots(2, 2, figsize=(15, 10))
fig.suptitle('Prime Movement Simulation Analysis', fontsize=16)

# 1. Engine Performance Over Time
axes[0, 0].plot(simulation_df['Step'], simulation_df['Engine Performance'], marker='o', linewidth=2)
axes[0, 0].set_title('Engine Performance Over Time')
axes[0, 0].set_xlabel('Step')
axes[0, 0].set_ylabel('Performance')
axes[0, 0].grid(True)

# 2. Movement State Transitions
state_changes = simulation_df[simulation_df['Movement State'] != simulation_df['Movement State'].shift()]
for idx, row in state_changes.iterrows():
    axes[0, 1].axvline(x=row['Step'], color='red', linestyle='--', alpha=0.7)
axes[0, 1].plot(simulation_df['Step'], simulation_df['Engine Performance'], marker='o', linewidth=2)
axes[0, 1].set_title('State Transitions (Vertical Lines)')
axes[0, 1].set_xlabel('Step')
axes[0, 1].set_ylabel('Performance')
axes[0, 1].grid(True)

# 3. Success vs Failed Movements
success_count = simulation_df[simulation_df['Logic Status'] == 'success'].shape[0]
failed_count = simulation_df[simulation_df['Logic Status'] == 'failed'].shape[0]
axes[1, 0].bar(['Success', 'Failed'], [success_count, failed_count], color=['green', 'red'])
axes[1, 0].set_title('Success vs Failed Movements')
axes[1, 0].set_ylabel('Count')

# 4. Direction Distribution
direction_counts = simulation_df['Direction'].value_counts()
axes[1, 1].pie(direction_counts.values, labels=direction_counts.index, autopct='%1.1f%%')
axes[1, 1].set_title('Movement Direction Distribution')

plt.tight_layout()
plt.show()

# Print the simulation results
print("Prime Movement Simulation Results:")
print("="*50)
print(simulation_df.to_string(index=False))

# Print summary statistics
print("\nSimulation Summary:")
print("="*50)
print(f"Final Engine Performance: {simulation_df['Engine Performance'].iloc[-1]}")
print(f"Final Movement State: {simulation_df['Movement State'].iloc[-1]}")
print(f"Total Territorial Progress: {simulation_df['Territorial'].iloc[-1]}")
print(f"Success Rate: {success_count / len(simulation_df) * 100:.1f}%")