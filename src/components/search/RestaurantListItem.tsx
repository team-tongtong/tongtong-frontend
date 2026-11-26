import star from '@/assets/search/star.svg'
import styles from './SearchList.module.css'

type RestaurantListItemProps = {
  image: string
  name: string
  rating?: number
  reviewCount?: number
  minimumOrder?: number | null
  deliveryInfo?: string
  onSelect: () => void
}

export function RestaurantListItem({
  image,
  name,
  rating,
  reviewCount,
  minimumOrder,
  deliveryInfo,
  onSelect,
}: RestaurantListItemProps) {
  return (
    <button type="button" className={styles.restaurant} onClick={onSelect}>
      <img className={styles.logo} src={image} alt="" />
      <span className={styles.copy}>
        <strong className={styles.storeName}>{name}</strong>
        {(rating != null || minimumOrder != null) && (
          <span className={styles.meta}>
            {rating != null && (
              <>
                <img src={star} alt="평점" /> {rating.toFixed(1)}
                {reviewCount != null &&
                  ` (${reviewCount.toLocaleString('ko-KR')})`}
              </>
            )}
            {rating != null && minimumOrder != null && ' | '}
            {minimumOrder != null &&
              `최소주문 ${minimumOrder.toLocaleString('ko-KR')}원`}
          </span>
        )}
        {deliveryInfo && (
          <span className={styles.description}>{deliveryInfo}</span>
        )}
      </span>
    </button>
  )
}
