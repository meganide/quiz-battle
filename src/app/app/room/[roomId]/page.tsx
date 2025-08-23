type RoomPageProps = {
  params: {
    roomId: string;
  };
};

export default function RoomPage({ params }: RoomPageProps) {
  const { roomId } = params;

  return (
    <div>RoomPage {roomId}</div>
  )
}
