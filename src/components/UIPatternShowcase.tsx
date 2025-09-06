"use client";

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
  Button,
  Flex,
  Circle,
  useDisclosure,
  IconButton,
  Spacer
} from "@chakra-ui/react";
import { useState } from "react";

interface UIPattern {
  title: string;
  description: string;
  type: string;
  component: React.ReactNode;
}

// Example Quest Component for the Quest-Based To-Do
function QuestComponent() {
  const [progress, setProgress] = useState(65);

  return (
    <Card.Root bg="purple.50" borderColor="purple.200" borderWidth="2px">
      <Card.Body p={4}>
        <VStack align="start" gap={3}>
          <HStack>
            <Text fontSize="xl">⚔️</Text>
            <Text fontWeight="bold" fontSize="sm">Defeat the Laundry Dragon</Text>
            <Badge colorScheme="purple" variant="subtle" size="sm">Epic Quest</Badge>
          </HStack>
          <Box w="full" bg="purple.100" borderRadius="full" h="8px">
            <Box
              bg="purple.500"
              h="full"
              borderRadius="full"
              w={`${progress}%`}
              transition="width 0.3s"
            />
          </Box>
          <HStack justify="space-between" w="full">
            <Text fontSize="xs" color="purple.600">{progress}% Complete</Text>
            <Text fontSize="xs" color="purple.600">+250 XP</Text>
          </HStack>
        </VStack>
      </Card.Body>
    </Card.Root>
  );
}

// Mood Weather Component
function MoodWeatherComponent() {
  const [mood, setMood] = useState("happy");

  const weatherMoods = {
    happy: { emoji: "☀️", bg: "yellow.100", text: "Sunny & Bright" },
    calm: { emoji: "🌤️", bg: "blue.100", text: "Partly Cloudy" },
    dramatic: { emoji: "⛈️", bg: "gray.200", text: "Thunderstorms" }
  };

  return (
    <Card.Root bg={weatherMoods[mood as keyof typeof weatherMoods].bg}>
      <Card.Body p={4} textAlign="center">
        <Text fontSize="4xl" mb={2}>{weatherMoods[mood as keyof typeof weatherMoods].emoji}</Text>
        <Text fontWeight="bold" fontSize="sm" mb={3}>
          {weatherMoods[mood as keyof typeof weatherMoods].text}
        </Text>
        <HStack gap={1} justify="center">
          {Object.keys(weatherMoods).map((m) => (
            <Button
              key={m}
              size="xs"
              variant={mood === m ? "solid" : "ghost"}
              onClick={() => setMood(m)}
            >
              {m}
            </Button>
          ))}
        </HStack>
      </Card.Body>
    </Card.Root>
  );
}

// Plant Personality Component
function PlantPersonalityComponent() {
  const { open, onToggle } = useDisclosure();

  return (
    <Card.Root bg="green.50" borderColor="green.200" borderWidth="2px">
      <Card.Body p={4}>
        <VStack align="start" gap={3}>
          <HStack justify="space-between" w="full">
            <HStack>
              <Text fontSize="xl">🌱</Text>
              <Text fontWeight="bold" fontSize="sm">Sunny the Succulent</Text>
            </HStack>
            <IconButton
              size="xs"
              variant="ghost"
              onClick={onToggle}
              aria-label="Toggle details"
            >
              {open ? "−" : "+"}
            </IconButton>
          </HStack>

          <Text fontSize="xs" color="green.600">
            "Feeling thirsty today! 💧"
          </Text>

          {open && (
            <VStack align="start" gap={2} pt={2}>
              <HStack>
                <Circle size="6px" bg="green.500" />
                <Text fontSize="xs">Watered 3 days ago</Text>
              </HStack>
              <HStack>
                <Circle size="6px" bg="yellow.500" />
                <Text fontSize="xs">Needs bright light</Text>
              </HStack>
              <Badge colorScheme="green" variant="outline" size="sm">
                Thriving
              </Badge>
            </VStack>
          )}
        </VStack>
      </Card.Body>
    </Card.Root>
  );
}

// Habit Constellation Component
function HabitConstellationComponent() {
  const [brightness, setBrightness] = useState(75);

  return (
    <Card.Root bg="gray.900" color="white">
      <Card.Body p={4} textAlign="center">
        <VStack gap={3}>
          <Text fontSize="lg" fontWeight="bold">Morning Routine</Text>
          <Box position="relative" h="60px" w="full">
            <Text
              fontSize="2xl"
              position="absolute"
              top="10px"
              left="20%"
              opacity={brightness / 100}
            >
              ⭐
            </Text>
            <Text
              fontSize="xl"
              position="absolute"
              top="5px"
              right="30%"
              opacity={brightness / 100}
            >
              ✨
            </Text>
            <Text
              fontSize="lg"
              position="absolute"
              bottom="10px"
              left="50%"
              opacity={brightness / 100}
            >
              ⭐
            </Text>
          </Box>
          <Text fontSize="xs" color="gray.300">
            {brightness}% Constellation Brightness
          </Text>
          <Button
            size="xs"
            colorScheme="yellow"
            variant="solid"
            onClick={() => setBrightness(Math.min(100, brightness + 10))}
          >
            Complete Habit ⭐
          </Button>
        </VStack>
      </Card.Body>
    </Card.Root>
  );
}

export function UIPatternShowcase() {
  const patterns: UIPattern[] = [
    {
      title: "Gamified Progress",
      description: "Turn mundane tasks into engaging quests with XP and progress bars",
      type: "Gamification",
      component: <QuestComponent />
    },
    {
      title: "Emotional Interface",
      description: "Use mood and emotion to drive visual changes and interactions",
      type: "Emotional Design",
      component: <MoodWeatherComponent />
    },
    {
      title: "Character Personalities",
      description: "Give objects personalities to create emotional connections",
      type: "Anthropomorphism",
      component: <PlantPersonalityComponent />
    },
    {
      title: "Spatial Metaphors",
      description: "Use space and visual metaphors to represent abstract concepts",
      type: "Spatial Design",
      component: <HabitConstellationComponent />
    }
  ];

  return (
    <Container maxW="container.xl" py={8}>
      <VStack gap={8} align="stretch">
        {/* Header */}
        <Box textAlign="center">
          <Heading size="xl" mb={4} color="purple.600">
            🎨 Interactive UI Patterns for Creative Apps
          </Heading>
          <Text fontSize="lg" color="gray.600" maxW="2xl" mx="auto">
            Explore interactive design patterns that make everyday apps more engaging and delightful
          </Text>
        </Box>

        {/* Patterns Grid */}
        <SimpleGrid columns={{ base: 1, md: 2 }} gap={8}>
          {patterns.map((pattern, index) => (
            <VStack key={index} align="stretch" gap={4}>
              <Box>
                <Flex align="center" gap={3} mb={2}>
                  <Heading size="md" color="gray.800">
                    {pattern.title}
                  </Heading>
                  <Badge colorScheme="purple" variant="outline" size="sm">
                    {pattern.type}
                  </Badge>
                </Flex>
                <Text fontSize="sm" color="gray.600" mb={4}>
                  {pattern.description}
                </Text>
              </Box>

              {/* Interactive Component */}
              <Box>
                {pattern.component}
              </Box>
            </VStack>
          ))}
        </SimpleGrid>

        {/* Bottom CTA */}
        <Box
          textAlign="center"
          bg="purple.50"
          borderRadius="xl"
          p={6}
          borderWidth="2px"
          borderColor="purple.200"
        >
          <Text fontSize="2xl" mb={2}>🚀</Text>
          <Heading size="md" color="purple.700" mb={2}>
            Ready to Build Something Amazing?
          </Heading>
          <Text color="purple.600" fontSize="sm">
            These patterns can inspire your next creative app idea
          </Text>
        </Box>
      </VStack>
    </Container>
  );
}
