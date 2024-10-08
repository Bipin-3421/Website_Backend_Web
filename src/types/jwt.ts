import { MemberRole } from 'common/enum/memberRole.enum'

export interface AuthPayload {
  memberId: string
  role: MemberRole
}
