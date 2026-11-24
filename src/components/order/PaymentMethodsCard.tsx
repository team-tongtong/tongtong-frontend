import { useId } from 'react'
import { Radio } from '@/components/recruitment/ChoiceCard'
import styles from './OrderCards.module.css'

type PaymentMethodsCardProps = {
  methods: readonly string[]
  selected?: string
  onChange: (method: string) => void
}

export function PaymentMethodsCard({
  methods,
  selected,
  onChange,
}: PaymentMethodsCardProps) {
  const group = useId()
  return (
    <section className={styles.card} aria-labelledby={group}>
      <div className={styles.heading}>
        <h2 id={group}>결제 수단</h2>
      </div>
      <div role="radiogroup" aria-labelledby={group}>
        {methods.map((method) => (
          <label key={method} className={styles.payment}>
            <Radio
              name={group}
              value={method}
              checked={selected === method}
              onChange={() => onChange(method)}
            />
            <span>{method}</span>
          </label>
        ))}
      </div>
    </section>
  )
}
