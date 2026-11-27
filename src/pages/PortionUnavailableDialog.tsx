import { useLayoutEffect, useRef } from 'react'
import { PrimaryButton } from '@/components/button/PrimaryButton'
import mascot from '@/assets/recruitment/portion-notice.png'
import closeIcon from '@/assets/order/close.svg'
import styles from './CreateRoomPage.module.css'

export function PortionUnavailableDialog({
  onDismiss,
}: {
  onDismiss: () => void
}) {
  const ref = useRef<HTMLDialogElement>(null)
  useLayoutEffect(() => {
    const dialog = ref.current!
    dialog.showModal()
    return () => dialog.close()
  }, [])
  return (
    <dialog
      ref={ref}
      className={styles.noticeDialog}
      aria-labelledby="portion-notice-title"
      onCancel={(event) => {
        event.preventDefault()
        onDismiss()
      }}
    >
      <button
        type="button"
        aria-label="닫기"
        className={styles.closeNotice}
        onClick={onDismiss}
      >
        <img src={closeIcon} alt="" />
      </button>
      <img src={mascot} alt="" width="88" height="88" />
      <h2 id="portion-notice-title">나눠통을 사용할 수 없어요</h2>
      <p>
        나눠통은 나눌 수 있는 메뉴를
        <br />한 종류, 한 개만 담았을 때 이용할 수 있어요.
      </p>
      <section className={styles.requirements}>
        <h3>나눠통 이용 조건을 확인해 주세요!</h3>
        <ul>
          <li>나눌 수 있는 메뉴 선택</li>
          <li>한 종류의 메뉴만 선택</li>
          <li>나눌 메뉴의 수량은 1개로 제한</li>
        </ul>
      </section>
      <PrimaryButton onClick={onDismiss}>확인했어요</PrimaryButton>
    </dialog>
  )
}
