import type { ComponentPropsWithoutRef } from 'react'
import styles from './Recruitment.module.css'

type RadioProps = Pick<
  ComponentPropsWithoutRef<'input'>,
  'name' | 'value' | 'checked' | 'onChange'
>

export function Radio(props: RadioProps) {
  return <input {...props} type="radio" className={styles.radio} />
}

type ChoiceCardProps = RadioProps & {
  variant: 'method' | 'spot'
  label: string
  description: string
}

export function ChoiceCard({
  variant,
  label,
  description,
  ...radioProps
}: ChoiceCardProps) {
  return (
    <label className={styles.choice} data-variant={variant}>
      <Radio {...radioProps} />
      <span className={styles.copy}>
        <strong>{label}</strong>
        <span>{description}</span>
      </span>
    </label>
  )
}
