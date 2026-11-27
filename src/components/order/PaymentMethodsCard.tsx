import {
  paymentMethods,
  paymentMethodLabels,
  type PaymentMethod,
} from './paymentMethods'
import { useId } from 'react'
import { Radio } from '@/components/recruitment/ChoiceCard'
import styles from './OrderCards.module.css'

type PaymentMethodsCardProps = {
  disabled?: boolean
  selected?: PaymentMethod
  onChange: (method: PaymentMethod) => void
}

export function PaymentMethodsCard({
  disabled,
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
        {paymentMethods.map((method) => (
          <label key={method} className={styles.payment}>
            <Radio
              disabled={disabled}
              name={group}
              value={method}
              checked={selected === method}
              onChange={() => onChange(method)}
            />
            <span>{paymentMethodLabels[method]}</span>
          </label>
        ))}
      </div>
    </section>
  )
}
