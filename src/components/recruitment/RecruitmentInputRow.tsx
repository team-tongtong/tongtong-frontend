import type { ComponentProps } from 'react'
import { QuantityCounter } from '@/components/quantity/QuantityCounter'
import styles from './Recruitment.module.css'

type RecruitmentInputRowProps = Omit<
  ComponentProps<typeof QuantityCounter>,
  'variant'
> & {
  description: string
}

export function RecruitmentInputRow({
  description,
  ...counter
}: RecruitmentInputRowProps) {
  return (
    <div className={styles.inputRow}>
      <div>
        <span>{counter.label}</span>
        <small>{description}</small>
      </div>
      <QuantityCounter {...counter} variant="recruitment" />
    </div>
  )
}
