export const orderMethodLabels = {
  '각자 담기': '아껴통',
  '내 몫 담기': '나눠통',
} as const

export const trackLabels = {
  INDIVIDUAL: orderMethodLabels['각자 담기'],
  PORTION: orderMethodLabels['내 몫 담기'],
} as const
