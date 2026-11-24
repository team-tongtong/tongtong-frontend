import { RecruitmentInputRow } from '@/components/recruitment/RecruitmentInputRow'
import styles from './OrderCards.module.css'

type RecruitmentConditionsCardProps = {
  minimumOrderAmount?: number | null
  people: number
  minutes: number
  onPeopleChange: (people: number) => void
  onMinutesChange: (minutes: number) => void
}

export function RecruitmentConditionsCard({
  minimumOrderAmount,
  people,
  minutes,
  onPeopleChange,
  onMinutesChange,
}: RecruitmentConditionsCardProps) {
  return (
    <section aria-label="모집 조건" className={styles.card}>
      <div className={styles.heading}>
        <h2>모집 조건</h2>
        <small>
          {minimumOrderAmount == null
            ? '최소주문금액 확인 전'
            : `최소주문 ${minimumOrderAmount.toLocaleString('ko-KR')}원`}
        </small>
      </div>
      <div className={styles.conditions}>
        <RecruitmentInputRow
          label="모집 인원"
          description="나를 포함한 전체 인원이에요"
          unit="명"
          min={2}
          value={people}
          onChange={onPeopleChange}
        />
        <RecruitmentInputRow
          label="모집 시간"
          description="최대 60분까지 가능해요"
          unit="분"
          min={1}
          max={60}
          value={minutes}
          onChange={onMinutesChange}
        />
      </div>
    </section>
  )
}
