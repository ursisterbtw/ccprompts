#!/usr/bin/env python3
"""
Stunning Dark Mode Visualizations for Beta-Prompts
Creates jaw-dropping visualizations showcasing rich prompt optimization data
"""

import warnings
from dataclasses import dataclass
from datetime import datetime, timedelta
from typing import Any

import matplotlib.pyplot as plt
import numpy as np
from matplotlib import patches
from matplotlib.patches import Circle, Rectangle

warnings.filterwarnings("ignore")

# Dark theme configuration
DARK_THEME = {
    "background": "#0a0a0a",  # Deep black
    "surface": "#1a1a1a",  # Dark surface
    "primary": "#00d4ff",  # Cyan accent
    "secondary": "#ff6b35",  # Orange accent
    "success": "#00ff88",  # Green success
    "warning": "#ffb800",  # Amber warning
    "error": "#ff4757",  # Red error
    "text_primary": "#ffffff",  # White text
    "text_secondary": "#a0a0a0",  # Gray text
    "grid": "#2a2a2a",  # Grid lines
    "gradient_start": "#1a1a2e",  # Gradient start
    "gradient_end": "#16213e",  # Gradient end
    "neon_blue": "#00ffff",  # Neon blue
    "neon_pink": "#ff00ff",  # Neon pink
    "neon_green": "#39ff14",  # Neon green
    "purple": "#8b5cf6",  # Purple accent
    "gold": "#ffd700",  # Gold accent
}


@dataclass
class VisualizationData:
    """Rich data structure for comprehensive visualizations"""

    optimization_sessions: list[dict[str, Any]]
    performance_metrics: dict[str, list[float]]
    technique_effectiveness: dict[str, dict[str, float]]
    domain_analysis: dict[str, dict[str, Any]]
    temporal_trends: dict[str, list[tuple[str, float]]]
    quality_distributions: dict[str, list[float]]
    comparative_analysis: dict[str, dict[str, float]]
    network_relationships: dict[str, list[tuple[str, str, float]]]


class DarkModeVisualizer:
    """
    Creates stunning dark mode visualizations for prompt optimization data
    """

    def __init__(self):
        self.setup_matplotlib_dark_theme()
        self.setup_plotly_dark_theme()

    def setup_matplotlib_dark_theme(self):
        """Configure matplotlib for dark mode"""
        plt.style.use("dark_background")

        # Custom dark theme
        plt.rcParams.update(
            {
                "figure.facecolor": DARK_THEME["background"],
                "axes.facecolor": DARK_THEME["surface"],
                "axes.edgecolor": DARK_THEME["grid"],
                "axes.labelcolor": DARK_THEME["text_primary"],
                "axes.axisbelow": True,
                "axes.grid": True,
                "grid.color": DARK_THEME["grid"],
                "grid.alpha": 0.3,
                "text.color": DARK_THEME["text_primary"],
                "xtick.color": DARK_THEME["text_secondary"],
                "ytick.color": DARK_THEME["text_secondary"],
                "font.size": 11,
                "font.family": "DejaVu Sans",
                "lines.linewidth": 2.5,
                "patch.edgecolor": "none",
                "figure.autolayout": True,
                "savefig.facecolor": DARK_THEME["background"],
                "savefig.edgecolor": "none",
                "savefig.dpi": 300,
                "savefig.bbox": "tight",
            }
        )

    def setup_plotly_dark_theme(self):
        """Configure plotly for dark mode"""
        self.plotly_template = {
            "layout": {
                "paper_bgcolor": DARK_THEME["background"],
                "plot_bgcolor": DARK_THEME["surface"],
                "colorway": [
                    DARK_THEME["primary"],
                    DARK_THEME["secondary"],
                    DARK_THEME["success"],
                    DARK_THEME["warning"],
                    DARK_THEME["neon_blue"],
                    DARK_THEME["neon_pink"],
                    DARK_THEME["purple"],
                    DARK_THEME["gold"],
                ],
                "font": {"color": DARK_THEME["text_primary"], "family": "Arial Black"},
                "xaxis": {
                    "gridcolor": DARK_THEME["grid"],
                    "linecolor": DARK_THEME["grid"],
                    "tickcolor": DARK_THEME["text_secondary"],
                    "zerolinecolor": DARK_THEME["grid"],
                },
                "yaxis": {
                    "gridcolor": DARK_THEME["grid"],
                    "linecolor": DARK_THEME["grid"],
                    "tickcolor": DARK_THEME["text_secondary"],
                    "zerolinecolor": DARK_THEME["grid"],
                },
                "legend": {
                    "bgcolor": DARK_THEME["surface"],
                    "bordercolor": DARK_THEME["grid"],
                    "font": {"color": DARK_THEME["text_primary"]},
                },
            }
        }

    def create_optimization_dashboard(
        self,
        data: VisualizationData,
        output_file: str = "optimization_dashboard_dark.png",
    ) -> str:
        """
        Create a comprehensive optimization dashboard with multiple panels
        """

        # Create figure with sophisticated layout
        fig = plt.figure(figsize=(24, 16))
        gs = fig.add_gridspec(
            4, 4, hspace=0.3, wspace=0.3, left=0.05, right=0.95, top=0.95, bottom=0.05
        )

        # Main title with gradient effect
        fig.suptitle(
            "PROMPT OPTIMIZATION INTELLIGENCE DASHBOARD",
            fontsize=28,
            fontweight="bold",
            color=DARK_THEME["primary"],
            y=0.98,
        )

        # Panel 1: Performance Evolution (top-left, spanning 2 columns)
        ax1 = fig.add_subplot(gs[0, :2])
        self._create_performance_evolution(ax1, data)

        # Panel 2: Technique Effectiveness Radar (top-right, spanning 2 columns)
        ax2 = fig.add_subplot(gs[0, 2:], projection="polar")
        self._create_technique_radar(ax2, data)

        # Panel 3: Quality Distribution Violin Plot (second row, left)
        ax3 = fig.add_subplot(gs[1, :2])
        self._create_quality_distribution(ax3, data)

        # Panel 4: Domain Performance Heatmap (second row, right)
        ax4 = fig.add_subplot(gs[1, 2:])
        self._create_domain_heatmap(ax4, data)

        # Panel 5: Optimization Network Graph (third row, spanning all)
        ax5 = fig.add_subplot(gs[2, :])
        self._create_network_graph(ax5, data)

        # Panel 6: ROI Analysis (bottom-left)
        ax6 = fig.add_subplot(gs[3, :2])
        self._create_roi_analysis(ax6, data)

        # Panel 7: Predictive Analytics (bottom-right)
        ax7 = fig.add_subplot(gs[3, 2:])
        self._create_predictive_analytics(ax7, data)

        # Add subtle grid overlay
        self._add_grid_overlay(fig)

        # Save with high quality
        plt.savefig(
            output_file,
            dpi=300,
            bbox_inches="tight",
            facecolor=DARK_THEME["background"],
            edgecolor="none",
        )
        plt.close()

        return output_file

    def _create_performance_evolution(self, ax, data: VisualizationData):
        """Performance evolution with gradient fills and trend indicators"""

        # Generate sample data if not provided
        sessions = data.optimization_sessions or self._generate_sample_sessions()

        dates = [datetime.now() - timedelta(days=30 - i) for i in range(len(sessions))]
        improvements = [
            session.get("avg_improvement", np.random.normal(0.25, 0.1))
            for session in sessions
        ]
        quality_scores = [
            session.get("avg_quality", np.random.normal(0.8, 0.1))
            for session in sessions
        ]

        # Create gradient background
        gradient = np.linspace(0, 1, 256).reshape(256, -1)
        gradient = np.vstack((gradient, gradient))
        ax.imshow(
            gradient,
            aspect="auto",
            cmap="viridis",
            alpha=0.1,
            extent=[0, len(dates), 0, 1],
        )

        # Plot main lines with glow effect
        for i in range(3):  # Create glow effect
            alpha = 0.3 - i * 0.1
            linewidth = 8 - i * 2
            ax.plot(
                range(len(dates)),
                improvements,
                color=DARK_THEME["primary"],
                alpha=alpha,
                linewidth=linewidth,
                label="Improvement Rate" if i == 0 else "",
            )
            ax.plot(
                range(len(dates)),
                quality_scores,
                color=DARK_THEME["secondary"],
                alpha=alpha,
                linewidth=linewidth,
                label="Quality Score" if i == 0 else "",
            )

        # Add trend arrows
        self._add_trend_arrows(ax, improvements, DARK_THEME["primary"])
        self._add_trend_arrows(ax, quality_scores, DARK_THEME["secondary"])

        # Styling
        ax.set_title(
            "PERFORMANCE EVOLUTION TRAJECTORY",
            fontsize=16,
            fontweight="bold",
            color=DARK_THEME["text_primary"],
            pad=20,
        )
        ax.set_xlabel("Timeline", fontweight="bold", color=DARK_THEME["text_secondary"])
        ax.set_ylabel(
            "Performance Metrics", fontweight="bold", color=DARK_THEME["text_secondary"]
        )
        ax.legend(loc="upper left", framealpha=0.8, fancybox=True, shadow=True)

        # Add performance indicators
        current_improvement = improvements[-1]
        current_quality = quality_scores[-1]

        # Performance badges
        self._add_performance_badge(
            ax,
            0.02,
            0.95,
            f"Current Improvement: {current_improvement:.1%}",
            (
                DARK_THEME["success"]
                if current_improvement > 0.2
                else DARK_THEME["warning"]
            ),
        )
        self._add_performance_badge(
            ax,
            0.02,
            0.85,
            f"Current Quality: {current_quality:.2f}",
            DARK_THEME["success"] if current_quality > 0.8 else DARK_THEME["warning"],
        )

    def _create_technique_radar(self, ax, data: VisualizationData):
        """Technique effectiveness radar chart with neon styling"""

        # Sample technique data
        techniques = [
            "Role Definition",
            "XML Structure",
            "Chain of Thought",
            "Output Format",
            "Examples",
            "Structured Instructions",
            "Context Adaptation",
        ]
        effectiveness = [0.85, 0.92, 0.78, 0.88, 0.75, 0.90, 0.82]

        # Calculate angles for radar
        angles = np.linspace(0, 2 * np.pi, len(techniques), endpoint=False).tolist()
        effectiveness += effectiveness[:1]  # Complete the circle
        angles += angles[:1]

        # Clear axis for polar plot
        ax.clear()

        # Create gradient fill
        ax.fill(angles, effectiveness, color=DARK_THEME["primary"], alpha=0.3)
        ax.plot(
            angles,
            effectiveness,
            color=DARK_THEME["neon_blue"],
            linewidth=4,
            linestyle="-",
            marker="o",
            markersize=8,
            markerfacecolor=DARK_THEME["neon_green"],
        )

        # Add technique labels with better positioning
        ax.set_xticks(angles[:-1])
        ax.set_xticklabels(
            techniques, fontsize=10, fontweight="bold", color=DARK_THEME["text_primary"]
        )

        # Styling
        ax.set_ylim(0, 1)
        ax.set_title(
            "TECHNIQUE EFFECTIVENESS MATRIX",
            fontsize=16,
            fontweight="bold",
            color=DARK_THEME["text_primary"],
            pad=30,
        )
        ax.grid(True, alpha=0.3, color=DARK_THEME["grid"])
        ax.set_facecolor(DARK_THEME["surface"])

        # Add effectiveness rings
        for level in [0.2, 0.4, 0.6, 0.8, 1.0]:
            ax.plot(
                angles,
                [level] * len(angles),
                "--",
                alpha=0.5,
                color=DARK_THEME["grid"],
                linewidth=1,
            )

    def _create_quality_distribution(self, ax, data: VisualizationData):
        """Quality distribution with violin plots and statistical overlays"""

        # Generate quality data by category
        categories = ["Baseline", "Optimized", "Generated", "Templated"]
        quality_data = {
            "Baseline": np.random.normal(0.65, 0.15, 100),
            "Optimized": np.random.normal(0.85, 0.10, 100),
            "Generated": np.random.normal(0.80, 0.12, 100),
            "Templated": np.random.normal(0.88, 0.08, 100),
        }

        # Create violin plots with custom colors
        colors = [
            DARK_THEME["error"],
            DARK_THEME["success"],
            DARK_THEME["primary"],
            DARK_THEME["secondary"],
        ]

        positions = range(len(categories))
        violin_parts = ax.violinplot(
            [quality_data[cat] for cat in categories],
            positions=positions,
            showmeans=True,
            showmedians=True,
        )

        # Customize violin plots
        for i, pc in enumerate(violin_parts["bodies"]):
            pc.set_facecolor(colors[i])
            pc.set_alpha(0.7)
            pc.set_edgecolor(colors[i])
            pc.set_linewidth(2)

        # Add statistical annotations
        for i, cat in enumerate(categories):
            data_points = quality_data[cat]
            mean_val = np.mean(data_points)
            std_val = np.std(data_points)

            # Add mean indicator
            ax.scatter(
                i,
                mean_val,
                color=DARK_THEME["neon_green"],
                s=100,
                marker="D",
                zorder=10,
                edgecolor="white",
                linewidth=2,
            )

            # Add confidence interval
            ax.errorbar(
                i,
                mean_val,
                yerr=std_val,
                color=DARK_THEME["text_secondary"],
                capsize=5,
                capthick=2,
                alpha=0.8,
            )

            # Add text annotation
            ax.text(
                i,
                mean_val + std_val + 0.05,
                f"{mean_val:.2f}±{std_val:.2f}",
                ha="center",
                va="bottom",
                fontweight="bold",
                color=DARK_THEME["text_primary"],
                fontsize=10,
            )

        # Styling
        ax.set_title(
            "QUALITY DISTRIBUTION ANALYSIS",
            fontsize=16,
            fontweight="bold",
            color=DARK_THEME["text_primary"],
            pad=20,
        )
        ax.set_xlabel(
            "Prompt Categories", fontweight="bold", color=DARK_THEME["text_secondary"]
        )
        ax.set_ylabel(
            "Quality Score", fontweight="bold", color=DARK_THEME["text_secondary"]
        )
        ax.set_xticks(positions)
        ax.set_xticklabels(categories, fontweight="bold")
        ax.set_ylim(0, 1.1)

        # Add quality thresholds
        for threshold, label, color in [
            (0.8, "Excellent", DARK_THEME["success"]),
            (0.6, "Good", DARK_THEME["warning"]),
            (0.4, "Poor", DARK_THEME["error"]),
        ]:
            ax.axhline(y=threshold, color=color, linestyle="--", alpha=0.6, linewidth=2)
            ax.text(
                len(categories) - 0.5,
                threshold + 0.02,
                label,
                color=color,
                fontweight="bold",
                ha="right",
            )

    def _create_domain_heatmap(self, ax, data: VisualizationData):
        """Domain performance heatmap with advanced styling"""

        # Sample domain data
        domains = [
            "Software Eng",
            "Data Science",
            "Business",
            "Marketing",
            "Research",
            "Creative",
        ]
        metrics = ["Quality", "Efficiency", "Innovation", "Consistency", "Scalability"]

        # Generate performance matrix
        performance_matrix = np.random.rand(len(domains), len(metrics)) * 0.4 + 0.6

        # Create heatmap with custom colormap
        im = ax.imshow(
            performance_matrix,
            cmap="plasma",
            aspect="auto",
            vmin=0.6,
            vmax=1.0,
            interpolation="bilinear",
        )

        # Add text annotations with adaptive coloring
        for i in range(len(domains)):
            for j in range(len(metrics)):
                value = performance_matrix[i, j]
                text_color = (
                    DARK_THEME["background"]
                    if value > 0.8
                    else DARK_THEME["text_primary"]
                )
                ax.text(
                    j,
                    i,
                    f"{value:.2f}",
                    ha="center",
                    va="center",
                    fontweight="bold",
                    color=text_color,
                    fontsize=11,
                )

        # Styling
        ax.set_title(
            "DOMAIN PERFORMANCE MATRIX",
            fontsize=16,
            fontweight="bold",
            color=DARK_THEME["text_primary"],
            pad=20,
        )
        ax.set_xticks(range(len(metrics)))
        ax.set_yticks(range(len(domains)))
        ax.set_xticklabels(metrics, fontweight="bold", rotation=45, ha="right")
        ax.set_yticklabels(domains, fontweight="bold")

        # Add colorbar
        cbar = plt.colorbar(im, ax=ax, fraction=0.046, pad=0.04)
        cbar.set_label(
            "Performance Score", fontweight="bold", color=DARK_THEME["text_primary"]
        )
        cbar.ax.tick_params(colors=DARK_THEME["text_primary"])

        # Add performance indicators
        for i, _domain in enumerate(domains):
            avg_performance = np.mean(performance_matrix[i, :])
            indicator_color = (
                DARK_THEME["success"]
                if avg_performance > 0.85
                else (
                    DARK_THEME["warning"]
                    if avg_performance > 0.75
                    else DARK_THEME["error"]
                )
            )

            # Add colored border
            rect = Rectangle(
                (-0.5, i - 0.5),
                len(metrics),
                1,
                linewidth=3,
                edgecolor=indicator_color,
                facecolor="none",
                alpha=0.8,
            )
            ax.add_patch(rect)

    def _create_network_graph(self, ax, data: VisualizationData):
        """Optimization technique relationship network"""

        # Define nodes and relationships
        techniques = [
            "Role\nDefinition",
            "XML\nStructure",
            "Chain of\nThought",
            "Output\nFormat",
            "Examples",
            "Structured\nInstructions",
        ]

        # Position nodes in a circle
        n_nodes = len(techniques)
        angles = np.linspace(0, 2 * np.pi, n_nodes, endpoint=False)
        radius = 0.35
        center_x, center_y = 0.5, 0.5

        node_positions = []
        for angle in angles:
            x = center_x + radius * np.cos(angle)
            y = center_y + radius * np.sin(angle)
            node_positions.append((x, y))

        # Draw connections with varying strengths
        connections = [
            (0, 1, 0.8),
            (0, 2, 0.6),
            (0, 5, 0.9),  # Role Definition connections
            (1, 3, 0.7),
            (1, 4, 0.5),
            (1, 5, 0.8),  # XML Structure connections
            (2, 3, 0.9),
            (2, 4, 0.6),  # Chain of Thought connections
            (3, 4, 0.7),
            (3, 5, 0.6),  # Output Format connections
            (4, 5, 0.5),  # Examples connections
        ]

        # Draw connections
        for start, end, strength in connections:
            x1, y1 = node_positions[start]
            x2, y2 = node_positions[end]

            # Create curved connection
            mid_x = (x1 + x2) / 2 + np.random.normal(0, 0.05)
            mid_y = (y1 + y2) / 2 + np.random.normal(0, 0.05)

            # Line thickness based on strength
            linewidth = strength * 8
            alpha = strength * 0.8

            # Draw connection with glow effect
            for i in range(3):
                glow_width = linewidth + (2 - i) * 3
                glow_alpha = alpha * (0.3 - i * 0.1)
                ax.plot(
                    [x1, mid_x, x2],
                    [y1, mid_y, y2],
                    color=DARK_THEME["primary"],
                    linewidth=glow_width,
                    alpha=glow_alpha,
                    solid_capstyle="round",
                )

        # Draw nodes
        for i, (x, y) in enumerate(node_positions):
            # Node circle with gradient effect
            circle = Circle(
                (x, y),
                0.08,
                facecolor=DARK_THEME["secondary"],
                edgecolor=DARK_THEME["neon_blue"],
                linewidth=3,
                alpha=0.9,
            )
            ax.add_patch(circle)

            # Inner glow
            inner_circle = Circle(
                (x, y), 0.06, facecolor=DARK_THEME["neon_green"], alpha=0.6
            )
            ax.add_patch(inner_circle)

            # Technique label
            ax.text(
                x,
                y - 0.12,
                techniques[i],
                ha="center",
                va="top",
                fontweight="bold",
                fontsize=10,
                color=DARK_THEME["text_primary"],
                bbox={
                    "boxstyle": "round,pad=0.3",
                    "facecolor": DARK_THEME["surface"],
                    "edgecolor": DARK_THEME["grid"],
                    "alpha": 0.8,
                },
            )

        # Central hub
        hub_circle = Circle(
            (center_x, center_y),
            0.05,
            facecolor=DARK_THEME["gold"],
            edgecolor=DARK_THEME["neon_pink"],
            linewidth=2,
            alpha=0.9,
        )
        ax.add_patch(hub_circle)

        # Styling
        ax.set_xlim(0, 1)
        ax.set_ylim(0, 1)
        ax.set_aspect("equal")
        ax.axis("off")
        ax.set_title(
            "OPTIMIZATION TECHNIQUE SYNERGY NETWORK",
            fontsize=16,
            fontweight="bold",
            color=DARK_THEME["text_primary"],
            pad=20,
            y=0.95,
        )

        # Add legend
        legend_elements = [
            plt.Line2D(
                [0],
                [0],
                color=DARK_THEME["primary"],
                linewidth=6,
                alpha=0.8,
                label="Strong Synergy",
            ),
            plt.Line2D(
                [0],
                [0],
                color=DARK_THEME["primary"],
                linewidth=3,
                alpha=0.6,
                label="Medium Synergy",
            ),
            plt.Line2D(
                [0],
                [0],
                color=DARK_THEME["primary"],
                linewidth=1,
                alpha=0.4,
                label="Weak Synergy",
            ),
        ]
        ax.legend(
            handles=legend_elements,
            loc="upper right",
            bbox_to_anchor=(0.98, 0.98),
            framealpha=0.8,
            fancybox=True,
        )

    def _create_roi_analysis(self, ax, data: VisualizationData):
        """ROI analysis with investment vs return visualization"""

        # Sample ROI data
        techniques = [
            "Role\nDef",
            "XML\nStruct",
            "Chain\nThought",
            "Output\nFormat",
            "Examples",
            "Struct\nInstr",
        ]
        implementation_effort = [3, 4, 5, 2, 3, 4]  # 1-5 scale
        performance_gain = [
            0.15,
            0.25,
            0.30,
            0.12,
            0.18,
            0.22,
        ]  # Percentage improvement
        usage_frequency = [85, 92, 78, 95, 70, 88]  # Percentage of usage

        # Calculate ROI score
        roi_scores = [
            gain / effort * freq / 100
            for gain, effort, freq in zip(
                performance_gain, implementation_effort, usage_frequency
            )
        ]

        # Create bubble chart
        colors = [
            DARK_THEME["success"],
            DARK_THEME["primary"],
            DARK_THEME["secondary"],
            DARK_THEME["warning"],
            DARK_THEME["purple"],
            DARK_THEME["neon_blue"],
        ]

        for i, (effort, gain, freq, roi, color) in enumerate(
            zip(
                implementation_effort,
                performance_gain,
                usage_frequency,
                roi_scores,
                colors,
            )
        ):
            # Bubble size based on usage frequency (nonlinear scaling and capped)
            size = min((freq**0.5) * 20, 200)

            # Plot bubble with glow effect
            for j in range(3):
                glow_size = min(size + (2 - j) * 50, 250)
                glow_alpha = 0.3 - j * 0.1
                ax.scatter(effort, gain, s=glow_size, color=color, alpha=glow_alpha)

            # Main bubble
            ax.scatter(
                effort,
                gain,
                s=size,
                color=color,
                alpha=0.8,
                edgecolor="white",
                linewidth=2,
                zorder=10,
            )

            # Label
            ax.annotate(
                f"{techniques[i]}\nROI: {roi:.2f}",
                (effort, gain),
                xytext=(10, 10),
                textcoords="offset points",
                fontweight="bold",
                color=DARK_THEME["text_primary"],
                fontsize=9,
                bbox={"boxstyle": "round,pad=0.3", "facecolor": color, "alpha": 0.7},
            )

        # ROI zones
        high_roi_zone = patches.Polygon(
            [(1, 0.25), (3, 0.35), (1, 0.35)],
            alpha=0.2,
            facecolor=DARK_THEME["success"],
        )
        med_roi_zone = patches.Polygon(
            [(3, 0.15), (5, 0.25), (3, 0.35), (1, 0.25)],
            alpha=0.15,
            facecolor=DARK_THEME["warning"],
        )
        low_roi_zone = patches.Polygon(
            [(3, 0.05), (5, 0.15), (5, 0.05)], alpha=0.1, facecolor=DARK_THEME["error"]
        )

        ax.add_patch(high_roi_zone)
        ax.add_patch(med_roi_zone)
        ax.add_patch(low_roi_zone)

        # Zone labels
        ax.text(
            1.5,
            0.32,
            "HIGH ROI",
            fontweight="bold",
            color=DARK_THEME["success"],
            fontsize=12,
            ha="center",
            alpha=0.8,
        )
        ax.text(
            3,
            0.25,
            "MEDIUM ROI",
            fontweight="bold",
            color=DARK_THEME["warning"],
            fontsize=10,
            ha="center",
            alpha=0.8,
        )
        ax.text(
            4.5,
            0.1,
            "LOW ROI",
            fontweight="bold",
            color=DARK_THEME["error"],
            fontsize=10,
            ha="center",
            alpha=0.8,
        )

        # Styling
        ax.set_title(
            "TECHNIQUE ROI ANALYSIS",
            fontsize=16,
            fontweight="bold",
            color=DARK_THEME["text_primary"],
            pad=20,
        )
        ax.set_xlabel(
            "Implementation Effort",
            fontweight="bold",
            color=DARK_THEME["text_secondary"],
        )
        ax.set_ylabel(
            "Performance Gain", fontweight="bold", color=DARK_THEME["text_secondary"]
        )
        ax.set_xlim(0.5, 5.5)
        ax.set_ylim(0, 0.4)

        # Add size legend
        size_legend = [
            plt.scatter(
                [],
                [],
                s=300,
                color=DARK_THEME["text_secondary"],
                alpha=0.6,
                label="30% Usage",
            ),
            plt.scatter(
                [],
                [],
                s=600,
                color=DARK_THEME["text_secondary"],
                alpha=0.6,
                label="60% Usage",
            ),
            plt.scatter(
                [],
                [],
                s=900,
                color=DARK_THEME["text_secondary"],
                alpha=0.6,
                label="90% Usage",
            ),
        ]
        legend1 = ax.legend(
            handles=size_legend,
            title="Usage Frequency",
            loc="upper left",
            framealpha=0.8,
            title_fontsize=10,
        )
        legend1.get_title().set_color(DARK_THEME["text_primary"])

    def _create_predictive_analytics(self, ax, data: VisualizationData):
        """Predictive analytics with trend forecasting"""

        # Historical data
        weeks = list(range(-12, 1))  # Last 12 weeks plus current
        historical_performance = [
            0.65 + 0.02 * i + np.random.normal(0, 0.03) for i in range(13)
        ]

        # Future predictions
        future_weeks = list(range(1, 9))  # Next 8 weeks
        predicted_performance = []
        uncertainty_upper = []
        uncertainty_lower = []

        for i in future_weeks:
            # Base trend with some acceleration
            base_prediction = historical_performance[-1] + 0.015 * i
            # Add uncertainty that increases with time
            uncertainty = 0.02 * np.sqrt(i)

            predicted_performance.append(base_prediction)
            uncertainty_upper.append(base_prediction + uncertainty)
            uncertainty_lower.append(base_prediction - uncertainty)

        all_weeks = weeks + future_weeks
        all_performance = historical_performance + predicted_performance

        # Plot historical data
        ax.plot(
            weeks,
            historical_performance,
            color=DARK_THEME["primary"],
            linewidth=4,
            marker="o",
            markersize=6,
            label="Historical Performance",
            markerfacecolor=DARK_THEME["neon_green"],
            markeredgecolor="white",
        )

        # Plot predictions with uncertainty
        ax.plot(
            future_weeks,
            predicted_performance,
            color=DARK_THEME["secondary"],
            linewidth=4,
            linestyle="--",
            marker="s",
            markersize=6,
            label="Predicted Performance",
            markerfacecolor=DARK_THEME["gold"],
        )

        # Uncertainty band
        ax.fill_between(
            future_weeks,
            uncertainty_lower,
            uncertainty_upper,
            color=DARK_THEME["secondary"],
            alpha=0.3,
            label="Confidence Interval",
        )

        # Add trend lines
        z_historical = np.polyfit(weeks, historical_performance, 1)
        p_historical = np.poly1d(z_historical)
        ax.plot(
            weeks,
            p_historical(weeks),
            color=DARK_THEME["success"],
            linewidth=2,
            alpha=0.8,
            linestyle=":",
        )

        z_future = np.polyfit(future_weeks, predicted_performance, 1)
        p_future = np.poly1d(z_future)
        ax.plot(
            future_weeks,
            p_future(future_weeks),
            color=DARK_THEME["warning"],
            linewidth=2,
            alpha=0.8,
            linestyle=":",
        )

        # Add milestone markers
        milestones = [
            (4, predicted_performance[3], "Q1 Target"),
            (8, predicted_performance[7], "Q2 Target"),
        ]

        for week, performance, label in milestones:
            ax.scatter(
                week,
                performance,
                s=200,
                color=DARK_THEME["gold"],
                marker="*",
                zorder=10,
                edgecolor="white",
                linewidth=2,
            )
            ax.annotate(
                label,
                (week, performance),
                xytext=(10, 20),
                textcoords="offset points",
                fontweight="bold",
                color=DARK_THEME["text_primary"],
                fontsize=10,
                bbox={
                    "boxstyle": "round,pad=0.3",
                    "facecolor": DARK_THEME["gold"],
                    "alpha": 0.8,
                },
                arrowprops={"arrowstyle": "->", "color": DARK_THEME["gold"]},
            )

        # Styling
        ax.set_title(
            "PREDICTIVE PERFORMANCE ANALYTICS",
            fontsize=16,
            fontweight="bold",
            color=DARK_THEME["text_primary"],
            pad=20,
        )
        ax.set_xlabel(
            "Timeline (Weeks)", fontweight="bold", color=DARK_THEME["text_secondary"]
        )
        ax.set_ylabel(
            "Performance Score", fontweight="bold", color=DARK_THEME["text_secondary"]
        )
        ax.legend(loc="upper left", framealpha=0.8, fancybox=True)
        ax.grid(True, alpha=0.3)

        # Add vertical separator
        ax.axvline(
            x=0,
            color=DARK_THEME["text_secondary"],
            linestyle="-",
            alpha=0.5,
            linewidth=2,
        )
        ax.text(
            0,
            ax.get_ylim()[0] + 0.01,
            "NOW",
            ha="center",
            va="bottom",
            fontweight="bold",
            color=DARK_THEME["text_secondary"],
            rotation=90,
        )

        # Performance indicators
        current_trend = (historical_performance[-1] - historical_performance[-4]) / 3
        future_trend = (predicted_performance[-1] - predicted_performance[0]) / len(
            predicted_performance
        )

        trend_color = (
            DARK_THEME["success"]
            if future_trend > current_trend
            else DARK_THEME["warning"]
        )
        ax.text(
            0.02,
            0.98,
            f"Trend Acceleration: {(future_trend - current_trend)*100:.1f}%/week",
            transform=ax.transAxes,
            fontweight="bold",
            color=trend_color,
            bbox={"boxstyle": "round,pad=0.3", "facecolor": trend_color, "alpha": 0.3},
            verticalalignment="top",
        )

    def _add_trend_arrows(self, ax, data, color):
        """Add trend arrows to show direction"""

        # Calculate trend over last few points
        if len(data) >= 3:
            trend = (data[-1] - data[-3]) / 2

            # Position arrow
            x_pos = len(data) - 1
            y_pos = data[-1]

            if abs(trend) > 0.01:  # Only show significant trends
                arrow_props = {
                    "arrowstyle": "->" if trend > 0 else "<-",
                    "color": color,
                    "lw": 3,
                    "alpha": 0.8,
                }

                # Arrow direction based on trend
                dx = 0.5 if trend > 0 else -0.5
                dy = trend * 10

                ax.annotate(
                    "",
                    xy=(x_pos + dx, y_pos + dy),
                    xytext=(x_pos, y_pos),
                    arrowprops=arrow_props,
                )

    def _add_performance_badge(self, ax, x, y, text, color):
        """Add performance indicator badge"""

        # Create rounded rectangle
        bbox = {
            "boxstyle": "round,pad=0.5",
            "facecolor": color,
            "alpha": 0.8,
            "edgecolor": "white",
            "linewidth": 2,
        }

        ax.text(
            x,
            y,
            text,
            transform=ax.transAxes,
            fontweight="bold",
            color=DARK_THEME["background"],
            bbox=bbox,
            fontsize=10,
            verticalalignment="top",
        )

    def _add_grid_overlay(self, fig):
        """Add subtle grid overlay to entire figure"""

        # Create subtle pattern overlay
        overlay_ax = fig.add_axes([0, 0, 1, 1], facecolor="none")
        overlay_ax.set_xlim(0, 1)
        overlay_ax.set_ylim(0, 1)
        overlay_ax.axis("off")

        # Add corner decorations
        corner_size = 0.03
        corner_color = DARK_THEME["primary"]

        # Top-left corner
        overlay_ax.plot(
            [0, corner_size], [1, 1], color=corner_color, linewidth=3, alpha=0.6
        )
        overlay_ax.plot(
            [0, 0], [1, 1 - corner_size], color=corner_color, linewidth=3, alpha=0.6
        )

        # Top-right corner
        overlay_ax.plot(
            [1 - corner_size, 1], [1, 1], color=corner_color, linewidth=3, alpha=0.6
        )
        overlay_ax.plot(
            [1, 1], [1, 1 - corner_size], color=corner_color, linewidth=3, alpha=0.6
        )

        # Bottom-left corner
        overlay_ax.plot(
            [0, corner_size], [0, 0], color=corner_color, linewidth=3, alpha=0.6
        )
        overlay_ax.plot(
            [0, 0], [0, corner_size], color=corner_color, linewidth=3, alpha=0.6
        )

        # Bottom-right corner
        overlay_ax.plot(
            [1 - corner_size, 1], [0, 0], color=corner_color, linewidth=3, alpha=0.6
        )
        overlay_ax.plot(
            [1, 1], [0, corner_size], color=corner_color, linewidth=3, alpha=0.6
        )

    def _generate_sample_sessions(self) -> list[dict[str, Any]]:
        """Generate sample optimization session data"""

        sessions = []
        for i in range(20):
            session = {
                "session_id": f"opt_session_{i:03d}",
                "date": (datetime.now() - timedelta(days=20 - i)).isoformat(),
                "avg_improvement": np.random.normal(0.25, 0.08),
                "avg_quality": np.random.normal(0.8, 0.1),
                "total_optimizations": np.random.randint(3, 12),
                "techniques_used": np.random.randint(2, 6),
            }
            sessions.append(session)

        return sessions


def main():
    """Test the visualization system"""

    # Create visualizer
    visualizer = DarkModeVisualizer()

    print("=== BETA-PROMPTS VISUALIZATION SYSTEM ===")
    print("Creating jaw-dropping dark mode visualizations...")

    # Generate sample data
    sample_data = VisualizationData(
        optimization_sessions=[],
        performance_metrics={},
        technique_effectiveness={},
        domain_analysis={},
        temporal_trends={},
        quality_distributions={},
        comparative_analysis={},
        network_relationships={},
    )

    # Create comprehensive dashboard
    dashboard_file = visualizer.create_optimization_dashboard(sample_data)
    print(f"📊 Comprehensive dashboard saved: {dashboard_file}")

    return visualizer


if __name__ == "__main__":
    main()
