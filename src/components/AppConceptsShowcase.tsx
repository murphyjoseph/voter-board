import {
  Box,
  Card,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  SimpleGrid,
  Container,
  Flex
} from "@chakra-ui/react";

interface AppConcept {
  title: string;
  description: string;
  icon: string;
  category: string;
  features: string[];
}

const appConcepts: AppConcept[] = [
  {
    title: "Storybook Calendar",
    description: "A calendar that automatically turns your daily events into a comic strip or mini story.",
    icon: "📚",
    category: "Productivity",
    features: ["Comic Strip Generation", "Event Storytelling", "Visual Timeline"]
  },
  {
    title: "Quest-Based To-Do List",
    description: "Tasks show up as quests in a game world, with rewards for completing them.",
    icon: "⚔️",
    category: "Gamification",
    features: ["Quest System", "Rewards & XP", "Game World"]
  },
  {
    title: "Mood Weather App",
    description: "Instead of charts, the forecast is presented with characters or landscapes that reflect the weather.",
    icon: "🌤️",
    category: "Weather",
    features: ["Character Weather", "Mood Landscapes", "Emotional Forecasts"]
  },
  {
    title: "Sonic Cookbook",
    description: "A recipe app that uses sound effects and ambient noise to guide you through cooking.",
    icon: "🎵",
    category: "Cooking",
    features: ["Audio Guidance", "Kitchen Sounds", "Timer Melodies"]
  },
  {
    title: "Plant Parent Diary",
    description: "Track your plants' health through a social media-style feed where each plant has its own personality.",
    icon: "🌱",
    category: "Lifestyle",
    features: ["Plant Personalities", "Care Feed", "Growth Stories"]
  },
  {
    title: "Memory Palace Notes",
    description: "Note-taking app that organizes information in 3D spaces you can virtually walk through.",
    icon: "🏛️",
    category: "Education",
    features: ["3D Spaces", "Spatial Memory", "Virtual Navigation"]
  },
  {
    title: "Emotion-Based Music Player",
    description: "A music app that reads your facial expressions and plays songs to match or improve your mood.",
    icon: "🎭",
    category: "Music",
    features: ["Emotion Detection", "Mood Matching", "AI Curation"]
  },
  {
    title: "Time Capsule Messaging",
    description: "Send messages to future versions of yourself or friends with delivery dates years ahead.",
    icon: "⏰",
    category: "Communication",
    features: ["Future Delivery", "Time Locks", "Memory Preservation"]
  },
  {
    title: "Habit Constellation",
    description: "Visualize your habits as constellations that grow brighter as you maintain consistency.",
    icon: "⭐",
    category: "Health",
    features: ["Star Patterns", "Brightness Levels", "Cosmic Progress"]
  }
];

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    'Productivity': 'blue',
    'Gamification': 'purple',
    'Weather': 'cyan',
    'Cooking': 'orange',
    'Lifestyle': 'green',
    'Education': 'teal',
    'Music': 'pink',
    'Communication': 'red',
    'Health': 'yellow'
  };
  return colors[category] || 'gray';
};

export function AppConceptsShowcase() {
  return (
    <Container maxW="container.xl" py={8}>
      <VStack gap={8} align="stretch">
        {/* Header Section */}
        <Box textAlign="center">
          <Heading size="xl" mb={4} color="blue.600">
            💡 Reinvent Ordinary Apps with a Fresh Twist
          </Heading>
          <Text fontSize="lg" color="gray.600" maxW="2xl" mx="auto">
            Discover innovative concepts that transform everyday tools into extraordinary experiences
          </Text>
        </Box>

        {/* App Concepts Grid */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
          {appConcepts.map((concept, index) => {
            const categoryColor = getCategoryColor(concept.category);
            return (
              <Card.Root
                key={index}
                bg="white"
                borderWidth="2px"
                borderColor="gray.100"
                borderRadius="xl"
                overflow="hidden"
                _hover={{
                  borderColor: `${categoryColor}.300`,
                  transform: "translateY(-4px)",
                  shadow: "xl"
                }}
                transition="all 0.3s ease-in-out"
                cursor="pointer"
                position="relative"
              >
                <Box
                  position="absolute"
                  top={0}
                  left={0}
                  right={0}
                  h="4px"
                  bg={`${categoryColor}.400`}
                />
                <Card.Body p={6}>
                  <VStack align="start" gap={4}>
                    {/* Icon & Category */}
                    <Flex justify="space-between" align="start" w="full">
                      <Box
                        fontSize="3xl"
                        lineHeight="1"
                        mb={2}
                        p={2}
                        borderRadius="lg"
                        bg={`${categoryColor}.50`}
                      >
                        {concept.icon}
                      </Box>
                      <Badge
                        colorScheme={categoryColor}
                        variant="subtle"
                        fontSize="xs"
                        px={2}
                        py={1}
                        borderRadius="full"
                      >
                        {concept.category}
                      </Badge>
                    </Flex>

                    {/* Title */}
                    <Heading size="md" color="gray.800" lineHeight="short">
                      {concept.title}
                    </Heading>

                    {/* Description */}
                    <Text fontSize="sm" color="gray.600" lineHeight="tall">
                      {concept.description}
                    </Text>

                  {/* Features */}
                  <VStack align="start" gap={2} w="full">
                    <Text
                      fontSize="xs"
                      fontWeight="bold"
                      color={`${categoryColor}.600`}
                      textTransform="uppercase"
                      letterSpacing="wide"
                    >
                      Key Features
                    </Text>
                    <VStack align="start" gap={1}>
                      {concept.features.map((feature, idx) => (
                        <HStack key={idx} gap={2}>
                          <Box
                            w="6px"
                            h="6px"
                            bg={`${categoryColor}.500`}
                            borderRadius="full"
                            flexShrink={0}
                            mt={1}
                          />
                          <Text fontSize="xs" color="gray.600" fontWeight="medium">
                            {feature}
                          </Text>
                        </HStack>
                      ))}
                    </VStack>
                  </VStack>
                </VStack>
              </Card.Body>
            </Card.Root>
            );
          })}
        </SimpleGrid>

        {/* Call to Action */}
        <Box
          textAlign="center"
          bg="gradient-to-r"
          bgGradient="linear(to-r, blue.50, purple.50, pink.50)"
          borderRadius="2xl"
          p={8}
          borderWidth="2px"
          borderColor="blue.200"
          position="relative"
          overflow="hidden"
        >
          <Box
            position="absolute"
            top="-50%"
            right="-50%"
            w="200%"
            h="200%"
            bg="radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)"
            pointerEvents="none"
          />
          <VStack gap={4} position="relative" zIndex={1}>
            <Text fontSize="4xl" mb={2}>
              💡✨🚀
            </Text>
            <Heading size="lg" color="blue.700" mb={2}>
              Got Your Own Creative App Idea?
            </Heading>
            <Text color="blue.600" fontSize="lg" maxW="lg" mx="auto">
              Share your concept for reimagining everyday tools and help inspire the next generation of creative apps
            </Text>
            <Badge
              colorScheme="blue"
              variant="solid"
              px={6}
              py={2}
              borderRadius="full"
              fontSize="sm"
              cursor="pointer"
              _hover={{ transform: "scale(1.05)" }}
              transition="transform 0.2s"
            >
              💭 Submit Your Idea Below
            </Badge>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
}
