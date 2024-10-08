import { MemberRole } from 'common/enum/memberRole.enum';

export enum PermissionResource {
  ALL = 'All',
  APPLICANT = 'Applicant',
  VACANCY = 'Vacancy',
  MEMBER = 'Member',
  CONTACT = 'Contact',
  DESIGNATION = 'Designation',
  DEPARTMENT = 'Department',
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

export const RoleToPermissionArray: { [key in MemberRole]: Permission[] } = {
  [MemberRole.SUPERADMIN]: [
    {
      resource: PermissionResource.ALL,
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
    {
      resource: PermissionResource.CONTACT,
      action: [PermissionAction.VIEW, PermissionAction.EDIT],
    },
    {
      resource: PermissionResource.MEMBER,
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
