import { SetMetadata } from '@nestjs/common'
import { IS_PUBLIC } from 'common/constant'

export const PublicRoute = () => SetMetadata(IS_PUBLIC, true)
