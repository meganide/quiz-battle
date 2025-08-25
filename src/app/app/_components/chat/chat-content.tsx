import { ScrollArea } from "@/components/ui/scroll-area"

import { ChatMessage } from "./chat-message"

// Dummy messages for demonstration
const dummyMessages = [
  {
    id: "1",
    username: "technameless",
    content: "Why r you not responding with ur responsable",
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    avatarUrl: undefined,
    isOwnMessage: false,
  },
  {
    id: "2",
    username: "Bazillion",
    content: "gtr",
    timestamp: new Date(Date.now() - 1000 * 60 * 3), // 3 minutes ago
    avatarUrl: undefined,
    isOwnMessage: false,
  },
  {
    id: "3",
    username: "GameMaster",
    content: "congratulations",
    timestamp: new Date(Date.now() - 1000 * 60 * 2), // 2 minutes ago
    avatarUrl: undefined,
    isOwnMessage: false,
  },
  {
    id: "4",
    username: "You",
    content: "Thanks everyone! That was a great match 🎉",
    timestamp: new Date(Date.now() - 1000 * 30), // 30 seconds ago
    avatarUrl: undefined,
    isOwnMessage: true,
  },
  {
    id: "5",
    username: "QuizKing",
    content:
      "Ready for the next round? This time I'm not going easy on you all 😤",
    timestamp: new Date(Date.now() - 1000 * 10), // 10 seconds ago
    avatarUrl: undefined,
    isOwnMessage: false,
  },
  {
    id: "6",
    username: "SmartCookie",
    content: "Bring it on! I've been studying for this 📚",
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    avatarUrl: undefined,
    isOwnMessage: false,
  },
  {
    id: "7",
    username: "RandomFacts",
    content: "Did you know octopuses have three hearts?",
    timestamp: new Date(Date.now() - 1000 * 60 * 18), // 18 minutes ago
    avatarUrl: undefined,
    isOwnMessage: false,
  },
  {
    id: "8",
    username: "You",
    content: "That's actually really cool! I love random trivia",
    timestamp: new Date(Date.now() - 1000 * 60 * 17), // 17 minutes ago
    avatarUrl: undefined,
    isOwnMessage: true,
  },
  {
    id: "9",
    username: "BrainTeaser",
    content: "Anyone else think the history questions were super hard?",
    timestamp: new Date(Date.now() - 1000 * 60 * 20), // 20 minutes ago
    avatarUrl: undefined,
    isOwnMessage: false,
  },
  {
    id: "10",
    username: "HistoryBuff",
    content: "Not really, I'm a history major 🎓",
    timestamp: new Date(Date.now() - 1000 * 60 * 19), // 19 minutes ago
    avatarUrl: undefined,
    isOwnMessage: false,
  },
  {
    id: "11",
    username: "MathWiz",
    content: "The math section was my favorite! Quick calculations are fun",
    timestamp: new Date(Date.now() - 1000 * 60 * 22), // 22 minutes ago
    avatarUrl: undefined,
    isOwnMessage: false,
  },
  {
    id: "12",
    username: "PopCulturePro",
    content: "I totally nailed the entertainment questions 🎬",
    timestamp: new Date(Date.now() - 1000 * 60 * 25), // 25 minutes ago
    avatarUrl: undefined,
    isOwnMessage: false,
  },
  {
    id: "13",
    username: "ScienceNerd",
    content: "The physics question about quantum mechanics was tricky",
    timestamp: new Date(Date.now() - 1000 * 60 * 28), // 28 minutes ago
    avatarUrl: undefined,
    isOwnMessage: false,
  },
  {
    id: "14",
    username: "GeographyGuru",
    content: "I'm surprised how many people missed the capital cities",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    avatarUrl: undefined,
    isOwnMessage: false,
  },
  {
    id: "15",
    username: "You",
    content: "Geography was never my strong suit 😅",
    timestamp: new Date(Date.now() - 1000 * 60 * 29), // 29 minutes ago
    avatarUrl: undefined,
    isOwnMessage: true,
  },
  {
    id: "16",
    username: "LiteratureLover",
    content: "The Shakespeare question was a gimme for English majors",
    timestamp: new Date(Date.now() - 1000 * 60 * 32), // 32 minutes ago
    avatarUrl: undefined,
    isOwnMessage: false,
  },
  {
    id: "17",
    username: "SportsExpert",
    content: "Finally! Some sports questions I could actually answer",
    timestamp: new Date(Date.now() - 1000 * 60 * 35), // 35 minutes ago
    avatarUrl: undefined,
    isOwnMessage: false,
  },
  {
    id: "18",
    username: "ArtAppreciator",
    content: "The art history section was beautiful but challenging",
    timestamp: new Date(Date.now() - 1000 * 60 * 38), // 38 minutes ago
    avatarUrl: undefined,
    isOwnMessage: false,
  },
  {
    id: "19",
    username: "TechGuru",
    content: "Programming questions should be added to future rounds!",
    timestamp: new Date(Date.now() - 1000 * 60 * 40), // 40 minutes ago
    avatarUrl: undefined,
    isOwnMessage: false,
  },
  {
    id: "20",
    username: "MusicMaestro",
    content: "Did anyone else get the classical music composer question?",
    timestamp: new Date(Date.now() - 1000 * 60 * 42), // 42 minutes ago
    avatarUrl: undefined,
    isOwnMessage: false,
  },
  {
    id: "21",
    username: "You",
    content: "I guessed Beethoven and got lucky 🎵",
    timestamp: new Date(Date.now() - 1000 * 60 * 41), // 41 minutes ago
    avatarUrl: undefined,
    isOwnMessage: true,
  },
  {
    id: "22",
    username: "CinemaFan",
    content: "Movie trivia is my specialty! Bring on more film questions",
    timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
    avatarUrl: undefined,
    isOwnMessage: false,
  },
  {
    id: "23",
    username: "ChemistryChamp",
    content: "The periodic table question was elementary 😉",
    timestamp: new Date(Date.now() - 1000 * 60 * 48), // 48 minutes ago
    avatarUrl: undefined,
    isOwnMessage: false,
  },
  {
    id: "24",
    username: "WorldTraveler",
    content: "I've been to half the countries mentioned in geography!",
    timestamp: new Date(Date.now() - 1000 * 60 * 50), // 50 minutes ago
    avatarUrl: undefined,
    isOwnMessage: false,
  },
  {
    id: "25",
    username: "FoodieQuizzer",
    content: "We need more food and cooking questions next time!",
    timestamp: new Date(Date.now() - 1000 * 60 * 52), // 52 minutes ago
    avatarUrl: undefined,
    isOwnMessage: false,
  },
]

export function ChatContent() {
  return (
    <ScrollArea className="h-full flex-1 pr-2">
      <section className="flex flex-col">
        {dummyMessages.map((message) => (
          <ChatMessage
            key={message.id}
            avatarUrl={message.avatarUrl}
            content={message.content}
            id={message.id}
            isOwnMessage={message.isOwnMessage}
            timestamp={message.timestamp}
            username={message.username}
          />
        ))}
      </section>
    </ScrollArea>
  )
}
