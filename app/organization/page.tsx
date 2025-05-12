import { OrganizationList } from '@clerk/nextjs'

export default function OrganizationListPage() {
  return (
    <OrganizationList
      afterCreateOrganizationUrl="/organization/"
    />
  )
}