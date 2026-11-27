import { useId, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { PrimaryButton } from '@/components/button/PrimaryButton'
import closeIcon from '@/assets/order/close.svg'
import pickupSuccess from '@/assets/order/pickup-success.png'
import styles from './PickupDialog.module.css'

type PickupDialogProps = {
  title: string
  onDismiss: () => void
  pending?: boolean
  children: ReactNode
}

function PickupDialog({
  title,
  onDismiss,
  pending,
  children,
}: PickupDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  useLayoutEffect(() => {
    const dialog = dialogRef.current!
    const opener = document.activeElement
    dialog.showModal()
    return () => {
      dialog.close()
      if (opener instanceof HTMLElement && opener.isConnected) opener.focus()
    }
  }, [])

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      className={styles.dialog}
      onCancel={(event) => {
        event.preventDefault()
        if (!pending) onDismiss()
      }}
    >
      <div className={styles.panel}>
        <header>
          <p>TONG TONG</p>
          <h2 id={titleId}>{title}</h2>
        </header>
        {children}
        <button
          className={styles.close}
          type="button"
          aria-label="다이얼로그 닫기"
          disabled={pending}
          onClick={onDismiss}
        >
          <img src={closeIcon} alt="" />
        </button>
      </div>
    </dialog>
  )
}

type PickupCodeDialogProps = {
  pending: boolean
  error: string | null
  onDismiss: () => void
  onSubmit: (code: string) => void
}

const codeLength = 5

export function PickupCodeDialog({
  pending,
  error,
  onDismiss,
  onSubmit,
}: PickupCodeDialogProps) {
  const [code, setCode] = useState('')
  const complete = code.length === codeLength

  return (
    <PickupDialog
      title="픽업 코드 입력"
      onDismiss={onDismiss}
      pending={pending}
    >
      <form
        className={styles.form}
        onSubmit={(event) => {
          event.preventDefault()
          if (complete && !pending) onSubmit(code)
        }}
      >
        <div className={styles.field}>
          <div className={styles.lines} aria-hidden="true">
            {Array.from({ length: codeLength }, (_, index) => (
              <span key={index} />
            ))}
          </div>
          <input
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            disabled={pending}
            aria-label="5자리 숫자 픽업 코드"
            value={code}
            onChange={(event) =>
              setCode(
                event.target.value.replace(/\D/g, '').slice(0, codeLength),
              )
            }
          />
        </div>
        {error && <p role="alert">{error}</p>}
        <PrimaryButton type="submit" disabled={!complete || pending}>
          {pending ? '확인 중…' : '확인'}
        </PrimaryButton>
      </form>
    </PickupDialog>
  )
}

export function PickupSuccessDialog({
  onDismiss,
}: Pick<PickupDialogProps, 'onDismiss'>) {
  return (
    <PickupDialog title="수령 완료되었습니다" onDismiss={onDismiss}>
      <img
        className={styles.character}
        src={pickupSuccess}
        width="198"
        height="198"
        alt=""
      />
      <PrimaryButton onClick={onDismiss}>닫기</PrimaryButton>
    </PickupDialog>
  )
}
