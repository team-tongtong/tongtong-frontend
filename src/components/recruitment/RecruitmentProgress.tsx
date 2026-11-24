import styles from './Recruitment.module.css'

export function RecruitmentProgress({ step }: { step: 1 | 2 }) {
  return (
    <div className={styles.progress}>
      <progress
        aria-label="모집방 만들기 진행 단계"
        aria-valuetext={`2단계 중 ${step}단계`}
        value={step}
        max={2}
      />
    </div>
  )
}
