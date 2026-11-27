export function RecruitDeadline({ value }: { value: string }) {
  return <time dateTime={value}>모집 마감 {value.slice(11, 16)}</time>
}
