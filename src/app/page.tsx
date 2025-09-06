import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Container,
  Card,
  SimpleGrid
} from "@chakra-ui/react";
import { VoterCard } from "@/components/VoterCard";

export default function Home() {
  return (
    <Container maxW="container.xl" py={8}>
      <VStack gap={8} align="stretch">
        <Box textAlign="center">
          <Heading size="2xl" mb={4}>
            Welcome to Voter Board
          </Heading>
          <Text fontSize="lg" color="gray.600">
            Built with Next.js and Chakra UI
          </Text>
        </Box>

        <Card.Root>
          <Card.Body>
            <VStack gap={4}>
              <Heading size="lg">Getting Started</Heading>
              <Text>
                Get started by editing <code>src/app/page.tsx</code>.
                Save and see your changes instantly.
              </Text>

              <HStack gap={4}>
                <Button colorScheme="blue" size="lg">
                  Deploy now
                </Button>
                <Button variant="outline" size="lg">
                  Read our docs
                </Button>
              </HStack>
            </VStack>
          </Card.Body>
        </Card.Root>

        <Box>
          <Heading size="lg" mb={4}>
            Sample Voter Board Components
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
            <VoterCard />
            <VoterCard />
            <VoterCard />
          </SimpleGrid>
        </Box>
      </VStack>
    </Container>
  );
}
