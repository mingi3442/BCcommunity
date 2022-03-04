import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <div className={styles.footerContainer}>
      <div className={styles.bottomContainer}>
        <div>©2022 MingiLee</div>
        <ul>
          <li>Blockmunity</li>
        </ul>
      </div>
    </div>
  );
}
