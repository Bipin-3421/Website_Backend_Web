export enum PermissionResource {
  ALL = 'all',
  APPLICANT = 'Applicant',
  VACANCY = 'Vacancy',
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
