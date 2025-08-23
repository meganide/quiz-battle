import { Container } from "@/components/container";

type RoomPageProps = {
  params: {
    roomId: string;
  };
};

export default function RoomPage({ params }: RoomPageProps) {
  const { roomId } = params;

  return (
    <Container>RoomPage {roomId}</Container>
  )
}
