export enum PermissionResource {
  ALL = 'all',
  APPLICANT = 'Applicant',
  VACANCY = 'Vacancy',
}

export type Permission = {
  resource: PermissionResource;
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
