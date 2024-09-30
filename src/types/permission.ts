import { MemberRole } from 'common/enum/memberRole.enum';

export enum PermissionResource {
  ALL = 'All',
  APPLICANT = 'Applicant',
  VACANCY = 'Vacancy',
  MEMBER = 'Member',
}

export enum PermissionAction {
  VIEW = 'View',
  EDIT = 'Edit',
}

export type Permission = {
  resource: PermissionResource;
  action: PermissionAction[];
};

//only for visible portion
export const PermissionResouceList = [
  {
    title: PermissionResource.APPLICANT,
  },
  {
    title: PermissionResource.VACANCY,
  },
];

export const roleToPermissionArray: { [key in MemberRole]: Permission[] } = {
  [MemberRole.SUPERADMIN]: [
    {
      resource: PermissionResource.MEMBER,
      action: [PermissionAction.VIEW, PermissionAction.EDIT],
    },
  ],
  [MemberRole.ADMIN]: [
    {
      resource: PermissionResource.APPLICANT,
      action: [PermissionAction.VIEW, PermissionAction.EDIT],
    },
    {
      resource: PermissionResource.VACANCY,
      action: [PermissionAction.VIEW, PermissionAction.EDIT],
    },
  ],
  [MemberRole.MEMBER]: [
    {
      resource: PermissionResource.APPLICANT,
      action: [PermissionAction.VIEW],
    },
    {
      resource: PermissionResource.VACANCY,
      action: [PermissionAction.VIEW],
    },
  ],
};

const getPermissionsForRole = (ctx: {
  data: { role: MemberRole };
}): Permission[] => {
  return roleToPermissionArray[ctx.data.role];
};

const ctx = {
  data: {
    role: MemberRole.ADMIN,
  },
};

const permissions = getPermissionsForRole(ctx);
console.log(permissions);
