import { renderToStaticMarkup } from 'react-dom/server'
import { expect, it } from 'vitest'
import { RoomPaymentSummary } from './RoomPaymentSummary'
import { selectRoomMenu } from './roomMenuSelection'

const store = {
  id: 1,
  name: '떡찜',
  image: '',
  deliveryFeeTotal: 2000,
  menus: [],
}
const menu = selectRoomMenu(store, {
  id: 1,
  name: '갈낙찜닭',
  price: 34800,
  portionable: true,
})
const drink = {
  ...selectRoomMenu(store, { id: 2, name: '콜라', price: 1000 }),
  quantity: 2,
}

it.each([
  { shared: true, individualMenus: [], total: '9,700원' },
  { shared: true, individualMenus: [drink], total: '11,700원' },
  { shared: false, individualMenus: [], total: '35,300원' },
])(
  '모집방 생성 금액에 나눠통일 때만 1인 수수료를 반영한다 ($total)',
  ({ shared, individualMenus, total }) => {
    const html = renderToStaticMarkup(
      <RoomPaymentSummary
        menus={[menu]}
        people={4}
        shared={shared}
        individualMenus={individualMenus}
      />,
    )
    expect(html.includes('<dt>소분 수수료</dt><dd>500원</dd>')).toBe(shared)
    expect(html).toContain(`<dt>결제 금액</dt><dd>${total}</dd>`)
  },
)
