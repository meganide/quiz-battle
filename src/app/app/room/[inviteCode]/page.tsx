import { Container } from "@/components/container"

type RoomPageProps = {
  params: {
    inviteCode: string
  }
}

export default function RoomPage({ params }: RoomPageProps) {
  const { inviteCode } = params

  return <Container>RoomPage {inviteCode}</Container>
}
