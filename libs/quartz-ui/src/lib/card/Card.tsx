import React from 'react';
import styles from './Card.module.css';

export interface CardProps {
  title?: string;
  children: React.ReactNode;
  variant?: 'default' | 'elevated';
}

export function Card({ title, children, variant = 'default' }: CardProps) {
  return (
    <div className={`${styles.card} ${styles[variant]}`}>
      {title && <h3 className={styles.title}>{title}</h3>}
      <div className={styles.content}>{children}</div>
    </div>
  );
}

export default Card;

