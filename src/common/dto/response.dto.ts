export class MessageResponseDTO {
  message: string
}

export class MessageResponseWithIdDTO {
  message: string

  data: {
    id: string
  }
}
