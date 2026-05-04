import styles from "./Skeleton.module.css";

export function SkeletonBlock({ className = "" }) {
    return <div className={`${styles.skeleton} ${className}`} aria-hidden="true" />;
}

export function AnimeCardSkeleton({ withSubtitle = false, withActions = false }) {
    return (
        <article className={styles.card}>
            <SkeletonBlock className={styles.poster} />

            <div className={styles.cardBody}>
                <SkeletonBlock className={styles.cardTitleLine} />

                <div className={styles.ratingRow}>
                    <SkeletonBlock className={styles.ratingLabelLine} />
                    <SkeletonBlock className={styles.ratingValuePill} />
                </div>

                {withSubtitle ? (
                    <SkeletonBlock className={styles.subtitleLine} />
                ) : null}
            </div>

            {withActions ? (
                <div className={styles.cardActions}>
                    <SkeletonBlock className={styles.actionButton} />
                </div>
            ) : null}
        </article>
    );
}

export function AnimeGridSkeleton({
    count = 6,
    withSubtitle = false,
    withActions = false,
}) {
    return (
        <div className={styles.grid}>
            {Array.from({ length: count }).map((_, index) => (
                <AnimeCardSkeleton
                    key={index}
                    withSubtitle={withSubtitle}
                    withActions={withActions}
                />
            ))}
        </div>
    );
}

export function DetailsPageSkeleton() {
    return (
        <div className={styles.detailsRoot} role="status" aria-label="Loading anime details">
            <SkeletonBlock className={styles.backLink} />

            <section className={styles.detailsHero}>
                <SkeletonBlock className={styles.detailsPoster} />

                <div className={styles.detailsContent}>
                    <SkeletonBlock className={styles.heading} />
                    <div className={styles.row}>
                        <SkeletonBlock className={styles.pill} />
                        <SkeletonBlock className={styles.pill} />
                    </div>
                    <div className={styles.row}>
                        <SkeletonBlock className={styles.chip} />
                        <SkeletonBlock className={styles.chip} />
                        <SkeletonBlock className={styles.chip} />
                    </div>
                    <SkeletonBlock className={styles.synopsisLarge} />
                </div>
            </section>

            <div className={styles.detailsGrid}>
                <SkeletonBlock className={styles.panelLarge} />
                <SkeletonBlock className={styles.panelSmall} />
            </div>
        </div>
    );
}

export function WatchlistSkeleton() {
    return (
        <div className={styles.watchRoot} role="status" aria-label="Loading watchlist">
            <SkeletonBlock className={styles.heading} />
            <SkeletonBlock className={styles.textLong} />

            <div className={styles.summaryGrid}>
                <SkeletonBlock className={styles.summaryCard} />
                <SkeletonBlock className={styles.summaryCard} />
                <SkeletonBlock className={styles.summaryCard} />
            </div>

            <SkeletonBlock className={styles.filtersCard} />

            <div className={styles.list}>
                {Array.from({ length: 3 }).map((_, index) => (
                    <AnimeCardSkeleton
                        key={index}
                        withSubtitle
                        withActions
                    />
                ))}
            </div>
        </div>
    );
}