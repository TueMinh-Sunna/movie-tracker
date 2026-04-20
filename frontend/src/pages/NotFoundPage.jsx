import useDocumentTitle from "../hooks/useDocumentTitle";
import { Link } from "react-router-dom";
import styles from "./NotFoundPage.module.css";

export default function NotFoundPage() {
    useDocumentTitle("Page not found");
    return (
        <section className={styles.root}>
            <div className={styles.card}>
                <p className={styles.code}>404</p>
                <h1 className={styles.title}>Page not found</h1>
                <p className={styles.message}>
                    The page you tried to open does not exist, or the link may be incorrect.
                </p>

                <div className={styles.actions}>
                    <Link to="/" className={styles.primaryAction}>
                        Go Home
                    </Link>

                    <Link to="/browse" className={styles.secondaryAction}>
                        Browse Anime
                    </Link>
                </div>
            </div>
        </section>
    );
}