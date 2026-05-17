import styles from "./Footer.module.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.root}>
      <div className={styles.inner}>
        <div className={styles.brandSection}>
          <h2 className={styles.title}>Mini Anime List</h2>

          <p className={styles.description}>
            A simple anime tracking app where users can browse anime, read
            details, comment, rate titles, and manage a personal watchlist.
          </p>
        </div>

        <div className={styles.infoSection}>
          <div className={styles.group}>
            <h3 className={styles.groupTitle}>Tech Stack</h3>

            <div className={styles.techList}>
              <span>React</span>
              <span>Vite</span>
              <span>Recoil</span>
              <span>Spring Boot</span>
              <span>MariaDB</span>
            </div>
          </div>

          <div className={styles.group}>
            <h3 className={styles.groupTitle}>Project</h3>

            <a
              href="https://github.com/your-username/mini-anime-list"
              className={styles.link}
              target="_blank"
              rel="noreferrer"
            >
              GitHub Repository
            </a>

            <p className={styles.version}>Version 1.0.0</p>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <p>© {currentYear} Mini Anime List. All rights reserved.</p>
      </div>
    </footer>
  );
}