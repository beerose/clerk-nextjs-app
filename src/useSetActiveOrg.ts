import { useAuth, useOrganizationList } from "@clerk/nextjs";
import { useEffect } from 'react';

export function useSetActiveOrg() {
  const { orgId } = useAuth();
  const { setActive, userMemberships, isLoaded } = useOrganizationList({
    userMemberships: true,
  });

  const firstOrgId = !orgId && isLoaded ? userMemberships?.data?.[0]?.organization.id : orgId;

  useEffect(() => {
    if (firstOrgId && !orgId && isLoaded) {
      void setActive({
        organization: firstOrgId,
      });
    }
  }, [firstOrgId, setActive, isLoaded, orgId]);

  return firstOrgId || null;
}
