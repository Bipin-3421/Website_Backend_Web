import { PermissionResource } from './permission';

export interface AuthPayload<ActiveUser extends boolean = any> {
  userId: string;
  permission: ActiveUser extends true ? PermissionResource[] : undefined;
}
