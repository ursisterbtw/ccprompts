#!/usr/bin/env python3
"""
Interactive Dark Mode Dashboard for Beta-Prompts
Creates stunning interactive visualizations with Plotly and Dash
"""

from datetime import datetime, timedelta
from typing import Any, Optional

import numpy as np
import plotly.graph_objects as go
from plotly.subplots import make_subplots

# Dark theme configuration
DARK_COLORS = {
    "background": "#0a0a0a",
    "paper": "#1a1a1a",
    "surface": "#2a2a2a",
    "primary": "#00d4ff",
    "secondary": "#ff6b35",
    "success": "#00ff88",
    "warning": "#ffb800",
    "error": "#ff4757",
    "text": "#ffffff",
    "text_secondary": "#a0a0a0",
    "grid": "#333333",
    "neon_blue": "#00ffff",
    "neon_pink": "#ff00ff",
    "neon_green": "#39ff14",
    "purple": "#8b5cf6",
    "gold": "#ffd700",
}

PLOTLY_TEMPLATE = {
    "layout": {
        "paper_bgcolor": DARK_COLORS["background"],
        "plot_bgcolor": DARK_COLORS["paper"],
        "font": {"color": DARK_COLORS["text"], "family": "Arial Black", "size": 12},
        "colorway": [
            DARK_COLORS["primary"],
            DARK_COLORS["secondary"],
            DARK_COLORS["success"],
            DARK_COLORS["warning"],
            DARK_COLORS["neon_blue"],
            DARK_COLORS["neon_pink"],
            DARK_COLORS["purple"],
            DARK_COLORS["gold"],
        ],
        "xaxis": {
            "gridcolor": DARK_COLORS["grid"],
            "linecolor": DARK_COLORS["grid"],
            "tickcolor": DARK_COLORS["text_secondary"],
            "zerolinecolor": DARK_COLORS["grid"],
            "title": {"font": {"color": DARK_COLORS["text"]}},
        },
        "yaxis": {
            "gridcolor": DARK_COLORS["grid"],
            "linecolor": DARK_COLORS["grid"],
            "tickcolor": DARK_COLORS["text_secondary"],
            "zerolinecolor": DARK_COLORS["grid"],
            "title": {"font": {"color": DARK_COLORS["text"]}},
        },
        "legend": {
            "bgcolor": DARK_COLORS["surface"],
            "bordercolor": DARK_COLORS["grid"],
            "font": {"color": DARK_COLORS["text"]},
        },
        "title": {"font": {"color": DARK_COLORS["text"], "size": 24}},
    }
}


class InteractiveDashboard:
    """
    Creates stunning interactive dashboards for prompt optimization data
    """

    def __init__(self):
        self.template = PLOTLY_TEMPLATE

    def create_master_dashboard(self, data: Optional[dict] = None) -> go.Figure:
        """
        Create a comprehensive interactive dashboard with multiple subplots
        """

        # Create subplot structure
        fig = make_subplots(
            rows=3,
            cols=3,
            subplot_titles=[
                "🚀 Performance Evolution",
                "🎯 Technique Radar",
                "📊 Quality Distribution",
                "🔥 Domain Heatmap",
                "🌐 Synergy Network",
                "💰 ROI Analysis",
                "🔮 Predictive Analytics",
                "⚡ Real-time Metrics",
                "🏆 Achievement Gallery",
            ],
            specs=[
                [{"type": "scatter"}, {"type": "scatterpolar"}, {"type": "violin"}],
                [{"type": "heatmap"}, {"type": "scatter"}, {"type": "scatter"}],
                [{"type": "scatter"}, {"type": "indicator"}, {"type": "bar"}],
            ],
            vertical_spacing=0.12,
            horizontal_spacing=0.08,
        )

        # Generate sample data if not provided
        if not data:
            data = self._generate_comprehensive_data()

        # 1. Performance Evolution (Row 1, Col 1)
        self._add_performance_evolution(fig, data, row=1, col=1)

        # 2. Technique Radar (Row 1, Col 2)
        self._add_technique_radar(fig, data, row=1, col=2)

        # 3. Quality Distribution (Row 1, Col 3)
        self._add_quality_distribution(fig, data, row=1, col=3)

        # 4. Domain Heatmap (Row 2, Col 1)
        self._add_domain_heatmap(fig, data, row=2, col=1)

        # 5. Synergy Network (Row 2, Col 2)
        self._add_synergy_network(fig, data, row=2, col=2)

        # 6. ROI Analysis (Row 2, Col 3)
        self._add_roi_analysis(fig, data, row=2, col=3)

        # 7. Predictive Analytics (Row 3, Col 1)
        self._add_predictive_analytics(fig, data, row=3, col=1)

        # 8. Real-time Metrics (Row 3, Col 2)
        self._add_realtime_metrics(fig, data, row=3, col=2)

        # 9. Achievement Gallery (Row 3, Col 3)
        self._add_achievement_gallery(fig, data, row=3, col=3)

        # Apply dark theme and styling
        fig.update_layout(**self.template["layout"])
        fig.update_layout(
            title={
                "text": "🌟 BETA-PROMPTS OPTIMIZATION INTELLIGENCE CENTER 🌟",
                "x": 0.5,
                "xanchor": "center",
                "font": {"size": 28, "color": DARK_COLORS["primary"]},
            },
            height=1200,
            showlegend=True,
            margin={"t": 100, "b": 50, "l": 50, "r": 50},
        )

        # Add custom annotations
        self._add_dashboard_annotations(fig)

        return fig

    def _add_performance_evolution(self, fig, data, row, col):
        """Add performance evolution timeline with glow effects"""

        dates = data["dates"]
        improvements = data["improvements"]
        quality_scores = data["quality_scores"]
        confidence_upper = data["confidence_upper"]
        confidence_lower = data["confidence_lower"]

        # Main improvement line with glow
        fig.add_trace(
            go.Scatter(
                x=dates,
                y=improvements,
                mode="lines+markers",
                name="🚀 Improvement Rate",
                line={"color": DARK_COLORS["primary"], "width": 4, "shape": "spline"},
                marker={
                    "size": 8,
                    "color": DARK_COLORS["neon_blue"],
                    "line": {"color": "white", "width": 2},
                },
                hovertemplate="<b>Improvement</b>: %{y:.1%}<br><b>Date</b>: %{x}<extra></extra>",
            ),
            row=row,
            col=col,
        )

        # Quality score line
        fig.add_trace(
            go.Scatter(
                x=dates,
                y=quality_scores,
                mode="lines+markers",
                name="⭐ Quality Score",
                line={"color": DARK_COLORS["secondary"], "width": 4, "shape": "spline"},
                marker={
                    "size": 8,
                    "color": DARK_COLORS["gold"],
                    "line": {"color": "white", "width": 2},
                },
                hovertemplate="<b>Quality</b>: %{y:.2f}<br><b>Date</b>: %{x}<extra></extra>",
            ),
            row=row,
            col=col,
        )

        # Confidence band
        fig.add_trace(
            go.Scatter(
                x=dates + dates[::-1],
                y=confidence_upper + confidence_lower[::-1],
                fill="toself",
                fillcolor=f'rgba({int(DARK_COLORS["primary"][1:3], 16)}, {int(DARK_COLORS["primary"][3:5], 16)}, {int(DARK_COLORS["primary"][5:7], 16)}, 0.2)',
                line={"color": "rgba(0,0,0,0)"},
                name="Confidence Interval",
                showlegend=False,
                hoverinfo="skip",
            ),
            row=row,
            col=col,
        )

    def _add_technique_radar(self, fig, data, row, col):
        """Add technique effectiveness radar chart"""

        techniques = data["techniques"]
        effectiveness = data["technique_effectiveness"]

        fig.add_trace(
            go.Scatterpolar(
                r=effectiveness,
                theta=techniques,
                fill="toself",
                fillcolor=f'rgba({int(DARK_COLORS["neon_green"][1:3], 16)}, {int(DARK_COLORS["neon_green"][3:5], 16)}, {int(DARK_COLORS["neon_green"][5:7], 16)}, 0.3)',
                line={"color": DARK_COLORS["neon_green"], "width": 3},
                marker={
                    "size": 8,
                    "color": DARK_COLORS["primary"],
                    "line": {"color": "white", "width": 2},
                },
                name="Technique Effectiveness",
                hovertemplate="<b>%{theta}</b><br>Effectiveness: %{r:.1%}<extra></extra>",
            ),
            row=row,
            col=col,
        )

        # Update polar layout
        fig.update_polars(
            radialaxis={
                "visible": True,
                "range": [0, 1],
                "tickfont": {"color": DARK_COLORS["text_secondary"]},
                "gridcolor": DARK_COLORS["grid"],
            },
            angularaxis={
                "tickfont": {"color": DARK_COLORS["text"], "size": 10},
                "gridcolor": DARK_COLORS["grid"],
            },
            bgcolor=DARK_COLORS["paper"],
        )

    def _add_quality_distribution(self, fig, data, row, col):
        """Add quality distribution violin plots"""

        categories = data["quality_categories"]
        quality_data = data["quality_distributions"]

        colors = [
            DARK_COLORS["error"],
            DARK_COLORS["success"],
            DARK_COLORS["primary"],
            DARK_COLORS["secondary"],
        ]

        for i, (category, values) in enumerate(zip(categories, quality_data)):
            fig.add_trace(
                go.Violin(
                    y=values,
                    name=category,
                    box_visible=True,
                    meanline_visible=True,
                    fillcolor=colors[i % len(colors)],
                    opacity=0.7,
                    line_color=colors[i % len(colors)],
                    hoveron="points",
                    hovertemplate=f"<b>{category}</b><br>Quality: %{{y:.2f}}<extra></extra>",
                ),
                row=row,
                col=col,
            )

    def _add_domain_heatmap(self, fig, data, row, col):
        """Add domain performance heatmap"""

        domains = data["domains"]
        metrics = data["domain_metrics"]
        performance_matrix = data["domain_performance"]

        fig.add_trace(
            go.Heatmap(
                z=performance_matrix,
                x=metrics,
                y=domains,
                colorscale="Plasma",
                zmin=0.5,
                zmax=1.0,
                text=[[f"{val:.2f}" for val in row] for row in performance_matrix],
                texttemplate="%{text}",
                textfont={"size": 10, "color": "white"},
                hovertemplate="<b>%{y}</b> - %{x}<br>Score: %{z:.2f}<extra></extra>",
                colorbar={
                    "title": "Performance",
                    "titlefont": {"color": DARK_COLORS["text"]},
                    "tickfont": {"color": DARK_COLORS["text"]},
                    "bgcolor": DARK_COLORS["surface"],
                    "bordercolor": DARK_COLORS["grid"],
                },
            ),
            row=row,
            col=col,
        )

    def _add_synergy_network(self, fig, data, row, col):
        """Add technique synergy network visualization"""

        nodes = data["network_nodes"]
        edges = data["network_edges"]

        # Add edges
        for edge in edges:
            x0, y0 = nodes[edge["source"]]
            x1, y1 = nodes[edge["target"]]

            fig.add_trace(
                go.Scatter(
                    x=[x0, x1, None],
                    y=[y0, y1, None],
                    mode="lines",
                    line={
                        "color": DARK_COLORS["primary"],
                        "width": edge["strength"] * 8,
                    },
                    opacity=edge["strength"] * 0.8,
                    showlegend=False,
                    hoverinfo="skip",
                ),
                row=row,
                col=col,
            )

        # Add nodes
        node_names = list(nodes.keys())
        node_x = [nodes[name][0] for name in node_names]
        node_y = [nodes[name][1] for name in node_names]

        fig.add_trace(
            go.Scatter(
                x=node_x,
                y=node_y,
                mode="markers+text",
                marker={
                    "size": 25,
                    "color": DARK_COLORS["secondary"],
                    "line": {"color": DARK_COLORS["neon_blue"], "width": 3},
                },
                text=node_names,
                textposition="bottom center",
                textfont={"color": DARK_COLORS["text"], "size": 10},
                name="Techniques",
                hovertemplate="<b>%{text}</b><extra></extra>",
            ),
            row=row,
            col=col,
        )

    def _add_roi_analysis(self, fig, data, row, col):
        """Add ROI bubble chart analysis"""

        techniques = data["roi_techniques"]
        effort = data["roi_effort"]
        performance_gain = data["roi_performance_gain"]
        usage_frequency = data["roi_usage_frequency"]

        colors = [
            DARK_COLORS["success"],
            DARK_COLORS["primary"],
            DARK_COLORS["secondary"],
            DARK_COLORS["warning"],
            DARK_COLORS["purple"],
            DARK_COLORS["neon_blue"],
        ]

        for i, (tech, eff, gain, freq) in enumerate(
            zip(techniques, effort, performance_gain, usage_frequency)
        ):
            fig.add_trace(
                go.Scatter(
                    x=[eff],
                    y=[gain],
                    mode="markers+text",
                    marker={
                        "size": freq / 2,  # Scale bubble size
                        "color": colors[i % len(colors)],
                        "opacity": 0.8,
                        "line": {"color": "white", "width": 2},
                    },
                    text=[tech],
                    textposition="top center",
                    textfont={"color": DARK_COLORS["text"], "size": 9},
                    name=tech,
                    hovertemplate=f"<b>{tech}</b><br>Effort: %{{x}}<br>Gain: %{{y:.1%}}<br>Usage: {freq}%<extra></extra>",
                ),
                row=row,
                col=col,
            )

    def _add_predictive_analytics(self, fig, data, row, col):
        """Add predictive analytics with forecasting"""

        historical_dates = data["historical_dates"]
        historical_performance = data["historical_performance"]
        future_dates = data["future_dates"]
        predicted_performance = data["predicted_performance"]
        prediction_upper = data["prediction_upper"]
        prediction_lower = data["prediction_lower"]

        # Historical data
        fig.add_trace(
            go.Scatter(
                x=historical_dates,
                y=historical_performance,
                mode="lines+markers",
                name="📈 Historical",
                line={"color": DARK_COLORS["primary"], "width": 3},
                marker={"size": 6, "color": DARK_COLORS["neon_green"]},
                hovertemplate="<b>Historical</b><br>Performance: %{y:.2f}<br>Date: %{x}<extra></extra>",
            ),
            row=row,
            col=col,
        )

        # Predictions
        fig.add_trace(
            go.Scatter(
                x=future_dates,
                y=predicted_performance,
                mode="lines+markers",
                name="🔮 Predicted",
                line={"color": DARK_COLORS["secondary"], "width": 3, "dash": "dash"},
                marker={"size": 6, "color": DARK_COLORS["gold"], "symbol": "star"},
                hovertemplate="<b>Predicted</b><br>Performance: %{y:.2f}<br>Date: %{x}<extra></extra>",
            ),
            row=row,
            col=col,
        )

        # Prediction confidence band
        fig.add_trace(
            go.Scatter(
                x=future_dates + future_dates[::-1],
                y=prediction_upper + prediction_lower[::-1],
                fill="toself",
                fillcolor=f'rgba({int(DARK_COLORS["secondary"][1:3], 16)}, {int(DARK_COLORS["secondary"][3:5], 16)}, {int(DARK_COLORS["secondary"][5:7], 16)}, 0.2)',
                line={"color": "rgba(0,0,0,0)"},
                name="Prediction Confidence",
                showlegend=False,
                hoverinfo="skip",
            ),
            row=row,
            col=col,
        )

    def _add_realtime_metrics(self, fig, data, row, col):
        """Add real-time performance indicators"""

        current_performance = data["current_performance"]
        target_performance = data["target_performance"]

        # Performance gauge
        fig.add_trace(
            go.Indicator(
                mode="gauge+number+delta",
                value=current_performance,
                domain={"x": [0, 1], "y": [0, 1]},
                title={
                    "text": "🎯 Current Performance",
                    "font": {"color": DARK_COLORS["text"]},
                },
                delta={"reference": target_performance, "valueformat": ".1%"},
                gauge={
                    "axis": {"range": [None, 1], "tickcolor": DARK_COLORS["text"]},
                    "bar": {"color": DARK_COLORS["primary"]},
                    "bgcolor": DARK_COLORS["surface"],
                    "borderwidth": 2,
                    "bordercolor": DARK_COLORS["grid"],
                    "steps": [
                        {"range": [0, 0.5], "color": DARK_COLORS["error"]},
                        {"range": [0.5, 0.8], "color": DARK_COLORS["warning"]},
                        {"range": [0.8, 1], "color": DARK_COLORS["success"]},
                    ],
                    "threshold": {
                        "line": {"color": DARK_COLORS["neon_pink"], "width": 4},
                        "thickness": 0.75,
                        "value": target_performance,
                    },
                },
                number={"font": {"color": DARK_COLORS["text"]}},
            ),
            row=row,
            col=col,
        )

    def _add_achievement_gallery(self, fig, data, row, col):
        """Add achievement/milestone gallery"""

        achievements = data["achievements"]
        achievement_values = data["achievement_values"]
        achievement_colors = [
            DARK_COLORS["gold"],
            DARK_COLORS["success"],
            DARK_COLORS["primary"],
            DARK_COLORS["purple"],
        ]

        fig.add_trace(
            go.Bar(
                x=achievements,
                y=achievement_values,
                marker={
                    "color": achievement_colors,
                    "line": {"color": "white", "width": 2},
                },
                text=[f"{val:.1%}" for val in achievement_values],
                textposition="auto",
                textfont={"color": "white", "size": 12, "family": "Arial Black"},
                name="🏆 Achievements",
                hovertemplate="<b>%{x}</b><br>Achievement: %{y:.1%}<extra></extra>",
            ),
            row=row,
            col=col,
        )

    def _add_dashboard_annotations(self, fig):
        """Add custom annotations and decorative elements"""

        # Add timestamp
        fig.add_annotation(
            text=f"⏰ Last Updated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
            xref="paper",
            yref="paper",
            x=0.99,
            y=0.01,
            xanchor="right",
            yanchor="bottom",
            font={"size": 10, "color": DARK_COLORS["text_secondary"]},
            bgcolor=DARK_COLORS["surface"],
            bordercolor=DARK_COLORS["grid"],
            borderwidth=1,
        )

        # Add performance indicator
        fig.add_annotation(
            text="🚀 SYSTEM STATUS: OPTIMIZING",
            xref="paper",
            yref="paper",
            x=0.01,
            y=0.99,
            xanchor="left",
            yanchor="top",
            font={"size": 12, "color": DARK_COLORS["success"]},
            bgcolor=DARK_COLORS["surface"],
            bordercolor=DARK_COLORS["success"],
            borderwidth=2,
        )

    def _generate_comprehensive_data(self) -> dict[str, Any]:
        """Generate comprehensive sample data for the dashboard"""

        # Time series data
        dates = [datetime.now() - timedelta(days=30 - i) for i in range(30)]
        improvements = [0.15 + 0.01 * i + np.random.normal(0, 0.02) for i in range(30)]
        quality_scores = [
            0.7 + 0.008 * i + np.random.normal(0, 0.03) for i in range(30)
        ]

        # Confidence intervals
        confidence_upper = [imp + 0.05 for imp in improvements]
        confidence_lower = [imp - 0.05 for imp in improvements]

        # Technique radar
        techniques = [
            "Role Definition",
            "XML Structure",
            "Chain of Thought",
            "Output Format",
            "Examples",
            "Structured Instructions",
        ]
        technique_effectiveness = [0.85, 0.92, 0.78, 0.88, 0.75, 0.90]

        # Quality distributions
        quality_categories = ["Baseline", "Optimized", "Generated", "Templated"]
        quality_distributions = [
            np.random.normal(0.65, 0.1, 100).tolist(),
            np.random.normal(0.85, 0.08, 100).tolist(),
            np.random.normal(0.80, 0.1, 100).tolist(),
            np.random.normal(0.88, 0.06, 100).tolist(),
        ]

        # Domain performance
        domains = ["Software Eng", "Data Science", "Business", "Marketing", "Research"]
        domain_metrics = ["Quality", "Efficiency", "Innovation", "Consistency"]
        domain_performance = (
            np.random.rand(len(domains), len(domain_metrics)) * 0.4 + 0.6
        )

        # Network data
        network_nodes = {
            "Role Definition": (0.2, 0.8),
            "XML Structure": (0.8, 0.8),
            "Chain of Thought": (0.5, 0.5),
            "Output Format": (0.2, 0.2),
            "Examples": (0.8, 0.2),
        }

        network_edges = [
            {"source": "Role Definition", "target": "XML Structure", "strength": 0.8},
            {"source": "XML Structure", "target": "Chain of Thought", "strength": 0.9},
            {"source": "Chain of Thought", "target": "Output Format", "strength": 0.7},
            {"source": "Output Format", "target": "Examples", "strength": 0.6},
            {"source": "Examples", "target": "Role Definition", "strength": 0.5},
        ]

        # ROI data
        roi_techniques = [
            "Role Def",
            "XML Struct",
            "Chain Thought",
            "Output Fmt",
            "Examples",
        ]
        roi_effort = [3, 4, 5, 2, 3]
        roi_performance_gain = [0.15, 0.25, 0.30, 0.12, 0.18]
        roi_usage_frequency = [85, 92, 78, 95, 70]

        # Predictive analytics
        historical_dates = [datetime.now() - timedelta(days=60 - i) for i in range(40)]
        historical_performance = [
            0.6 + 0.005 * i + np.random.normal(0, 0.02) for i in range(40)
        ]

        future_dates = [datetime.now() + timedelta(days=i) for i in range(1, 21)]
        predicted_performance = [
            0.8 + 0.01 * i + np.random.normal(0, 0.01) for i in range(20)
        ]
        prediction_upper = [
            pred + 0.05 * np.sqrt(i + 1) for i, pred in enumerate(predicted_performance)
        ]
        prediction_lower = [
            pred - 0.05 * np.sqrt(i + 1) for i, pred in enumerate(predicted_performance)
        ]

        # Real-time metrics
        current_performance = 0.82
        target_performance = 0.85

        # Achievements
        achievements = [
            "Quality Master",
            "Efficiency Pro",
            "Innovation Leader",
            "Consistency Champion",
        ]
        achievement_values = [0.95, 0.88, 0.92, 0.85]

        return {
            "dates": dates,
            "improvements": improvements,
            "quality_scores": quality_scores,
            "confidence_upper": confidence_upper,
            "confidence_lower": confidence_lower,
            "techniques": techniques,
            "technique_effectiveness": technique_effectiveness,
            "quality_categories": quality_categories,
            "quality_distributions": quality_distributions,
            "domains": domains,
            "domain_metrics": domain_metrics,
            "domain_performance": domain_performance.tolist(),
            "network_nodes": network_nodes,
            "network_edges": network_edges,
            "roi_techniques": roi_techniques,
            "roi_effort": roi_effort,
            "roi_performance_gain": roi_performance_gain,
            "roi_usage_frequency": roi_usage_frequency,
            "historical_dates": historical_dates,
            "historical_performance": historical_performance,
            "future_dates": future_dates,
            "predicted_performance": predicted_performance,
            "prediction_upper": prediction_upper,
            "prediction_lower": prediction_lower,
            "current_performance": current_performance,
            "target_performance": target_performance,
            "achievements": achievements,
            "achievement_values": achievement_values,
        }

    def create_3d_performance_landscape(self, data: Optional[dict] = None) -> go.Figure:
        """Create a stunning 3D performance landscape visualization"""

        # Generate 3D surface data
        x = np.linspace(0, 10, 50)
        y = np.linspace(0, 10, 50)
        X, Y = np.meshgrid(x, y)

        # Create performance surface with multiple peaks
        Z = (
            np.sin(X) * np.cos(Y) * 0.3
            + np.exp(-((X - 5) ** 2 + (Y - 5) ** 2) / 10) * 0.5
            + np.random.normal(0, 0.05, X.shape)
            + 0.7
        )

        fig = go.Figure()

        # Main surface
        fig.add_trace(
            go.Surface(
                x=X,
                y=Y,
                z=Z,
                colorscale="Plasma",
                opacity=0.9,
                name="Performance Landscape",
                hovertemplate="<b>Performance Landscape</b><br>X: %{x:.1f}<br>Y: %{y:.1f}<br>Performance: %{z:.2f}<extra></extra>",
            )
        )

        # Add optimization path
        path_x = np.linspace(1, 9, 20)
        path_y = np.sin(path_x) * 2 + 5

        # Use scipy interpolation for accurate Z values at path points
        from scipy.interpolate import RegularGridInterpolator

        x_grid = np.linspace(0, 10, Z.shape[1])
        y_grid = np.linspace(0, 10, Z.shape[0])
        interpolator = RegularGridInterpolator((y_grid, x_grid), Z)
        path_points = np.column_stack((path_y, path_x))
        path_z = interpolator(path_points) + 0.1

        fig.add_trace(
            go.Scatter3d(
                x=path_x,
                y=path_y,
                z=path_z,
                mode="lines+markers",
                line={"color": DARK_COLORS["neon_green"], "width": 8},
                marker={"size": 5, "color": DARK_COLORS["gold"]},
                name="Optimization Path",
                hovertemplate="<b>Optimization Step</b><br>Position: (%{x:.1f}, %{y:.1f})<br>Performance: %{z:.2f}<extra></extra>",
            )
        )

        # Add peak markers
        peaks = [(5, 5, Z[25, 25]), (2, 8, Z[40, 10]), (8, 2, Z[10, 40])]
        peak_names = ["Global Optimum", "Local Peak A", "Local Peak B"]

        for (px, py, pz), name in zip(peaks, peak_names):
            fig.add_trace(
                go.Scatter3d(
                    x=[px],
                    y=[py],
                    z=[pz + 0.05],
                    mode="markers+text",
                    marker={
                        "size": 15,
                        "color": DARK_COLORS["neon_pink"],
                        "symbol": "diamond",
                    },
                    text=[name],
                    textposition="top center",
                    textfont={"color": DARK_COLORS["text"], "size": 12},
                    name=name,
                    hovertemplate=f"<b>{name}</b><br>Peak Performance: {pz:.2f}<extra></extra>",
                )
            )

        # Styling
        layout_template = self.template["layout"].copy()
        layout_template["title"] = {
            "text": "🏔️ OPTIMIZATION PERFORMANCE LANDSCAPE 🏔️",
            "x": 0.5,
            "font": {"size": 24, "color": DARK_COLORS["primary"]},
        }
        fig.update_layout(
            **layout_template,
            scene={
                "xaxis": {
                    "title": "Technique Complexity",
                    "backgroundcolor": DARK_COLORS["paper"],
                    "gridcolor": DARK_COLORS["grid"],
                    "titlefont": {"color": DARK_COLORS["text"]},
                },
                "yaxis": {
                    "title": "Implementation Effort",
                    "backgroundcolor": DARK_COLORS["paper"],
                    "gridcolor": DARK_COLORS["grid"],
                    "titlefont": {"color": DARK_COLORS["text"]},
                },
                "zaxis": {
                    "title": "Performance Score",
                    "backgroundcolor": DARK_COLORS["paper"],
                    "gridcolor": DARK_COLORS["grid"],
                    "titlefont": {"color": DARK_COLORS["text"]},
                },
                "bgcolor": DARK_COLORS["background"],
                "camera": {"eye": {"x": 1.5, "y": 1.5, "z": 1.5}},
            },
            width=1000,
            height=800,
        )

        return fig

    def save_dashboard_html(
        self,
        fig: go.Figure,
        filename: str = "interactive_dashboard.html",
        mode_bar_buttons: Optional[list[str]] = None,
        config: Optional[dict] = None,
    ):
        """Save interactive dashboard as HTML file with customizable configuration.

        Args:
            fig: The plotly figure to save
            filename: Output filename
            mode_bar_buttons: List of buttons to add to mode bar. Defaults to drawing tools.
            config: Custom configuration dict. If provided, overrides default config.
        """

        default_mode_bar_buttons = [
            "drawline",
            "drawopenpath",
            "drawclosedpath",
            "drawcircle",
            "drawrect",
            "eraseshape",
        ]

        default_config = {
            "displayModeBar": True,
            "displaylogo": False,
            "modeBarButtonsToAdd": mode_bar_buttons or default_mode_bar_buttons,
        }

        # Use custom config if provided, otherwise use default
        final_config = config if config is not None else default_config

        fig.write_html(filename, config=final_config, include_plotlyjs=True)

        return filename


def main():
    """Test the interactive dashboard system"""

    dashboard = InteractiveDashboard()

    print("=== INTERACTIVE DASHBOARD SYSTEM ===")
    print("Creating stunning interactive visualizations...")

    # Create master dashboard
    master_fig = dashboard.create_master_dashboard()
    master_file = dashboard.save_dashboard_html(master_fig, "master_dashboard.html")
    print(f"📊 Master dashboard saved: {master_file}")

    # Create 3D landscape
    landscape_fig = dashboard.create_3d_performance_landscape()
    landscape_file = dashboard.save_dashboard_html(
        landscape_fig, "3d_performance_landscape.html"
    )
    print(f"🏔️ 3D performance landscape saved: {landscape_file}")

    return dashboard


if __name__ == "__main__":
    main()
