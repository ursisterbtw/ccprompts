#!/usr/bin/env python3
"""
Advanced Seaborn Analytics for Beta-Prompts
Creates publication-quality statistical visualizations with stunning dark themes
"""

import warnings
from datetime import datetime
from typing import Optional

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns
from matplotlib import patches
from matplotlib.colors import LinearSegmentedColormap
from scipy import stats
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler

warnings.filterwarnings("ignore")

# Enhanced dark theme for Seaborn
SEABORN_DARK_THEME = {
    "background": "#0a0a0a",
    "surface": "#1a1a1a",
    "card": "#2a2a2a",
    "primary": "#00d4ff",
    "secondary": "#ff6b35",
    "success": "#00ff88",
    "warning": "#ffb800",
    "error": "#ff4757",
    "text_primary": "#ffffff",
    "text_secondary": "#a0a0a0",
    "grid": "#333333",
    "neon_cyan": "#00ffff",
    "neon_magenta": "#ff00ff",
    "neon_lime": "#39ff14",
    "electric_blue": "#007fff",
    "hot_pink": "#ff1493",
    "gold": "#ffd700",
    "violet": "#8b5cf6",
    "emerald": "#10b981",
}


class SeabornAnalytics:
    """
    Advanced statistical visualizations using Seaborn with dark mode styling
    """

    def __init__(self):
        self.setup_seaborn_theme()
        self.setup_custom_palettes()

    def setup_seaborn_theme(self):
        """Configure Seaborn with stunning dark theme"""

        # Set the overall style
        sns.set_style(
            "darkgrid",
            {
                "axes.facecolor": SEABORN_DARK_THEME["surface"],
                "figure.facecolor": SEABORN_DARK_THEME["background"],
                "grid.color": SEABORN_DARK_THEME["grid"],
                "axes.edgecolor": SEABORN_DARK_THEME["grid"],
                "axes.labelcolor": SEABORN_DARK_THEME["text_primary"],
                "text.color": SEABORN_DARK_THEME["text_primary"],
                "xtick.color": SEABORN_DARK_THEME["text_secondary"],
                "ytick.color": SEABORN_DARK_THEME["text_secondary"],
                "axes.grid": True,
                "grid.alpha": 0.3,
            },
        )

        # Set context for better scaling
        sns.set_context(
            "talk",
            font_scale=1.1,
            rc={
                "lines.linewidth": 2.5,
                "patch.linewidth": 0.5,
                "grid.linewidth": 0.8,
                "font.size": 12,
                "axes.labelsize": 14,
                "axes.titlesize": 16,
                "xtick.labelsize": 11,
                "ytick.labelsize": 11,
                "legend.fontsize": 12,
                "figure.titlesize": 20,
            },
        )

        # Custom matplotlib parameters
        plt.rcParams.update(
            {
                "figure.facecolor": SEABORN_DARK_THEME["background"],
                "savefig.facecolor": SEABORN_DARK_THEME["background"],
                "savefig.edgecolor": "none",
                "savefig.dpi": 300,
                "font.family": "DejaVu Sans",
                "axes.spines.left": False,
                "axes.spines.bottom": False,
                "axes.spines.top": False,
                "axes.spines.right": False,
            }
        )

    def setup_custom_palettes(self):
        """Create custom color palettes for different visualization types"""

        # Neon palette for high-energy visualizations
        self.neon_palette = [
            SEABORN_DARK_THEME["neon_cyan"],
            SEABORN_DARK_THEME["neon_magenta"],
            SEABORN_DARK_THEME["neon_lime"],
            SEABORN_DARK_THEME["hot_pink"],
            SEABORN_DARK_THEME["gold"],
            SEABORN_DARK_THEME["electric_blue"],
        ]

        # Performance gradient palette
        self.performance_palette = [
            SEABORN_DARK_THEME["error"],  # Low performance
            SEABORN_DARK_THEME["warning"],  # Medium performance
            SEABORN_DARK_THEME["success"],  # High performance
            SEABORN_DARK_THEME["neon_lime"],  # Exceptional performance
        ]

        # Technique effectiveness palette
        self.technique_palette = [
            SEABORN_DARK_THEME["primary"],
            SEABORN_DARK_THEME["secondary"],
            SEABORN_DARK_THEME["violet"],
            SEABORN_DARK_THEME["emerald"],
            SEABORN_DARK_THEME["gold"],
            SEABORN_DARK_THEME["hot_pink"],
        ]

        # Create custom colormaps
        self.plasma_dark = LinearSegmentedColormap.from_list(
            "plasma_dark",
            ["#0a0a0a", "#6a0d83", "#b83289", "#f66e5b", "#fed976", "#fcffa4"],
        )

        self.viridis_dark = LinearSegmentedColormap.from_list(
            "viridis_dark",
            ["#0a0a0a", "#404387", "#2a788e", "#22a884", "#7ad151", "#fde725"],
        )

    def create_comprehensive_analytics_suite(
        self, data: Optional[pd.DataFrame] = None
    ) -> str:
        """
        Create a comprehensive suite of statistical visualizations
        """

        if data is None:
            data = self._generate_rich_dataset()

        # Create a large figure with multiple subplots
        fig = plt.figure(figsize=(28, 20))
        gs = fig.add_gridspec(
            4, 4, hspace=0.35, wspace=0.25, left=0.05, right=0.95, top=0.95, bottom=0.05
        )

        # Main title with gradient effect
        fig.suptitle(
            "🔬 ADVANCED PROMPT OPTIMIZATION ANALYTICS LABORATORY 🔬",
            fontsize=32,
            fontweight="bold",
            color=SEABORN_DARK_THEME["primary"],
            y=0.98,
        )

        # 1. Correlation Matrix Heatmap (top-left)
        ax1 = fig.add_subplot(gs[0, 0:2])
        self._create_correlation_matrix(ax1, data)

        # 2. Performance Distribution Analysis (top-right)
        ax2 = fig.add_subplot(gs[0, 2:4])
        self._create_performance_distributions(ax2, data)

        # 3. Technique Effectiveness Swarm Plot (second row, left)
        ax3 = fig.add_subplot(gs[1, 0:2])
        self._create_technique_swarm_plot(ax3, data)

        # 4. Domain Performance Violin Plot (second row, right)
        ax4 = fig.add_subplot(gs[1, 2:4])
        self._create_domain_violin_plot(ax4, data)

        # 5. Optimization Timeline with Regression (third row, left)
        ax5 = fig.add_subplot(gs[2, 0:2])
        self._create_optimization_timeline(ax5, data)

        # 6. Feature Importance Analysis (third row, right)
        ax6 = fig.add_subplot(gs[2, 2:4])
        self._create_feature_importance(ax6, data)

        # 7. Clustering Analysis (bottom-left)
        ax7 = fig.add_subplot(gs[3, 0:2])
        self._create_clustering_analysis(ax7, data)

        # 8. Performance Prediction Model (bottom-right)
        ax8 = fig.add_subplot(gs[3, 2:4])
        self._create_prediction_model_viz(ax8, data)

        # Add decorative elements
        self._add_analytical_decorations(fig)

        # Save with high quality
        output_file = "seaborn_analytics_suite.png"
        plt.savefig(
            output_file,
            dpi=300,
            bbox_inches="tight",
            facecolor=SEABORN_DARK_THEME["background"],
        )
        plt.close()

        return output_file

    def _create_correlation_matrix(self, ax, data: pd.DataFrame):
        """Create stunning correlation matrix heatmap"""

        # Select numeric columns for correlation
        numeric_cols = [
            "quality_score",
            "improvement_rate",
            "complexity_score",
            "implementation_effort",
            "usage_frequency",
            "roi_score",
        ]

        # Calculate correlation matrix
        corr_matrix = data[numeric_cols].corr()

        # Create mask for upper triangle
        mask = np.triu(np.ones_like(corr_matrix, dtype=bool))

        # Generate heatmap with custom styling
        heatmap = sns.heatmap(
            corr_matrix,
            mask=mask,
            annot=True,
            fmt=".2f",
            cmap=self.plasma_dark,
            vmin=-1,
            vmax=1,
            center=0,
            square=True,
            linewidths=1,
            cbar_kws={
                "shrink": 0.8,
                "label": "Correlation Coefficient",
                "labelpad": 20,
            },
            annot_kws={"fontsize": 11, "fontweight": "bold", "color": "white"},
            ax=ax,
        )

        # Customize colorbar
        cbar = heatmap.collections[0].colorbar
        cbar.ax.tick_params(colors=SEABORN_DARK_THEME["text_primary"], labelsize=10)
        cbar.set_label(
            "Correlation Coefficient",
            color=SEABORN_DARK_THEME["text_primary"],
            fontweight="bold",
            fontsize=12,
        )

        # Styling
        ax.set_title(
            "🔗 FEATURE CORRELATION MATRIX",
            fontsize=18,
            fontweight="bold",
            color=SEABORN_DARK_THEME["text_primary"],
            pad=20,
        )
        ax.tick_params(colors=SEABORN_DARK_THEME["text_primary"], labelsize=10)

        # Add correlation insights
        strongest_corr = corr_matrix.abs().unstack().sort_values(ascending=False)
        strongest_pair = strongest_corr.index[1]  # Skip self-correlation
        strongest_value = strongest_corr.iloc[1]

        ax.text(
            0.02,
            0.98,
            f"💪 Strongest Correlation:\n{strongest_pair[0]} ↔ {strongest_pair[1]}\n{strongest_value:.3f}",
            transform=ax.transAxes,
            fontsize=10,
            fontweight="bold",
            color=SEABORN_DARK_THEME["neon_lime"],
            verticalalignment="top",
            bbox={
                "boxstyle": "round,pad=0.5",
                "facecolor": SEABORN_DARK_THEME["card"],
                "alpha": 0.8,
            },
        )

    def _create_performance_distributions(self, ax, data: pd.DataFrame):
        """Create multi-faceted performance distribution analysis"""

        # Create ridge plot style distribution
        categories = data["technique_category"].unique()
        colors = self.neon_palette[: len(categories)]

        y_offset = 0
        for i, (category, color) in enumerate(zip(categories, colors)):
            category_data = data[data["technique_category"] == category][
                "quality_score"
            ]

            # Create KDE
            sns.kdeplot(
                data=category_data,
                color=color,
                fill=True,
                alpha=0.7,
                linewidth=3,
                ax=ax,
            )

            # Add statistics overlay
            mean_val = category_data.mean()
            std_val = category_data.std()
            ax.axvline(mean_val, color=color, linestyle="--", linewidth=2, alpha=0.8)

            # Add text annotation
            ax.text(
                mean_val,
                ax.get_ylim()[1] * 0.9 - i * 0.15,
                f"{category}\nμ={mean_val:.2f}, σ={std_val:.2f}",
                ha="center",
                va="top",
                fontweight="bold",
                color=color,
                bbox={
                    "boxstyle": "round,pad=0.3",
                    "facecolor": SEABORN_DARK_THEME["card"],
                    "alpha": 0.9,
                    "edgecolor": color,
                },
            )

        # Add distribution statistics
        overall_skew = stats.skew(data["quality_score"])
        overall_kurtosis = stats.kurtosis(data["quality_score"])

        ax.text(
            0.02,
            0.98,
            f"📊 Distribution Analysis\nSkewness: {overall_skew:.2f}\nKurtosis: {overall_kurtosis:.2f}",
            transform=ax.transAxes,
            fontsize=11,
            fontweight="bold",
            color=SEABORN_DARK_THEME["text_primary"],
            verticalalignment="top",
            bbox={
                "boxstyle": "round,pad=0.5",
                "facecolor": SEABORN_DARK_THEME["card"],
                "alpha": 0.8,
            },
        )

        ax.set_title(
            "📈 QUALITY SCORE DISTRIBUTIONS BY TECHNIQUE",
            fontsize=18,
            fontweight="bold",
            color=SEABORN_DARK_THEME["text_primary"],
            pad=20,
        )
        ax.set_xlabel(
            "Quality Score",
            fontweight="bold",
            color=SEABORN_DARK_THEME["text_secondary"],
        )
        ax.set_ylabel(
            "Density", fontweight="bold", color=SEABORN_DARK_THEME["text_secondary"]
        )

    def _create_technique_swarm_plot(self, ax, data: pd.DataFrame):
        """Create technique effectiveness swarm plot with statistical overlays"""

        # Create swarm plot
        swarm = sns.swarmplot(
            data=data,
            x="technique_category",
            y="improvement_rate",
            palette=self.technique_palette,
            size=8,
            alpha=0.8,
            ax=ax,
        )

        # Add box plot overlay
        box = sns.boxplot(
            data=data,
            x="technique_category",
            y="improvement_rate",
            palette=self.technique_palette,
            width=0.3,
            fliersize=0,
            linewidth=2,
            ax=ax,
        )

        # Customize box plot
        for patch, color in zip(box.artists, self.technique_palette):
            patch.set_facecolor("none")
            patch.set_edgecolor(color)
            patch.set_linewidth(2)

        # Add statistical annotations
        categories = data["technique_category"].unique()
        for i, category in enumerate(categories):
            category_data = data[data["technique_category"] == category][
                "improvement_rate"
            ]

            # Calculate statistics
            median_val = category_data.median()
            q75 = category_data.quantile(0.75)
            q25 = category_data.quantile(0.25)
            iqr = q75 - q25

            # Add median line highlight
            ax.hlines(
                median_val,
                i - 0.4,
                i + 0.4,
                colors=SEABORN_DARK_THEME["neon_lime"],
                linewidth=4,
                alpha=0.9,
                zorder=10,
            )

            # Add IQR annotation
            ax.text(
                i,
                ax.get_ylim()[1] * 0.95,
                f"IQR: {iqr:.2f}",
                ha="center",
                va="top",
                fontweight="bold",
                color=SEABORN_DARK_THEME["text_primary"],
                fontsize=10,
                bbox={
                    "boxstyle": "round,pad=0.2",
                    "facecolor": self.technique_palette[i],
                    "alpha": 0.7,
                },
            )

        ax.set_title(
            "🎯 TECHNIQUE EFFECTIVENESS DISTRIBUTION",
            fontsize=18,
            fontweight="bold",
            color=SEABORN_DARK_THEME["text_primary"],
            pad=20,
        )
        ax.set_xlabel(
            "Optimization Technique",
            fontweight="bold",
            color=SEABORN_DARK_THEME["text_secondary"],
        )
        ax.set_ylabel(
            "Improvement Rate",
            fontweight="bold",
            color=SEABORN_DARK_THEME["text_secondary"],
        )

        # Rotate x-labels for better readability
        plt.setp(ax.get_xticklabels(), rotation=45, ha="right")

    def _create_domain_violin_plot(self, ax, data: pd.DataFrame):
        """Create domain performance violin plot with inner statistics"""

        # Create split violin plot
        violin = sns.violinplot(
            data=data,
            x="domain",
            y="quality_score",
            hue="complexity_level",
            split=True,
            palette=self.performance_palette,
            inner="quart",
            linewidth=2,
            ax=ax,
        )

        # Enhance violin plot styling
        for collection in violin.collections:
            collection.set_alpha(0.8)
            collection.set_edgecolor(SEABORN_DARK_THEME["text_primary"])
            collection.set_linewidth(1.5)

        # Add performance zones
        ax.axhspan(0.8, 1.0, alpha=0.15, color=SEABORN_DARK_THEME["success"], zorder=0)
        ax.axhspan(0.6, 0.8, alpha=0.15, color=SEABORN_DARK_THEME["warning"], zorder=0)
        ax.axhspan(0.0, 0.6, alpha=0.15, color=SEABORN_DARK_THEME["error"], zorder=0)

        # Add zone labels
        ax.text(
            ax.get_xlim()[1] * 0.95,
            0.9,
            "EXCELLENT",
            ha="right",
            va="center",
            fontweight="bold",
            color=SEABORN_DARK_THEME["success"],
            fontsize=12,
        )
        ax.text(
            ax.get_xlim()[1] * 0.95,
            0.7,
            "GOOD",
            ha="right",
            va="center",
            fontweight="bold",
            color=SEABORN_DARK_THEME["warning"],
            fontsize=12,
        )
        ax.text(
            ax.get_xlim()[1] * 0.95,
            0.5,
            "NEEDS WORK",
            ha="right",
            va="center",
            fontweight="bold",
            color=SEABORN_DARK_THEME["error"],
            fontsize=12,
        )

        ax.set_title(
            "🏭 DOMAIN PERFORMANCE BY COMPLEXITY",
            fontsize=18,
            fontweight="bold",
            color=SEABORN_DARK_THEME["text_primary"],
            pad=20,
        )
        ax.set_xlabel(
            "Application Domain",
            fontweight="bold",
            color=SEABORN_DARK_THEME["text_secondary"],
        )
        ax.set_ylabel(
            "Quality Score",
            fontweight="bold",
            color=SEABORN_DARK_THEME["text_secondary"],
        )

        # Customize legend
        handles, labels = ax.get_legend_handles_labels()
        ax.legend(
            handles,
            labels,
            title="Complexity Level",
            title_fontsize=12,
            fontsize=10,
            facecolor=SEABORN_DARK_THEME["card"],
            edgecolor=SEABORN_DARK_THEME["grid"],
            labelcolor=SEABORN_DARK_THEME["text_primary"],
        )

        plt.setp(ax.get_xticklabels(), rotation=45, ha="right")

    def _create_optimization_timeline(self, ax, data: pd.DataFrame):
        """Create optimization timeline with trend analysis"""

        # Convert datetime and sort
        data_sorted = data.sort_values("optimization_date")

        # Create scatter plot with regression
        scatter = sns.scatterplot(
            data=data_sorted,
            x="optimization_date",
            y="quality_score",
            hue="technique_category",
            size="improvement_rate",
            sizes=(50, 300),
            alpha=0.8,
            palette=self.neon_palette,
            ax=ax,
        )

        # Add trend line
        sns.regplot(
            data=data_sorted,
            x=range(len(data_sorted)),
            y="quality_score",
            scatter=False,
            color=SEABORN_DARK_THEME["neon_lime"],
            line_kws={"linewidth": 4, "alpha": 0.8},
            ax=ax,
        )

        # Calculate and display trend statistics
        from scipy.stats import linregress

        x_numeric = range(len(data_sorted))
        slope, intercept, r_value, p_value, std_err = linregress(
            x_numeric, data_sorted["quality_score"]
        )

        # Add trend information
        trend_text = f"📈 Trend Analysis\nSlope: {slope:.4f}\nR²: {r_value**2:.3f}\np-value: {p_value:.3e}"
        ax.text(
            0.02,
            0.98,
            trend_text,
            transform=ax.transAxes,
            fontsize=11,
            fontweight="bold",
            color=SEABORN_DARK_THEME["neon_lime"],
            verticalalignment="top",
            bbox={
                "boxstyle": "round,pad=0.5",
                "facecolor": SEABORN_DARK_THEME["card"],
                "alpha": 0.9,
            },
        )

        # Add moving average
        window_size = max(5, len(data_sorted) // 10)
        moving_avg = (
            data_sorted["quality_score"].rolling(window=window_size, center=True).mean()
        )
        ax.plot(
            data_sorted["optimization_date"],
            moving_avg,
            color=SEABORN_DARK_THEME["gold"],
            linewidth=3,
            alpha=0.8,
            label=f"Moving Average ({window_size})",
        )

        ax.set_title(
            "⏱️ OPTIMIZATION PROGRESS TIMELINE",
            fontsize=18,
            fontweight="bold",
            color=SEABORN_DARK_THEME["text_primary"],
            pad=20,
        )
        ax.set_xlabel(
            "Optimization Date",
            fontweight="bold",
            color=SEABORN_DARK_THEME["text_secondary"],
        )
        ax.set_ylabel(
            "Quality Score",
            fontweight="bold",
            color=SEABORN_DARK_THEME["text_secondary"],
        )

        # Format dates on x-axis
        ax.tick_params(axis="x", rotation=45)

        # Customize legend
        handles, labels = ax.get_legend_handles_labels()
        ax.legend(
            handles,
            labels,
            title="Technique & Size=Improvement",
            title_fontsize=10,
            fontsize=9,
            loc="upper left",
            facecolor=SEABORN_DARK_THEME["card"],
            edgecolor=SEABORN_DARK_THEME["grid"],
        )

    def _create_feature_importance(self, ax, data: pd.DataFrame):
        """Create feature importance analysis with statistical testing"""

        # Calculate feature importance using correlation with target
        features = [
            "complexity_score",
            "implementation_effort",
            "usage_frequency",
            "technique_effectiveness",
            "domain_familiarity",
        ]
        target = "quality_score"

        # Calculate correlations and p-values
        importance_data = []
        for feature in features:
            if feature in data.columns:
                corr_coef = data[feature].corr(data[target])
                # Calculate p-value
                from scipy.stats import pearsonr

                _, p_val = pearsonr(data[feature], data[target])
                importance_data.append(
                    {
                        "feature": feature.replace("_", " ").title(),
                        "importance": abs(corr_coef),
                        "correlation": corr_coef,
                        "p_value": p_val,
                        "significant": p_val < 0.05,
                    }
                )

        importance_df = pd.DataFrame(importance_data)
        importance_df = importance_df.sort_values("importance", ascending=True)

        # Create horizontal bar plot
        colors = [
            SEABORN_DARK_THEME["success"] if sig else SEABORN_DARK_THEME["warning"]
            for sig in importance_df["significant"]
        ]

        bars = ax.barh(
            range(len(importance_df)),
            importance_df["importance"],
            color=colors,
            alpha=0.8,
            edgecolor="white",
            linewidth=2,
        )

        # Add value labels
        for i, (_bar, importance, p_val) in enumerate(
            zip(bars, importance_df["importance"], importance_df["p_value"])
        ):
            ax.text(
                importance + 0.01,
                i,
                f"{importance:.3f}",
                va="center",
                fontweight="bold",
                color=SEABORN_DARK_THEME["text_primary"],
            )

            # Add significance indicator
            if p_val < 0.001:
                sig_text = "***"
            elif p_val < 0.01:
                sig_text = "**"
            elif p_val < 0.05:
                sig_text = "*"
            else:
                sig_text = "ns"

            ax.text(
                importance + 0.05,
                i,
                sig_text,
                va="center",
                fontweight="bold",
                color=SEABORN_DARK_THEME["neon_lime"],
            )

        # Customize axes
        ax.set_yticks(range(len(importance_df)))
        ax.set_yticklabels(importance_df["feature"])
        ax.set_xlabel(
            "Feature Importance (|Correlation|)",
            fontweight="bold",
            color=SEABORN_DARK_THEME["text_secondary"],
        )

        ax.set_title(
            "🔍 FEATURE IMPORTANCE ANALYSIS",
            fontsize=18,
            fontweight="bold",
            color=SEABORN_DARK_THEME["text_primary"],
            pad=20,
        )

        # Add significance legend
        legend_text = "Significance:\n*** p<0.001\n** p<0.01\n* p<0.05\nns p≥0.05"
        ax.text(
            0.98,
            0.02,
            legend_text,
            transform=ax.transAxes,
            fontsize=10,
            fontweight="bold",
            color=SEABORN_DARK_THEME["text_primary"],
            verticalalignment="bottom",
            horizontalalignment="right",
            bbox={
                "boxstyle": "round,pad=0.5",
                "facecolor": SEABORN_DARK_THEME["card"],
                "alpha": 0.9,
            },
        )

    def _create_clustering_analysis(self, ax, data: pd.DataFrame):
        """Create clustering analysis with PCA visualization"""

        # Prepare data for clustering
        features = [
            "quality_score",
            "improvement_rate",
            "complexity_score",
            "implementation_effort",
            "usage_frequency",
        ]

        # Extract and scale features
        X = data[features].dropna()
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X)

        # Apply PCA for 2D visualization
        pca = PCA(n_components=2)
        X_pca = pca.fit_transform(X_scaled)

        # Perform clustering
        n_clusters = 4
        kmeans = KMeans(n_clusters=n_clusters, random_state=42)
        clusters = kmeans.fit_predict(X_scaled)

        # Create scatter plot
        scatter = ax.scatter(
            X_pca[:, 0],
            X_pca[:, 1],
            c=clusters,
            cmap="viridis",
            s=100,
            alpha=0.8,
            edgecolor="white",
            linewidth=1.5,
        )

        # Add cluster centers
        centers_pca = pca.transform(kmeans.cluster_centers_)
        ax.scatter(
            centers_pca[:, 0],
            centers_pca[:, 1],
            c="red",
            marker="x",
            s=300,
            linewidth=5,
            label="Centroids",
        )

        # Add cluster labels
        for i, center in enumerate(centers_pca):
            ax.annotate(
                f"C{i+1}",
                center,
                fontsize=12,
                fontweight="bold",
                color=SEABORN_DARK_THEME["text_primary"],
                bbox={
                    "boxstyle": "circle,pad=0.3",
                    "facecolor": SEABORN_DARK_THEME["neon_lime"],
                    "alpha": 0.8,
                },
            )

        # Add explained variance info
        variance_text = f"📊 PCA Analysis\nPC1: {pca.explained_variance_ratio_[0]:.1%}\nPC2: {pca.explained_variance_ratio_[1]:.1%}\nTotal: {sum(pca.explained_variance_ratio_):.1%}"
        ax.text(
            0.02,
            0.98,
            variance_text,
            transform=ax.transAxes,
            fontsize=11,
            fontweight="bold",
            color=SEABORN_DARK_THEME["text_primary"],
            verticalalignment="top",
            bbox={
                "boxstyle": "round,pad=0.5",
                "facecolor": SEABORN_DARK_THEME["card"],
                "alpha": 0.9,
            },
        )

        ax.set_title(
            "🎯 OPTIMIZATION PATTERN CLUSTERING",
            fontsize=18,
            fontweight="bold",
            color=SEABORN_DARK_THEME["text_primary"],
            pad=20,
        )
        ax.set_xlabel(
            f"First Principal Component ({pca.explained_variance_ratio_[0]:.1%})",
            fontweight="bold",
            color=SEABORN_DARK_THEME["text_secondary"],
        )
        ax.set_ylabel(
            f"Second Principal Component ({pca.explained_variance_ratio_[1]:.1%})",
            fontweight="bold",
            color=SEABORN_DARK_THEME["text_secondary"],
        )

        # Add colorbar
        cbar = plt.colorbar(scatter, ax=ax, shrink=0.8)
        cbar.set_label(
            "Cluster", color=SEABORN_DARK_THEME["text_primary"], fontweight="bold"
        )
        cbar.ax.tick_params(colors=SEABORN_DARK_THEME["text_primary"])

    def _create_prediction_model_viz(self, ax, data: pd.DataFrame):
        """Create prediction model performance visualization"""

        # Create actual vs predicted visualization
        from sklearn.ensemble import RandomForestRegressor
        from sklearn.metrics import mean_squared_error, r2_score
        from sklearn.model_selection import train_test_split

        # Prepare features and target
        features = ["complexity_score", "implementation_effort", "usage_frequency"]
        X = data[features].dropna()
        y = data.loc[X.index, "quality_score"]

        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.3, random_state=42
        )

        # Train model
        model = RandomForestRegressor(n_estimators=100, random_state=42)
        model.fit(X_train, y_train)

        # Make predictions
        y_pred = model.predict(X_test)

        # Calculate metrics
        r2 = r2_score(y_test, y_pred)
        rmse = np.sqrt(mean_squared_error(y_test, y_pred))

        # Create scatter plot
        scatter = ax.scatter(
            y_test,
            y_pred,
            c=abs(y_test - y_pred),
            cmap=self.plasma_dark,
            s=100,
            alpha=0.8,
            edgecolor="white",
            linewidth=1.5,
        )

        # Add perfect prediction line
        min_val = min(*y_test, *y_pred)
        max_val = max(*y_test, *y_pred)
        ax.plot(
            [min_val, max_val],
            [min_val, max_val],
            color=SEABORN_DARK_THEME["neon_lime"],
            linewidth=4,
            alpha=0.8,
            linestyle="--",
            label="Perfect Prediction",
        )

        # Add confidence bands
        margin = 0.1
        ax.fill_between(
            [min_val, max_val],
            [min_val - margin, max_val - margin],
            [min_val + margin, max_val + margin],
            alpha=0.2,
            color=SEABORN_DARK_THEME["success"],
        )

        # Add model performance metrics
        metrics_text = f"🤖 Model Performance\nR² Score: {r2:.3f}\nRMSE: {rmse:.3f}\nSamples: {len(y_test)}"
        ax.text(
            0.02,
            0.98,
            metrics_text,
            transform=ax.transAxes,
            fontsize=11,
            fontweight="bold",
            color=SEABORN_DARK_THEME["text_primary"],
            verticalalignment="top",
            bbox={
                "boxstyle": "round,pad=0.5",
                "facecolor": SEABORN_DARK_THEME["card"],
                "alpha": 0.9,
            },
        )

        ax.set_title(
            "🔮 PREDICTIVE MODEL PERFORMANCE",
            fontsize=18,
            fontweight="bold",
            color=SEABORN_DARK_THEME["text_primary"],
            pad=20,
        )
        ax.set_xlabel(
            "Actual Quality Score",
            fontweight="bold",
            color=SEABORN_DARK_THEME["text_secondary"],
        )
        ax.set_ylabel(
            "Predicted Quality Score",
            fontweight="bold",
            color=SEABORN_DARK_THEME["text_secondary"],
        )

        # Add colorbar for prediction error
        cbar = plt.colorbar(scatter, ax=ax, shrink=0.8)
        cbar.set_label(
            "Prediction Error",
            color=SEABORN_DARK_THEME["text_primary"],
            fontweight="bold",
        )
        cbar.ax.tick_params(colors=SEABORN_DARK_THEME["text_primary"])

        ax.legend(loc="lower right")

    def _add_analytical_decorations(self, fig):
        """Add decorative elements and annotations"""

        # Add timestamp and system info
        fig.text(
            0.99,
            0.01,
            f'⏰ Generated: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}',
            ha="right",
            va="bottom",
            fontsize=10,
            color=SEABORN_DARK_THEME["text_secondary"],
            bbox={
                "boxstyle": "round,pad=0.3",
                "facecolor": SEABORN_DARK_THEME["card"],
                "alpha": 0.8,
            },
        )

        # Add performance indicator
        fig.text(
            0.01,
            0.99,
            "🔬 STATISTICAL ANALYSIS ACTIVE",
            ha="left",
            va="top",
            fontsize=14,
            fontweight="bold",
            color=SEABORN_DARK_THEME["success"],
            bbox={
                "boxstyle": "round,pad=0.5",
                "facecolor": SEABORN_DARK_THEME["card"],
                "edgecolor": SEABORN_DARK_THEME["success"],
                "linewidth": 2,
                "alpha": 0.9,
            },
        )

        # Add decorative corner elements
        corner_size = 0.02
        for corner in [(0, 0), (1, 0), (0, 1), (1, 1)]:
            x, y = corner
            fig.add_artist(
                patches.Rectangle(
                    (x - corner_size / 2, y - corner_size / 2),
                    corner_size,
                    corner_size,
                    facecolor=SEABORN_DARK_THEME["primary"],
                    alpha=0.6,
                    transform=fig.transFigure,
                )
            )

    def _generate_rich_dataset(self) -> pd.DataFrame:
        """Generate rich synthetic dataset for demonstration"""

        np.random.seed(42)
        n_samples = 300

        # Generate base features
        dates = pd.date_range(start="2024-01-01", periods=n_samples, freq="D")

        techniques = [
            "Role Definition",
            "XML Structure",
            "Chain of Thought",
            "Output Format",
            "Examples",
            "Structured Instructions",
        ]
        domains = [
            "Software Engineering",
            "Data Science",
            "Business Analysis",
            "Marketing",
            "Research",
        ]
        complexity_levels = ["Simple", "Intermediate", "Complex"]

        data = {
            "optimization_date": np.random.choice(dates, n_samples),
            "technique_category": np.random.choice(techniques, n_samples),
            "domain": np.random.choice(domains, n_samples),
            "complexity_level": np.random.choice(complexity_levels, n_samples),
            "complexity_score": np.random.normal(0.6, 0.2, n_samples),
            "implementation_effort": np.random.normal(3.5, 1.2, n_samples),
            "usage_frequency": np.random.normal(75, 15, n_samples),
            "technique_effectiveness": np.random.normal(0.8, 0.15, n_samples),
            "domain_familiarity": np.random.normal(0.7, 0.2, n_samples),
        }

        # Create correlated target variable
        quality_base = (
            0.3 * data["technique_effectiveness"]
            + 0.2 * (1 - data["complexity_score"])
            + 0.2 * data["domain_familiarity"]
            + 0.1 * data["usage_frequency"] / 100
            + 0.2 * np.random.normal(0, 0.1, n_samples)
        )

        data["quality_score"] = np.clip(quality_base, 0, 1)
        data["improvement_rate"] = np.clip(
            data["quality_score"] * 0.4 + np.random.normal(0, 0.05, n_samples), 0, 1
        )
        data["roi_score"] = data["improvement_rate"] / (
            data["implementation_effort"] / 5
        )

        # Ensure positive values where needed
        data["complexity_score"] = np.clip(data["complexity_score"], 0.1, 1)
        data["implementation_effort"] = np.clip(data["implementation_effort"], 1, 5)
        data["usage_frequency"] = np.clip(data["usage_frequency"], 10, 100)
        data["technique_effectiveness"] = np.clip(
            data["technique_effectiveness"], 0.3, 1
        )
        data["domain_familiarity"] = np.clip(data["domain_familiarity"], 0.2, 1)

        return pd.DataFrame(data)

    def create_publication_ready_plots(
        self, data: Optional[pd.DataFrame] = None
    ) -> list[str]:
        """
        Create individual publication-ready plots
        """

        if data is None:
            data = self._generate_rich_dataset()

        # 1. Advanced Correlation Network
        fig, ax = plt.subplots(figsize=(12, 10))
        self._create_advanced_correlation_network(ax, data)
        filename1 = "seaborn_correlation_network.png"
        plt.savefig(
            filename1,
            dpi=300,
            bbox_inches="tight",
            facecolor=SEABORN_DARK_THEME["background"],
        )
        plt.close()
        # 2. Performance Evolution Landscape
        fig, ax = plt.subplots(figsize=(14, 8))
        self._create_performance_evolution_landscape(ax, data)
        filename2 = "seaborn_performance_landscape.png"
        plt.savefig(
            filename2,
            dpi=300,
            bbox_inches="tight",
            facecolor=SEABORN_DARK_THEME["background"],
        )
        plt.close()
        # 3. Multi-dimensional Quality Analysis
        fig, ax = plt.subplots(figsize=(12, 12))
        self._create_multidimensional_quality_analysis(ax, data)
        filename3 = "seaborn_quality_analysis.png"
        plt.savefig(
            filename3,
            dpi=300,
            bbox_inches="tight",
            facecolor=SEABORN_DARK_THEME["background"],
        )
        plt.close()
        return [filename1, filename2, filename3]

    def _create_advanced_correlation_network(self, ax, data: pd.DataFrame):
        """Create network-style correlation visualization"""

        # Calculate correlations
        numeric_cols = [
            "quality_score",
            "improvement_rate",
            "complexity_score",
            "implementation_effort",
            "usage_frequency",
            "roi_score",
        ]
        corr_matrix = data[numeric_cols].corr()

        # Create network layout
        import networkx as nx

        G = nx.Graph()

        # Add nodes
        for col in numeric_cols:
            G.add_node(col)

        # Add edges based on correlation strength
        for i, col1 in enumerate(numeric_cols):
            for j, col2 in enumerate(numeric_cols):
                if i < j:  # Avoid duplicates
                    corr_val = abs(corr_matrix.loc[col1, col2])
                    if corr_val > 0.3:  # Only show significant correlations
                        G.add_edge(col1, col2, weight=corr_val)

        # Create layout
        pos = nx.spring_layout(G, k=3, iterations=50)

        # Draw network
        # Edges
        for u, v, d in G.edges(data=True):
            weight = d["weight"]
            color = (
                SEABORN_DARK_THEME["primary"]
                if weight > 0.7
                else SEABORN_DARK_THEME["secondary"]
            )
            ax.plot(
                [pos[u][0], pos[v][0]],
                [pos[u][1], pos[v][1]],
                color=color,
                alpha=weight,
                linewidth=weight * 10,
            )

        # Nodes
        for node in G.nodes():
            x, y = pos[node]
            ax.scatter(
                x,
                y,
                s=1000,
                c=SEABORN_DARK_THEME["neon_lime"],
                alpha=0.8,
                edgecolor="white",
                linewidth=3,
                zorder=10,
            )
            ax.text(
                x,
                y,
                node.replace("_", "\n"),
                ha="center",
                va="center",
                fontweight="bold",
                color=SEABORN_DARK_THEME["background"],
                fontsize=9,
            )

        ax.set_title(
            "🕸️ FEATURE CORRELATION NETWORK",
            fontsize=20,
            fontweight="bold",
            color=SEABORN_DARK_THEME["text_primary"],
            pad=30,
        )
        ax.axis("off")

    def _create_performance_evolution_landscape(self, ax, data: pd.DataFrame):
        """Create 3D-style performance evolution landscape"""

        # Prepare temporal data
        data_sorted = data.sort_values("optimization_date")
        data_sorted["days"] = (
            data_sorted["optimization_date"] - data_sorted["optimization_date"].min()
        ).dt.days

        # Create performance surface

        # Grid for interpolation
        days_grid = np.linspace(
            data_sorted["days"].min(), data_sorted["days"].max(), 50
        )
        quality_grid = np.linspace(0, 1, 50)

        # Create heatmap effect
        for technique in data_sorted["technique_category"].unique():
            tech_data = data_sorted[data_sorted["technique_category"] == technique]

            # Create density plot
            sns.kdeplot(
                data=tech_data,
                x="days",
                y="quality_score",
                cmap=self.viridis_dark,
                fill=True,
                alpha=0.6,
                levels=10,
                ax=ax,
            )

        # Add trajectory line
        moving_avg = data_sorted.groupby("days")["quality_score"].mean()
        ax.plot(
            moving_avg.index,
            moving_avg.values,
            color=SEABORN_DARK_THEME["neon_lime"],
            linewidth=5,
            alpha=0.9,
            label="Performance Trajectory",
        )

        ax.set_title(
            "🌊 PERFORMANCE EVOLUTION LANDSCAPE",
            fontsize=20,
            fontweight="bold",
            color=SEABORN_DARK_THEME["text_primary"],
            pad=30,
        )
        ax.set_xlabel(
            "Days Since Start",
            fontweight="bold",
            color=SEABORN_DARK_THEME["text_secondary"],
        )
        ax.set_ylabel(
            "Quality Score",
            fontweight="bold",
            color=SEABORN_DARK_THEME["text_secondary"],
        )

    def _create_multidimensional_quality_analysis(self, ax, data: pd.DataFrame):
        """Create comprehensive quality analysis with multiple dimensions"""

        # Create parallel coordinates plot
        from pandas.plotting import parallel_coordinates

        # Prepare data for parallel coordinates
        features = [
            "quality_score",
            "improvement_rate",
            "technique_effectiveness",
            "domain_familiarity",
        ]
        plot_data = data[[*features, "technique_category"]].copy()

        # Normalize features to 0-1 scale
        for feature in features:
            plot_data[feature] = (plot_data[feature] - plot_data[feature].min()) / (
                plot_data[feature].max() - plot_data[feature].min()
            )

        # Sample data to avoid overcrowding
        plot_data_sample = plot_data.sample(n=min(100, len(plot_data)), random_state=42)

        # Create parallel coordinates plot
        parallel_coordinates(
            plot_data_sample,
            "technique_category",
            colormap="viridis",
            alpha=0.7,
            linewidth=2,
            ax=ax,
        )

        ax.set_title(
            "🌈 MULTI-DIMENSIONAL QUALITY ANALYSIS",
            fontsize=20,
            fontweight="bold",
            color=SEABORN_DARK_THEME["text_primary"],
            pad=30,
        )
        ax.set_ylabel(
            "Normalized Score",
            fontweight="bold",
            color=SEABORN_DARK_THEME["text_secondary"],
        )

        # Customize legend
        ax.legend(
            title="Optimization Technique", bbox_to_anchor=(1.05, 1), loc="upper left"
        )


def main():
    """Test the Seaborn analytics system"""

    analytics = SeabornAnalytics()

    print("=== SEABORN ANALYTICS SYSTEM ===")
    print("Creating publication-quality statistical visualizations...")

    # Create comprehensive analytics suite
    suite_file = analytics.create_comprehensive_analytics_suite()
    print(f"📊 Comprehensive analytics suite saved: {suite_file}")

    # Create individual publication-ready plots
    individual_files = analytics.create_publication_ready_plots()
    print("📈 Individual plots saved:")
    for file in individual_files:
        print(f"  - {file}")

    return analytics


if __name__ == "__main__":
    main()
